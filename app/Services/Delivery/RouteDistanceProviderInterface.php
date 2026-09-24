<?php

namespace App\Services\Delivery;

interface RouteDistanceProviderInterface
{
    /**
     * Calculate the distance between two coordinates, in meters.
     *
     * Implementations may use a straight-line calculation (e.g. Haversine)
     * or a real routing provider (e.g. 2GIS) without changing call sites.
     */
    public function distanceInMeters(float $fromLatitude, float $fromLongitude, float $toLatitude, float $toLongitude): float;
}
