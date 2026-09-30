<?php

namespace App\Console\Commands;

use App\Models\ServiceRequest;
use App\Models\User;
use App\Services\Delivery\DeliveryQueueService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('orders:advance-washing')]
#[Description('Move washing orders to ready after 48 hours')]
class AdvanceWashingOrders extends Command
{
    public function __construct(private readonly DeliveryQueueService $queueService)
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $orders = ServiceRequest::query()
            ->where('status', 'in_progress')
            ->whereNotNull('washing_started_at')
            ->where('washing_started_at', '<=', now()->subDays(2))
            ->get();
        $courierIds = $orders->pluck('courier_id')->filter()->unique();

        foreach ($orders as $order) {
            $order->update([
                'status' => 'ready',
                'queue_position' => null,
            ]);
        }

        User::query()
            ->whereIn('id', $courierIds)
            ->get()
            ->each(fn (User $courier): mixed => $this->queueService->recalculateForCourier($courier));

        $this->info("Advanced {$orders->count()} washing order(s).");

        return self::SUCCESS;
    }
}
