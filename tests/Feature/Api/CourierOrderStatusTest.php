<?php

use App\Events\CourierDeliveryQueueUpdated;
use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Support\Facades\Event;
use Laravel\Sanctum\Sanctum;

function createCourierWithLocation(float $latitude = 51.12852, float $longitude = 71.43021): User
{
    return User::factory()->courier()->create([
        'last_latitude' => $latitude,
        'last_longitude' => $longitude,
        'last_location_recorded_at' => now(),
    ]);
}

test('available orders include ready orders even if they have a previous courier', function () {
    $courier = createCourierWithLocation();
    $available = ServiceRequest::factory()->create([
        'courier_id' => null,
        'status' => 'new',
    ]);
    $ready = ServiceRequest::factory()->create([
        'courier_id' => null,
        'status' => 'ready',
    ]);
    $assignedReady = ServiceRequest::factory()->create([
        'courier_id' => $courier->id,
        'status' => 'ready',
    ]);
    ServiceRequest::factory()->create([
        'courier_id' => $courier->id,
        'status' => 'accepted',
    ]);
    ServiceRequest::factory()->create([
        'courier_id' => null,
        'status' => 'cancelled',
    ]);

    Sanctum::actingAs($courier);

    $this->getJson(route('api.courier.orders.available'))
        ->assertOk()
        ->assertJsonCount(3, 'data')
        ->assertJsonFragment(['id' => $available->id, 'status' => 'new'])
        ->assertJsonFragment(['id' => $ready->id, 'status' => 'ready'])
        ->assertJsonFragment(['id' => $assignedReady->id, 'status' => 'ready']);
});

test('claiming a ready order reassigns it and recalculates both courier queues', function () {
    $previousCourier = createCourierWithLocation();
    $newCourier = createCourierWithLocation(52.0, 72.0);
    $readyOrder = ServiceRequest::factory()->create([
        'courier_id' => $previousCourier->id,
        'status' => 'ready',
        'queue_position' => 0,
        'latitude' => 51.12,
        'longitude' => 71.42,
    ]);
    $previousNextOrder = ServiceRequest::factory()->create([
        'courier_id' => $previousCourier->id,
        'status' => 'accepted',
        'queue_position' => 1,
        'latitude' => 51.11,
        'longitude' => 71.41,
    ]);
    Event::fake([CourierDeliveryQueueUpdated::class]);

    Sanctum::actingAs($newCourier);

    $this->postJson(route('api.courier.orders.accept', $readyOrder))
        ->assertOk()
        ->assertJsonPath('data.status', 'delivery')
        ->assertJsonPath('data.is_current', true)
        ->assertJsonPath('data.queue_position', 0);

    expect($readyOrder->fresh()->courier_id)->toBe($newCourier->id)
        ->and($previousNextOrder->fresh()->queue_position)->toBe(0);
    Event::assertDispatched(CourierDeliveryQueueUpdated::class, 2);
});

test('admin can use the mobile order workflow but is not treated as a courier for gps', function () {
    $admin = User::factory()->admin()->create();
    $order = ServiceRequest::factory()->create([
        'courier_id' => null,
        'status' => 'new',
        'latitude' => 51.12800,
        'longitude' => 71.43000,
    ]);

    Sanctum::actingAs($admin);

    $this->getJson(route('api.courier.orders.available'))
        ->assertOk()
        ->assertJsonPath('data.0.id', $order->id);

    $this->postJson(route('api.courier.orders.accept', $order))
        ->assertOk()
        ->assertJsonPath('data.status', 'accepted');

    expect($order->fresh()->courier_id)->toBe($admin->id);

    $this->getJson(route('api.courier.orders.today'))
        ->assertOk()
        ->assertJsonPath('data.0.id', $order->id);

    $this->patchJson(route('api.courier.orders.update-status', $order), ['status' => 'in_progress'])
        ->assertOk()
        ->assertJsonPath('data.status', 'in_progress');

    $this->patchJson(route('api.admin.orders.ready', $order))
        ->assertOk()
        ->assertJsonPath('data.status', 'ready')
        ->assertJsonPath('data.courier', null);

    expect($order->fresh()->courier_id)->toBeNull();

    $this->postJson(route('api.courier.location.store'), [
        'latitude' => 51.12852,
        'longitude' => 71.43021,
    ])->assertForbidden();
});

test('admin can see all orders and the assigned courier', function () {
    $admin = User::factory()->admin()->create();
    $courier = User::factory()->courier()->create([
        'name' => 'Назначенный курьер',
        'phone' => '+77001112233',
    ]);
    $assignedOrder = ServiceRequest::factory()->create([
        'courier_id' => $courier->id,
        'status' => 'accepted',
    ]);
    $unassignedOrder = ServiceRequest::factory()->create([
        'courier_id' => null,
        'status' => 'new',
    ]);

    Sanctum::actingAs($admin);

    $this->getJson(route('api.admin.orders.index'))
        ->assertOk()
        ->assertJsonCount(2, 'data')
        ->assertJsonFragment([
            'id' => $assignedOrder->id,
            'courier' => [
                'id' => $courier->id,
                'name' => 'Назначенный курьер',
                'phone' => '+77001112233',
            ],
        ])
        ->assertJsonFragment([
            'id' => $unassignedOrder->id,
            'courier' => null,
        ]);
});

test('courier cannot access the admin all-orders endpoint', function () {
    Sanctum::actingAs(User::factory()->courier()->create());

    $this->getJson(route('api.admin.orders.index'))->assertForbidden();
});

test('admin can mark an order from washing as ready for delivery', function () {
    $admin = User::factory()->admin()->create();
    $courier = createCourierWithLocation();
    $order = ServiceRequest::factory()->create([
        'courier_id' => $courier->id,
        'status' => 'in_progress',
        'washing_started_at' => now(),
        'queue_position' => 0,
    ]);
    $nextOrder = ServiceRequest::factory()->create([
        'courier_id' => $courier->id,
        'status' => 'accepted',
        'queue_position' => 1,
    ]);
    Event::fake([CourierDeliveryQueueUpdated::class]);

    Sanctum::actingAs($admin);

    $this->patchJson(route('api.admin.orders.ready', $order))
        ->assertOk()
        ->assertJsonPath('data.status', 'ready')
        ->assertJsonPath('data.courier', null);

    expect($order->fresh()->status)->toBe('ready')
        ->and($order->fresh()->courier_id)->toBeNull()
        ->and($order->fresh()->washing_started_at)->toBeNull();
    expect($nextOrder->fresh()->queue_position)->toBe(0);
    Event::assertDispatched(CourierDeliveryQueueUpdated::class);
});

test('admin cannot mark an order outside washing as ready', function () {
    $admin = User::factory()->admin()->create();
    $order = ServiceRequest::factory()->create(['status' => 'accepted']);

    Sanctum::actingAs($admin);

    $this->patchJson(route('api.admin.orders.ready', $order))->assertUnprocessable();
    expect($order->fresh()->status)->toBe('accepted');
});

test('courier cannot mark an order ready through the admin endpoint', function () {
    $courier = User::factory()->courier()->create();
    $order = ServiceRequest::factory()->create([
        'courier_id' => $courier->id,
        'status' => 'in_progress',
    ]);

    Sanctum::actingAs($courier);

    $this->patchJson(route('api.admin.orders.ready', $order))->assertForbidden();
    expect($order->fresh()->status)->toBe('in_progress');
});

test('admin can send a ready order back to washing and restore the courier queue', function () {
    $admin = User::factory()->admin()->create();
    $order = ServiceRequest::factory()->create([
        'courier_id' => null,
        'status' => 'ready',
        'queue_position' => null,
    ]);

    Sanctum::actingAs($admin);

    $this->patchJson(route('api.admin.orders.rewash', $order))
        ->assertOk()
        ->assertJsonPath('data.status', 'in_progress')
        ->assertJsonPath('data.courier', null);

    expect($order->fresh()->status)->toBe('in_progress')
        ->and($order->fresh()->washing_started_at)->not->toBeNull()
        ->and($order->fresh()->courier_id)->toBeNull();
});

test('admin cannot send an order outside ready back to washing', function () {
    $admin = User::factory()->admin()->create();
    $order = ServiceRequest::factory()->create(['status' => 'accepted']);

    Sanctum::actingAs($admin);

    $this->patchJson(route('api.admin.orders.rewash', $order))->assertUnprocessable();
    expect($order->fresh()->status)->toBe('accepted');
});

test('courier cannot use the admin rewash endpoint', function () {
    $courier = User::factory()->courier()->create();
    $order = ServiceRequest::factory()->create([
        'courier_id' => $courier->id,
        'status' => 'ready',
    ]);

    Sanctum::actingAs($courier);

    $this->patchJson(route('api.admin.orders.rewash', $order))->assertForbidden();
    expect($order->fresh()->status)->toBe('ready');
});

test('the first courier to accept an available order wins and the order moves into their today queue', function () {
    $firstCourier = createCourierWithLocation();
    $secondCourier = createCourierWithLocation(52.0, 72.0);
    $order = ServiceRequest::factory()->create([
        'courier_id' => null,
        'status' => 'new',
        'latitude' => 51.12,
        'longitude' => 71.42,
    ]);

    Sanctum::actingAs($firstCourier);

    $this->postJson(route('api.courier.orders.accept', $order))
        ->assertOk()
        ->assertJsonPath('data.id', $order->id)
        ->assertJsonPath('data.status', 'accepted');

    expect($order->fresh()->courier_id)->toBe($firstCourier->id);

    Sanctum::actingAs($secondCourier);

    $this->getJson(route('api.courier.orders.available'))
        ->assertOk()
        ->assertJsonCount(0, 'data');

    $this->postJson(route('api.courier.orders.accept', $order))
        ->assertStatus(409)
        ->assertJsonPath('message', 'Заявка уже забрана другим курьером или недоступна.');

    Sanctum::actingAs($firstCourier);

    $this->getJson(route('api.courier.orders.today'))
        ->assertOk()
        ->assertJsonPath('data.0.id', $order->id);
});

test('a non-courier cannot access the shared available orders feed', function () {
    $operator = User::factory()->operator()->create();

    Sanctum::actingAs($operator);

    $this->getJson(route('api.courier.orders.available'))->assertForbidden();
});

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

test('courier sending an order to washing is unassigned and frees their queue', function () {
    $courier = createCourierWithLocation();
    $order = ServiceRequest::factory()->create([
        'courier_id' => $courier->id,
        'status' => 'accepted',
        'queue_position' => 0,
        'latitude' => 51.12800,
        'longitude' => 71.43000,
    ]);
    $nextOrder = ServiceRequest::factory()->create([
        'courier_id' => $courier->id,
        'status' => 'accepted',
        'queue_position' => 1,
        'latitude' => 51.11231,
        'longitude' => 71.41125,
    ]);
    Event::fake([CourierDeliveryQueueUpdated::class]);

    Sanctum::actingAs($courier);

    $this->patchJson(route('api.courier.orders.update-status', $order), ['status' => 'in_progress'])
        ->assertOk()
        ->assertJsonPath('data.status', 'in_progress')
        ->assertJsonPath('data.is_current', false)
        ->assertJsonPath('data.courier_id', null);

    expect($order->fresh()->courier_id)->toBeNull()
        ->and($order->fresh()->queue_position)->toBeNull()
        ->and($order->fresh()->washing_started_at)->not->toBeNull()
        ->and($nextOrder->fresh()->queue_position)->toBe(0);
    Event::assertDispatched(CourierDeliveryQueueUpdated::class);
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

test('courier can claim a ready warehouse order for customer delivery', function () {
    $courier = createCourierWithLocation();
    $order = ServiceRequest::factory()->create([
        'courier_id' => null,
        'status' => 'ready',
        'latitude' => 51.12800,
        'longitude' => 71.43000,
    ]);

    Sanctum::actingAs($courier);

    $this->postJson(route('api.courier.orders.accept', $order))
        ->assertOk()
        ->assertJsonPath('data.status', 'delivery')
        ->assertJsonPath('data.is_current', true)
        ->assertJsonPath('data.queue_position', 0);

    expect($order->fresh()->courier_id)->toBe($courier->id);
});

test('courier completes warehouse delivery and the next queued order moves first', function () {
    $courier = createCourierWithLocation();

    $current = ServiceRequest::factory()->create([
        'courier_id' => $courier->id,
        'status' => 'delivery',
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

    $this->patchJson(route('api.courier.orders.update-status', $current), ['status' => 'completed'])
        ->assertOk()
        ->assertJsonPath('data.status', 'completed');

    expect($current->fresh()->status)->toBe('completed')
        ->and($current->fresh()->queue_position)->toBeNull()
        ->and($next->fresh()->queue_position)->toBe(0);
});

test('courier cannot complete an order before it leaves washing', function () {
    $courier = createCourierWithLocation();
    $order = ServiceRequest::factory()->create([
        'courier_id' => $courier->id,
        'status' => 'in_progress',
    ]);

    Sanctum::actingAs($courier);

    $this->patchJson(route('api.courier.orders.update-status', $order), ['status' => 'completed'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['status']);

    expect($order->fresh()->status)->toBe('in_progress');
});
