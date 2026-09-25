<?php

namespace App\Providers;

use App\Models\ServiceRequest;
use App\Models\User;
use App\Services\Delivery\HaversineDistanceProvider;
use App\Services\Delivery\RouteDistanceProviderInterface;
use App\Services\Geocoding\GeocodingProviderInterface;
use App\Services\Geocoding\NominatimGeocodingProvider;
use App\UserRole;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(RouteDistanceProviderInterface::class, HaversineDistanceProvider::class);
        $this->app->bind(GeocodingProviderInterface::class, NominatimGeocodingProvider::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();

        Gate::define('manage-users', fn (User $user): bool => $user->isAdmin());
        Gate::define('view-service-requests', fn (User $user): bool => in_array($user->role, [UserRole::Admin, UserRole::Operator], true));
        Gate::define('create-service-requests', fn (User $user): bool => in_array($user->role, [UserRole::Admin, UserRole::Operator], true));
        Gate::define('delete-service-requests', fn (User $user): bool => $user->isAdmin());

        Gate::define('record-courier-location', fn (User $user): bool => $user->isCourier());
        Gate::define('view-own-courier-queue', fn (User $user): bool => $user->isCourier());
        Gate::define('claim-service-request', fn (User $user): bool => $user->isCourier());
        Gate::define('update-own-service-request-status', fn (User $user, ServiceRequest $serviceRequest): bool => $user->isCourier() && $user->id === $serviceRequest->courier_id);
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
