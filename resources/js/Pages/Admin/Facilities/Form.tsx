import { Head, router, useForm, usePage } from "@inertiajs/react";
import { ArrowLeft, Building2, Image, Save, Settings2, SlidersHorizontal } from "lucide-react";
import { useEffect } from "react";
import {
    MultiDropzone,
    SingleDropzone,
    type ExistingMedia,
} from "@/Components/Admin/ImageDropzone";
import { ADMIN_TOKENS } from "@/Components/Admin/tokens";
import AdminLayout from "@/Layouts/AdminLayout";
import type { FacilityCategory, FacilityItem, PageProps } from "@/types";

// ── Global styles — matches Roles & Bookings design system ───────────────────

const GLOBAL_STYLES = `
    .font-clash { font-family: 'Clash Display', sans-serif; }
    .font-bdo   { font-family: 'BDO Grotesk', sans-serif; }

    /* ── Entrance animations ── */
    @keyframes fadeInUp {
        from { opacity: 0; transform: translate3d(0, 28px, 0); }
        to   { opacity: 1; transform: translate3d(0, 0, 0); }
    }
    @keyframes fadeInLeft {
        from { opacity: 0; transform: translate3d(-20px, 0, 0); }
        to   { opacity: 1; transform: translate3d(0, 0, 0); }
    }
    @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.97); }
        to   { opacity: 1; transform: scale(1); }
    }

    .animate-fade-in-up   { animation: fadeInUp  0.65s cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; will-change:opacity,transform; }
    .animate-fade-in-left { animation: fadeInLeft 0.55s cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; will-change:opacity,transform; }
    .animate-scale-in     { animation: scaleIn    0.5s  cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; }

    .delay-50  { animation-delay:  50ms; }
    .delay-100 { animation-delay: 100ms; }
    .delay-150 { animation-delay: 150ms; }
    .delay-200 { animation-delay: 200ms; }
    .delay-250 { animation-delay: 250ms; }
    .delay-300 { animation-delay: 300ms; }
    .delay-350 { animation-delay: 350ms; }

    /* ── Shimmer sweep — one-shot on load ── */
    @keyframes shimmerSweep {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(200%); }
    }
    .shimmer-once {
        position: relative;
        overflow: hidden;
    }
    .shimmer-once::after {
        content: '';
        position: absolute; inset: 0;
        background: linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%);
        width: 60%;
        animation: shimmerSweep 1.1s ease-out 0.5s forwards;
        pointer-events: none;
        border-radius: inherit;
    }

    /* ── Icon glow pulse ── */
    @keyframes iconGlow {
        0%, 100% { box-shadow: 0 2px 8px rgba(15,23,42,0.2); }
        50%       { box-shadow: 0 2px 16px rgba(15,23,42,0.3), 0 0 24px rgba(251,191,36,0.12); }
    }
    .icon-glow { animation: iconGlow 3.5s ease-in-out infinite; }

    /* ── Top glint line on cards ── */
    .card-glint { position: relative; }
    .card-glint::before {
        content: '';
        position: absolute;
        top: 0; left: 20px; right: 20px; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent);
        pointer-events: none;
    }

    /* ── Toggle thumb glow ── */
    @keyframes thumbGlow {
        0%, 100% { box-shadow: 0 1px 4px rgba(0,0,0,0.2), 0 0 0 0 rgba(251,191,36,0); }
        50%       { box-shadow: 0 1px 8px rgba(0,0,0,0.25), 0 0 10px 2px rgba(251,191,36,0.35); }
    }
    .thumb-glow { animation: thumbGlow 2.5s ease-in-out infinite; }

    /* ── Save button shimmer ── */
    @keyframes btnSheen {
        0%   { left: -80%; }
        100% { left: 120%; }
    }
    .btn-sheen { position: relative; overflow: hidden; }
    .btn-sheen::before {
        content: '';
        position: absolute;
        top: 0; bottom: 0; width: 50%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        animation: btnSheen 3s ease-in-out 1s infinite;
    }

    /* ── Input focus ring — violet system ── */
    .input-field {
        width: 100%;
        border-radius: 0.75rem;
        border: 1px solid rgb(226 232 240 / 0.8);
        background: rgb(248 250 252 / 0.5);
        padding: 0.75rem 1rem;
        font-family: 'BDO Grotesk', sans-serif;
        font-size: 0.875rem;
        color: #0f172a;
        transition: all 0.15s;
        outline: none;
    }
    .input-field::placeholder { color: rgb(148 163 184); }
    .input-field:focus {
        background: white;
        border-color: rgb(139 92 246 / 0.6);
        box-shadow: 0 0 0 4px rgb(139 92 246 / 0.08);
    }
    .input-field.mono { font-family: 'ui-monospace', 'SFMono-Regular', monospace; font-size: 0.8125rem; }

    /* ── Section divider ── */
    .section-divider {
        height: 1px;
        background: linear-gradient(90deg, transparent, rgb(226 232 240), transparent);
        margin: 0.25rem 0;
    }
`;

// ── Types ─────────────────────────────────────────────────────────────────────

type Props = PageProps<{
    categories: Pick<FacilityCategory, "id" | "name">[];
    facility: FacilityItem | null;
}>;

type FormData = {
    facility_category_id: number | "";
    name: string;
    slug: string;
    description: string;
    is_active: boolean;
    sort_order: number;
    hero: File | null;
    gallery: File[];
    _method?: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugify(str: string): string {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ShinyIcon({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`relative flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-600 to-slate-900 shadow-[0_2px_10px_rgba(15,23,42,0.22),inset_0_1px_0_rgba(255,255,255,0.12)] icon-glow ${className ?? ""}`}>
            {children}
            <span className="pointer-events-none absolute top-[3px] left-[5px] right-[5px] h-[5px] rounded-full bg-white/20 blur-[1px]" />
        </div>
    );
}

function SectionCard({
    icon,
    accentColor = "amber",
    title,
    subtitle,
    children,
    className = "",
    animDelay = "delay-100",
}: {
    icon: React.ReactNode;
    accentColor?: "amber" | "violet" | "sky" | "emerald";
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    className?: string;
    animDelay?: string;
}) {
    const iconColors: Record<string, string> = {
        amber:   "text-amber-300",
        violet:  "text-violet-300",
        sky:     "text-sky-300",
        emerald: "text-emerald-300",
    };

    return (
        <div className={`animate-fade-in-up ${animDelay} card-glint shimmer-once relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-shadow duration-300 hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)] ${className}`}>
            {/* Section header */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
                <ShinyIcon className="h-9 w-9">
                    <span className={iconColors[accentColor]}>
                        {icon}
                    </span>
                </ShinyIcon>
                <div>
                    <p className="font-clash text-sm font-semibold text-slate-800 leading-tight">{title}</p>
                    {subtitle && (
                        <p className="font-bdo text-[11px] text-slate-400 mt-0.5">{subtitle}</p>
                    )}
                </div>
            </div>

            {/* Section body */}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}

// ── Refined Toggle Switch ─────────────────────────────────────────────────────

function ToggleSwitch({
    enabled,
    onChange,
}: {
    enabled: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => onChange(!enabled)}
            className={`relative inline-flex h-[26px] w-12 shrink-0 rounded-full p-[3px] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2 cursor-pointer ${
                enabled
                    ? "bg-gradient-to-r from-amber-400 to-yellow-500 shadow-[0_2px_8px_rgba(251,191,36,0.4),inset_0_1px_0_rgba(255,255,255,0.3)]"
                    : "bg-slate-200 shadow-[inset_0_1px_3px_rgba(0,0,0,0.12)]"
            }`}
        >
            <span
                className={`relative inline-block h-5 w-5 rounded-full bg-white transition-all duration-300 ${
                    enabled
                        ? "translate-x-[22px] shadow-[0_1px_4px_rgba(0,0,0,0.2)] thumb-glow"
                        : "translate-x-0 shadow-[0_1px_3px_rgba(0,0,0,0.15)]"
                }`}
            >
                <span className="pointer-events-none absolute top-[3px] left-[3px] right-[3px] h-[5px] rounded-full bg-white/70 blur-[0.5px]" />
            </span>
        </button>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function FacilityForm() {
    const { categories, facility } = usePage<Props>().props;
    const isEdit = facility !== null;

    const { data, setData, post, processing, errors, reset } =
        useForm<FormData>({
            facility_category_id: facility?.category?.id ?? "",
            name: facility?.name ?? "",
            slug: facility?.slug ?? "",
            description: facility?.description ?? "",
            is_active: facility?.is_active ?? true,
            sort_order: facility?.sort_order ?? 0,
            hero: null,
            gallery: [],
            ...(isEdit ? { _method: "PUT" } : {}),
        });

    useEffect(() => {
        if (!isEdit && data.name) {
            setData("slug", slugify(data.name));
        }
    }, [data.name, isEdit]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEdit
            ? route("admin.facilities.update", facility!.id)
            : route("admin.facilities.store");
        post(url, { forceFormData: true });
    };

    const existingHeroUrl = facility?.hero?.url ?? null;
    const existingGallery: ExistingMedia[] = facility?.gallery ?? [];

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4 animate-fade-in-up">
                    <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
                    <span className="font-bdo text-[11px] font-medium tracking-wide text-slate-400">
                        {isEdit ? "Edit Fasilitas" : "Fasilitas Baru"}
                    </span>
                    <h1 className="font-clash text-3xl font-bold uppercase tracking-tight xl:text-4xl text-slate-900">
                        {isEdit ? facility!.name : "Buat Fasilitas"}
                    </h1>
                </div>
            }
        >
            <Head title={isEdit ? `Edit ${facility!.name}` : "New Facility"} />

            <form
                onSubmit={submit}
                className="flex flex-col gap-6 pt-6 pb-20"
                encType="multipart/form-data"
            >
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

                    {/* ═══════════════════════════════════════
                        LEFT — Main fields (spans 2 cols)
                    ═══════════════════════════════════════ */}
                    <SectionCard
                        icon={<Building2 size={15} />}
                        accentColor="sky"
                        title="Informasi Utama"
                        subtitle="Data dasar dan deskripsi fasilitas"
                        className="xl:col-span-2"
                        animDelay="delay-100"
                    >
                        <div className="flex flex-col gap-5">

                            {/* Category */}
                            <div>
                                <label className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                                    Kategori
                                </label>
                                <select
                                    value={data.facility_category_id}
                                    onChange={(e) =>
                                        setData("facility_category_id", Number(e.target.value))
                                    }
                                    className="input-field"
                                >
                                    <option value="">Pilih kategori…</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.facility_category_id && (
                                    <p className="mt-1.5 font-bdo text-[11px] text-rose-500">
                                        {errors.facility_category_id}
                                    </p>
                                )}
                            </div>

                            {/* Name */}
                            <div>
                                <label className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                                    Nama Fasilitas
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    placeholder="Lapangan Bulutangkis Hall A"
                                    className="input-field"
                                />
                                {errors.name && (
                                    <p className="mt-1.5 font-bdo text-[11px] text-rose-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Slug */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        Slug URL
                                    </label>
                                    <span className="font-bdo text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg ring-1 ring-slate-200/80">
                                        Auto-generate dari nama
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    value={data.slug}
                                    onChange={(e) => setData("slug", e.target.value)}
                                    placeholder="lapangan-bulutangkis-hall-a"
                                    className="input-field mono"
                                />
                                {errors.slug && (
                                    <p className="mt-1.5 font-bdo text-[11px] text-rose-500">
                                        {errors.slug}
                                    </p>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="section-divider" />

                            {/* Description */}
                            <div>
                                <label className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                                    Deskripsi
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData("description", e.target.value)}
                                    rows={4}
                                    placeholder="Deskripsikan fasilitas ini…"
                                    className="input-field resize-none leading-relaxed"
                                />
                                {errors.description && (
                                    <p className="mt-1.5 font-bdo text-[11px] text-rose-500">
                                        {errors.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </SectionCard>

                    {/* ═══════════════════════════════════════
                        RIGHT — Settings + Media
                    ═══════════════════════════════════════ */}
                    <div className="flex flex-col gap-5">

                        {/* Settings card */}
                        <SectionCard
                            icon={<SlidersHorizontal size={15} />}
                            accentColor="amber"
                            title="Pengaturan"
                            subtitle="Status dan urutan tampil"
                            animDelay="delay-150"
                        >
                            <div className="flex flex-col gap-4">

                                {/* Active toggle */}
                                <div className="flex items-center justify-between rounded-xl bg-slate-50/80 px-4 py-3.5 ring-1 ring-slate-200/60 transition-all hover:bg-white hover:ring-slate-200">
                                    <div>
                                        <p className="font-clash text-sm font-semibold text-slate-800">
                                            Tampilkan di Situs
                                        </p>
                                        <p className="font-bdo text-[11px] text-slate-400 mt-0.5">
                                            {data.is_active ? "Fasilitas aktif & terlihat" : "Tersembunyi dari publik"}
                                        </p>
                                    </div>
                                    <ToggleSwitch
                                        enabled={data.is_active}
                                        onChange={(v) => setData("is_active", v)}
                                    />
                                </div>

                                {/* Divider */}
                                <div className="section-divider" />

                                {/* Sort order */}
                                <div>
                                    <label className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                                        Urutan Tampil
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={data.sort_order}
                                        onChange={(e) => setData("sort_order", Number(e.target.value))}
                                        className="input-field mono"
                                    />
                                    <p className="mt-1.5 font-bdo text-[10px] text-slate-400">
                                        Angka lebih kecil tampil lebih dulu
                                    </p>
                                </div>
                            </div>
                        </SectionCard>

                        {/* Media card */}
                        <SectionCard
                            icon={<Image size={15} />}
                            accentColor="violet"
                            title="Media"
                            subtitle="Hero image & galeri foto"
                            animDelay="delay-200"
                        >
                            <div className="flex flex-col gap-6">
                                <div>
                                    <p className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
                                        Hero Image
                                    </p>
                                    <SingleDropzone
                                        label="Hero Image"
                                        currentUrl={existingHeroUrl}
                                        onFileSelect={(file) => setData("hero", file)}
                                    />
                                </div>

                                <div className="section-divider" />

                                <div>
                                    <p className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
                                        Galeri
                                    </p>
                                    <MultiDropzone
                                        label="Gallery"
                                        existing={existingGallery}
                                        onFilesSelect={(files) =>
                                            setData("gallery", [...data.gallery, ...files])
                                        }
                                        onRemoveExisting={(id) => {
                                            router.delete(
                                                route("admin.facilities.gallery.destroy", id),
                                                { preserveScroll: true },
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                        </SectionCard>
                    </div>
                </div>

                {/* ── Action bar ── */}
                <div className="animate-fade-in-up delay-300 flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
                    {/* Cancel link */}
                    <a
                        href={route("admin.facilities.index")}
                        className="flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-clash text-sm font-semibold text-slate-600 bg-slate-100 transition-all hover:bg-slate-200 hover:text-slate-900"
                    >
                        <ArrowLeft size={14} />
                        Batal
                    </a>

                    {/* Divider on mobile */}
                    <div className="hidden sm:block section-divider w-px h-8 mx-1" />

                    {/* Hint text */}
                    <p className="flex-1 font-bdo text-[11px] text-slate-400 text-center sm:text-left hidden sm:block">
                        {isEdit
                            ? "Perubahan akan langsung diterapkan setelah disimpan."
                            : "Fasilitas baru akan langsung tersedia untuk dikonfigurasi."
                        }
                    </p>

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="btn-sheen relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 px-7 py-2.5 font-clash text-sm font-semibold text-white transition-all shadow-[0_4px_14px_rgba(5,150,105,0.35),inset_0_1px_0_rgba(255,255,255,0.15)] hover:shadow-[0_6px_20px_rgba(5,150,105,0.45)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                    >
                        <span className="pointer-events-none absolute top-0 left-0 right-0 h-px rounded-t-xl bg-white/20" />
                        <Save size={14} />
                        {processing
                            ? "Menyimpan…"
                            : isEdit
                              ? "Simpan Perubahan"
                              : "Buat Fasilitas"
                        }
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}