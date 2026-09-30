<?php

use App\Models\User;

test('courier can log in and receive an api token', function () {
    $courier = User::factory()->courier()->create(['phone' => '+77001234567']);

    $response = $this->postJson(route('api.login'), [
        'phone' => '+77001234567',
        'password' => 'password',
    ]);

    $response->assertOk()->assertJsonStructure(['token', 'user' => ['id', 'name', 'phone', 'role']]);
    $response->assertJsonPath('user.role', 'courier');
    expect($response->json('token'))->not->toBeEmpty();
});

test('admin can log in to the mobile app and receive an api token', function () {
    User::factory()->admin()->create(['phone' => '+77001234567']);

    $response = $this->postJson(route('api.login'), [
        'phone' => '+77001234567',
        'password' => 'password',
    ]);

    $response->assertOk()
        ->assertJsonStructure(['token', 'user' => ['id', 'name', 'phone', 'role']])
        ->assertJsonPath('user.role', 'admin');
    expect($response->json('token'))->not->toBeEmpty();
});

test('admin can log in with a local Kazakhstan phone format', function () {
    User::factory()->admin()->create(['phone' => '+77001234567']);

    $response = $this->postJson(route('api.login'), [
        'phone' => '87001234567',
        'password' => 'password',
    ]);

    $response->assertOk()->assertJsonPath('user.role', 'admin');
});

test('roles other than courier and admin cannot log in through the mobile endpoint', function () {
    User::factory()->operator()->create(['phone' => '+77001234567']);

    $response = $this->postJson(route('api.login'), [
        'phone' => '+77001234567',
        'password' => 'password',
    ]);

    $response->assertStatus(422)->assertJsonValidationErrors(['phone']);
});

test('invalid courier credentials are rejected', function () {
    User::factory()->courier()->create(['phone' => '+77001234567']);

    $response = $this->postJson(route('api.login'), [
        'phone' => '+77001234567',
        'password' => 'wrong-password',
    ]);

    $response->assertStatus(422)->assertJsonValidationErrors(['phone']);
});
