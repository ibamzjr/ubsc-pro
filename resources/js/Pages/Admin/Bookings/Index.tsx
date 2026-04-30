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
    Search,
    UserCheck,
    UserX,
} from "lucide-react";
import { useRef, useState } from "react";
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

interface BookingUser {
    id: number;
    name: string;
    phone_number?: string | null;
    identity_category?: string | null;
}

interface FacilityOption {
    id: number;
    name: string;
}

type Props = PageProps<{
    bookings: AdminBooking[];
    facilities: FacilityOption[];
    users: BookingUser[];
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

// ── Status maps ───────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<BookingStatus, string> = {
    pending:   "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
    confirmed: "bg-green-50 text-green-700 ring-1 ring-inset ring-green-200",
    completed: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
    cancelled: "bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-200",
};

const STATUS_LABEL: Record<BookingStatus, string> = {
    pending:   "Pending",
    confirmed: "Confirmed",
    completed: "Selesai",
    cancelled: "Dibatalkan",
};

const STATUS_DOT: Record<BookingStatus, string> = {
    pending:   "bg-amber-400",
    confirmed: "bg-green-500",
    completed: "bg-blue-500",
    cancelled: "bg-gray-400",
};

const PAYMENT_STATUS_STYLE: Record<PaymentStatus, string> = {
    UNPAID:  "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
    PAID:    "bg-green-50 text-green-700 ring-1 ring-inset ring-green-200",
    EXPIRED: "bg-orange-50 text-orange-600 ring-1 ring-inset ring-orange-200",
    FAILED:  "bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-200",
};

const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
    UNPAID:  "Belum Bayar",
    PAID:    "Lunas",
    EXPIRED: "Expired",
    FAILED:  "Gagal",
};

// Pill color per user category (calendar grid)
const PILL_STYLE: Record<UserCategory, string> = {
    warga_ub: "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100",
    umum:     "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200",
};

// ── Badges ────────────────────────────────────────────────────────────────────

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

function PaymentBadge({ tx }: { tx: BookingTransaction | null }) {
    if (!tx) return null;
    return (
        <span
            className={cn(
                "inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide",
                PAYMENT_STATUS_STYLE[tx.payment_status],
            )}
        >
            {PAYMENT_STATUS_LABEL[tx.payment_status]}
        </span>
    );
}

// ── Create Booking Form ───────────────────────────────────────────────────────

const inputBase =
    "w-full rounded-2xl border-0 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-900 transition-colors";
const labelBase =
    "font-clash text-xs font-medium uppercase tracking-wider text-gray-500";

// ── Customer Combobox ─────────────────────────────────────────────────────────
// Allows typing a new guest name OR picking an existing user from a dropdown.

function CustomerCombobox({
    users,
    value,
    userId,
    onChange,
    error,
}: {
    users: BookingUser[];
    value: string;
    userId: string;
    onChange: (name: string, id: string) => void;
    error?: string;
}) {
    const [open, setOpen]       = useState(false);
    const [query, setQuery]     = useState(value);
    const inputRef              = useRef<HTMLInputElement>(null);
    const linkedUser            = userId ? users.find((u) => String(u.id) === userId) : null;

    const filtered = query.trim().length > 0
        ? users.filter((u) =>
            u.name.toLowerCase().includes(query.toLowerCase()) ||
            (u.phone_number ?? "").includes(query),
          )
        : users.slice(0, 8);

    const select = (u: BookingUser) => {
        setQuery(u.name);
        onChange(u.name, String(u.id));
        setOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        setQuery(v);
        onChange(v, "");   // clear user_id when typing manually
        setOpen(true);
    };

    const clearUser = () => {
        setQuery("");
        onChange("", "");
        setOpen(false);
        inputRef.current?.focus();
    };

    return (
        <div className="relative">
            <label className={labelBase}>Nama Pelanggan</label>
            <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
                    {linkedUser
                        ? <UserCheck size={14} className="text-emerald-500" />
                        : <Search    size={14} className="text-gray-400" />}
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    placeholder="Ketik nama atau cari user terdaftar…"
                    onFocus={() => setOpen(true)}
                    onBlur={() => setTimeout(() => setOpen(false), 150)}
                    onChange={handleInputChange}
                    className={cn(
                        inputBase,
                        "pl-9 pr-9",
                        error && "ring-2 ring-rose-400",
                        linkedUser && "ring-2 ring-emerald-300",
                    )}
                />
                {(query || linkedUser) && (
                    <button
                        type="button"
                        onClick={clearUser}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                        <UserX size={14} />
                    </button>
                )}
            </div>

            {linkedUser && (
                <p className="mt-1 text-[11px] text-emerald-600">
                    User terdaftar: {linkedUser.name}
                    {linkedUser.phone_number ? ` · ${linkedUser.phone_number}` : ""}
                    {linkedUser.identity_category === "warga_kampus" ? " · Warga UB" : ""}
                </p>
            )}
            {!linkedUser && query.trim().length > 0 && (
                <p className="mt-1 text-[11px] text-amber-600">
                    Tamu / Walk-in — tidak terhubung ke akun
                </p>
            )}
            {error && <p className="mt-1 text-[11px] text-rose-500">{error}</p>}

            {open && (
                <ul className="absolute z-50 mt-1 max-h-52 w-full overflow-y-auto rounded-2xl border border-gray-100 bg-white py-1 shadow-xl">
                    {filtered.length === 0 ? (
                        <li className="px-4 py-3 text-sm text-gray-400">
                            Tidak ada user. Booking akan dicatat sebagai tamu.
                        </li>
                    ) : (
                        filtered.map((u) => (
                            <li
                                key={u.id}
                                onMouseDown={() => select(u)}
                                className="flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50"
                            >
                                <span className="font-medium text-gray-900">{u.name}</span>
                                <span className="text-xs text-gray-400">
                                    {u.phone_number ?? (u.identity_category === "warga_kampus" ? "Warga UB" : "")}
                                </span>
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
}

// ── Create Booking Form ───────────────────────────────────────────────────────

function CreateBookingForm({
    facilities,
    users,
    onClose,
}: {
    facilities: FacilityOption[];
    users: BookingUser[];
    onClose: () => void;
}) {
    const { data, setData, post, processing, errors } = useForm({
        user_id:       "",
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
        <form onSubmit={submit} className="flex flex-col gap-5">
            <CustomerCombobox
                users={users}
                value={data.customer_name}
                userId={data.user_id}
                onChange={(name, id) => {
                    setData((prev) => ({ ...prev, customer_name: name, user_id: id }));
                }}
                error={errors.customer_name ?? errors.user_id}
            />

            <div>
                <label className={labelBase}>Fasilitas</label>
                <select
                    value={data.facility_id}
                    onChange={(e) => setData("facility_id", e.target.value)}
                    className={`${inputBase} mt-1.5`}
                >
                    <option value="">Pilih fasilitas…</option>
                    {facilities.map((f) => (
                        <option key={f.id} value={f.id}>
                            {f.name}
                        </option>
                    ))}
                </select>
                {errors.facility_id && (
                    <p className="mt-1 text-xs text-rose-500">{errors.facility_id}</p>
                )}
            </div>

            <div>
                <label className={labelBase}>Tanggal</label>
                <input
                    type="date"
                    value={data.booking_date}
                    min={todayStr()}
                    onChange={(e) => setData("booking_date", e.target.value)}
                    className={`${inputBase} mt-1.5`}
                />
                {errors.booking_date && (
                    <p className="mt-1 text-xs text-rose-500">{errors.booking_date}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelBase}>Jam Mulai</label>
                    <input
                        type="time"
                        value={data.start_time}
                        step="1800"
                        onChange={(e) => setData("start_time", e.target.value)}
                        className={`${inputBase} mt-1.5`}
                    />
                    {errors.start_time && (
                        <p className="mt-1 text-xs text-rose-500">{errors.start_time}</p>
                    )}
                </div>
                <div>
                    <label className={labelBase}>Jam Selesai</label>
                    <input
                        type="time"
                        value={data.end_time}
                        step="1800"
                        onChange={(e) => setData("end_time", e.target.value)}
                        className={`${inputBase} mt-1.5`}
                    />
                    {errors.end_time && (
                        <p className="mt-1 text-xs text-rose-500">{errors.end_time}</p>
                    )}
                </div>
            </div>

            <div>
                <label className={labelBase}>Catatan (opsional)</label>
                <textarea
                    value={data.notes}
                    onChange={(e) => setData("notes", e.target.value)}
                    rows={3}
                    placeholder="Informasi tambahan…"
                    className={`${inputBase} mt-1.5 resize-none`}
                />
            </div>

            <div className="flex items-center gap-3 pt-2">
                <button
                    type="submit"
                    disabled={processing}
                    className="flex-1 rounded-2xl bg-gray-900 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-60"
                >
                    {processing ? "Menyimpan…" : "Buat Booking"}
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
        <div className="flex flex-col gap-5">
            {/* ID + Booking Status */}
            <div className="flex items-center justify-between">
                <span className="font-clash text-xs font-semibold uppercase tracking-widest text-gray-400">
                    #{String(booking.id).padStart(5, "0")}
                </span>
                <StatusBadge status={booking.status} />
            </div>

            {/* Customer */}
            <section className="rounded-2xl bg-gray-50 p-4">
                <p className="mb-2.5 font-clash text-[11px] font-medium uppercase tracking-wider text-gray-400">
                    Customer
                </p>
                <p className="font-medium text-gray-900">{booking.customer_name}</p>
                {booking.customer_phone && (
                    <p className="mt-0.5 text-sm text-gray-500">{booking.customer_phone}</p>
                )}
                <span
                    className={cn(
                        "mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium",
                        booking.user_category === "warga_ub"
                            ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200"
                            : "bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-200",
                    )}
                >
                    {booking.user_category === "warga_ub" ? "Warga UB" : "Umum"}
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
                        <dd className="font-medium text-gray-900">{booking.facility_name}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                        <dt className="text-gray-500">Tanggal</dt>
                        <dd className="font-medium text-gray-900">
                            {formatDateDisplay(booking.booking_date)}
                        </dd>
                    </div>
                    <div className="flex items-center justify-between">
                        <dt className="text-gray-500">Waktu</dt>
                        <dd className="font-medium text-gray-900">
                            {booking.start_time} – {booking.end_time}
                        </dd>
                    </div>
                    <div className="flex items-center justify-between">
                        <dt className="text-gray-500">Durasi</dt>
                        <dd className="font-medium text-gray-900">{formatDuration(duration)}</dd>
                    </div>
                    {booking.notes && (
                        <div className="flex items-start justify-between gap-4">
                            <dt className="shrink-0 text-gray-500">Catatan</dt>
                            <dd className="text-right text-gray-700">{booking.notes}</dd>
                        </div>
                    )}
                </dl>
            </section>

            {/* Payment */}
            <section className="rounded-2xl bg-gray-50 p-4">
                <div className="mb-2.5 flex items-center justify-between">
                    <p className="font-clash text-[11px] font-medium uppercase tracking-wider text-gray-400">
                        Pembayaran
                    </p>
                    <PaymentBadge tx={booking.transaction} />
                </div>
                <dl className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center justify-between">
                        <dt className="text-gray-500">Subtotal</dt>
                        <dd className="font-semibold text-gray-900">
                            {formatPrice(booking.subtotal_price)}
                        </dd>
                    </div>
                    {booking.transaction?.paid_at && (
                        <div className="flex items-center justify-between">
                            <dt className="text-gray-500">Dibayar</dt>
                            <dd className="text-gray-700">{booking.transaction.paid_at}</dd>
                        </div>
                    )}
                </dl>
            </section>

            {/* Actions */}
            <div className="flex flex-col gap-2.5 pt-1">
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
                        className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                    >
                        Simulasi Bayar
                    </button>
                )}
                {booking.status === "pending" && (
                    <button
                        type="button"
                        onClick={() => handleUpdateStatus("confirmed")}
                        className="flex items-center justify-center rounded-2xl bg-green-600 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700"
                    >
                        Konfirmasi Booking
                    </button>
                )}
                {booking.status === "confirmed" && (
                    <button
                        type="button"
                        onClick={() => handleUpdateStatus("completed")}
                        className="flex items-center justify-center rounded-2xl bg-blue-600 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    >
                        Tandai Selesai
                    </button>
                )}
                {booking.status !== "cancelled" && booking.status !== "completed" && (
                    <button
                        type="button"
                        onClick={handleCancel}
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
        <div className="flex flex-col gap-4">
            {/* Date navigation */}
            <div className="flex flex-wrap items-center justify-between gap-3">
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
                    onClick={() => setDateStr(todayStr())}
                    className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                >
                    Hari ini
                </button>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                    <span className="h-3 w-4 rounded-sm border border-blue-200 bg-blue-50" />
                    Warga UB
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-3 w-4 rounded-sm border border-gray-200 bg-gray-100" />
                    Umum
                </span>
                <span className="flex items-center gap-3">
                    {(["confirmed", "pending", "completed", "cancelled"] as BookingStatus[]).map(
                        (s) => (
                            <span key={s} className="flex items-center gap-1">
                                <span className={cn("h-2 w-2 rounded-full", STATUS_DOT[s])} />
                                {STATUS_LABEL[s]}
                            </span>
                        ),
                    )}
                </span>
            </div>

            {/* Calendar Grid */}
            <div
                className="overflow-auto rounded-2xl border border-gray-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                style={{ maxHeight: "calc(100vh - 340px)" }}
            >
                <div
                    className="flex"
                    style={{ minWidth: `${64 + facilities.length * 152}px` }}
                >
                    {/* Time column */}
                    <div className="w-16 shrink-0 bg-white">
                        <div className="sticky top-0 z-30 h-12 border-b border-r border-gray-100 bg-white" />
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
                                <div className="sticky top-0 z-20 flex h-12 items-center justify-center border-b border-l border-gray-100 bg-white px-2">
                                    <span className="text-center text-xs font-medium text-gray-700">
                                        {facility.name}
                                    </span>
                                </div>
                                <div className="relative flex-1 border-l border-gray-100">
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
                                                    "group flex flex-col items-start overflow-hidden rounded-xl border px-2 py-1.5 text-left transition-all hover:z-20 hover:shadow-md",
                                                    isCancelled
                                                        ? "border-gray-200 bg-gray-100 text-gray-400 opacity-50"
                                                        : PILL_STYLE[booking.user_category],
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        "absolute right-1.5 top-1.5 h-2 w-2 rounded-full ring-1 ring-white",
                                                        STATUS_DOT[booking.status],
                                                    )}
                                                />
                                                <p className="w-full truncate pr-3 text-[11px] font-semibold leading-tight">
                                                    {booking.customer_name}
                                                </p>
                                                {height >= 72 && (
                                                    <p className="truncate text-[10px] opacity-70">
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

// ── List View ─────────────────────────────────────────────────────────────────

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
                <span className="font-mono text-xs font-semibold text-gray-700">
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
                    <div>
                        <p className="text-sm font-medium text-gray-900">{b.customer_name}</p>
                        <p className="text-[11px] text-gray-400">
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
                const duration = getDurationMinutes(b.start_time, b.end_time);
                return (
                    <div>
                        <p className="text-sm text-gray-700">{b.booking_date}</p>
                        <p className="text-[11px] text-gray-400">
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
                <span className="text-sm font-semibold text-gray-900">
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
            columns={columns as ColumnDef<AdminBooking, unknown>[]}
            data={bookings}
            searchColumn="customer_name"
            searchPlaceholder="Cari nama pelanggan…"
            emptyMessage="Belum ada booking."
        />
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

type ViewMode = "grid" | "list";

export default function BookingsIndex() {
    const { bookings, facilities, users } = usePage<Props>().props;

    const [viewMode, setViewMode]     = useState<ViewMode>("grid");
    const [selected, setSelected]     = useState<AdminBooking | null>(null);
    const [showCreate, setShowCreate] = useState(false);

    const pendingCount   = bookings.filter((b) => b.status === "pending").length;
    const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
    const cancelledCount = bookings.filter((b) => b.status === "cancelled").length;

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
                {/* Stats row + toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 ring-1 ring-inset ring-amber-200">
                            {pendingCount} pending
                        </span>
                        <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-200">
                            {confirmedCount} confirmed
                        </span>
                        {cancelledCount > 0 && (
                            <span className="rounded-full bg-rose-50 px-3 py-1 text-sm font-medium text-rose-600 ring-1 ring-inset ring-rose-200">
                                {cancelledCount} cancelled
                            </span>
                        )}
                        <span className="text-sm text-gray-500">{bookings.length} total</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* View toggle */}
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
                                Grid
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
                                List
                            </button>
                        </div>

                        {/* Add booking */}
                        <button
                            type="button"
                            onClick={() => setShowCreate(true)}
                            className="flex items-center gap-2 rounded-2xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                        >
                            <Plus size={15} />
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
                title="Detail Booking"
                description={
                    selected
                        ? `${selected.facility_name} · ${selected.start_time}–${selected.end_time}`
                        : undefined
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
                title="Tambah Booking"
                description="Buat reservasi baru atas nama pelanggan."
            >
                {showCreate && (
                    <CreateBookingForm
                        facilities={facilities}
                        users={users}
                        onClose={() => setShowCreate(false)}
                    />
                )}
            </SlideOver>
        </AdminLayout>
    );
}
