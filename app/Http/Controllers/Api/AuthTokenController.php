<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\CourierLoginRequest;
use App\Models\User;
use App\UserRole;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthTokenController extends Controller
{
    /**
     * Issue a Sanctum personal access token for the courier/admin mobile app.
     *
     * This endpoint is separate from the session-based Inertia CRM login.
     */
    public function store(CourierLoginRequest $request): JsonResponse
    {
        $user = User::query()->where('phone', $request->validated('phone'))->first();

        if (! $user
            || ! in_array($user->role, [UserRole::Courier, UserRole::Admin], true)
            || ! Hash::check($request->validated('password'), $user->password)) {
            throw ValidationException::withMessages([
                'phone' => 'Неверный номер телефона или пароль.',
            ]);
        }

        $token = $user->createToken('mobile-app')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'phone' => $user->phone,
                'role' => $user->role->value,
            ],
        ]);
    }
}
