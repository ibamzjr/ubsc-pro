import { Head, router, useForm, usePage } from "@inertiajs/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Eye, Plus } from "lucide-react";
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

interface MembershipUser {
    id: number;
    name: string;
    phone_number?: string | null;
}

interface PlanOption {
    id: number;
    name: string;
    price: number;
    duration_months: number;
}

type Props = PageProps<{
    memberships: AdminMembership[];
    users: MembershipUser[];
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

// ── Status maps ───────────────────────────────────────────────────────────────

const MEMBERSHIP_STATUS_STYLE: Record<MembershipStatus, string> = {
    active:    "bg-green-50 text-green-700 ring-1 ring-inset ring-green-200",
    expired:   "bg-orange-50 text-orange-600 ring-1 ring-inset ring-orange-200",
    cancelled: "bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-200",
};

const MEMBERSHIP_STATUS_LABEL: Record<MembershipStatus, string> = {
    active:    "Aktif",
    expired:   "Expired",
    cancelled: "Dibatalkan",
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

// ── Badges ────────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: MembershipStatus }) {
    return (
        <span
            className={cn(
                "inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide",
                MEMBERSHIP_STATUS_STYLE[status],
            )}
        >
            {MEMBERSHIP_STATUS_LABEL[status]}
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

// ── Form styles ───────────────────────────────────────────────────────────────

const inputBase =
    "w-full rounded-2xl border-0 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-900 transition-colors";
const labelBase =
    "font-clash text-xs font-medium uppercase tracking-wider text-gray-500";

// ── Create Membership Form ────────────────────────────────────────────────────

function CreateMembershipForm({
    users,
    plans,
    onClose,
}: {
    users: MembershipUser[];
    plans: PlanOption[];
    onClose: () => void;
}) {
    const [isGuest, setIsGuest] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        user_id:            "",
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
            {/* Member type toggle */}
            <div className="flex rounded-2xl bg-gray-100 p-1">
                <button
                    type="button"
                    onClick={() => { setIsGuest(false); setData("customer_name", ""); }}
                    className={cn(
                        "flex-1 rounded-xl py-2 text-xs font-medium transition-colors",
                        !isGuest ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700",
                    )}
                >
                    Pengguna Terdaftar
                </button>
                <button
                    type="button"
                    onClick={() => { setIsGuest(true); setData("user_id", ""); }}
                    className={cn(
                        "flex-1 rounded-xl py-2 text-xs font-medium transition-colors",
                        isGuest ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700",
                    )}
                >
                    Tamu / Walk-in
                </button>
            </div>

            {/* User select or guest name */}
            {isGuest ? (
                <div>
                    <label className={cn(labelBase, "mb-1.5 block")}>Nama Member</label>
                    <input
                        type="text"
                        value={data.customer_name}
                        onChange={(e) => setData("customer_name", e.target.value)}
                        placeholder="Nama lengkap tamu…"
                        className={inputBase}
                        required
                    />
                    {errors.customer_name && (
                        <p className="mt-1 text-xs text-rose-500">{errors.customer_name}</p>
                    )}
                </div>
            ) : (
                <div>
                    <label className={cn(labelBase, "mb-1.5 block")}>Member (User)</label>
                    <select
                        value={data.user_id}
                        onChange={(e) => setData("user_id", e.target.value)}
                        className={inputBase}
                    >
                        <option value="">Pilih user…</option>
                        {users.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.name}
                                {u.phone_number ? ` · ${u.phone_number}` : ""}
                            </option>
                        ))}
                    </select>
                    {errors.user_id && (
                        <p className="mt-1 text-xs text-rose-500">{errors.user_id}</p>
                    )}
                </div>
            )}

            {/* Plan */}
            <div>
                <label className={cn(labelBase, "mb-1.5 block")}>Paket Membership</label>
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
                    <label className={cn(labelBase, "mb-1.5 block")}>Tanggal Mulai</label>
                    <input
                        type="date"
                        value={data.start_date}
                        onChange={(e) => handleStartDateChange(e.target.value)}
                        className={inputBase}
                    />
                    {errors.start_date && (
                        <p className="mt-1 text-xs text-rose-500">{errors.start_date}</p>
                    )}
                </div>
                <div>
                    <label className={cn(labelBase, "mb-1.5 block")}>Tanggal Selesai</label>
                    <input
                        type="date"
                        value={data.end_date}
                        min={data.start_date || todayStr()}
                        onChange={(e) => setData("end_date", e.target.value)}
                        readOnly={!!selectedPlan}
                        className={cn(
                            inputBase,
                            selectedPlan && "cursor-not-allowed opacity-60",
                        )}
                    />
                    {selectedPlan && (
                        <p className="mt-1 text-[11px] text-indigo-500">
                            Otomatis dari paket ({selectedPlan.duration_months} bln)
                        </p>
                    )}
                    {errors.end_date && (
                        <p className="mt-1 text-xs text-rose-500">{errors.end_date}</p>
                    )}
                </div>
            </div>

            {/* Amount — auto from plan or manual */}
            {selectedPlan ? (
                <div className="rounded-2xl bg-indigo-50 px-4 py-3 text-sm text-indigo-700 ring-1 ring-inset ring-indigo-200">
                    Nominal:{" "}
                    <span className="font-semibold">{formatPrice(selectedPlan.price)}</span>
                    <span className="ml-1 opacity-60">(dari paket — tersimpan otomatis)</span>
                </div>
            ) : (
                <div>
                    <label className={cn(labelBase, "mb-1.5 block")}>Nominal (IDR)</label>
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
                        <p className="mt-1 text-xs text-rose-500">{errors.amount}</p>
                    )}
                </div>
            )}

            <div className="flex items-center gap-3 pt-2">
                <button
                    type="submit"
                    disabled={processing}
                    className="flex-1 rounded-2xl bg-gray-900 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-60"
                >
                    {processing ? "Menyimpan…" : "Buat Membership"}
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
        <div className="flex flex-col gap-5">
            {/* ID + Status */}
            <div className="flex items-center justify-between">
                <span className="font-clash text-xs font-semibold uppercase tracking-widest text-gray-400">
                    #{String(membership.id).padStart(5, "0")}
                </span>
                <StatusBadge status={membership.status} />
            </div>

            {/* Member */}
            <section className="rounded-2xl bg-gray-50 p-4">
                <p className="mb-2.5 font-clash text-[11px] font-medium uppercase tracking-wider text-gray-400">
                    Member
                </p>
                <p className="font-medium text-gray-900">{membership.customer_name}</p>
                {membership.customer_phone && (
                    <p className="mt-0.5 text-sm text-gray-500">{membership.customer_phone}</p>
                )}
            </section>

            {/* Plan */}
            {membership.plan_name && (
                <section className="rounded-2xl bg-indigo-50 p-4 ring-1 ring-inset ring-indigo-100">
                    <p className="mb-1.5 font-clash text-[11px] font-medium uppercase tracking-wider text-indigo-400">
                        Paket
                    </p>
                    <p className="font-clash font-semibold text-indigo-800">{membership.plan_name}</p>
                </section>
            )}

            {/* Period */}
            <section className="rounded-2xl bg-gray-50 p-4">
                <p className="mb-2.5 font-clash text-[11px] font-medium uppercase tracking-wider text-gray-400">
                    Periode
                </p>
                <dl className="flex flex-col gap-2.5 text-sm">
                    <div className="flex items-center justify-between">
                        <dt className="text-gray-500">Mulai</dt>
                        <dd className="font-medium text-gray-900">{formatDate(membership.start_date)}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                        <dt className="text-gray-500">Selesai</dt>
                        <dd className="font-medium text-gray-900">{formatDate(membership.end_date)}</dd>
                    </div>
                </dl>
            </section>

            {/* Payment */}
            <section className="rounded-2xl bg-gray-50 p-4">
                <div className="mb-2.5 flex items-center justify-between">
                    <p className="font-clash text-[11px] font-medium uppercase tracking-wider text-gray-400">
                        Pembayaran
                    </p>
                    <PaymentBadge tx={membership.transaction} />
                </div>
                <dl className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center justify-between">
                        <dt className="text-gray-500">Nominal</dt>
                        <dd className="font-semibold text-gray-900">
                            {membership.transaction
                                ? formatPrice(membership.transaction.amount)
                                : "—"}
                        </dd>
                    </div>
                    {membership.transaction?.paid_at && (
                        <div className="flex items-center justify-between">
                            <dt className="text-gray-500">Dibayar</dt>
                            <dd className="text-gray-700">{membership.transaction.paid_at}</dd>
                        </div>
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
                        className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                    >
                        Simulasi Bayar
                    </button>
                )}
                {membership.status === "active" && (
                    <button
                        type="button"
                        onClick={() => handleUpdateStatus("expired")}
                        className="flex items-center justify-center rounded-2xl bg-orange-500 py-3 text-sm font-medium text-white transition-colors hover:bg-orange-600"
                    >
                        Tandai Expired
                    </button>
                )}
                {membership.status !== "cancelled" && (
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="flex items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 py-3 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-100"
                    >
                        Batalkan Membership
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
                <span className="font-mono text-xs font-semibold text-gray-700">
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
                    <div>
                        <p className="text-sm font-medium text-gray-900">{m.customer_name}</p>
                        <p className="text-[11px] text-gray-400">{m.customer_phone ?? "—"}</p>
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
                        <p className="text-sm text-gray-700">{formatDate(m.start_date)}</p>
                        <p className="text-[11px] text-gray-400">s/d {formatDate(m.end_date)}</p>
                    </div>
                );
            },
        }),
        listHelper.accessor("plan_name", {
            header: "Paket",
            cell: (info) => {
                const val = info.getValue();
                return val ? (
                    <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200">
                        {val}
                    </span>
                ) : (
                    <span className="text-gray-400">—</span>
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
                    <span className="text-sm font-semibold text-gray-900">
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
            columns={columns as ColumnDef<AdminMembership, unknown>[]}
            data={memberships}
            searchColumn="customer_name"
            searchPlaceholder="Cari nama member…"
            emptyMessage="Belum ada membership."
            toolbar={toolbar}
        />
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MembershipsIndex() {
    const { memberships, users, plans } = usePage<Props>().props;

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

    const toolbar = plans.length > 0 ? (
        <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="h-10 rounded-2xl border-0 bg-gray-50 px-3 text-sm text-gray-700 focus:ring-2 focus:ring-gray-900 transition-colors"
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

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4">
                    <span className="font-clash text-xs uppercase tracking-[0.2em] text-gray-400">
                        Manajemen Keanggotaan
                    </span>
                    <h1 className="font-monument text-3xl font-normal tracking-tight text-gray-900">
                        Memberships
                    </h1>
                </div>
            }
        >
            <Head title="Memberships" />

            <div className="flex flex-col gap-5 pt-6">
                {/* Stats row + toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-200">
                            {activeCount} aktif
                        </span>
                        {expiredCount > 0 && (
                            <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-200">
                                {expiredCount} expired
                            </span>
                        )}
                        {cancelledCount > 0 && (
                            <span className="rounded-full bg-rose-50 px-3 py-1 text-sm font-medium text-rose-600 ring-1 ring-inset ring-rose-200">
                                {cancelledCount} dibatalkan
                            </span>
                        )}
                        <span className="text-sm text-gray-500">{memberships.length} total</span>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowCreate(true)}
                        className="flex items-center gap-2 rounded-2xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                    >
                        <Plus size={15} />
                        Tambah Membership
                    </button>
                </div>

                {/* Per-plan stat cards */}
                {plansWithCount.length > 0 && (
                    <div className="flex gap-3 overflow-x-auto pb-1">
                        {plansWithCount.map((p, idx) => (
                            <div
                                key={p.id}
                                className={`${ADMIN_TOKENS.CARD} flex shrink-0 flex-col gap-1 p-4`}
                                style={{ minWidth: "140px" }}
                            >
                                <p className="font-clash text-[11px] font-medium uppercase tracking-wider text-gray-400 flex items-center gap-1">
                                    {idx === 0 && (
                                        <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700">
                                            #1
                                        </span>
                                    )}
                                    {idx === 1 && (
                                        <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[9px] font-bold text-gray-500">
                                            #2
                                        </span>
                                    )}
                                    {idx === 2 && (
                                        <span className="rounded-full bg-orange-50 px-1.5 py-0.5 text-[9px] font-bold text-orange-500">
                                            #3
                                        </span>
                                    )}
                                    {p.name}
                                </p>
                                <p className="font-monument text-3xl font-normal text-gray-900">
                                    {p.count}
                                </p>
                                <p className="text-[11px] text-gray-400">anggota aktif</p>
                            </div>
                        ))}
                    </div>
                )}

                <ListView memberships={filtered} onSelect={setSelected} toolbar={toolbar} />
            </div>

            {/* Detail SlideOver */}
            <SlideOver
                isOpen={selected !== null}
                onClose={() => setSelected(null)}
                title="Detail Membership"
                description={
                    selected
                        ? `${selected.customer_name} · ${formatDate(selected.start_date)} – ${formatDate(selected.end_date)}`
                        : undefined
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
                title="Tambah Membership"
                description="Daftarkan membership baru untuk anggota."
            >
                {showCreate && (
                    <CreateMembershipForm
                        users={users}
                        plans={plans}
                        onClose={() => setShowCreate(false)}
                    />
                )}
            </SlideOver>
        </AdminLayout>
    );
}
