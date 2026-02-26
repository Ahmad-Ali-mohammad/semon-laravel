<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PromotionalCard extends Model
{
    protected $fillable = [
        'title',
        'description',
        'image_url',
        'discount_percentage',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'is_active',
        'target_category',
        'button_text',
        'button_link',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];
}
