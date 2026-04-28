<?php

use App\Http\Controllers\Admin\FacilityCategoryController;
use App\Http\Controllers\Admin\FacilityController;
use App\Http\Controllers\Admin\IdentityQueueController;
use App\Http\Controllers\Admin\NewsCategoryController;
use App\Http\Controllers\Admin\NewsController;
use App\Http\Controllers\Admin\PromoCarouselController;
use App\Http\Controllers\Admin\ReelController;
use App\Http\Controllers\Admin\SponsorLogoController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\ProfileController;
use App\Models\Facility;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

Route::get('/', function () {
    return Inertia::render('HomePage');
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
    'role:Administrator|Manager|Finance|Staff Front Officer|Staff Central',
])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        // Bookings (UI placeholder — no backend)
        Route::get('bookings', function () {
            return Inertia::render('Admin/Bookings/Index');
        })->name('bookings.index');

        // Dashboard
        Route::get('/', function () {
            return Inertia::render('Admin/Dashboard', [
                'stats' => [
                    'pendingIdentities' => User::where('identity_status', 'pending')->count(),
                    'activeFacilities'  => Facility::where('is_active', true)->count(),
                    'todaysBookings'    => null,
                ],
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
