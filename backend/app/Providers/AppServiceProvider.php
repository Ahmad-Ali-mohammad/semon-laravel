<?php

namespace App\Providers;

use App\Models\Article;
use App\Models\Order;
use App\Policies\ArticlePolicy;
use App\Policies\OrderPolicy;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Order::class, OrderPolicy::class);
        Gate::policy(Article::class, ArticlePolicy::class);

        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(120)->by(
                optional($request->user())->id ?: $request->ip()
            );
        });

        RateLimiter::for('auth', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });

        RateLimiter::for('password-reset', function (Request $request) {
            return Limit::perHour(3)->by($request->ip());
        });

        ResetPassword::createUrlUsing(function ($user, string $token) {
            $baseUrl = rtrim(config('app.frontend_url', config('app.url')), '/');
            $email = urlencode($user->getEmailForPasswordReset());

            return $baseUrl . '/?page=resetPassword&token=' . $token . '&email=' . $email;
        });
    }
}
