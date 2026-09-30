<?php

use App\Models\ServiceRequest;
use App\Models\User;

it('shows only terminal orders in the order history', function () {
    $operator = User::factory()->operator()->create();
    $completed = ServiceRequest::factory()->create(['status' => 'completed']);
    $cancelled = ServiceRequest::factory()->create(['status' => 'cancelled']);
    ServiceRequest::factory()->create(['status' => 'in_progress']);

    $response = $this->actingAs($operator)->get(route('order-history.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('order-history/index')
        ->where('orders.total', 2)
        ->where('summary.total', 2)
        ->where('summary.completed', 1)
        ->where('summary.cancelled', 1)
        ->where('orders.data', fn (array $orders): bool => collect($orders)->pluck('id')->sort()->values()->all() === collect([$completed->id, $cancelled->id])->sort()->values()->all())
    );
});

it('filters order history by client search', function () {
    $operator = User::factory()->operator()->create();
    ServiceRequest::factory()->create([
        'status' => 'delivered',
        'client_name' => 'Алия',
        'address' => 'Абая 10',
    ]);
    ServiceRequest::factory()->create([
        'status' => 'completed',
        'client_name' => 'Руслан',
        'address' => 'Сейфуллина 25',
    ]);

    $response = $this->actingAs($operator)->get(route('order-history.index', ['search' => 'Алия']));

    $response->assertInertia(fn ($page) => $page
        ->where('orders.total', 1)
        ->where('orders.data.0.client_name', 'Алия')
        ->where('filters.search', 'Алия')
    );
});

it('does not allow couriers to view order history', function () {
    $courier = User::factory()->courier()->create();

    $this->actingAs($courier)
        ->get(route('order-history.index'))
        ->assertForbidden();
});
