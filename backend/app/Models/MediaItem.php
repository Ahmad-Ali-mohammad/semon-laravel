<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MediaItem extends Model
{
    protected $table = 'media_library';

    protected $fillable = [
        'url',
        'name',
        'size',
        'mime_type',
        'uploaded_by',
    ];
}
