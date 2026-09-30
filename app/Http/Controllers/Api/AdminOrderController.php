<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminOrderResource;
use App\Models\ServiceRequest;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminOrderController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return AdminOrderResource::collection(
            ServiceRequest::query()
                ->with('courier:id,name,phone')
                ->latest()
                ->get(),
        );
    }
}
