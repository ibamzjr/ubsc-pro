import { Head, router, usePage } from "@inertiajs/react";
import { CalendarCheck2, CalendarPlus, Lock } from "lucide-react";
import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { cn } from "@/lib/utils";
import type { PageProps } from "@/types";

// ── Types ──────────────────────────────────────────────────────────────────────

interface ScheduleRow {
    month: number;
    year: number;
    label: string;
    is_open: boolean;
}

type Props = PageProps<{ schedules: ScheduleRow[] }>;

// ── Global styles ──────────────────────────────────────────────────────────────

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

    .delay-100 { animation-delay: 100ms; }
    .delay-200 { animation-delay: 200ms; }

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

    /* ── Toggle thumb emerald glow ── */
    @keyframes thumbGlowEmerald {
        0%, 100% { box-shadow: 0 1px 4px rgba(0,0,0,0.2), 0 0 0 0 rgba(16,185,129,0); }
        50%       { box-shadow: 0 1px 8px rgba(0,0,0,0.25), 0 0 10px 2px rgba(16,185,129,0.35); }
    }
    .thumb-glow-emerald { animation: thumbGlowEmerald 2.5s ease-in-out infinite; }

    /* ── Save button shimmer ── */
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
`;

// ── Sub-components ─────────────────────────────────────────────────────────────

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
            {/* Top glint */}
            <span className="pointer-events-none absolute top-[3px] left-[5px] right-[5px] h-[5px] rounded-full bg-white/20 blur-[1px]" />
        </div>
    );
}

// ── Toggle Switch ─────────────────────────────────────────────────────────────

function ToggleSwitch({
    checked,
    onChange,
    disabled,
}: {
    checked: boolean;
    onChange: () => void;
    disabled?: boolean;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={onChange}
            className={cn(
                "relative inline-flex h-[26px] w-12 shrink-0 rounded-full p-[3px] transition-all duration-300",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 focus-visible:ring-offset-2",
                disabled ? "cursor-not-allowed opacity-50 grayscale" : "cursor-pointer",
                checked
                    ? "bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-[0_2px_8px_rgba(52,211,153,0.4),inset_0_1px_0_rgba(255,255,255,0.3)]"
                    : "bg-slate-200 shadow-[inset_0_1px_3px_rgba(0,0,0,0.12)]",
            )}
        >
            <span
                className={cn(
                    "relative inline-block h-5 w-5 rounded-full bg-white transition-all duration-300",
                    checked
                        ? "translate-x-[22px] shadow-[0_1px_4px_rgba(0,0,0,0.2)] thumb-glow-emerald"
                        : "translate-x-0 shadow-[0_1px_3px_rgba(0,0,0,0.15)]",
                )}
            >
                {/* Thumb inner glint */}
                <span className="pointer-events-none absolute top-[3px] left-[3px] right-[3px] h-[5px] rounded-full bg-white/70 blur-[0.5px]" />
            </span>
        </button>
    );
}

// ── Schedule Card ─────────────────────────────────────────────────────────────

function ScheduleCard({
    row,
    isFirst,
    onToggle,
    toggling,
    index,
}: {
    row: ScheduleRow;
    isFirst: boolean;
    onToggle: () => void;
    toggling: boolean;
    index: number;
}) {
    return (
        <div
            className={cn(
                "animate-scale-in relative overflow-hidden rounded-2xl border bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)] card-glint transition-all duration-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)] hover:-translate-y-px group",
                row.is_open ? "border-emerald-200/50" : "border-slate-200/80"
            )}
            style={{ animationDelay: `${index * 55 + 180}ms` }}
        >
            {/* One-shot shimmer sweep on load */}
            <div className="shimmer-once pointer-events-none absolute inset-0 z-10 rounded-2xl" />

            <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-4 min-w-0">
                    <div className={cn(
                        "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
                        row.is_open
                            ? "bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-[0_2px_10px_rgba(52,211,153,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]"
                            : "bg-gradient-to-br from-slate-100 to-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] border border-slate-200"
                    )}>
                        {row.is_open ? <CalendarCheck2 size={20} className="text-white drop-shadow-md" /> : <Lock size={18} className="text-slate-400" />}
                        {row.is_open && <span className="pointer-events-none absolute top-[2px] left-[4px] right-[4px] h-[5px] rounded-full bg-white/30 blur-[1px]" />}
                    </div>

                    <div className="truncate">
                        <p className="font-clash text-base font-semibold text-slate-800 leading-tight flex items-center gap-2">
                            {row.label}
                            {isFirst && (
                                <span className="rounded-lg bg-amber-50 ring-1 ring-amber-200/70 px-2 py-0.5 font-bdo text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                                    Bulan Ini
                                </span>
                            )}
                        </p>
                        <div className="mt-1 flex items-center gap-1.5">
                            <span className={cn(
                                "h-1.5 w-1.5 shrink-0 rounded-full shadow-sm",
                                row.is_open ? "bg-emerald-400 animate-pulse shadow-[0_0_5px_rgba(52,211,153,0.7)]" : "bg-slate-300"
                            )} />
                            <p className={cn(
                                "font-bdo text-[11px] font-medium truncate",
                                row.is_open ? "text-emerald-600" : "text-slate-500"
                            )}>
                                {row.is_open ? "Terbuka untuk reservasi" : "Terkunci · Reservasi ditutup"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="pl-4">
                    <ToggleSwitch
                        checked={row.is_open}
                        onChange={onToggle}
                        disabled={toggling}
                    />
                </div>
            </div>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SchedulesIndex() {
    const { schedules } = usePage<Props>().props;
    const [togglingKey, setTogglingKey] = useState<string | null>(null);
    const [quickOpening, setQuickOpening] = useState(false);

    const rowKey = (r: ScheduleRow) => `${r.year}-${r.month}`;

    const handleToggle = (row: ScheduleRow) => {
        const key = rowKey(row);
        setTogglingKey(key);
        router.post(
            route("admin.settings.schedules.toggle"),
            { month: row.month, year: row.year },
            {
                preserveScroll: true,
                onFinish: () => setTogglingKey(null),
            },
        );
    };

    const handleQuickOpenNext = () => {
        setQuickOpening(true);
        router.post(
            route("admin.settings.schedules.quick-open-next"),
            {},
            {
                preserveScroll: true,
                onFinish: () => setQuickOpening(false),
            },
        );
    };

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4 animate-fade-in-up">
                    <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
                    <span className="font-bdo text-[11px] font-medium tracking-wide text-orange-400 ">
                        Pengaturan Sistem
                    </span>
                    <h1 className="font-clash text-3xl font-bold tracking-tight xl:text-4xl text-slate-900 uppercase">
                        Kontrol Jadwal
                    </h1>
                </div>
            }
        >
            <Head title="Schedule Control" />

            <div className="pt-6 pb-20 mx-auto max-w-4xl">
                
                {/* ── Top Info & Action Card ──────────────────────────────────────────── */}
                <div className="relative card-glint overflow-hidden mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] shimmer-once animate-fade-in-up delay-100">
                    <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/70 to-transparent" />
                    
                    <div className="flex items-center gap-4">
                        <ShinyIcon className="h-10 w-10">
                            <CalendarCheck2 size={18} className="text-amber-300" />
                        </ShinyIcon>
                        <div>
                            <p className="font-bdo text-sm font-bold tracking-tight text-slate-700">
                                Manajemen Jadwal
                            </p>
                            <p className="font-clash text-xs font-medium text-slate-400 leading-snug mt- max-w-sm">
                                Kelola bulan yang terbuka untuk penerimaan reservasi fasilitas.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        disabled={quickOpening}
                        onClick={handleQuickOpenNext}
                        className={cn(
                            "btn-sheen relative flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-clash text-sm font-semibold transition-all duration-200",
                            quickOpening
                                ? "bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-[0_4px_14px_rgba(16,185,129,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] opacity-80 cursor-wait"
                                : "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-[0_4px_14px_rgba(16,185,129,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
                        )}
                    >
                        <span className="pointer-events-none absolute top-0 left-0 right-0 h-px rounded-t-xl bg-white/30" />
                        <CalendarPlus size={16} />
                        {quickOpening ? "Membuka…" : "Buka Bulan Depan"}
                    </button>
                </div>

                {/* ── Schedule cards list ───────────────────────────────────────── */}
                <div className="flex flex-col gap-3 animate-fade-in-up delay-200">
                    {schedules.map((row, i) => (
                        <ScheduleCard
                            key={rowKey(row)}
                            row={row}
                            isFirst={i === 0}
                            onToggle={() => handleToggle(row)}
                            toggling={togglingKey === rowKey(row)}
                            index={i}
                        />
                    ))}

                    {/* Legend Footer */}
                    <div className="mt-4 flex flex-wrap items-center gap-5 px-2">
                        <div className="flex items-center gap-2">
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-200">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            </span>
                            <span className="font-bdo text-[11px] text-slate-500 font-medium">Terbuka — Booking diterima</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-50 ring-1 ring-slate-200">
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                            </span>
                            <span className="font-bdo text-[11px] text-slate-500 font-medium">Terkunci — Booking ditolak otomatis</span>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}