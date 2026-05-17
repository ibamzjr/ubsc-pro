<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InfoBanner;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class InfoBannerController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('manage-cms');

        $data = $request->validate([
            'message'    => ['required', 'string', 'max:255'],
            'is_active'  => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
        ]);

        InfoBanner::create([
            'message'    => $data['message'],
            'is_active'  => $data['is_active'] ?? true,
            'sort_order' => $data['sort_order'] ?? 0,
        ]);

        return redirect()->route('admin.news.index')->with('success', 'Banner created.');
    }

    public function update(Request $request, InfoBanner $infoBanner): RedirectResponse
    {
        $this->authorize('manage-cms');

        $data = $request->validate([
            'message'    => ['required', 'string', 'max:255'],
            'is_active'  => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
        ]);

        $infoBanner->update([
            'message'    => $data['message'],
            'is_active'  => $data['is_active'] ?? $infoBanner->is_active,
            'sort_order' => $data['sort_order'] ?? $infoBanner->sort_order,
        ]);

        return redirect()->route('admin.news.index')->with('success', 'Banner updated.');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $this->authorize('manage-cms');

        $ids = $request->input('ids', []);
        foreach ($ids as $index => $id) {
            InfoBanner::where('id', $id)->update(['sort_order' => $index + 1]);
        }

        return back();
    }

    public function destroy(InfoBanner $infoBanner): RedirectResponse
    {
        $this->authorize('manage-cms');

        $infoBanner->delete();

        return redirect()->route('admin.news.index')->with('success', 'Banner deleted.');
    }
}
