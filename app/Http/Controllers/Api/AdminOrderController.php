<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminOrderResource;
use App\Models\ServiceRequest;
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

    public function markReady(ServiceRequest $order): AdminOrderResource|JsonResponse
    {
        if ($order->status !== 'in_progress') {
            return response()->json([
                'message' => 'Только заказ из статуса «В мойке» можно отметить готовым к доставке.',
            ], 422);
        }

        $order->update([
            'status' => 'ready',
            'washing_started_at' => null,
        ]);

        return new AdminOrderResource($order->load('courier:id,name,phone'));
    }
}
