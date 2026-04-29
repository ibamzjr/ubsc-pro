<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Membership;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MembershipController extends Controller
{
    public function index(): Response
    {
        $this->authorize('manage-bookings');

        $memberships = Membership::with(['user', 'transaction'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($m) => $this->transform($m));

        $users = User::orderBy('name')
            ->get(['id', 'name', 'phone_number']);

        return Inertia::render('Admin/Memberships/Index', [
            'memberships' => $memberships,
            'users'       => $users,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('manage-bookings');

        $data = $request->validate([
            'user_id'    => ['required', 'exists:users,id'],
            'start_date' => ['required', 'date'],
            'end_date'   => ['required', 'date', 'after:start_date'],
            'amount'     => ['required', 'integer', 'min:0'],
        ]);

        $membership = Membership::create([
            'user_id'    => $data['user_id'],
            'start_date' => $data['start_date'],
            'end_date'   => $data['end_date'],
            'status'     => 'active',
        ]);

        $membership->transaction()->create([
            'user_id'        => $data['user_id'],
            'amount'         => $data['amount'],
            'payment_status' => 'UNPAID',
            'checkout_url'   => url("/admin/memberships/{$membership->id}"),
        ]);

        return redirect()->route('admin.memberships.index')
            ->with('success', 'Membership berhasil dibuat.');
    }

    public function update(Request $request, Membership $membership): RedirectResponse
    {
        $this->authorize('manage-bookings');

        $data = $request->validate([
            'status' => ['required', 'in:active,expired,cancelled'],
        ]);

        $membership->update(['status' => $data['status']]);

        if ($data['status'] === 'cancelled') {
            if ($membership->transaction?->payment_status === 'UNPAID') {
                $membership->transaction->update(['payment_status' => 'FAILED']);
            }
        }

        return back()->with('success', 'Status membership berhasil diperbarui.');
    }

    public function destroy(Membership $membership): RedirectResponse
    {
        $this->authorize('manage-bookings');

        $membership->update(['status' => 'cancelled']);

        if ($membership->transaction?->payment_status === 'UNPAID') {
            $membership->transaction->update(['payment_status' => 'FAILED']);
        }

        return back()->with('success', 'Membership berhasil dibatalkan.');
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private function transform(Membership $membership): array
    {
        return [
            'id'             => $membership->id,
            'user_id'        => $membership->user_id,
            'customer_name'  => $membership->user->name,
            'customer_phone' => $membership->user->phone_number,
            'start_date'     => $membership->start_date->format('Y-m-d'),
            'end_date'       => $membership->end_date->format('Y-m-d'),
            'status'         => $membership->status,
            'transaction'    => $membership->transaction ? [
                'id'             => $membership->transaction->id,
                'amount'         => $membership->transaction->amount,
                'payment_status' => $membership->transaction->payment_status,
                'checkout_url'   => $membership->transaction->checkout_url,
                'paid_at'        => $membership->transaction->paid_at?->format('Y-m-d H:i'),
            ] : null,
        ];
    }
}
