<?php

use App\Models\ServiceRequest;

it('moves washing orders to ready after 48 hours', function () {
    $order = ServiceRequest::factory()->create([
        'status' => 'in_progress',
        'washing_started_at' => now()->subDays(2)->subMinute(),
    ]);

    $this->artisan('orders:advance-washing')
        ->assertSuccessful();

    expect($order->fresh())
        ->status->toBe('ready')
        ->queue_position->toBeNull();
});

it('keeps washing orders active before 48 hours', function () {
    $order = ServiceRequest::factory()->create([
        'status' => 'in_progress',
        'washing_started_at' => now()->subDays(2)->addMinute(),
    ]);

    $this->artisan('orders:advance-washing')
        ->assertSuccessful();

    expect($order->fresh()->status)->toBe('in_progress');
});
