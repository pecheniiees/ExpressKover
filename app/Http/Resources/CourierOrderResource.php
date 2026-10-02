<?php

namespace App\Http\Resources;

use App\Models\ServiceRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read ServiceRequest $resource
 */
class CourierOrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'address' => $this->resource->address,
            'client_phone' => $this->resource->client_phone,
            'latitude' => $this->resource->latitude !== null ? (float) $this->resource->latitude : null,
            'longitude' => $this->resource->longitude !== null ? (float) $this->resource->longitude : null,
            'status' => $this->resource->status,
            'carpet_count' => $this->resource->carpet_count,
            'area_square_meters' => $this->resource->area_square_meters !== null ? (float) $this->resource->area_square_meters : null,
            'tariff_id' => $this->resource->tariff_id,
            'total_amount' => $this->resource->total_amount !== null ? (float) $this->resource->total_amount : null,
            'queue_position' => $this->resource->queue_position,
            'distance_meters' => $this->resource->distance_meters !== null ? (int) round($this->resource->distance_meters) : null,
            'is_current' => $this->resource->courier_id !== null
                && ($this->resource->status === 'in_progress'
                    || ($this->resource->status === 'delivery' && $this->resource->queue_position === 0)),
        ];
    }
}
