<?php

namespace App\Http\Controllers\Api;

use App\Events\CourierDeliveryQueueUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreCourierLocationRequest;
use App\Models\CourierLocation;
use App\Services\Delivery\DeliveryQueueService;
use Illuminate\Http\JsonResponse;

class CourierLocationController extends Controller
{
    /**
     * Record the authenticated courier's current GPS position.
     *
     * The full history is appended to `courier_locations`, while the
     * courier's `last_latitude`/`last_longitude` columns are updated in
     * place so that the latest position is always a single indexed row
     * lookup away, never a scan over history.
     *
     * The delivery queue is only recalculated when the courier has moved
     * a meaningful distance since their last known position, so that
     * frequent GPS pings do not trigger unnecessary recalculation/writes.
     */
    public function store(StoreCourierLocationRequest $request, DeliveryQueueService $queueService): JsonResponse
    {
        $courier = $request->user();
        $latitude = (float) $request->validated('latitude');
        $longitude = (float) $request->validated('longitude');

        $shouldRecalculateQueue = $queueService->shouldRecalculateForLocationChange($courier, $latitude, $longitude);
        $recordedAt = now();

        CourierLocation::create([
            'courier_id' => $courier->id,
            'latitude' => $latitude,
            'longitude' => $longitude,
            'recorded_at' => $recordedAt,
        ]);

        $courier->forceFill([
            'last_latitude' => $latitude,
            'last_longitude' => $longitude,
            'last_location_recorded_at' => $recordedAt,
        ])->save();

        if ($shouldRecalculateQueue) {
            $orders = $queueService->recalculateForCourier($courier);

            event(new CourierDeliveryQueueUpdated($courier, $orders));
        }

        return response()->json([
            'message' => 'Location recorded.',
            'queue_recalculated' => $shouldRecalculateQueue,
        ]);
    }
}
