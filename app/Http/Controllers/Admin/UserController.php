<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('admin/users/index', [
            'users' => User::query()
                ->select(['id', 'name', 'phone', 'role'])
                ->orderBy('name')
                ->get()
                ->map(fn (User $user): array => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'phone' => $user->phone,
                    'role' => $user->role->value,
                ]),
        ]);
    }

    /**
     * Display clients collected from existing service requests.
     */
    public function clients(): Response
    {
        return Inertia::render('admin/clients/index', [
            'clients' => ServiceRequest::query()
                ->select(['client_name', 'client_phone', 'address'])
                ->whereNotNull('client_phone')
                ->orderBy('client_name')
                ->get()
                ->groupBy('client_phone')
                ->map(fn ($requests): array => [
                    'name' => $requests->first()->client_name,
                    'phone' => $requests->first()->client_phone,
                    'address' => $requests->first()->address,
                    'orders_count' => $requests->count(),
                ])
                ->values(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        User::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Пользователь создан.']);

        return to_route('users.index');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $attributes = $request->safe()->except('password');

        if ($request->filled('password')) {
            $attributes['password'] = $request->input('password');
        }

        $user->update($attributes);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Пользователь обновлён.']);

        return to_route('users.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user): RedirectResponse
    {
        $user->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Пользователь удалён.']);

        return to_route('users.index');
    }
}
