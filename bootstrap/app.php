<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Exceptions\UnauthorizedException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            Route::prefix('ubsc-staff')
                ->group(base_path('routes/admin-auth.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'role'               => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission'         => \Spatie\Permission\Middleware\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
        ]);

        // Condition A: guests hitting /ubsc-staff/* go to the staff login, not the public login
        $middleware->redirectGuestsTo(function ($request) {
            return $request->is('ubsc-staff*')
                ? route('ubsc-staff.login')
                : route('login');
        });
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Condition B: authenticated regular users hitting /ubsc-staff/* are sent home with an error
        $exceptions->render(function (UnauthorizedException $e, $request) {
            if (! $request->expectsJson() && $request->is('ubsc-staff*')) {
                return redirect('/')->with('error', 'Akses Ditolak. Anda bukan staff.');
            }
        });

        // 404 → render the custom NotFound Inertia page
        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if (! $request->expectsJson()) {
                return Inertia::render('Errors/NotFound')
                    ->toResponse($request)
                    ->setStatusCode(404);
            }
        });
    })->create();
