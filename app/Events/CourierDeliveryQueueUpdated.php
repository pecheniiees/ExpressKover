<?php

namespace App\Events;

use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

/**
 * Fired whenever a courier's delivery queue order changes (new order added,
 * a status transition occurred, or the queue was reordered after a
 * significant GPS movement).
 *
 * This event does not implement ShouldBroadcast: the project has no
 * broadcasting driver (Reverb/Pusher/Echo) configured yet. Once one is
 * added, this class only needs `implements ShouldBroadcastNow` and a
 * `broadcastOn()`/`broadcastAs()` pair — no changes are required at any of
 * the dispatch call sites.
 */
class CourierDeliveryQueueUpdated
{
    use Dispatchable, SerializesModels;

    /**
     * @param  Collection<int, ServiceRequest>  $orders  the courier's queue, in order
     */
    public function __construct(
        public readonly User $courier,
        public readonly Collection $orders,
    ) {}

    /**
     * Broadcast-ready payload, matching the shape described for
     * `CourierDeliveryQueueUpdated` realtime events.
     *
     * @return array{courier_id: int, orders: array<int, array<string, mixed>>}
     */
    public function toPayload(): array
    {
        return [
            'courier_id' => $this->courier->id,
            'orders' => $this->orders->values()->map(fn (ServiceRequest $order): array => [
                'id' => $order->id,
                'status' => $order->status,
                'queue_position' => $order->queue_position,
            ])->all(),
        ];
    }
}
