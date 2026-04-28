<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReelController extends Controller
{
    public function index(): Response
    {
        $this->authorize('manage-cms');

        $items = Reel::with('media')
            ->orderBy('sort_order')
            ->get()
            ->map(fn (Reel $r) => [
                'id'            => $r->id,
                'title'         => $r->title,
                'subtitle'      => $r->subtitle,
                'video_url'     => $r->video_url,
                'is_featured'   => $r->is_featured,
                'is_active'     => $r->is_active,
                'sort_order'    => $r->sort_order,
                'thumbnail_url' => $r->getFirstMediaUrl('thumbnail') ?: null,
            ]);

        return Inertia::render('Admin/Reels/Index', ['items' => $items]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('manage-cms');

        $data = $request->validate([
            'title'       => ['required', 'string', 'max:255'],
            'subtitle'    => ['nullable', 'string', 'max:255'],
            'video_url'   => ['required', 'string', 'max:500'],
            'is_featured' => ['boolean'],
            'is_active'   => ['boolean'],
            'sort_order'  => ['integer', 'min:0'],
            'thumbnail'   => ['nullable', 'image', 'max:5120'],
        ]);

        $item = Reel::create([
            'title'       => $data['title'],
            'subtitle'    => $data['subtitle'] ?? null,
            'video_url'   => $data['video_url'],
            'is_featured' => $data['is_featured'] ?? false,
            'is_active'   => $data['is_active'] ?? true,
            'sort_order'  => $data['sort_order'] ?? 0,
        ]);

        if ($request->hasFile('thumbnail')) {
            $item->addMediaFromRequest('thumbnail')->toMediaCollection('thumbnail');
        }

        return back()->with('success', 'Reel created.');
    }

    public function update(Request $request, Reel $reel): RedirectResponse
    {
        $this->authorize('manage-cms');

        $data = $request->validate([
            'title'       => ['required', 'string', 'max:255'],
            'subtitle'    => ['nullable', 'string', 'max:255'],
            'video_url'   => ['required', 'string', 'max:500'],
            'is_featured' => ['boolean'],
            'is_active'   => ['boolean'],
            'sort_order'  => ['integer', 'min:0'],
            'thumbnail'   => ['nullable', 'image', 'max:5120'],
        ]);

        $reel->update([
            'title'       => $data['title'],
            'subtitle'    => $data['subtitle'] ?? null,
            'video_url'   => $data['video_url'],
            'is_featured' => $data['is_featured'] ?? $reel->is_featured,
            'is_active'   => $data['is_active'] ?? $reel->is_active,
            'sort_order'  => $data['sort_order'] ?? $reel->sort_order,
        ]);

        if ($request->hasFile('thumbnail')) {
            $reel->addMediaFromRequest('thumbnail')->toMediaCollection('thumbnail');
        }

        return back()->with('success', 'Reel updated.');
    }

    public function destroy(Reel $reel): RedirectResponse
    {
        $this->authorize('manage-cms');

        $reel->delete();

        return back()->with('success', 'Reel deleted.');
    }
}
