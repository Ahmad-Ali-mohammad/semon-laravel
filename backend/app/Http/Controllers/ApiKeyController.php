<?php

namespace App\Http\Controllers;

use App\Models\ApiKey;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ApiKeyController extends Controller
{
    public function index()
    {
        $keys = ApiKey::orderByDesc('created_at')->get();

        return response()->json($keys->map(function (ApiKey $key) {
            return $this->formatKey($key, true);
        }));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string',
            'expires_at' => 'nullable|date',
            'is_active' => 'nullable|boolean',
        ]);

        $rawKey = $this->generateKey();
        $meta = $this->buildKeyMeta($rawKey);

        $apiKey = ApiKey::create([
            'name' => $data['name'],
            'key' => $rawKey,
            'key_prefix' => $meta['prefix'],
            'key_last4' => $meta['last4'],
            'permissions' => $data['permissions'] ?? ['read'],
            'expires_at' => $data['expires_at'] ?? null,
            'is_active' => $data['is_active'] ?? true,
            'created_by' => optional($request->user())->id,
        ]);

        return response()->json($this->formatKey($apiKey, true), 201);
    }

    public function update(Request $request, ApiKey $apiKey)
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string',
            'expires_at' => 'nullable|date',
            'is_active' => 'nullable|boolean',
        ]);

        $apiKey->update($data);

        return response()->json($this->formatKey($apiKey, true));
    }

    public function regenerate(ApiKey $apiKey)
    {
        $rawKey = $this->generateKey();
        $meta = $this->buildKeyMeta($rawKey);

        $apiKey->update([
            'key' => $rawKey,
            'key_prefix' => $meta['prefix'],
            'key_last4' => $meta['last4'],
            'last_used_at' => null,
            'usage_count' => 0,
        ]);

        return response()->json($this->formatKey($apiKey, true));
    }

    public function destroy(ApiKey $apiKey)
    {
        $apiKey->delete();

        return response()->noContent();
    }

    private function generateKey(): string
    {
        return 'sk_live_' . Str::random(24);
    }

    private function buildKeyMeta(string $key): array
    {
        $prefix = substr($key, 0, 8);
        $last4 = substr($key, -4);

        return [
            'prefix' => $prefix,
            'last4' => $last4,
        ];
    }

    private function formatKey(ApiKey $apiKey, bool $includeKey = false): array
    {
        $keyValue = $apiKey->key;

        return [
            'id' => $apiKey->id,
            'name' => $apiKey->name,
            'key' => $includeKey ? $keyValue : null,
            'key_masked' => $this->maskKey($keyValue),
            'permissions' => $apiKey->permissions ?? [],
            'created_at' => optional($apiKey->created_at)->toISOString(),
            'last_used_at' => optional($apiKey->last_used_at)->toISOString(),
            'usage_count' => $apiKey->usage_count ?? 0,
            'is_active' => (bool) $apiKey->is_active,
            'expires_at' => optional($apiKey->expires_at)->toISOString(),
        ];
    }

    private function maskKey(?string $key): ?string
    {
        if (!$key) {
            return null;
        }

        $prefix = substr($key, 0, 12);
        $last4 = substr($key, -4);

        return $prefix . '...' . $last4;
    }
}
