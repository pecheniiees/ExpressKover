<?php

use App\Models\User;
use Laravel\Sanctum\Sanctum;

test('courier gps location is saved and denormalized onto the user', function () {
    $courier = User::factory()->courier()->create();

    Sanctum::actingAs($courier);

    $response = $this->postJson(route('api.courier.location.store'), [
        'latitude' => 51.12852,
        'longitude' => 71.43021,
    ]);

    $response->assertOk()->assertJson(['message' => 'Location recorded.']);

    $this->assertDatabaseHas('courier_locations', [
        'courier_id' => $courier->id,
        'latitude' => 51.12852,
        'longitude' => 71.43021,
    ]);

    $courier->refresh();
    expect((float) $courier->last_latitude)->toBe(51.12852)
        ->and((float) $courier->last_longitude)->toBe(71.43021)
        ->and($courier->last_location_recorded_at)->not->toBeNull();
});

test('invalid gps coordinates are rejected', function (array $payload, string $invalidField) {
    $courier = User::factory()->courier()->create();

    Sanctum::actingAs($courier);

    $response = $this->postJson(route('api.courier.location.store'), $payload);

    $response->assertStatus(422)->assertJsonValidationErrors([$invalidField]);
    $this->assertDatabaseCount('courier_locations', 0);
})->with([
    'latitude too high' => [['latitude' => 91, 'longitude' => 71.43021], 'latitude'],
    'latitude too low' => [['latitude' => -91, 'longitude' => 71.43021], 'latitude'],
    'longitude too high' => [['latitude' => 51.12852, 'longitude' => 181], 'longitude'],
    'longitude too low' => [['latitude' => 51.12852, 'longitude' => -181], 'longitude'],
    'missing latitude' => [['longitude' => 71.43021], 'latitude'],
]);

test('non-courier roles cannot record a gps location', function () {
    $operator = User::factory()->operator()->create();

    Sanctum::actingAs($operator);

    $response = $this->postJson(route('api.courier.location.store'), [
        'latitude' => 51.12852,
        'longitude' => 71.43021,
    ]);

    $response->assertForbidden();
});

test('guests cannot record a gps location', function () {
    $response = $this->postJson(route('api.courier.location.store'), [
        'latitude' => 51.12852,
        'longitude' => 71.43021,
    ]);

    $response->assertUnauthorized();
});
