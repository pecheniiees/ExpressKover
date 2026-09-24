<?php

use App\Models\Aroma;
use App\Models\Discount;
use App\Models\Tariff;
use App\Models\User;
use App\UserRole;

test('guests are redirected from catalog settings', function () {
    $this->get(route('settings.catalog'))
        ->assertRedirect(route('login'));
});

test('operators can manage catalog settings and other roles cannot', function () {
    $operator = User::factory()->create(['role' => UserRole::Operator]);
    $washer = User::factory()->create(['role' => UserRole::Washer]);

    $this->actingAs($operator)->get(route('settings.catalog'))->assertOk();
    $this->actingAs($washer)->get(route('settings.catalog'))->assertForbidden();
});

test('catalog resources can be created, updated and deleted', function () {
    $admin = User::factory()->admin()->create();

    $tariffResponse = $this->actingAs($admin)->post(route('settings.tariffs.store'), [
        'name' => 'Стандарт',
        'price_per_square_meter' => 800,
        'description' => 'Базовая чистка',
    ]);
    $tariff = Tariff::query()->sole();
    $tariffResponse->assertRedirect(route('settings.catalog'));

    $this->actingAs($admin)->patch(route('settings.tariffs.update', $tariff), [
        'name' => 'Премиум',
        'price_per_square_meter' => 1200,
        'description' => 'Глубокая чистка',
    ]);
    expect($tariff->fresh()->name)->toBe('Премиум');

    $discountResponse = $this->actingAs($admin)->post(route('settings.discounts.store'), [
        'name' => 'Постоянный клиент',
        'percentage' => 5,
        'description' => 'Повторный заказ',
    ]);
    $discount = Discount::query()->sole();
    $discountResponse->assertRedirect(route('settings.catalog'));

    $this->actingAs($admin)->patch(route('settings.discounts.update', $discount), [
        'name' => 'Промокод',
        'percentage' => 10,
        'description' => null,
    ]);
    expect((float) $discount->fresh()->percentage)->toBe(10.0);

    $aromaResponse = $this->actingAs($admin)->post(route('settings.aromas.store'), [
        'name' => 'Orchid Dream',
        'description' => 'Цветочный аромат',
    ]);
    $aroma = Aroma::query()->sole();
    $aromaResponse->assertRedirect(route('settings.catalog'));

    $this->actingAs($admin)->patch(route('settings.aromas.update', $aroma), [
        'name' => 'Lavender',
        'description' => 'Свежий аромат',
    ]);
    expect($aroma->fresh()->name)->toBe('Lavender');

    $this->actingAs($admin)->delete(route('settings.tariffs.destroy', $tariff));
    $this->actingAs($admin)->delete(route('settings.discounts.destroy', $discount));
    $this->actingAs($admin)->delete(route('settings.aromas.destroy', $aroma));

    expect(Tariff::query()->count())->toBe(0)
        ->and(Discount::query()->count())->toBe(0)
        ->and(Aroma::query()->count())->toBe(0);
});

test('catalog validation rejects invalid values', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->post(route('settings.tariffs.store'), [
            'name' => '',
            'price_per_square_meter' => 0,
        ])
        ->assertSessionHasErrors(['name', 'price_per_square_meter']);

    $this->actingAs($admin)
        ->post(route('settings.discounts.store'), [
            'name' => 'Скидка',
            'percentage' => 101,
        ])
        ->assertSessionHasErrors('percentage');
});
