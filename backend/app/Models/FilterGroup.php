<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FilterGroup extends Model
{
    protected $fillable = [
        'name',
        'type',
        'applies_to',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function options(): HasMany
    {
        return $this->hasMany(FilterOption::class);
    }
}
