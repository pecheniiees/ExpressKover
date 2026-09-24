<?php

namespace App\Services\Delivery;

class HaversineDistanceProvider implements RouteDistanceProviderInterface
{
    /**
     * Mean Earth radius in meters.
     */
    private const EARTH_RADIUS_METERS = 6371000.0;

    /**
     * Calculate the great-circle distance between two coordinates using the
     * Haversine formula. This is a fast, dependency-free approximation
     * suitable for ranking nearby orders/couriers without calling an
     * external routing API.
     */
    public function distanceInMeters(float $fromLatitude, float $fromLongitude, float $toLatitude, float $toLongitude): float
    {
        $fromLatitudeRadians = deg2rad($fromLatitude);
        $toLatitudeRadians = deg2rad($toLatitude);
        $latitudeDelta = deg2rad($toLatitude - $fromLatitude);
        $longitudeDelta = deg2rad($toLongitude - $fromLongitude);

        $a = sin($latitudeDelta / 2) ** 2
            + cos($fromLatitudeRadians) * cos($toLatitudeRadians) * sin($longitudeDelta / 2) ** 2;

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return self::EARTH_RADIUS_METERS * $c;
    }
}
