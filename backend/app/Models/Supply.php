<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supply extends Model
{
    protected $fillable = [
        'name',
        'category',
        'description',
        'price',
        'image_url',
        'rating',
        'is_available',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'rating' => 'decimal:2',
        'is_available' => 'boolean',
    ];
}
