<?php

use App\Http\Controllers\Api\AuthTokenController;
use App\Http\Controllers\Api\CourierLocationController;
use App\Http\Controllers\Api\CourierOrderController;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthTokenController::class, 'store'])->name('api.login');

Route::middleware('auth:sanctum')->prefix('courier')->name('api.courier.')->group(function () {
    Route::post('location', [CourierLocationController::class, 'store'])->name('location.store');
    Route::get('orders/today', [CourierOrderController::class, 'today'])->name('orders.today');
    Route::patch('orders/{order}/status', [CourierOrderController::class, 'updateStatus'])->name('orders.update-status');
});
