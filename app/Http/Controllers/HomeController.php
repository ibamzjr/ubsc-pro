<?php

namespace App\Http\Controllers;

use App\Http\Resources\Public\FacilityResource;
use App\Http\Resources\Public\NewsResource;
use App\Http\Resources\Public\PromoCarouselResource;
use App\Http\Resources\Public\ReelResource;
use App\Http\Resources\Public\SponsorLogoResource;
use App\Models\Facility;
use App\Models\MembershipPlan;
use App\Models\News;
use App\Models\PromoCarousel;
use App\Models\Reel;
use App\Models\Review;
use App\Models\SponsorLogo;
use App\Models\Testimonial;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('HomePage', [
            'membershipPlans' => MembershipPlan::where('is_active', true)
                ->orderBy('sort_order')
                ->get()
                ->map(fn ($p) => [
                    'id'              => $p->id,
                    'name'            => $p->name,
                    'price'           => $p->price,
                    'duration_months' => $p->duration_months,
                    'features'        => $p->features ?? [],
                ]),
            'promos'   => PromoCarouselResource::collection(
                PromoCarousel::active()->ordered()->get()
            )->resolve(),
            'sponsors' => SponsorLogoResource::collection(
                SponsorLogo::active()->ordered()->get()
            )->resolve(),
            'news' => NewsResource::collection(
                News::published()->with('category')->latest('published_at')->take(7)->get()
            )->resolve(),
            'reels' => ReelResource::collection(
                Reel::active()->latest()->take(8)->get()
            )->resolve(),
            'facilities' => FacilityResource::collection(
                Facility::active()->with('category', 'prices')->orderBy('sort_order')->get()
            )->resolve(),
            'testimonials' => Testimonial::active()->ordered()->with('media')->get()->map(fn ($t) => [
                'id'         => $t->id,
                'image'      => $t->imageUrl(),
                'quote'      => $t->quote,
                'authorName' => $t->author_name,
                'authorRole' => $t->author_role,
                'authorLogo' => $t->logoUrl(),
            ])->values()->all(),
            'reviews' => Review::approved()->latest()->take(10)->get()->map(fn ($r) => [
                'id'            => $r->id,
                'reviewer_name' => $r->reviewer_name ?? 'Guest',
                'rating'        => $r->rating,
                'text'          => $r->text,
            ])->values()->all(),
        ]);
    }
}
