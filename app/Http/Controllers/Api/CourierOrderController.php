<?php

namespace App\Http\Controllers\Api;

use App\Events\CourierDeliveryQueueUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\UpdateServiceRequestStatusRequest;
use App\Http\Resources\CourierOrderResource;
use App\Models\Discount;
use App\Models\ServiceRequest;
use App\Models\Tariff;
use App\Models\User;
use App\Services\Delivery\DeliveryDistanceService;
use App\Services\Delivery\DeliveryQueueService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class CourierOrderController extends Controller
{
    public function tariffs(): JsonResponse
    {
        Gate::authorize('claim-service-request');

        return response()->json([
            'data' => Tariff::query()
                ->orderBy('name')
                ->get(['id', 'name', 'price_per_square_meter']),
        ]);
    }

    public function discounts(): JsonResponse
    {
        Gate::authorize('claim-service-request');

        return response()->json([
            'data' => Discount::query()
                ->orderBy('name')
                ->get(['id', 'name', 'percentage']),
        ]);
    }

    /**
     * Return the shared feed of unclaimed, non-terminal orders.
     */
    public function available(Request $request, DeliveryDistanceService $distanceService): AnonymousResourceCollection
    {
        Gate::authorize('claim-service-request');

        $courier = $request->user();
        $orders = ServiceRequest::query()
            ->where(function (Builder $query): void {
                $query
                    ->where('status', 'ready')
                    ->orWhere(function (Builder $query): void {
                        $query
                            ->whereNull('courier_id')
                            ->whereIn('status', ['new', 'pending', 'delivery']);
                    });
            })
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

        $validated = $request->validate([
            'carpet_count' => ['sometimes', 'required', 'integer', 'min:1'],
            'area_square_meters' => ['sometimes', 'required', 'numeric', 'min:0.01', 'max:999999.99'],
            'tariff_id' => ['sometimes', 'required', 'integer', 'exists:tariffs,id'],
        ]);
        $courier = $request->user();
        $previousCourierId = null;
        $claimed = DB::transaction(function () use ($order, $courier, $validated, &$previousCourierId): bool {
            $lockedOrder = ServiceRequest::query()->lockForUpdate()->findOrFail($order->id);

            $isReadyForDelivery = $lockedOrder->status === 'ready';
            if ((! $isReadyForDelivery && $lockedOrder->courier_id !== null)
                || ! in_array($lockedOrder->status, ServiceRequest::AVAILABLE_COURIER_STATUSES, true)) {
                return false;
            }

            $previousCourierId = $lockedOrder->courier_id;
            $nextStatus = in_array($lockedOrder->status, ['ready', 'delivery'], true)
                ? 'delivery'
                : 'accepted';

            $attributes = [
                'courier_id' => $courier->id,
                'status' => $nextStatus,
                'washing_started_at' => null,
                'queue_position' => null,
            ];

            if (array_key_exists('carpet_count', $validated)) {
                $attributes['carpet_count'] = $validated['carpet_count'];
            }

            if (array_key_exists('area_square_meters', $validated)) {
                $attributes['area_square_meters'] = $validated['area_square_meters'];
            }

            if (array_key_exists('tariff_id', $validated)) {
                $attributes['tariff_id'] = $validated['tariff_id'];
            }

            if (array_key_exists('area_square_meters', $validated) || array_key_exists('tariff_id', $validated)) {
                $area = $validated['area_square_meters'] ?? $lockedOrder->area_square_meters;
                $tariffId = $validated['tariff_id'] ?? $lockedOrder->tariff_id;

                if ($area !== null && $tariffId !== null) {
                    $tariff = Tariff::query()->findOrFail($tariffId);
                    $discount = $lockedOrder->discount_id
                        ? Discount::query()->find($lockedOrder->discount_id)
                        : null;
                    $billableArea = max((float) $area, 7.5);
                    $attributes['total_amount'] = round(
                        $billableArea * (float) $tariff->price_per_square_meter * (1 - ((float) ($discount?->percentage ?? 0) / 100)),
                        2,
                    );
                }
            }

            $lockedOrder->update($attributes);

            return true;
        });

        if (! $claimed) {
            return response()->json([
                'message' => 'Заявка уже забрана другим курьером или недоступна.',
            ], 409);
        }

        if ($previousCourierId !== null && $previousCourierId !== $courier->id) {
            $previousCourier = User::query()->find($previousCourierId);
            if ($previousCourier) {
                $previousQueue = $queueService->recalculateForCourier($previousCourier);
                event(new CourierDeliveryQueueUpdated($previousCourier, $previousQueue));
            }
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

        $status = $request->validated('status');
        $attributes = [
            'status' => $status,
            'washing_started_at' => $status === 'in_progress' ? now() : null,
        ];

        if ($status === 'in_progress') {
            $attributes['courier_id'] = null;
            $attributes['queue_position'] = null;
        }

        if ($status === 'completed') {
            $attributes['queue_position'] = null;
        }

        $order->update($attributes);

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
