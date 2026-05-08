import { Head, router, useForm, usePage } from "@inertiajs/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { ImageIcon, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import DataTable from "@/Components/Admin/DataTable";
import { SingleDropzone } from "@/Components/Admin/ImageDropzone";
import { ActiveBadge } from "@/Components/Admin/StatusBadge";
import SlideOver from "@/Components/Admin/SlideOver";
import AdminLayout from "@/Layouts/AdminLayout";
import { cn } from "@/lib/utils";
import type { PageProps, PromoItem } from "@/types";

type Props = PageProps<{ items: PromoItem[] }>;

const helper = createColumnHelper<PromoItem>();

// ── Global Styles ─────────────────────────────────────────────────────────────

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
        from { opacity: 0; transform: scale(0.95); }
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
        position: absolute;
        inset: 0;
        background: linear-gradient(
            105deg,
            transparent 0%,
            rgba(255,255,255,0.45) 50%,
            transparent 100%
        );
        width: 60%;
        animation: shimmerSweep 1.1s ease-out 0.5s forwards;
        pointer-events: none;
        border-radius: inherit;
    }

    /* ── Icon glow pulse ── */
    @keyframes iconGlow {
        0%, 100% { box-shadow: 0 2px 8px rgba(15,23,42,0.2); }
        50%       { box-shadow: 0 2px 16px rgba(15,23,42,0.3), 0 0 24px rgba(99,102,241,0.12); }
    }
    .icon-glow { animation: iconGlow 3.5s ease-in-out infinite; }

    /* ── Save button sheen ── */
    @keyframes btnSheen {
        0%   { left: -80%; }
        100% { left: 120%; }
    }
    .btn-sheen {
        position: relative;
        overflow: hidden;
    }
    .btn-sheen::before {
        content: '';
        position: absolute;
        top: 0; bottom: 0; width: 50%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        animation: btnSheen 3s ease-in-out 1s infinite;
    }

    /* ── Top glint line on cards ── */
    .card-glint::before {
        content: '';
        position: absolute;
        top: 0; left: 20px; right: 20px; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent);
        pointer-events: none;
    }

    .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 6px; }
`;

// ── Shiny Icon ────────────────────────────────────────────────────────────────

function ShinyIcon({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn(
            "icon-glow relative flex shrink-0 items-center justify-center rounded-xl",
            "bg-gradient-to-br from-amber-500 to-amber-600",
            "shadow-[0_2px_10px_rgba(15,23,42,0.22),inset_0_1px_0_rgba(255,255,255,0.12)]",
            className,
        )}>
            <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent" />
            {/* Top glint */}
            <span className="pointer-events-none absolute top-[3px] left-[5px] right-[5px] h-[5px] rounded-full bg-white/20 blur-[1px]" />
            {children}
        </div>
    );
}

// ── Form Styles ───────────────────────────────────────────────────────────────

const inputBase =
    "w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-bdo text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-300 focus:ring-4 focus:ring-amber-500/10 transition-all";
const labelBase =
    "font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block";

// ── Types ─────────────────────────────────────────────────────────────────────

type FormData = {
    title: string;
    link_url: string;
    is_active: boolean;
    sort_order: number;
    slide: File | null;
    _method?: string;
};

// ── Promo Form ────────────────────────────────────────────────────────────────

function PromoForm({
    item,
    onClose,
}: {
    item: PromoItem | null;
    onClose: () => void;
}) {
    const isEdit = item !== null;

    const { data, setData, post, processing, errors } = useForm<FormData>({
        title: item?.title ?? "",
        link_url: item?.link_url ?? "",
        is_active: item?.is_active ?? true,
        sort_order: item?.sort_order ?? 0,
        slide: null,
        ...(isEdit ? { _method: "PUT" } : {}),
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEdit
            ? route("admin.promo.update", item!.id)
            : route("admin.promo.store");
        post(url, { forceFormData: true, onSuccess: onClose });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-5">
            {/* Judul */}
            <div>
                <label className={labelBase}>Judul</label>
                <input
                    type="text"
                    value={data.title}
                    onChange={(e) => setData("title", e.target.value)}
                    placeholder="Judul slide (opsional)…"
                    className={`${inputBase} mt-1.5`}
                />
                {errors.title && (
                    <p className="mt-1 text-xs text-rose-500 font-bdo">{errors.title}</p>
                )}
            </div>

            {/* Tautan URL */}
            <div>
                <label className={labelBase}>Tautan URL</label>
                <input
                    type="text"
                    value={data.link_url}
                    onChange={(e) => setData("link_url", e.target.value)}
                    placeholder="https://…"
                    className={`${inputBase} mt-1.5`}
                />
                {errors.link_url && (
                    <p className="mt-1 text-xs text-rose-500 font-bdo">
                        {errors.link_url}
                    </p>
                )}
            </div>

            {/* Urutan + Aktif */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelBase}>Urutan</label>
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
                <div className="flex flex-col justify-end pb-1">
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 transition-colors hover:bg-slate-50">
                        <input
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(e) =>
                                setData("is_active", e.target.checked)
                            }
                            className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                        />
                        <span className={labelBase} style={{ marginBottom: 0 }}>Aktif</span>
                    </label>
                </div>
            </div>

            {/* Gambar Slide */}
            <div>
                <label className={`${labelBase} mb-1.5 block`}>
                    Gambar Slide
                </label>
                <SingleDropzone
                    label=""
                    currentUrl={item?.slide_url ?? null}
                    onFileSelect={(f) => setData("slide", f)}
                />
                {errors.slide && (
                    <p className="mt-1 text-xs text-rose-500 font-bdo">{errors.slide}</p>
                )}
            </div>

            {/* Tombol Aksi */}
            <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto rounded-xl px-5 py-3 text-sm font-bdo font-medium text-slate-600 transition-colors hover:bg-slate-100 border border-slate-200"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="btn-sheen relative w-full sm:flex-1 rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 py-3 text-sm font-clash font-semibold text-white transition-all shadow-[0_4px_14px_rgba(15,23,42,0.22),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_6px_20px_rgba(15,23,42,0.28)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
                >
                    <span className="pointer-events-none absolute top-0 left-0 right-0 h-px rounded-t-xl bg-white/20" />
                    {processing ? "Menyimpan…" : isEdit ? "Simpan Perubahan" : "Tambah Slide"}
                </button>
            </div>
        </form>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function PromoIndex() {
    const { items } = usePage<Props>().props;
    const [slideOver, setSlideOver] = useState<{
        open: boolean;
        item: PromoItem | null;
    }>({ open: false, item: null });

    const openNew = () => setSlideOver({ open: true, item: null });
    const openEdit = (item: PromoItem) => setSlideOver({ open: true, item });
    const close = () => setSlideOver({ open: false, item: null });

    const handleDelete = (item: PromoItem) => {
        if (!confirm("Hapus slide ini?")) return;
        router.delete(route("admin.promo.destroy", item.id));
    };

    const columns = [
        helper.accessor("slide_url", {
            header: "Slide",
            cell: (info) => {
                const url = info.getValue();
                return url ? (
                    <img
                        src={url}
                        alt=""
                        className="h-10 w-16 rounded-xl object-cover ring-1 ring-slate-200/60"
                    />
                ) : (
                    <div className="flex h-10 w-16 items-center justify-center rounded-xl bg-slate-100 text-slate-300">
                        <ImageIcon size={14} />
                    </div>
                );
            },
        }),
        helper.accessor("title", {
            header: "Judul",
            enableSorting: true,
            cell: (info) => (
                <span className="font-bdo text-sm text-slate-700">
                    {info.getValue() ?? (
                        <span className="text-slate-400 italic">—</span>
                    )}
                </span>
            ),
        }),
        helper.accessor("link_url", {
            header: "Tautan",
            cell: (info) => {
                const url = info.getValue();
                return url ? (
                    <span className="font-bdo max-w-[160px] truncate text-xs text-slate-500 block">
                        {url}
                    </span>
                ) : (
                    <span className="font-bdo text-slate-400 italic text-xs">—</span>
                );
            },
        }),
        helper.accessor("is_active", {
            header: "Status",
            cell: (info) => <ActiveBadge active={info.getValue()} />,
        }),
        helper.accessor("sort_order", {
            header: "Urutan",
            enableSorting: true,
            cell: (info) => (
                <span className="font-bdo text-xs font-semibold tabular-nums text-slate-500">{info.getValue()}</span>
            ),
        }),
        helper.display({
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={() => openEdit(row.original)}
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 hover:scale-105 active:scale-95 border border-slate-200/60"
                    >
                        <Pencil size={13} />
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDelete(row.original)}
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-400 transition-all hover:bg-rose-100 hover:scale-105 active:scale-95 border border-rose-100"
                    >
                        <Trash2 size={13} />
                    </button>
                </div>
            ),
        }),
    ];

    const active = items.filter((i) => i.is_active).length;
    const inactive = items.length - active;

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4 animate-fade-in-up">
                    <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
                    <span className="font-bdo text-[11px] font-medium tracking-wide text-orange-500">
                        Manajemen Konten
                    </span>
                    <h1 className="font-clash text-3xl font-bold uppercase tracking-tight xl:text-4xl text-slate-900">
                        Carousel Promo
                    </h1>
                </div>
            }
        >
            <Head title="Carousel Promo" />

            <div className="flex flex-col gap-5 pt-6 pb-20 overflow-x-hidden mx-auto max-w-6xl">

                {/* ── Info & Action Card (seperti Schedule) ── */}
                <div className="relative card-glint shimmer-once animate-fade-in-up delay-100 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white px-4 sm:px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
                    <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/70 to-transparent" />

                    {/* Kiri: ikon + teks */}
                    <div className="flex items-center gap-4 min-w-0">
                        <ShinyIcon className="h-10 w-10 shrink-0">
                            <ImageIcon size={16} className="text-amber-50" />
                        </ShinyIcon>
                        <div className="min-w-0">
                            <p className="font-bdo text-sm font-bold tracking-tight text-slate-700">
                                Manajemen Slide Promo
                            </p>
                            <p className="font-clash text-xs font-medium text-slate-400 leading-snug mt-0.5 max-w-sm truncate">
                                Kelola slide yang tampil pada carousel promosi halaman utama.
                            </p>
                        </div>
                    </div>

                    {/* Kanan: stat pills + tombol tambah */}
                    <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                        {/* Pill total */}
                        <div className="flex items-center gap-2 rounded-xl bg-sky-50 px-3.5 py-1.5 border border-sky-200 shadow-sm">
                            <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
                            <span className="font-bdo text-[11px] font-bold text-sky-600 uppercase tracking-wider">
                                {items.length} Total
                            </span>
                        </div>

                        {/* Pill aktif */}
                        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-1.5 border border-emerald-100 shadow-sm">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.7)] animate-pulse" />
                            <span className="font-bdo text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                                {active} Aktif
                            </span>
                        </div>

                        {/* Pill tidak aktif — hanya tampil jika ada */}
                        {inactive > 0 && (
                            <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-3.5 py-1.5 border border-rose-100 shadow-sm">
                                <span className="h-2 w-2 rounded-full bg-rose-400" />
                                <span className="font-bdo text-[11px] font-bold text-rose-600 uppercase tracking-wider">
                                    {inactive} Nonaktif
                                </span>
                            </div>
                        )}

                        {/* Tombol tambah slide */}
                        <button
                            type="button"
                            onClick={openNew}
                            className="btn-sheen relative flex w-full xs:w-auto sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-500 px-5 py-2.5 text-sm font-clash font-semibold text-white transition-all shadow-[0_4px_14px_rgba(15,23,42,0.25),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-8px_15px_-5px_rgba(99,102,241,0.4)] hover:bg-slate-900 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(15,23,42,0.3)] active:translate-y-0 active:scale-95"
                        >
                            <span className="pointer-events-none absolute top-0 left-0 right-0 h-px rounded-t-xl bg-white/20" />
                            <Plus size={15} className="text-white shrink-0" />
                            <span>Tambah Slide</span>
                        </button>
                    </div>
                </div>

                {/* ── Tabel Data ── */}
                <div className="animate-fade-in-up delay-200 rounded-[24px] border border-slate-200/80 bg-white p-2 shadow-[0_1px_4px_rgba(0,0,0,0.05)] overflow-hidden">
                    <DataTable
                        columns={columns as ColumnDef<PromoItem, unknown>[]}
                        data={items}
                        searchColumn="title"
                        searchPlaceholder="Cari slide…"
                        emptyMessage="Belum ada slide."
                    />
                </div>

                {/* ── Legend Footer ── */}
                <div className="animate-fade-in-up delay-300 flex flex-wrap items-center gap-5 px-2">
                    <div className="flex items-center gap-2">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        </span>
                        <span className="font-bdo text-[11px] text-slate-500 font-medium">Aktif — Slide ditampilkan</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-50 ring-1 ring-rose-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                        </span>
                        <span className="font-bdo text-[11px] text-slate-500 font-medium">Nonaktif — Slide disembunyikan</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-50 ring-1 ring-slate-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                        </span>
                        <span className="font-bdo text-[11px] text-slate-500 font-medium">Urutan — Tentukan posisi tampil slide</span>
                    </div>
                </div>
            </div>

            {/* ── SlideOver ── */}
            <SlideOver
                isOpen={slideOver.open}
                onClose={close}
                title={
                    <span className="font-clash text-xl">
                        {slideOver.item ? "Edit Slide" : "Slide Baru"}
                    </span>
                }
                description={
                    <span className="font-bdo text-sm text-slate-500">
                        {slideOver.item
                            ? "Perbarui detail dan gambar slide."
                            : "Tambahkan slide carousel baru."}
                    </span>
                }
            >
                {slideOver.open && (
                    <PromoForm
                        key={slideOver.item?.id ?? "new"}
                        item={slideOver.item}
                        onClose={close}
                    />
                )}
            </SlideOver>
        </AdminLayout>
    );
}