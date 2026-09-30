<?php

use App\Models\User;
use App\Models\WarehouseExpense;

test('operators can create and view warehouse expenses', function () {
    $operator = User::factory()->operator()->create();

    $response = $this->actingAs($operator)->post(route('warehouse.expenses.store'), [
        'category' => 'fuel',
        'amount' => 18500,
        'expense_date' => now()->toDateString(),
        'description' => 'Заправка автомобиля',
    ]);

    $response->assertRedirect(route('warehouse.expenses.index', [
        'period' => 'month',
        'date' => now()->toDateString(),
    ]));
    $this->assertDatabaseHas('warehouse_expenses', [
        'category' => 'fuel',
        'amount' => 18500,
        'description' => 'Заправка автомобиля',
        'created_by' => $operator->id,
    ]);
});

test('warehouse report filters expenses by selected day and calculates category totals', function () {
    $operator = User::factory()->operator()->create();
    $date = now()->startOfDay();

    WarehouseExpense::factory()->create([
        'category' => 'detergent',
        'amount' => 12000,
        'expense_date' => $date->toDateString(),
    ]);
    WarehouseExpense::factory()->create([
        'category' => 'fuel',
        'amount' => 8000,
        'expense_date' => $date->copy()->subDay()->toDateString(),
    ]);

    $response = $this->actingAs($operator)->get(route('warehouse.expenses.index', [
        'period' => 'day',
        'date' => $date->toDateString(),
    ]));

    $response->assertInertia(fn ($page) => $page
        ->component('warehouse/index')
        ->where('stats.total', 12000)
        ->where('stats.count', 1)
        ->where('stats.categories.1.value', 12000)
    );
});

test('couriers cannot access warehouse expenses', function () {
    $courier = User::factory()->courier()->create();

    $this->actingAs($courier)
        ->get(route('warehouse.expenses.index'))
        ->assertForbidden();
});

test('warehouse expense validation rejects unsupported categories and zero amounts', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->post(route('warehouse.expenses.store'), [
            'category' => 'unknown',
            'amount' => 0,
            'expense_date' => now()->toDateString(),
        ])
        ->assertSessionHasErrors(['category', 'amount']);
});
test('example', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
});
