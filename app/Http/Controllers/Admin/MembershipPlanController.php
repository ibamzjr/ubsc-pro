<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MembershipPlan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class MembershipPlanController extends Controller
{
    private function gate(): void
    {
        abort_unless(
            auth()->user()?->hasAnyRole(['Administrator', 'Manager']),
            403,
        );
    }

    public function index(): Response
    {
        $this->gate();

        $plans = MembershipPlan::withCount([
            'memberships as active_members_count' => fn ($q) => $q->where('status', 'active'),
        ])
        ->orderBy('sort_order')
        ->get()
        ->map(fn (MembershipPlan $p) => [
            'id'                   => $p->id,
            'name'                 => $p->name,
            'description'          => $p->description,
            'price'                => $p->price,
            'duration_months'      => $p->duration_months,
            'features'             => $p->features ?? [],
            'is_active'            => $p->is_active,
            'sort_order'           => $p->sort_order,
            'active_members_count' => $p->active_members_count,
        ]);

        return Inertia::render('Admin/MembershipPlans/Index', [
            'plans' => $plans,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->gate();

        $data = $request->validate([
            'name'            => ['required', 'string', 'max:100'],
            'description'     => ['nullable', 'string'],
            'price'           => ['required', 'integer', 'min:0'],
            'duration_months' => ['required', Rule::in([1, 3, 6, 12])],
            'features'        => ['nullable', 'array'],
            'features.*'      => ['string', 'max:200'],
            'is_active'       => ['boolean'],
            'sort_order'      => ['integer'],
        ]);

        MembershipPlan::create($data);

        return redirect()->route('admin.memberships.plans.index')
            ->with('success', 'Paket membership berhasil dibuat.');
    }

    public function update(Request $request, MembershipPlan $plan): RedirectResponse
    {
        $this->gate();

        $data = $request->validate([
            'name'            => ['required', 'string', 'max:100'],
            'description'     => ['nullable', 'string'],
            'price'           => ['required', 'integer', 'min:0'],
            'duration_months' => ['required', Rule::in([1, 3, 6, 12])],
            'features'        => ['nullable', 'array'],
            'features.*'      => ['string', 'max:200'],
            'is_active'       => ['boolean'],
            'sort_order'      => ['integer'],
        ]);

        $plan->update($data);

        return back()->with('success', 'Paket berhasil diperbarui.');
    }

    public function destroy(MembershipPlan $plan): RedirectResponse
    {
        $this->gate();

        $count = $plan->memberships()->where('status', 'active')->count();

        if ($count > 0) {
            return back()->withErrors([
                'plan' => "Paket tidak dapat dihapus karena masih memiliki {$count} anggota aktif.",
            ]);
        }

        $plan->delete();

        return back()->with('success', 'Paket berhasil dihapus.');
    }
}
