import { Head, router, usePage } from "@inertiajs/react";
import { CalendarCheck2, CalendarPlus, Lock } from "lucide-react";
import { useState } from "react";
import { ADMIN_TOKENS } from "@/Components/Admin/tokens";
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
                "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40",
                checked ? "bg-gray-900" : "bg-gray-200",
            )}
        >
            <span
                className={cn(
                    "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200",
                    checked ? "translate-x-6" : "translate-x-1",
                )}
            />
        </button>
    );
}

// ── Schedule Card ─────────────────────────────────────────────────────────────

function ScheduleCard({
    row,
    isFirst,
    onToggle,
    toggling,
}: {
    row: ScheduleRow;
    isFirst: boolean;
    onToggle: () => void;
    toggling: boolean;
}) {
    return (
        <div
            className={cn(
                "flex items-center justify-between rounded-2xl px-5 py-4 transition-all duration-200",
                row.is_open
                    ? "bg-emerald-50/60 ring-1 ring-inset ring-emerald-200"
                    : "bg-white ring-1 ring-inset ring-gray-100",
            )}
        >
            {/* Left — icon + label */}
            <div className="flex items-center gap-4">
                <div
                    className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
                        row.is_open
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-rose-50 text-rose-400",
                    )}
                >
                    {row.is_open ? (
                        <CalendarCheck2 size={18} />
                    ) : (
                        <Lock size={16} />
                    )}
                </div>

                <div>
                    <p className="font-clash text-sm font-semibold text-gray-900">
                        {row.label}
                        {isFirst && (
                            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                                Bulan ini
                            </span>
                        )}
                    </p>
                    <p className={cn(
                        "mt-0.5 text-[11px] font-medium",
                        row.is_open ? "text-emerald-600" : "text-rose-400",
                    )}>
                        {row.is_open ? "Terbuka untuk booking" : "Terkunci · booking ditolak"}
                    </p>
                </div>
            </div>

            {/* Right — toggle */}
            <ToggleSwitch
                checked={row.is_open}
                onChange={onToggle}
                disabled={toggling}
            />
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
                <div className="flex flex-col gap-1 pt-4">
                    <span className="font-clash text-xs uppercase tracking-[0.2em] text-gray-400">
                        Settings
                    </span>
                    <h1 className="font-monument text-3xl font-normal tracking-tight text-gray-900">
                        Schedule Control
                    </h1>
                </div>
            }
        >
            <Head title="Schedule Control" />

            <div className="pt-6">
                {/* ── Header bar ──────────────────────────────────────────── */}
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">
                            Kelola bulan mana yang terbuka untuk penerimaan booking fasilitas.
                            Bulan yang ditutup akan menolak semua permintaan booking baru.
                        </p>
                    </div>

                    <button
                        type="button"
                        disabled={quickOpening}
                        onClick={handleQuickOpenNext}
                        className="flex shrink-0 items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 ml-6"
                    >
                        <CalendarPlus size={15} />
                        {quickOpening ? "Membuka…" : "Buka Bulan Depan"}
                    </button>
                </div>

                {/* ── Schedule cards ───────────────────────────────────────── */}
                <div className={cn(ADMIN_TOKENS.CARD_LARGE, "p-4")}>
                    <div className="flex flex-col gap-2.5">
                        {schedules.map((row, i) => (
                            <ScheduleCard
                                key={rowKey(row)}
                                row={row}
                                isFirst={i === 0}
                                onToggle={() => handleToggle(row)}
                                toggling={togglingKey === rowKey(row)}
                            />
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-4">
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                            Terbuka — booking diterima
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                            <span className="inline-block h-2 w-2 rounded-full bg-rose-300" />
                            Terkunci — booking ditolak otomatis
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
