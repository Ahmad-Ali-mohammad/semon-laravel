<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

class SessionTimeout
{
    private const SESSION_TIMEOUT = 120; // 2 hours in minutes
    private const WARNING_TIMEOUT = 105; // 1 hour 45 minutes

    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        
        if (!$user) {
            return $next($request);
        }

        $sessionKey = "session_timeout_{$user->id}";
        $warningKey = "session_warning_{$user->id}";

        // Get last activity time
        $lastActivity = Cache::get($sessionKey);
        
        if (!$lastActivity) {
            // Set initial activity time
            Cache::put($sessionKey, now(), now()->addMinutes(self::SESSION_TIMEOUT));
            return $next($request);
        }

        $lastActivity = Carbon::parse($lastActivity);
        $now = now();

        // Check if session has expired
        if ($now->diffInMinutes($lastActivity) >= self::SESSION_TIMEOUT) {
            Auth::logout();
            Cache::forget($sessionKey);
            Cache::forget($warningKey);
            
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Session expired due to inactivity',
                    'code' => 'SESSION_EXPIRED'
                ], 401);
            }
            
            return redirect('/login')->with('message', 'Session expired due to inactivity. Please login again.');
        }

        // Check if we should show warning (only for web requests, not API)
        if (!$request->expectsJson() && $now->diffInMinutes($lastActivity) >= self::WARNING_TIMEOUT) {
            $warningShown = Cache::get($warningKey);
            
            if (!$warningShown) {
                Cache::put($warningKey, true, now()->addMinutes(15));
                
                // Add warning to response
                $response = $next($request);
                $response->headers->set('X-Session-Warning', 'Your session will expire soon due to inactivity.');
                
                return $response;
            }
        }

        // Update last activity time
        Cache::put($sessionKey, $now, now()->addMinutes(self::SESSION_TIMEOUT));

        return $next($request);
    }
}
