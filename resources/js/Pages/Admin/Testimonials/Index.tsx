import { useEffect, useState } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import {
    DndContext,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import {
    Building2,
    Check,
    ImageIcon,
    MessageSquare,
    Pencil,
    Plus,
    Star,
    Trash2,
    X,
} from "lucide-react";
import SortableCard from "@/Components/Admin/SortableCard";
import { SingleDropzone } from "@/Components/Admin/ImageDropzone";
import SlideOver from "@/Components/Admin/SlideOver";
import AdminLayout from "@/Layouts/AdminLayout";
import { cn } from "@/lib/utils";
import type { PageProps, ReviewItem, TestimonialItem } from "@/types";

type Props = PageProps<{ testimonials: TestimonialItem[]; reviews: ReviewItem[] }>;

// ── Styles ────────────────────────────────────────────────────────────────────

const GLOBAL_STYLES = `
    .font-clash { font-family: 'Clash Display', sans-serif; }
    .font-bdo   { font-family: 'BDO Grotesk', sans-serif; }

    @keyframes fadeInUp {
        from { opacity: 0; transform: translate3d(0, 28px, 0); }
        to   { opacity: 1; transform: translate3d(0, 0, 0); }
    }
    .animate-fade-in-up { animation: fadeInUp 0.65s cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; will-change:opacity,transform; }
    .delay-100 { animation-delay: 100ms; }
    .delay-200 { animation-delay: 200ms; }

    @keyframes shimmerSweep {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(200%); }
    }
    .shimmer-once { position: relative; overflow: hidden; }
    .shimmer-once::after {
        content: '';
        position: absolute; inset: 0;
        background: linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%);
        width: 60%;
        animation: shimmerSweep 1.1s ease-out 0.5s forwards;
        pointer-events: none;
        border-radius: inherit;
    }

    @keyframes iconGlow {
        0%, 100% { box-shadow: 0 2px 8px rgba(15,23,42,0.2); }
        50%       { box-shadow: 0 2px 16px rgba(15,23,42,0.3), 0 0 24px rgba(249,115,22,0.12); }
    }
    .icon-glow { animation: iconGlow 3.5s ease-in-out infinite; }

    @keyframes btnSheen {
        0%   { left: -80%; }
        100% { left: 120%; }
    }
    .btn-sheen { position: relative; overflow: hidden; }
    .btn-sheen::before {
        content: '';
        position: absolute; top: 0; bottom: 0; width: 50%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        animation: btnSheen 3s ease-in-out 1s infinite;
    }

    .card-glint::before {
        content: '';
        position: absolute;
        top: 0; left: 20px; right: 20px; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent);
        pointer-events: none;
    }
`;

const inputBase =
    "w-full rounded-2xl border-0 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-slate-900 transition-colors";
const labelBase =
    "font-clash text-xs font-medium uppercase tracking-wider text-gray-500";

// ── Types ─────────────────────────────────────────────────────────────────────

type FormData = {
    author_name: string;
    author_role: string;
    quote: string;
    is_active: boolean;
    sort_order: number;
    image: File | null;
    logo: File | null;
    _method?: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function ShinyIcon({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn(
            "relative flex shrink-0 items-center justify-center rounded-xl",
            "bg-gradient-to-br from-orange-400 to-orange-600",
            "shadow-[0_2px_10px_rgba(15,23,42,0.22),inset_0_1px_0_rgba(255,255,255,0.12)]",
            "icon-glow",
            className,
        )}>
            {children}
            <span className="pointer-events-none absolute top-[3px] left-[5px] right-[5px] h-[5px] rounded-full bg-white/20 blur-[1px]" />
        </div>
    );
}

function StarRow({ rating, size = 12 }: { rating: number; size?: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
                <Star
                    key={n}
                    size={size}
                    className={n <= rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}
                />
            ))}
        </div>
    );
}

// ── TestimonialForm ───────────────────────────────────────────────────────────

function TestimonialForm({ item, onClose }: { item: TestimonialItem | null; onClose: () => void }) {
    const isEdit = item !== null;
    const { data, setData, post, processing, errors } = useForm<FormData>({
        author_name: item?.author_name ?? "",
        author_role: item?.author_role ?? "",
        quote: item?.quote ?? "",
        is_active: item?.is_active ?? true,
        sort_order: item?.sort_order ?? 0,
        image: null,
        logo: null,
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
        <form onSubmit={submit} className="flex flex-col gap-5">
            <div>
                <label className={labelBase}>Nama Institusi / Tokoh</label>
                <input
                    type="text"
                    value={data.author_name}
                    onChange={(e) => setData("author_name", e.target.value)}
                    placeholder="Nama institusi atau tokoh…"
                    className={`${inputBase} mt-1.5`}
                />
                {errors.author_name && <p className="mt-1 text-xs text-rose-500">{errors.author_name}</p>}
            </div>

            <div>
                <label className={labelBase}>Peran / Jabatan</label>
                <input
                    type="text"
                    value={data.author_role}
                    onChange={(e) => setData("author_role", e.target.value)}
                    placeholder="Contoh: Akademi Tenis, Klub Futsal…"
                    className={`${inputBase} mt-1.5`}
                />
                {errors.author_role && <p className="mt-1 text-xs text-rose-500">{errors.author_role}</p>}
            </div>

            <div>
                <label className={labelBase}>Kutipan Testimoni</label>
                <textarea
                    value={data.quote}
                    onChange={(e) => setData("quote", e.target.value)}
                    placeholder="Tuliskan kutipan testimoni…"
                    rows={4}
                    className={`${inputBase} mt-1.5 resize-none`}
                />
                {errors.quote && <p className="mt-1 text-xs text-rose-500">{errors.quote}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelBase}>Urutan Tampil</label>
                    <input
                        type="number"
                        min={0}
                        value={data.sort_order}
                        onChange={(e) => setData("sort_order", Number(e.target.value))}
                        className={`${inputBase} mt-1.5`}
                    />
                </div>
                <div className="flex flex-col justify-end pb-1">
                    <label className="flex cursor-pointer items-center gap-3">
                        <input
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(e) => setData("is_active", e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                        />
                        <span className={labelBase}>Aktif</span>
                    </label>
                </div>
            </div>

            <div>
                <label className={`${labelBase} mb-1.5 block`}>Foto Institusi</label>
                <SingleDropzone
                    label=""
                    currentUrl={item?.image_url ?? null}
                    onFileSelect={(f) => setData("image", f)}
                />
                {errors.image && <p className="mt-1 text-xs text-rose-500">{errors.image}</p>}
            </div>

            <div>
                <label className={`${labelBase} mb-1.5 block`}>Logo Institusi</label>
                <SingleDropzone
                    label=""
                    currentUrl={item?.logo_url ?? null}
                    onFileSelect={(f) => setData("logo", f)}
                />
                {errors.logo && <p className="mt-1 text-xs text-rose-500">{errors.logo}</p>}
            </div>

            <div className="flex items-center gap-3 pt-2">
                <button
                    type="submit"
                    disabled={processing}
                    className="btn-sheen relative flex-1 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 py-3 text-sm font-medium text-white shadow-[0_4px_14px_rgba(15,23,42,0.25),inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-200 hover:shadow-[0_6px_20px_rgba(15,23,42,0.3)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
                >
                    <span className="pointer-events-none absolute top-0 left-0 right-0 h-px rounded-t-2xl bg-white/20" />
                    {processing ? "Menyimpan…" : isEdit ? "Simpan Perubahan" : "Tambah Testimoni"}
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-2xl px-5 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                >
                    Batal
                </button>
            </div>
        </form>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function TestimonialsIndex() {
    const { testimonials: initialTestimonials, reviews } = usePage<Props>().props;

    const [items, setItems] = useState<TestimonialItem[]>(initialTestimonials);
    const [activeTab, setActiveTab] = useState<"testimonials" | "reviews">("testimonials");
    const [slideOver, setSlideOver] = useState<{ open: boolean; item: TestimonialItem | null }>({
        open: false,
        item: null,
    });

    useEffect(() => setItems(initialTestimonials), [initialTestimonials]);

    const openNew = () => setSlideOver({ open: true, item: null });
    const openEdit = (item: TestimonialItem) => setSlideOver({ open: true, item });
    const close = () => setSlideOver({ open: false, item: null });

    const handleDelete = (item: TestimonialItem) => {
        if (!confirm(`Hapus testimoni dari "${item.author_name}"?`)) return;
        router.delete(route("admin.testimonials.destroy", item.id));
    };

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = items.findIndex((i) => i.id.toString() === active.id);
        const newIndex = items.findIndex((i) => i.id.toString() === over.id);
        const reordered = arrayMove(items, oldIndex, newIndex);
        setItems(reordered);
        router.post(
            route("admin.testimonials.reorder"),
            { ids: reordered.map((i) => i.id) },
            { preserveScroll: true },
        );
    };

    const handleToggleApprove = (review: ReviewItem) => {
        router.post(
            route("admin.reviews.toggle-approve", review.id),
            {},
            { preserveScroll: true },
        );
    };

    const handleDeleteReview = (review: ReviewItem) => {
        if (!confirm(`Hapus review dari "${review.reviewer_name}"?`)) return;
        router.delete(route("admin.reviews.destroy", review.id));
    };

    const activeCount = items.filter((i) => i.is_active).length;
    const pendingCount = reviews.filter((r) => !r.is_approved).length;

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4 animate-fade-in-up">
                    <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
                    <span className="font-bdo text-[11px] font-medium tracking-wide text-orange-500">
                        Manajemen Konten
                    </span>
                    <h1 className="font-clash text-3xl font-bold tracking-tight xl:text-4xl text-slate-900 uppercase">
                        Testimoni & Review
                    </h1>
                </div>
            }
        >
            <Head title="Testimoni & Review" />

            <div className="pt-6 pb-20 flex flex-col gap-5">

                {/* ── Tabs ── */}
                <div className="animate-fade-in-up flex gap-1 rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                    <button
                        type="button"
                        onClick={() => setActiveTab("testimonials")}
                        className={cn(
                            "flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all duration-200",
                            activeTab === "testimonials"
                                ? "bg-orange-50 text-orange-600 ring-1 ring-orange-200"
                                : "text-slate-500 hover:text-slate-800",
                        )}
                    >
                        <Building2 size={15} />
                        <span className="font-clash">Testimoni Institusi</span>
                        <span className={cn(
                            "rounded-full px-1.5 py-0.5 font-bdo text-[10px] font-bold",
                            activeTab === "testimonials"
                                ? "bg-orange-200 text-orange-700"
                                : "bg-slate-100 text-slate-500",
                        )}>
                            {items.length}
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("reviews")}
                        className={cn(
                            "flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all duration-200",
                            activeTab === "reviews"
                                ? "bg-orange-50 text-orange-600 ring-1 ring-orange-200"
                                : "text-slate-500 hover:text-slate-800",
                        )}
                    >
                        <MessageSquare size={15} />
                        <span className="font-clash">Review Pengguna</span>
                        {pendingCount > 0 && (
                            <span className={cn(
                                "rounded-full px-1.5 py-0.5 font-bdo text-[10px] font-bold",
                                activeTab === "reviews"
                                    ? "bg-orange-200 text-orange-800"
                                    : "bg-amber-100 text-amber-700",
                            )}>
                                {pendingCount} pending
                            </span>
                        )}
                    </button>
                </div>

                {/* ══ TAB 1: Testimoni Institusi ══ */}
                {activeTab === "testimonials" && (
                    <>
                        <div className="relative card-glint shimmer-once overflow-hidden flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] animate-fade-in-up delay-100">
                            <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/70 to-transparent" />
                            <div className="flex items-center gap-4">
                                <ShinyIcon className="h-10 w-10 shrink-0">
                                    <Building2 size={18} className="text-orange-100" />
                                </ShinyIcon>
                                <div className="min-w-0">
                                    <p className="font-bdo text-sm font-bold tracking-tight text-slate-700">
                                        Testimoni Institusi
                                    </p>
                                    <p className="font-clash text-xs font-medium text-slate-400 leading-snug mt-0.5 max-w-sm">
                                        Seret kartu untuk mengatur urutan tampil di halaman publik.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5 sm:shrink-0">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200 font-bdo">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_5px_rgba(52,211,153,0.7)]" />
                                    {activeCount} Aktif
                                </span>
                                <span className="font-bdo text-sm text-slate-500">{items.length} Total</span>
                                <button
                                    type="button"
                                    onClick={openNew}
                                    className="btn-sheen relative flex items-center gap-2 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-medium text-white shadow-[0_4px_14px_rgba(15,23,42,0.25),inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-200 hover:shadow-[0_6px_20px_rgba(15,23,42,0.3)] hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    <span className="pointer-events-none absolute top-0 left-0 right-0 h-px rounded-t-2xl bg-white/20" />
                                    <Plus size={15} />
                                    Tambah Testimoni
                                </button>
                            </div>
                        </div>

                        {items.length === 0 ? (
                            <div className="animate-fade-in-up delay-200 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
                                <Building2 size={32} className="text-slate-300" />
                                <p className="font-bdo text-sm text-slate-400">Belum ada testimoni. Tambahkan yang pertama!</p>
                            </div>
                        ) : (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={items.map((i) => i.id.toString())}
                                    strategy={rectSortingStrategy}
                                >
                                    <div className="animate-fade-in-up delay-200 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {items.map((item, idx) => (
                                            <SortableCard key={item.id} id={item.id.toString()}>
                                                {(handle) => (
                                                    <div className={cn(
                                                        "group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white",
                                                        "shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-md",
                                                    )}>
                                                        {/* Thumbnail */}
                                                        <div className="relative aspect-video overflow-hidden bg-slate-100">
                                                            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-14 bg-gradient-to-b from-black/50 to-transparent" />
                                                            {item.image_url ? (
                                                                <img
                                                                    src={item.image_url}
                                                                    alt={item.author_name}
                                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                                />
                                                            ) : (
                                                                <div className="flex h-full flex-col items-center justify-center gap-1.5 text-slate-300">
                                                                    <ImageIcon size={22} />
                                                                    <span className="font-bdo text-[9px]">No Image</span>
                                                                </div>
                                                            )}
                                                            <div className="absolute left-2 top-2 z-20">{handle}</div>
                                                            <span className="absolute right-2 top-2 z-20 rounded-full bg-black/30 px-1.5 py-0.5 font-bdo text-[10px] font-bold text-white/90 backdrop-blur-sm">
                                                                #{idx + 1}
                                                            </span>
                                                            {item.logo_url && (
                                                                <div className="absolute bottom-2 right-2 z-20 h-8 w-8 overflow-hidden rounded-lg bg-white/90 p-1 shadow backdrop-blur-sm">
                                                                    <img src={item.logo_url} alt="" className="h-full w-full object-contain" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Content */}
                                                        <div className="px-4 pt-3 pb-2">
                                                            <p className="font-clash text-sm font-semibold text-slate-900 line-clamp-1">
                                                                {item.author_name}
                                                            </p>
                                                            <p className="font-bdo text-xs text-slate-400 mt-0.5 truncate">
                                                                {item.author_role}
                                                            </p>
                                                            <p className="font-bdo mt-2 text-xs leading-relaxed text-slate-500 line-clamp-2">
                                                                {item.quote}
                                                            </p>
                                                        </div>

                                                        {/* Badge */}
                                                        <div className="flex items-center gap-1.5 px-4 pb-3">
                                                            {item.is_active ? (
                                                                <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 font-bdo text-[10px] font-medium text-emerald-600">
                                                                    Aktif
                                                                </span>
                                                            ) : (
                                                                <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 font-bdo text-[10px] font-medium text-slate-500">
                                                                    Nonaktif
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Ghost actions */}
                                                        <div className="mt-auto flex items-center border-t border-slate-100 px-2 py-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => openEdit(item)}
                                                                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                                                            >
                                                                <Pencil size={11} /> Edit
                                                            </button>
                                                            <div className="mx-1 h-4 w-px bg-slate-100" />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDelete(item)}
                                                                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-1.5 text-xs font-medium text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                                                            >
                                                                <Trash2 size={11} /> Hapus
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </SortableCard>
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        )}
                    </>
                )}

                {/* ══ TAB 2: Review Pengguna ══ */}
                {activeTab === "reviews" && (
                    <>
                        <div className="relative card-glint shimmer-once overflow-hidden flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] animate-fade-in-up delay-100">
                            <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/70 to-transparent" />
                            <div className="flex items-center gap-4">
                                <ShinyIcon className="h-10 w-10 shrink-0">
                                    <MessageSquare size={18} className="text-orange-100" />
                                </ShinyIcon>
                                <div className="min-w-0">
                                    <p className="font-bdo text-sm font-bold tracking-tight text-slate-700">
                                        Review Pengguna
                                    </p>
                                    <p className="font-clash text-xs font-medium text-slate-400 leading-snug mt-0.5 max-w-sm">
                                        Setujui atau tolak review sebelum ditampilkan ke publik.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5 sm:shrink-0">
                                {pendingCount > 0 && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 ring-1 ring-inset ring-amber-200 font-bdo">
                                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                                        {pendingCount} Pending
                                    </span>
                                )}
                                <span className="font-bdo text-sm text-slate-500">
                                    {reviews.filter((r) => r.is_approved).length} Disetujui
                                </span>
                            </div>
                        </div>

                        {reviews.length === 0 ? (
                            <div className="animate-fade-in-up delay-200 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
                                <MessageSquare size={32} className="text-slate-300" />
                                <p className="font-bdo text-sm text-slate-400">Belum ada review dari pengguna.</p>
                            </div>
                        ) : (
                            <div className="animate-fade-in-up delay-200 flex flex-col gap-3">
                                {reviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className={cn(
                                            "flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-all",
                                            !review.is_approved && "opacity-60 grayscale",
                                        )}
                                    >
                                        {/* Avatar */}
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 font-clash text-sm font-bold text-orange-400">
                                            {review.reviewer_name.charAt(0).toUpperCase()}
                                        </div>

                                        {/* Content */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                                <p className="font-clash text-sm font-semibold text-slate-800">
                                                    {review.reviewer_name}
                                                </p>
                                                <StarRow rating={review.rating} />
                                                <span className="font-bdo text-[11px] text-slate-400">
                                                    {review.created_at}
                                                </span>
                                                {review.is_approved ? (
                                                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-bdo text-[10px] font-medium text-emerald-600 ring-1 ring-emerald-200">
                                                        Disetujui
                                                    </span>
                                                ) : (
                                                    <span className="rounded-full bg-amber-50 px-2 py-0.5 font-bdo text-[10px] font-medium text-amber-600 ring-1 ring-amber-200">
                                                        Pending
                                                    </span>
                                                )}
                                            </div>
                                            <p className="font-bdo mt-1.5 text-sm leading-relaxed text-slate-600">
                                                {review.text}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex shrink-0 items-center gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => handleToggleApprove(review)}
                                                title={review.is_approved ? "Batalkan persetujuan" : "Setujui review"}
                                                className={cn(
                                                    "flex h-8 w-8 items-center justify-center rounded-xl transition-colors",
                                                    review.is_approved
                                                        ? "bg-slate-100 text-slate-400 hover:bg-slate-200"
                                                        : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
                                                )}
                                            >
                                                {review.is_approved ? <X size={14} /> : <Check size={14} />}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteReview(review)}
                                                title="Hapus review"
                                                className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* SlideOver */}
            <SlideOver
                isOpen={slideOver.open}
                onClose={close}
                title={slideOver.item ? "Edit Testimoni" : "Tambah Testimoni"}
                description={
                    slideOver.item
                        ? "Perbarui detail testimoni institusi."
                        : "Tambahkan testimoni baru dari institusi atau tokoh."
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
