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
