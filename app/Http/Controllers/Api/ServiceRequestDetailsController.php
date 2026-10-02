<?php

namespace App\Http\Controllers\Api;

use App\Events\CourierDeliveryQueueUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\UpdateServiceRequestDetailsRequest;
use App\Models\Discount;
use App\Models\ServiceRequest;
use App\Models\Tariff;
use App\Services\Delivery\DeliveryQueueService;
use App\Services\Geocoding\GeocodingProviderInterface;
use Illuminate\Http\JsonResponse;

class ServiceRequestDetailsController extends Controller
{
    public function update(
        UpdateServiceRequestDetailsRequest $request,
        ServiceRequest $order,
        DeliveryQueueService $queueService,
        GeocodingProviderInterface $geocoder,
    ): JsonResponse {
        $data = $request->validated();
        $addressChanged = array_key_exists('address', $data) && $data['address'] !== $order->address;
        $attributes = $data;

        if ($addressChanged) {
            $coordinates = $geocoder->geocode($data['address']);
            $attributes['latitude'] = $coordinates?->latitude;
            $attributes['longitude'] = $coordinates?->longitude;
        }

        $pricingChanged = array_intersect(['area_square_meters', 'tariff_id', 'discount_id'], array_keys($data)) !== [];
        if ($pricingChanged) {
            $area = array_key_exists('area_square_meters', $data) ? $data['area_square_meters'] : $order->area_square_meters;
            $tariffId = array_key_exists('tariff_id', $data) ? $data['tariff_id'] : $order->tariff_id;
            $discountId = array_key_exists('discount_id', $data) ? $data['discount_id'] : $order->discount_id;

            if ($area !== null && $tariffId !== null) {
                $tariff = Tariff::query()->findOrFail($tariffId);
                $discount = $discountId === null ? null : Discount::query()->findOrFail($discountId);
                $billableArea = max((float) $area, 7.5);
                $attributes['total_amount'] = round(
                    $billableArea * (float) $tariff->price_per_square_meter * (1 - ((float) ($discount?->percentage ?? 0) / 100)),
                    2,
                );
            } else {
                $attributes['total_amount'] = null;
            }
        }

        $order->update($attributes);

        if ($addressChanged && $order->courier) {
            $courier = $order->courier;
            $queue = $queueService->recalculateForCourier($courier);
            event(new CourierDeliveryQueueUpdated($courier, $queue));
        }

        return response()->json(['updated' => true]);
    }
}
