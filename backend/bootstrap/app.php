<?php

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            RateLimiter::for('api', function (Request $request) {
                return Limit::perMinute(120)->by(
                    optional($request->user())->id ?: $request->ip()
                );
            });

            // Rate limiting for authentication endpoints
            RateLimiter::for('auth', function (Request $request) {
                return Limit::perMinute(5)->by($request->ip());
            });

            // Rate limiting for password reset
            RateLimiter::for('password-reset', function (Request $request) {
                return Limit::perHour(3)->by($request->ip());
            });
        }
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->statefulApi();
        $middleware->api(append: [
            \Illuminate\Session\Middleware\StartSession::class,
            'throttle:api',
            \App\Http\Middleware\SecurityHeaders::class,
            \App\Http\Middleware\SessionTimeout::class,
        ]);
        $middleware->web(append: [
            \App\Http\Middleware\SecurityHeaders::class,
            \App\Http\Middleware\VerifyCsrfToken::class,
            \App\Http\Middleware\SessionTimeout::class,
            \App\Http\Middleware\SeoHeaders::class,
        ]);
        $middleware->alias([
            'admin' => \App\Http\Middleware\EnsureAdmin::class,
            'audit' => \App\Http\Middleware\LogAdminActions::class,
            'session_timeout' => \App\Http\Middleware\SessionTimeout::class,
        ]);
    })
    ->withExceptions(function (): void {
        //
    })->create();
