<?php

namespace App\Models;

use Database\Factories\WarehouseExpenseFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['category', 'amount', 'expense_date', 'description', 'created_by'])]
class WarehouseExpense extends Model
{
    /** @use HasFactory<WarehouseExpenseFactory> */
    use HasFactory;

    public const CATEGORIES = [
        'fuel' => 'Бензин',
        'detergent' => 'Порошок',
        'household' => 'Хозтовары',
        'other' => 'Прочее',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'expense_date' => 'date',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
