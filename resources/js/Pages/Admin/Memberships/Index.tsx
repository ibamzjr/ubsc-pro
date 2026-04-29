import { Head, router, useForm, usePage } from "@inertiajs/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Eye, Plus } from "lucide-react";
import { useState } from "react";
import DataTable from "@/Components/Admin/DataTable";
import SlideOver from "@/Components/Admin/SlideOver";
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

type Props = PageProps<{
    memberships: AdminMembership[];
    users: MembershipUser[];
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
    onClose,
}: {
    users: MembershipUser[];
    onClose: () => void;
}) {
    const { data, setData, post, processing, errors } = useForm({
        user_id:    "",
        start_date: todayStr(),
        end_date:   "",
        amount:     "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.memberships.store"), { onSuccess: onClose });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-5">
            <div>
                <label className={labelBase}>Member (User)</label>
                <select
                    value={data.user_id}
                    onChange={(e) => setData("user_id", e.target.value)}
                    className={`${inputBase} mt-1.5`}
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

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelBase}>Tanggal Mulai</label>
                    <input
                        type="date"
                        value={data.start_date}
                        onChange={(e) => setData("start_date", e.target.value)}
                        className={`${inputBase} mt-1.5`}
                    />
                    {errors.start_date && (
                        <p className="mt-1 text-xs text-rose-500">{errors.start_date}</p>
                    )}
                </div>
                <div>
                    <label className={labelBase}>Tanggal Selesai</label>
                    <input
                        type="date"
                        value={data.end_date}
                        min={data.start_date || todayStr()}
                        onChange={(e) => setData("end_date", e.target.value)}
                        className={`${inputBase} mt-1.5`}
                    />
                    {errors.end_date && (
                        <p className="mt-1 text-xs text-rose-500">{errors.end_date}</p>
                    )}
                </div>
            </div>

            <div>
                <label className={labelBase}>Nominal (IDR)</label>
                <input
                    type="number"
                    value={data.amount}
                    min="0"
                    step="1000"
                    placeholder="0"
                    onChange={(e) => setData("amount", e.target.value)}
                    className={`${inputBase} mt-1.5`}
                />
                {errors.amount && (
                    <p className="mt-1 text-xs text-rose-500">{errors.amount}</p>
                )}
            </div>

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
}: {
    memberships: AdminMembership[];
    onSelect: (m: AdminMembership) => void;
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
        />
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MembershipsIndex() {
    const { memberships, users } = usePage<Props>().props;

    const [selected, setSelected]     = useState<AdminMembership | null>(null);
    const [showCreate, setShowCreate] = useState(false);

    const activeCount    = memberships.filter((m) => m.status === "active").length;
    const expiredCount   = memberships.filter((m) => m.status === "expired").length;
    const cancelledCount = memberships.filter((m) => m.status === "cancelled").length;

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

                <ListView memberships={memberships} onSelect={setSelected} />
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
                        onClose={() => setShowCreate(false)}
                    />
                )}
            </SlideOver>
        </AdminLayout>
    );
}
