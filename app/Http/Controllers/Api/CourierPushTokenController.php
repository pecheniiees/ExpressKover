<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CourierPushToken;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CourierPushTokenController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $courier = $request->user();
        abort_unless($courier?->isCourier(), 403);

        $validated = $request->validate([
            'expo_push_token' => ['required', 'string', 'max:255', 'regex:/^(ExponentPushToken|ExpoPushToken)\[[^\]\r\n]+\]$/'],
        ]);

        CourierPushToken::query()->updateOrCreate(
            ['expo_push_token' => $validated['expo_push_token']],
            ['user_id' => $courier->id],
        );

        return response()->json(['registered' => true]);
    }

    public function destroy(Request $request): JsonResponse
    {
        $courier = $request->user();
        abort_unless($courier?->isCourier(), 403);

        $validated = $request->validate([
            'expo_push_token' => ['required', 'string', 'max:255', 'regex:/^(ExponentPushToken|ExpoPushToken)\[[^\]\r\n]+\]$/'],
        ]);

        $courier->courierPushTokens()
            ->where('expo_push_token', $validated['expo_push_token'])
            ->delete();

        return response()->json(['registered' => false]);
    }
}
