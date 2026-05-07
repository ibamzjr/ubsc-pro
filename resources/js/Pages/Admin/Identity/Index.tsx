import { Head, router, usePage } from "@inertiajs/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    Eye,
    FileQuestion,
    ShieldCheck,
    Users,
    X,
    XCircle,
} from "lucide-react";
import { useState } from "react";
import DataTable from "@/Components/Admin/DataTable";
import { IdentityStatusBadge } from "@/Components/Admin/StatusBadge";
import AdminLayout from "@/Layouts/AdminLayout";
import { cn } from "@/lib/utils";
import type { IdentityCategory, IdentityUser, PageProps } from "@/types";

type Props = PageProps<{ users: IdentityUser[] }>;

const helper = createColumnHelper<IdentityUser>();

// ── Shared style constants (unchanged) ────────────────────────────────────────

const inputBase =
    "w-full rounded-2xl border-0 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-900 transition-colors";
const labelBase =
    "font-clash text-xs font-medium uppercase tracking-wider text-gray-500";

// ── Global styles — design language from Roles & Bookings ─────────────────────

const GLOBAL_STYLES = `
    .font-clash { font-family: 'Clash Display', sans-serif; }
    .font-bdo   { font-family: 'BDO Grotesk', sans-serif; }

    /* ── Entrance animations ── */
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
        50%       { box-shadow: 0 2px 16px rgba(15,23,42,0.3), 0 0 24px rgba(251,191,36,0.12); }
    }
    .icon-glow { animation: iconGlow 3.5s ease-in-out infinite; }

    /* ── Card border breathing ── */
    @keyframes cardBreath {
        0%, 100% { box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 0 0 1px rgba(226,232,240,0.8); }
        50%       { box-shadow: 0 4px 16px rgba(0,0,0,0.07), 0 0 0 1px rgba(251,191,36,0.2); }
    }
    .card-breath { animation: cardBreath 5s ease-in-out infinite; }

    /* ── Save / action button sheen ── */
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

    /* ── Stagger children ── */
    .stagger > *:nth-child(1) { animation-delay:  60ms; }
    .stagger > *:nth-child(2) { animation-delay: 120ms; }
    .stagger > *:nth-child(3) { animation-delay: 180ms; }
    .stagger > *:nth-child(4) { animation-delay: 240ms; }

    /* ── Top glint line on cards ── */
    .card-glint::before {
        content: '';
        position: absolute;
        top: 0; left: 20px; right: 20px; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent);
        pointer-events: none;
    }
`;

// ── ShinyIcon — identical to Roles.tsx ────────────────────────────────────────

function ShinyIcon({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn(
            "relative flex shrink-0 items-center justify-center rounded-xl",
            "bg-gradient-to-br from-slate-600 to-slate-900",
            "shadow-[0_2px_10px_rgba(15,23,42,0.22),inset_0_1px_0_rgba(255,255,255,0.12)]",
            "icon-glow",
            className,
        )}>
            {children}
            {/* Top inner glint */}
            <span className="pointer-events-none absolute top-[3px] left-[5px] right-[5px] h-[5px] rounded-full bg-white/20 blur-[1px]" />
        </div>
    );
}

// ── StatCard — summary chips at the top ───────────────────────────────────────

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: number;
    chipBg: string;
    chipText: string;
    chipRing: string;
    dotClass: string;
    animDelay?: number;
}

function StatCard({ icon, label, value, chipBg, chipText, chipRing, dotClass, animDelay = 0 }: StatCardProps) {
    return (
        <div
            className="animate-scale-in relative card-glint shimmer-once overflow-hidden rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_6px_24px_rgba(0,0,0,0.09)] hover:-translate-y-px"
            style={{ animationDelay: `${animDelay}ms` }}
        >
            {/* Glint row */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="font-bdo text-[10px] font-bold uppercase tracking-widest text-slate-400 truncate">
                        {label}
                    </p>
                    <p className="font-clash mt-1.5 text-[2rem] font-semibold leading-none text-slate-900 tabular-nums">
                        {value}
                    </p>
                </div>
                <ShinyIcon className="h-10 w-10 shrink-0">
                    {icon}
                </ShinyIcon>
            </div>

            {/* Chip */}
            <div className={cn(
                "mt-3.5 inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1",
                chipBg, chipRing,
            )}>
                <span className={cn("h-1.5 w-1.5 rounded-full", dotClass)} />
                <span className={cn("font-bdo text-[10px] font-bold uppercase tracking-wider", chipText)}>
                    {label}
                </span>
            </div>
        </div>
    );
}

// ── DocLightbox — logic 100% unchanged, visuals enhanced ─────────────────────

interface LightboxState {
    user: IdentityUser;
    category: IdentityCategory;
}

function DocLightbox({
    state,
    onClose,
}: {
    state: LightboxState;
    onClose: () => void;
}) {
    const { user } = state;
    const [category, setCategory]   = useState<IdentityCategory>(state.category);
    const [loading, setLoading]     = useState(false);
    const [imgError, setImgError]   = useState(false);

    // ── unchanged logic ──
    const submit = (status: "verified" | "rejected") => {
        setLoading(true);
        router.patch(
            route("admin.identity.verify", user.id),
            { status, identity_category: category },
            {
                onSuccess: onClose,
                onFinish: () => setLoading(false),
            },
        );
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Panel */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="relative flex w-full max-w-3xl flex-col gap-0 overflow-hidden rounded-3xl bg-white shadow-2xl">

                    {/* ── Header ── */}
                    <div className="relative flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
                        {/* Top glint */}
                        <div className="pointer-events-none absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

                        <div className="flex items-center gap-3">
                            <ShinyIcon className="h-9 w-9">
                                <ShieldCheck size={15} className="text-amber-300" />
                            </ShinyIcon>
                            <div>
                                <p className="font-clash text-sm font-semibold text-slate-900 leading-tight">
                                    {user.name}
                                </p>
                                <p className="mt-0.5 font-bdo text-[11px] text-slate-400">
                                    {user.email}
                                    {user.phone_number ? ` · ${user.phone_number}` : ""}
                                    {" · "}
                                    Diajukan {user.updated_at}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* ── Body — image left, form right (structure unchanged) ── */}
                    <div className="flex flex-col gap-0 xl:flex-row">

                        {/* Image viewer */}
                        <div className="flex min-h-64 flex-1 items-center justify-center bg-slate-950 xl:min-h-80">
                            {user.document_url && !imgError ? (
                                <img
                                    src={user.document_url}
                                    alt={`Dokumen identitas ${user.name}`}
                                    className="max-h-96 w-full object-contain"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-3 py-12 text-slate-500">
                                    <FileQuestion size={36} className="opacity-40" />
                                    <p className="font-bdo text-sm opacity-60">
                                        {imgError
                                            ? "Gagal memuat dokumen"
                                            : "Tidak ada dokumen diunggah"}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Verification form */}
                        <div className="flex w-full flex-col gap-5 bg-slate-50/60 p-6 xl:w-72 xl:shrink-0">

                            {/* Identity number */}
                            {user.identity_number && (
                                <div className="rounded-xl border border-slate-100 bg-white px-3.5 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                                    <p className={cn(labelBase, "mb-1")}>Nomor Identitas</p>
                                    <p className="mt-1 font-mono text-sm font-semibold text-slate-900 tracking-wider">
                                        {user.identity_number}
                                    </p>
                                </div>
                            )}

                            {/* Category correction */}
                            <div>
                                <label className={cn(labelBase, "mb-1.5 block")}>
                                    Kategori
                                    <span className="ml-1 normal-case text-gray-400">
                                        (koreksi jika perlu)
                                    </span>
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) =>
                                        setCategory(e.target.value as IdentityCategory)
                                    }
                                    className={inputBase}
                                >
                                    <option value="warga_kampus">Warga Kampus (UB)</option>
                                    <option value="umum">Umum</option>
                                </select>
                                {category !== state.category && (
                                    <p className="mt-1.5 flex items-center gap-1 text-[11px] text-amber-600">
                                        <AlertTriangle size={11} />
                                        Kategori akan diubah dari &quot;
                                        {state.category === "warga_kampus"
                                            ? "Warga Kampus"
                                            : "Umum"}
                                        &quot;
                                    </p>
                                )}
                            </div>

                            {/* Status badge */}
                            <div>
                                <p className={cn(labelBase, "mb-1.5")}>Status Saat Ini</p>
                                <div className="mt-1.5">
                                    <IdentityStatusBadge status={user.identity_status} />
                                </div>
                            </div>

                            {/* Action buttons — only shown for pending (logic unchanged) */}
                            {user.identity_status === "pending" ? (
                                <div className="mt-auto flex flex-col gap-2.5 pt-2">
                                    <button
                                        type="button"
                                        disabled={loading}
                                        onClick={() => submit("verified")}
                                        className="btn-sheen relative flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 py-3 font-bdo text-sm font-semibold text-white shadow-[0_4px_14px_rgba(16,185,129,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(16,185,129,0.4)] active:translate-y-0 disabled:opacity-50"
                                    >
                                        <span className="pointer-events-none absolute top-0 left-0 right-0 h-px rounded-t-2xl bg-white/20" />
                                        <CheckCircle size={15} />
                                        Verifikasi
                                    </button>
                                    <button
                                        type="button"
                                        disabled={loading}
                                        onClick={() => submit("rejected")}
                                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-50 py-3 font-bdo text-sm font-semibold text-rose-600 ring-1 ring-inset ring-rose-200 transition-all hover:bg-rose-100 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                                    >
                                        <XCircle size={15} />
                                        Tolak
                                    </button>
                                </div>
                            ) : (
                                <p className="mt-auto text-center font-bdo text-xs text-slate-400">
                                    Identitas ini sudah diproses.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// ── RowActions — logic 100% unchanged, visuals refined ────────────────────────

function RowActions({
    user,
    onViewDoc,
}: {
    user: IdentityUser;
    onViewDoc: (u: IdentityUser) => void;
}) {
    const [loading, setLoading] = useState(false);

    // ── unchanged logic ──
    const verify = (status: "verified" | "rejected") => {
        setLoading(true);
        router.patch(
            route("admin.identity.verify", user.id),
            { status },
            { onFinish: () => setLoading(false) },
        );
    };

    const isPending = user.identity_status === "pending";

    return (
        <div className="flex items-center gap-1.5">
            {/* View document */}
            {user.has_document && (
                <button
                    type="button"
                    onClick={() => onViewDoc(user)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-slate-500 ring-1 ring-slate-100 transition-all hover:bg-slate-100 hover:text-slate-900 hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                    title="Lihat dokumen"
                >
                    <Eye size={14} />
                </button>
            )}

            {/* Inline approve / reject for pending items */}
            {isPending && (
                <>
                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => verify("verified")}
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 transition-all hover:bg-emerald-100 hover:shadow-[0_2px_8px_rgba(16,185,129,0.2)] disabled:opacity-50"
                        title="Verifikasi"
                    >
                        <CheckCircle size={14} />
                    </button>
                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => verify("rejected")}
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-500 ring-1 ring-rose-100 transition-all hover:bg-rose-100 hover:shadow-[0_2px_8px_rgba(244,63,94,0.15)] disabled:opacity-50"
                        title="Tolak"
                    >
                        <XCircle size={14} />
                    </button>
                </>
            )}

            {!user.has_document && !isPending && (
                <span className="font-bdo text-xs text-slate-300">—</span>
            )}
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function IdentityIndex() {
    // ── unchanged logic ──
    const { users } = usePage<Props>().props;
    const pending   = users.filter((u) => u.identity_status === "pending").length;

    const [lightbox, setLightbox] = useState<LightboxState | null>(null);

    const openLightbox = (user: IdentityUser) => {
        setLightbox({ user, category: user.identity_category });
    };

    // Derived counts — cosmetic only, no new backend calls
    const verified = users.filter((u) => u.identity_status === "verified").length;
    const rejected = users.filter((u) => u.identity_status === "rejected").length;

    // ── columns — logic & accessors 100% unchanged ──
    const columns = [
        helper.accessor("name", {
            header: "Nama",
            enableSorting: true,
            cell: (info) => {
                const u = info.row.original;
                return (
                    <div className="flex items-center gap-3">
                        {/* Avatar — dark gradient matching ShinyIcon palette */}
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-600 to-slate-900 font-clash text-xs font-medium text-white shadow-[0_2px_6px_rgba(15,23,42,0.2)]">
                            {u.name.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="font-clash text-sm font-medium text-slate-900 leading-snug truncate">
                                {u.name}
                            </p>
                            <p className="font-bdo text-[11px] text-slate-400 truncate">
                                {u.email}
                            </p>
                        </div>
                    </div>
                );
            },
        }),
        helper.accessor("identity_category", {
            header: "Kategori",
            cell: (info) => (
                <span className={cn(
                    "inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 font-bdo text-[11px] font-semibold",
                    info.getValue() === "warga_kampus"
                        ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200"
                        : "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200",
                )}>
                    <span className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        info.getValue() === "warga_kampus"
                            ? "bg-blue-400 shadow-[0_0_5px_rgba(96,165,250,0.7)]"
                            : "bg-slate-400",
                    )} />
                    {info.getValue() === "warga_kampus" ? "Warga Kampus" : "Umum"}
                </span>
            ),
        }),
        helper.accessor("identity_number", {
            header: "No. Identitas",
            cell: (info) => (
                <span className="font-mono text-xs text-slate-600 tabular-nums">
                    {info.getValue() ?? <span className="text-slate-300">—</span>}
                </span>
            ),
        }),
        helper.accessor("updated_at", {
            header: "Diajukan",
            enableSorting: true,
            cell: (info) => (
                <span className="font-bdo text-xs text-slate-500">{info.getValue()}</span>
            ),
        }),
        helper.accessor("identity_status", {
            header: "Status",
            cell: (info) => <IdentityStatusBadge status={info.getValue()} />,
        }),
        helper.display({
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => (
                <RowActions user={row.original} onViewDoc={openLightbox} />
            ),
        }),
    ] as ColumnDef<IdentityUser, unknown>[];

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4">
                    <span className="font-bdo font-semibold text-xs tracking-wide text-orange-500">
                        Staff Front Office
                    </span>
                    <h1 className="font-clash text-3xl font-bold uppercase   tracking-tight text-gray-900">
                        Identity Queue
                    </h1>
                </div>
            }
        >
            <Head title="Identity Queue" />

            {/* Inject design-language styles */}
            <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />

            <div className="flex flex-col gap-5 pt-6 pb-20">

                {/* ── Stat cards row ─────────────────────────────────────── */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 stagger">
                    <StatCard
                        icon={<Clock size={16} className="text-amber-300" />}
                        label="Menunggu Review"
                        value={pending}
                        chipBg="bg-orange-50"
                        chipText="text-orange-600"
                        chipRing="ring-1 ring-orange-200/70"
                        dotClass="bg-orange-400 shadow-[0_0_5px_rgba(251,146,60,0.8)] animate-pulse"
                    />
                    <StatCard
                        icon={<Users size={16} className="text-amber-300" />}
                        label="Total Pengajuan"
                        value={users.length}
                        chipBg="bg-slate-100"
                        chipText="text-slate-500"
                        chipRing="ring-1 ring-slate-200/70"
                        dotClass="bg-slate-400 animate-pulse"
                    />
                    <StatCard
                        icon={<CheckCircle size={16} className="text-amber-300" />}
                        label="Terverifikasi"
                        value={verified}
                        chipBg="bg-emerald-50"
                        chipText="text-emerald-600"
                        chipRing="ring-1 ring-emerald-200/70"
                        dotClass="bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.7)] animate-pulse"
                    />
                    <StatCard
                        icon={<XCircle size={16} className="text-amber-300" />}
                        label="Ditolak"
                        value={rejected}
                        chipBg="bg-rose-50"
                        chipText="text-rose-600"
                        chipRing="ring-1 ring-rose-200/70"
                        dotClass="bg-rose-400 animate-pulse"
                    />
                </div>

                {/* ── Header bar (identical pattern to Roles.tsx right-pane header) ── */}
                <div className="relative card-glint shimmer-once overflow-hidden flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.05)] animate-fade-in-up delay-200">
                    <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/70 to-transparent" />

                    <div className="flex items-center gap-3">
                        <ShinyIcon className="h-10 w-10">
                            <ShieldCheck size={16} className="text-amber-300" />
                        </ShinyIcon>
                        <div>
                            <p className="font-bdo text-[10px] font-bold tracking-wide text-slate-400">
                                Verifikasi Identitas
                            </p>
                            <p className="font-bdo text-base font-semibold text-slate-900 leading-tight">
                                Antrean Identitas Warga UB
                            </p>
                        </div>
                    </div>

                    {/* Live status chips */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        {pending > 0 && (
                            <div className="flex items-center gap-1.5 rounded-xl bg-orange-50 ring-1 ring-orange-200 px-3 py-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse shadow-[0_0_6px_rgba(251,146,60,0.7)]" />
                                <span className="font-bdo text-[11px] font-bold text-orange-600 uppercase tracking-wider tabular-nums">
                                    {pending} Menunggu
                                </span>
                            </div>
                        )}
                        <div className="flex items-center gap-1.5 rounded-xl bg-sky-50 ring-1 ring-sky-200 px-3 py-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
                            <span className="font-bdo text-[11px] font-bold text-sky-600 uppercase tracking-wider tabular-nums">
                                {users.length} Total
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── DataTable — wrapped in a styled card shell ─────────── */}
                <div className="animate-fade-in-up delay-250 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
                    <DataTable
                        columns={columns}
                        data={users}
                        searchColumn="name"
                        searchPlaceholder="Cari nama…"
                        emptyMessage="Belum ada pengajuan identitas."
                    />
                </div>
            </div>

            {lightbox && (
                <DocLightbox
                    state={lightbox}
                    onClose={() => setLightbox(null)}
                />
            )}
        </AdminLayout>
    );
}