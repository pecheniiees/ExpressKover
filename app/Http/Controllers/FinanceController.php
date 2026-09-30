<?php

namespace App\Http\Controllers;

use App\Models\ServiceRequest;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class FinanceController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('view-service-requests');

        $period = in_array($request->query('period'), ['day', 'week', 'month'], true)
            ? $request->query('period')
            : 'month';
        $selectedDate = $this->parseDate($request->query('date'));
        [$rangeStart, $rangeEnd] = $this->periodRange($selectedDate, $period);
        $periodQuery = ServiceRequest::query()->whereBetween('created_at', [$rangeStart, $rangeEnd]);

        $total = (clone $periodQuery)->count();
        $completed = (clone $periodQuery)->whereIn('status', ['completed', 'delivered'])->count();
        $cancelled = (clone $periodQuery)->where('status', 'cancelled')->count();
        $active = (clone $periodQuery)->whereNotIn('status', ServiceRequest::TERMINAL_STATUSES)->count();
        $turnover = (float) (clone $periodQuery)->sum('total_amount');
        $completedRevenue = (clone $periodQuery)
            ->whereIn('status', ['completed', 'delivered'])
            ->sum('total_amount');
        $activeRevenue = (float) (clone $periodQuery)
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

        $statusCounts = (clone $periodQuery)
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

        $trendOrders = (clone $periodQuery)
            ->get(['created_at', 'total_amount'])
            ->groupBy(fn (ServiceRequest $order): string => $this->trendKey($order->created_at, $period));

        $trend = $this->buildTrend($rangeStart, $rangeEnd, $period, $trendOrders);

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
                'period' => $period,
                'selected_date' => $selectedDate->toDateString(),
                'range_label' => $this->rangeLabel($rangeStart, $rangeEnd, $period),
                'trend' => $trend,
                'statuses' => $statuses,
            ],
        ]);
    }

    private function parseDate(?string $date): CarbonImmutable
    {
        try {
            $parsedDate = CarbonImmutable::createFromFormat('!Y-m-d', $date ?: now()->toDateString());

            if ($parsedDate === false || $parsedDate->format('Y-m-d') !== ($date ?: now()->toDateString())) {
                throw new \InvalidArgumentException;
            }

            return $parsedDate;
        } catch (\Throwable) {
            return CarbonImmutable::today();
        }
    }

    /** @return array{CarbonImmutable, CarbonImmutable} */
    private function periodRange(CarbonImmutable $date, string $period): array
    {
        return match ($period) {
            'day' => [$date->startOfDay(), $date->endOfDay()],
            'week' => [$date->startOfWeek(), $date->endOfWeek()],
            default => [$date->startOfMonth(), $date->endOfMonth()],
        };
    }

    private function trendKey(?CarbonImmutable $date, string $period): string
    {
        if ($date === null) {
            return '';
        }

        return match ($period) {
            'day' => $date->format('H:00'),
            default => $date->format('Y-m-d'),
        };
    }

    /** @param Collection<string, Collection<int, ServiceRequest>> $orders */
    private function buildTrend(CarbonImmutable $start, CarbonImmutable $end, string $period, $orders): array
    {
        $step = $period === 'day' ? '1 hour' : '1 day';
        $format = $period === 'day' ? 'H:00' : 'd.m';
        $cursor = $start;
        $trend = [];

        while ($cursor <= $end) {
            $key = $this->trendKey($cursor, $period);
            $trend[] = [
                'label' => $cursor->format($format),
                'value' => (float) ($orders->get($key)?->sum('total_amount') ?? 0),
            ];
            $cursor = $cursor->add($step);
        }

        return $trend;
    }

    private function rangeLabel(CarbonImmutable $start, CarbonImmutable $end, string $period): string
    {
        return match ($period) {
            'day' => $start->format('d.m.Y'),
            'week' => $start->format('d.m').'–'.$end->format('d.m.Y'),
            default => $start->translatedFormat('F Y'),
        };
    }
}
