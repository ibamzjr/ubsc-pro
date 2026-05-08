import { Head, router, useForm, usePage } from "@inertiajs/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Award, ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import DataTable from "@/Components/Admin/DataTable";
import { SingleDropzone } from "@/Components/Admin/ImageDropzone";
import { ActiveBadge } from "@/Components/Admin/StatusBadge";
import SlideOver from "@/Components/Admin/SlideOver";
import AdminLayout from "@/Layouts/AdminLayout";
import type { PageProps, SponsorItem } from "@/types";

// ── Types ──────────────────────────────────────────────────────────────────────

type Props = PageProps<{ items: SponsorItem[] }>;

const helper = createColumnHelper<SponsorItem>();

// ── Global styles ──────────────────────────────────────────────────────────────

const GLOBAL_STYLES = `
    .font-clash { font-family: 'Clash Display', sans-serif; }
    .font-bdo   { font-family: 'BDO Grotesk', sans-serif; }

    @keyframes fadeInUp {
        from { opacity: 0; transform: translate3d(0, 28px, 0); }
        to   { opacity: 1; transform: translate3d(0, 0, 0); }
    }
    @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.95); }
        to   { opacity: 1; transform: scale(1); }
    }

    .animate-fade-in-up { animation: fadeInUp 0.65s cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; will-change:opacity,transform; }
    .animate-scale-in   { animation: scaleIn  0.5s  cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; }

    .delay-100 { animation-delay: 100ms; }
    .delay-200 { animation-delay: 200ms; }
    .delay-300 { animation-delay: 300ms; }

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

    @keyframes iconGlow {
        0%, 100% { box-shadow: 0 2px 8px rgba(15,23,42,0.2); }
        50%       { box-shadow: 0 2px 16px rgba(15,23,42,0.3), 0 0 24px rgba(251,191,36,0.12); }
    }
    .icon-glow { animation: iconGlow 3.5s ease-in-out infinite; }

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

    .card-glint::before {
        content: '';
        position: absolute;
        top: 0; left: 20px; right: 20px; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent);
        pointer-events: none;
    }

    /* ── Responsive Table ── */
    /* Sembunyikan kolom Website & Urutan di layar kecil */
    @media (max-width: 639px) {
        .sponsor-table th:nth-child(3),
        .sponsor-table td:nth-child(3),
        .sponsor-table th:nth-child(5),
        .sponsor-table td:nth-child(5) {
            display: none;
        }
    }
    /* Sembunyikan kolom Urutan di tablet */
    @media (min-width: 640px) and (max-width: 767px) {
        .sponsor-table th:nth-child(5),
        .sponsor-table td:nth-child(5) {
            display: none;
        }
    }

    /* Wrap tabel agar bisa di-scroll horizontal di layar kecil */
    .sponsor-table-wrapper {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        border-radius: 1rem;
    }
    .sponsor-table-wrapper table {
        min-width: 480px;
    }

    /* Pastikan nama tidak meluap di mobile */
    @media (max-width: 639px) {
        .sponsor-table td:nth-child(2) span {
            max-width: 120px;
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
`;

// ── Input styles ───────────────────────────────────────────────────────────────

const inputBase =
    "w-full rounded-2xl border-0 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-slate-900 transition-colors";
const labelBase =
    "font-clash text-xs font-medium uppercase tracking-wider text-gray-500";

// ── Types ─────────────────────────────────────────────────────────────────────

type FormData = {
    name: string;
    link_url: string;
    is_active: boolean;
    sort_order: number;
    logo: File | null;
    _method?: string;
};

// ── ShinyIcon ─────────────────────────────────────────────────────────────────

function ShinyIcon({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div
            className={[
                "relative flex shrink-0 items-center justify-center rounded-xl",
                "bg-gradient-to-br from-orange-400 to-orange-600",
                "shadow-[0_2px_10px_rgba(15,23,42,0.22),inset_0_1px_0_rgba(255,255,255,0.12)]",
                "icon-glow",
                className,
            ].join(" ")}
        >
            {children}
            <span className="pointer-events-none absolute top-[3px] left-[5px] right-[5px] h-[5px] rounded-full bg-white/20 blur-[1px]" />
        </div>
    );
}

// ── SponsorForm ───────────────────────────────────────────────────────────────

function SponsorForm({
    item,
    onClose,
}: {
    item: SponsorItem | null;
    onClose: () => void;
}) {
    const isEdit = item !== null;

    const { data, setData, post, processing, errors } = useForm<FormData>({
        name: item?.name ?? "",
        link_url: item?.link_url ?? "",
        is_active: item?.is_active ?? true,
        sort_order: item?.sort_order ?? 0,
        logo: null,
        ...(isEdit ? { _method: "PUT" } : {}),
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEdit
            ? route("admin.sponsors.update", item!.id)
            : route("admin.sponsors.store");
        post(url, { forceFormData: true, onSuccess: onClose });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-5">
            <div>
                <label className={labelBase}>Nama Sponsor</label>
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    placeholder="Nama sponsor…"
                    className={`${inputBase} mt-1.5`}
                />
                {errors.name && (
                    <p className="mt-1 text-xs text-rose-500">{errors.name}</p>
                )}
            </div>

            <div>
                <label className={labelBase}>URL Website</label>
                <input
                    type="text"
                    value={data.link_url}
                    onChange={(e) => setData("link_url", e.target.value)}
                    placeholder="https://…"
                    className={`${inputBase} mt-1.5`}
                />
                {errors.link_url && (
                    <p className="mt-1 text-xs text-rose-500">
                        {errors.link_url}
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
                <div className="flex flex-col justify-end pb-1">
                    <label className="flex cursor-pointer items-center gap-3">
                        <input
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(e) =>
                                setData("is_active", e.target.checked)
                            }
                            className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                        />
                        <span className={labelBase}>Aktif</span>
                    </label>
                </div>
            </div>

            <div>
                <label className={`${labelBase} mb-1.5 block`}>Logo</label>
                <SingleDropzone
                    label=""
                    currentUrl={item?.logo_url ?? null}
                    onFileSelect={(f) => setData("logo", f)}
                />
                {errors.logo && (
                    <p className="mt-1 text-xs text-rose-500">{errors.logo}</p>
                )}
            </div>

            <div className="flex items-center gap-3 pt-2">
                <button
                    type="submit"
                    disabled={processing}
                    className="btn-sheen relative flex-1 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 py-3 text-sm font-medium text-white shadow-[0_4px_14px_rgba(15,23,42,0.25),inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-200 hover:shadow-[0_6px_20px_rgba(15,23,42,0.3)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
                >
                    <span className="pointer-events-none absolute top-0 left-0 right-0 h-px rounded-t-2xl bg-white/20" />
                    {processing
                        ? "Menyimpan…"
                        : isEdit
                          ? "Simpan Perubahan"
                          : "Tambah Sponsor"}
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

export default function SponsorsIndex() {
    const { items } = usePage<Props>().props;
    const [slideOver, setSlideOver] = useState<{
        open: boolean;
        item: SponsorItem | null;
    }>({ open: false, item: null });

    const openNew = () => setSlideOver({ open: true, item: null });
    const openEdit = (item: SponsorItem) => setSlideOver({ open: true, item });
    const close = () => setSlideOver({ open: false, item: null });

    const handleDelete = (item: SponsorItem) => {
        if (!confirm(`Hapus "${item.name}"?`)) return;
        router.delete(route("admin.sponsors.destroy", item.id));
    };

    const columns = [
        helper.accessor("logo_url", {
            header: () => (
                <span className="font-clash text-[10px] uppercase tracking-widest text-slate-500">Logo</span>
            ),
            cell: (info) => {
                const url = info.getValue();
                return url ? (
                    <img
                        src={url}
                        alt=""
                        className="h-10 w-16 rounded-xl object-contain"
                    />
                ) : (
                    <div className="flex h-10 w-16 items-center justify-center rounded-xl bg-slate-100 text-[10px] text-slate-400 font-bdo">
                        Tidak ada
                    </div>
                );
            },
        }),
        helper.accessor("name", {
            header: () => (
                <span className="font-clash text-[10px] uppercase tracking-widest text-slate-500">Nama</span>
            ),
            enableSorting: true,
            cell: (info) => (
                <span className="font-clash text-sm font-semibold text-slate-800">
                    {info.getValue()}
                </span>
            ),
        }),
        helper.accessor("link_url", {
            header: () => (
                <span className="font-clash text-[10px] uppercase tracking-widest text-slate-500">Website</span>
            ),
            cell: (info) => {
                const url = info.getValue();
                return url ? (
                    <span className="flex items-center gap-1 max-w-[160px] truncate text-xs text-slate-500 font-bdo">
                        <ExternalLink size={10} className="shrink-0 text-slate-400" />
                        {url}
                    </span>
                ) : (
                    <span className="font-bdo text-slate-400 italic text-xs">—</span>
                );
            },
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
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 hover:-translate-y-px"
                    >
                        <Pencil size={13} />
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDelete(row.original)}
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-400 transition-all duration-200 hover:bg-rose-100 hover:-translate-y-px"
                    >
                        <Trash2 size={13} />
                    </button>
                </div>
            ),
        }),
    ];

    const active = items.filter((i) => i.is_active).length;

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4 animate-fade-in-up">
                    <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
                    <span className="font-bdo text-[11px] font-medium tracking-wide text-orange-500">
                        Manajemen Konten
                    </span>
                    <h1 className="font-clash text-3xl font-bold tracking-tight xl:text-4xl text-slate-900 uppercase">
                        Logo Sponsor
                    </h1>
                </div>
            }
        >
            <Head title="Logo Sponsor" />

            <div className="pt-6 pb-20 mx-auto max-w-6xl">

                {/* ── Info & Action Banner ───────────────────────────────────────── */}
                <div className="relative card-glint shimmer-once overflow-hidden mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] animate-fade-in-up delay-100">
                    <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/70 to-transparent" />

                    <div className="flex items-center gap-4">
                        <ShinyIcon className="h-10 w-10 shrink-0">
                            <Award size={18} className="text-amber-100" />
                        </ShinyIcon>
                        <div className="min-w-0">
                            <p className="font-bdo text-sm font-bold tracking-tight text-slate-700">
                                Manajemen Sponsor
                            </p>
                            <p className="font-clash text-xs font-medium text-slate-400 leading-snug mt-0.5 max-w-sm">
                                Kelola logo sponsor yang tampil pada marquee halaman utama.
                            </p>
                        </div>
                    </div>

                    {/* Stats pill */}
                    <div className="flex items-center gap-2.5 sm:shrink-0">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200 font-bdo">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_5px_rgba(52,211,153,0.7)]" />
                            {active} Aktif
                        </span>
                        <span className="font-bdo text-sm text-slate-500">
                            {items.length} Total
                        </span>
                    </div>
                </div>

                {/* ── Table Card ─────────────────────────────────────────────────── */}
                <div className="animate-fade-in-up delay-200 relative card-glint overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                    <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/70 to-transparent" />

                    {/* Table header toolbar */}
                    <div className="flex flex-col gap-3 px-5 pt-5 pb-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100">
                        <div>
                            <p className="font-clash text-base font-semibold text-slate-800">
                                Daftar Sponsor
                            </p>
                            <p className="font-bdo text-xs text-slate-400 mt-0.5">
                                Kelola dan atur urutan tampil sponsor
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={openNew}
                            className="btn-sheen relative flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-500 px-4 py-2.5 text-sm font-medium text-white shadow-[0_4px_14px_rgba(15,23,42,0.25),inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-200 hover:shadow-[0_6px_20px_rgba(15,23,42,0.3)] hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <span className="pointer-events-none absolute top-0 left-0 right-0 h-px rounded-t-2xl bg-white/20" />
                            <Plus size={15} />
                            Tambah Sponsor
                        </button>
                    </div>

                    {/* Scrollable table wrapper */}
                    <div className="sponsor-table-wrapper px-5 pb-5">
                        <div className="sponsor-table pt-4">
                            <DataTable
                                columns={columns as ColumnDef<SponsorItem, unknown>[]}
                                data={items}
                                searchColumn="name"
                                searchPlaceholder="Cari sponsor…"
                                emptyMessage="Belum ada sponsor."
                                toolbar={null}
                            />
                        </div>
                    </div>
                </div>

                {/* ── Legend Footer ─────────────────────────────────────────────── */}
                <div className="mt-5 animate-fade-in-up delay-300 flex flex-wrap items-center gap-5 px-2">
                    <div className="flex items-center gap-2">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        </span>
                        <span className="font-bdo text-[11px] text-slate-500 font-medium">Aktif — Ditampilkan di marquee</span>
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
                title={slideOver.item ? "Edit Sponsor" : "Tambah Sponsor"}
                description={
                    slideOver.item
                        ? "Perbarui detail dan logo sponsor."
                        : "Tambahkan sponsor baru ke marquee."
                }
            >
                {slideOver.open && (
                    <SponsorForm
                        key={slideOver.item?.id ?? "new"}
                        item={slideOver.item}
                        onClose={close}
                    />
                )}
            </SlideOver>
        </AdminLayout>
    );
}