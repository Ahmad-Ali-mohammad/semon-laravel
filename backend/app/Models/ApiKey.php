<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApiKey extends Model
{
    protected $fillable = [
        'name',
        'key',
        'key_prefix',
        'key_last4',
        'permissions',
        'usage_count',
        'last_used_at',
        'expires_at',
        'is_active',
        'created_by',
    ];

    protected $casts = [
        'permissions' => 'array',
        'usage_count' => 'integer',
        'last_used_at' => 'datetime',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function setKeyAttribute($value): void
    {
        if ($value === null || $value === '') {
            $this->attributes['key'] = null;
            return;
        }

        $this->attributes['key'] = encrypt($value);
    }

    public function getKeyAttribute($value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        try {
            return decrypt($value);
        } catch (\Throwable $e) {
            return $value;
        }
    }
}
