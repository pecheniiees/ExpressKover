<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceRequestRequest;
use App\Http\Requests\UpdateServiceRequestRequest;
use App\Models\Aroma;
use App\Models\Discount;
use App\Models\ServiceRequest;
use App\Models\Tariff;
use App\Models\User;
use App\Services\Delivery\DeliveryQueueService;
use App\Services\Geocoding\GeocodingProviderInterface;
use App\Services\Notifications\CourierPushNotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ServiceRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        Gate::authorize('view-service-requests');

        $statusCounts = ServiceRequest::query()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return Inertia::render('service-requests/index', [
            'summary' => [
                'all' => (int) $statusCounts->sum(),
                'pickup' => (int) ($statusCounts['new'] ?? 0) + (int) ($statusCounts['pending'] ?? 0),
                'washing' => (int) ($statusCounts['in_progress'] ?? 0),
                'ready' => (int) ($statusCounts['ready'] ?? 0),
                'delivery' => (int) ($statusCounts['delivery'] ?? 0),
                'completed' => (int) ($statusCounts['completed'] ?? 0) + (int) ($statusCounts['delivered'] ?? 0),
                'cancelled' => (int) ($statusCounts['cancelled'] ?? 0),
            ],
            'canDelete' => request()->user()?->can('delete-service-requests') ?? false,
            'tariffs' => Tariff::query()->orderBy('name')->get(['id', 'name', 'price_per_square_meter']),
            'discounts' => Discount::query()->orderBy('name')->get(['id', 'name', 'percentage']),
            'aromas' => Aroma::query()->orderBy('name')->get(['id', 'name']),
            'serviceRequests' => ServiceRequest::query()
                ->with('creator:id,name')
                ->latest()
                ->get()
                ->map(fn (ServiceRequest $serviceRequest): array => [
                    'id' => $serviceRequest->id,
                    'client_name' => $serviceRequest->client_name,
                    'client_phone' => $serviceRequest->client_phone,
                    'address' => $serviceRequest->address,
                    'area_square_meters' => $serviceRequest->area_square_meters,
                    'total_amount' => $serviceRequest->total_amount,
                    'comment' => $serviceRequest->comment,
                    'status' => $serviceRequest->status,
                    'created_at' => $serviceRequest->created_at?->format('d.m.Y H:i'),
                    'creator' => $serviceRequest->creator?->name,
                ]),
        ]);
    }

    public function history(Request $request): Response
    {
        Gate::authorize('view-service-requests');

        $search = $request->string('search')->trim()->toString();
        $statusCounts = ServiceRequest::query()
            ->whereIn('status', ServiceRequest::TERMINAL_STATUSES)
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $orders = ServiceRequest::query()
            ->with('courier:id,name')
            ->whereIn('status', ServiceRequest::TERMINAL_STATUSES)
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($query) use ($search): void {
                    $query
                        ->where('client_name', 'like', "%{$search}%")
                        ->orWhere('client_phone', 'like', "%{$search}%")
                        ->orWhere('address', 'like', "%{$search}%");
                });
            })
            ->latest('updated_at')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (ServiceRequest $order): array => [
                'id' => $order->id,
                'client_name' => $order->client_name,
                'client_phone' => $order->client_phone,
                'address' => $order->address,
                'status' => $order->status,
                'courier' => $order->courier?->name,
                'amount' => $order->total_amount !== null ? (float) $order->total_amount : null,
                'updated_at' => $order->updated_at?->format('d.m.Y H:i'),
            ]);

        return Inertia::render('order-history/index', [
            'orders' => $orders,
            'summary' => [
                'total' => (int) $statusCounts->sum(),
                'completed' => (int) ($statusCounts['completed'] ?? 0) + (int) ($statusCounts['delivered'] ?? 0),
                'cancelled' => (int) ($statusCounts['cancelled'] ?? 0),
            ],
            'filters' => ['search' => $search],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreServiceRequestRequest $request, GeocodingProviderInterface $geocoder, CourierPushNotificationService $pushNotifications): RedirectResponse
    {
        $data = $request->serviceRequestData();
        $tariff = Tariff::query()->findOrFail($data['tariff_id']);
        $discount = $data['discount_id'] === null ? null : Discount::query()->findOrFail($data['discount_id']);
        $billableArea = max($data['area_square_meters'], 7.5);
        $data['total_amount'] = round($billableArea * (float) $tariff->price_per_square_meter * (1 - ((float) ($discount?->percentage ?? 0) / 100)), 2);

        if ($data['latitude'] === null && $data['longitude'] === null) {
            $coordinates = $geocoder->geocode($data['address']);
            $data['latitude'] = $coordinates?->latitude;
            $data['longitude'] = $coordinates?->longitude;
        }

        $data['washing_started_at'] = $data['status'] === 'in_progress' ? now() : null;

        $serviceRequest = ServiceRequest::create([
            ...$data,
            'created_by' => $request->user()->id,
        ]);
        $pushNotifications->notifyAvailableOrder($serviceRequest);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Заявка создана.']);

        return to_route('service-requests.index');
    }

    public function update(UpdateServiceRequestRequest $request, ServiceRequest $serviceRequest, DeliveryQueueService $queueService, GeocodingProviderInterface $geocoder, CourierPushNotificationService $pushNotifications): RedirectResponse
    {
        $previousCourierId = $serviceRequest->courier_id;
        $wasAvailable = $previousCourierId === null && in_array($serviceRequest->status, ServiceRequest::AVAILABLE_COURIER_STATUSES, true);
        $data = $request->serviceRequestData();

        $addressChanged = $data['address'] !== $serviceRequest->address;
        $coordinatesProvided = array_key_exists('latitude', $data) || array_key_exists('longitude', $data);

        if ($addressChanged && ! $coordinatesProvided) {
            $coordinates = $geocoder->geocode($data['address']);
            $data['latitude'] = $coordinates?->latitude;
            $data['longitude'] = $coordinates?->longitude;
        }

        $data['washing_started_at'] = $data['status'] === 'in_progress'
            ? ($serviceRequest->status === 'in_progress' && $serviceRequest->washing_started_at ? $serviceRequest->washing_started_at : now())
            : null;

        if ($data['status'] === 'ready') {
            $data['courier_id'] = null;
            $data['queue_position'] = null;
        }

        $serviceRequest->update($data);

        if (! $wasAvailable && $serviceRequest->courier_id === null && in_array($serviceRequest->status, ServiceRequest::AVAILABLE_COURIER_STATUSES, true)) {
            $pushNotifications->notifyAvailableOrder($serviceRequest);
        }

        $this->recalculateQueuesAfterAssignmentChange($serviceRequest, $previousCourierId, $queueService);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Заявка обновлена.']);

        return to_route('service-requests.index');
    }

    /**
     * When an update (re)assigns or unassigns a courier, keep both the newly
     * assigned courier's and the previously assigned courier's delivery
     * queues consistent. A no-op when courier_id was not part of the update.
     */
    private function recalculateQueuesAfterAssignmentChange(ServiceRequest $serviceRequest, ?int $previousCourierId, DeliveryQueueService $queueService): void
    {
        $newCourierId = $serviceRequest->courier_id;

        if ($newCourierId === $previousCourierId) {
            return;
        }

        if ($newCourierId !== null) {
            /** @var User $newCourier */
            $newCourier = User::query()->findOrFail($newCourierId);
            $queueService->recalculateForCourier($newCourier);
        }

        if ($previousCourierId !== null) {
            $previousCourier = User::query()->find($previousCourierId);

            if ($previousCourier) {
                $queueService->recalculateForCourier($previousCourier);
            }
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ServiceRequest $serviceRequest): RedirectResponse
    {
        Gate::authorize('delete-service-requests');

        $serviceRequest->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Заявка удалена.']);

        return to_route('service-requests.index');
    }
}
