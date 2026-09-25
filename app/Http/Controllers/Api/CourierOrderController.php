<?php

namespace App\Http\Controllers\Api;

use App\Events\CourierDeliveryQueueUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\UpdateServiceRequestStatusRequest;
use App\Http\Resources\CourierOrderResource;
use App\Models\ServiceRequest;
use App\Services\Delivery\DeliveryDistanceService;
use App\Services\Delivery\DeliveryQueueService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class CourierOrderController extends Controller
{
    /**
     * Return the shared feed of unclaimed, non-terminal orders.
     */
    public function available(Request $request, DeliveryDistanceService $distanceService): AnonymousResourceCollection
    {
        Gate::authorize('claim-service-request');

        $courier = $request->user();
        $orders = ServiceRequest::query()
            ->whereNull('courier_id')
            ->whereIn('status', ServiceRequest::AVAILABLE_COURIER_STATUSES)
            ->latest()
            ->get();

        $orders->each(function (ServiceRequest $order) use ($courier, $distanceService): void {
            $order->setAttribute('distance_meters', $distanceService->distanceBetweenCourierAndOrder($courier, $order));
        });

        return CourierOrderResource::collection($orders);
    }

    /**
     * Atomically claim a free order for the authenticated courier.
     *
     * The row lock makes two concurrent couriers serialize on the same
     * order. The second transaction observes courier_id after the first
     * commits and receives 409 instead of claiming the same order.
     */
    public function accept(Request $request, ServiceRequest $order, DeliveryQueueService $queueService, DeliveryDistanceService $distanceService): CourierOrderResource|JsonResponse
    {
        Gate::authorize('claim-service-request');

        $courier = $request->user();
        $claimed = DB::transaction(function () use ($order, $courier): bool {
            $lockedOrder = ServiceRequest::query()->lockForUpdate()->findOrFail($order->id);

            if ($lockedOrder->courier_id !== null || ! in_array($lockedOrder->status, ServiceRequest::AVAILABLE_COURIER_STATUSES, true)) {
                return false;
            }

            $lockedOrder->update([
                'courier_id' => $courier->id,
                'status' => 'accepted',
                'queue_position' => null,
            ]);

            return true;
        });

        if (! $claimed) {
            return response()->json([
                'message' => 'Заявка уже забрана другим курьером или недоступна.',
            ], 409);
        }

        $queue = $queueService->recalculateForCourier($courier);
        event(new CourierDeliveryQueueUpdated($courier, $queue));

        $order->refresh();
        $order->setAttribute('distance_meters', $distanceService->distanceBetweenCourierAndOrder($courier, $order));

        return new CourierOrderResource($order);
    }

    /**
     * The authenticated courier's current delivery queue for today.
     *
     * This is a read-only endpoint: it returns the queue in its last
     * persisted order/distance snapshot rather than recalculating on every
     * request, since polling should not itself be a recalculation trigger
     * (see DeliveryQueueService for the actual recalculation triggers).
     */
    public function today(Request $request, DeliveryQueueService $queueService, DeliveryDistanceService $distanceService): AnonymousResourceCollection
    {
        Gate::authorize('view-own-courier-queue');

        $courier = $request->user();
        $orders = $queueService->ordersForCourier($courier);

        $orders->each(function (ServiceRequest $order) use ($courier, $distanceService): void {
            $order->setAttribute('distance_meters', $distanceService->distanceBetweenCourierAndOrder($courier, $order));
        });

        return CourierOrderResource::collection($orders);
    }

    /**
     * Transition one of the authenticated courier's own orders to a new
     * status, then recalculate their delivery queue so that, for example,
     * the next order automatically becomes first after a delivery.
     */
    public function updateStatus(UpdateServiceRequestStatusRequest $request, ServiceRequest $order, DeliveryQueueService $queueService): CourierOrderResource
    {
        $courier = $request->user();

        $order->update(['status' => $request->validated('status')]);

        $orders = $queueService->recalculateForCourier($courier);

        event(new CourierDeliveryQueueUpdated($courier, $orders));

        $order->refresh();
        $order->setAttribute(
            'distance_meters',
            app(DeliveryDistanceService::class)->distanceBetweenCourierAndOrder($courier, $order),
        );

        return new CourierOrderResource($order);
    }
}
