<?php

namespace App\Services\Geocoding;

/**
 * Coordinates resolved from a free-form address by a GeocodingProviderInterface.
 */
final readonly class GeocodedCoordinates
{
    public function __construct(
        public float $latitude,
        public float $longitude,
    ) {}
}
