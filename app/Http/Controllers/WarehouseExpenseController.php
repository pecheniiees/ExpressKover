<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWarehouseExpenseRequest;
use App\Models\WarehouseExpense;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class WarehouseExpenseController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('view-service-requests');

        $period = in_array($request->query('period'), ['day', 'week', 'month'], true)
            ? $request->query('period')
            : 'month';
        $selectedDate = $this->parseDate($request->query('date'));
        [$rangeStart, $rangeEnd] = $this->periodRange($selectedDate, $period);
        $expenseQuery = WarehouseExpense::query();

        if ($period === 'day') {
            $expenseQuery->whereDate('expense_date', $selectedDate->toDateString());
        } else {
            $expenseQuery->whereBetween('expense_date', [$rangeStart->toDateString(), $rangeEnd->toDateString()]);
        }

        $expenses = $expenseQuery
            ->latest('expense_date')
            ->latest('id')
            ->get();
        $categoryTotals = $expenses->groupBy('category')->map(fn ($items): float => (float) $items->sum('amount'));

        return Inertia::render('warehouse/index', [
            'expenses' => $expenses->map(fn (WarehouseExpense $expense): array => [
                'id' => $expense->id,
                'category' => $expense->category,
                'category_label' => WarehouseExpense::CATEGORIES[$expense->category] ?? $expense->category,
                'amount' => (float) $expense->amount,
                'expense_date' => $expense->expense_date?->format('Y-m-d'),
                'description' => $expense->description,
            ])->values(),
            'stats' => [
                'total' => (float) $expenses->sum('amount'),
                'count' => $expenses->count(),
                'categories' => collect(WarehouseExpense::CATEGORIES)->map(fn (string $label, string $category): array => [
                    'category' => $category,
                    'label' => $label,
                    'value' => (float) ($categoryTotals[$category] ?? 0),
                ])->values(),
            ],
            'filters' => [
                'period' => $period,
                'date' => $selectedDate->toDateString(),
                'range_label' => $this->rangeLabel($rangeStart, $rangeEnd, $period),
            ],
            'categories' => WarehouseExpense::CATEGORIES,
        ]);
    }

    public function store(StoreWarehouseExpenseRequest $request): RedirectResponse
    {
        WarehouseExpense::create([
            ...$request->validated(),
            'created_by' => $request->user()->id,
        ]);

        return to_route('warehouse.expenses.index', [
            'period' => $request->query('period', 'month'),
            'date' => $request->query('date', now()->toDateString()),
        ]);
    }

    public function destroy(WarehouseExpense $warehouseExpense): RedirectResponse
    {
        Gate::authorize('view-service-requests');
        $warehouseExpense->delete();

        return to_route('warehouse.expenses.index');
    }

    private function parseDate(?string $date): CarbonImmutable
    {
        try {
            $value = $date ?: now()->toDateString();
            $parsedDate = CarbonImmutable::createFromFormat('!Y-m-d', $value);

            if ($parsedDate === false || $parsedDate->format('Y-m-d') !== $value) {
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

    private function rangeLabel(CarbonImmutable $start, CarbonImmutable $end, string $period): string
    {
        return match ($period) {
            'day' => $start->format('d.m.Y'),
            'week' => $start->format('d.m').'–'.$end->format('d.m.Y'),
            default => $start->translatedFormat('F Y'),
        };
    }
}
