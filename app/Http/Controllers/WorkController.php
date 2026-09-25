<?php

namespace App\Http\Controllers;

use App\Models\ServiceRequest;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class WorkController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('view-service-requests');

        return Inertia::render('work/index', [
            'orders' => ServiceRequest::query()
                ->with('courier:id,name')
                ->whereNotIn('status', ServiceRequest::TERMINAL_STATUSES)
                ->orderByRaw('queue_position IS NULL, queue_position asc')
                ->latest()
                ->get()
                ->map(fn (ServiceRequest $order): array => [
                    'id' => $order->id,
                    'client_name' => $order->client_name,
                    'client_phone' => $order->client_phone,
                    'address' => $order->address,
                    'status' => $order->status,
                    'status_label' => $this->statusLabel($order->status),
                    'courier' => $order->courier?->name,
                    'queue_position' => $order->queue_position,
                    'created_at' => $order->created_at?->format('d.m.Y H:i'),
                ]),
        ]);
    }

    private function statusLabel(string $status): string
    {
        return [
            'new' => 'Новая',
            'pending' => 'Ожидает забора',
            'assigned' => 'Забор',
            'accepted' => 'Принята курьером',
            'in_progress' => 'В мойке',
            'ready' => 'Готова к доставке',
            'delivery' => 'Доставка',
        ][$status] ?? $status;
    }
}
