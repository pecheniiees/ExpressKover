<?php

namespace App\Services\Notifications;

use App\Models\CourierPushToken;
use App\Models\ServiceRequest;
use App\UserRole;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class CourierPushNotificationService
{
    private const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

    /**
     * Notify courier devices about an order that is ready to be claimed.
     */
    public function notifyAvailableOrder(ServiceRequest $order): void
    {
        if ($order->courier_id !== null || ! in_array($order->status, ServiceRequest::AVAILABLE_COURIER_STATUSES, true)) {
            return;
        }

        $tokens = CourierPushToken::query()
            ->whereHas('user', fn (Builder $query) => $query->where('role', UserRole::Courier))
            ->orderBy('id')
            ->pluck('expo_push_token')
            ->all();

        foreach (array_chunk($tokens, 100) as $tokenBatch) {
            $messages = array_map(fn (string $token): array => [
                'to' => $token,
                'title' => 'Новый заказ Express Kover',
                'body' => $order->status === 'ready'
                    ? 'Готовый заказ ждёт доставки клиенту'
                    : 'Появилась новая заявка для курьера',
                'sound' => 'default',
                'priority' => 'high',
                'channelId' => 'orders',
                'data' => [
                    'type' => 'courier_order_available',
                    'order_id' => $order->id,
                    'status' => $order->status,
                ],
            ], $tokenBatch);

            try {
                $response = Http::acceptJson()
                    ->timeout(5)
                    ->post(self::EXPO_PUSH_URL, $messages);
            } catch (Throwable $exception) {
                Log::warning('Failed to send courier order push notification.', [
                    'service_request_id' => $order->id,
                    'exception' => $exception::class,
                ]);

                continue;
            }

            if (! $response->successful()) {
                Log::warning('Expo push service rejected courier order notifications.', [
                    'service_request_id' => $order->id,
                    'status' => $response->status(),
                ]);

                continue;
            }

            foreach ($response->json('data', []) as $index => $ticket) {
                if (($ticket['details']['error'] ?? null) === 'DeviceNotRegistered' && isset($tokenBatch[$index])) {
                    CourierPushToken::query()->where('expo_push_token', $tokenBatch[$index])->delete();
                }
            }
        }
    }
}
