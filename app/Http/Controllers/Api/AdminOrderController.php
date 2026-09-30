<?php

namespace App\Http\Controllers\Api;

use App\Events\CourierDeliveryQueueUpdated;
use App\Http\Controllers\Controller;
use App\Http\Resources\AdminOrderResource;
use App\Models\ServiceRequest;
use App\Services\Delivery\DeliveryQueueService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminOrderController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return AdminOrderResource::collection(
            ServiceRequest::query()
                ->with('courier:id,name,phone')
                ->latest()
                ->get(),
        );
    }

    public function markReady(ServiceRequest $order, DeliveryQueueService $queueService): AdminOrderResource|JsonResponse
    {
        if ($order->status !== 'in_progress') {
            return response()->json([
                'message' => 'Только заказ из статуса «В мойке» можно отметить готовым к доставке.',
            ], 422);
        }

        $previousCourier = $order->courier;

        $order->update([
            'status' => 'ready',
            'washing_started_at' => null,
            'courier_id' => null,
            'queue_position' => null,
        ]);

        if ($previousCourier) {
            $queue = $queueService->recalculateForCourier($previousCourier);
            event(new CourierDeliveryQueueUpdated($previousCourier, $queue));
        }

        return new AdminOrderResource($order->load('courier:id,name,phone'));
    }

    public function sendToRewash(ServiceRequest $order, DeliveryQueueService $queueService): AdminOrderResource|JsonResponse
    {
        if ($order->status !== 'ready') {
            return response()->json([
                'message' => 'На перестирку можно отправить только готовый к доставке заказ.',
            ], 422);
        }

        $order->update([
            'status' => 'in_progress',
            'washing_started_at' => now(),
        ]);

        if ($order->courier) {
            $queue = $queueService->recalculateForCourier($order->courier);
            event(new CourierDeliveryQueueUpdated($order->courier, $queue));
        }

        return new AdminOrderResource($order->load('courier:id,name,phone'));
    }
}
