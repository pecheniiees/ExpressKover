<?php

namespace App\Http\Resources;

use App\Models\ServiceRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read ServiceRequest $resource
 */
class AdminOrderResource extends JsonResource
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
            'client_name' => $this->resource->client_name,
            'client_phone' => $this->resource->client_phone,
            'address' => $this->resource->address,
            'carpet_count' => $this->resource->carpet_count,
            'area_square_meters' => $this->resource->area_square_meters !== null ? (float) $this->resource->area_square_meters : null,
            'tariff_id' => $this->resource->tariff_id,
            'discount_id' => $this->resource->discount_id,
            'comment' => $this->resource->comment,
            'status' => $this->resource->status,
            'total_amount' => $this->resource->total_amount !== null ? (float) $this->resource->total_amount : null,
            'courier' => $this->resource->courier ? [
                'id' => $this->resource->courier->id,
                'name' => $this->resource->courier->name,
                'phone' => $this->resource->courier->phone,
            ] : null,
        ];
    }
}
