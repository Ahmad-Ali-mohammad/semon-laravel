<?php

namespace App\Http\Middleware;

use App\Models\AuditLog;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LogAdminActions
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only log admin actions
        $user = $request->user();
        if (!$user || !in_array($user->role, ['admin', 'manager'])) {
            return $response;
        }

        // Log specific admin actions
        $method = $request->method();
        $path = $request->path();
        
        // Determine action type
        $action = $this->getActionType($method, $path);
        $resourceInfo = $this->getResourceInfo($path);

        if ($action) {
            AuditLog::logAction(
                userId: $user->id,
                action: $action,
                resourceType: $resourceInfo['type'],
                resourceId: $resourceInfo['id'],
                oldValues: $this->getOldValues($request),
                newValues: $this->getNewValues($request, $response),
                ipAddress: $request->ip(),
                userAgent: $request->userAgent()
            );
        }

        return $response;
    }

    private function getActionType(string $method, string $path): ?string
    {
        if ($method === 'POST' && str_contains($path, '/admin/')) {
            return 'create';
        }
        
        if ($method === 'PUT' || $method === 'PATCH') {
            return 'update';
        }
        
        if ($method === 'DELETE') {
            return 'delete';
        }
        
        if (str_contains($path, '/auth/login')) {
            return 'login';
        }
        
        if (str_contains($path, '/auth/logout')) {
            return 'logout';
        }
        
        return null;
    }

    private function getResourceInfo(string $path): array
    {
        $patterns = [
            '/admin/users/(\d+)' => ['type' => 'user', 'id' => '$1'],
            '/admin/products/(\d+)' => ['type' => 'product', 'id' => '$1'],
            '/admin/orders/(\d+)' => ['type' => 'order', 'id' => '$1'],
            '/admin/supplies/(\d+)' => ['type' => 'supply', 'id' => '$1'],
            '/admin/articles/(\d+)' => ['type' => 'article', 'id' => '$1'],
        ];

        foreach ($patterns as $pattern => $info) {
            if (preg_match('#^' . $pattern . '#', $path, $matches)) {
                return [
                    'type' => $info['type'],
                    'id' => (int) $matches[1]
                ];
            }
        }

        return ['type' => null, 'id' => null];
    }

    private function getOldValues(Request $request): ?array
    {
        // For PUT/PATCH requests, we'd need to fetch the original record
        // This is a simplified implementation
        return null;
    }

    private function getNewValues(Request $request, Response $response): ?array
    {
        if ($request->method() === 'POST') {
            return $request->except(['password', '_token', '_method']);
        }
        
        if ($request->method() === 'PUT' || $request->method() === 'PATCH') {
            return $request->except(['password', '_token', '_method']);
        }
        
        return null;
    }
}
