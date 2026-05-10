<?php

use App\Http\Controllers\Admin\Auth\AdminAuthenticatedSessionController;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\VerifyCsrfToken;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Authentication Routes  (/ubsc-staff/*)
|--------------------------------------------------------------------------
|
| Staff-only login portal. Only users with Spatie admin roles are allowed
| through the gate. No registration endpoint exists here.
|
| Note: The /ubsc-staff prefix is applied in bootstrap/app.php so this
| file can be re-used by dropping in a different prefix if needed.
| The web middleware stack (StartSession, etc.) is explicitly listed here
| because admin-auth.php is loaded via then: (after the web stack).
|
*/

Route::middleware(['web', 'guest'])->group(function () {
    Route::get('login', [AdminAuthenticatedSessionController::class, 'create'])
        ->name('admin.login');

    Route::post('login', [AdminAuthenticatedSessionController::class, 'store']);
});

// Dedicated admin logout — avoids conflict with the public logout route
Route::middleware(['web', 'auth'])->group(function () {
    Route::post('logout', [AdminAuthenticatedSessionController::class, 'destroy'])
        ->name('admin.logout');
});