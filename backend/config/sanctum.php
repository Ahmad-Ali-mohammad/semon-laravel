<?php

return [
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 
        'localhost,127.0.0.1,localhost:5173,127.0.0.1:5173,localhost:5174,127.0.0.1:5174,127.0.0.1:8000,localhost:8000,127.0.0.1:5175,localhost:5175')),
    'expiration' => null,
    'middleware' => [
        'verify_csrf_token' => App\Http\Middleware\VerifyCsrfToken::class,
        'encrypt_cookies' => Illuminate\Cookie\Middleware\EncryptCookies::class,
    ],
];
