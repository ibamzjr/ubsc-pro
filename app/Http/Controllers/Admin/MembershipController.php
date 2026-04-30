<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Membership;
use App\Models\MembershipPlan;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class MembershipController extends Controller
{
    public function index(): Response
    {
        $this->authorize('manage-bookings');

        $memberships = Membership::with(['user', 'transaction', 'plan'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($m) => $this->transform($m));

        $users = User::orderBy('name')
            ->get(['id', 'name', 'phone_number']);

        $plans = MembershipPlan::orderBy('sort_order')
            ->get(['id', 'name', 'price', 'duration_months']);

        return Inertia::render('Admin/Memberships/Index', [
            'memberships' => $memberships,
            'users'       => $users,
            'plans'       => $plans,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('manage-bookings');

        $data = $request->validate([
            'user_id'            => ['nullable', 'exists:users,id'],
            'customer_name'      => ['required_without:user_id', 'nullable', 'string', 'max:255'],
            'membership_plan_id' => ['nullable', 'exists:membership_plans,id'],
            'start_date'         => ['required', 'date'],
            'end_date'           => ['nullable', 'date', 'after:start_date'],
            'amount'             => ['nullable', 'integer', 'min:0'],
        ]);

        $planId = $data['membership_plan_id'] ?? null;

        if ($planId) {
            $plan = MembershipPlan::findOrFail($planId);
            // Auto-compute end_date from plan duration — staff doesn't calculate manually
            $data['end_date'] = Carbon::parse($data['start_date'])->addMonths($plan->duration_months)->toDateString();
            // Price snapshot: lock in current price so future price changes don't affect past records
            $amount = $plan->price;
        } else {
            $amount = (int) ($data['amount'] ?? 0);
        }

        $membership = Membership::create([
            'user_id'            => $data['user_id'] ?? null,
            'customer_name'      => $data['customer_name'] ?? null,
            'membership_plan_id' => $planId,
            'start_date'         => $data['start_date'],
            'end_date'           => $data['end_date'],
            'status'             => 'active',
        ]);

        $membership->transaction()->create([
            'user_id'        => $data['user_id'] ?? null,
            'amount'         => $amount,
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
            'id'                 => $membership->id,
            'user_id'            => $membership->user_id,
            'membership_plan_id' => $membership->membership_plan_id,
            'plan_name'          => $membership->plan?->name,
            'customer_name'      => $membership->customer_name ?? $membership->user?->name ?? 'Guest',
            'customer_phone'     => $membership->user?->phone_number,
            'start_date'         => $membership->start_date->format('Y-m-d'),
            'end_date'           => $membership->end_date->format('Y-m-d'),
            'status'             => $membership->status,
            'transaction'        => $membership->transaction ? [
                'id'             => $membership->transaction->id,
                'amount'         => $membership->transaction->amount,
                'payment_status' => $membership->transaction->payment_status,
                'checkout_url'   => $membership->transaction->checkout_url,
                'paid_at'        => $membership->transaction->paid_at?->format('Y-m-d H:i'),
            ] : null,
        ];
    }
}
