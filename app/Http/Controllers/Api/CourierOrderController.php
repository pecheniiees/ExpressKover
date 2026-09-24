<?php

namespace App\Http\Controllers\Api;

use App\Events\CourierDeliveryQueueUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\UpdateServiceRequestStatusRequest;
use App\Http\Resources\CourierOrderResource;
use App\Models\ServiceRequest;
use App\Services\Delivery\DeliveryDistanceService;
use App\Services\Delivery\DeliveryQueueService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

class CourierOrderController extends Controller
{
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
