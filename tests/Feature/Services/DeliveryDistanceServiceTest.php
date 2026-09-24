<?php

use App\Models\ServiceRequest;
use App\Models\User;
use App\Services\Delivery\DeliveryDistanceService;

test('haversine distance between courier and order is calculated in meters', function () {
    $distanceService = app(DeliveryDistanceService::class);

    $distance = $distanceService->distanceInMeters(51.12852, 71.43021, 51.12000, 71.42500);

    expect($distance)->toBeGreaterThan(900.0)->toBeLessThan(1100.0);
});

test('distance is null when the courier has no known gps position', function () {
    $courier = User::factory()->courier()->create();
    $order = ServiceRequest::factory()->create(['latitude' => 51.1, 'longitude' => 71.1]);

    $distance = app(DeliveryDistanceService::class)->distanceBetweenCourierAndOrder($courier, $order);

    expect($distance)->toBeNull();
});

test('distance is null when the order has no known coordinates', function () {
    $courier = User::factory()->courier()->create(['last_latitude' => 51.1, 'last_longitude' => 71.1]);
    $order = ServiceRequest::factory()->create(['latitude' => null, 'longitude' => null]);

    $distance = app(DeliveryDistanceService::class)->distanceBetweenCourierAndOrder($courier, $order);

    expect($distance)->toBeNull();
});
