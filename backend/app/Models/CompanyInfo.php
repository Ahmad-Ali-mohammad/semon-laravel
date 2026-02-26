<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyInfo extends Model
{
    protected $table = 'company_info';

    protected $fillable = [
        'name',
        'name_english',
        'description',
        'founded_year',
        'mission',
        'vision',
        'story',
        'logo_url',
        'mascot_url',
    ];
}
