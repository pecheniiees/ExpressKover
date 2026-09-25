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
