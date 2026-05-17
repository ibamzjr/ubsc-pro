<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class FacilityPriceController extends Controller
{
    public function sync(Request $request, Facility $facility): RedirectResponse
    {
        $this->authorize('manage-facilities');

        $validated = $request->validate([
            'prices'                     => ['required', 'array'],
            'prices.*.user_category'     => ['required', 'string', 'max:50'],
            'prices.*.label'             => ['required', 'string', 'max:100'],
            'prices.*.price'             => ['required', 'numeric', 'min:0'],
            'prices.*.duration_minutes'  => ['nullable', 'integer', 'min:1'],
            'prices.*.notes'             => ['nullable', 'string', 'max:500'],
            'prices.*.sort_order'        => ['nullable', 'integer', 'min:0'],
        ]);

        $facility->prices()->delete();

        foreach ($validated['prices'] as $i => $p) {
            $facility->prices()->create([
                'user_category'   => $p['user_category'],
                'label'           => $p['label'],
                'price'           => $p['price'],
                'duration_minutes'=> $p['duration_minutes'] ?? 60,
                'notes'           => $p['notes'] ?? null,
                'sort_order'      => $p['sort_order'] ?? $i,
            ]);
        }

        return back()->with('success', 'Harga berhasil disimpan.');
    }
}
