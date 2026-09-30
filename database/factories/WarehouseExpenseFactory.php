<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\WarehouseExpense;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WarehouseExpense>
 */
class WarehouseExpenseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category' => 'fuel',
            'amount' => 10000,
            'expense_date' => now()->toDateString(),
            'description' => 'Тестовый расход',
            'created_by' => User::factory()->operator(),
        ];
    }
}
