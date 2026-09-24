<?php

namespace App\Services\Delivery;

use App\Models\ServiceRequest;
use App\Models\User;

/**
 * Computes distances between couriers and orders using the bound
 * RouteDistanceProviderInterface implementation (Haversine by default).
 *
 * Swapping the bound implementation (e.g. for a future 2GIS routing
 * provider) does not require any changes to this service or its callers.
 */
class DeliveryDistanceService
{
    public function __construct(
        private readonly RouteDistanceProviderInterface $distanceProvider,
    ) {}

    public function distanceInMeters(float $fromLatitude, float $fromLongitude, float $toLatitude, float $toLongitude): float
    {
        return $this->distanceProvider->distanceInMeters($fromLatitude, $fromLongitude, $toLatitude, $toLongitude);
    }

    /**
     * Distance between a courier's last known GPS position and an order's
     * coordinates. Returns null when either position is unknown.
     */
    public function distanceBetweenCourierAndOrder(User $courier, ServiceRequest $order): ?float
    {
        if (! $courier->hasKnownLocation() || ! $order->hasKnownLocation()) {
            return null;
        }

        return $this->distanceInMeters(
            (float) $courier->last_latitude,
            (float) $courier->last_longitude,
            (float) $order->latitude,
            (float) $order->longitude,
        );
    }
}
