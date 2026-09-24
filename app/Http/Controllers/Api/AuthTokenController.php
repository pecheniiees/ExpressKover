<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\CourierLoginRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthTokenController extends Controller
{
    /**
     * Issue a Sanctum personal access token for the courier mobile app.
     *
     * Restricted to the courier role: this endpoint exists to let the
     * React Native app authenticate, not as a general-purpose API login
     * for the existing session-based Inertia CRM.
     */
    public function store(CourierLoginRequest $request): JsonResponse
    {
        $courier = User::query()->where('phone', $request->validated('phone'))->first();

        if (! $courier || ! $courier->isCourier() || ! Hash::check($request->validated('password'), $courier->password)) {
            throw ValidationException::withMessages([
                'phone' => 'Неверный номер телефона или пароль.',
            ]);
        }

        $token = $courier->createToken('courier-mobile-app')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $courier->id,
                'name' => $courier->name,
                'phone' => $courier->phone,
            ],
        ]);
    }
}
