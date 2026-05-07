import { Head, router, useForm, usePage } from "@inertiajs/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Film, Pencil, Play, Plus, Star, Trash2, Tv2 } from "lucide-react";
import { useState } from "react";
import DataTable from "@/Components/Admin/DataTable";
import { SingleDropzone } from "@/Components/Admin/ImageDropzone";
import { ActiveBadge } from "@/Components/Admin/StatusBadge";
import SlideOver from "@/Components/Admin/SlideOver";
import AdminLayout from "@/Layouts/AdminLayout";
import type { AdminReelItem, PageProps } from "@/types";

// ── Types ──────────────────────────────────────────────────────────────────────

type Props = PageProps<{ items: AdminReelItem[] }>;

const helper = createColumnHelper<AdminReelItem>();

// ── Global Styles ──────────────────────────────────────────────────────────────

const GLOBAL_STYLES = `
    .font-clash { font-family: 'Clash Display', sans-serif; }
    .font-bdo   { font-family: 'BDO Grotesk', sans-serif; }

    /* ── Entrance ── */
    @keyframes fadeInUp {
        from { opacity: 0; transform: translate3d(0, 32px, 0); }
        to   { opacity: 1; transform: translate3d(0, 0, 0); }
    }
    @keyframes fadeInDown {
        from { opacity: 0; transform: translate3d(0, -20px, 0); }
        to   { opacity: 1; transform: translate3d(0, 0, 0); }
    }
    @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.93); }
        to   { opacity: 1; transform: scale(1); }
    }

    .animate-fade-in-up   { animation: fadeInUp   0.65s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; will-change: opacity, transform; }
    .animate-fade-in-down { animation: fadeInDown 0.55s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }
    .animate-scale-in     { animation: scaleIn    0.5s  cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }

    .delay-50  { animation-delay:  50ms; }
    .delay-100 { animation-delay: 100ms; }
    .delay-150 { animation-delay: 150ms; }
    .delay-200 { animation-delay: 200ms; }
    .delay-300 { animation-delay: 300ms; }
    .delay-400 { animation-delay: 400ms; }

    /* ── Shimmer sweep (one-shot) ── */
    @keyframes shimmerSweep {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(250%); }
    }
    .shimmer-once { position: relative; overflow: hidden; }
    .shimmer-once::after {
        content: '';
        position: absolute; inset: 0;
        background: linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%);
        width: 55%;
        animation: shimmerSweep 1.2s ease-out 0.6s forwards;
        pointer-events: none; border-radius: inherit;
    }

    /* ── Shimmer loop (persistent) ── */
    @keyframes shimmerLoop {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(350%); }
    }
    .shimmer-loop { position: relative; overflow: hidden; }
    .shimmer-loop::after {
        content: '';
        position: absolute; inset: 0;
        background: linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%);
        width: 40%;
        animation: shimmerLoop 3.5s ease-in-out 1.5s infinite;
        pointer-events: none; border-radius: inherit;
    }

    /* ── Icon glow pulse ── */
    @keyframes iconGlow {
        0%, 100% { box-shadow: 0 2px 8px rgba(15,23,42,0.2); }
        50%       { box-shadow: 0 2px 20px rgba(15,23,42,0.32), 0 0 28px rgba(251,191,36,0.14); }
    }
    .icon-glow { animation: iconGlow 3.5s ease-in-out infinite; }

    /* ── Button sheen ── */
    @keyframes btnSheen {
        0%   { left: -80%; }
        100% { left: 130%; }
    }
    .btn-sheen { position: relative; overflow: hidden; }
    .btn-sheen::before {
        content: '';
        position: absolute; top: 0; bottom: 0; width: 50%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
        animation: btnSheen 3.5s ease-in-out 1.2s infinite;
    }

    /* ── Stat number flash ── */
    @keyframes numFlash {
        0%   { opacity: 0; transform: scale(0.7) translateY(6px); }
        60%  { opacity: 1; transform: scale(1.08) translateY(-1px); }
        100% { opacity: 1; transform: scale(1) translateY(0); }
    }
    .num-flash { animation: numFlash 0.55s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }

    /* ── Card glint top line ── */
    .card-glint { position: relative; }
    .card-glint::before {
        content: '';
        position: absolute; top: 0; left: 20px; right: 20px; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent);
        pointer-events: none;
    }

    /* ── Floating orb ── */
    @keyframes orbFloat {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33%       { transform: translate(12px, -18px) scale(1.06); }
        66%       { transform: translate(-8px, 10px) scale(0.96); }
    }
    .orb-float { animation: orbFloat 9s ease-in-out infinite; }

    /* ── Play icon pulse ── */
    @keyframes playPulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
        50%       { box-shadow: 0 0 0 8px rgba(99,102,241,0.12); }
    }
    .play-pulse { animation: playPulse 2.8s ease-in-out infinite; }

    /* ── Animated gradient border ── */
    @keyframes borderShift {
        0%   { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
    }
    .border-animate {
        background: linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4, #6366f1);
        background-size: 200% auto;
        animation: borderShift 4s linear infinite;
    }

    /* ── Responsive table ── */
    @media (max-width: 639px) {
        .reel-table th:nth-child(3),
        .reel-table td:nth-child(3),
        .reel-table th:nth-child(4),
        .reel-table td:nth-child(4),
        .reel-table th:nth-child(6),
        .reel-table td:nth-child(6) { display: none; }
    }
    @media (min-width: 640px) and (max-width: 1023px) {
        .reel-table th:nth-child(3),
        .reel-table td:nth-child(3),
        .reel-table th:nth-child(6),
        .reel-table td:nth-child(6) { display: none; }
    }
    .reel-table-wrapper {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        border-radius: 1rem;
    }
    .reel-table-wrapper table { min-width: 520px; }

    @media (max-width: 639px) {
        .reel-table td:nth-child(2) p:first-child {
            max-width: 110px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
    }

    .reel-table tbody tr {
        transition: background-color 0.18s ease;
    }
    .reel-table tbody tr:hover {
        background-color: rgba(99,102,241,0.03);
    }
`;

// ── Input / Label styles ───────────────────────────────────────────────────────

const inputBase =
    "w-full rounded-2xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-amber-300 transition-colors";
const labelBase =
    "font-clash text-xs font-medium uppercase tracking-wider text-slate-500";

// ── Form data type ─────────────────────────────────────────────────────────────

type FormData = {
    title: string;
    subtitle: string;
    video_url: string;
    is_featured: boolean;
    is_active: boolean;
    sort_order: number;
    thumbnail: File | null;
    _method?: string;
};

// ── ShinyIcon ─────────────────────────────────────────────────────────────────

function ShinyIcon({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={[
            "relative flex shrink-0 items-center justify-center rounded-xl",
            "bg-gradient-to-br from-amber-500 to-amber-600",
            "shadow-[0_2px_10px_rgba(15,23,42,0.25),inset_0_1px_0_rgba(255,255,255,0.14)]",
            "icon-glow",
            className,
        ].join(" ")}>
            {children}
            <span className="pointer-events-none absolute top-[3px] left-[5px] right-[5px] h-[5px] rounded-full bg-white/20 blur-[1px]" />
        </div>
    );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({
    label,
    value,
    accent,
    delay,
    icon,
}: {
    label: string;
    value: number;
    accent: "emerald" | "amber" | "slate";
    delay: string;
    icon: React.ReactNode;
}) {
    const accentMap = {
        emerald: {
            bg: "from-emerald-50 to-emerald-50/40",
            ring: "ring-emerald-200/70",
            num: "text-emerald-700",
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600",
        },
        amber: {
            bg: "from-amber-50 to-amber-50/40",
            ring: "ring-amber-200/70",
            num: "text-amber-700",
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
        },
        slate: {
            bg: "from-slate-50 to-slate-50/40",
            ring: "ring-slate-200/60",
            num: "text-slate-700",
            iconBg: "bg-slate-100",
            iconColor: "text-slate-500",
        },
    }[accent];

    return (
        <div
            className={[
                `shimmer-loop animate-scale-in ${delay}`,
                "relative overflow-hidden rounded-2xl bg-gradient-to-br px-4 py-3.5 sm:px-5 sm:py-4",
                "ring-1 shadow-[0_1px_3px_rgba(0,0,0,0.06)]",
                accentMap.bg, accentMap.ring,
            ].join(" ")}
        >
            <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                    <p className={`font-clash text-xl sm:text-2xl font-bold num-flash ${delay} ${accentMap.num}`}>
                        {value}
                    </p>
                    <p className="font-bdo text-[10px] sm:text-xs font-medium text-slate-500 mt-0.5 truncate">{label}</p>
                </div>
                <div className={`hidden sm:flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${accentMap.iconBg} ${accentMap.iconColor}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

// ── ReelForm ──────────────────────────────────────────────────────────────────

function ReelForm({
    item,
    onClose,
}: {
    item: AdminReelItem | null;
    onClose: () => void;
}) {
    const isEdit = item !== null;

    const { data, setData, post, processing, errors } = useForm<FormData>({
        title: item?.title ?? "",
        subtitle: item?.subtitle ?? "",
        video_url: item?.video_url ?? "",
        is_featured: item?.is_featured ?? false,
        is_active: item?.is_active ?? true,
        sort_order: item?.sort_order ?? 0,
        thumbnail: null,
        ...(isEdit ? { _method: "PUT" } : {}),
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEdit
            ? route("admin.reels.update", item!.id)
            : route("admin.reels.store");
        post(url, { forceFormData: true, onSuccess: onClose });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-5">
            <div>
                <label className={labelBase}>Judul</label>
                <input
                    type="text"
                    value={data.title}
                    onChange={(e) => setData("title", e.target.value)}
                    placeholder="Judul reel…"
                    className={`${inputBase} mt-1.5`}
                />
                {errors.title && (
                    <p className="mt-1 text-xs text-rose-500">{errors.title}</p>
                )}
            </div>

            <div>
                <label className={labelBase}>Subjudul</label>
                <input
                    type="text"
                    value={data.subtitle}
                    onChange={(e) => setData("subtitle", e.target.value)}
                    placeholder="Tanggal atau keterangan (opsional)…"
                    className={`${inputBase} mt-1.5`}
                />
            </div>

            <div>
                <label className={labelBase}>URL Video</label>
                <input
                    type="text"
                    value={data.video_url}
                    onChange={(e) => setData("video_url", e.target.value)}
                    placeholder="/reels/namafile.mp4 atau URL YouTube…"
                    className={`${inputBase} mt-1.5`}
                />
                {errors.video_url && (
                    <p className="mt-1 text-xs text-rose-500">
                        {errors.video_url}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelBase}>Urutan Tampil</label>
                    <input
                        type="number"
                        min={0}
                        value={data.sort_order}
                        onChange={(e) =>
                            setData("sort_order", Number(e.target.value))
                        }
                        className={`${inputBase} mt-1.5`}
                    />
                </div>
                <div className="flex flex-col justify-end gap-2 pb-1">
                    <label className="flex cursor-pointer items-center gap-3">
                        <input
                            type="checkbox"
                            checked={data.is_featured}
                            onChange={(e) =>
                                setData("is_featured", e.target.checked)
                            }
                            className="h-4 w-4 rounded border-slate-300 text-amber-300 focus:ring-amber-300"
                        />
                        <span className={labelBase}>Unggulan</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-3">
                        <input
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(e) =>
                                setData("is_active", e.target.checked)
                            }
                            className="h-4 w-4 rounded border-slate-300 text-zinc-700 focus:ring-zinc-400"
                        />
                        <span className={labelBase}>Aktif</span>
                    </label>
                </div>
            </div>

            <div>
                <label className={`${labelBase} mb-1.5 block`}>Thumbnail</label>
                <SingleDropzone
                    label=""
                    currentUrl={item?.thumbnail_url ?? null}
                    onFileSelect={(f) => setData("thumbnail", f)}
                />
                {errors.thumbnail && (
                    <p className="mt-1 text-xs text-rose-500">
                        {errors.thumbnail}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-3 pt-2">
                <button
                    type="submit"
                    disabled={processing}
                    className="btn-sheen relative flex-1 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 py-3 text-sm font-medium text-white shadow-[0_4px_14px_rgba(99,102,241,0.35),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all duration-200 hover:shadow-[0_6px_20px_rgba(99,102,241,0.45)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
                >
                    <span className="pointer-events-none absolute top-0 left-0 right-0 h-px rounded-t-2xl bg-white/25" />
                    {processing
                        ? "Menyimpan…"
                        : isEdit
                          ? "Simpan Perubahan"
                          : "Tambah Reel"}
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-2xl px-5 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
                >
                    Batal
                </button>
            </div>
        </form>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ReelsIndex() {
    const { items } = usePage<Props>().props;
    const [slideOver, setSlideOver] = useState<{
        open: boolean;
        item: AdminReelItem | null;
    }>({ open: false, item: null });

    const openNew = () => setSlideOver({ open: true, item: null });
    const openEdit = (item: AdminReelItem) =>
        setSlideOver({ open: true, item });
    const close = () => setSlideOver({ open: false, item: null });

    const handleDelete = (item: AdminReelItem) => {
        if (!confirm(`Hapus "${item.title}"?`)) return;
        router.delete(route("admin.reels.destroy", item.id));
    };

    const columns = [
        helper.accessor("thumbnail_url", {
            header: () => (
                <span className="font-clash text-[10px] uppercase tracking-widest text-slate-500">Thumbnail</span>
            ),
            cell: (info) => {
                const url = info.getValue();
                return url ? (
                    <div className="relative group/thumb">
                        <img
                            src={url}
                            alt=""
                            className="h-10 w-16 rounded-xl object-cover transition-transform duration-200 group-hover/thumb:scale-105"
                        />
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-black/0 transition-colors duration-200 group-hover/thumb:bg-black/20">
                            <Play size={12} className="text-white opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-200" />
                        </div>
                    </div>
                ) : (
                    <div className="flex h-10 w-16 items-center justify-center rounded-xl bg-slate-100 text-[9px] font-bdo text-slate-400">
                        Kosong
                    </div>
                );
            },
        }),
        helper.accessor("title", {
            header: () => (
                <span className="font-clash text-[10px] uppercase tracking-widest text-slate-500">Judul</span>
            ),
            enableSorting: true,
            cell: (info) => {
                const r = info.row.original;
                return (
                    <div>
                        <p className="font-clash text-sm font-semibold text-slate-800 line-clamp-1">
                            {r.title}
                        </p>
                        {r.subtitle && (
                            <p className="font-bdo text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                                {r.subtitle}
                            </p>
                        )}
                    </div>
                );
            },
        }),
        helper.accessor("video_url", {
            header: () => (
                <span className="font-clash text-[10px] uppercase tracking-widest text-slate-500">URL Video</span>
            ),
            cell: (info) => (
                <span className="font-bdo max-w-[140px] truncate text-xs text-slate-500 block">
                    {info.getValue()}
                </span>
            ),
        }),
        helper.accessor("is_featured", {
            header: () => (
                <span className="font-clash text-[10px] uppercase tracking-widest text-slate-500">Unggulan</span>
            ),
            cell: (info) =>
                info.getValue() ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 font-bdo text-[10px] font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">
                        <Star size={9} className="fill-amber-500 text-amber-500" />
                        Unggulan
                    </span>
                ) : null,
        }),
        helper.accessor("is_active", {
            header: () => (
                <span className="font-clash text-[10px] uppercase tracking-widest text-slate-500">Status</span>
            ),
            cell: (info) => <ActiveBadge active={info.getValue()} />,
        }),
        helper.accessor("sort_order", {
            header: () => (
                <span className="font-clash text-[10px] uppercase tracking-widest text-slate-500">Urutan</span>
            ),
            enableSorting: true,
            cell: (info) => (
                <span className="font-bdo text-xs text-slate-500 tabular-nums">{info.getValue()}</span>
            ),
        }),
        helper.display({
            id: "actions",
            header: () => (
                <span className="font-clash text-[10px] uppercase tracking-widest text-slate-500">Aksi</span>
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={() => openEdit(row.original)}
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-all duration-200 hover:bg-amber-50 hover:text-amber-600 hover:-translate-y-px"
                    >
                        <Pencil size={13} />
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDelete(row.original)}
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-400 transition-all duration-200 hover:bg-rose-100 hover:text-rose-600 hover:-translate-y-px"
                    >
                        <Trash2 size={13} />
                    </button>
                </div>
            ),
        }),
    ];

    const active = items.filter((i) => i.is_active).length;
    const featured = items.filter((i) => i.is_featured).length;

    return (
        <AdminLayout
            header={
                <div className="relative flex flex-col gap-1 pt-4 overflow-hidden">
                    <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />

                    {/* Decorative floating orbs */}
                    <div className="pointer-events-none absolute -top-4 -right-8 h-32 w-32 rounded-full bg-indigo-100/40 blur-3xl orb-float" />
                    <div className="pointer-events-none absolute -top-2 right-24 h-20 w-20 rounded-full bg-violet-100/30 blur-2xl orb-float" style={{ animationDelay: "2.5s" }} />

                    <span className="animate-fade-in-down font-bdo text-[11px] font-medium tracking-wide text-slate-400">
                        Manajemen Konten
                    </span>
                    <div className="flex items-end gap-3">
                        <h1 className="animate-fade-in-up delay-50 font-clash text-3xl font-bold tracking-tight xl:text-4xl text-slate-900 uppercase">
                            Video Reels
                        </h1>
                        <div className="animate-fade-in-up delay-150 mb-1.5 h-1.5 w-16 rounded-full border-animate opacity-80" />
                    </div>
                </div>
            }
        >
            <Head title="Video Reels" />

            <div className="pt-6s pb-20 mx-auto max-w-6xl">

                {/* ── Info Banner ─────────────────────────────────────────────── */}
                <div className="shimmer-once card-glint animate-fade-in-up delay-100 relative mb-5 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                    <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/70 to-transparent" />
                    <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-50/60 blur-3xl orb-float" />

                    <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <ShinyIcon className="h-10 w-10 shrink-0">
                                <Tv2 size={18} className="text-amber-50" />
                            </ShinyIcon>
                            <div className="min-w-0">
                                <p className="font-bdo text-sm font-bold tracking-tight text-slate-700">
                                    Manajemen Video Reels
                                </p>
                                <p className="font-clash text-xs font-medium text-slate-400 leading-snug mt-0.5 max-w-sm">
                                    Atur video, thumbnail, dan urutan tampil konten reel.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={openNew}
                            className="btn-sheen relative flex w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 px-5 py-2.5 font-clash text-sm font-semibold text-white shadow-[0_4px_14px_rgba(99,102,241,0.35),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all duration-200 hover:shadow-[0_6px_20px_rgba(99,102,241,0.45)] hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <span className="pointer-events-none absolute top-0 left-0 right-0 h-px rounded-t-2xl bg-white/25" />
                            <Plus size={15} />
                            Tambah Reel
                        </button>
                    </div>
                </div>

                {/* ── Stat Cards ──────────────────────────────────────────────── */}
                <div className="mb-5 grid grid-cols-3 gap-3">
                    <StatCard label="Aktif" value={active} accent="emerald" delay="delay-150" icon={<Film size={16} />} />
                    <StatCard label="Unggulan" value={featured} accent="amber" delay="delay-200" icon={<Star size={16} />} />
                    <StatCard label="Total" value={items.length} accent="slate" delay="delay-300" icon={<Tv2 size={16} />} />
                </div>

                {/* ── Table Card ──────────────────────────────────────────────── */}
                <div className="animate-fade-in-up delay-300 card-glint relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                    <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/70 to-transparent" />
                    <div className="pointer-events-none absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-amber-50/40 blur-3xl" />

                    <div className="flex flex-col gap-3 border-b border-slate-100 px-5 pt-5 pb-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="font-clash text-base font-semibold text-slate-800">Daftar Reel</p>
                            <p className="font-bdo text-xs text-slate-400 mt-0.5">Kelola dan atur urutan konten video</p>
                        </div>
                        <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-400 play-pulse">
                            <Play size={15} className="fill--400" />
                        </div>
                    </div>

                    <div className="reel-table-wrapper px-5 pb-5">
                        <div className="reel-table pt-4">
                            <DataTable
                                columns={columns as ColumnDef<AdminReelItem, unknown>[]}
                                data={items}
                                searchColumn="title"
                                searchPlaceholder="Cari reel…"
                                emptyMessage="Belum ada reel."
                                toolbar={null}
                            />
                        </div>
                    </div>
                </div>

                {/* ── Legend ──────────────────────────────────────────────────── */}
                <div className="animate-fade-in-up delay-400 mt-5 flex flex-wrap items-center gap-5 px-2">
                    <div className="flex items-center gap-2">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        </span>
                        <span className="font-bdo text-[11px] text-slate-500 font-medium">Aktif — Ditampilkan kepada pengguna</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-50 ring-1 ring-amber-200">
                            <Star size={8} className="fill-amber-400 text-amber-400" />
                        </span>
                        <span className="font-bdo text-[11px] text-slate-500 font-medium">Unggulan — Diprioritaskan di tampilan utama</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-50 ring-1 ring-slate-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                        </span>
                        <span className="font-bdo text-[11px] text-slate-500 font-medium">Nonaktif — Disembunyikan dari tampilan</span>
                    </div>
                </div>
            </div>

            <SlideOver
                isOpen={slideOver.open}
                onClose={close}
                title={slideOver.item ? "Edit Reel" : "Tambah Reel"}
                description={
                    slideOver.item
                        ? "Perbarui detail video reel."
                        : "Tambahkan video reel baru."
                }
            >
                {slideOver.open && (
                    <ReelForm
                        key={slideOver.item?.id ?? "new"}
                        item={slideOver.item}
                        onClose={close}
                    />
                )}
            </SlideOver>
        </AdminLayout>
    );
}