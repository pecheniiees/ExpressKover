<?php

namespace App\Http\Resources;

use App\Models\WarehouseExpense;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read WarehouseExpense $resource
 */
class WarehouseExpenseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'category' => $this->resource->category,
            'category_label' => WarehouseExpense::CATEGORIES[$this->resource->category] ?? $this->resource->category,
            'amount' => (float) $this->resource->amount,
            'expense_date' => $this->resource->expense_date?->format('Y-m-d'),
            'description' => $this->resource->description,
            'created_by' => $this->resource->created_by,
        ];
    }
}
