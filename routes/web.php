<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FinanceController;
use App\Http\Controllers\ServiceRequestController;
use App\Http\Controllers\WorkController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('work', [WorkController::class, 'index'])
        ->middleware('can:view-service-requests')
        ->name('work.index');
    Route::get('finance', [FinanceController::class, 'index'])
        ->middleware('can:view-service-requests')
        ->name('finance.index');

    Route::resource('service-requests', ServiceRequestController::class)
        ->only(['index', 'store', 'update', 'destroy']);

    Route::resource('users', UserController::class)
        ->only(['index', 'store', 'update', 'destroy'])
        ->middleware('can:manage-users');

    Route::get('clients', [UserController::class, 'clients'])
        ->middleware('can:view-service-requests')
        ->name('clients.index');
});

require __DIR__.'/settings.php';
