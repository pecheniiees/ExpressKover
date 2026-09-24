<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\StoreAromaRequest;
use App\Http\Requests\Settings\StoreDiscountRequest;
use App\Http\Requests\Settings\StoreTariffRequest;
use App\Http\Requests\Settings\UpdateAromaRequest;
use App\Http\Requests\Settings\UpdateDiscountRequest;
use App\Http\Requests\Settings\UpdateTariffRequest;
use App\Models\Aroma;
use App\Models\Discount;
use App\Models\Tariff;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless(in_array($request->user()?->role->value, ['admin', 'operator'], true), 403);

        return Inertia::render('settings/catalog', [
            'tariffs' => Tariff::query()->orderBy('name')->get(),
            'discounts' => Discount::query()->orderBy('name')->get(),
            'aromas' => Aroma::query()->orderBy('name')->get(),
        ]);
    }

    public function storeTariff(StoreTariffRequest $request): RedirectResponse
    {
        Tariff::create($request->validated());

        return to_route('settings.catalog');
    }

    public function updateTariff(UpdateTariffRequest $request, Tariff $tariff): RedirectResponse
    {
        $tariff->update($request->validated());

        return to_route('settings.catalog');
    }

    public function destroyTariff(Tariff $tariff): RedirectResponse
    {
        $tariff->delete();

        return to_route('settings.catalog');
    }

    public function storeDiscount(StoreDiscountRequest $request): RedirectResponse
    {
        Discount::create($request->validated());

        return to_route('settings.catalog');
    }

    public function updateDiscount(UpdateDiscountRequest $request, Discount $discount): RedirectResponse
    {
        $discount->update($request->validated());

        return to_route('settings.catalog');
    }

    public function destroyDiscount(Discount $discount): RedirectResponse
    {
        $discount->delete();

        return to_route('settings.catalog');
    }

    public function storeAroma(StoreAromaRequest $request): RedirectResponse
    {
        Aroma::create($request->validated());

        return to_route('settings.catalog');
    }

    public function updateAroma(UpdateAromaRequest $request, Aroma $aroma): RedirectResponse
    {
        $aroma->update($request->validated());

        return to_route('settings.catalog');
    }

    public function destroyAroma(Aroma $aroma): RedirectResponse
    {
        $aroma->delete();

        return to_route('settings.catalog');
    }
}
