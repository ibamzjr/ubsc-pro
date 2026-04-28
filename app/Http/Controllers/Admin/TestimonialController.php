<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    public function index(): Response
    {
        $this->authorize('manage-cms');

        $items = Testimonial::with('media')
            ->orderBy('sort_order')
            ->get()
            ->map(fn (Testimonial $t) => [
                'id'         => $t->id,
                'name'       => $t->name,
                'instance'   => $t->instance,
                'message'    => $t->message,
                'rating'     => $t->rating,
                'is_active'  => $t->is_active,
                'sort_order' => $t->sort_order,
                'avatar_url' => $t->getFirstMediaUrl('avatar') ?: null,
            ]);

        return Inertia::render('Admin/Testimonials/Index', ['items' => $items]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('manage-cms');

        $data = $request->validate([
            'name'       => ['required', 'string', 'max:255'],
            'instance'   => ['required', 'string', 'max:255'],
            'message'    => ['required', 'string'],
            'rating'     => ['nullable', 'integer', 'min:1', 'max:5'],
            'is_active'  => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
            'avatar'     => ['nullable', 'image', 'max:5120'],
        ]);

        $item = Testimonial::create([
            'name'       => $data['name'],
            'instance'   => $data['instance'],
            'message'    => $data['message'],
            'rating'     => $data['rating'] ?? null,
            'is_active'  => $data['is_active'] ?? true,
            'sort_order' => $data['sort_order'] ?? 0,
        ]);

        if ($request->hasFile('avatar')) {
            $item->addMediaFromRequest('avatar')->toMediaCollection('avatar');
        }

        return back()->with('success', 'Testimonial created.');
    }

    public function update(Request $request, Testimonial $testimonial): RedirectResponse
    {
        $this->authorize('manage-cms');

        $data = $request->validate([
            'name'       => ['required', 'string', 'max:255'],
            'instance'   => ['required', 'string', 'max:255'],
            'message'    => ['required', 'string'],
            'rating'     => ['nullable', 'integer', 'min:1', 'max:5'],
            'is_active'  => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
            'avatar'     => ['nullable', 'image', 'max:5120'],
        ]);

        $testimonial->update([
            'name'       => $data['name'],
            'instance'   => $data['instance'],
            'message'    => $data['message'],
            'rating'     => $data['rating'] ?? null,
            'is_active'  => $data['is_active'] ?? $testimonial->is_active,
            'sort_order' => $data['sort_order'] ?? $testimonial->sort_order,
        ]);

        if ($request->hasFile('avatar')) {
            $testimonial->addMediaFromRequest('avatar')->toMediaCollection('avatar');
        }

        return back()->with('success', 'Testimonial updated.');
    }

    public function destroy(Testimonial $testimonial): RedirectResponse
    {
        $this->authorize('manage-cms');

        $testimonial->delete();

        return back()->with('success', 'Testimonial deleted.');
    }
}
