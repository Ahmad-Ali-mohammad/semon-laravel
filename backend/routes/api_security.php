<?php

use App\Http\Controllers\SecurityController;
use App\Http\Controllers\TwoFactorController;
use Illuminate\Support\Facades\Route;

// Security monitoring routes (admin only)
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin/security')->group(function () {
    Route::get('/dashboard', [SecurityController::class, 'dashboard']);
    
    // 2FA routes
    Route::get('/2fa/status', [TwoFactorController::class, 'getTwoFactorStatus']);
    Route::post('/2fa/setup', [TwoFactorController::class, 'setup']);
    Route::post('/2fa/enable', [TwoFactorController::class, 'enable']);
    Route::post('/2fa/disable', [TwoFactorController::class, 'disable']);
    Route::post('/2fa/verify', [TwoFactorController::class, 'verify']);
    
    // Security monitoring
    Route::get('/audit-logs', [SecurityController::class, 'getAuditLogs']);
    Route::get('/failed-logins', [SecurityController::class, 'getFailedLogins']);
    Route::get('/active-sessions', [SecurityController::class, 'getActiveSessions']);
    Route::get('/security-alerts', [SecurityController::class, 'getSecurityAlerts']);
    Route::get('/system-health', [SecurityController::class, 'getSystemHealth']);
    
    // Session management
    Route::post('/sessions/{id}/revoke', [SecurityController::class, 'revokeSession']);
    Route::post('/sessions/clear-all', [SecurityController::class, 'clearAllSessions']);
});
