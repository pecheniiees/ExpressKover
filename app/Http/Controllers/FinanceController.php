<?php

namespace App\Http\Controllers;

use App\Models\ServiceRequest;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class FinanceController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('view-service-requests');

        $total = ServiceRequest::query()->count();
        $completed = ServiceRequest::query()->whereIn('status', ['completed', 'delivered'])->count();
        $cancelled = ServiceRequest::query()->where('status', 'cancelled')->count();
        $active = ServiceRequest::query()->whereNotIn('status', ServiceRequest::TERMINAL_STATUSES)->count();
        $turnover = (float) ServiceRequest::query()->sum('total_amount');
        $completedRevenue = (float) ServiceRequest::query()
            ->whereIn('status', ['completed', 'delivered'])
            ->sum('total_amount');
        $activeRevenue = (float) ServiceRequest::query()
            ->whereNotIn('status', ServiceRequest::TERMINAL_STATUSES)
            ->sum('total_amount');
        $averageCheck = $total > 0 ? $turnover / $total : 0;

        $statusLabels = [
            'new' => ['label' => 'Новые', 'color' => 'bg-slate-400'],
            'pending' => ['label' => 'Ожидают забора', 'color' => 'bg-emerald-500'],
            'assigned' => ['label' => 'Забор', 'color' => 'bg-teal-500'],
            'accepted' => ['label' => 'Приняты', 'color' => 'bg-cyan-500'],
            'in_progress' => ['label' => 'В мойке', 'color' => 'bg-indigo-500'],
            'ready' => ['label' => 'Готовы к доставке', 'color' => 'bg-amber-500'],
            'delivery' => ['label' => 'Доставка', 'color' => 'bg-blue-500'],
            'completed' => ['label' => 'Завершённые', 'color' => 'bg-green-500'],
            'delivered' => ['label' => 'Доставленные', 'color' => 'bg-green-600'],
            'cancelled' => ['label' => 'Отменённые', 'color' => 'bg-red-500'],
        ];

        $statusCounts = ServiceRequest::query()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $statuses = collect($statusLabels)
            ->map(fn (array $meta, string $status): array => [
                'label' => $meta['label'],
                'value' => (int) ($statusCounts[$status] ?? 0),
                'color' => $meta['color'],
            ])
            ->filter(fn (array $status): bool => $status['value'] > 0)
            ->values();

        $monthly = ServiceRequest::query()
            ->where('created_at', '>=', now()->subMonths(5)->startOfMonth())
            ->get(['created_at', 'total_amount'])
            ->groupBy(fn (ServiceRequest $order): string => $order->created_at?->format('Y-m') ?? '')
            ->map(fn ($orders): float => (float) $orders->sum('total_amount'));

        $monthlyStats = collect(range(5, 0))->map(function (int $monthsAgo) use ($monthly): array {
            $date = now()->subMonths($monthsAgo);
            $key = $date->format('Y-m');

            return [
                'label' => $date->translatedFormat('M'),
                'value' => (float) ($monthly[$key] ?? 0),
            ];
        })->values();

        return Inertia::render('finance/index', [
            'stats' => [
                'total' => $total,
                'completed' => $completed,
                'active' => $active,
                'cancelled' => $cancelled,
                'turnover' => $turnover,
                'completed_revenue' => $completedRevenue,
                'active_revenue' => $activeRevenue,
                'average_check' => $averageCheck,
                'monthly' => $monthlyStats,
                'statuses' => $statuses,
            ],
        ]);
    }
}
