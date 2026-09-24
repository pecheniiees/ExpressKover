<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class NormalizePhoneNumber
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): mixed
    {
        if ($request->has('phone')) {
            $digits = preg_replace('/\D+/', '', (string) $request->input('phone')) ?? '';

            if (strlen($digits) === 11 && str_starts_with($digits, '7')) {
                $digits = substr($digits, 1);
            }

            $request->merge(['phone' => '+7'.$digits]);
        }

        return $next($request);
    }
}
