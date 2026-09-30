<?php

use App\Models\CourierPushToken;
use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Laravel\Sanctum\Sanctum;

test('courier can register and remove only their own push token', function () {
    $courier = User::factory()->courier()->create();
    $otherCourier = User::factory()->courier()->create();
    $token = 'ExpoPushToken[courier-device]';

    Sanctum::actingAs($courier);

    $this->postJson(route('api.courier.push-token.store'), ['expo_push_token' => $token])
        ->assertOk()
        ->assertJson(['registered' => true]);

    $pushToken = CourierPushToken::query()->where('expo_push_token', $token)->sole();
    expect($pushToken->user_id)->toBe($courier->id);

    Sanctum::actingAs($otherCourier);
    $this->deleteJson(route('api.courier.push-token.destroy'), ['expo_push_token' => $token])
        ->assertOk();
    $this->assertDatabaseHas('courier_push_tokens', ['id' => $pushToken->id]);

    Sanctum::actingAs($courier);
    $this->deleteJson(route('api.courier.push-token.destroy'), ['expo_push_token' => $token])
        ->assertOk()
        ->assertJson(['registered' => false]);
    $this->assertDatabaseMissing('courier_push_tokens', ['id' => $pushToken->id]);
});

test('admin cannot register a courier push token', function () {
    Sanctum::actingAs(User::factory()->admin()->create());

    $this->postJson(route('api.courier.push-token.store'), [
        'expo_push_token' => 'ExpoPushToken[admin-device]',
    ])->assertForbidden();
});

test('marking an order ready notifies courier tokens but not admin tokens', function () {
    $admin = User::factory()->admin()->create();
    $courier = User::factory()->courier()->create();
    CourierPushToken::query()->create([
        'user_id' => $courier->id,
        'expo_push_token' => 'ExpoPushToken[courier-device]',
    ]);
    CourierPushToken::query()->create([
        'user_id' => $admin->id,
        'expo_push_token' => 'ExpoPushToken[admin-device]',
    ]);
    $order = ServiceRequest::factory()->create(['status' => 'in_progress']);
    Http::fake(['https://exp.host/--/api/v2/push/send' => Http::response([
        'data' => [['status' => 'ok']],
    ])]);
    Sanctum::actingAs($admin);

    $this->patchJson(route('api.admin.orders.ready', $order))->assertOk();

    Http::assertSent(fn (Request $request): bool => $request->data()[0]['to'] === 'ExpoPushToken[courier-device]'
        && $request->data()[0]['channelId'] === 'orders'
        && $request->data()[0]['data']['order_id'] === $order->id);
    Http::assertSentCount(1);
});

test('editing an already available order does not send a duplicate notification', function () {
    $operator = User::factory()->operator()->create();
    $order = ServiceRequest::factory()->create([
        'created_by' => $operator->id,
        'status' => 'new',
        'courier_id' => null,
    ]);
    Http::fake();

    $this->actingAs($operator)->patch(route('service-requests.update', $order), [
        'client_name' => $order->client_name,
        'phone' => $order->client_phone,
        'address' => $order->address,
        'status' => 'new',
    ])->assertRedirect(route('service-requests.index'));

    Http::assertNothingSent();
});
