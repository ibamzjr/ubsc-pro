import { Head, Link } from "@inertiajs/react";
import {
    CalendarDays,
    Clock,
    Pencil,
    Plus,
    Tag,
    Trash2,
} from "lucide-react";
import { useState } from "react";
import SlideOver from "@/Components/Admin/SlideOver";
import { ADMIN_TOKENS } from "@/Components/Admin/tokens";
import AdminLayout from "@/Layouts/AdminLayout";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

type ActiveTab    = "warga_ub" | "umum";
type DurasiOption = "60" | "90" | "120";
type ScheduleType = "hari" | "tanggal";

interface RegulerState {
    durasi: DurasiOption;
    harga: string;
    hargaCoretEnabled: boolean;
    hargaDiskon: string;
    statusAktif: boolean;
}

interface DaySchedule {
    enabled: boolean;
    start: string;
    end: string;
}

interface KhususItem {
    id: number;
    nama: string;
    harga: number;
    durasi: DurasiOption;
    scheduleType: ScheduleType;
    timeRange?: string;
    days?: string[];
    dateRange?: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"] as const;

const makeDaySchedules = (): Record<string, DaySchedule> =>
    Object.fromEntries(DAYS.map((d) => [d, { enabled: false, start: "08:00", end: "17:00" }]));

const DUMMY_KHUSUS: Record<ActiveTab, KhususItem[]> = {
    warga_ub: [
        {
            id: 1,
            nama: "Lapangan Tennis Pagi",
            harga: 85_000,
            durasi: "60",
            scheduleType: "hari",
            timeRange: "06:00–15:00",
            days: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"],
        },
        {
            id: 2,
            nama: "Lapangan Tennis Sore",
            harga: 95_000,
            durasi: "60",
            scheduleType: "hari",
            timeRange: "16:00–00:00",
            days: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
        },
    ],
    umum: [
        {
            id: 1,
            nama: "Lapangan Tennis Pagi",
            harga: 105_000,
            durasi: "60",
            scheduleType: "hari",
            timeRange: "06:00–15:00",
            days: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"],
        },
        {
            id: 2,
            nama: "Lapangan Tennis Sore",
            harga: 115_000,
            durasi: "60",
            scheduleType: "hari",
            timeRange: "16:00–00:00",
            days: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
        },
    ],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatPrice(amount: number): string {
    return `Rp ${amount.toLocaleString("id-ID")}`;
}

// ── Shared style constants ────────────────────────────────────────────────────

const inputBase =
    "w-full rounded-2xl border-0 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-900 transition-colors";
const labelBase =
    "font-clash text-xs font-medium uppercase tracking-wider text-gray-500";

// ── Sub-components ────────────────────────────────────────────────────────────

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
            className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2",
                enabled ? "bg-gray-900" : "bg-gray-200",
            )}
        >
            <span
                className={cn(
                    "mt-0.5 inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200",
                    enabled ? "translate-x-[22px]" : "translate-x-0.5",
                )}
            />
        </button>
    );
}

function PillTab<T extends string>({
    options,
    active,
    onChange,
    size = "md",
}: {
    options: { value: T; label: string }[];
    active: T;
    onChange: (v: T) => void;
    size?: "sm" | "md";
}) {
    return (
        <div className="flex items-center rounded-2xl bg-gray-100 p-1">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange(opt.value)}
                    className={cn(
                        "rounded-xl transition-all duration-200",
                        size === "sm"
                            ? "px-3.5 py-1.5 text-xs font-medium"
                            : "px-5 py-2.5 text-sm font-medium",
                        active === opt.value
                            ? ADMIN_TOKENS.PILL_ACTIVE
                            : ADMIN_TOKENS.PILL_INACTIVE,
                    )}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}

function SectionHeader({
    letter,
    title,
    subtitle,
    className,
}: {
    letter: string;
    title: string;
    subtitle?: string;
    className?: string;
}) {
    return (
        <div className={cn("flex items-center gap-3", className)}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gray-900 font-clash text-xs font-semibold text-white">
                {letter}
            </div>
            <div>
                <p className="font-clash text-sm font-semibold text-gray-900">{title}</p>
                {subtitle && <p className="mt-0.5 text-[11px] text-gray-400">{subtitle}</p>}
            </div>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function FacilityPricing() {
    // ── Master tab
    const [activeTab, setActiveTab] = useState<ActiveTab>("warga_ub");

    // ── Section A — per-tab independent state
    const [regulerState, setRegulerState] = useState<Record<ActiveTab, RegulerState>>({
        warga_ub: { durasi: "60", harga: "75000",  hargaCoretEnabled: false, hargaDiskon: "", statusAktif: true },
        umum:     { durasi: "60", harga: "100000", hargaCoretEnabled: false, hargaDiskon: "", statusAktif: true },
    });

    const reguler = regulerState[activeTab];
    const setReguler = (updates: Partial<RegulerState>) =>
        setRegulerState((prev) => ({ ...prev, [activeTab]: { ...prev[activeTab], ...updates } }));

    // ── Section B
    const [showHolidaySlideOver, setShowHolidaySlideOver] = useState(false);
    const [holidayPrice, setHolidayPrice] = useState<Record<ActiveTab, string>>({
        warga_ub: "100000",
        umum:     "120000",
    });

    // ── Section C
    const [khususItems, setKhususItems] = useState<Record<ActiveTab, KhususItem[]>>(DUMMY_KHUSUS);
    const [showCreateSlideOver, setShowCreateSlideOver] = useState(false);

    // SlideOver C form state
    const [form, setForm] = useState({
        nama:         "",
        durasi:       "60" as DurasiOption,
        harga:        "",
        scheduleType: "hari" as ScheduleType,
        daySchedules: makeDaySchedules(),
        dateStart:    "",
        dateEnd:      "",
    });

    const resetForm = () =>
        setForm({
            nama: "", durasi: "60", harga: "",
            scheduleType: "hari",
            daySchedules: makeDaySchedules(),
            dateStart: "", dateEnd: "",
        });

    const updateDayField = (
        day: string,
        field: keyof DaySchedule,
        value: boolean | string,
    ) =>
        setForm((prev) => ({
            ...prev,
            daySchedules: {
                ...prev.daySchedules,
                [day]: { ...prev.daySchedules[day], [field]: value },
            },
        }));

    const handleSaveKhusus = () => {
        const enabledDays = DAYS.filter((d) => form.daySchedules[d].enabled);
        const newItem: KhususItem = {
            id:           Date.now(),
            nama:         form.nama || "Harga Khusus Baru",
            harga:        parseInt(form.harga) || 0,
            durasi:       form.durasi,
            scheduleType: form.scheduleType,
            ...(form.scheduleType === "hari"
                ? {
                    days: enabledDays,
                    timeRange: enabledDays.length > 0
                        ? `${form.daySchedules[enabledDays[0]].start}–${form.daySchedules[enabledDays[0]].end}`
                        : undefined,
                  }
                : {
                    dateRange: form.dateStart && form.dateEnd
                        ? `${form.dateStart} – ${form.dateEnd}`
                        : undefined,
                  }),
        };
        setKhususItems((prev) => ({
            ...prev,
            [activeTab]: [...prev[activeTab], newItem],
        }));
        setShowCreateSlideOver(false);
        resetForm();
    };

    const handleDeleteKhusus = (id: number) =>
        setKhususItems((prev) => ({
            ...prev,
            [activeTab]: prev[activeTab].filter((item) => item.id !== id),
        }));

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Link
                            href={route("admin.facilities.index")}
                            className="transition-colors hover:text-gray-600"
                        >
                            Facilities
                        </Link>
                        <span>/</span>
                        <span className="text-gray-600">Lapangan Tennis 1</span>
                        <span>/</span>
                        <span className="font-medium text-gray-900">Harga</span>
                    </div>
                    <h1 className="font-monument text-3xl font-normal tracking-tight text-gray-900">
                        Pengaturan Harga
                    </h1>
                </div>
            }
        >
            <Head title="Pengaturan Harga — Lapangan Tennis 1" />

            <div className="flex flex-col gap-6 pt-6">

                {/* ── Master Pill-Tab ─────────────────────────────────────────── */}
                <div className="flex flex-col gap-2">
                    <p className={labelBase}>Segmen Pelanggan</p>
                    <PillTab
                        options={[
                            { value: "warga_ub", label: "Harga Warga UB" },
                            { value: "umum",     label: "Harga Umum" },
                        ]}
                        active={activeTab}
                        onChange={setActiveTab}
                    />
                    <p className="text-[11px] text-gray-400">
                        Semua konfigurasi di bawah berlaku untuk segmen yang dipilih.
                    </p>
                </div>

                {/* ── Section A: Harga Reguler ────────────────────────────────── */}
                <div className={`${ADMIN_TOKENS.CARD_LARGE} p-6`}>
                    <SectionHeader
                        letter="A"
                        title="Harga Reguler"
                        subtitle="Tarif dasar yang berlaku di luar jadwal khusus"
                        className="mb-6"
                    />

                    <div className="flex flex-col gap-5">
                        {/* Durasi per sesi */}
                        <div>
                            <label className={labelBase}>Durasi Per Sesi</label>
                            <select
                                value={reguler.durasi}
                                onChange={(e) => setReguler({ durasi: e.target.value as DurasiOption })}
                                className={`${inputBase} mt-1.5`}
                            >
                                <option value="60">60 Menit</option>
                                <option value="90">90 Menit</option>
                                <option value="120">120 Menit</option>
                            </select>
                        </div>

                        {/* Harga Sewa */}
                        <div>
                            <label className={labelBase}>Harga Sewa</label>
                            <div className="relative mt-1.5">
                                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                    Rp
                                </span>
                                <input
                                    type="number"
                                    value={reguler.harga}
                                    min="0"
                                    step="1000"
                                    placeholder="0"
                                    onChange={(e) => setReguler({ harga: e.target.value })}
                                    className={`${inputBase} pl-10`}
                                />
                            </div>
                        </div>

                        {/* Toggle: Harga Coret */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Aktifkan Harga Coret (Diskon)
                                    </p>
                                    <p className="mt-0.5 text-[11px] text-gray-400">
                                        Tampilkan harga asli yang dicoret di halaman publik
                                    </p>
                                </div>
                                <ToggleSwitch
                                    enabled={reguler.hargaCoretEnabled}
                                    onChange={(v) => setReguler({ hargaCoretEnabled: v })}
                                />
                            </div>

                            {/* Conditional: Harga Diskon input */}
                            {reguler.hargaCoretEnabled && (
                                <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
                                    <label className={cn(labelBase, "text-amber-600")}>
                                        Harga Setelah Diskon
                                    </label>
                                    <div className="relative mt-1.5">
                                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-amber-400">
                                            Rp
                                        </span>
                                        <input
                                            type="number"
                                            value={reguler.hargaDiskon}
                                            min="0"
                                            step="1000"
                                            placeholder="0"
                                            onChange={(e) => setReguler({ hargaDiskon: e.target.value })}
                                            className="w-full rounded-2xl border-0 bg-white px-4 py-3 pl-10 text-sm text-gray-900 placeholder:text-gray-400 ring-1 ring-inset ring-amber-200 focus:bg-white focus:ring-2 focus:ring-amber-400 transition-colors"
                                        />
                                    </div>
                                    {reguler.harga && reguler.hargaDiskon && (
                                        <p className="mt-2 text-[11px] text-amber-700">
                                            Harga ditampilkan:{" "}
                                            <span className="line-through opacity-60">
                                                {formatPrice(parseInt(reguler.harga) || 0)}
                                            </span>{" "}
                                            →{" "}
                                            <strong>
                                                {formatPrice(parseInt(reguler.hargaDiskon) || 0)}
                                            </strong>
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Toggle: Status Lapangan */}
                        <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-4">
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    Status Lapangan
                                </p>
                                <p className="mt-0.5 text-[11px] text-gray-400">
                                    {reguler.statusAktif
                                        ? "Lapangan terbuka untuk pemesanan"
                                        : "Lapangan ditutup, tidak bisa dipesan"}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span
                                    className={cn(
                                        "text-xs font-semibold transition-colors",
                                        reguler.statusAktif ? "text-green-600" : "text-gray-400",
                                    )}
                                >
                                    {reguler.statusAktif ? "Buka" : "Tutup"}
                                </span>
                                <ToggleSwitch
                                    enabled={reguler.statusAktif}
                                    onChange={(v) => setReguler({ statusAktif: v })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Section B: Harga Libur Nasional ────────────────────────── */}
                <div className={`${ADMIN_TOKENS.CARD_LARGE} p-6`}>
                    <SectionHeader
                        letter="B"
                        title="Harga Libur Nasional"
                        subtitle="Berlaku otomatis saat tanggal terdeteksi sebagai hari libur nasional Indonesia"
                        className="mb-5"
                    />

                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-50">
                                <CalendarDays size={17} className="text-amber-500" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">
                                    {holidayPrice[activeTab]
                                        ? formatPrice(parseInt(holidayPrice[activeTab]) || 0)
                                        : "Belum diatur"}
                                    <span className="ml-1.5 text-[11px] font-normal text-gray-400">
                                        / sesi
                                    </span>
                                </p>
                                <p className="mt-0.5 text-[11px] text-gray-400">
                                    {activeTab === "warga_ub" ? "Warga UB" : "Umum"} · Durasi 60 Menit
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowHolidaySlideOver(true)}
                            className="flex shrink-0 items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-[0_2px_8px_rgb(0,0,0,0.04)] transition-colors hover:bg-gray-50 hover:shadow-none"
                        >
                            <Pencil size={13} />
                            Atur Harga Libur Nasional
                        </button>
                    </div>
                </div>

                {/* ── Section C: Harga Khusus ─────────────────────────────────── */}
                <div className={`${ADMIN_TOKENS.CARD_LARGE} p-6`}>
                    <div className="mb-5 flex items-start justify-between gap-4">
                        <SectionHeader
                            letter="C"
                            title="Harga Khusus"
                            subtitle="Tarif berbasis waktu yang menggantikan harga reguler secara otomatis"
                        />
                        <button
                            type="button"
                            onClick={() => setShowCreateSlideOver(true)}
                            className="flex shrink-0 items-center gap-2 rounded-2xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                        >
                            <Plus size={14} />
                            Tambah Harga Khusus
                        </button>
                    </div>

                    {khususItems[activeTab].length === 0 ? (
                        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-gray-200 py-12">
                            <Tag size={22} className="text-gray-300" />
                            <p className="text-sm text-gray-400">Belum ada harga khusus.</p>
                            <p className="text-[11px] text-gray-300">
                                Klik "Tambah Harga Khusus" untuk memulai.
                            </p>
                        </div>
                    ) : (
                        <ul className="flex flex-col gap-3">
                            {khususItems[activeTab].map((item) => (
                                <li
                                    key={item.id}
                                    className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3.5 transition-colors hover:border-gray-200 hover:bg-white"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-[0_1px_4px_rgb(0,0,0,0.06)]">
                                            <Clock size={15} className="text-gray-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {item.nama}
                                            </p>
                                            <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                                <span className="text-[11px] font-semibold text-gray-700">
                                                    {formatPrice(item.harga)}
                                                </span>
                                                <span className="text-[11px] text-gray-300">·</span>
                                                <span className="text-[11px] text-gray-400">
                                                    {item.durasi} Menit
                                                </span>
                                                {item.timeRange && (
                                                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600 ring-1 ring-inset ring-blue-100">
                                                        {item.timeRange}
                                                    </span>
                                                )}
                                                {item.days && item.days.length > 0 && (
                                                    <span className="text-[10px] text-gray-400">
                                                        {item.days.slice(0, 3).join(", ")}
                                                        {item.days.length > 3
                                                            ? ` +${item.days.length - 3} hari`
                                                            : ""}
                                                    </span>
                                                )}
                                                {item.dateRange && (
                                                    <span className="text-[10px] text-gray-400">
                                                        {item.dateRange}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                                            title="Edit"
                                        >
                                            <Pencil size={13} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteKhusus(item.id)}
                                            className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
                                            title="Hapus"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* ── Save Footer ─────────────────────────────────────────────── */}
                <div className="flex items-center justify-between rounded-3xl border border-gray-100 bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <p className="text-xs text-gray-400">
                        Perubahan hanya berlaku setelah disimpan.
                    </p>
                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            className="rounded-2xl px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            className="rounded-2xl bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                        >
                            Simpan Perubahan
                        </button>
                    </div>
                </div>

            </div>

            {/* ═══════════════════════════════════════════════════════════════
                SlideOver B — Harga Libur Nasional
            ══════════════════════════════════════════════════════════════════ */}
            <SlideOver
                isOpen={showHolidaySlideOver}
                onClose={() => setShowHolidaySlideOver(false)}
                title="Harga Libur Nasional"
                description={`Tarif khusus untuk ${activeTab === "warga_ub" ? "Warga UB" : "Umum"} saat hari libur nasional`}
            >
                {showHolidaySlideOver && (
                    <div className="flex flex-col gap-5">
                        {/* Info banner */}
                        <div className="rounded-2xl bg-amber-50 px-4 py-3.5 ring-1 ring-inset ring-amber-100">
                            <div className="flex items-start gap-2.5">
                                <CalendarDays size={14} className="mt-0.5 shrink-0 text-amber-500" />
                                <p className="text-xs leading-relaxed text-amber-700">
                                    Harga ini aktif secara otomatis pada tanggal-tanggal yang
                                    terdaftar sebagai hari libur nasional. Tidak perlu mengatur
                                    manual setiap tahun.
                                </p>
                            </div>
                        </div>

                        {/* Current price */}
                        <div className="rounded-2xl bg-gray-50 p-4">
                            <p className="mb-3 font-clash text-[11px] font-medium uppercase tracking-wider text-gray-400">
                                Harga Berlaku Saat Ini
                            </p>
                            <dl className="flex flex-col gap-2.5 text-sm">
                                <div className="flex items-center justify-between">
                                    <dt className="text-gray-500">Tarif Libur</dt>
                                    <dd className="font-semibold text-gray-900">
                                        {formatPrice(parseInt(holidayPrice[activeTab]) || 0)}
                                    </dd>
                                </div>
                                <div className="flex items-center justify-between">
                                    <dt className="text-gray-500">Durasi Per Sesi</dt>
                                    <dd className="text-gray-700">60 Menit</dd>
                                </div>
                                <div className="flex items-center justify-between">
                                    <dt className="text-gray-500">Berlaku Untuk</dt>
                                    <dd className="text-gray-700">
                                        {activeTab === "warga_ub" ? "Warga UB" : "Umum"}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {/* Edit input */}
                        <div>
                            <label className={labelBase}>Ubah Harga Libur Nasional</label>
                            <div className="relative mt-1.5">
                                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                    Rp
                                </span>
                                <input
                                    type="number"
                                    value={holidayPrice[activeTab]}
                                    min="0"
                                    step="1000"
                                    onChange={(e) =>
                                        setHolidayPrice((prev) => ({
                                            ...prev,
                                            [activeTab]: e.target.value,
                                        }))
                                    }
                                    className={`${inputBase} pl-10`}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowHolidaySlideOver(false)}
                                className="flex-1 rounded-2xl bg-gray-900 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                            >
                                Simpan Harga
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowHolidaySlideOver(false)}
                                className="rounded-2xl px-5 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                )}
            </SlideOver>

            {/* ═══════════════════════════════════════════════════════════════
                SlideOver C — Buat Harga Khusus
            ══════════════════════════════════════════════════════════════════ */}
            <SlideOver
                isOpen={showCreateSlideOver}
                onClose={() => { setShowCreateSlideOver(false); resetForm(); }}
                title="Buat Harga Khusus"
                description="Tambah tarif berbasis waktu untuk lapangan ini"
            >
                {showCreateSlideOver && (
                    <div className="flex flex-col gap-5">
                        {/* Nama */}
                        <div>
                            <label className={labelBase}>Nama Harga Khusus</label>
                            <input
                                type="text"
                                value={form.nama}
                                placeholder="Contoh: Lapangan Tennis Pagi"
                                onChange={(e) => setForm((p) => ({ ...p, nama: e.target.value }))}
                                className={`${inputBase} mt-1.5`}
                            />
                        </div>

                        {/* Durasi + Harga — 2 col */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={labelBase}>Durasi</label>
                                <select
                                    value={form.durasi}
                                    onChange={(e) =>
                                        setForm((p) => ({ ...p, durasi: e.target.value as DurasiOption }))
                                    }
                                    className={`${inputBase} mt-1.5`}
                                >
                                    <option value="60">60 Menit</option>
                                    <option value="90">90 Menit</option>
                                    <option value="120">120 Menit</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelBase}>Harga Sewa</label>
                                <div className="relative mt-1.5">
                                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                        Rp
                                    </span>
                                    <input
                                        type="number"
                                        value={form.harga}
                                        min="0"
                                        step="1000"
                                        placeholder="0"
                                        onChange={(e) =>
                                            setForm((p) => ({ ...p, harga: e.target.value }))
                                        }
                                        className={`${inputBase} pl-9`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tipe Jadwal */}
                        <div>
                            <label className={labelBase}>Tipe Jadwal</label>
                            <div className="mt-2">
                                <PillTab
                                    options={[
                                        { value: "hari",    label: "Hari Tertentu" },
                                        { value: "tanggal", label: "Tanggal Tertentu" },
                                    ]}
                                    active={form.scheduleType}
                                    onChange={(v) => setForm((p) => ({ ...p, scheduleType: v }))}
                                    size="sm"
                                />
                            </div>
                        </div>

                        {/* ── Hari Tertentu ── */}
                        {form.scheduleType === "hari" && (
                            <div>
                                <label className={labelBase}>Pilih Hari & Jam Berlaku</label>
                                <ul className="mt-2.5 flex flex-col gap-2">
                                    {DAYS.map((day) => {
                                        const sched = form.daySchedules[day];
                                        return (
                                            <li key={day}>
                                                <div
                                                    className={cn(
                                                        "flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors",
                                                        sched.enabled ? "bg-gray-50" : "bg-transparent",
                                                    )}
                                                >
                                                    {/* Custom checkbox */}
                                                    <button
                                                        type="button"
                                                        onClick={() => updateDayField(day, "enabled", !sched.enabled)}
                                                        className={cn(
                                                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all",
                                                            sched.enabled
                                                                ? "border-gray-900 bg-gray-900"
                                                                : "border-gray-200 bg-white hover:border-gray-400",
                                                        )}
                                                        aria-checked={sched.enabled}
                                                        role="checkbox"
                                                    >
                                                        {sched.enabled && (
                                                            <svg viewBox="0 0 10 8" fill="none" className="h-2.5 w-2.5">
                                                                <path
                                                                    d="M1 4L3.5 6.5L9 1"
                                                                    stroke="white"
                                                                    strokeWidth="1.8"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                        )}
                                                    </button>

                                                    {/* Day name */}
                                                    <span
                                                        className={cn(
                                                            "w-12 text-sm transition-colors",
                                                            sched.enabled
                                                                ? "font-medium text-gray-900"
                                                                : "text-gray-400",
                                                        )}
                                                    >
                                                        {day}
                                                    </span>

                                                    {/* Time pickers — only when enabled */}
                                                    {sched.enabled ? (
                                                        <div className="flex flex-1 items-center gap-1.5">
                                                            <input
                                                                type="time"
                                                                value={sched.start}
                                                                onChange={(e) =>
                                                                    updateDayField(day, "start", e.target.value)
                                                                }
                                                                className="flex-1 rounded-xl border-0 bg-white px-2.5 py-2 text-xs text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-gray-900"
                                                            />
                                                            <span className="shrink-0 text-[11px] text-gray-400">
                                                                –
                                                            </span>
                                                            <input
                                                                type="time"
                                                                value={sched.end}
                                                                onChange={(e) =>
                                                                    updateDayField(day, "end", e.target.value)
                                                                }
                                                                className="flex-1 rounded-xl border-0 bg-white px-2.5 py-2 text-xs text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-gray-900"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <span className="flex-1 text-[11px] text-gray-300">
                                                            Klik untuk aktifkan
                                                        </span>
                                                    )}
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}

                        {/* ── Tanggal Tertentu ── */}
                        {form.scheduleType === "tanggal" && (
                            <div>
                                <label className={labelBase}>Rentang Tanggal</label>
                                <div className="mt-2 grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="mb-1 text-[11px] text-gray-400">Dari</p>
                                        <input
                                            type="date"
                                            value={form.dateStart}
                                            onChange={(e) =>
                                                setForm((p) => ({ ...p, dateStart: e.target.value }))
                                            }
                                            className={inputBase}
                                        />
                                    </div>
                                    <div>
                                        <p className="mb-1 text-[11px] text-gray-400">Sampai</p>
                                        <input
                                            type="date"
                                            value={form.dateEnd}
                                            min={form.dateStart}
                                            onChange={(e) =>
                                                setForm((p) => ({ ...p, dateEnd: e.target.value }))
                                            }
                                            className={inputBase}
                                        />
                                    </div>
                                </div>
                                {form.dateStart && form.dateEnd && (
                                    <p className="mt-2 text-[11px] text-gray-400">
                                        Harga berlaku dari{" "}
                                        <strong className="text-gray-700">
                                            {new Date(form.dateStart).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </strong>{" "}
                                        s/d{" "}
                                        <strong className="text-gray-700">
                                            {new Date(form.dateEnd).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </strong>
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleSaveKhusus}
                                className="flex-1 rounded-2xl bg-gray-900 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                            >
                                Simpan Harga
                            </button>
                            <button
                                type="button"
                                onClick={() => { setShowCreateSlideOver(false); resetForm(); }}
                                className="rounded-2xl px-5 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                )}
            </SlideOver>
        </AdminLayout>
    );
}
