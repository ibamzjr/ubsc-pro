import { Head, router, usePage } from "@inertiajs/react";
import { CalendarCheck2, ChevronDown, Lock, Save } from "lucide-react";
import { useEffect, useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { cn } from "@/lib/utils";
import type { PageProps } from "@/types";

// ── Types ──────────────────────────────────────────────────────────────────────

interface ScheduleRow {
    month: number;
    year: number;
    label: string;
    is_open: boolean;
    closed_dates: string[];
}

type Props = PageProps<{ schedules: ScheduleRow[] }>;

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

    @keyframes shimmerSweep {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(200%); }
    }
    .shimmer-once { position: relative; overflow: hidden; }
    .shimmer-once::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%);
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

    @keyframes thumbGlowEmerald {
        0%, 100% { box-shadow: 0 1px 4px rgba(0,0,0,0.2), 0 0 0 0 rgba(16,185,129,0); }
        50%       { box-shadow: 0 1px 8px rgba(0,0,0,0.25), 0 0 10px 2px rgba(16,185,129,0.35); }
    }
    .thumb-glow-emerald { animation: thumbGlowEmerald 2.5s ease-in-out infinite; }

    .card-glint::before {
        content: '';
        position: absolute;
        top: 0; left: 20px; right: 20px; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent);
        pointer-events: none;
    }

    @keyframes calendarExpand {
        from { opacity: 0; transform: translateY(-6px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    .calendar-expand { animation: calendarExpand 0.25s ease-out forwards; }
`;

// ── Calendar helpers ───────────────────────────────────────────────────────────

const DAY_LABELS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

function buildCalendarWeeks(month: number, year: number): (string | null)[][] {
    const firstDow = new Date(year, month - 1, 1).getDay();
    const startOffset = (firstDow + 6) % 7;
    const daysInMonth = new Date(year, month, 0).getDate();
    const pad = (n: number) => String(n).padStart(2, "0");

    const cells: (string | null)[] = Array(startOffset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push(`${year}-${pad(month)}-${pad(d)}`);
    }
    while (cells.length % 7 !== 0) cells.push(null);

    const weeks: (string | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
        weeks.push(cells.slice(i, i + 7));
    }
    return weeks;
}

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
            <span className="pointer-events-none absolute top-[3px] left-[5px] right-[5px] h-[5px] rounded-full bg-white/20 blur-[1px]" />
        </div>
    );
}

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
            <span className={cn(
                "relative inline-block h-5 w-5 rounded-full bg-white transition-all duration-300",
                checked
                    ? "translate-x-[22px] shadow-[0_1px_4px_rgba(0,0,0,0.2)] thumb-glow-emerald"
                    : "translate-x-0 shadow-[0_1px_3px_rgba(0,0,0,0.15)]",
            )}>
                <span className="pointer-events-none absolute top-[3px] left-[3px] right-[3px] h-[5px] rounded-full bg-white/70 blur-[0.5px]" />
            </span>
        </button>
    );
}

// ── Calendar Grid ─────────────────────────────────────────────────────────────

function CalendarGrid({
    month,
    year,
    monthClosed,
    closedDates,
    onToggleLocal,
    disabled,
}: {
    month: number;
    year: number;
    monthClosed: boolean;
    closedDates: string[];
    onToggleLocal: (date: string) => void;
    disabled: boolean;
}) {
    const weeks = buildCalendarWeeks(month, year);
    const closedSet = new Set(closedDates);

    return (
        <div>
            {/* Legend */}
            <div className="mb-3 flex items-center justify-between">
                <p className="font-clash text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Klik hari untuk buka / tutup
                </p>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-sm bg-emerald-400" />
                        <span className="font-bdo text-[10px] text-slate-500">Buka</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-sm bg-rose-400" />
                        <span className="font-bdo text-[10px] text-slate-500">Tutup</span>
                    </span>
                    {monthClosed && (
                        <span className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-sm bg-slate-300" />
                            <span className="font-bdo text-[10px] text-slate-500">Bulan tutup</span>
                        </span>
                    )}
                </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
                {DAY_LABELS.map((d) => (
                    <div key={d} className="text-center font-clash text-[10px] font-semibold uppercase tracking-wider text-slate-400 py-1">
                        {d}
                    </div>
                ))}
            </div>

            {/* Day cells */}
            <div className="flex flex-col gap-1">
                {weeks.map((week, wi) => (
                    <div key={wi} className="grid grid-cols-7 gap-1">
                        {week.map((dateStr, di) => {
                            if (!dateStr) return <div key={di} />;
                            const day = parseInt(dateStr.split("-")[2]);
                            const isClosed = closedSet.has(dateStr);

                            return (
                                <button
                                    key={dateStr}
                                    type="button"
                                    disabled={disabled || monthClosed}
                                    onClick={() => onToggleLocal(dateStr)}
                                    title={
                                        monthClosed
                                            ? "Buka bulan dulu untuk mengatur hari"
                                            : isClosed
                                            ? "Klik untuk buka hari ini"
                                            : "Klik untuk tutup hari ini"
                                    }
                                    className={cn(
                                        "flex h-9 w-full items-center justify-center rounded-xl font-bdo text-xs font-medium transition-all duration-150",
                                        monthClosed
                                            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                            : isClosed
                                            ? "bg-rose-100 text-rose-600 ring-1 ring-rose-200 hover:bg-rose-200"
                                            : "bg-white text-slate-700 shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:bg-emerald-50 hover:text-emerald-700 hover:ring-1 hover:ring-emerald-200",
                                        disabled && "opacity-60",
                                    )}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Schedule Card ─────────────────────────────────────────────────────────────

type SaveCallbacks = { onFinish: () => void; onError: () => void };

function ScheduleCard({
    row,
    isFirst,
    onToggle,
    onSaveDates,
    toggling,
    index,
}: {
    row: ScheduleRow;
    isFirst: boolean;
    onToggle: () => void;
    onSaveDates: (newClosed: string[], cbs: SaveCallbacks) => void;
    toggling: boolean;
    index: number;
}) {
    const [expanded, setExpanded] = useState(false);
    const [localClosedDates, setLocalClosedDates] = useState<string[]>(row.closed_dates);
    const [saving, setSaving] = useState(false);

    // Sync local draft when the committed state changes from outside (e.g. successful save)
    useEffect(() => {
        setLocalClosedDates(row.closed_dates);
    }, [row.closed_dates]);

    const hasChanges =
        JSON.stringify([...localClosedDates].sort()) !==
        JSON.stringify([...row.closed_dates].sort());

    const handleToggleLocal = (date: string) => {
        setLocalClosedDates((prev) =>
            prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date].sort()
        );
    };

    const handleSave = () => {
        setSaving(true);
        onSaveDates(localClosedDates, {
            onFinish: () => setSaving(false),
            onError: () => {
                setSaving(false);
                setLocalClosedDates(row.closed_dates); // revert draft on error
            },
        });
    };

    return (
        <div
            className={cn(
                "animate-scale-in relative overflow-hidden rounded-2xl border bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)] card-glint transition-all duration-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)]",
                row.is_open ? "border-emerald-200/50" : "border-slate-200/80"
            )}
            style={{ animationDelay: `${index * 55 + 180}ms` }}
        >
            <div className="shimmer-once pointer-events-none absolute inset-0 z-10 rounded-2xl" />

            {/* ── Card header row ── */}
            <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-4 min-w-0">
                    <div className={cn(
                        "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
                        row.is_open
                            ? "bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-[0_2px_10px_rgba(52,211,153,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]"
                            : "bg-gradient-to-br from-slate-100 to-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] border border-slate-200"
                    )}>
                        {row.is_open
                            ? <CalendarCheck2 size={20} className="text-white drop-shadow-md" />
                            : <Lock size={18} className="text-slate-400" />}
                        {row.is_open && (
                            <span className="pointer-events-none absolute top-[2px] left-[4px] right-[4px] h-[5px] rounded-full bg-white/30 blur-[1px]" />
                        )}
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
                                {row.is_open
                                    ? row.closed_dates.length > 0
                                        ? `Terbuka · ${row.closed_dates.length} hari ditutup`
                                        : "Terbuka untuk reservasi"
                                    : "Terkunci · Reservasi ditutup"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 pl-4">
                    <button
                        type="button"
                        onClick={() => setExpanded((v) => !v)}
                        title={expanded ? "Tutup kalender" : "Atur hari"}
                        className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-all duration-200",
                            expanded
                                ? "border-slate-300 bg-slate-100 text-slate-700"
                                : "border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-600"
                        )}
                    >
                        <ChevronDown
                            size={15}
                            className={cn("transition-transform duration-200", expanded && "rotate-180")}
                        />
                    </button>

                    <ToggleSwitch
                        checked={row.is_open}
                        onChange={onToggle}
                        disabled={toggling}
                    />
                </div>
            </div>

            {/* ── Expandable calendar ── */}
            {expanded && (
                <div className="calendar-expand border-t border-slate-100 px-5 pb-5 pt-4">
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <CalendarGrid
                            month={row.month}
                            year={row.year}
                            monthClosed={!row.is_open}
                            closedDates={localClosedDates}
                            onToggleLocal={handleToggleLocal}
                            disabled={saving}
                        />

                        {localClosedDates.length > 0 && (
                            <p className="mt-3 font-bdo text-[11px] text-slate-400 text-center">
                                {localClosedDates.length} hari ditutup
                                {hasChanges && " · belum disimpan"}
                            </p>
                        )}
                    </div>

                    {/* Batch save footer */}
                    <div className="mt-3 flex items-center justify-end gap-2">
                        {hasChanges && (
                            <button
                                type="button"
                                onClick={() => setLocalClosedDates(row.closed_dates)}
                                className="rounded-xl px-4 py-2 font-clash text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100"
                            >
                                Batalkan
                            </button>
                        )}
                        <button
                            type="button"
                            disabled={!hasChanges || saving || !row.is_open}
                            onClick={handleSave}
                            className={cn(
                                "flex items-center gap-2 rounded-xl px-5 py-2 font-clash text-xs font-semibold transition-all duration-200",
                                hasChanges && row.is_open
                                    ? "bg-slate-900 text-white hover:bg-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
                                    : "bg-slate-100 text-slate-400 cursor-not-allowed",
                                saving && "opacity-70 cursor-wait",
                            )}
                        >
                            <Save size={13} />
                            {saving ? "Menyimpan…" : "Simpan Perubahan"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SchedulesIndex() {
    const { schedules: serverSchedules } = usePage<Props>().props;

    const [schedules, setSchedules] = useState<ScheduleRow[]>(serverSchedules);
    const [togglingKey, setTogglingKey] = useState<string | null>(null);

    const rowKey = (r: ScheduleRow) => `${r.year}-${r.month}`;

    const handleToggle = (row: ScheduleRow) => {
        const key = rowKey(row);
        setSchedules((prev) =>
            prev.map((r) => (rowKey(r) === key ? { ...r, is_open: !r.is_open } : r))
        );
        setTogglingKey(key);
        router.post(
            route("admin.settings.schedules.toggle"),
            { month: row.month, year: row.year },
            {
                preserveScroll: true,
                onFinish: () => setTogglingKey(null),
                onError: () => {
                    setSchedules((prev) =>
                        prev.map((r) => (rowKey(r) === key ? { ...r, is_open: row.is_open } : r))
                    );
                },
            },
        );
    };

    const handleSaveDates = (row: ScheduleRow, newClosed: string[], cbs: SaveCallbacks) => {
        const key = rowKey(row);
        const prev = row.closed_dates;
        setSchedules((s) =>
            s.map((r) => (rowKey(r) === key ? { ...r, closed_dates: newClosed } : r))
        );
        router.post(
            route("admin.settings.schedules.update-dates"),
            { month: row.month, year: row.year, closed_dates: newClosed },
            {
                preserveScroll: true,
                onFinish: cbs.onFinish,
                onError: () => {
                    setSchedules((s) =>
                        s.map((r) => (rowKey(r) === key ? { ...r, closed_dates: prev } : r))
                    );
                    cbs.onError();
                },
            },
        );
    };

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4 animate-fade-in-up">
                    <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
                    <span className="font-bdo text-[11px] font-medium tracking-wide text-orange-400">
                        Pengaturan Sistem
                    </span>
                    <h1 className="font-clash text-3xl font-bold tracking-tight xl:text-4xl text-slate-900 uppercase">
                        Kontrol Jadwal
                    </h1>
                </div>
            }
        >
            <Head title="Schedule Control" />

            <div className="pt-6 pb-20">

                {/* ── Top Info Card ── */}
                <div className="relative card-glint overflow-hidden mb-6 flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] shimmer-once animate-fade-in-up delay-100">
                    <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/70 to-transparent" />
                    <ShinyIcon className="h-10 w-10">
                        <CalendarCheck2 size={18} className="text-amber-300" />
                    </ShinyIcon>
                    <div>
                        <p className="font-bdo text-sm font-bold tracking-tight text-slate-700">
                            Manajemen Jadwal
                        </p>
                        <p className="font-clash text-xs font-medium text-slate-400 leading-snug max-w-lg">
                            Aktifkan bulan untuk menerima reservasi, lalu klik ↓ pada bulan untuk menutup hari tertentu (libur / pemeliharaan).
                        </p>
                    </div>
                </div>

                {/* ── Schedule card list ── */}
                <div className="flex flex-col gap-3 animate-fade-in-up delay-200">
                    {schedules.map((row, i) => (
                        <ScheduleCard
                            key={rowKey(row)}
                            row={row}
                            isFirst={i === 0}
                            onToggle={() => handleToggle(row)}
                            onSaveDates={(newClosed, cbs) => handleSaveDates(row, newClosed, cbs)}
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
                        <div className="flex items-center gap-2">
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-50 ring-1 ring-rose-200">
                                <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                            </span>
                            <span className="font-bdo text-[11px] text-slate-500 font-medium">Hari ditutup — Booking ditolak</span>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
