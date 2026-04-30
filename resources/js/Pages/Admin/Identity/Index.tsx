import { Head, router, usePage } from "@inertiajs/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import {
    AlertTriangle,
    CheckCircle,
    Eye,
    FileQuestion,
    X,
    XCircle,
} from "lucide-react";
import { useState } from "react";
import DataTable from "@/Components/Admin/DataTable";
import { IdentityStatusBadge } from "@/Components/Admin/StatusBadge";
import AdminLayout from "@/Layouts/AdminLayout";
import { cn } from "@/lib/utils";
import type { IdentityCategory, IdentityUser, PageProps } from "@/types";

type Props = PageProps<{ users: IdentityUser[] }>;

const helper = createColumnHelper<IdentityUser>();

// ── Shared style constants ────────────────────────────────────────────────────

const inputBase =
    "w-full rounded-2xl border-0 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-900 transition-colors";
const labelBase =
    "font-clash text-xs font-medium uppercase tracking-wider text-gray-500";

// ── Document Lightbox ─────────────────────────────────────────────────────────

interface LightboxState {
    user: IdentityUser;
    category: IdentityCategory;
}

function DocLightbox({
    state,
    onClose,
}: {
    state: LightboxState;
    onClose: () => void;
}) {
    const { user } = state;
    const [category, setCategory]   = useState<IdentityCategory>(state.category);
    const [loading, setLoading]     = useState(false);
    const [imgError, setImgError]   = useState(false);

    const submit = (status: "verified" | "rejected") => {
        setLoading(true);
        router.patch(
            route("admin.identity.verify", user.id),
            { status, identity_category: category },
            {
                onSuccess: onClose,
                onFinish: () => setLoading(false),
            },
        );
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Panel */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="relative flex w-full max-w-3xl flex-col gap-0 overflow-hidden rounded-3xl bg-white shadow-2xl">

                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                        <div>
                            <p className="font-clash text-sm font-semibold text-gray-900">
                                {user.name}
                            </p>
                            <p className="mt-0.5 text-xs text-gray-400">
                                {user.email}
                                {user.phone_number ? ` · ${user.phone_number}` : ""}
                                {" · "}
                                Diajukan {user.updated_at}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Body — image left, form right */}
                    <div className="flex flex-col gap-0 xl:flex-row">

                        {/* Image viewer */}
                        <div className="flex min-h-64 flex-1 items-center justify-center bg-gray-950 xl:min-h-80">
                            {user.document_url && !imgError ? (
                                <img
                                    src={user.document_url}
                                    alt={`Dokumen identitas ${user.name}`}
                                    className="max-h-96 w-full object-contain"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-3 py-12 text-gray-600">
                                    <FileQuestion size={36} className="opacity-40" />
                                    <p className="text-sm opacity-60">
                                        {imgError
                                            ? "Gagal memuat dokumen"
                                            : "Tidak ada dokumen diunggah"}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Verification form */}
                        <div className="flex w-full flex-col gap-5 p-6 xl:w-72 xl:shrink-0">

                            {/* Identity number */}
                            {user.identity_number && (
                                <div>
                                    <p className={labelBase}>Nomor Identitas</p>
                                    <p className="mt-1 font-mono text-sm font-medium text-gray-900">
                                        {user.identity_number}
                                    </p>
                                </div>
                            )}

                            {/* Category correction */}
                            <div>
                                <label className={cn(labelBase, "mb-1.5 block")}>
                                    Kategori
                                    <span className="ml-1 normal-case text-gray-400">
                                        (koreksi jika perlu)
                                    </span>
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) =>
                                        setCategory(e.target.value as IdentityCategory)
                                    }
                                    className={inputBase}
                                >
                                    <option value="warga_kampus">Warga Kampus (UB)</option>
                                    <option value="umum">Umum</option>
                                </select>
                                {category !== state.category && (
                                    <p className="mt-1.5 flex items-center gap-1 text-[11px] text-amber-600">
                                        <AlertTriangle size={11} />
                                        Kategori akan diubah dari &quot;
                                        {state.category === "warga_kampus"
                                            ? "Warga Kampus"
                                            : "Umum"}
                                        &quot;
                                    </p>
                                )}
                            </div>

                            {/* Status badge */}
                            <div>
                                <p className={labelBase}>Status Saat Ini</p>
                                <div className="mt-1.5">
                                    <IdentityStatusBadge status={user.identity_status} />
                                </div>
                            </div>

                            {/* Action buttons — only shown for pending */}
                            {user.identity_status === "pending" ? (
                                <div className="mt-auto flex flex-col gap-2.5 pt-2">
                                    <button
                                        type="button"
                                        disabled={loading}
                                        onClick={() => submit("verified")}
                                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                                    >
                                        <CheckCircle size={15} />
                                        Verifikasi
                                    </button>
                                    <button
                                        type="button"
                                        disabled={loading}
                                        onClick={() => submit("rejected")}
                                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-50 py-3 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-100 disabled:opacity-50 ring-1 ring-inset ring-rose-200"
                                    >
                                        <XCircle size={15} />
                                        Tolak
                                    </button>
                                </div>
                            ) : (
                                <p className="mt-auto text-center text-xs text-gray-400">
                                    Identitas ini sudah diproses.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// ── Action Buttons (table row) ────────────────────────────────────────────────

function RowActions({
    user,
    onViewDoc,
}: {
    user: IdentityUser;
    onViewDoc: (u: IdentityUser) => void;
}) {
    const [loading, setLoading] = useState(false);

    const verify = (status: "verified" | "rejected") => {
        setLoading(true);
        router.patch(
            route("admin.identity.verify", user.id),
            { status },
            { onFinish: () => setLoading(false) },
        );
    };

    const isPending = user.identity_status === "pending";

    return (
        <div className="flex items-center gap-1.5">
            {/* View document */}
            {user.has_document && (
                <button
                    type="button"
                    onClick={() => onViewDoc(user)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                    title="Lihat dokumen"
                >
                    <Eye size={14} />
                </button>
            )}

            {/* Inline approve / reject for pending items */}
            {isPending && (
                <>
                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => verify("verified")}
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors hover:bg-emerald-100 disabled:opacity-50"
                        title="Verifikasi"
                    >
                        <CheckCircle size={14} />
                    </button>
                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => verify("rejected")}
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-500 transition-colors hover:bg-rose-100 disabled:opacity-50"
                        title="Tolak"
                    >
                        <XCircle size={14} />
                    </button>
                </>
            )}

            {!user.has_document && !isPending && (
                <span className="text-xs text-gray-400">—</span>
            )}
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function IdentityIndex() {
    const { users } = usePage<Props>().props;
    const pending   = users.filter((u) => u.identity_status === "pending").length;

    const [lightbox, setLightbox] = useState<LightboxState | null>(null);

    const openLightbox = (user: IdentityUser) => {
        setLightbox({ user, category: user.identity_category });
    };

    const columns = [
        helper.accessor("name", {
            header: "Nama",
            enableSorting: true,
            cell: (info) => {
                const u = info.row.original;
                return (
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 font-clash text-xs font-medium text-white">
                            {u.name.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase()}
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 leading-snug">{u.name}</p>
                            <p className="text-[11px] text-gray-400">{u.email}</p>
                        </div>
                    </div>
                );
            },
        }),
        helper.accessor("identity_category", {
            header: "Kategori",
            cell: (info) => (
                <span className={cn(
                    "inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium",
                    info.getValue() === "warga_kampus"
                        ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200"
                        : "bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-200",
                )}>
                    {info.getValue() === "warga_kampus" ? "Warga Kampus" : "Umum"}
                </span>
            ),
        }),
        helper.accessor("identity_number", {
            header: "No. Identitas",
            cell: (info) => (
                <span className="font-mono text-xs text-gray-600">
                    {info.getValue() ?? "—"}
                </span>
            ),
        }),
        helper.accessor("updated_at", {
            header: "Diajukan",
            enableSorting: true,
            cell: (info) => (
                <span className="text-xs text-gray-500">{info.getValue()}</span>
            ),
        }),
        helper.accessor("identity_status", {
            header: "Status",
            cell: (info) => <IdentityStatusBadge status={info.getValue()} />,
        }),
        helper.display({
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => (
                <RowActions user={row.original} onViewDoc={openLightbox} />
            ),
        }),
    ] as ColumnDef<IdentityUser, unknown>[];

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4">
                    <span className="font-clash text-xs uppercase tracking-[0.2em] text-gray-400">
                        Staff Front Office
                    </span>
                    <h1 className="font-monument text-3xl font-normal tracking-tight text-gray-900">
                        Identity Queue
                    </h1>
                </div>
            }
        >
            <Head title="Identity Queue" />

            <div className="flex flex-col gap-6 pt-6">
                <div className="flex items-center gap-3">
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 ring-1 ring-inset ring-amber-200">
                        {pending} menunggu review
                    </span>
                    <span className="text-sm text-gray-500">
                        {users.length} total pengajuan
                    </span>
                </div>

                <DataTable
                    columns={columns}
                    data={users}
                    searchColumn="name"
                    searchPlaceholder="Cari nama…"
                    emptyMessage="Belum ada pengajuan identitas."
                />
            </div>

            {lightbox && (
                <DocLightbox
                    state={lightbox}
                    onClose={() => setLightbox(null)}
                />
            )}
        </AdminLayout>
    );
}
