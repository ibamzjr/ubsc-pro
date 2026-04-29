<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    private const INTERNAL_ROLES = ['Manager', 'Finance', 'Staff Central', 'Staff Front Office'];

    public function index(): Response
    {
        abort_unless(auth()->user()?->hasRole('Administrator'), 403);

        $users = User::whereHas('roles', fn ($q) => $q->whereIn('name', self::INTERNAL_ROLES))
            ->with('roles')
            ->orderBy('name')
            ->get()
            ->map(fn (User $u) => [
                'id'    => $u->id,
                'name'  => $u->name,
                'email' => $u->email,
                'role'  => $u->getRoleNames()->first() ?? '',
            ]);

        return Inertia::render('Admin/Settings/Users/Index', [
            'users' => $users,
            'roles' => self::INTERNAL_ROLES,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_unless(auth()->user()?->hasRole('Administrator'), 403);

        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role'     => ['required', 'in:' . implode(',', self::INTERNAL_ROLES)],
        ]);

        $user = User::create([
            'name'              => $data['name'],
            'email'             => $data['email'],
            'password'          => Hash::make($data['password']),
            'email_verified_at' => now(),
        ]);

        $user->assignRole($data['role']);

        return back()->with('success', "Akun {$data['name']} berhasil dibuat.");
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        abort_unless(auth()->user()?->hasRole('Administrator'), 403);

        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', "unique:users,email,{$user->id}"],
            'password' => ['nullable', 'string', 'min:8'],
            'role'     => ['required', 'in:' . implode(',', self::INTERNAL_ROLES)],
        ]);

        $user->update([
            'name'  => $data['name'],
            'email' => $data['email'],
            ...($data['password'] ? ['password' => Hash::make($data['password'])] : []),
        ]);

        $user->syncRoles([$data['role']]);

        return back()->with('success', "Akun {$data['name']} berhasil diperbarui.");
    }

    public function destroy(User $user): RedirectResponse
    {
        abort_unless(auth()->user()?->hasRole('Administrator'), 403);
        abort_if($user->id === auth()->id(), 422, 'Tidak dapat menghapus akun sendiri.');

        $name = $user->name;
        $user->delete();

        return back()->with('success', "Akun {$name} berhasil dihapus.");
    }
}
