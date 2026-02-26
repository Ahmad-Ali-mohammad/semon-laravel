<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Backup extends Model
{
    protected $fillable = [
        'name',
        'type',
        'status',
        'description',
        'size_bytes',
        'file_path',
        'started_at',
        'completed_at',
        'restored_at',
        'meta',
        'created_by',
    ];

    protected $casts = [
        'size_bytes' => 'integer',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'restored_at' => 'datetime',
        'meta' => 'array',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
