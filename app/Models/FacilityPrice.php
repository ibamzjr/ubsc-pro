<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FacilityPrice extends Model
{
    protected $fillable = [
        'facility_id',
        'user_category',
        'label',
        'price',
        'duration_minutes',
        'notes',
        'sort_order',
    ];

    public function facility(): BelongsTo
    {
        return $this->belongsTo(Facility::class);
    }
}
