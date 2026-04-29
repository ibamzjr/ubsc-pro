import { Head, router, usePage } from "@inertiajs/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { CheckCircle, Copy, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import DataTable from "@/Components/Admin/DataTable";
import SlideOver from "@/Components/Admin/SlideOver";
import { ADMIN_TOKENS } from "@/Components/Admin/tokens";
import AdminLayout from "@/Layouts/AdminLayout";
import { cn } from "@/lib/utils";
import type { PageProps } from "@/types";

// ── Types ──────────────────────────────────────────────────────────────────────

interface InternalUser {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface StaffForm {
    name: string;
    email: string;
    password: string;
    role: string;
}

type Props = PageProps<{
    users: InternalUser[];
    roles: string[];
}>;

// ── Role badge ────────────────────────────────────────────────────────────────

const ROLE_STYLE: Record<string, string> = {
    "Manager":             "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
    "Finance":             "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-200",
    "Staff Central":       "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
    "Staff Front Office":  "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
};

function RoleBadge({ role }: { role: string }) {
    return (
        <span className={cn(
            "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium",
            ROLE_STYLE[role] ?? "bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-200",
        )}>
            {role}
        </span>
    );
}

// ── Shared style constants ────────────────────────────────────────────────────

const inputBase =
    "w-full rounded-2xl border-0 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-900 transition-colors";
const labelBase =
    "font-clash text-xs font-medium uppercase tracking-wider text-gray-500";

// ── Credentials modal (shown once after a new account is created) ─────────────

function CredsModal({
    creds,
    onClose,
}: {
    creds: { email: string; password: string };
    onClose: () => void;
}) {
    const [copied, setCopied] = useState<"email" | "password" | null>(null);

    const copy = (field: "email" | "password", value: string) => {
        navigator.clipboard.writeText(value).then(() => {
            setCopied(field);
            setTimeout(() => setCopied(null), 1800);
        });
    };

    return (
        <>
            <div
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className={`${ADMIN_TOKENS.CARD_LARGE} w-full max-w-sm p-6`}>
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50">
                            <CheckCircle size={20} className="text-emerald-500" />
                        </div>
                        <div>
                            <p className="font-clash text-sm font-semibold text-gray-900">
                                Akun Berhasil Dibuat
                            </p>
                            <p className="text-[11px] text-gray-400">
                                Bagikan kredensial ini kepada staff yang bersangkutan
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        {(["email", "password"] as const).map((field) => (
                            <div key={field} className="rounded-2xl bg-gray-50 px-4 py-3">
                                <p className={cn(labelBase, "mb-1.5")}>
                                    {field === "email" ? "Email" : "Password"}
                                </p>
                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-mono text-sm text-gray-900 break-all">
                                        {creds[field]}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => copy(field, creds[field])}
                                        className={cn(
                                            "flex shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium transition-colors",
                                            copied === field
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-white text-gray-600 shadow-sm hover:bg-gray-100",
                                        )}
                                    >
                                        <Copy size={12} />
                                        {copied === field ? "Tersalin" : "Salin"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="mt-5 w-full rounded-2xl bg-gray-900 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </>
    );
}

// ── Row actions ───────────────────────────────────────────────────────────────

function RowActions({
    user,
    onEdit,
    onDelete,
    isDeleting,
}: {
    user: InternalUser;
    onEdit: (u: InternalUser) => void;
    onDelete: (u: InternalUser) => void;
    isDeleting: boolean;
}) {
    return (
        <div className="flex items-center gap-1.5">
            <button
                type="button"
                onClick={() => onEdit(user)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                title="Edit"
            >
                <Pencil size={13} />
            </button>
            <button
                type="button"
                disabled={isDeleting}
                onClick={() => onDelete(user)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-400 transition-colors hover:bg-rose-100 hover:text-rose-600 disabled:opacity-40"
                title="Hapus"
            >
                <Trash2 size={13} />
            </button>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const helper = createColumnHelper<InternalUser>();

export default function UsersIndex() {
    const { users, roles } = usePage<Props>().props;

    // ── SlideOver state ───────────────────────────────────────────────────────
    const emptyForm: StaffForm = { name: "", email: "", password: "", role: roles[0] ?? "" };

    const [showSlideOver, setShowSlideOver]   = useState(false);
    const [editingUser, setEditingUser]        = useState<InternalUser | null>(null);
    const [form, setForm]                      = useState<StaffForm>(emptyForm);
    const [errors, setErrors]                  = useState<Partial<StaffForm>>({});
    const [saving, setSaving]                  = useState(false);
    const [createdCreds, setCreatedCreds]      = useState<{ email: string; password: string } | null>(null);
    const [deletingId, setDeletingId]          = useState<number | null>(null);

    const f = (k: keyof StaffForm) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
            setForm((p) => ({ ...p, [k]: e.target.value }));

    const openCreate = () => {
        setEditingUser(null);
        setForm(emptyForm);
        setErrors({});
        setShowSlideOver(true);
    };

    const openEdit = (user: InternalUser) => {
        setEditingUser(user);
        setForm({ name: user.name, email: user.email, password: "", role: user.role });
        setErrors({});
        setShowSlideOver(true);
    };

    const closeSlideOver = () => {
        setShowSlideOver(false);
        setErrors({});
    };

    const handleSubmit = () => {
        setSaving(true);
        const captured = { email: form.email, password: form.password };

        const opts = {
            onSuccess: () => {
                closeSlideOver();
                if (!editingUser) setCreatedCreds(captured);
            },
            onError: (errs: Record<string, string>) =>
                setErrors(errs as Partial<StaffForm>),
            onFinish: () => setSaving(false),
        };

        if (editingUser) {
            router.put(route("admin.settings.users.update", editingUser.id), { ...form }, opts);
        } else {
            router.post(route("admin.settings.users.store"), { ...form }, opts);
        }
    };

    const handleDelete = (user: InternalUser) => {
        if (!confirm(`Hapus akun "${user.name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
        setDeletingId(user.id);
        router.delete(route("admin.settings.users.destroy", user.id), {
            onFinish: () => setDeletingId(null),
        });
    };

    // ── Table columns ─────────────────────────────────────────────────────────

    const columns = [
        helper.accessor("name", {
            header: "Nama",
            enableSorting: true,
            cell: (info) => {
                const u = info.row.original;
                return (
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 font-clash text-xs font-medium text-white">
                            {u.name[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{u.name}</span>
                    </div>
                );
            },
        }),
        helper.accessor("email", {
            header: "Email",
            cell: (info) => (
                <span className="text-sm text-gray-500">{info.getValue()}</span>
            ),
        }),
        helper.accessor("role", {
            header: "Peran",
            cell: (info) => <RoleBadge role={info.getValue()} />,
        }),
        helper.display({
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => (
                <RowActions
                    user={row.original}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                    isDeleting={deletingId === row.original.id}
                />
            ),
        }),
    ] as ColumnDef<InternalUser, unknown>[];

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4">
                    <span className="font-clash text-xs uppercase tracking-[0.2em] text-gray-400">
                        Settings
                    </span>
                    <h1 className="font-monument text-3xl font-normal tracking-tight text-gray-900">
                        Internal Users
                    </h1>
                </div>
            }
        >
            <Head title="Internal Users" />

            <div className="pt-6">
                <DataTable
                    columns={columns}
                    data={users}
                    searchColumn="name"
                    searchPlaceholder="Cari nama staff…"
                    emptyMessage="Belum ada internal staff. Tambahkan akun baru."
                    toolbar={
                        <button
                            type="button"
                            onClick={openCreate}
                            className="flex items-center gap-2 rounded-2xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                        >
                            <Plus size={15} />
                            Tambah Staff
                        </button>
                    }
                />
            </div>

            {/* ── SlideOver: Create / Edit ───────────────────────────────── */}
            <SlideOver
                isOpen={showSlideOver}
                onClose={closeSlideOver}
                title={editingUser ? "Edit Staff" : "Tambah Staff Baru"}
                description={
                    editingUser
                        ? `Perbarui data akun ${editingUser.name}`
                        : "Buat akun baru untuk anggota tim internal"
                }
            >
                {showSlideOver && (
                    <div className="flex flex-col gap-5">
                        {/* Name */}
                        <div>
                            <label className={labelBase}>Nama Lengkap</label>
                            <input
                                type="text"
                                value={form.name}
                                placeholder="Masukkan nama lengkap"
                                autoFocus
                                onChange={f("name")}
                                className={cn(inputBase, "mt-1.5", errors.name && "ring-2 ring-rose-400")}
                            />
                            {errors.name && (
                                <p className="mt-1 text-[11px] text-rose-500">{errors.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className={labelBase}>Email</label>
                            <input
                                type="email"
                                value={form.email}
                                placeholder="staff@ubsc.id"
                                onChange={f("email")}
                                className={cn(inputBase, "mt-1.5", errors.email && "ring-2 ring-rose-400")}
                            />
                            {errors.email && (
                                <p className="mt-1 text-[11px] text-rose-500">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className={labelBase}>
                                Password
                                {editingUser && (
                                    <span className="ml-1 normal-case text-gray-400">
                                        (kosongkan jika tidak diubah)
                                    </span>
                                )}
                            </label>
                            <input
                                type="password"
                                value={form.password}
                                placeholder={editingUser ? "••••••••" : "Min. 8 karakter"}
                                onChange={f("password")}
                                className={cn(inputBase, "mt-1.5", errors.password && "ring-2 ring-rose-400")}
                            />
                            {errors.password && (
                                <p className="mt-1 text-[11px] text-rose-500">{errors.password}</p>
                            )}
                        </div>

                        {/* Role */}
                        <div>
                            <label className={labelBase}>Peran (Role)</label>
                            <select
                                value={form.role}
                                onChange={f("role")}
                                className={cn(inputBase, "mt-1.5 cursor-pointer", errors.role && "ring-2 ring-rose-400")}
                            >
                                {roles.map((r) => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                            {errors.role && (
                                <p className="mt-1 text-[11px] text-rose-500">{errors.role}</p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={saving || !form.name.trim() || !form.email.trim()}
                                className="flex-1 rounded-2xl bg-gray-900 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
                            >
                                {saving
                                    ? "Menyimpan…"
                                    : editingUser ? "Simpan Perubahan" : "Buat Akun"}
                            </button>
                            <button
                                type="button"
                                onClick={closeSlideOver}
                                className="rounded-2xl px-5 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                )}
            </SlideOver>

            {/* ── Credentials modal ─────────────────────────────────────── */}
            {createdCreds && (
                <CredsModal
                    creds={createdCreds}
                    onClose={() => setCreatedCreds(null)}
                />
            )}
        </AdminLayout>
    );
}
