<?php

use App\Models\User;
use App\Models\WarehouseExpense;
use Laravel\Sanctum\Sanctum;

test('admin can use warehouse expense CRUD and filtered report', function () {
    $admin = User::factory()->admin()->create();
    Sanctum::actingAs($admin);

    $date = now()->toDateString();
    $created = $this->postJson(route('api.admin.warehouse.expenses.store'), [
        'category' => 'fuel',
        'amount' => 15000,
        'expense_date' => $date,
        'description' => 'Заправка автомобиля',
    ]);

    $created->assertCreated()
        ->assertJsonPath('data.category', 'fuel')
        ->assertJsonPath('data.amount', 15000);
    $expense = WarehouseExpense::query()->sole();

    $this->postJson(route('api.admin.warehouse.expenses.store'), [
        'category' => 'detergent',
        'amount' => 3000,
        'expense_date' => $date,
    ])->assertCreated();

    $this->getJson(route('api.admin.warehouse.expenses.index', [
        'period' => 'day',
        'date' => $date,
    ]))
        ->assertOk()
        ->assertJsonPath('meta.total', 18000)
        ->assertJsonPath('meta.count', 2)
        ->assertJsonCount(2, 'data');

    $this->patchJson(route('api.admin.warehouse.expenses.update', $expense), [
        'category' => 'household',
        'amount' => 18000,
        'expense_date' => $date,
        'description' => 'Хозяйственные товары',
    ])
        ->assertOk()
        ->assertJsonPath('data.category', 'household')
        ->assertJsonPath('data.amount', 18000);

    $this->deleteJson(route('api.admin.warehouse.expenses.destroy', $expense))
        ->assertOk();

    expect($expense->fresh())->toBeNull();
});

test('courier cannot access warehouse expense API', function () {
    Sanctum::actingAs(User::factory()->courier()->create());

    $this->getJson(route('api.admin.warehouse.expenses.index'))
        ->assertForbidden();
});
test('example', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
});
