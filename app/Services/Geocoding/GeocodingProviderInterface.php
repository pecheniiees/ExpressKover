<?php

namespace App\Services\Geocoding;

interface GeocodingProviderInterface
{
    /**
     * Resolve a free-form address into coordinates. Returns null when the
     * address cannot be resolved (e.g. no match, or the provider is
     * unavailable) so callers can save the record without coordinates
     * rather than failing the whole request.
     */
    public function geocode(string $address): ?GeocodedCoordinates;
}
