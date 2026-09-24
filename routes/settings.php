<?php

use App\Http\Controllers\Settings\CatalogController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\SecurityController;
use Illuminate\Auth\Middleware\RequirePassword;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
});

Route::middleware(['auth'])->group(function () {
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/security', [SecurityController::class, 'edit'])
        ->middleware(RequirePassword::class)
        ->name('security.edit');

    Route::put('settings/password', [SecurityController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::inertia('settings/appearance', 'settings/appearance')->name('appearance.edit');
    Route::get('settings/catalog', [CatalogController::class, 'index'])->name('settings.catalog');
    Route::post('settings/catalog/tariffs', [CatalogController::class, 'storeTariff'])->name('settings.tariffs.store');
    Route::patch('settings/catalog/tariffs/{tariff}', [CatalogController::class, 'updateTariff'])->name('settings.tariffs.update');
    Route::delete('settings/catalog/tariffs/{tariff}', [CatalogController::class, 'destroyTariff'])->name('settings.tariffs.destroy');
    Route::post('settings/catalog/discounts', [CatalogController::class, 'storeDiscount'])->name('settings.discounts.store');
    Route::patch('settings/catalog/discounts/{discount}', [CatalogController::class, 'updateDiscount'])->name('settings.discounts.update');
    Route::delete('settings/catalog/discounts/{discount}', [CatalogController::class, 'destroyDiscount'])->name('settings.discounts.destroy');
    Route::post('settings/catalog/aromas', [CatalogController::class, 'storeAroma'])->name('settings.aromas.store');
    Route::patch('settings/catalog/aromas/{aroma}', [CatalogController::class, 'updateAroma'])->name('settings.aromas.update');
    Route::delete('settings/catalog/aromas/{aroma}', [CatalogController::class, 'destroyAroma'])->name('settings.aromas.destroy');
});

Route::get('.well-known/passkey-endpoints', function () {
    return response()->json([
        'enroll' => route('security.edit'),
        'manage' => route('security.edit'),
    ]);
})->name('well-known.passkeys');
