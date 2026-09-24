<?php

use App\Models\ServiceRequest;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

function createCourierWithLocation(float $latitude = 51.12852, float $longitude = 71.43021): User
{
    return User::factory()->courier()->create([
        'last_latitude' => $latitude,
        'last_longitude' => $longitude,
        'last_location_recorded_at' => now(),
    ]);
}

test('courier orders today returns the persisted queue with distance and current flags', function () {
    $courier = createCourierWithLocation();

    $current = ServiceRequest::factory()->create([
        'courier_id' => $courier->id,
        'status' => 'in_progress',
        'queue_position' => 0,
        'latitude' => 51.12800,
        'longitude' => 71.43000,
        'address' => 'Astana, Kabanbai Batyr 42',
    ]);
    $next = ServiceRequest::factory()->create([
        'courier_id' => $courier->id,
        'status' => 'accepted',
        'queue_position' => 1,
        'latitude' => 51.11231,
        'longitude' => 71.41125,
        'address' => 'Astana, Syganak 18',
    ]);

    Sanctum::actingAs($courier);

    $response = $this->getJson(route('api.courier.orders.today'));

    $response->assertOk()->assertJsonCount(2, 'data');
    $response->assertJsonPath('data.0.id', $current->id);
    $response->assertJsonPath('data.0.is_current', true);
    $response->assertJsonPath('data.0.queue_position', 0);
    $response->assertJsonPath('data.1.id', $next->id);
    $response->assertJsonPath('data.1.is_current', false);
    $response->assertJsonPath('data.1.queue_position', 1);
    expect($response->json('data.0.distance_meters'))->toBeInt();
});

test('courier can accept an assigned order and then start it, making it current', function () {
    $courier = createCourierWithLocation();
    $order = ServiceRequest::factory()->create([
        'courier_id' => $courier->id,
        'status' => 'assigned',
        'latitude' => 51.12800,
        'longitude' => 71.43000,
    ]);

    Sanctum::actingAs($courier);

    $this->patchJson(route('api.courier.orders.update-status', $order), ['status' => 'accepted'])
        ->assertOk()
        ->assertJsonPath('data.status', 'accepted');

    $this->patchJson(route('api.courier.orders.update-status', $order), ['status' => 'in_progress'])
        ->assertOk()
        ->assertJsonPath('data.status', 'in_progress')
        ->assertJsonPath('data.is_current', true)
        ->assertJsonPath('data.queue_position', 0);
});

test('a courier cannot change the status of another couriers order', function () {
    $owner = createCourierWithLocation();
    $intruder = createCourierWithLocation(52.0, 72.0);
    $order = ServiceRequest::factory()->create([
        'courier_id' => $owner->id,
        'status' => 'assigned',
    ]);

    Sanctum::actingAs($intruder);

    $this->patchJson(route('api.courier.orders.update-status', $order), ['status' => 'accepted'])
        ->assertForbidden();

    expect($order->fresh()->status)->toBe('assigned');
});

test('skipping a step in the delivery workflow is rejected', function () {
    $courier = createCourierWithLocation();
    $order = ServiceRequest::factory()->create([
        'courier_id' => $courier->id,
        'status' => 'assigned',
    ]);

    Sanctum::actingAs($courier);

    $this->patchJson(route('api.courier.orders.update-status', $order), ['status' => 'delivered'])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['status']);

    expect($order->fresh()->status)->toBe('assigned');
});

test('delivering the current order automatically promotes the next queued order to first', function () {
    $courier = createCourierWithLocation();

    $current = ServiceRequest::factory()->create([
        'courier_id' => $courier->id,
        'status' => 'in_progress',
        'queue_position' => 0,
        'latitude' => 51.12800,
        'longitude' => 71.43000,
    ]);
    $next = ServiceRequest::factory()->create([
        'courier_id' => $courier->id,
        'status' => 'accepted',
        'queue_position' => 1,
        'latitude' => 51.11231,
        'longitude' => 71.41125,
    ]);

    Sanctum::actingAs($courier);

    $this->patchJson(route('api.courier.orders.update-status', $current), ['status' => 'delivered'])
        ->assertOk();

    expect($current->fresh()->status)->toBe('delivered')
        ->and($next->fresh()->queue_position)->toBe(0);
});
