<?php

namespace App\Services\Delivery;

use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Maintains the ordering of a courier's active delivery queue.
 *
 * Rules enforced here:
 * - The order currently "in_progress" is always the courier's current
 *   delivery and always keeps queue_position = 0. It is never displaced
 *   by a newer/closer order.
 * - Every other active order ("assigned"/"accepted") is sorted by distance
 *   from the courier's last known GPS position and given the next
 *   queue_position values in ascending order.
 * - delivered/completed/cancelled orders are excluded entirely.
 */
class DeliveryQueueService
{
    /**
     * Minimum GPS movement (in meters) that justifies recalculating a
     * courier's queue. Prevents recalculating on every high-frequency GPS
     * ping while still reacting to meaningful movement.
     */
    public const MIN_RECALCULATION_DISTANCE_METERS = 150.0;

    public function __construct(
        private readonly DeliveryDistanceService $distanceService,
    ) {}

    /**
     * Recalculate and persist the queue order for a courier's active orders.
     *
     * @return Collection<int, ServiceRequest> orders in their new queue order
     */
    public function recalculateForCourier(User $courier): Collection
    {
        $activeOrders = ServiceRequest::query()
            ->where('courier_id', $courier->id)
            ->whereIn('status', ServiceRequest::ACTIVE_COURIER_STATUSES)
            ->get();

        [$currentOrders, $pendingOrders] = $activeOrders->partition(
            fn (ServiceRequest $order): bool => $order->status === 'in_progress',
        );

        $current = $currentOrders->first();

        $sortedPending = $pendingOrders
            ->sortBy(fn (ServiceRequest $order): float => $this->distanceService->distanceBetweenCourierAndOrder($courier, $order) ?? PHP_FLOAT_MAX)
            ->values();

        $orderedQueue = $current
            ? $sortedPending->prepend($current)
            : $sortedPending;

        DB::transaction(function () use ($orderedQueue): void {
            foreach ($orderedQueue->values() as $position => $order) {
                if ($order->queue_position !== $position) {
                    $order->forceFill(['queue_position' => $position])->save();
                }
            }
        });

        return $orderedQueue;
    }

    /**
     * Fetch a courier's active queue in its persisted order, without
     * recalculating distances.
     *
     * @return Collection<int, ServiceRequest>
     */
    public function ordersForCourier(User $courier): Collection
    {
        return ServiceRequest::query()
            ->where('courier_id', $courier->id)
            ->whereIn('status', ServiceRequest::ACTIVE_COURIER_STATUSES)
            ->orderByRaw('queue_position IS NULL, queue_position asc')
            ->get();
    }

    /**
     * Whether a courier's new GPS position has moved enough from their last
     * known position to justify recalculating their queue. Used to debounce
     * frequent GPS updates.
     */
    public function shouldRecalculateForLocationChange(User $courier, float $newLatitude, float $newLongitude): bool
    {
        if (! $courier->hasKnownLocation()) {
            return true;
        }

        $distanceMoved = $this->distanceService->distanceInMeters(
            (float) $courier->last_latitude,
            (float) $courier->last_longitude,
            $newLatitude,
            $newLongitude,
        );

        return $distanceMoved >= self::MIN_RECALCULATION_DISTANCE_METERS;
    }
}
