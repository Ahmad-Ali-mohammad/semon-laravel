<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Backup;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SecurityController extends Controller
{
    /**
     * Get security dashboard data
     */
    public function dashboard(Request $request)
    {
        // Only allow admin/manager users
        $user = $request->user();
        if (!$user || !in_array($user->role, ['admin', 'manager'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Get security metrics
        $data = [
            'overview' => $this->getSecurityOverview(),
            'recent_activities' => $this->getRecentActivities(),
            'failed_logins' => $this->getFailedLogins(),
            'active_sessions' => $this->getActiveSessions(),
            'security_alerts' => $this->getSecurityAlerts(),
            'system_health' => $this->getSystemHealth(),
        ];

        return response()->json($data);
    }

    /**
     * Get security overview statistics
     */
    private function getSecurityOverview(): array
    {
        $last24Hours = Carbon::now()->subHours(24);
        $last7Days = Carbon::now()->subDays(7);
        $last30Days = Carbon::now()->subDays(30);

        return [
            'total_users' => User::count(),
            'admin_users' => User::whereIn('role', ['admin', 'manager'])->count(),
            'users_with_2fa' => User::where('two_factor_enabled', true)->count(),
            'audit_logs_24h' => AuditLog::where('created_at', '>=', $last24Hours)->count(),
            'audit_logs_7d' => AuditLog::where('created_at', '>=', $last7Days)->count(),
            'audit_logs_30d' => AuditLog::where('created_at', '>=', $last30Days)->count(),
            'failed_login_attempts_24h' => $this->getFailedLoginCount($last24Hours),
            'high_risk_actions' => $this->getHighRiskActions($last24Hours),
        ];
    }

    /**
     * Get recent security activities
     */
    private function getRecentActivities(): array
    {
        return AuditLog::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'user' => $log->user ? [
                        'id' => $log->user->id,
                        'name' => $log->user->name,
                        'email' => $log->user->email,
                        'role' => $log->user->role,
                    ] : null,
                    'action' => $log->action,
                    'resource_type' => $log->resource_type,
                    'resource_id' => $log->resource_id,
                    'ip_address' => $log->ip_address,
                    'user_agent' => $log->user_agent,
                    'created_at' => $log->created_at->toISOString(),
                ];
            })
            ->toArray();
    }

    /**
     * Get failed login attempts
     */
    public function getFailedLogins(): array
    {
        $last24Hours = Carbon::now()->subHours(24);
        
        // Get failed login attempts from audit logs
        $failedLogins = AuditLog::where('action', 'failed_login')
            ->where('created_at', '>=', $last24Hours)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($log) {
                return [
                    'ip_address' => $log->ip_address,
                    'user_agent' => $log->user_agent,
                    'attempt_time' => $log->created_at->toISOString(),
                    'details' => $log->new_values ?? [],
                ];
            })
            ->toArray();

        // Get IP-based statistics
        $ipStats = AuditLog::where('action', 'failed_login')
            ->where('created_at', '>=', $last24Hours)
            ->selectRaw('ip_address, COUNT(*) as attempts')
            ->groupBy('ip_address')
            ->orderByDesc('attempts')
            ->limit(5)
            ->get()
            ->toArray();

        return [
            'recent_attempts' => $failedLogins,
            'ip_statistics' => $ipStats,
            'total_attempts_24h' => $this->getFailedLoginCount($last24Hours),
        ];
    }

    /**
     * Get failed login count
     */
    private function getFailedLoginCount($since): int
    {
        return Cache::remember('failed_login_count_' . $since->timestamp, 300, function () use ($since) {
            return AuditLog::where('action', 'failed_login')
                ->where('created_at', '>=', $since)
                ->count();
        });
    }

    /**
     * Get high risk actions
     */
    private function getHighRiskActions($since): array
    {
        $highRiskActions = ['delete', 'failed_login', 'permission_denied', 'multiple_login_attempts'];
        
        return AuditLog::whereIn('action', $highRiskActions)
            ->where('created_at', '>=', $since)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'action' => $log->action,
                    'user' => $log->user ? [
                        'id' => $log->user->id,
                        'name' => $log->user->name,
                        'email' => $log->user->email,
                    ] : null,
                    'ip_address' => $log->ip_address,
                    'created_at' => $log->created_at->toISOString(),
                ];
            })
            ->toArray();
    }

    /**
     * Get active sessions
     */
    public function getActiveSessions(): array
    {
        $activeSessions = [];
        
        // Get session data from cache (simplified approach)
        $sessionKeys = Cache::get('active_sessions', []);
        
        foreach ($sessionKeys as $sessionKey) {
            if (str_starts_with($sessionKey, 'session_timeout_')) {
                $userId = str_replace('session_timeout_', '', $sessionKey);
                $lastActivity = Cache::get($sessionKey);
                
                if ($lastActivity) {
                    $user = User::find($userId);
                    if ($user) {
                        $activeSessions[] = [
                            'user_id' => $userId,
                            'user_name' => $user->name,
                            'user_email' => $user->email,
                            'last_activity' => $lastActivity,
                            'session_age' => Carbon::parse($lastActivity)->diffForHumans(),
                        ];
                    }
                }
            }
        }

        return array_slice($activeSessions, 0, 10); // Limit to 10 most recent
    }

    /**
     * Get security alerts
     */
    public function getSecurityAlerts(): array
    {
        $alerts = [];
        
        // Check for multiple failed logins from same IP
        $recentFailures = AuditLog::where('action', 'failed_login')
            ->where('created_at', '>=', Carbon::now()->subHours(1))
            ->selectRaw('ip_address, COUNT(*) as count')
            ->groupBy('ip_address')
            ->having('count', '>=', 5)
            ->get();

        foreach ($recentFailures as $failure) {
            $alerts[] = [
                'type' => 'brute_force_attack',
                'severity' => 'high',
                'message' => "Multiple failed login attempts from IP: {$failure->ip_address}",
                'ip_address' => $failure->ip_address,
                'count' => $failure->count,
                'created_at' => Carbon::now()->toISOString(),
            ];
        }

        // Check for suspicious admin actions
        $suspiciousActions = AuditLog::whereIn('action', ['delete', 'permission_denied'])
            ->where('created_at', '>=', Carbon::now()->subHours(6))
            ->with('user')
            ->get();

        foreach ($suspiciousActions as $action) {
            if ($action->user && $action->user->role === 'admin') {
                $alerts[] = [
                    'type' => 'suspicious_admin_activity',
                    'severity' => 'medium',
                    'message' => "Suspicious admin action: {$action->action} on {$action->resource_type}",
                    'user_id' => $action->user->id,
                    'user_name' => $action->user->name,
                    'action' => $action->action,
                    'created_at' => $action->created_at->toISOString(),
                ];
            }
        }

        return array_slice($alerts, 0, 20); // Limit to 20 most recent
    }

    /**
     * Get system health metrics
     */
    public function getSystemHealth(): array
    {
        return [
            'database_connection' => $this->checkDatabaseHealth(),
            'cache_status' => $this->checkCacheHealth(),
            'disk_space' => $this->checkDiskSpace(),
            'memory_usage' => $this->getMemoryUsage(),
            'last_backup' => $this->getLastBackupTime(),
            'security_headers' => $this->checkSecurityHeaders(),
        ];
    }

    /**
     * Get audit logs with pagination
     */
    public function getAuditLogs(Request $request)
    {
        $perPage = (int) $request->query('per_page', 50);
        $perPage = max(10, min($perPage, 200));

        return response()->json(
            AuditLog::with('user')
                ->orderBy('created_at', 'desc')
                ->paginate($perPage)
        );
    }

    /**
     * Revoke a user session by user id
     */
    public function revokeSession(string $id)
    {
        $sessionKey = "session_timeout_{$id}";
        $warningKey = "session_warning_{$id}";

        Cache::forget($sessionKey);
        Cache::forget($warningKey);

        $activeSessions = Cache::get('active_sessions', []);
        if (is_array($activeSessions)) {
            $activeSessions = array_values(array_filter($activeSessions, function ($key) use ($id) {
                return $key !== "session_timeout_{$id}";
            }));
            Cache::put('active_sessions', $activeSessions, 3600);
        }

        return response()->json(['message' => 'Session revoked']);
    }

    /**
     * Clear all tracked sessions
     */
    public function clearAllSessions()
    {
        $activeSessions = Cache::get('active_sessions', []);
        if (is_array($activeSessions)) {
            foreach ($activeSessions as $key) {
                Cache::forget($key);
            }
        }
        Cache::forget('active_sessions');

        return response()->json(['message' => 'All sessions cleared']);
    }

    /**
     * Check database health
     */
    private function checkDatabaseHealth(): array
    {
        try {
            DB::connection()->getPdo();
            return ['status' => 'healthy', 'message' => 'Database connection successful'];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }

    /**
     * Check cache health
     */
    private function checkCacheHealth(): array
    {
        try {
            Cache::put('health_check', 'test', 10);
            $value = Cache::get('health_check');
            Cache::forget('health_check');
            
            return $value === 'test' 
                ? ['status' => 'healthy', 'message' => 'Cache working properly']
                : ['status' => 'error', 'message' => 'Cache not responding'];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }

    /**
     * Check disk space
     */
    private function checkDiskSpace(): array
    {
        $totalSpace = disk_total_space('/');
        $freeSpace = disk_free_space('/');
        $usedSpace = $totalSpace - $freeSpace;
        $usagePercent = ($usedSpace / $totalSpace) * 100;

        return [
            'total' => $this->formatBytes($totalSpace),
            'used' => $this->formatBytes($usedSpace),
            'free' => $this->formatBytes($freeSpace),
            'usage_percent' => round($usagePercent, 2),
            'status' => $usagePercent > 90 ? 'critical' : ($usagePercent > 80 ? 'warning' : 'healthy'),
        ];
    }

    /**
     * Get memory usage
     */
    private function getMemoryUsage(): array
    {
        $memoryUsage = memory_get_usage(true);
        $memoryLimit = ini_get('memory_limit');
        
        return [
            'current' => $this->formatBytes($memoryUsage),
            'peak' => $this->formatBytes(memory_get_peak_usage(true)),
            'limit' => $memoryLimit,
            'usage_percent' => round(($memoryUsage / $this->parseBytes($memoryLimit)) * 100, 2),
        ];
    }

    /**
     * Get last backup time
     */
    private function getLastBackupTime(): array
    {
        $latest = Backup::orderByDesc('created_at')->first();

        if (!$latest) {
            return [
                'last_backup' => null,
                'status' => 'not_configured',
                'message' => 'No backups found',
            ];
        }

        return [
            'last_backup' => optional($latest->created_at)->toISOString(),
            'status' => $latest->status,
            'type' => $latest->type,
            'size_bytes' => (int) $latest->size_bytes,
        ];
    }

    /**
     * Check security headers status
     */
    private function checkSecurityHeaders(): array
    {
        return [
            'csrf_protection' => config('app.env') === 'production' ? 'enabled' : 'development',
            'security_headers' => config('app.env') === 'production' ? 'enabled' : 'development',
            'ssl_status' => request()->secure() ? 'enabled' : 'disabled',
            'hsts_status' => config('app.env') === 'production' ? 'enabled' : 'development',
        ];
    }

    /**
     * Format bytes to human readable format
     */
    private function formatBytes($bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        
        $bytes /= (1 << (10 * $pow));
        
        return round($bytes, 2) . ' ' . $units[$pow];
    }

    /**
     * Parse bytes from memory limit string
     */
    private function parseBytes($val): int
    {
        $val = trim($val);
        $last = strtolower($val[strlen($val) - 1]);
        $val = (int) $val;
        
        switch ($last) {
            case 'g':
                $val *= 1024;
            case 'm':
                $val *= 1024;
            case 'k':
                $val *= 1024;
        }
        
        return $val;
    }
}
