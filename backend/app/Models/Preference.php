<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Preference extends Model
{
    protected $fillable = [
        'theme',
        'language',
        'notifications_enabled',
        'currency',
        'tax_rate',
        'shipping_fee',
        'free_shipping_threshold',
        'maintenance_mode',
        'allow_guest_checkout',
        'require_email_verification',
        'default_user_role'
    ];

    protected $casts = [
        'notifications_enabled' => 'boolean',
        'maintenance_mode' => 'boolean',
        'allow_guest_checkout' => 'boolean',
        'require_email_verification' => 'boolean',
        'tax_rate' => 'float',
        'shipping_fee' => 'float',
        'free_shipping_threshold' => 'float',
    ];
}
