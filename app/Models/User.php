<?php

namespace App\Models;

use App\UserRole;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;

/**
 * @property int $id
 * @property string $name
 * @property string|null $phone
 * @property UserRole $role
 * @property string $password
 * @property float|null $last_latitude
 * @property float|null $last_longitude
 * @property Carbon|null $last_location_recorded_at
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'phone', 'role', 'password'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'role' => UserRole::class,
            'password' => 'hashed',
            'last_latitude' => 'decimal:7',
            'last_longitude' => 'decimal:7',
            'last_location_recorded_at' => 'datetime',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === UserRole::Admin;
    }

    public function isCourier(): bool
    {
        return $this->role === UserRole::Courier;
    }

    /**
     * GPS position history reported by this courier.
     */
    public function courierLocations(): HasMany
    {
        return $this->hasMany(CourierLocation::class, 'courier_id');
    }

    /**
     * Service requests currently or previously assigned to this courier.
     */
    public function courierServiceRequests(): HasMany
    {
        return $this->hasMany(ServiceRequest::class, 'courier_id');
    }

    public function hasKnownLocation(): bool
    {
        return $this->last_latitude !== null && $this->last_longitude !== null;
    }

    public function getPasskeyUsername(): string
    {
        return (string) $this->phone;
    }
}
