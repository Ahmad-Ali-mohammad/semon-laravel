<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Policy extends Model
{
    protected $fillable = [
        'type',
        'title',
        'content',
        'last_updated',
        'is_active',
        'icon',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'last_updated' => 'date',
    ];
}
