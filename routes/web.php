<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\ServiceRequestController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::resource('service-requests', ServiceRequestController::class)
        ->only(['index', 'store', 'update', 'destroy']);

    Route::resource('users', UserController::class)
        ->only(['index', 'store', 'update', 'destroy'])
        ->middleware('can:manage-users');
});

require __DIR__.'/settings.php';
