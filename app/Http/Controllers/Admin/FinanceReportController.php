<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Membership;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class FinanceReportController extends Controller
{
    public function index(): Response
    {
        $this->authorize('view-reports');

        $month = (int) request('month', now()->month);
        $year  = (int) request('year',  now()->year);

        $colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6b7280'];

        // Revenue by facility (PAID transactions on bookings)
        $facilityRevenueRaw = DB::table('transactions')
            ->join('bookings', function ($j) {
                $j->on('transactions.transactionable_id', '=', 'bookings.id')
                  ->where('transactions.transactionable_type', '=', Booking::class);
            })
            ->join('facilities', 'bookings.facility_id', '=', 'facilities.id')
            ->where('transactions.payment_status', 'PAID')
            ->whereMonth('transactions.paid_at', $month)
            ->whereYear('transactions.paid_at', $year)
            ->selectRaw('facilities.id, facilities.name, SUM(transactions.amount) as revenue, COUNT(transactions.id) as booking_count')
            ->groupBy('facilities.id', 'facilities.name')
            ->orderByDesc('revenue')
            ->get();

        $totalFacilityRevenue = $facilityRevenueRaw->sum('revenue') ?: 1;
        $totalBookingCount    = $facilityRevenueRaw->sum('booking_count') ?: 1;

        $facilityRevenue = $facilityRevenueRaw->values()->map(fn($r, $i) => [
            'name'    => $r->name,
            'revenue' => (int) $r->revenue,
            'share'   => (int) round($r->revenue / $totalFacilityRevenue * 100),
            'color'   => $colors[$i] ?? '#6b7280',
        ]);

        $facilityBookings = $facilityRevenueRaw->values()->map(fn($r, $i) => [
            'name'  => $r->name,
            'count' => (int) $r->booking_count,
            'share' => (int) round($r->booking_count / $totalBookingCount * 100),
            'color' => $colors[$i] ?? '#6b7280',
        ]);

        // Daily revenue array
        $dailyRaw = DB::table('transactions')
            ->where('payment_status', 'PAID')
            ->whereMonth('paid_at', $month)
            ->whereYear('paid_at', $year)
            ->selectRaw('DAY(paid_at) as day, SUM(amount) as total')
            ->groupBy('day')
            ->pluck('total', 'day');

        $daysInMonth  = now()->setMonth($month)->setYear($year)->daysInMonth;
        $dailyRevenue = collect(range(1, $daysInMonth))
            ->map(fn($d) => (int) ($dailyRaw->get($d, 0) / 1000))
            ->values()->all();

        // KPI totals
        $totalRevenue = (int) DB::table('transactions')
            ->where('payment_status', 'PAID')
            ->whereMonth('paid_at', $month)
            ->whereYear('paid_at', $year)
            ->sum('amount');

        $totalBookings = Booking::whereMonth('booking_date', $month)
            ->whereYear('booking_date', $year)
            ->count();

        $activeMemberships = Membership::where('status', 'active')->count();

        return Inertia::render('Admin/Finance/Index', [
            'facilityRevenue'  => $facilityRevenue->values()->all(),
            'facilityBookings' => $facilityBookings->values()->all(),
            'dailyRevenue'     => $dailyRevenue,
            'stats'            => [
                'totalRevenue'      => $totalRevenue,
                'totalBookings'     => $totalBookings,
                'activeMemberships' => $activeMemberships,
            ],
            'period'           => ['month' => $month, 'year' => $year],
        ]);
    }
}
