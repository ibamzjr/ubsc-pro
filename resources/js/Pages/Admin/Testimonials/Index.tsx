import { Head, router, useForm, usePage } from "@inertiajs/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import {
    MessageSquareQuote,
    Pencil,
    Plus,
    Quote,
    Star,
    Trash2,
    UserCircle2,
    Users,
} from "lucide-react";
import { useState } from "react";
import DataTable from "@/Components/Admin/DataTable";
import { SingleDropzone } from "@/Components/Admin/ImageDropzone";
import { ActiveBadge } from "@/Components/Admin/StatusBadge";
import SlideOver from "@/Components/Admin/SlideOver";
import AdminLayout from "@/Layouts/AdminLayout";
import type { PageProps, TestimonialItem } from "@/types";

// ── Types ─────────────────────────────────────────────────────────────────────

type Props = PageProps<{ items: TestimonialItem[] }>;

const helper = createColumnHelper<TestimonialItem>();

// ── Global styles ─────────────────────────────────────────────────────────────

const GLOBAL_STYLES = `
    .font-clash { font-family: 'Clash Display', sans-serif; }
    .font-bdo   { font-family: 'BDO Grotesk', sans-serif; }

    @keyframes fadeInUp {
        from { opacity: 0; transform: translate3d(0, 28px, 0); }
        to   { opacity: 1; transform: translate3d(0, 0, 0); }
    }
    @keyframes fadeInLeft {
        from { opacity: 0; transform: translate3d(-20px, 0, 0); }
        to   { opacity: 1; transform: translate3d(0, 0, 0); }
    }
    @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.96); }
        to   { opacity: 1; transform: scale(1); }
    }
    @keyframes shimmerSweep {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(220%); }
    }
    @keyframes iconGlow {
        0%, 100% { box-shadow: 0 2px 8px rgba(15,23,42,0.2); }
        50%       { box-shadow: 0 2px 16px rgba(15,23,42,0.3), 0 0 24px rgba(251,191,36,0.12); }
    }
    @keyframes btnSheen {
        0%   { left: -80%; }
        100% { left: 120%; }
    }
    @keyframes thumbGlow {
        0%, 100% { box-shadow: 0 1px 4px rgba(0,0,0,0.18), 0 0 0 0 rgba(251,191,36,0); }
        50%       { box-shadow: 0 1px 8px rgba(0,0,0,0.22), 0 0 10px 2px rgba(251,191,36,0.3); }
    }
    @keyframes starPop {
        0%   { transform: scale(0.6); opacity: 0; }
        70%  { transform: scale(1.2); }
        100% { transform: scale(1);   opacity: 1; }
    }

    .animate-fade-in-up   { animation: fadeInUp  0.65s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; will-change: opacity,transform; }
    .animate-fade-in-left { animation: fadeInLeft 0.55s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }
    .animate-scale-in     { animation: scaleIn    0.50s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }

    .delay-50  { animation-delay:  50ms; }
    .delay-100 { animation-delay: 100ms; }
    .delay-150 { animation-delay: 150ms; }
    .delay-200 { animation-delay: 200ms; }
    .delay-250 { animation-delay: 250ms; }
    .delay-300 { animation-delay: 300ms; }

    /* One-shot shimmer */
    .shimmer-once { position: relative; overflow: hidden; }
    .shimmer-once::after {
        content: '';
        position: absolute; inset: 0;
        background: linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%);
        width: 60%;
        animation: shimmerSweep 1.1s ease-out 0.4s forwards;
        pointer-events: none;
        border-radius: inherit;
    }

    .icon-glow   { animation: iconGlow  3.5s ease-in-out infinite; }
    .thumb-glow  { animation: thumbGlow 2.5s ease-in-out infinite; }

    /* Top glint line */
    .card-glint { position: relative; }
    .card-glint::before {
        content: '';
        position: absolute;
        top: 0; left: 20px; right: 20px; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent);
        pointer-events: none; z-index: 1;
    }

    /* Button sheen */
    .btn-sheen { position: relative; overflow: hidden; }
    .btn-sheen::before {
        content: '';
        position: absolute;
        top: 0; bottom: 0; width: 50%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        animation: btnSheen 3s ease-in-out 1s infinite;
    }

    /* Star animation in form */
    .star-pop { animation: starPop 0.3s cubic-bezier(0.16,1,0.3,1) both; }

    /* ── Form input system ── */
    .ti-input {
        width: 100%;
        border-radius: 0.75rem;
        border: 1px solid rgb(226 232 240 / 0.8);
        background: rgb(248 250 252 / 0.6);
        padding: 0.75rem 1rem;
        font-family: 'BDO Grotesk', sans-serif;
        font-size: 0.875rem;
        color: #0f172a;
        transition: all 0.15s;
        outline: none;
    }
    .ti-input::placeholder { color: rgb(148 163 184); }
    .ti-input:focus {
        background: white;
        border-color: rgb(245 158 11 / 0.5);
        box-shadow: 0 0 0 4px rgb(245 158 11 / 0.07);
    }

    /* Section divider */
    .ti-divider {
        height: 1px;
        background: linear-gradient(90deg, transparent, rgb(226 232 240), transparent);
    }

    /* Avatar initials gradient — each letter maps to a hue */
    .avatar-a { background: linear-gradient(135deg,#60a5fa,#818cf8); }
    .avatar-b { background: linear-gradient(135deg,#34d399,#059669); }
    .avatar-c { background: linear-gradient(135deg,#f472b6,#e11d48); }
    .avatar-d { background: linear-gradient(135deg,#fb923c,#ea580c); }
    .avatar-e { background: linear-gradient(135deg,#a78bfa,#7c3aed); }
    .avatar-f { background: linear-gradient(135deg,#38bdf8,#0284c7); }
    .avatar-g { background: linear-gradient(135deg,#4ade80,#16a34a); }
    .avatar-h { background: linear-gradient(135deg,#facc15,#ca8a04); }
    .avatar-default { background: linear-gradient(135deg,#94a3b8,#475569); }

    /* Quote mark decoration */
    .quote-mark {
        font-family: Georgia, serif;
        font-size: 3.5rem;
        line-height: 0.7;
        color: rgb(226 232 240);
        pointer-events: none;
        user-select: none;
    }

    /* Smooth toggle */
    .ti-toggle-track {
        position: relative;
        display: inline-flex;
        height: 26px;
        width: 48px;
        border-radius: 999px;
        padding: 3px;
        cursor: pointer;
        transition: all 0.3s;
    }
    .ti-toggle-thumb {
        position: relative;
        display: inline-block;
        height: 20px;
        width: 20px;
        border-radius: 999px;
        background: white;
        transition: all 0.3s;
    }
    .ti-toggle-thumb::before {
        content: '';
        position: absolute;
        top: 3px; left: 3px; right: 3px;
        height: 5px;
        border-radius: 999px;
        background: rgba(255,255,255,0.7);
        filter: blur(0.5px);
    }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Pick a letter-based gradient class for avatar */
function avatarClass(name: string): string {
    const classes = ["avatar-a","avatar-b","avatar-c","avatar-d","avatar-e","avatar-f","avatar-g","avatar-h"];
    const idx = (name.charCodeAt(0) || 0) % classes.length;
    return classes[idx] ?? "avatar-default";
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ShinyIcon({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`relative flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-600 to-slate-900 shadow-[0_2px_10px_rgba(15,23,42,0.22),inset_0_1px_0_rgba(255,255,255,0.12)] icon-glow ${className}`}>
            {children}
            <span className="pointer-events-none absolute top-[3px] left-[5px] right-[5px] h-[5px] rounded-full bg-white/20 blur-[1px]" />
        </div>
    );
}

/** Refined star rating row — used in both table and form */
function StarRating({ rating, size = 12 }: { rating: number | null | undefined; size?: number }) {
    if (!rating) return (
        <span className="font-bdo text-[11px] italic text-slate-300">—</span>
    );
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
                <Star
                    key={n}
                    size={size}
                    className={
                        n <= rating
                            ? "fill-amber-400 text-amber-400 drop-shadow-[0_1px_2px_rgba(251,191,36,0.4)]"
                            : "fill-slate-100 text-slate-200"
                    }
                />
            ))}
            <span className="ml-1 font-bdo text-[10px] font-bold text-amber-500 tabular-nums">
                {rating}/5
            </span>
        </div>
    );
}

/** Avatar used in table rows */
function AvatarCell({ url, name }: { url: string | null | undefined; name: string }) {
    if (url) {
        return (
            <div className="relative h-9 w-9 shrink-0">
                <img
                    src={url}
                    alt={name}
                    className="h-full w-full rounded-xl object-cover ring-2 ring-white shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
                />
                <span className="pointer-events-none absolute top-[2px] left-[3px] right-[3px] h-[4px] rounded-full bg-white/20 blur-[0.5px]" />
            </div>
        );
    }
    return (
        <div className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-clash text-sm font-bold text-white shadow-[0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2)] ${avatarClass(name)}`}>
            {name.charAt(0).toUpperCase()}
            <span className="pointer-events-none absolute top-[3px] left-[3px] right-[3px] h-[4px] rounded-full bg-white/25 blur-[0.5px]" />
        </div>
    );
}

/** Toggle switch — replaces the plain checkbox */
function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => onChange(!enabled)}
            className={`ti-toggle-track focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2 ${
                enabled
                    ? "bg-gradient-to-r from-amber-400 to-yellow-500 shadow-[0_2px_8px_rgba(251,191,36,0.4),inset_0_1px_0_rgba(255,255,255,0.3)]"
                    : "bg-slate-200 shadow-[inset_0_1px_3px_rgba(0,0,0,0.12)]"
            }`}
        >
            <span className={`ti-toggle-thumb ${enabled ? "translate-x-[22px] thumb-glow" : "translate-x-0 shadow-[0_1px_3px_rgba(0,0,0,0.15)]"}`} />
        </button>
    );
}

// ── Form ──────────────────────────────────────────────────────────────────────

type FormData = {
    name: string;
    instance: string;
    message: string;
    rating: number | "";
    is_active: boolean;
    sort_order: number;
    avatar: File | null;
    _method?: string;
};

function TestimonialForm({ item, onClose }: { item: TestimonialItem | null; onClose: () => void }) {
    const isEdit = item !== null;

    const { data, setData, post, processing, errors } = useForm<FormData>({
        name:       item?.name       ?? "",
        instance:   item?.instance   ?? "",
        message:    item?.message    ?? "",
        rating:     item?.rating     ?? "",
        is_active:  item?.is_active  ?? true,
        sort_order: item?.sort_order ?? 0,
        avatar: null,
        ...(isEdit ? { _method: "PUT" } : {}),
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEdit
            ? route("admin.testimonials.update", item!.id)
            : route("admin.testimonials.store");
        post(url, { forceFormData: true, onSuccess: onClose });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-5 animate-fade-in-up">

            {/* ── Person info ── */}
            <div className="flex flex-col gap-4">
                <div>
                    <label className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                        Nama Lengkap
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        placeholder="Nama lengkap…"
                        className="ti-input"
                    />
                    {errors.name && (
                        <p className="mt-1.5 font-bdo text-[11px] text-rose-500">{errors.name}</p>
                    )}
                </div>

                <div>
                    <label className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                        Instansi / Organisasi
                    </label>
                    <input
                        type="text"
                        value={data.instance}
                        onChange={(e) => setData("instance", e.target.value)}
                        placeholder="Fakultas, perusahaan, atau afiliasi…"
                        className="ti-input"
                    />
                    {errors.instance && (
                        <p className="mt-1.5 font-bdo text-[11px] text-rose-500">{errors.instance}</p>
                    )}
                </div>
            </div>

            <div className="ti-divider" />

            {/* ── Testimonial message ── */}
            <div>
                <label className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                    Pesan Testimoni
                </label>
                <div className="relative">
                    <span className="quote-mark pointer-events-none absolute -top-1 left-2 select-none">"</span>
                    <textarea
                        value={data.message}
                        onChange={(e) => setData("message", e.target.value)}
                        rows={4}
                        placeholder="Tulis testimoni…"
                        className="ti-input resize-none pl-8 pt-4 leading-relaxed"
                    />
                </div>
                {errors.message && (
                    <p className="mt-1.5 font-bdo text-[11px] text-rose-500">{errors.message}</p>
                )}
            </div>

            {/* ── Rating + Sort order ── */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                        Rating
                    </label>
                    <select
                        value={data.rating}
                        onChange={(e) =>
                            setData("rating", e.target.value ? Number(e.target.value) : "")
                        }
                        className="ti-input"
                    >
                        <option value="">Tanpa rating</option>
                        {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>
                                {"★".repeat(n)} {n}/5
                            </option>
                        ))}
                    </select>

                    {/* Live star preview */}
                    {data.rating !== "" && data.rating > 0 && (
                        <div className="mt-2 flex items-center gap-0.5">
                            {[1,2,3,4,5].map((n) => (
                                <Star
                                    key={n}
                                    size={14}
                                    className={`star-pop transition-all ${
                                        n <= (data.rating as number)
                                            ? "fill-amber-400 text-amber-400"
                                            : "fill-slate-100 text-slate-200"
                                    }`}
                                    style={{ animationDelay: `${n * 40}ms` }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <label className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                        Urutan Tampil
                    </label>
                    <input
                        type="number"
                        min={0}
                        value={data.sort_order}
                        onChange={(e) => setData("sort_order", Number(e.target.value))}
                        className="ti-input"
                    />
                </div>
            </div>

            <div className="ti-divider" />

            {/* ── is_active toggle (replaces checkbox visually, same logic) ── */}
            <div className="flex items-center justify-between rounded-xl bg-slate-50/80 px-4 py-3.5 ring-1 ring-slate-200/60">
                <div>
                    <p className="font-clash text-sm font-semibold text-slate-800">Status Aktif</p>
                    <p className="font-bdo text-[11px] text-slate-400 mt-0.5">
                        {data.is_active ? "Ditampilkan di halaman publik" : "Disembunyikan dari publik"}
                    </p>
                </div>
                <ToggleSwitch
                    enabled={data.is_active}
                    onChange={(v) => setData("is_active", v)}
                />
            </div>

            {/* ── Avatar dropzone ── */}
            <div>
                <label className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 block">
                    Foto Avatar
                </label>
                <SingleDropzone
                    label=""
                    currentUrl={item?.avatar_url ?? null}
                    onFileSelect={(f) => setData("avatar", f)}
                />
                {errors.avatar && (
                    <p className="mt-1.5 font-bdo text-[11px] text-rose-500">{errors.avatar}</p>
                )}
            </div>

            {/* ── Submit row ── */}
            <div className="flex items-center gap-3 pt-1 border-t border-slate-100">
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl px-5 py-2.5 font-clash text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="btn-sheen relative flex-1 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 py-2.5 font-clash text-sm font-semibold text-white transition-all shadow-[0_4px_14px_rgba(5,150,105,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] hover:shadow-[0_6px_20px_rgba(5,150,105,0.4)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0"
                >
                    <span className="pointer-events-none absolute top-0 left-0 right-0 h-px rounded-t-xl bg-white/20" />
                    {processing ? "Menyimpan…" : isEdit ? "Simpan Perubahan" : "Tambah Testimoni"}
                </button>
            </div>
        </form>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TestimonialsIndex() {
    const { items } = usePage<Props>().props;

    const [slideOver, setSlideOver] = useState<{
        open: boolean;
        item: TestimonialItem | null;
    }>({ open: false, item: null });

    const openNew  = () => setSlideOver({ open: true,  item: null });
    const openEdit = (item: TestimonialItem) => setSlideOver({ open: true, item });
    const close    = () => setSlideOver({ open: false, item: null });

    const handleDelete = (item: TestimonialItem) => {
        if (!confirm(`Hapus testimoni dari "${item.name}"?`)) return;
        router.delete(route("admin.testimonials.destroy", item.id));
    };

    // ── Column definitions ────────────────────────────────────────────────────

    const columns = [
        helper.accessor("avatar_url", {
            header: "Avatar",
            cell: (info) => (
                <AvatarCell
                    url={info.getValue()}
                    name={info.row.original.name}
                />
            ),
        }),

        helper.accessor("name", {
            header: "Person",
            enableSorting: true,
            cell: (info) => {
                const t = info.row.original;
                return (
                    <div className="flex flex-col gap-0.5 min-w-0">
                        <p className="font-clash text-sm font-semibold text-slate-800 truncate leading-snug">
                            {t.name}
                        </p>
                        {t.instance && (
                            <p className="font-bdo text-[11px] text-slate-400 truncate">
                                {t.instance}
                            </p>
                        )}
                    </div>
                );
            },
        }),

        helper.accessor("message", {
            header: "Pesan",
            cell: (info) => (
                <div className="relative max-w-[220px]">
                    <Quote
                        size={12}
                        className="absolute -top-0.5 -left-0.5 shrink-0 text-slate-200"
                    />
                    <p className="font-bdo pl-4 text-[12px] leading-relaxed text-slate-600 line-clamp-2">
                        {info.getValue()}
                    </p>
                </div>
            ),
        }),

        helper.accessor("rating", {
            header: "Rating",
            cell: (info) => <StarRating rating={info.getValue()} />,
        }),

        helper.accessor("is_active", {
            header: "Status",
            cell: (info) => <ActiveBadge active={info.getValue()} />,
        }),

        helper.accessor("sort_order", {
            header: "Order",
            enableSorting: true,
            cell: (info) => (
                <span className="font-mono text-xs font-medium text-slate-400 tabular-nums">
                    #{info.getValue()}
                </span>
            ),
        }),

        helper.display({
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={() => openEdit(row.original)}
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700 hover:shadow-sm"
                        title="Edit"
                    >
                        <Pencil size={13} />
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDelete(row.original)}
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-400 transition-all hover:bg-rose-100 hover:text-rose-600 hover:shadow-sm"
                        title="Hapus"
                    >
                        <Trash2 size={13} />
                    </button>
                </div>
            ),
        }),
    ];

    // ── Derived counts ────────────────────────────────────────────────────────
    const active   = items.filter((i) => i.is_active).length;
    const withRating = items.filter((i) => i.rating).length;
    const avgRating = withRating > 0
        ? (items.reduce((s, i) => s + (i.rating ?? 0), 0) / withRating).toFixed(1)
        : null;

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4 animate-fade-in-up">
                    <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
                    <span className="font-bdo text-[11px] font-medium tracking-wide text-orange-400">
                        Manajemen Konten
                    </span>
                    <h1 className="font-clash text-3xl font-bold uppercase tracking-tight xl:text-4xl text-slate-900">
                        Testimoni
                    </h1>
                </div>
            }
        >
            <Head title="Testimonials" />

            <div className="flex flex-col gap-6 pt-6 pb-20 overflow-x-hidden">

                {/* ── Stats toolbar ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up delay-100">

                    {/* Pills */}
                    <div className="flex flex-wrap items-center gap-2.5">

                        <div className="flex items-center gap-2 rounded-xl bg-sky-50 px-3.5 py-1.5 border border-sky-100 shadow-sm">
                            <Users size={11} className="text-sky-500" />
                            <span className="font-bdo text-[11px] font-bold text-sky-600 uppercase tracking-wider">
                                {items.length} Total
                            </span>
                        </div>

                        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-1.5 border border-emerald-100 shadow-sm">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="font-bdo text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                                {active} Aktif
                            </span>
                        </div>

                        {avgRating && (
                            <div className="flex items-center gap-1.5 rounded-xl bg-amber-50 px-3.5 py-1.5 border border-amber-100 shadow-sm">
                                <Star size={11} className="fill-amber-400 text-amber-400" />
                                <span className="font-bdo text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                                    Rata-rata {avgRating}
                                </span>
                            </div>
                        )}

                        {items.length - active > 0 && (
                            <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3.5 py-1.5 border border-slate-200 shadow-sm">
                                <span className="h-2 w-2 rounded-full bg-slate-400" />
                                <span className="font-bdo text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    {items.length - active} Nonaktif
                                </span>
                            </div>
                        )}
                    </div>

                    {/* CTA */}
                    <button
                        type="button"
                        onClick={openNew}
                        className="btn-sheen relative flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 px-5 py-3 font-clash text-sm font-semibold text-white transition-all shadow-[0_4px_14px_rgba(5,150,105,0.35),inset_0_1px_0_rgba(255,255,255,0.15)] hover:shadow-[0_6px_20px_rgba(5,150,105,0.45)] hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <span className="pointer-events-none absolute top-0 left-0 right-0 h-px rounded-t-xl bg-white/20" />
                        <Plus size={16} />
                        Tambah Testimoni
                    </button>
                </div>

                {/* ── DataTable card ── */}
                <div className="animate-fade-in-up delay-200 card-glint rounded-[24px] border border-slate-200/80 bg-white p-2 shadow-[0_1px_4px_rgba(0,0,0,0.05)] overflow-hidden">
                    <DataTable
                        columns={columns as ColumnDef<TestimonialItem, unknown>[]}
                        data={items}
                        searchColumn="name"
                        searchPlaceholder="Cari testimoni…"
                        emptyMessage="Belum ada testimoni. Tambahkan testimoni pertama."
                        toolbar={
                            <button
                                type="button"
                                onClick={openNew}
                                className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 px-4 py-2.5 font-bdo text-xs font-bold text-white uppercase tracking-wider transition-all hover:shadow-md hover:-translate-y-px active:translate-y-0"
                            >
                                <Plus size={14} />
                                Baru
                            </button>
                        }
                    />
                </div>
            </div>

            {/* ── SlideOver ── */}
            <SlideOver
                isOpen={slideOver.open}
                onClose={close}
                title={
                    <div className="flex items-center gap-2.5">
                        <ShinyIcon className="h-8 w-8">
                            <MessageSquareQuote size={13} className="text-amber-300" />
                        </ShinyIcon>
                        <span className="font-clash text-lg font-bold text-slate-900">
                            {slideOver.item ? "Edit Testimoni" : "Tambah Testimoni"}
                        </span>
                    </div>
                }
                description={
                    <span className="font-bdo text-sm text-slate-400">
                        {slideOver.item
                            ? <>Mengedit <strong className="text-slate-600">"{slideOver.item.name}"</strong></>
                            : "Isi detail testimoni baru."
                        }
                    </span>
                }
            >
                {slideOver.open && (
                    <TestimonialForm
                        key={slideOver.item?.id ?? "new"}
                        item={slideOver.item}
                        onClose={close}
                    />
                )}
            </SlideOver>
        </AdminLayout>
    );
}