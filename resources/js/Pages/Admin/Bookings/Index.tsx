import { Head, router, useForm, usePage } from "@inertiajs/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Eye,
    LayoutGrid,
    List,
    Plus,
} from "lucide-react";
import { useState } from "react";
import DataTable from "@/Components/Admin/DataTable";
import SlideOver from "@/Components/Admin/SlideOver";
import AdminLayout from "@/Layouts/AdminLayout";
import { cn } from "@/lib/utils";
import type {
    AdminBooking,
    BookingStatus,
    BookingTransaction,
    PageProps,
    PaymentStatus,
    UserCategory,
} from "@/types";

// ── Page props ────────────────────────────────────────────────────────────────

interface FacilityOption {
    id: number;
    name: string;
}

type Props = PageProps<{
    bookings: AdminBooking[];
    facilities: FacilityOption[];
}>;

// ── Calendar constants ────────────────────────────────────────────────────────

const SLOT_HEIGHT = 44; // px per 30-minute slot
const START_HOUR  = 6;
const END_HOUR    = 22;
const TOTAL_SLOTS = (END_HOUR - START_HOUR) * 2;

// ── Helpers ───────────────────────────────────────────────────────────────────

function padTwo(n: number): string {
    return String(n).padStart(2, "0");
}

function formatHM(h: number, m: number): string {
    return `${padTwo(h)}:${padTwo(m)}`;
}

function parseTimeHM(timeStr: string): { h: number; m: number } {
    const parts = timeStr.split(":").map(Number);
    return { h: parts[0] ?? 0, m: parts[1] ?? 0 };
}

function getDurationMinutes(startTime: string, endTime: string): number {
    const { h: sh, m: sm } = parseTimeHM(startTime);
    const { h: eh, m: em } = parseTimeHM(endTime);
    return (eh * 60 + em) - (sh * 60 + sm);
}

function getPillTopFromTime(startTime: string): number {
    const { h, m } = parseTimeHM(startTime);
    return ((h - START_HOUR) * 2 + m / 30) * SLOT_HEIGHT;
}

function getPillHeight(durationMinutes: number): number {
    return (durationMinutes / 30) * SLOT_HEIGHT;
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
    return new Date(y, (mo ?? 1) - 1, d).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function shiftDate(dateStr: string, delta: number): string {
    const [y, mo, d] = dateStr.split("-").map(Number);
    const result = new Date(y, (mo ?? 1) - 1, (d ?? 1) + delta);
    return `${result.getFullYear()}-${padTwo(result.getMonth() + 1)}-${padTwo(result.getDate())}`;
}

function todayStr(): string {
    const now = new Date();
    return `${now.getFullYear()}-${padTwo(now.getMonth() + 1)}-${padTwo(now.getDate())}`;
}

// ── Status maps (Visual Refined) ──────────────────────────────────────────────

const STATUS_STYLE: Record<BookingStatus, string> = {
    pending:   "bg-orange-50 text-orange-700 border border-orange-200",
    confirmed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    completed: "bg-blue-50 text-blue-700 border border-blue-200",
    cancelled: "bg-slate-50 text-slate-500 border border-slate-200",
};

const STATUS_LABEL: Record<BookingStatus, string> = {
    pending:   "Pending",
    confirmed: "Konfirmasi",
    completed: "Selesai",
    cancelled: "Dibatalkan",
};

const STATUS_DOT: Record<BookingStatus, string> = {
    pending:   "bg-orange-400 shadow-[0_0_5px_rgba(251,146,60,0.8)]",
    confirmed: "bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]",
    completed: "bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.8)]",
    cancelled: "bg-slate-300",
};

const PAYMENT_STATUS_STYLE: Record<PaymentStatus, string> = {
    UNPAID:  "bg-orange-50 text-orange-700 border border-orange-200",
    PAID:    "bg-emerald-50 text-emerald-700 border border-emerald-200",
    EXPIRED: "bg-rose-50 text-rose-600 border border-rose-200",
    FAILED:  "bg-red-50 text-red-600 border border-red-200",
};

const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
    UNPAID:  "Belum Bayar",
    PAID:    "Lunas",
    EXPIRED: "Expired",
    FAILED:  "Gagal",
};

// Pill color per user category (calendar grid)
const PILL_STYLE: Record<UserCategory, string> = {
    warga_ub: "bg-blue-50/90 backdrop-blur-sm border-blue-200/60 text-blue-800 hover:bg-blue-100",
    umum:     "bg-slate-50/90 backdrop-blur-sm border-slate-200/60 text-slate-700 hover:bg-slate-100",
};

// ── Badges ────────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: BookingStatus }) {
    return (
        <span
            className={cn(
                "inline-flex rounded-md px-2.5 py-1 font-bdo text-[10px] font-bold uppercase tracking-widest",
                STATUS_STYLE[status],
            )}
        >
            {STATUS_LABEL[status]}
        </span>
    );
}

function PaymentBadge({ tx }: { tx: BookingTransaction | null }) {
    if (!tx) return null;
    return (
        <span
            className={cn(
                "inline-flex rounded-md px-2.5 py-1 font-bdo text-[10px] font-bold uppercase tracking-widest",
                PAYMENT_STATUS_STYLE[tx.payment_status],
            )}
        >
            {PAYMENT_STATUS_LABEL[tx.payment_status]}
        </span>
    );
}

// ── Base Forms Styling ────────────────────────────────────────────────────────

const inputBase =
    "w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-bdo text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 transition-all";
const labelBase =
    "font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block";

// ── Create Booking Form ───────────────────────────────────────────────────────

function CreateBookingForm({
    facilities,
    onClose,
}: {
    facilities: FacilityOption[];
    onClose: () => void;
}) {
    const { data, setData, post, processing, errors } = useForm({
        customer_name: "",
        facility_id:   "",
        booking_date:  todayStr(),
        start_time:    "08:00",
        end_time:      "10:00",
        notes:         "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.bookings.store"), { onSuccess: onClose });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-5 animate-fade-in-up">
            <div>
                <label className={labelBase}>Nama Pelanggan</label>
                <input
                    type="text"
                    value={data.customer_name}
                    onChange={(e) => setData("customer_name", e.target.value)}
                    placeholder="Nama lengkap pelanggan…"
                    className={inputBase}
                    required
                />
                {errors.customer_name && <p className="mt-1.5 text-[11px] font-bdo text-rose-500">{errors.customer_name}</p>}
            </div>

            <div>
                <label className={labelBase}>Fasilitas</label>
                <select
                    value={data.facility_id}
                    onChange={(e) => setData("facility_id", e.target.value)}
                    className={inputBase}
                >
                    <option value="">Pilih fasilitas…</option>
                    {facilities.map((f) => (
                        <option key={f.id} value={f.id}>
                            {f.name}
                        </option>
                    ))}
                </select>
                {errors.facility_id && <p className="mt-1.5 text-[11px] font-bdo text-rose-500">{errors.facility_id}</p>}
            </div>

            <div>
                <label className={labelBase}>Tanggal</label>
                <input
                    type="date"
                    value={data.booking_date}
                    min={todayStr()}
                    onChange={(e) => setData("booking_date", e.target.value)}
                    className={inputBase}
                />
                {errors.booking_date && <p className="mt-1.5 text-[11px] font-bdo text-rose-500">{errors.booking_date}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelBase}>Jam Mulai</label>
                    <input
                        type="time"
                        value={data.start_time}
                        step="1800"
                        onChange={(e) => setData("start_time", e.target.value)}
                        className={inputBase}
                    />
                    {errors.start_time && <p className="mt-1.5 text-[11px] font-bdo text-rose-500">{errors.start_time}</p>}
                </div>
                <div>
                    <label className={labelBase}>Jam Selesai</label>
                    <input
                        type="time"
                        value={data.end_time}
                        step="1800"
                        onChange={(e) => setData("end_time", e.target.value)}
                        className={inputBase}
                    />
                    {errors.end_time && <p className="mt-1.5 text-[11px] font-bdo text-rose-500">{errors.end_time}</p>}
                </div>
            </div>

            <div>
                <label className={labelBase}>Catatan (opsional)</label>
                <textarea
                    value={data.notes}
                    onChange={(e) => setData("notes", e.target.value)}
                    rows={3}
                    placeholder="Informasi tambahan…"
                    className={cn(inputBase, "resize-none")}
                />
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 rounded-xl px-5 py-3 text-sm font-clash font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="flex-[2] rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 py-3 text-sm font-clash font-medium text-white transition-all shadow-[inset_0_-8px_15px_-5px_rgba(249,115,22,0.4)] hover:bg-slate-900 hover:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                    {processing ? "Menyimpan…" : "Buat Booking"}
                </button>
            </div>
        </form>
    );
}

// ── Booking Detail Panel ──────────────────────────────────────────────────────

function BookingDetail({
    booking,
    onClose,
}: {
    booking: AdminBooking;
    onClose: () => void;
}) {
    const handleUpdateStatus = (status: BookingStatus) => {
        router.patch(
            route("admin.bookings.update", booking.id),
            { status },
            { onSuccess: onClose },
        );
    };

    const handleCancel = () => {
        if (!confirm(`Batalkan booking #${booking.id}?`)) return;
        router.delete(route("admin.bookings.destroy", booking.id), {
            onSuccess: onClose,
        });
    };

    const duration = getDurationMinutes(booking.start_time, booking.end_time);

    return (
        <div className="flex flex-col gap-5 animate-fade-in-up">
            {/* ID + Booking Status */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bdo text-xs font-bold uppercase tracking-widest text-slate-400">
                    ID: #{String(booking.id).padStart(5, "0")}
                </span>
                <StatusBadge status={booking.status} />
            </div>

            {/* Customer Card */}
            <section className="rounded-[20px] bg-slate-50/50 border border-slate-100 p-5 hover:border-orange-100/50 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                    <div className="bg-[#12131c] p-2 rounded-lg shadow-sm">
                        <Eye className="w-4 h-4 text-orange-400" />
                    </div>
                    <p className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Customer
                    </p>
                </div>
                <div className="pl-1">
                    <p className="font-clash text-lg font-medium text-slate-900">{booking.customer_name}</p>
                    {booking.customer_phone && (
                        <p className="mt-0.5 font-bdo text-sm text-slate-500">{booking.customer_phone}</p>
                    )}
                    <span
                        className={cn(
                            "mt-3 inline-flex rounded-md px-2.5 py-1 text-[10px] font-bdo font-bold tracking-widest uppercase",
                            booking.user_category === "warga_ub"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : "bg-slate-100 text-slate-600 border border-slate-200",
                        )}
                    >
                        {booking.user_category === "warga_ub" ? "Warga UB" : "Umum"}
                    </span>
                </div>
            </section>

            {/* Booking Details Card */}
            <section className="rounded-[20px] bg-slate-50/50 border border-slate-100 p-5 hover:border-orange-100/50 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-orange-100 p-2 rounded-lg shadow-sm">
                        <LayoutGrid className="w-4 h-4 text-orange-600" />
                    </div>
                    <p className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Detail Reservasi
                    </p>
                </div>
                <dl className="flex flex-col gap-3 font-bdo text-sm pl-1">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/50">
                        <dt className="text-slate-500">Fasilitas</dt>
                        <dd className="font-semibold text-slate-900">{booking.facility_name}</dd>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/50">
                        <dt className="text-slate-500">Tanggal</dt>
                        <dd className="font-medium text-slate-900">
                            {formatDateDisplay(booking.booking_date)}
                        </dd>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/50">
                        <dt className="text-slate-500">Waktu</dt>
                        <dd className="font-medium text-slate-900">
                            {booking.start_time} – {booking.end_time}
                        </dd>
                    </div>
                    <div className="flex items-center justify-between">
                        <dt className="text-slate-500">Durasi</dt>
                        <dd className="font-medium text-slate-900">{formatDuration(duration)}</dd>
                    </div>
                    {booking.notes && (
                        <div className="flex items-start justify-between gap-4 pt-2 mt-1 border-t border-slate-200/50">
                            <dt className="shrink-0 text-slate-500">Catatan</dt>
                            <dd className="text-right text-slate-700 italic">"{booking.notes}"</dd>
                        </div>
                    )}
                </dl>
            </section>

            {/* Payment Card */}
            <section className="rounded-[20px] bg-slate-50/50 border border-slate-100 p-5 hover:border-orange-100/50 transition-colors">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-100 p-2 rounded-lg shadow-sm">
                            <List className="w-4 h-4 text-emerald-600" />
                        </div>
                        <p className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Pembayaran
                        </p>
                    </div>
                    <PaymentBadge tx={booking.transaction} />
                </div>
                <dl className="flex flex-col gap-2 font-bdo text-sm pl-1">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/50">
                        <dt className="text-slate-500">Subtotal</dt>
                        <dd className="font-clash text-lg font-semibold text-slate-900">
                            {formatPrice(booking.subtotal_price)}
                        </dd>
                    </div>
                    {booking.transaction?.paid_at && (
                        <div className="flex items-center justify-between pt-1">
                            <dt className="text-slate-500">Waktu Bayar</dt>
                            <dd className="text-slate-700 font-medium">{booking.transaction.paid_at}</dd>
                        </div>
                    )}
                </dl>
            </section>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 mt-2">
                {booking.transaction?.payment_status === "UNPAID" && (
                    <button
                        type="button"
                        onClick={() =>
                            router.post(
                                route("admin.transactions.simulate-pay", booking.transaction!.id),
                                {},
                                { onSuccess: onClose },
                            )
                        }
                        className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-sm font-clash font-medium text-white transition-all shadow-[inset_0_-8px_15px_-5px_rgba(16,185,129,0.4)] hover:bg-emerald-600 hover:scale-[0.98]"
                    >
                        Simulasi Bayar
                    </button>
                )}
                {booking.status === "pending" && (
                    <button
                        type="button"
                        onClick={() => handleUpdateStatus("confirmed")}
                        className="flex items-center justify-center rounded-xl bg-[#12131c] py-3.5 text-sm font-clash font-medium text-white transition-all shadow-[inset_0_-8px_15px_-5px_rgba(249,115,22,0.4)] hover:bg-slate-900 hover:scale-[0.98]"
                    >
                        Konfirmasi Booking
                    </button>
                )}
                {booking.status === "confirmed" && (
                    <button
                        type="button"
                        onClick={() => handleUpdateStatus("completed")}
                        className="flex items-center justify-center rounded-xl bg-blue-500 py-3.5 text-sm font-clash font-medium text-white transition-all shadow-[inset_0_-8px_15px_-5px_rgba(59,130,246,0.4)] hover:bg-blue-600 hover:scale-[0.98]"
                    >
                        Tandai Selesai
                    </button>
                )}
                {booking.status !== "cancelled" && booking.status !== "completed" && (
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50 py-3.5 text-sm font-clash font-medium text-rose-600 transition-colors hover:bg-rose-100"
                    >
                        Batalkan Booking
                    </button>
                )}
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl py-3 text-sm font-bdo font-medium text-slate-500 transition-colors hover:bg-slate-100"
                >
                    Tutup Panel
                </button>
            </div>
        </div>
    );
}

// ── Grid View (Visual Refined) ────────────────────────────────────────────────

function GridView({
    bookings,
    facilities,
    onSelect,
}: {
    bookings: AdminBooking[];
    facilities: FacilityOption[];
    onSelect: (b: AdminBooking) => void;
}) {
    const [dateStr, setDateStr] = useState(todayStr());

    const timeSlots = Array.from({ length: TOTAL_SLOTS }, (_, i) => {
        const totalMin = START_HOUR * 60 + i * 30;
        return formatHM(Math.floor(totalMin / 60), totalMin % 60);
    });

    const dayBookings = bookings.filter((b) => b.booking_date === dateStr);

    return (
        <div className="flex flex-col gap-5 animate-fade-in-up delay-200">
            {/* Date navigation & Legend */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-[20px] shadow-sm border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
                    <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                        <button
                            type="button"
                            onClick={() => setDateStr((d) => shiftDate(d, -1))}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-100 hover:scale-105"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <div className="flex items-center gap-2.5 px-4 py-2">
                            <CalendarDays size={16} className="text-orange-500" />
                            <span className="font-clash text-sm font-medium text-slate-900">
                                {formatDateDisplay(dateStr)}
                            </span>
                            
                        </div>
                        <button
                            type="button"
                            onClick={() => setDateStr((d) => shiftDate(d, 1))}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-100 hover:scale-105"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={() => setDateStr(todayStr())}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-bdo text-[13px] font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-orange-600 uppercase tracking-wide"
                    >
                        Hari ini
                    </button>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100">
                    <span className="flex items-center gap-2">
                        <span className="h-3.5 w-4 rounded-sm border border-blue-200 bg-blue-50" />
                        Warga UB
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="h-3.5 w-4 rounded-sm border border-slate-200 bg-slate-100" />
                        Umum
                    </span>
                    <div className="w-[1px] h-4 bg-slate-300 mx-1 hidden sm:block"></div>
                    <span className="flex items-center gap-3">
                        {(["confirmed", "pending", "completed", "cancelled"] as BookingStatus[]).map(
                            (s) => (
                                <span key={s} className="flex items-center gap-1.5">
                                    <span className={cn("h-2.5 w-2.5 rounded-full", STATUS_DOT[s])} />
                                    {STATUS_LABEL[s]}
                                </span>
                            ),
                        )}
                    </span>
                </div>
            </div>

            {/* Calendar Grid Container */}
            <div
                className="overflow-auto rounded-[24px] border border-slate-200 bg-white shadow-sm custom-scrollbar"
                style={{ maxHeight: "calc(100vh - 340px)" }}
            >
                <div
                    className="flex"
                    style={{ minWidth: `${64 + facilities.length * 152}px` }}
                >
                    {/* Time column */}
                    <div className="w-16 shrink-0 bg-slate-50 border-r border-slate-200">
                        <div className="sticky top-0 z-30 h-14 border-b border-slate-200 bg-slate-50 backdrop-blur-md" />
                        {timeSlots.map((slot, i) => (
                            <div
                                key={i}
                                style={{ height: SLOT_HEIGHT }}
                                className={cn(
                                    "flex items-start justify-end pr-3 pt-1.5",
                                    i % 2 === 0
                                        ? "border-b border-slate-200"
                                        : "border-b border-slate-100 border-dashed",
                                )}
                            >
                                {i % 2 === 0 && (
                                    <span className="font-bdo text-[11px] font-bold text-slate-400">
                                        {slot}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Facility columns */}
                    {facilities.map((facility) => {
                        const facilityBookings = dayBookings.filter(
                            (b) => b.facility_id === facility.id,
                        );
                        return (
                            <div
                                key={facility.id}
                                className="flex flex-1 flex-col"
                                style={{ minWidth: 152 }}
                            >
                                <div className="sticky top-0 z-20 flex h-14 items-center justify-center border-b border-slate-200 bg-white/90 backdrop-blur-md px-2 shadow-[0_4px_10px_-10px_rgba(0,0,0,0.1)]">
                                    <span className="text-center font-clash text-[13px] font-medium text-slate-800">
                                        {facility.name}
                                    </span>
                                </div>
                                <div className="relative flex-1 border-r border-slate-100 last:border-r-0">
                                    {timeSlots.map((_, i) => (
                                        <div
                                            key={i}
                                            style={{ height: SLOT_HEIGHT }}
                                            className={
                                                i % 2 === 0
                                                    ? "border-b border-slate-200"
                                                    : "border-b border-slate-100 border-dashed"
                                            }
                                        />
                                    ))}
                                    {facilityBookings.map((booking) => {
                                        const top      = getPillTopFromTime(booking.start_time);
                                        const duration = getDurationMinutes(booking.start_time, booking.end_time);
                                        const height   = getPillHeight(duration);
                                        const isCancelled = booking.status === "cancelled";

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
                                                    "group flex flex-col items-start overflow-hidden rounded-xl border px-2.5 py-2 text-left transition-all hover:z-20 hover:shadow-lg hover:-translate-y-0.5",
                                                    isCancelled
                                                        ? "border-slate-200 bg-slate-50 text-slate-400 opacity-60"
                                                        : PILL_STYLE[booking.user_category],
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        "absolute right-2 top-2 h-2.5 w-2.5 rounded-full ring-2 ring-white shadow-sm",
                                                        STATUS_DOT[booking.status],
                                                    )}
                                                />
                                                <p className="w-full truncate pr-4 font-clash text-[13px] font-medium leading-tight">
                                                    {booking.customer_name}
                                                </p>
                                                {height >= 72 && (
                                                    <p className="mt-1 font-bdo truncate text-[10px] font-semibold opacity-70">
                                                        {booking.start_time}–{booking.end_time}
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

// ── List View (Visual Refined) ────────────────────────────────────────────────

const listHelper = createColumnHelper<AdminBooking>();

function ListView({
    bookings,
    onSelect,
}: {
    bookings: AdminBooking[];
    onSelect: (b: AdminBooking) => void;
}) {
    const columns = [
        listHelper.accessor("id", {
            header: "Booking ID",
            cell: (info) => (
                <span className="font-bdo text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                    #{String(info.getValue()).padStart(5, "0")}
                </span>
            ),
        }),
        listHelper.accessor("customer_name", {
            header: "Customer",
            enableSorting: true,
            cell: (info) => {
                const b = info.row.original;
                return (
                    <div className="flex flex-col">
                        <p className="font-clash text-sm font-medium text-slate-900">{b.customer_name}</p>
                        <p className="font-bdo text-[11px] font-medium text-slate-400">
                            {b.customer_phone ?? "—"}
                        </p>
                    </div>
                );
            },
        }),
        listHelper.accessor("facility_name", {
            header: "Fasilitas",
            enableSorting: true,
            cell: (info) => (
                <span className="rounded-lg bg-orange-50 border border-orange-100 px-2.5 py-1 font-bdo text-[11px] font-bold text-orange-600">
                    {info.getValue()}
                </span>
            ),
        }),
        listHelper.display({
            id: "datetime",
            header: "Tanggal & Waktu",
            cell: ({ row }) => {
                const b = row.original;
                const duration = getDurationMinutes(b.start_time, b.end_time);
                return (
                    <div className="flex flex-col">
                        <p className="font-bdo text-[13px] font-bold text-slate-700">{b.booking_date}</p>
                        <p className="font-bdo text-[11px] font-medium text-slate-500">
                            {b.start_time}–{b.end_time} · {formatDuration(duration)}
                        </p>
                    </div>
                );
            },
        }),
        listHelper.accessor("subtotal_price", {
            header: "Total",
            enableSorting: true,
            cell: (info) => (
                <span className="font-clash text-[15px] font-medium text-slate-900">
                    {formatPrice(info.getValue())}
                </span>
            ),
        }),
        listHelper.accessor("status", {
            header: "Booking",
            cell: (info) => <StatusBadge status={info.getValue()} />,
        }),
        listHelper.display({
            id: "payment",
            header: "Bayar",
            cell: ({ row }) => <PaymentBadge tx={row.original.transaction} />,
        }),
        listHelper.display({
            id: "actions",
            header: "",
            cell: ({ row }) => (
                <button
                    type="button"
                    onClick={() => onSelect(row.original)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-400 border border-slate-200 transition-all hover:bg-orange-500 hover:border-orange-500 hover:text-white hover:shadow-md"
                    title="Lihat detail"
                >
                    <Eye size={16} />
                </button>
            ),
        }),
    ];

    return (
        <div className="animate-fade-in-up delay-200 bg-white rounded-[24px] p-2 shadow-sm border border-slate-200 overflow-hidden">
            <DataTable
                columns={columns as ColumnDef<AdminBooking, unknown>[]}
                data={bookings}
                searchColumn="customer_name"
                searchPlaceholder="Cari nama pelanggan…"
                emptyMessage="Belum ada booking."
            />
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

type ViewMode = "grid" | "list";

export default function BookingsIndex() {
    const { bookings, facilities } = usePage<Props>().props;

    const [viewMode, setViewMode]     = useState<ViewMode>("grid");
    const [selected, setSelected]     = useState<AdminBooking | null>(null);
    const [showCreate, setShowCreate] = useState(false);

    const pendingCount   = bookings.filter((b) => b.status === "pending").length;
    const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
    const cancelledCount = bookings.filter((b) => b.status === "cancelled").length;

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4 animate-fade-in-up">
                    {/* Menginjeksi animasi dan font agar selaras dengan Dashboard */}
                    <style dangerouslySetInnerHTML={{__html: `
                        .font-clash { font-family: 'Clash Display', sans-serif; }
                        .font-bdo { font-family: 'BDO Grotesk', sans-serif; }
                        
                        @keyframes fadeInUp {
                            from { opacity: 0; transform: translate3d(0, 30px, 0); }
                            to { opacity: 1; transform: translate3d(0, 0, 0); }
                        }
                        .animate-fade-in-up { 
                            animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
                            opacity: 0;
                            will-change: opacity, transform;
                        }
                        .delay-100 { animation-delay: 100ms; }
                        .delay-200 { animation-delay: 200ms; }
                        
                        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                        .custom-scrollbar::-webkit-scrollbar-thumb { background: #fed7aa; border-radius: 6px; }
                    `}} />

                    <span className="font-bdo text-[11px] font-medium tracking-wide  text-orange-500">
                        Manajemen Reservasi
                    </span>
                    <h1 className="font-clash text-3xl font-bold uppercase tracking-tight xl:text-4xl text-slate-900">
                        Pemesanan
                    </h1>
                </div>
            }
        >
            <Head title="Bookings" />

            <div className="flex flex-col gap-6 pt-6 pb-20 overflow-x-hidden">
                {/* ── Toolbar Row ── */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up delay-100">
                    
                    {/* Stats Pills */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        <div className="flex items-center gap-2 rounded-xl bg-orange-50 px-3.5 py-1.5 border border-orange-100 shadow-sm">
                            <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
                            <span className="font-bdo text-[11px] font-bold text-orange-600 uppercase tracking-wider">{pendingCount} Pending</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-1.5 border border-emerald-100 shadow-sm">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="font-bdo text-[11px] font-bold text-emerald-600 uppercase tracking-wider">{confirmedCount} Konfirmasi</span>
                        </div>
                        {cancelledCount > 0 && (
                            <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3.5 py-1.5 border border-slate-200 shadow-sm">
                                <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                                <span className="font-bdo text-[11px] font-bold text-slate-600 uppercase tracking-wider">{cancelledCount} Dibatalkan</span>
                            </div>
                        )}
                        <span className="font-bdo text-[11px] font-bold text-slate-400 bg-white px-3 py-1.5 rounded-xl border border-slate-200 ml-1">
                            TOTAL: {bookings.length}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                        {/* View toggle */}
                        <div className="flex items-center rounded-2xl bg-white p-1.5 border border-slate-200 shadow-sm">
                            <button
                                type="button"
                                onClick={() => setViewMode("grid")}
                                className={cn(
                                    "flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-clash font-medium transition-all",
                                    viewMode === "grid"
                                        ? "bg-slate-100 text-orange-600 shadow-inner"
                                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-50",
                                )}
                            >
                                <LayoutGrid size={16} className={viewMode === "grid" ? "text-orange-500" : ""} />
                                Grid
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode("list")}
                                className={cn(
                                    "flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-clash font-medium transition-all",
                                    viewMode === "list"
                                        ? "bg-slate-100 text-orange-600 shadow-inner"
                                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-50",
                                )}
                            >
                                <List size={16} className={viewMode === "list" ? "text-orange-500" : ""} />
                                List
                            </button>
                        </div>

                        {/* Add booking */}
                        <button
                            type="button"
                            onClick={() => setShowCreate(true)}
                            className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 px-5 py-3 text-sm font-clash font-medium text-white transition-all shadow-[inset_0_-8px_15px_-5px_rgba(249,115,22,0.4)] hover:bg-emerald-500 hover:scale-95 active:scale-100"
                        >
                            <Plus size={18} className="text-white" />
                            Tambah Booking
                        </button>
                    </div>
                </div>

                {/* View content */}
                {viewMode === "grid" ? (
                    <GridView
                        bookings={bookings}
                        facilities={facilities}
                        onSelect={setSelected}
                    />
                ) : (
                    <ListView bookings={bookings} onSelect={setSelected} />
                )}
            </div>

            {/* Detail SlideOver */}
            <SlideOver
                isOpen={selected !== null}
                onClose={() => setSelected(null)}
                title={<span className="font-clash text-xl">Detail Booking</span>}
                description={
                    selected && (
                        <span className="font-bdo text-sm text-orange-600 font-medium">
                            {selected.facility_name} · {selected.start_time}–{selected.end_time}
                        </span>
                    )
                }
            >
                {selected && (
                    <BookingDetail
                        key={selected.id}
                        booking={selected}
                        onClose={() => setSelected(null)}
                    />
                )}
            </SlideOver>

            {/* Create SlideOver */}
            <SlideOver
                isOpen={showCreate}
                onClose={() => setShowCreate(false)}
                title={<span className="font-clash text-xl font-bold">Tambah Booking</span>}
                description={<span className="font-bdo text-sm text-slate-500">Buat reservasi baru secara manual ke sistem.</span>}
            >
                {showCreate && (
                    <CreateBookingForm
                        facilities={facilities}
                        onClose={() => setShowCreate(false)}
                    />
                )}
            </SlideOver>
        </AdminLayout>
    );
}   