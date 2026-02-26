<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BackupSetting extends Model
{
    protected $fillable = [
        'enabled',
        'frequency',
        'time',
        'retention',
        'updated_by',
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'retention' => 'integer',
    ];

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
