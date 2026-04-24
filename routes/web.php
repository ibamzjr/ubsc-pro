<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

// Auth routes are disabled — redirect to coming-soon
Route::get('/login', fn() => redirect()->route('coming-soon'))->name('login');
Route::get('/register', fn() => redirect()->route('coming-soon'))->name('register');
Route::get('/forgot-password', fn() => redirect()->route('coming-soon'))->name('password.request');

// require __DIR__.'/auth.php';
