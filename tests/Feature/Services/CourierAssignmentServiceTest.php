<?php

use App\Models\ServiceRequest;
use App\Models\User;
use App\Services\Delivery\CourierAssignmentService;

test('the nearest courier to a new order is suggested first', function () {
    $order = ServiceRequest::factory()->create(['latitude' => 51.12852, 'longitude' => 71.43021]);

    $near = User::factory()->courier()->create(['last_latitude' => 51.12000, 'last_longitude' => 71.42500]);
    $far = User::factory()->courier()->create(['last_latitude' => 52.00000, 'last_longitude' => 72.00000]);

    $suggestions = app(CourierAssignmentService::class)->findNearestCouriers($order);

    expect($suggestions->first()['courier']->id)->toBe($near->id)
        ->and($suggestions->last()['courier']->id)->toBe($far->id);
});

test('couriers without a known gps position are not suggested', function () {
    $order = ServiceRequest::factory()->create(['latitude' => 51.12852, 'longitude' => 71.43021]);

    $withLocation = User::factory()->courier()->create(['last_latitude' => 51.12000, 'last_longitude' => 71.42500]);
    User::factory()->courier()->create(['last_latitude' => null, 'last_longitude' => null]);

    $suggestions = app(CourierAssignmentService::class)->findNearestCouriers($order);

    expect($suggestions)->toHaveCount(1)
        ->and($suggestions->first()['courier']->id)->toBe($withLocation->id);
});

test('no couriers are suggested when the order has no coordinates', function () {
    $order = ServiceRequest::factory()->create(['latitude' => null, 'longitude' => null]);

    User::factory()->courier()->create(['last_latitude' => 51.12000, 'last_longitude' => 71.42500]);

    $suggestions = app(CourierAssignmentService::class)->findNearestCouriers($order);

    expect($suggestions->isEmpty())->toBeTrue();
});
