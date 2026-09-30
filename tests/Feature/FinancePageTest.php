<?php

use App\Models\ServiceRequest;
use App\Models\User;

test('authorized operators can view finance statistics', function () {
    $operator = User::factory()->operator()->create();

    ServiceRequest::factory()->create(['status' => 'completed', 'total_amount' => 10000]);
    ServiceRequest::factory()->create(['status' => 'in_progress', 'total_amount' => 5000]);
    ServiceRequest::factory()->create(['status' => 'cancelled', 'total_amount' => 2000]);

    $response = $this->actingAs($operator)->get(route('finance.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('finance/index')
        ->where('stats.total', 3)
        ->where('stats.completed', 1)
        ->where('stats.active', 1)
        ->where('stats.cancelled', 1)
        ->where('stats.turnover', 17000)
        ->where('stats.completed_revenue', 10000)
        ->where('stats.active_revenue', 5000)
        ->where('stats.average_check', 17000 / 3)
    );
});

test('couriers cannot view finance statistics', function () {
    $courier = User::factory()->courier()->create();

    $this->actingAs($courier)
        ->get(route('finance.index'))
        ->assertForbidden();
});

test('finance statistics can be filtered by a selected day', function () {
    $operator = User::factory()->operator()->create();
    $today = now()->startOfDay();

    ServiceRequest::factory()->create([
        'status' => 'completed',
        'total_amount' => 12000,
        'created_at' => $today->copy()->addHours(8),
    ]);
    ServiceRequest::factory()->create([
        'status' => 'completed',
        'total_amount' => 5000,
        'created_at' => $today->copy()->subDay(),
    ]);

    $response = $this->actingAs($operator)->get(route('finance.index', [
        'period' => 'day',
        'date' => $today->toDateString(),
    ]));

    $response->assertInertia(fn ($page) => $page
        ->where('stats.period', 'day')
        ->where('stats.selected_date', $today->toDateString())
        ->where('stats.total', 1)
        ->where('stats.turnover', 12000)
    );
});
