import { Head, router, useForm, usePage } from "@inertiajs/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import {
    Award,
    CalendarRange,
    CreditCard,
    Eye,
    Plus,
    Star,
    TrendingUp,
    Users,
    Wallet,
    XCircle,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import DataTable from "@/Components/Admin/DataTable";
import SlideOver from "@/Components/Admin/SlideOver";
import { ADMIN_TOKENS } from "@/Components/Admin/tokens";
import AdminLayout from "@/Layouts/AdminLayout";
import { cn } from "@/lib/utils";
import type {
    AdminMembership,
    BookingTransaction,
    MembershipStatus,
    PageProps,
    PaymentStatus,
} from "@/types";

// ── Page props ────────────────────────────────────────────────────────────────

interface PlanOption {
    id: number;
    name: string;
    price: number;
    duration_months: number;
}

type Props = PageProps<{
    memberships: AdminMembership[];
    plans: PlanOption[];
}>;

// ── Helpers ───────────────────────────────────────────────────────────────────

function todayStr(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function formatPrice(amount: number): string {
    return `Rp ${amount.toLocaleString("id-ID")}`;
}

function formatDate(dateStr: string): string {
    const [y, mo, d] = dateStr.split("-").map(Number);
    return new Date(y, (mo ?? 1) - 1, d).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function addMonthsToDateStr(dateStr: string, months: number): string {
    const [y, mo, d] = dateStr.split("-").map(Number);
    const date = new Date(y, (mo ?? 1) - 1, d ?? 1);
    date.setMonth(date.getMonth() + months);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

// ── Global styles (aligned with Dashboard / Bookings / Roles) ─────────────────

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
        from { opacity: 0; transform: scale(0.96); }
        to   { opacity: 1; transform: scale(1); }
    }
    @keyframes progressFill { from { width: 0%; } }

    .animate-fade-in-up   { animation: fadeInUp  0.65s cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; will-change:opacity,transform; }
    .animate-fade-in-left { animation: fadeInLeft 0.55s cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; will-change:opacity,transform; }
    .animate-scale-in     { animation: scaleIn    0.5s  cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; }

    .delay-50  { animation-delay:  50ms; }
    .delay-100 { animation-delay: 100ms; }
    .delay-150 { animation-delay: 150ms; }
    .delay-200 { animation-delay: 200ms; }
    .delay-250 { animation-delay: 250ms; }
    .delay-300 { animation-delay: 300ms; }
    .delay-400 { animation-delay: 400ms; }
    .delay-500 { animation-delay: 500ms; }

    /* ── Shimmer sweep — one-shot on load ── */
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

    /* ── Card glint (top-edge highlight) ── */
    .card-glint::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 1px;
        background: linear-gradient(to right, transparent, rgba(255,255,255,0.9), transparent);
        pointer-events: none;
        z-index: 10;
    }

    /* ── Icon glow pulse ── */
    @keyframes iconGlow {
        0%, 100% { box-shadow: 0 2px 8px rgba(15,23,42,0.2); }
        50%       { box-shadow: 0 2px 16px rgba(15,23,42,0.3), 0 0 24px rgba(251,191,36,0.12); }
    }
    .icon-glow { animation: iconGlow 3.5s ease-in-out infinite; }

    /* ── Progress bar animation ── */
    .progress-fill { animation: progressFill 1s cubic-bezier(0.16,1,0.3,1) 0.5s both; }

    /* ── Custom scrollbar ── */
    .custom-scrollbar::-webkit-scrollbar { width: 5px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #fed7aa; border-radius: 6px; }

    /* ── Responsive plan cards: horizontal scroll on mobile ── */
    .plan-cards-row {
        display: flex;
        gap: 12px;
        overflow-x: auto;
        padding-bottom: 4px;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
    }
    .plan-cards-row::-webkit-scrollbar { display: none; }
    .plan-card { flex: 0 0 auto; min-width: 160px; }
    @media (min-width: 640px) {
        .plan-cards-row { flex-wrap: wrap; overflow: visible; }
        .plan-card { flex: 1 1 160px; }
    }

    /* ── Table row hover ── */
    .membership-row:hover { background: rgba(249,115,22,0.025); }
`;

// ── Status maps ───────────────────────────────────────────────────────────────

const MEMBERSHIP_STATUS_STYLE: Record<MembershipStatus, string> = {
    active:    "bg-emerald-50 text-emerald-700 border border-emerald-200",
    expired:   "bg-orange-50 text-orange-600 border border-orange-200",
    cancelled: "bg-rose-50 text-rose-600 border border-rose-200",
};

const MEMBERSHIP_STATUS_LABEL: Record<MembershipStatus, string> = {
    active:    "Aktif",
    expired:   "Expired",
    cancelled: "Dibatalkan",
};

const MEMBERSHIP_STATUS_DOT: Record<MembershipStatus, string> = {
    active:    "bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)] animate-pulse",
    expired:   "bg-orange-400 shadow-[0_0_5px_rgba(251,146,60,0.8)]",
    cancelled: "bg-rose-400",
};

const PAYMENT_STATUS_STYLE: Record<PaymentStatus, string> = {
    UNPAID:  "bg-amber-50 text-amber-700 border border-amber-200",
    PAID:    "bg-emerald-50 text-emerald-700 border border-emerald-200",
    EXPIRED: "bg-orange-50 text-orange-600 border border-orange-200",
    FAILED:  "bg-rose-50 text-rose-600 border border-rose-200",
};

const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
    UNPAID:  "Belum Bayar",
    PAID:    "Lunas",
    EXPIRED: "Expired",
    FAILED:  "Gagal",
};

// ── Badges ────────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: MembershipStatus }) {
    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-bdo text-[10px] font-bold uppercase tracking-widest",
            MEMBERSHIP_STATUS_STYLE[status],
        )}>
            <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", MEMBERSHIP_STATUS_DOT[status])} />
            {MEMBERSHIP_STATUS_LABEL[status]}
        </span>
    );
}

function PaymentBadge({ tx }: { tx: BookingTransaction | null }) {
    if (!tx) return null;
    return (
        <span className={cn(
            "inline-flex rounded-md px-2.5 py-1 font-bdo text-[10px] font-bold uppercase tracking-widest",
            PAYMENT_STATUS_STYLE[tx.payment_status],
        )}>
            {PAYMENT_STATUS_LABEL[tx.payment_status]}
        </span>
    );
}

// ── ShinyIcon (from Roles/Dashboard design system) ────────────────────────────

function ShinyIcon({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn(
            "icon-glow flex items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 shadow-[0_2px_8px_rgba(15,23,42,0.25),inset_0_1px_0_rgba(255,255,255,0.08)]",
            className,
        )}>
            {children}
        </div>
    );
}

// ── Form styles ───────────────────────────────────────────────────────────────

const inputBase =
    "w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 font-bdo text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 transition-all";
const labelBase =
    "font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block";

// ── Create Membership Form ────────────────────────────────────────────────────

function CreateMembershipForm({
    plans,
    onClose,
}: {
    plans: PlanOption[];
    onClose: () => void;
}) {
    const { data, setData, post, processing, errors } = useForm({
        customer_name:      "",
        membership_plan_id: "",
        start_date:         todayStr(),
        end_date:           "",
        amount:             "",
    });

    const selectedPlan = plans.find((p) => String(p.id) === data.membership_plan_id);

    const handlePlanChange = (planId: string) => {
        setData("membership_plan_id", planId);
        const plan = plans.find((p) => String(p.id) === planId);
        if (plan && data.start_date) {
            setData("end_date", addMonthsToDateStr(data.start_date, plan.duration_months));
        }
    };

    const handleStartDateChange = (dateStr: string) => {
        setData("start_date", dateStr);
        if (selectedPlan && dateStr) {
            setData("end_date", addMonthsToDateStr(dateStr, selectedPlan.duration_months));
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.memberships.store"), { onSuccess: onClose });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-5">
            {/* Name */}
            <div>
                <label className={labelBase}>Nama Member</label>
                <input
                    type="text"
                    value={data.customer_name}
                    onChange={(e) => setData("customer_name", e.target.value)}
                    placeholder="Nama lengkap member…"
                    className={inputBase}
                    required
                />
                {errors.customer_name && (
                    <p className="mt-1.5 text-[11px] text-rose-500 font-bdo">{errors.customer_name}</p>
                )}
            </div>

            {/* Plan */}
            <div>
                <label className={labelBase}>Paket Membership</label>
                <select
                    value={data.membership_plan_id}
                    onChange={(e) => handlePlanChange(e.target.value)}
                    className={inputBase}
                >
                    <option value="">Tanpa paket (isi manual)</option>
                    {plans.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name} — {formatPrice(p.price)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelBase}>Tanggal Mulai</label>
                    <input
                        type="date"
                        value={data.start_date}
                        onChange={(e) => handleStartDateChange(e.target.value)}
                        className={inputBase}
                    />
                    {errors.start_date && (
                        <p className="mt-1.5 text-[11px] text-rose-500 font-bdo">{errors.start_date}</p>
                    )}
                </div>
                <div>
                    <label className={labelBase}>Tanggal Selesai</label>
                    <input
                        type="date"
                        value={data.end_date}
                        min={data.start_date || todayStr()}
                        onChange={(e) => setData("end_date", e.target.value)}
                        readOnly={!!selectedPlan}
                        className={cn(inputBase, selectedPlan && "cursor-not-allowed opacity-60")}
                    />
                    {selectedPlan && (
                        <p className="mt-1.5 font-bdo text-[11px] text-indigo-500">
                            Otomatis dari paket ({selectedPlan.duration_months} bln)
                        </p>
                    )}
                    {errors.end_date && (
                        <p className="mt-1.5 text-[11px] text-rose-500 font-bdo">{errors.end_date}</p>
                    )}
                </div>
            </div>

            {/* Amount */}
            {selectedPlan ? (
                <div className="rounded-xl bg-indigo-50 border border-indigo-200 px-4 py-3">
                    <p className="font-bdo text-[11px] font-bold uppercase tracking-wider text-indigo-400 mb-1">
                        Nominal Paket
                    </p>
                    <p className="font-clash text-lg font-semibold text-indigo-800">
                        {formatPrice(selectedPlan.price)}
                    </p>
                    <p className="font-bdo text-[11px] text-indigo-400 mt-0.5">Tersimpan otomatis dari paket</p>
                </div>
            ) : (
                <div>
                    <label className={labelBase}>Nominal (IDR)</label>
                    <input
                        type="number"
                        value={data.amount}
                        min="0"
                        step="1000"
                        placeholder="0"
                        onChange={(e) => setData("amount", e.target.value)}
                        className={inputBase}
                    />
                    {errors.amount && (
                        <p className="mt-1.5 text-[11px] text-rose-500 font-bdo">{errors.amount}</p>
                    )}
                </div>
            )}

            <div className="flex items-center gap-3 pt-2">
                <button
                    type="submit"
                    disabled={processing}
                    className="relative flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 py-3 font-clash text-sm font-semibold text-white shadow-[0_4px_14px_rgba(16,185,129,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(16,185,129,0.38)] active:translate-y-0 disabled:opacity-60"
                >
                    <span className="pointer-events-none absolute top-0 left-0 right-0 h-px rounded-t-xl bg-white/20" />
                    {processing ? "Menyimpan…" : "Buat Membership"}
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl px-5 py-3 font-bdo text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
                >
                    Batal
                </button>
            </div>
        </form>
    );
}

// ── Membership Detail Panel ───────────────────────────────────────────────────

function MembershipDetail({
    membership,
    onClose,
}: {
    membership: AdminMembership;
    onClose: () => void;
}) {
    const handleUpdateStatus = (status: MembershipStatus) => {
        router.patch(
            route("admin.memberships.update", membership.id),
            { status },
            { onSuccess: onClose },
        );
    };

    const handleCancel = () => {
        if (!confirm(`Batalkan membership #${membership.id}?`)) return;
        router.delete(route("admin.memberships.destroy", membership.id), {
            onSuccess: onClose,
        });
    };

    return (
        <div className="flex flex-col gap-4">
            {/* ID + Status */}
            <div className="flex items-center justify-between">
                <span className="font-bdo text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    #{String(membership.id).padStart(5, "0")}
                </span>
                <StatusBadge status={membership.status} />
            </div>

            {/* Member Card */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-5 shimmer-once">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <p className="font-bdo text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                    Member
                </p>
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 font-clash text-base font-bold text-white">
                        {membership.customer_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-clash text-base font-semibold text-white leading-tight">
                            {membership.customer_name}
                        </p>
                        {membership.customer_phone && (
                            <p className="font-bdo text-[12px] text-slate-400 mt-0.5">
                                {membership.customer_phone}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Plan */}
            {membership.plan_name && (
                <section className="rounded-2xl bg-indigo-50 border border-indigo-100 p-4">
                    <p className="font-bdo text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-1.5">
                        Paket
                    </p>
                    <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-indigo-500" />
                        <p className="font-clash text-sm font-semibold text-indigo-800">
                            {membership.plan_name}
                        </p>
                    </div>
                </section>
            )}

            {/* Period */}
            <section className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <div className="flex items-center gap-2 mb-3">
                    <CalendarRange className="w-3.5 h-3.5 text-slate-400" />
                    <p className="font-bdo text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Periode
                    </p>
                </div>
                <dl className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                        <dt className="font-bdo text-[12px] text-slate-500">Mulai</dt>
                        <dd className="font-bdo text-[12px] font-semibold text-slate-800">
                            {formatDate(membership.start_date)}
                        </dd>
                    </div>
                    <div className="h-px bg-slate-200/70" />
                    <div className="flex items-center justify-between">
                        <dt className="font-bdo text-[12px] text-slate-500">Selesai</dt>
                        <dd className="font-bdo text-[12px] font-semibold text-slate-800">
                            {formatDate(membership.end_date)}
                        </dd>
                    </div>
                </dl>
            </section>

            {/* Payment */}
            <section className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Wallet className="w-3.5 h-3.5 text-slate-400" />
                        <p className="font-bdo text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Pembayaran
                        </p>
                    </div>
                    <PaymentBadge tx={membership.transaction} />
                </div>
                <dl className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                        <dt className="font-bdo text-[12px] text-slate-500">Nominal</dt>
                        <dd className="font-clash text-sm font-bold text-slate-900">
                            {membership.transaction ? formatPrice(membership.transaction.amount) : "—"}
                        </dd>
                    </div>
                    {membership.transaction?.paid_at && (
                        <>
                            <div className="h-px bg-slate-200/70" />
                            <div className="flex items-center justify-between">
                                <dt className="font-bdo text-[12px] text-slate-500">Dibayar</dt>
                                <dd className="font-bdo text-[12px] text-slate-700">
                                    {membership.transaction.paid_at}
                                </dd>
                            </div>
                        </>
                    )}
                </dl>
            </section>

            {/* Actions */}
            <div className="flex flex-col gap-2.5 pt-1">
                {membership.transaction?.payment_status === "UNPAID" && (
                    <button
                        type="button"
                        onClick={() =>
                            router.post(
                                route("admin.transactions.simulate-pay", membership.transaction!.id),
                                {},
                                { onSuccess: onClose },
                            )
                        }
                        className="relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 py-3 font-clash text-sm font-semibold text-white shadow-[0_4px_14px_rgba(16,185,129,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(16,185,129,0.38)] active:translate-y-0"
                    >
                        <span className="pointer-events-none absolute top-0 left-0 right-0 h-px rounded-t-xl bg-white/20" />
                        <CreditCard className="w-4 h-4" />
                        Simulasi Bayar
                    </button>
                )}
                {membership.status === "active" && (
                    <button
                        type="button"
                        onClick={() => handleUpdateStatus("expired")}
                        className="flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 py-3 font-bdo text-sm font-semibold text-orange-600 transition-all hover:bg-orange-100 hover:-translate-y-0.5"
                    >
                        <XCircle className="w-4 h-4" />
                        Tandai Expired
                    </button>
                )}
                {membership.status !== "cancelled" && (
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 py-3 font-bdo text-sm font-semibold text-rose-600 transition-all hover:bg-rose-100 hover:-translate-y-0.5"
                    >
                        Batalkan Membership
                    </button>
                )}
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl py-3 font-bdo text-sm font-medium text-slate-400 transition-colors hover:bg-slate-100"
                >
                    Tutup
                </button>
            </div>
        </div>
    );
}

// ── List View ─────────────────────────────────────────────────────────────────

const listHelper = createColumnHelper<AdminMembership>();

function ListView({
    memberships,
    onSelect,
    toolbar,
}: {
    memberships: AdminMembership[];
    onSelect: (m: AdminMembership) => void;
    toolbar?: ReactNode;
}) {
    const columns = [
        listHelper.accessor("id", {
            header: "ID",
            cell: (info) => (
                <span className="font-mono text-[11px] font-bold text-slate-500 tabular-nums">
                    #{String(info.getValue()).padStart(5, "0")}
                </span>
            ),
        }),
        listHelper.accessor("customer_name", {
            header: "Member",
            enableSorting: true,
            cell: (info) => {
                const m = info.row.original;
                return (
                    <div className="flex items-center gap-2.5 min-w-0">
                        {/* Avatar initial */}
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-clash text-[13px] font-bold text-slate-600">
                            {m.customer_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="font-bdo text-sm font-semibold text-slate-900 truncate">
                                {m.customer_name}
                            </p>
                            <p className="font-bdo text-[11px] text-slate-400 truncate">
                                {m.customer_phone ?? "—"}
                            </p>
                        </div>
                    </div>
                );
            },
        }),
        listHelper.display({
            id: "period",
            header: "Periode",
            cell: ({ row }) => {
                const m = row.original;
                return (
                    <div>
                        <p className="font-bdo text-[12px] text-slate-700">{formatDate(m.start_date)}</p>
                        <p className="font-bdo text-[11px] text-slate-400">s/d {formatDate(m.end_date)}</p>
                    </div>
                );
            },
        }),
        listHelper.accessor("plan_name", {
            header: "Paket",
            cell: (info) => {
                const val = info.getValue();
                return val ? (
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 border border-indigo-200 px-2.5 py-1 font-bdo text-[10px] font-bold uppercase tracking-widest text-indigo-700">
                        <Star className="w-2.5 h-2.5" />
                        {val}
                    </span>
                ) : (
                    <span className="font-bdo text-[12px] text-slate-400">—</span>
                );
            },
        }),
        listHelper.accessor("status", {
            header: "Status",
            cell: (info) => <StatusBadge status={info.getValue()} />,
        }),
        listHelper.display({
            id: "payment",
            header: "Bayar",
            cell: ({ row }) => <PaymentBadge tx={row.original.transaction} />,
        }),
        listHelper.display({
            id: "amount",
            header: "Nominal",
            cell: ({ row }) => {
                const tx = row.original.transaction;
                return (
                    <span className="font-clash text-sm font-bold text-slate-900 tabular-nums">
                        {tx ? formatPrice(tx.amount) : "—"}
                    </span>
                );
            },
        }),
        listHelper.display({
            id: "actions",
            header: "",
            cell: ({ row }) => (
                <button
                    type="button"
                    onClick={() => onSelect(row.original)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-500 transition-all hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 hover:shadow-sm"
                    title="Lihat detail"
                >
                    <Eye size={14} />
                </button>
            ),
        }),
    ];

    return (
        <div className="animate-fade-in-up delay-200 bg-white rounded-[24px] p-2 shadow-sm border border-slate-200/80 overflow-hidden">
            <DataTable
                columns={columns as ColumnDef<AdminMembership, unknown>[]}
                data={memberships}
                searchColumn="customer_name"
                searchPlaceholder="Cari nama member…"
                emptyMessage="Belum ada membership."
                toolbar={toolbar}
            />
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MembershipsIndex() {
    const { memberships, plans } = usePage<Props>().props;

    const [selected, setSelected]     = useState<AdminMembership | null>(null);
    const [showCreate, setShowCreate] = useState(false);
    const [planFilter, setPlanFilter] = useState("all");

    const activeCount    = memberships.filter((m) => m.status === "active").length;
    const expiredCount   = memberships.filter((m) => m.status === "expired").length;
    const cancelledCount = memberships.filter((m) => m.status === "cancelled").length;

    // Per-plan active member counts, sorted descending
    const plansWithCount = plans
        .map((p) => ({
            ...p,
            count: memberships.filter(
                (m) => m.membership_plan_id === p.id && m.status === "active",
            ).length,
        }))
        .sort((a, b) => b.count - a.count);

    // Client-side filter
    const filtered =
        planFilter === "all"
            ? memberships
            : planFilter === "none"
              ? memberships.filter((m) => m.membership_plan_id === null)
              : memberships.filter((m) => String(m.membership_plan_id) === planFilter);

    // Plan filter select (passed as DataTable toolbar)
    const toolbar = plans.length > 0 ? (
        <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-slate-50/50 px-3 font-bdo text-sm text-slate-700 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 transition-all"
        >
            <option value="all">Semua Paket</option>
            <option value="none">Tanpa Paket</option>
            {plans.map((p) => (
                <option key={p.id} value={String(p.id)}>
                    {p.name}
                </option>
            ))}
        </select>
    ) : undefined;

    // Rank accent config
    const rankConfig = [
        { bg: "from-amber-400 to-amber-500", label: "#1", labelColor: "text-amber-800", badge: "bg-amber-100 text-amber-700 border-amber-200" },
        { bg: "from-slate-400 to-slate-500", label: "#2", labelColor: "text-slate-600", badge: "bg-slate-100 text-slate-600 border-slate-200" },
        { bg: "from-orange-400 to-orange-500", label: "#3", labelColor: "text-orange-700", badge: "bg-orange-50 text-orange-600 border-orange-200" },
    ];

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4 animate-fade-in-up">
                    <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
                    <span className="font-bdo text-[11px] font-medium tracking-wide text-orange-500">
                        Manajemen Keanggotaan
                    </span>
                    <h1 className="font-clash text-3xl font-bold uppercase tracking-tight xl:text-4xl text-slate-900">
                        Memberships
                    </h1>
                </div>
            }
        >
            <Head title="Memberships" />

            <div className="flex flex-col gap-6 pt-6 pb-20 overflow-x-hidden">

                {/* ── Toolbar Row: Stats Pills + CTA ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up delay-100">

                    {/* Status Pills */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-3.5 py-1.5 shadow-sm">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                            <span className="font-bdo text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                                {activeCount} Aktif
                            </span>
                        </div>
                        {expiredCount > 0 && (
                            <div className="flex items-center gap-2 rounded-xl bg-orange-50 border border-orange-100 px-3.5 py-1.5 shadow-sm">
                                <span className="h-2 w-2 rounded-full bg-orange-400" />
                                <span className="font-bdo text-[11px] font-bold text-orange-600 uppercase tracking-wider">
                                    {expiredCount} Expired
                                </span>
                            </div>
                        )}
                        {cancelledCount > 0 && (
                            <div className="flex items-center gap-2 rounded-xl bg-slate-100 border border-slate-200 px-3.5 py-1.5 shadow-sm">
                                <span className="h-2 w-2 rounded-full bg-slate-400" />
                                <span className="font-bdo text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                    {cancelledCount} Dibatalkan
                                </span>
                            </div>
                        )}
                        <span className="font-bdo text-[11px] font-bold text-slate-400 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                            TOTAL: {memberships.length}
                        </span>
                    </div>

                    {/* Add button */}
                    <button
                        type="button"
                        onClick={() => setShowCreate(true)}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 px-5 py-3 font-clash text-sm font-semibold text-white shadow-[inset_0_-8px_15px_-5px_rgba(16,185,129,0.4)] transition-all hover:scale-95 active:scale-100"
                    >
                        <Plus size={18} />
                        Tambah Membership
                    </button>
                </div>

                {/* ── Per-plan Stat Cards ── */}
                {plansWithCount.length > 0 && (
                    <div className="plan-cards-row animate-fade-in-up delay-150">
                        {/* Summary card */}
                        <div className="plan-card relative overflow-hidden rounded-[20px] bg-gradient-to-br from-slate-800 to-slate-900 p-5 shadow-md shimmer-once card-glint flex flex-col justify-between min-h-[140px]">
                            <div className="flex items-start justify-between">
                                <ShinyIcon className="h-9 w-9">
                                    <Users className="w-4 h-4 text-amber-300" />
                                </ShinyIcon>
                                <span className="font-bdo text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white/10 text-white/60 uppercase tracking-wider">
                                    Total
                                </span>
                            </div>
                            <div>
                                <p className="font-clash text-[2rem] font-bold text-white leading-none">
                                    {activeCount}
                                </p>
                                <p className="font-bdo text-[11px] font-medium text-slate-400 mt-1.5">
                                    Member Aktif
                                </p>
                            </div>
                        </div>

                        {plansWithCount.map((p, idx) => {
                            const rank = rankConfig[idx] ?? rankConfig[2];
                            return (
                                <div
                                    key={p.id}
                                    className="plan-card relative overflow-hidden rounded-[20px] bg-white border border-slate-200/80 p-5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 card-glint flex flex-col justify-between min-h-[140px]"
                                    style={{ animationDelay: `${150 + idx * 60}ms` }}
                                >
                                    {/* Left accent bar */}
                                    <div className={cn(
                                        "absolute left-0 top-3 bottom-3 w-[3px] bg-gradient-to-b rounded-full",
                                        rank.bg,
                                    )} />

                                    <div className="flex items-start justify-between">
                                        <div className={cn(
                                            "flex items-center gap-1.5 rounded-lg border px-2 py-0.5 font-bdo text-[10px] font-bold uppercase tracking-wider",
                                            rank.badge,
                                        )}>
                                            <Award className="w-2.5 h-2.5" />
                                            {rank.label}
                                        </div>
                                        <TrendingUp className="w-3.5 h-3.5 text-slate-300" />
                                    </div>

                                    <div>
                                        <p className="font-clash text-[2rem] font-bold text-slate-900 leading-none tabular-nums">
                                            {p.count}
                                        </p>
                                        <p className="font-bdo text-[11px] font-semibold text-slate-700 mt-1 truncate">
                                            {p.name}
                                        </p>
                                        <p className="font-bdo text-[10px] text-slate-400 mt-0.5">
                                            anggota aktif
                                        </p>

                                        {/* Mini progress bar (relative to #1 plan) */}
                                        {plansWithCount[0] && plansWithCount[0].count > 0 && (
                                            <div className="mt-3 h-1 w-full rounded-full bg-slate-100 overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full progress-fill bg-gradient-to-r",
                                                        rank.bg,
                                                    )}
                                                    style={{
                                                        width: `${Math.round((p.count / plansWithCount[0].count) * 100)}%`,
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── Data Table ── */}
                <ListView memberships={filtered} onSelect={setSelected} toolbar={toolbar} />
            </div>

            {/* Detail SlideOver */}
            <SlideOver
                isOpen={selected !== null}
                onClose={() => setSelected(null)}
                title={<span className="font-clash text-xl font-bold">Detail Membership</span>}
                description={
                    selected ? (
                        <span className="font-bdo text-sm text-orange-600 font-medium">
                            {selected.customer_name} · {formatDate(selected.start_date)} – {formatDate(selected.end_date)}
                        </span>
                    ) : undefined
                }
            >
                {selected && (
                    <MembershipDetail
                        key={selected.id}
                        membership={selected}
                        onClose={() => setSelected(null)}
                    />
                )}
            </SlideOver>

            {/* Create SlideOver */}
            <SlideOver
                isOpen={showCreate}
                onClose={() => setShowCreate(false)}
                title={<span className="font-clash text-xl font-bold">Tambah Membership</span>}
                description={
                    <span className="font-bdo text-sm text-slate-500">
                        Daftarkan membership baru untuk anggota.
                    </span>
                }
            >
                {showCreate && (
                    <CreateMembershipForm
                        plans={plans}
                        onClose={() => setShowCreate(false)}
                    />
                )}
            </SlideOver>
        </AdminLayout>
    );
}