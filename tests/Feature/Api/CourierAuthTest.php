<?php

use App\Models\User;

test('courier can log in and receive an api token', function () {
    $courier = User::factory()->courier()->create(['phone' => '+77001234567']);

    $response = $this->postJson(route('api.login'), [
        'phone' => '+77001234567',
        'password' => 'password',
    ]);

    $response->assertOk()->assertJsonStructure(['token', 'user' => ['id', 'name', 'phone']]);
    expect($response->json('token'))->not->toBeEmpty();
});

test('non-courier roles cannot log in through the courier endpoint', function () {
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
