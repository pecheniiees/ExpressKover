<?php

use App\Http\Controllers\Api\AdminOrderController;
use App\Http\Controllers\Api\AuthTokenController;
use App\Http\Controllers\Api\CourierLocationController;
use App\Http\Controllers\Api\CourierOrderController;
use App\Http\Controllers\Api\CourierPushTokenController;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthTokenController::class, 'store'])->name('api.login');

Route::middleware('auth:sanctum')->prefix('courier')->name('api.courier.')->group(function () {
    Route::post('location', [CourierLocationController::class, 'store'])->name('location.store');
    Route::post('push-token', [CourierPushTokenController::class, 'store'])->name('push-token.store');
    Route::delete('push-token', [CourierPushTokenController::class, 'destroy'])->name('push-token.destroy');
    Route::get('orders/available', [CourierOrderController::class, 'available'])->name('orders.available');
    Route::post('orders/{order}/accept', [CourierOrderController::class, 'accept'])->name('orders.accept');
    Route::get('orders/today', [CourierOrderController::class, 'today'])->name('orders.today');
    Route::patch('orders/{order}/status', [CourierOrderController::class, 'updateStatus'])->name('orders.update-status');
});

Route::middleware(['auth:sanctum', 'can:manage-users'])->prefix('admin')->name('api.admin.')->group(function () {
    Route::get('orders', [AdminOrderController::class, 'index'])->name('orders.index');
    Route::patch('orders/{order}/ready', [AdminOrderController::class, 'markReady'])->name('orders.ready');
    Route::patch('orders/{order}/rewash', [AdminOrderController::class, 'sendToRewash'])->name('orders.rewash');
});
