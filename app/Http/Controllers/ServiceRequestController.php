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
use Illuminate\Http\RedirectResponse;
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

        return Inertia::render('service-requests/index', [
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
                    'comment' => $serviceRequest->comment,
                    'status' => $serviceRequest->status,
                    'created_at' => $serviceRequest->created_at?->format('d.m.Y H:i'),
                    'creator' => $serviceRequest->creator?->name,
                ]),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreServiceRequestRequest $request, GeocodingProviderInterface $geocoder): RedirectResponse
    {
        $data = $request->serviceRequestData();

        if ($data['latitude'] === null && $data['longitude'] === null) {
            $coordinates = $geocoder->geocode($data['address']);
            $data['latitude'] = $coordinates?->latitude;
            $data['longitude'] = $coordinates?->longitude;
        }

        ServiceRequest::create([
            ...$data,
            'created_by' => $request->user()->id,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Заявка создана.']);

        return to_route('service-requests.index');
    }

    public function update(UpdateServiceRequestRequest $request, ServiceRequest $serviceRequest, DeliveryQueueService $queueService, GeocodingProviderInterface $geocoder): RedirectResponse
    {
        $previousCourierId = $serviceRequest->courier_id;
        $data = $request->serviceRequestData();

        $addressChanged = $data['address'] !== $serviceRequest->address;
        $coordinatesProvided = array_key_exists('latitude', $data) || array_key_exists('longitude', $data);

        if ($addressChanged && ! $coordinatesProvided) {
            $coordinates = $geocoder->geocode($data['address']);
            $data['latitude'] = $coordinates?->latitude;
            $data['longitude'] = $coordinates?->longitude;
        }

        $serviceRequest->update($data);

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
