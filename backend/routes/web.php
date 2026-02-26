<?php

use Illuminate\Support\Facades\Route;

// Include SEO routes
require __DIR__.'/seo.php';

/**
 * Redirect all web traffic to the frontend (Vite) app.
 * Change FRONTEND_URL in .env if your frontend runs elsewhere.
 */
Route::get('/{any?}', function () {
    $frontend = rtrim(env('FRONTEND_URL', 'http://localhost:5173'), '/');
    $fallback = rtrim(env('FRONTEND_URL_ALT', $frontend), '/');

    // Prefer primary; if missing scheme, default to http
    $primary = str_starts_with($frontend, 'http') ? $frontend : "http://{$frontend}";
    $alt = str_starts_with($fallback, 'http') ? $fallback : "http://{$fallback}";

    // Redirect to primary; if it fails in browser, user can try alt manually
    return redirect($primary ?? $alt);
})->where('any', '.*');
