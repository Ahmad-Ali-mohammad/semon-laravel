<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShamCashConfig extends Model
{
    protected $table = 'shamcash_config';

    protected $fillable = [
        'barcode_image_url',
        'account_code',
        'account_holder_name',
        'phone_number',
        'payment_instructions',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
