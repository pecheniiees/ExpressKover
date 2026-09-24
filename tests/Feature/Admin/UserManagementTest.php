<?php

use App\Models\User;
use App\UserRole;
use Illuminate\Support\Facades\Hash;

test('guests are redirected from user management', function () {
    $response = $this->get(route('users.index'));

    $response->assertRedirect(route('login'));
});

test('non-admin users cannot manage users', function (UserRole $role) {
    $user = User::factory()->create(['role' => $role]);

    $response = $this->actingAs($user)->get(route('users.index'));

    $response->assertForbidden();
})->with([
    'оператор' => UserRole::Operator,
    'доставщик' => UserRole::Courier,
    'мойщик' => UserRole::Washer,
]);

test('admins can create users', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post(route('users.store'), [
        'name' => 'Курьер',
        'phone' => '700 088 06 89',
        'role' => UserRole::Courier->value,
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertRedirect(route('users.index'));
    $this->assertDatabaseHas('users', [
        'name' => 'Курьер',
        'phone' => '+77000880689',
        'role' => UserRole::Courier->value,
    ]);

    expect(Hash::check('password', User::query()->where('phone', '+77000880689')->sole()->password))->toBeTrue();
});

test('admins receive validation errors when creating an invalid user', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post(route('users.store'), []);

    $response->assertSessionHasErrors([
        'name' => 'Поле имя обязательно для заполнения.',
        'phone' => 'Поле номер телефона обязательно для заполнения.',
        'role' => 'Поле роль обязательно для заполнения.',
        'password' => 'Поле пароль обязательно для заполнения.',
    ]);
});

test('admins can update users', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->courier()->create();

    $response = $this->actingAs($admin)->put(route('users.update', $user), [
        'name' => 'Мойщик',
        'phone' => '700 088 06 89',
        'role' => UserRole::Washer->value,
    ]);

    $response->assertRedirect(route('users.index'));
    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => 'Мойщик',
        'phone' => '+77000880689',
        'role' => UserRole::Washer->value,
    ]);
});

test('admins can delete users', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();

    $response = $this->actingAs($admin)->delete(route('users.destroy', $user));

    $response->assertRedirect(route('users.index'));
    expect($user->fresh())->toBeNull();
});
