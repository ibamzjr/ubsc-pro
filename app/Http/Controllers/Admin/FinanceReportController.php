<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Membership;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class FinanceReportController extends Controller
{
    private const MONTH_NAMES = [
        1  => 'Januari',  2  => 'Februari', 3  => 'Maret',
        4  => 'April',    5  => 'Mei',       6  => 'Juni',
        7  => 'Juli',     8  => 'Agustus',   9  => 'September',
        10 => 'Oktober',  11 => 'November',  12 => 'Desember',
    ];

    public function index(): Response
    {
        $this->authorize('view-reports');

        $month = (int) request('month', now()->month);
        $year  = (int) request('year',  now()->year);

        return Inertia::render('Admin/Finance/Index', [
            ...$this->buildStats($month, $year),
            'period' => ['month' => $month, 'year' => $year],
        ]);
    }

    public function export(): SymfonyResponse
    {
        $this->authorize('view-reports');

        $month = (int) request('month', now()->month);
        $year  = (int) request('year',  now()->year);

        $data = [
            ...$this->buildStats($month, $year),
            'period'      => ['month' => $month, 'year' => $year],
            'month_label' => self::MONTH_NAMES[$month] . ' ' . $year,
            'generated_at'=> now()->format('d/m/Y H:i'),
        ];

        $pdf = app('dompdf.wrapper');
        $pdf->loadView('admin.finance-pdf', $data);
        $pdf->setPaper('a4', 'portrait');
        $pdf->setOption(['isHtml5ParserEnabled' => true, 'isRemoteEnabled' => false]);

        $filename = 'UBSC-Finance-' . self::MONTH_NAMES[$month] . '-' . $year . '.pdf';

        return $pdf->download($filename);
    }

    // ── Shared computation ────────────────────────────────────────────────────

    private function buildStats(int $month, int $year): array
    {
        $colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6b7280'];

        // ── Revenue by facility ───────────────────────────────────────────────
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

        // ── Daily revenue ─────────────────────────────────────────────────────
        $dailyRaw = DB::table('transactions')
            ->where('payment_status', 'PAID')
            ->whereMonth('paid_at', $month)
            ->whereYear('paid_at', $year)
            ->selectRaw('DAY(paid_at) as day, SUM(amount) as total')
            ->groupBy('day')
            ->pluck('total', 'day');

        $daysInMonth  = Carbon::createFromDate($year, $month, 1)->daysInMonth;
        $dailyRevenue = collect(range(1, $daysInMonth))
            ->map(fn($d) => (int) ($dailyRaw->get($d, 0) / 1000))
            ->values()->all();

        // ── KPI totals ────────────────────────────────────────────────────────
        $totalRevenue = (int) DB::table('transactions')
            ->where('payment_status', 'PAID')
            ->whereMonth('paid_at', $month)
            ->whereYear('paid_at', $year)
            ->sum('amount');

        $totalBookings = Booking::whereMonth('booking_date', $month)
            ->whereYear('booking_date', $year)
            ->count();

        $activeMemberships = Membership::where('status', 'active')->count();

        // ── Revenue trend vs previous month ───────────────────────────────────
        $prevMonth = $month === 1 ? 12 : $month - 1;
        $prevYear  = $month === 1 ? $year - 1 : $year;

        $lastMonthRevenue = (int) DB::table('transactions')
            ->where('payment_status', 'PAID')
            ->whereMonth('paid_at', $prevMonth)
            ->whereYear('paid_at', $prevYear)
            ->sum('amount');

        // Guard against division by zero: if last month was 0 treat as +100% or 0%
        $revenueTrend = match(true) {
            $lastMonthRevenue > 0 => round((($totalRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 1),
            $totalRevenue > 0    => 100.0,
            default              => 0.0,
        };

        // ── 5 most recent PAID transactions ───────────────────────────────────
        $recentTransactions = Transaction::where('payment_status', 'PAID')
            ->with('user')
            ->orderByDesc('paid_at')
            ->take(5)
            ->get()
            ->map(fn($t) => [
                'id'        => $t->id,
                'amount'    => $t->amount,
                'user_name' => $t->user?->name ?? 'Guest',
                'paid_at'   => $t->paid_at?->diffForHumans() ?? '-',
                'type'      => class_basename($t->transactionable_type ?? ''),
            ]);

        return [
            'facilityRevenue'    => $facilityRevenue->values()->all(),
            'facilityBookings'   => $facilityBookings->values()->all(),
            'dailyRevenue'       => $dailyRevenue,
            'stats'              => [
                'totalRevenue'      => $totalRevenue,
                'totalBookings'     => $totalBookings,
                'activeMemberships' => $activeMemberships,
            ],
            'revenueTrend'       => $revenueTrend,
            'recentTransactions' => $recentTransactions->values()->all(),
        ];
    }
}
