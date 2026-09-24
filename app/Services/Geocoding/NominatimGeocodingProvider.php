<?php

namespace App\Services\Geocoding;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Default geocoding provider using the free OpenStreetMap Nominatim API
 * (no API key required). Swapping in a paid, higher-accuracy provider
 * (e.g. 2GIS, Yandex) later only requires binding a different
 * GeocodingProviderInterface implementation in AppServiceProvider.
 */
class NominatimGeocodingProvider implements GeocodingProviderInterface
{
    public function geocode(string $address): ?GeocodedCoordinates
    {
        try {
            $response = Http::withHeaders([
                'User-Agent' => config('app.name').' Geocoder ('.config('app.url').')',
            ])
                ->timeout(5)
                ->get(config('services.geocoding.nominatim.base_url').'/search', [
                    'q' => $address,
                    'format' => 'json',
                    'limit' => 1,
                    'countrycodes' => 'kz',
                ]);

            if (! $response->successful()) {
                Log::warning('Geocoding request returned a non-successful response.', [
                    'address' => $address,
                    'status' => $response->status(),
                ]);

                return null;
            }

            $result = $response->json(0);

            if (! is_array($result) || ! isset($result['lat'], $result['lon'])) {
                Log::info('Geocoding found no match for the given address.', ['address' => $address]);

                return null;
            }

            return new GeocodedCoordinates((float) $result['lat'], (float) $result['lon']);
        } catch (Throwable $exception) {
            Log::warning('Geocoding request failed.', [
                'address' => $address,
                'message' => $exception->getMessage(),
            ]);

            return null;
        }
    }
}
