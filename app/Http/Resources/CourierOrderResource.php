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
            'latitude' => $this->resource->latitude !== null ? (float) $this->resource->latitude : null,
            'longitude' => $this->resource->longitude !== null ? (float) $this->resource->longitude : null,
            'status' => $this->resource->status,
            'queue_position' => $this->resource->queue_position,
            'distance_meters' => $this->resource->distance_meters !== null ? (int) round($this->resource->distance_meters) : null,
            'is_current' => $this->resource->status === 'in_progress',
        ];
    }
}
