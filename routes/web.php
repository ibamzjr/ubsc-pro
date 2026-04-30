<?php

use App\Http\Controllers\Admin\BookingController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\ScheduleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\FacilityCategoryController;
use App\Http\Controllers\Admin\FinanceReportController;
use App\Http\Controllers\Admin\MembershipController;
use App\Http\Controllers\Admin\MembershipPlanController;
use App\Http\Controllers\Admin\TransactionController;
use App\Http\Controllers\Admin\FacilityController;
use App\Http\Controllers\Admin\IdentityQueueController;
use App\Http\Controllers\Admin\NewsCategoryController;
use App\Http\Controllers\Admin\NewsController;
use App\Http\Controllers\Admin\PromoCarouselController;
use App\Http\Controllers\Admin\ReelController;
use App\Http\Controllers\Admin\SponsorLogoController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\ProfileController;
use App\Models\Booking;
use App\Models\Facility;
use App\Models\Membership;
use App\Models\MembershipPlan;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

Route::get('/', function () {
    return Inertia::render('HomePage', [
        'membershipPlans' => MembershipPlan::where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($p) => [
                'id'              => $p->id,
                'name'            => $p->name,
                'price'           => $p->price,
                'duration_months' => $p->duration_months,
                'features'        => $p->features ?? [],
            ]),
    ]);
});

Route::get('/about', function () {
    return Inertia::render('AboutPage');
})->name('about');

Route::get('/news', function () {
    return Inertia::render('NewsPage');
})->name('news');

Route::get('/pricing', function () {
    return Inertia::render('PricingPage');
})->name('pricing');

Route::get('/facilities', function () {
    return Inertia::render('FacilityPage');
})->name('facility');

Route::get('/booking', function () {
    return Inertia::render('BookingPage');
})->name('booking');

Route::get('/coming-soon', function () {
    return Inertia::render('ComingSoon');
})->name('coming-soon');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ─── Admin ────────────────────────────────────────────────────────────────────

Route::middleware([
    'auth',
    'role:Administrator|Manager|Finance|Staff Front Office|Staff Central',
])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        // Bookings
        Route::get('bookings', [BookingController::class, 'index'])->name('bookings.index');
        Route::post('bookings', [BookingController::class, 'store'])->name('bookings.store');
        Route::patch('bookings/{booking}', [BookingController::class, 'update'])->name('bookings.update');
        Route::delete('bookings/{booking}', [BookingController::class, 'destroy'])->name('bookings.destroy');

        // Membership Plans (must precede {membership} wildcard routes)
        Route::prefix('memberships/plans')->name('memberships.plans.')->group(function () {
            Route::get('',           [MembershipPlanController::class, 'index'])->name('index');
            Route::post('',          [MembershipPlanController::class, 'store'])->name('store');
            Route::patch('{plan}',   [MembershipPlanController::class, 'update'])->name('update');
            Route::delete('{plan}',  [MembershipPlanController::class, 'destroy'])->name('destroy');
        });

        // Memberships
        Route::get('memberships', [MembershipController::class, 'index'])->name('memberships.index');
        Route::post('memberships', [MembershipController::class, 'store'])->name('memberships.store');
        Route::patch('memberships/{membership}', [MembershipController::class, 'update'])->name('memberships.update');
        Route::delete('memberships/{membership}', [MembershipController::class, 'destroy'])->name('memberships.destroy');

        // Transactions
        Route::post('transactions/{transaction}/simulate-pay', [TransactionController::class, 'simulatePay'])
            ->name('transactions.simulate-pay');

        // Finance & Analytics
        Route::get('finance', [FinanceReportController::class, 'index'])->name('finance.index');
        Route::get('finance/export', [FinanceReportController::class, 'export'])->name('finance.export');

        // Dashboard
        Route::get('/', function () {
            $now              = now();
            $prevMonth        = $now->month === 1 ? 12 : $now->month - 1;
            $prevYear         = $now->month === 1 ? $now->year - 1 : $now->year;
            $currentRevenue   = (int) Transaction::where('payment_status', 'PAID')->whereMonth('paid_at', $now)->whereYear('paid_at', $now)->sum('amount');
            $lastMonthRevenue = (int) Transaction::where('payment_status', 'PAID')->whereMonth('paid_at', $prevMonth)->whereYear('paid_at', $prevYear)->sum('amount');
            $revenueTrend = match(true) {
                $lastMonthRevenue > 0 => round((($currentRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 1),
                $currentRevenue > 0  => 100.0,
                default              => 0.0,
            };

            // Daily revenue array for the current month (thousands IDR, one value per day)
            $daysInMonth    = (int) $now->daysInMonth;
            $dailyRaw       = Transaction::where('payment_status', 'PAID')
                ->whereMonth('paid_at', $now)
                ->whereYear('paid_at', $now)
                ->selectRaw('DAY(paid_at) as day, SUM(amount) as total')
                ->groupBy('day')
                ->pluck('total', 'day');
            $dailyRevenue = array_map(
                fn($d) => (int) round(($dailyRaw[$d] ?? 0) / 1000),
                range(1, $daysInMonth),
            );

            // Today's occupancy per active facility
            // Operating window = 15 hours = 900 minutes
            $operatingMinutes = 900;
            $todayBookings    = Booking::with('facility')
                ->whereDate('booking_date', today())
                ->whereIn('status', ['confirmed', 'pending'])
                ->get();

            $activeFacilities = Facility::where('is_active', true)->get(['id', 'name']);
            $COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6b7280', '#ec4899', '#14b8a6'];
            $occupancyData = $activeFacilities->values()->map(function ($facility, $idx) use ($todayBookings, $operatingMinutes, $COLORS) {
                $booked = $todayBookings
                    ->where('facility_id', $facility->id)
                    ->sum(fn($b) => \Carbon\Carbon::parse($b->start_time)->diffInMinutes(\Carbon\Carbon::parse($b->end_time)));
                return [
                    'name'  => $facility->name,
                    'pct'   => (int) min(100, round($booked / $operatingMinutes * 100)),
                    'color' => $COLORS[$idx % count($COLORS)],
                ];
            })->all();

            // Combined recent activity feed (last 8 events)
            $recentBookings = Booking::with('facility')
                ->latest()
                ->take(5)
                ->get()
                ->map(fn($b) => [
                    'id'       => $b->id,
                    'type'     => 'booking',
                    'title'    => 'Reservasi Baru',
                    'subtitle' => ($b->customer_name ?? $b->user?->name ?? 'Guest') . ' · ' . ($b->facility?->name ?? '-'),
                    'time'     => $b->created_at->diffForHumans(),
                ]);

            $recentMemberships = Membership::with('user')
                ->latest()
                ->take(3)
                ->get()
                ->map(fn($m) => [
                    'id'       => $m->id,
                    'type'     => 'membership',
                    'title'    => 'Membership Baru',
                    'subtitle' => $m->customer_name ?? $m->user?->name ?? 'Guest',
                    'time'     => $m->created_at->diffForHumans(),
                ]);

            $recentPayments = Transaction::where('payment_status', 'PAID')
                ->with('user')
                ->orderByDesc('paid_at')
                ->take(5)
                ->get()
                ->map(fn($t) => [
                    'id'       => $t->id,
                    'type'     => 'payment',
                    'title'    => 'Pembayaran Diterima',
                    'subtitle' => 'Rp ' . number_format($t->amount, 0, ',', '.') . ' · ' . ($t->user?->name ?? 'Guest'),
                    'time'     => $t->paid_at?->diffForHumans() ?? '-',
                ]);

            $recentActivity = $recentBookings
                ->concat($recentMemberships)
                ->concat($recentPayments)
                ->sortByDesc('time')
                ->take(8)
                ->values()
                ->all();

            return Inertia::render('Admin/Dashboard', [
                'stats' => [
                    'pendingIdentities'  => User::where('identity_status', 'pending')->count(),
                    'activeFacilities'   => $activeFacilities->count(),
                    'todaysBookings'     => Booking::where('booking_date', today())->whereIn('status', ['pending', 'confirmed'])->count(),
                    'totalRevenue'       => $currentRevenue,
                    'activeMemberships'  => Membership::where('status', 'active')->count(),
                ],
                'revenueTrend'     => $revenueTrend,
                'dailyRevenue'     => $dailyRevenue,
                'daysInMonth'      => $daysInMonth,
                'currentMonthLabel' => $now->translatedFormat('M Y'),
                'occupancyData'    => array_values($occupancyData),
                'recentActivity'   => $recentActivity,
            ]);
        })->name('dashboard');

        // Identity Queue
        Route::get('identity', [IdentityQueueController::class, 'index'])
            ->name('identity.index');
        Route::patch('identity/{user}/verify', [IdentityQueueController::class, 'verify'])
            ->name('identity.verify');
        Route::get('identity/{user}/document', [IdentityQueueController::class, 'document'])
            ->name('identity.document');

        // Facility Categories (JSON API consumed by the Index page)
        Route::get('facility-categories', [FacilityCategoryController::class, 'index'])
            ->name('facility-categories.index');
        Route::post('facility-categories', [FacilityCategoryController::class, 'store'])
            ->name('facility-categories.store');
        Route::put('facility-categories/{facilityCategory}', [FacilityCategoryController::class, 'update'])
            ->name('facility-categories.update');
        Route::delete('facility-categories/{facilityCategory}', [FacilityCategoryController::class, 'destroy'])
            ->name('facility-categories.destroy');

        // Facilities
        Route::get('facilities', [FacilityController::class, 'index'])
            ->name('facilities.index');
        Route::get('facilities/create', [FacilityController::class, 'create'])
            ->name('facilities.create');
        Route::post('facilities', [FacilityController::class, 'store'])
            ->name('facilities.store');
        Route::get('facilities/{facility}/edit', [FacilityController::class, 'edit'])
            ->name('facilities.edit');
        Route::put('facilities/{facility}', [FacilityController::class, 'update'])
            ->name('facilities.update');
        Route::delete('facilities/{facility}', [FacilityController::class, 'destroy'])
            ->name('facilities.destroy');

        // Facility Pricing (UI Placeholder)
        Route::get('facilities/{facility}/pricing', function () {
            return Inertia::render('Admin/Facilities/Pricing');
        })->name('facilities.pricing');

        // Settings — Schedule Control (Administrator only)
        Route::get('settings/schedules', [ScheduleController::class, 'index'])->name('settings.schedules');
        Route::post('settings/schedules/toggle', [ScheduleController::class, 'toggle'])->name('settings.schedules.toggle');
        Route::post('settings/schedules/quick-open-next', [ScheduleController::class, 'quickOpenNext'])->name('settings.schedules.quick-open-next');

        // Settings — Role & Access
        Route::get('settings/roles', [RoleController::class, 'index'])->name('settings.roles');
        Route::put('settings/roles/{role}', [RoleController::class, 'update'])->name('settings.roles.update');

        // Settings — Internal User Management (Administrator only, enforced in controller)
        Route::get('settings/users', [UserController::class, 'index'])->name('settings.users');
        Route::post('settings/users', [UserController::class, 'store'])->name('settings.users.store');
        Route::put('settings/users/{user}', [UserController::class, 'update'])->name('settings.users.update');
        Route::delete('settings/users/{user}', [UserController::class, 'destroy'])->name('settings.users.destroy');

        // Facility media
        Route::post('facilities/{facility}/hero', [FacilityController::class, 'updateHero'])
            ->name('facilities.hero.update');
        Route::post('facilities/{facility}/gallery', [FacilityController::class, 'addGallery'])
            ->name('facilities.gallery.add');
        Route::delete('facilities/gallery/{media}', [FacilityController::class, 'destroyGalleryMedia'])
            ->name('facilities.gallery.destroy');

        // News Categories
        Route::post('news-categories', [NewsCategoryController::class, 'store'])
            ->name('news-categories.store');
        Route::put('news-categories/{newsCategory}', [NewsCategoryController::class, 'update'])
            ->name('news-categories.update');
        Route::delete('news-categories/{newsCategory}', [NewsCategoryController::class, 'destroy'])
            ->name('news-categories.destroy');

        // News
        Route::get('news', [NewsController::class, 'index'])->name('news.index');
        Route::get('news/create', [NewsController::class, 'create'])->name('news.create');
        Route::post('news', [NewsController::class, 'store'])->name('news.store');
        Route::get('news/{news}/edit', [NewsController::class, 'edit'])->name('news.edit');
        Route::put('news/{news}', [NewsController::class, 'update'])->name('news.update');
        Route::delete('news/{news}', [NewsController::class, 'destroy'])->name('news.destroy');

        // Promo Carousel
        Route::get('promo', [PromoCarouselController::class, 'index'])->name('promo.index');
        Route::post('promo', [PromoCarouselController::class, 'store'])->name('promo.store');
        Route::put('promo/{promoCarousel}', [PromoCarouselController::class, 'update'])->name('promo.update');
        Route::delete('promo/{promoCarousel}', [PromoCarouselController::class, 'destroy'])->name('promo.destroy');

        // Sponsors
        Route::get('sponsors', [SponsorLogoController::class, 'index'])->name('sponsors.index');
        Route::post('sponsors', [SponsorLogoController::class, 'store'])->name('sponsors.store');
        Route::put('sponsors/{sponsorLogo}', [SponsorLogoController::class, 'update'])->name('sponsors.update');
        Route::delete('sponsors/{sponsorLogo}', [SponsorLogoController::class, 'destroy'])->name('sponsors.destroy');

        // Reels
        Route::get('reels', [ReelController::class, 'index'])->name('reels.index');
        Route::post('reels', [ReelController::class, 'store'])->name('reels.store');
        Route::put('reels/{reel}', [ReelController::class, 'update'])->name('reels.update');
        Route::delete('reels/{reel}', [ReelController::class, 'destroy'])->name('reels.destroy');

        // Testimonials
        Route::get('testimonials', [TestimonialController::class, 'index'])->name('testimonials.index');
        Route::post('testimonials', [TestimonialController::class, 'store'])->name('testimonials.store');
        Route::put('testimonials/{testimonial}', [TestimonialController::class, 'update'])->name('testimonials.update');
        Route::delete('testimonials/{testimonial}', [TestimonialController::class, 'destroy'])->name('testimonials.destroy');
    });

require __DIR__.'/auth.php';
