<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactInfo extends Model
{
    protected $table = 'contact_info';

    protected $fillable = [
        'phone',
        'email',
        'address',
        'city',
        'country',
        'working_hours',
        'facebook',
        'instagram',
        'whatsapp',
        'telegram',
        'facebook_url',
        'instagram_url',
        'whatsapp_url',
        'telegram_url',
        'twitter_url',
        'youtube_url',
    ];
}
