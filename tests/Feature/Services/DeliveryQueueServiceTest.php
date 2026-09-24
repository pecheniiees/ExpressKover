<?php

use App\Models\ServiceRequest;
use App\Models\User;
use App\Services\Delivery\DeliveryQueueService;

beforeEach(function () {
    $this->courier = User::factory()->courier()->create([
        'last_latitude' => 51.12852,
        'last_longitude' => 71.43021,
    ]);
    $this->queueService = app(DeliveryQueueService::class);
});

test('the nearest pending order becomes first in the queue', function () {
    $far = ServiceRequest::factory()->create([
        'courier_id' => $this->courier->id,
        'status' => 'assigned',
        'latitude' => 52.00000,
        'longitude' => 72.00000,
    ]);
    $near = ServiceRequest::factory()->create([
        'courier_id' => $this->courier->id,
        'status' => 'assigned',
        'latitude' => 51.12000,
        'longitude' => 71.42500,
    ]);

    $this->queueService->recalculateForCourier($this->courier);

    expect($near->fresh()->queue_position)->toBe(0)
        ->and($far->fresh()->queue_position)->toBe(1);
});

test('the current in_progress order is never displaced by a closer new order', function () {
    $current = ServiceRequest::factory()->create([
        'courier_id' => $this->courier->id,
        'status' => 'in_progress',
        'queue_position' => 0,
        'latitude' => 60.00000,
        'longitude' => 80.00000,
    ]);
    $closer = ServiceRequest::factory()->create([
        'courier_id' => $this->courier->id,
        'status' => 'assigned',
        'latitude' => 51.12800,
        'longitude' => 71.43000,
    ]);

    $this->queueService->recalculateForCourier($this->courier);

    expect($current->fresh()->queue_position)->toBe(0)
        ->and($closer->fresh()->queue_position)->toBe(1);
});

test('delivered and cancelled orders are excluded from the recalculated queue', function () {
    $active = ServiceRequest::factory()->create([
        'courier_id' => $this->courier->id,
        'status' => 'assigned',
        'latitude' => 51.12000,
        'longitude' => 71.42500,
    ]);
    $delivered = ServiceRequest::factory()->create([
        'courier_id' => $this->courier->id,
        'status' => 'delivered',
    ]);
    $cancelled = ServiceRequest::factory()->create([
        'courier_id' => $this->courier->id,
        'status' => 'cancelled',
    ]);

    $result = $this->queueService->recalculateForCourier($this->courier);

    expect($result->pluck('id')->all())->toBe([$active->id])
        ->and($delivered->fresh()->queue_position)->toBeNull()
        ->and($cancelled->fresh()->queue_position)->toBeNull();
});

test('ordersForCourier reads the persisted queue order without recalculating', function () {
    $first = ServiceRequest::factory()->create([
        'courier_id' => $this->courier->id,
        'status' => 'assigned',
        'queue_position' => 0,
        'latitude' => 60.00000,
        'longitude' => 80.00000,
    ]);
    $second = ServiceRequest::factory()->create([
        'courier_id' => $this->courier->id,
        'status' => 'assigned',
        'queue_position' => 1,
        'latitude' => 51.12000,
        'longitude' => 71.42500,
    ]);

    $orders = $this->queueService->ordersForCourier($this->courier);

    expect($orders->pluck('id')->all())->toBe([$first->id, $second->id]);
});
