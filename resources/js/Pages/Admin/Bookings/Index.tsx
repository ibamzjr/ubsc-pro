import { Head } from "@inertiajs/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Eye,
    LayoutGrid,
    List,
} from "lucide-react";
import { useState } from "react";
import DataTable from "@/Components/Admin/DataTable";
import SlideOver from "@/Components/Admin/SlideOver";
import AdminLayout from "@/Layouts/AdminLayout";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

type BookingStatus = "pending" | "paid" | "cancelled";
type UserCategory = "warga_ub" | "umum";

interface FacilityCol {
    id: string;
    name: string;
}

interface BookingEntry {
    id: string;
    customerName: string;
    phone: string;
    facilityId: string;
    facilityName: string;
    date: string;
    startHour: number;
    startMinute: number;
    durationMinutes: number;
    userCategory: UserCategory;
    status: BookingStatus;
    pricePerHour: number;
    totalPrice: number;
    notes?: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const SLOT_HEIGHT = 44; // px per 30-minute slot
const START_HOUR = 6;
const END_HOUR = 22;
const TOTAL_SLOTS = (END_HOUR - START_HOUR) * 2; // 32 half-hour slots

const FACILITIES: FacilityCol[] = [
    { id: "futsal-a",    name: "Futsal A" },
    { id: "futsal-b",    name: "Futsal B" },
    { id: "basket",      name: "Basket" },
    { id: "tennis-1",    name: "Tennis 1" },
    { id: "badminton-1", name: "Badminton 1" },
    { id: "badminton-2", name: "Badminton 2" },
];

const DUMMY_BOOKINGS: BookingEntry[] = [
    {
        id: "BK001", customerName: "Budi Santoso", phone: "081234567890",
        facilityId: "futsal-a", facilityName: "Futsal A",
        date: "2026-04-28", startHour: 8, startMinute: 0, durationMinutes: 120,
        userCategory: "warga_ub", status: "paid",
        pricePerHour: 75000, totalPrice: 150000,
    },
    {
        id: "BK002", customerName: "Ahmad Fauzi", phone: "082345678901",
        facilityId: "futsal-a", facilityName: "Futsal A",
        date: "2026-04-28", startHour: 13, startMinute: 0, durationMinutes: 60,
        userCategory: "umum", status: "pending",
        pricePerHour: 100000, totalPrice: 100000,
    },
    {
        id: "BK003", customerName: "Dewi Rahayu", phone: "083456789012",
        facilityId: "futsal-b", facilityName: "Futsal B",
        date: "2026-04-28", startHour: 9, startMinute: 0, durationMinutes: 120,
        userCategory: "warga_ub", status: "paid",
        pricePerHour: 75000, totalPrice: 150000,
    },
    {
        id: "BK004", customerName: "Eko Prasetyo", phone: "084567890123",
        facilityId: "basket", facilityName: "Basket",
        date: "2026-04-28", startHour: 14, startMinute: 0, durationMinutes: 120,
        userCategory: "umum", status: "pending",
        pricePerHour: 120000, totalPrice: 240000,
        notes: "Bawa bola sendiri",
    },
    {
        id: "BK005", customerName: "Siti Nurhaliza", phone: "085678901234",
        facilityId: "tennis-1", facilityName: "Tennis 1",
        date: "2026-04-28", startHour: 7, startMinute: 0, durationMinutes: 60,
        userCategory: "warga_ub", status: "paid",
        pricePerHour: 80000, totalPrice: 80000,
    },
    {
        id: "BK006", customerName: "Reza Kurniawan", phone: "086789012345",
        facilityId: "badminton-1", facilityName: "Badminton 1",
        date: "2026-04-28", startHour: 10, startMinute: 0, durationMinutes: 60,
        userCategory: "warga_ub", status: "paid",
        pricePerHour: 50000, totalPrice: 50000,
    },
    {
        id: "BK007", customerName: "Linda Susanti", phone: "087890123456",
        facilityId: "badminton-1", facilityName: "Badminton 1",
        date: "2026-04-28", startHour: 15, startMinute: 0, durationMinutes: 90,
        userCategory: "umum", status: "pending",
        pricePerHour: 60000, totalPrice: 90000,
    },
    {
        id: "BK008", customerName: "Hendra Wijaya", phone: "088901234567",
        facilityId: "badminton-2", facilityName: "Badminton 2",
        date: "2026-04-28", startHour: 8, startMinute: 30, durationMinutes: 90,
        userCategory: "warga_ub", status: "cancelled",
        pricePerHour: 50000, totalPrice: 75000,
    },
    {
        id: "BK009", customerName: "Maya Putri", phone: "089012345678",
        facilityId: "futsal-b", facilityName: "Futsal B",
        date: "2026-04-28", startHour: 16, startMinute: 0, durationMinutes: 120,
        userCategory: "umum", status: "paid",
        pricePerHour: 100000, totalPrice: 200000,
    },
    {
        id: "BK010", customerName: "Fajar Nugroho", phone: "080123456789",
        facilityId: "tennis-1", facilityName: "Tennis 1",
        date: "2026-04-28", startHour: 11, startMinute: 0, durationMinutes: 120,
        userCategory: "warga_ub", status: "pending",
        pricePerHour: 80000, totalPrice: 160000,
    },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function padTwo(n: number): string {
    return String(n).padStart(2, "0");
}

function formatHM(h: number, m: number): string {
    return `${padTwo(h)}:${padTwo(m)}`;
}

function formatEndTime(b: BookingEntry): string {
    const total = b.startHour * 60 + b.startMinute + b.durationMinutes;
    return formatHM(Math.floor(total / 60), total % 60);
}

function formatPrice(amount: number): string {
    return `Rp ${amount.toLocaleString("id-ID")}`;
}

function formatDuration(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (m === 0) return `${h} jam`;
    if (h === 0) return `${m} menit`;
    return `${h} jam ${m} menit`;
}

function formatDateDisplay(dateStr: string): string {
    const [y, mo, d] = dateStr.split("-").map(Number);
    return new Date(y, mo - 1, d).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function shiftDate(dateStr: string, delta: number): string {
    const [y, mo, d] = dateStr.split("-").map(Number);
    const result = new Date(y, mo - 1, d + delta);
    return `${result.getFullYear()}-${padTwo(result.getMonth() + 1)}-${padTwo(result.getDate())}`;
}

function getPillTop(startHour: number, startMinute: number): number {
    return ((startHour - START_HOUR) * 2 + startMinute / 30) * SLOT_HEIGHT;
}

function getPillHeight(durationMinutes: number): number {
    return (durationMinutes / 30) * SLOT_HEIGHT;
}

// ── Status ────────────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<BookingStatus, string> = {
    pending:   "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
    paid:      "bg-green-50 text-green-700 ring-1 ring-inset ring-green-200",
    cancelled: "bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-200",
};

const STATUS_LABEL: Record<BookingStatus, string> = {
    pending:   "Pending",
    paid:      "Paid",
    cancelled: "Cancelled",
};

const STATUS_DOT: Record<BookingStatus, string> = {
    pending:   "bg-amber-400",
    paid:      "bg-green-500",
    cancelled: "bg-gray-400",
};

function StatusBadge({ status }: { status: BookingStatus }) {
    return (
        <span
            className={cn(
                "inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide",
                STATUS_STYLE[status],
            )}
        >
            {STATUS_LABEL[status]}
        </span>
    );
}

// Pill color by user category
const PILL_STYLE: Record<UserCategory, string> = {
    warga_ub: "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100",
    umum:     "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200",
};

// ── Booking Detail Panel ──────────────────────────────────────────────────────

function BookingDetail({
    booking,
    onClose,
}: {
    booking: BookingEntry;
    onClose: () => void;
}) {
    return (
        <div className="flex flex-col gap-5">
            {/* ID + Status */}
            <div className="flex items-center justify-between">
                <span className="font-clash text-xs font-semibold uppercase tracking-widest text-gray-400">
                    {booking.id}
                </span>
                <StatusBadge status={booking.status} />
            </div>

            {/* Customer */}
            <section className="rounded-2xl bg-gray-50 p-4">
                <p className="mb-2.5 font-clash text-[11px] font-medium uppercase tracking-wider text-gray-400">
                    Customer
                </p>
                <p className="font-medium text-gray-900">{booking.customerName}</p>
                <p className="mt-0.5 text-sm text-gray-500">{booking.phone}</p>
                <span
                    className={cn(
                        "mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium",
                        booking.userCategory === "warga_ub"
                            ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200"
                            : "bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-200",
                    )}
                >
                    {booking.userCategory === "warga_ub" ? "Warga UB" : "Umum"}
                </span>
            </section>

            {/* Booking Details */}
            <section className="rounded-2xl bg-gray-50 p-4">
                <p className="mb-2.5 font-clash text-[11px] font-medium uppercase tracking-wider text-gray-400">
                    Detail Booking
                </p>
                <dl className="flex flex-col gap-2.5 text-sm">
                    <div className="flex items-center justify-between">
                        <dt className="text-gray-500">Fasilitas</dt>
                        <dd className="font-medium text-gray-900">{booking.facilityName}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                        <dt className="text-gray-500">Tanggal</dt>
                        <dd className="font-medium text-gray-900">{booking.date}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                        <dt className="text-gray-500">Waktu</dt>
                        <dd className="font-medium text-gray-900">
                            {formatHM(booking.startHour, booking.startMinute)} – {formatEndTime(booking)}
                        </dd>
                    </div>
                    <div className="flex items-center justify-between">
                        <dt className="text-gray-500">Durasi</dt>
                        <dd className="font-medium text-gray-900">{formatDuration(booking.durationMinutes)}</dd>
                    </div>
                    {booking.notes && (
                        <div className="flex items-start justify-between gap-4">
                            <dt className="text-gray-500">Catatan</dt>
                            <dd className="text-right text-gray-700">{booking.notes}</dd>
                        </div>
                    )}
                </dl>
            </section>

            {/* Price Breakdown */}
            <section className="rounded-2xl bg-gray-50 p-4">
                <p className="mb-2.5 font-clash text-[11px] font-medium uppercase tracking-wider text-gray-400">
                    Rincian Harga
                </p>
                <dl className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center justify-between">
                        <dt className="text-gray-500">Tarif per jam</dt>
                        <dd className="text-gray-700">{formatPrice(booking.pricePerHour)}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                        <dt className="text-gray-500">Durasi</dt>
                        <dd className="text-gray-700">{formatDuration(booking.durationMinutes)}</dd>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between border-t border-gray-200 pt-2.5">
                        <dt className="font-semibold text-gray-900">Total</dt>
                        <dd className="font-bold text-gray-900">{formatPrice(booking.totalPrice)}</dd>
                    </div>
                </dl>
            </section>

            {/* Actions */}
            <div className="flex flex-col gap-2.5 pt-1">
                {booking.status === "pending" && (
                    <button
                        type="button"
                        onClick={() =>
                            alert(
                                `[PLACEHOLDER]\nKonfirmasi pembayaran untuk ${booking.id}.\nFitur ini akan tersedia setelah backend booking diimplementasikan.`,
                            )
                        }
                        className="flex items-center justify-center rounded-2xl bg-green-600 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700"
                    >
                        Konfirmasi Pembayaran
                    </button>
                )}
                {booking.status !== "cancelled" && (
                    <button
                        type="button"
                        onClick={() =>
                            alert(
                                `[PLACEHOLDER]\nBatalkan booking ${booking.id}.\nFitur ini akan tersedia setelah backend booking diimplementasikan.`,
                            )
                        }
                        className="flex items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 py-3 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-100"
                    >
                        Batalkan Booking
                    </button>
                )}
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-2xl py-3 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100"
                >
                    Tutup
                </button>
            </div>
        </div>
    );
}

// ── Grid View ─────────────────────────────────────────────────────────────────

function GridView({ onSelect }: { onSelect: (b: BookingEntry) => void }) {
    const [dateStr, setDateStr] = useState("2026-04-28");

    const timeSlots = Array.from({ length: TOTAL_SLOTS }, (_, i) => {
        const totalMin = START_HOUR * 60 + i * 30;
        return formatHM(Math.floor(totalMin / 60), totalMin % 60);
    });

    return (
        <div className="flex flex-col gap-4">
            {/* Date navigation */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setDateStr((d) => shiftDate(d, -1))}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2">
                        <CalendarDays size={14} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                            {formatDateDisplay(dateStr)}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setDateStr((d) => shiftDate(d, 1))}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
                <button
                    type="button"
                    onClick={() => setDateStr("2026-04-28")}
                    className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                >
                    Reset Demo
                </button>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                    <span className="h-3 w-4 rounded-sm bg-blue-50 border border-blue-200" />
                    Warga UB
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-3 w-4 rounded-sm bg-gray-100 border border-gray-200" />
                    Umum
                </span>
                <span className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        Paid
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-amber-400" />
                        Pending
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-gray-400" />
                        Cancelled
                    </span>
                </span>
            </div>

            {/* Calendar Grid */}
            <div
                className="overflow-auto rounded-2xl border border-gray-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                style={{ maxHeight: "calc(100vh - 340px)" }}
            >
                <div
                    className="flex"
                    style={{ minWidth: `${64 + FACILITIES.length * 152}px` }}
                >
                    {/* ── Time column ── */}
                    <div className="w-16 flex-shrink-0 bg-white" style={{ minWidth: 64 }}>
                        {/* Corner cell */}
                        <div className="sticky top-0 z-30 h-12 border-b border-r border-gray-100 bg-white" />
                        {/* Time labels */}
                        {timeSlots.map((slot, i) => (
                            <div
                                key={i}
                                style={{ height: SLOT_HEIGHT }}
                                className={cn(
                                    "flex items-start justify-end border-r pr-2 pt-1",
                                    i % 2 === 0
                                        ? "border-b border-gray-200"
                                        : "border-b border-gray-100",
                                )}
                            >
                                {i % 2 === 0 && (
                                    <span className="text-[10px] font-medium text-gray-400">
                                        {slot}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* ── Facility columns ── */}
                    {FACILITIES.map((facility) => {
                        const facilityBookings = DUMMY_BOOKINGS.filter(
                            (b) => b.facilityId === facility.id,
                        );
                        return (
                            <div
                                key={facility.id}
                                className="flex flex-1 flex-col"
                                style={{ minWidth: 152 }}
                            >
                                {/* Sticky facility header */}
                                <div className="sticky top-0 z-20 flex h-12 items-center justify-center border-b border-l border-gray-100 bg-white px-2">
                                    <span className="text-center text-xs font-medium text-gray-700">
                                        {facility.name}
                                    </span>
                                </div>

                                {/* Column body */}
                                <div className="relative flex-1 border-l border-gray-100">
                                    {/* Background grid lines */}
                                    {timeSlots.map((_, i) => (
                                        <div
                                            key={i}
                                            style={{ height: SLOT_HEIGHT }}
                                            className={
                                                i % 2 === 0
                                                    ? "border-b border-gray-200"
                                                    : "border-b border-gray-100"
                                            }
                                        />
                                    ))}

                                    {/* Booking pills */}
                                    {facilityBookings.map((booking) => {
                                        const top = getPillTop(
                                            booking.startHour,
                                            booking.startMinute,
                                        );
                                        const height = getPillHeight(
                                            booking.durationMinutes,
                                        );
                                        const isCancelled =
                                            booking.status === "cancelled";

                                        return (
                                            <button
                                                key={booking.id}
                                                type="button"
                                                onClick={() => onSelect(booking)}
                                                style={{
                                                    position: "absolute",
                                                    top: top + 2,
                                                    height: height - 4,
                                                    left: 5,
                                                    right: 5,
                                                    zIndex: 10,
                                                }}
                                                className={cn(
                                                    "group flex flex-col items-start overflow-hidden rounded-xl border px-2 py-1.5 text-left transition-all hover:shadow-md hover:z-20",
                                                    isCancelled
                                                        ? "border-gray-200 bg-gray-100 text-gray-400 opacity-50"
                                                        : PILL_STYLE[
                                                              booking.userCategory
                                                          ],
                                                )}
                                            >
                                                {/* Status dot */}
                                                <span
                                                    className={cn(
                                                        "absolute right-1.5 top-1.5 h-2 w-2 rounded-full ring-1 ring-white",
                                                        STATUS_DOT[booking.status],
                                                    )}
                                                />
                                                <p className="w-full truncate pr-3 text-[11px] font-semibold leading-tight">
                                                    {booking.customerName}
                                                </p>
                                                {height >= 72 && (
                                                    <p className="truncate text-[10px] opacity-70">
                                                        {formatHM(
                                                            booking.startHour,
                                                            booking.startMinute,
                                                        )}
                                                        –{formatEndTime(booking)}
                                                    </p>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ── List View ─────────────────────────────────────────────────────────────────

const listHelper = createColumnHelper<BookingEntry>();

function ListView({ onSelect }: { onSelect: (b: BookingEntry) => void }) {
    const columns = [
        listHelper.accessor("id", {
            header: "Booking ID",
            cell: (info) => (
                <span className="font-mono text-xs font-semibold text-gray-700">
                    {info.getValue()}
                </span>
            ),
        }),
        listHelper.accessor("customerName", {
            header: "Customer",
            enableSorting: true,
            cell: (info) => {
                const b = info.row.original;
                return (
                    <div>
                        <p className="font-medium text-sm text-gray-900">
                            {b.customerName}
                        </p>
                        <p className="text-[11px] text-gray-400">{b.phone}</p>
                    </div>
                );
            },
        }),
        listHelper.accessor("facilityName", {
            header: "Fasilitas",
            enableSorting: true,
            cell: (info) => (
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                    {info.getValue()}
                </span>
            ),
        }),
        listHelper.display({
            id: "datetime",
            header: "Tanggal & Waktu",
            cell: ({ row }) => {
                const b = row.original;
                return (
                    <div>
                        <p className="text-sm text-gray-700">{b.date}</p>
                        <p className="text-[11px] text-gray-400">
                            {formatHM(b.startHour, b.startMinute)} –{" "}
                            {formatEndTime(b)} · {formatDuration(b.durationMinutes)}
                        </p>
                    </div>
                );
            },
        }),
        listHelper.accessor("totalPrice", {
            header: "Total",
            enableSorting: true,
            cell: (info) => (
                <span className="text-sm font-semibold text-gray-900">
                    {formatPrice(info.getValue())}
                </span>
            ),
        }),
        listHelper.accessor("status", {
            header: "Status",
            cell: (info) => <StatusBadge status={info.getValue()} />,
        }),
        listHelper.display({
            id: "actions",
            header: "",
            cell: ({ row }) => (
                <button
                    type="button"
                    onClick={() => onSelect(row.original)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                    title="Lihat detail"
                >
                    <Eye size={13} />
                </button>
            ),
        }),
    ];

    return (
        <DataTable
            columns={columns as ColumnDef<BookingEntry, unknown>[]}
            data={DUMMY_BOOKINGS}
            searchColumn="customerName"
            searchPlaceholder="Cari nama pelanggan…"
            emptyMessage="Belum ada booking."
        />
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

type ViewMode = "grid" | "list";

export default function BookingsIndex() {
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [selected, setSelected] = useState<BookingEntry | null>(null);

    const pendingCount  = DUMMY_BOOKINGS.filter((b) => b.status === "pending").length;
    const paidCount     = DUMMY_BOOKINGS.filter((b) => b.status === "paid").length;
    const cancelledCount = DUMMY_BOOKINGS.filter((b) => b.status === "cancelled").length;

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4">
                    <span className="font-clash text-xs uppercase tracking-[0.2em] text-gray-400">
                        Manajemen Reservasi
                    </span>
                    <h1 className="font-monument text-3xl font-normal tracking-tight text-gray-900">
                        Bookings
                    </h1>
                </div>
            }
        >
            <Head title="Bookings" />

            <div className="flex flex-col gap-5 pt-6">
                {/* Stats row + view toggle */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 ring-1 ring-inset ring-amber-200">
                            {pendingCount} pending
                        </span>
                        <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-200">
                            {paidCount} paid
                        </span>
                        {cancelledCount > 0 && (
                            <span className="rounded-full bg-rose-50 px-3 py-1 text-sm font-medium text-rose-600 ring-1 ring-inset ring-rose-200">
                                {cancelledCount} cancelled
                            </span>
                        )}
                        <span className="text-sm text-gray-500">
                            {DUMMY_BOOKINGS.length} total
                        </span>
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-500">
                            UI Placeholder · Demo Data
                        </span>
                    </div>

                    {/* Pill toggle */}
                    <div className="flex items-center rounded-2xl bg-gray-100 p-1">
                        <button
                            type="button"
                            onClick={() => setViewMode("grid")}
                            className={cn(
                                "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all",
                                viewMode === "grid"
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700",
                            )}
                        >
                            <LayoutGrid size={14} />
                            Grid View
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode("list")}
                            className={cn(
                                "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all",
                                viewMode === "list"
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700",
                            )}
                        >
                            <List size={14} />
                            List View
                        </button>
                    </div>
                </div>

                {/* View content */}
                {viewMode === "grid" ? (
                    <GridView onSelect={setSelected} />
                ) : (
                    <ListView onSelect={setSelected} />
                )}
            </div>

            {/* Detail SlideOver */}
            <SlideOver
                isOpen={selected !== null}
                onClose={() => setSelected(null)}
                title="Detail Booking"
                description={
                    selected
                        ? `${selected.facilityName} · ${formatHM(selected.startHour, selected.startMinute)}–${formatEndTime(selected)}`
                        : undefined
                }
            >
                {selected && (
                    <BookingDetail
                        booking={selected}
                        onClose={() => setSelected(null)}
                    />
                )}
            </SlideOver>
        </AdminLayout>
    );
}
