<?php

namespace App\Models;

use Database\Factories\ServiceRequestFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $client_name
 * @property string $client_phone
 * @property string $address
 * @property float|null $area_square_meters
 * @property int|null $tariff_id
 * @property int|null $discount_id
 * @property float|null $total_amount
 * @property float|null $latitude
 * @property float|null $longitude
 * @property string|null $comment
 * @property string $status
 * @property int|null $courier_id
 * @property int|null $queue_position
 * @property int $created_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read float|null $distance_meters transient attribute set by DeliveryDistanceService for API responses; not persisted
 */
#[Fillable(['client_name', 'client_phone', 'address', 'area_square_meters', 'tariff_id', 'discount_id', 'total_amount', 'latitude', 'longitude', 'comment', 'status', 'courier_id', 'queue_position', 'created_by'])]
class ServiceRequest extends Model
{
    /** @use HasFactory<ServiceRequestFactory> */
    use HasFactory;

    /**
     * Status values that represent a delivery still active in a courier's queue.
     *
     * @var list<string>
     */
    public const ACTIVE_COURIER_STATUSES = ['assigned', 'accepted', 'in_progress'];

    /**
     * Statuses that can still be claimed from the shared courier feed.
     *
     * @var list<string>
     */
    public const AVAILABLE_COURIER_STATUSES = ['new', 'pending', 'ready', 'delivery'];

    /**
     * Status values that remove an order from a courier's active queue.
     *
     * @var list<string>
     */
    public const TERMINAL_STATUSES = ['delivered', 'completed', 'cancelled'];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'area_square_meters' => 'decimal:2',
            'total_amount' => 'decimal:2',
            'queue_position' => 'integer',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function courier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'courier_id');
    }

    public function hasKnownLocation(): bool
    {
        return $this->latitude !== null && $this->longitude !== null;
    }
}
