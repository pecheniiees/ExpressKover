<?php

namespace App\Http\Controllers;

use App\Models\ServiceRequest;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $statusLabels = [
            'new' => 'Новые',
            'assigned' => 'Забор',
            'accepted' => 'Приняты',
            'in_progress' => 'В мойке',
            'ready' => 'Готовы к доставке',
            'delivery' => 'Доставка',
            'completed' => 'Завершённые',
            'delivered' => 'Доставленные',
            'cancelled' => 'Отменённые',
        ];

        $statusCounts = ServiceRequest::query()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $recentOrders = ServiceRequest::query()
            ->with('courier:id,name')
            ->latest()
            ->limit(6)
            ->get()
            ->map(fn (ServiceRequest $order): array => [
                'id' => $order->id,
                'client_name' => $order->client_name,
                'address' => $order->address,
                'status' => $order->status,
                'status_label' => $statusLabels[$order->status] ?? $order->status,
                'courier' => $order->courier?->name,
                'amount' => $order->total_amount !== null ? (float) $order->total_amount : null,
                'created_at' => $order->created_at?->format('d.m.Y H:i'),
            ]);

        return Inertia::render('dashboard', [
            'stats' => [
                'total_orders' => ServiceRequest::query()->count(),
                'active_orders' => ServiceRequest::query()->whereNotIn('status', ServiceRequest::TERMINAL_STATUSES)->count(),
                'completed_orders' => ServiceRequest::query()->whereIn('status', ['completed', 'delivered'])->count(),
                'revenue' => (float) ServiceRequest::query()->sum('total_amount'),
                'status_counts' => collect($statusLabels)->map(fn (string $label, string $status): array => [
                    'status' => $status,
                    'label' => $label,
                    'value' => (int) ($statusCounts[$status] ?? 0),
                ])->filter(fn (array $item): bool => $item['value'] > 0)->values(),
                'couriers_online' => User::query()->where('role', 'courier')->whereNotNull('last_location_recorded_at')->where('last_location_recorded_at', '>=', now()->subMinutes(15))->count(),
                'couriers_total' => User::query()->where('role', 'courier')->count(),
            ],
            'recent_orders' => $recentOrders,
        ]);
    }
}
