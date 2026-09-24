<?php

namespace App\Services\Delivery;

use App\Models\ServiceRequest;
use App\Models\User;
use App\UserRole;
use Illuminate\Support\Collection;

/**
 * Suggests couriers for a new order based on proximity.
 *
 * This service is intentionally read-only: it does not assign orders. It
 * gives the calling code (a controller, a job, an operator-facing screen)
 * a ranked list of candidate couriers so that automatic assignment,
 * "offer to nearest courier", or accept/decline workflows can be layered on
 * top later without changing this service.
 */
class CourierAssignmentService
{
    public function __construct(
        private readonly DeliveryDistanceService $distanceService,
    ) {}

    /**
     * Find couriers with a known GPS position, ranked nearest-first for the
     * given order. Couriers without a recorded location are excluded since
     * their distance cannot be determined.
     *
     * @return Collection<int, array{courier: User, distance_meters: float}>
     */
    public function findNearestCouriers(ServiceRequest $order, int $limit = 5): Collection
    {
        if (! $order->hasKnownLocation()) {
            return collect();
        }

        return User::query()
            ->where('role', UserRole::Courier)
            ->whereNotNull('last_latitude')
            ->whereNotNull('last_longitude')
            ->get()
            ->map(fn (User $courier): array => [
                'courier' => $courier,
                'distance_meters' => $this->distanceService->distanceBetweenCourierAndOrder($courier, $order),
            ])
            ->filter(fn (array $candidate): bool => $candidate['distance_meters'] !== null)
            ->sortBy('distance_meters')
            ->values()
            ->take($limit);
    }
}
