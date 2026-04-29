<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingSchedule extends Model
{
    protected $fillable = ['month', 'year', 'is_open'];

    protected function casts(): array
    {
        return [
            'is_open' => 'boolean',
        ];
    }

    public static function isOpen(int $month, int $year): bool
    {
        return static::where('month', $month)
            ->where('year', $year)
            ->where('is_open', true)
            ->exists();
    }
}
