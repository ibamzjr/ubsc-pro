<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BookingSchedule;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleController extends Controller
{
    private const MONTH_NAMES = [
        1  => 'Januari',  2  => 'Februari', 3  => 'Maret',
        4  => 'April',    5  => 'Mei',       6  => 'Juni',
        7  => 'Juli',     8  => 'Agustus',   9  => 'September',
        10 => 'Oktober',  11 => 'November',  12 => 'Desember',
    ];

    public function index(): Response
    {
        abort_unless(auth()->user()?->hasRole('Administrator'), 403);

        $rows = collect(range(0, 6))->map(function (int $offset) {
            $date  = Carbon::now()->startOfMonth()->addMonths($offset);
            $month = $date->month;
            $year  = $date->year;

            $isOpen = BookingSchedule::where('month', $month)
                ->where('year', $year)
                ->value('is_open') ?? false;

            return [
                'month'   => $month,
                'year'    => $year,
                'label'   => self::MONTH_NAMES[$month] . ' ' . $year,
                'is_open' => (bool) $isOpen,
            ];
        });

        return Inertia::render('Admin/Settings/Schedules/Index', [
            'schedules' => $rows,
        ]);
    }

    public function toggle(Request $request): RedirectResponse
    {
        abort_unless(auth()->user()?->hasRole('Administrator'), 403);

        $data = $request->validate([
            'month' => ['required', 'integer', 'between:1,12'],
            'year'  => ['required', 'integer', 'min:2020', 'max:2099'],
        ]);

        $schedule = BookingSchedule::firstOrNew([
            'month' => $data['month'],
            'year'  => $data['year'],
        ]);

        $schedule->is_open = !$schedule->is_open;
        $schedule->save();

        $label  = self::MONTH_NAMES[$data['month']] . ' ' . $data['year'];
        $status = $schedule->is_open ? 'dibuka' : 'ditutup';

        return back()->with('success', "Jadwal {$label} berhasil {$status}.");
    }

    public function quickOpenNext(): RedirectResponse
    {
        abort_unless(auth()->user()?->hasRole('Administrator'), 403);

        $next = Carbon::now()->addMonth()->startOfMonth();

        BookingSchedule::updateOrCreate(
            ['month' => $next->month, 'year' => $next->year],
            ['is_open' => true],
        );

        $label = self::MONTH_NAMES[$next->month] . ' ' . $next->year;

        return back()->with('success', "Jadwal {$label} berhasil dibuka.");
    }
}
