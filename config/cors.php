<?php

$allowedOrigins = env('CORS_ALLOWED_ORIGINS', '*');

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => $allowedOrigins === '*'
        ? ['*']
        : array_values(array_filter(array_map('trim', explode(',', $allowedOrigins)))),
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => ['Authorization'],
    'max_age' => 600,
    'supports_credentials' => false,
];
