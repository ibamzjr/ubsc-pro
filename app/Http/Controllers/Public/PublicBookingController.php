<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingSchedule;
use App\Models\Facility;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class PublicBookingController extends Controller
{
    public function slots(Request $request): JsonResponse
    {
        $data = $request->validate([
            'facility_id' => ['required', 'exists:facilities,id'],
            'date'        => ['required', 'date_format:Y-m-d'],
        ]);

        $date     = Carbon::parse($data['date']);
        $month    = $date->month;
        $year     = $data['date'] ? (int) substr($data['date'], 0, 4) : $date->year;
        $dateStr  = $date->format('Y-m-d');

        $schedule    = BookingSchedule::where('month', $month)->where('year', $year)->first();
        $isMonthOpen = $schedule?->is_open ?? false;
        $closedDates = $schedule?->closed_dates ?? [];

        if (! $isMonthOpen) {
            return response()->json([
                'closed'       => true,
                'reason'       => 'month_closed',
                'slots'        => [],
                'closed_dates' => $closedDates,
            ]);
        }

        if (in_array($dateStr, $closedDates)) {
            return response()->json([
                'closed'       => true,
                'reason'       => 'date_closed',
                'slots'        => [],
                'closed_dates' => $closedDates,
            ]);
        }

        $facility        = Facility::with('prices')->findOrFail($data['facility_id']);
        $capacity        = $facility->capacity ?? 1;
        $durationMinutes = $facility->prices->first()?->duration_minutes ?? 60;
        $price           = $facility->prices->where('user_category', 'umum')->first()?->price ?? 0;

        $slots       = [];
        $activeSlots = $facility->active_slots; // null = continuous; array = weekly dict
        $dayName     = $date->format('l');       // e.g. "Monday"
        $fmt         = fn (int $m): string => sprintf('%02d:%02d', intdiv($m, 60), $m % 60);

        $buildSlot = function (string $startTime, string $endTime) use ($facility, $dateStr, $capacity, $price): array {
            $occupiedPax = Booking::where('facility_id', $facility->id)
                ->where('booking_date', $dateStr)
                ->whereIn('status', ['pending', 'confirmed'])
                ->where('start_time', '<', $endTime)
                ->where('end_time', '>', $startTime)
                ->sum('pax');

            return [
                'start_time' => $startTime,
                'end_time'   => $endTime,
                'label'      => $startTime . ' – ' . $endTime,
                'price'      => $price > 0 ? 'Rp ' . number_format($price, 0, ',', '.') : 'Hubungi Kami',
                'status'     => ($occupiedPax >= $capacity) ? 'booked' : 'available',
                'remaining'  => max(0, $capacity - $occupiedPax),
            ];
        };

        if ($activeSlots !== null) {
            // Weekly dict: {"Monday": ["16:00","19:00"], ...}
            $daySlots = $activeSlots[$dayName] ?? [];
            foreach ($daySlots as $startTimeStr) {
                [$h, $m]   = array_map('intval', explode(':', $startTimeStr));
                $slots[]   = $buildSlot($startTimeStr, $fmt($h * 60 + $m + $durationMinutes));
            }
        } else {
            // Default continuous loop 06:00–22:00
            $current = 6 * 60;
            $end     = 22 * 60;

            while ($current + $durationMinutes <= $end) {
                $startTime = $fmt($current);
                $endTime   = $fmt($current + $durationMinutes);
                $slots[]   = $buildSlot($startTime, $endTime);
                $current  += $durationMinutes;
            }
        }

        return response()->json([
            'closed'       => false,
            'slots'        => $slots,
            'closed_dates' => $closedDates,
        ]);
    }
}
