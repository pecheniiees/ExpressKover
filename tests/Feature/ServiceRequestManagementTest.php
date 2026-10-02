<?php

use App\Models\Discount;
use App\Models\ServiceRequest;
use App\Models\Tariff;
use App\Models\User;
use App\UserRole;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    $this->tariff = Tariff::create([
        'name' => 'Стандарт',
        'price_per_square_meter' => 800,
        'description' => 'Тестовый тариф',
    ]);
});

test('guests are redirected from service requests', function () {
    $response = $this->get(route('service-requests.index'));

    $response->assertRedirect(route('login'));
});

test('couriers and washers cannot view service requests', function (UserRole $role) {
    $user = User::factory()->create(['role' => $role]);

    $response = $this->actingAs($user)->get(route('service-requests.index'));

    $response->assertForbidden();
})->with([
    'courier' => UserRole::Courier,
    'washer' => UserRole::Washer,
]);

test('operators and admins can view service requests', function (UserRole $role) {
    $user = User::factory()->create(['role' => $role]);

    $response = $this->actingAs($user)->get(route('service-requests.index'));

    $response->assertOk();
})->with([
    'operator' => UserRole::Operator,
    'admin' => UserRole::Admin,
]);

test('operators can create service requests', function () {
    $operator = User::factory()->operator()->create();

    $response = $this->actingAs($operator)->post(route('service-requests.store'), [
        'client_name' => 'Алия',
        'phone' => '700 088 06 89',
        'address' => 'Абая 10',
        'area_square_meters' => 3,
        'carpet_count' => 2,
        'tariff_id' => $this->tariff->id,
        'comment' => 'Почистить ковёр',
        'status' => 'new',
    ]);

    $response->assertRedirect(route('service-requests.index'));
    $this->assertDatabaseHas('service_requests', [
        'client_name' => 'Алия',
        'client_phone' => '+77000880689',
        'address' => 'Абая 10',
        'comment' => 'Почистить ковёр',
        'status' => 'new',
        'created_by' => $operator->id,
        'total_amount' => 6000,
    ]);
});

test('admins can create service requests', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post(route('service-requests.store'), [
        'client_name' => 'Руслан',
        'phone' => '701 111 22 33',
        'address' => 'Сейфуллина 25',
        'area_square_meters' => 19,
        'carpet_count' => 4,
        'tariff_id' => $this->tariff->id,
        'status' => 'in_progress',
    ]);

    $response->assertRedirect(route('service-requests.index'));
    $this->assertDatabaseHas('service_requests', [
        'client_name' => 'Руслан',
        'client_phone' => '+77011112233',
        'status' => 'in_progress',
        'created_by' => $admin->id,
    ]);
});

test('service request creation validates required fields', function () {
    $operator = User::factory()->operator()->create();

    $response = $this->actingAs($operator)->post(route('service-requests.store'), []);

    $response->assertSessionHasErrors(['client_name', 'phone', 'address', 'status', 'carpet_count']);
});

test('operators can update service request status', function () {
    $operator = User::factory()->operator()->create();
    $serviceRequest = ServiceRequest::factory()->create([
        'created_by' => $operator->id,
        'total_amount' => 6000,
        'status' => 'new',
    ]);

    $response = $this->actingAs($operator)->patch(route('service-requests.update', $serviceRequest), [
        'client_name' => $serviceRequest->client_name,
        'phone' => $serviceRequest->client_phone,
        'address' => $serviceRequest->address,
        'status' => 'in_progress',
    ]);

    $response->assertRedirect(route('service-requests.index'));
    expect($serviceRequest->fresh())
        ->status->toBe('in_progress')
        ->courier_id->toBeNull();
});

test('operators can edit service request carpet details and recalculate the amount', function () {
    $operator = User::factory()->operator()->create();
    $discount = Discount::query()->create([
        'name' => 'Скидка',
        'percentage' => 10,
    ]);
    $serviceRequest = ServiceRequest::factory()->create([
        'tariff_id' => $this->tariff->id,
        'area_square_meters' => 8,
        'carpet_count' => 1,
        'total_amount' => 6400,
    ]);

    $response = $this->actingAs($operator)->patch(route('service-requests.update', $serviceRequest), [
        'client_name' => $serviceRequest->client_name,
        'phone' => $serviceRequest->client_phone,
        'address' => $serviceRequest->address,
        'status' => $serviceRequest->status,
        'carpet_count' => 3,
        'area_square_meters' => 12.5,
        'tariff_id' => $this->tariff->id,
        'discount_id' => $discount->id,
        'comment' => 'Обновлённый комментарий',
    ]);

    $response->assertRedirect(route('service-requests.index'));
    expect($serviceRequest->fresh())
        ->carpet_count->toBe(3)
        ->and((float) $serviceRequest->fresh()->area_square_meters)->toBe(12.5)
        ->and($serviceRequest->fresh()->discount_id)->toBe($discount->id)
        ->and($serviceRequest->fresh()->comment)->toBe('Обновлённый комментарий')
        ->and((float) $serviceRequest->fresh()->total_amount)->toBe(9000.0);
});

test('marking a washing order ready releases its courier and recalculates the queue', function () {
    $operator = User::factory()->operator()->create();
    $courier = User::factory()->courier()->create([
        'last_latitude' => 51.12852,
        'last_longitude' => 71.43021,
    ]);
    $serviceRequest = ServiceRequest::factory()->create([
        'courier_id' => $courier->id,
        'queue_position' => 0,
        'status' => 'in_progress',
        'washing_started_at' => now(),
    ]);
    $nextOrder = ServiceRequest::factory()->create([
        'courier_id' => $courier->id,
        'queue_position' => 1,
        'status' => 'accepted',
        'latitude' => 51.12000,
        'longitude' => 71.42500,
    ]);

    $response = $this->actingAs($operator)->patch(route('service-requests.update', $serviceRequest), [
        'client_name' => $serviceRequest->client_name,
        'phone' => $serviceRequest->client_phone,
        'address' => $serviceRequest->address,
        'status' => 'ready',
    ]);

    $response->assertRedirect(route('service-requests.index'));
    expect($serviceRequest->fresh())
        ->status->toBe('ready')
        ->courier_id->toBeNull()
        ->queue_position->toBeNull()
        ->washing_started_at->toBeNull();
    expect($nextOrder->fresh()->queue_position)->toBe(0);
});

test('assigning a courier through the update endpoint recalculates that couriers queue', function () {
    $operator = User::factory()->operator()->create();
    $courier = User::factory()->courier()->create([
        'last_latitude' => 51.12852,
        'last_longitude' => 71.43021,
    ]);
    $serviceRequest = ServiceRequest::factory()->create([
        'created_by' => $operator->id,
        'status' => 'assigned',
        'latitude' => 51.12000,
        'longitude' => 71.42500,
    ]);

    $response = $this->actingAs($operator)->patch(route('service-requests.update', $serviceRequest), [
        'client_name' => $serviceRequest->client_name,
        'phone' => $serviceRequest->client_phone,
        'address' => $serviceRequest->address,
        'status' => 'assigned',
        'courier_id' => $courier->id,
    ]);

    $response->assertRedirect(route('service-requests.index'));
    expect($serviceRequest->fresh())
        ->courier_id->toBe($courier->id)
        ->queue_position->toBe(0);
});

test('creating a service request without coordinates auto-geocodes the address', function () {
    Http::fake([
        'nominatim.openstreetmap.org/*' => Http::response([
            ['lat' => '51.128520', 'lon' => '71.430210'],
        ]),
    ]);

    $operator = User::factory()->operator()->create();

    $this->actingAs($operator)->post(route('service-requests.store'), [
        'client_name' => 'Алия',
        'phone' => '700 088 06 89',
        'address' => 'Бейбитшилик 49/1',
        'area_square_meters' => 10,
        'carpet_count' => 1,
        'tariff_id' => $this->tariff->id,
        'status' => 'new',
    ]);

    $serviceRequest = ServiceRequest::query()->where('address', 'Бейбитшилик 49/1')->sole();

    expect((float) $serviceRequest->latitude)->toBe(51.128520)
        ->and((float) $serviceRequest->longitude)->toBe(71.430210);
});

test('geocoding failure does not prevent the service request from being created', function () {
    Http::fake([
        'nominatim.openstreetmap.org/*' => Http::response([], 503),
    ]);

    $operator = User::factory()->operator()->create();

    $response = $this->actingAs($operator)->post(route('service-requests.store'), [
        'client_name' => 'Алия',
        'phone' => '700 088 06 89',
        'address' => 'Неизвестный адрес',
        'area_square_meters' => 10,
        'carpet_count' => 1,
        'tariff_id' => $this->tariff->id,
        'status' => 'new',
    ]);

    $response->assertRedirect(route('service-requests.index'));
    $serviceRequest = ServiceRequest::query()->where('address', 'Неизвестный адрес')->sole();
    expect($serviceRequest->latitude)->toBeNull();
});

test('updating a service request without changing the address does not re-geocode', function () {
    $serviceRequest = ServiceRequest::factory()->create([
        'address' => 'Абая 10',
        'latitude' => 51.1,
        'longitude' => 71.4,
    ]);
    $operator = User::factory()->operator()->create();

    Http::fake();

    $this->actingAs($operator)->patch(route('service-requests.update', $serviceRequest), [
        'client_name' => $serviceRequest->client_name,
        'phone' => $serviceRequest->client_phone,
        'address' => 'Абая 10',
        'status' => 'in_progress',
    ]);

    Http::assertNothingSent();
    expect((float) $serviceRequest->fresh()->latitude)->toBe(51.1);
});

test('changing the address on update re-geocodes the new address', function () {
    $serviceRequest = ServiceRequest::factory()->create([
        'address' => 'Абая 10',
        'latitude' => 51.1,
        'longitude' => 71.4,
    ]);
    $operator = User::factory()->operator()->create();

    Http::fake([
        'nominatim.openstreetmap.org/*' => Http::response([
            ['lat' => '51.200000', 'lon' => '71.500000'],
        ]),
    ]);

    $this->actingAs($operator)->patch(route('service-requests.update', $serviceRequest), [
        'client_name' => $serviceRequest->client_name,
        'phone' => $serviceRequest->client_phone,
        'address' => 'Кабанбай батыра 42',
        'status' => 'in_progress',
    ]);

    expect((float) $serviceRequest->fresh()->latitude)->toBe(51.2)
        ->and((float) $serviceRequest->fresh()->longitude)->toBe(71.5);
});

test('operators cannot delete service requests', function () {
    $operator = User::factory()->operator()->create();
    $serviceRequest = ServiceRequest::factory()->create();

    $response = $this->actingAs($operator)->delete(route('service-requests.destroy', $serviceRequest));

    $response->assertForbidden();
    expect($serviceRequest->fresh())->not->toBeNull();
});

test('admins can delete service requests', function () {
    $admin = User::factory()->admin()->create();
    $serviceRequest = ServiceRequest::factory()->create();

    $response = $this->actingAs($admin)->delete(route('service-requests.destroy', $serviceRequest));

    $response->assertRedirect(route('service-requests.index'));
    expect($serviceRequest->fresh())->toBeNull();
});
