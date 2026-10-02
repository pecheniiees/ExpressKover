<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreWarehouseExpenseRequest;
use App\Http\Requests\UpdateWarehouseExpenseRequest;
use App\Http\Resources\WarehouseExpenseResource;
use App\Models\WarehouseExpense;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminWarehouseExpenseController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $period = in_array($request->query('period'), ['day', 'week', 'month'], true)
            ? $request->query('period')
            : 'month';
        $date = $this->parseDate($request->query('date'));
        [$start, $end] = $this->periodRange($date, $period);
        $query = WarehouseExpense::query();

        if ($period === 'day') {
            $query->whereDate('expense_date', $date->toDateString());
        } else {
            $query->whereBetween('expense_date', [$start->toDateString(), $end->toDateString()]);
        }

        $expenses = $query->latest('expense_date')->latest('id')->get();
        $categoryTotals = $expenses->groupBy('category')->map(fn ($items): float => (float) $items->sum('amount'));

        return WarehouseExpenseResource::collection($expenses)->additional([
            'meta' => [
                'period' => $period,
                'date' => $date->toDateString(),
                'range_label' => $this->rangeLabel($start, $end, $period),
                'total' => (float) $expenses->sum('amount'),
                'count' => $expenses->count(),
                'categories' => collect(WarehouseExpense::CATEGORIES)->map(fn (string $label, string $category): array => [
                    'category' => $category,
                    'label' => $label,
                    'value' => (float) ($categoryTotals[$category] ?? 0),
                ])->values(),
            ],
        ]);
    }

    public function store(StoreWarehouseExpenseRequest $request): WarehouseExpenseResource
    {
        return new WarehouseExpenseResource(WarehouseExpense::create([
            ...$request->validated(),
            'created_by' => $request->user()->id,
        ]));
    }

    public function update(UpdateWarehouseExpenseRequest $request, WarehouseExpense $warehouseExpense): WarehouseExpenseResource
    {
        $warehouseExpense->update($request->validated());

        return new WarehouseExpenseResource($warehouseExpense->refresh());
    }

    public function destroy(WarehouseExpense $warehouseExpense): JsonResponse
    {
        $warehouseExpense->delete();

        return response()->json(['message' => 'Расход удалён.']);
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
