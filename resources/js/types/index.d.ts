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
    role?: string | null;
    permissions?: string[];
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User | null;
    };
    flash?: {
        success?: string | null;
        error?: string | null;
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

// ─── Booking / Transaction Types ──────────────────────────────────────────────

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type PaymentStatus = "UNPAID" | "PAID" | "EXPIRED" | "FAILED";
export type UserCategory  = "warga_ub" | "umum";

export interface BookingTransaction {
    id: number;
    amount: number;
    payment_status: PaymentStatus;
    checkout_url: string | null;
    paid_at: string | null;
}

export interface AdminBooking {
    id: number;
    user_id: number;
    facility_id: number;
    booking_date: string;       // YYYY-MM-DD
    start_time: string;         // HH:MM
    end_time: string;           // HH:MM
    subtotal_price: number;
    status: BookingStatus;
    notes: string | null;
    customer_name: string;
    customer_phone: string | null;
    user_category: UserCategory;
    facility_name: string;
    transaction: BookingTransaction | null;
}

export type MembershipStatus = "active" | "expired" | "cancelled";

export interface AdminMembership {
    id: number;
    user_id: number;
    customer_name: string;
    customer_phone: string | null;
    start_date: string;          // YYYY-MM-DD
    end_date: string;            // YYYY-MM-DD
    status: MembershipStatus;
    transaction: BookingTransaction | null;
}
