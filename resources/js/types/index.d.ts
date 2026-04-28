export type IdentityCategory = "umum" | "warga_kampus";
export type IdentityStatus = "unverified" | "pending" | "verified" | "rejected";

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    phone_number?: string | null;
    identity_category?: IdentityCategory | null;
    identity_number?: string | null;
    identity_status?: IdentityStatus;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User | null;
        roles: string[];
        permissions: string[];
    };
};

// ─── Facility Types ───────────────────────────────────────────────────────────

export interface FacilityCategory {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    sort_order: number;
    facilities_count?: number;
}

export interface FacilityMedia {
    id: number;
    url: string;
    name: string;
    order_column: number;
}

export interface FacilityItem {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    is_active: boolean;
    sort_order: number;
    category: FacilityCategory;
    hero?: FacilityMedia | null;
    gallery: FacilityMedia[];
    prices_count?: number;
}

// ─── Identity Queue Types ─────────────────────────────────────────────────────

export interface IdentityUser {
    id: number;
    name: string;
    email: string;
    phone_number?: string | null;
    identity_category: IdentityCategory;
    identity_number?: string | null;
    identity_status: IdentityStatus;
    has_document: boolean;
    updated_at: string;
}

// ─── News Types ───────────────────────────────────────────────────────────────

export interface NewsCategory {
    id: number;
    name: string;
    slug: string;
    news_count?: number;
}

export type NewsStatus = "draft" | "published" | "archived";

export interface NewsItem {
    id: number;
    title: string;
    slug: string;
    excerpt?: string | null;
    status: NewsStatus;
    published_at?: string | null;
    updated_at: string;
    category?: NewsCategory | null;
    author: { id: number; name: string };
    thumbnail?: string | null;
}

// ─── CMS Types ────────────────────────────────────────────────────────────────

export interface PromoItem {
    id: number;
    title?: string | null;
    link_url?: string | null;
    is_active: boolean;
    sort_order: number;
    slide_url?: string | null;
}

export interface SponsorItem {
    id: number;
    name: string;
    link_url?: string | null;
    is_active: boolean;
    sort_order: number;
    logo_url?: string | null;
}

export interface AdminReelItem {
    id: number;
    title: string;
    subtitle?: string | null;
    video_url: string;
    is_featured: boolean;
    is_active: boolean;
    sort_order: number;
    thumbnail_url?: string | null;
}

export interface TestimonialItem {
    id: number;
    name: string;
    instance: string;
    message: string;
    rating?: number | null;
    is_active: boolean;
    sort_order: number;
    avatar_url?: string | null;
}
