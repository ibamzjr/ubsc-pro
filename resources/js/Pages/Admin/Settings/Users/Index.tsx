import { Head, router, usePage } from "@inertiajs/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { CheckCircle, Copy, Pencil, Plus, Trash2, Users } from "lucide-react";
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

// ── Global styles (mirrors Roles.tsx design system) ───────────────────────────

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
        from { opacity: 0; transform: scale(0.95); }
        to   { opacity: 1; transform: scale(1); }
    }

    .animate-fade-in-up   { animation: fadeInUp  0.65s cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; will-change:opacity,transform; }
    .animate-fade-in-left { animation: fadeInLeft 0.55s cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; will-change:opacity,transform; }
    .animate-scale-in     { animation: scaleIn    0.5s  cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; }

    .delay-50  { animation-delay:  50ms; }
    .delay-100 { animation-delay: 100ms; }
    .delay-150 { animation-delay: 150ms; }
    .delay-200 { animation-delay: 200ms; }
    .delay-250 { animation-delay: 250ms; }
    .delay-300 { animation-delay: 300ms; }

    /* ── Shimmer sweep — one-shot on load ── */
    @keyframes shimmerSweep {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(200%); }
    }
    .shimmer-once {
        position: relative;
        overflow: hidden;
    }
    .shimmer-once::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
            105deg,
            transparent 0%,
            rgba(255,255,255,0.45) 50%,
            transparent 100%
        );
        width: 60%;
        animation: shimmerSweep 1.1s ease-out 0.5s forwards;
        pointer-events: none;
        border-radius: inherit;
    }

    /* ── Icon glow pulse ── */
    @keyframes iconGlow {
        0%, 100% { box-shadow: 0 2px 8px rgba(15,23,42,0.2); }
        50%       { box-shadow: 0 2px 16px rgba(15,23,42,0.3), 0 0 24px rgba(251,191,36,0.12); }
    }
    .icon-glow { animation: iconGlow 3.5s ease-in-out infinite; }

    /* ── Card border breathing ── */
    @keyframes cardBreath {
        0%, 100% { box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 0 0 1px rgba(226,232,240,0.8); }
        50%       { box-shadow: 0 4px 16px rgba(0,0,0,0.07), 0 0 0 1px rgba(251,191,36,0.2); }
    }
    .card-breath { animation: cardBreath 5s ease-in-out infinite; }

    /* ── Save / primary button shimmer ── */
    @keyframes btnSheen {
        0%   { left: -80%; }
        100% { left: 120%; }
    }
    .btn-sheen {
        position: relative;
        overflow: hidden;
    }
    .btn-sheen::before {
        content: '';
        position: absolute;
        top: 0; bottom: 0; width: 50%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        animation: btnSheen 3s ease-in-out 1s infinite;
    }

    /* ── Top glint line on cards ── */
    .card-glint::before {
        content: '';
        position: absolute;
        top: 0; left: 20px; right: 20px; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent);
        pointer-events: none;
    }

    /* ── Avatar glow (online dot) ── */
    @keyframes thumbGlow {
        0%, 100% { box-shadow: 0 1px 4px rgba(0,0,0,0.2), 0 0 0 0 rgba(251,191,36,0); }
        50%       { box-shadow: 0 1px 8px rgba(0,0,0,0.25), 0 0 10px 2px rgba(251,191,36,0.25); }
    }
    .avatar-glow { animation: thumbGlow 3.5s ease-in-out infinite; }

    /* ── Stagger children ── */
    .stagger > *:nth-child(1) { animation-delay:  80ms; }
    .stagger > *:nth-child(2) { animation-delay: 140ms; }
    .stagger > *:nth-child(3) { animation-delay: 200ms; }
    .stagger > *:nth-child(4) { animation-delay: 260ms; }
    .stagger > *:nth-child(5) { animation-delay: 320ms; }
`;

// ── Role badge ────────────────────────────────────────────────────────────────

const ROLE_STYLE: Record<string, string> = {
    "Manager":             "bg-sky-50 text-sky-700 ring-1 ring-sky-200/70",
    "Finance":             "bg-violet-50 text-violet-700 ring-1 ring-violet-200/70",
    "Staff Central":       "bg-amber-50 text-amber-700 ring-1 ring-amber-200/70",
    "Staff Front Office":  "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/70",
};

function RoleBadge({ role }: { role: string }) {
    return (
        <span className={cn(
            "inline-flex items-center rounded-lg px-2.5 py-[5px] font-bdo text-[11px] font-semibold uppercase tracking-wide",
            ROLE_STYLE[role] ?? "bg-slate-100 text-slate-600 ring-1 ring-slate-200/70",
        )}>
            {role}
        </span>
    );
}

// ── ShinyIcon — dark gradient icon wrapper (mirrors Roles.tsx) ─────────────────

function ShinyIcon({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn(
            "relative flex shrink-0 items-center justify-center rounded-xl",
            "bg-gradient-to-br from-slate-600 to-slate-900",
            "shadow-[0_2px_10px_rgba(15,23,42,0.22),inset_0_1px_0_rgba(255,255,255,0.12)]",
            "icon-glow",
            className,
        )}>
            {children}
            {/* Top glint */}
            <span className="pointer-events-none absolute top-[3px] left-[5px] right-[5px] h-[5px] rounded-full bg-white/20 blur-[1px]" />
        </div>
    );
}

// ── Shared style constants ────────────────────────────────────────────────────

const inputBase =
    "w-full rounded-2xl border-0 bg-slate-50 px-4 py-3 font-bdo text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-800 transition-colors";
const labelBase =
    "font-bdo text-[10px] font-bold uppercase tracking-widest text-slate-400";

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
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="animate-scale-in relative card-glint shimmer-once w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
                    {/* Top glint absolute line */}
                    <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/70 to-transparent" />

                    {/* Header */}
                    <div className="mb-5 flex items-center gap-3">
                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_2px_10px_rgba(16,185,129,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]">
                            <CheckCircle size={18} className="text-white" />
                            <span className="pointer-events-none absolute top-[3px] left-[4px] right-[4px] h-[5px] rounded-full bg-white/30 blur-[1px]" />
                        </div>
                        <div>
                            <p className="font-clash text-sm font-semibold text-slate-900">
                                Akun Berhasil Dibuat
                            </p>
                            <p className="font-bdo text-[11px] text-slate-400">
                                Bagikan kredensial ini kepada staff yang bersangkutan
                            </p>
                        </div>
                    </div>

                    {/* Credential fields */}
                    <div className="flex flex-col gap-3">
                        {(["email", "password"] as const).map((field) => (
                            <div key={field} className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200/60">
                                <p className={cn(labelBase, "mb-1.5")}>
                                    {field === "email" ? "Email" : "Password"}
                                </p>
                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-mono text-sm text-slate-900 break-all">
                                        {creds[field]}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => copy(field, creds[field])}
                                        className={cn(
                                            "flex shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-1.5 font-bdo text-[11px] font-semibold transition-all duration-200",
                                            copied === field
                                                ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200/70"
                                                : "bg-white text-slate-600 shadow-sm ring-1 ring-slate-200/60 hover:bg-slate-100 hover:text-slate-900",
                                        )}
                                    >
                                        <Copy size={11} />
                                        {copied === field ? "Tersalin" : "Salin"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Close button */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-sheen relative mt-5 w-full rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 py-3 font-clash text-sm font-semibold text-white shadow-[0_4px_14px_rgba(15,23,42,0.22),inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-200 hover:shadow-[0_6px_20px_rgba(15,23,42,0.28)] hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <span className="pointer-events-none absolute top-0 left-0 right-0 h-px rounded-t-2xl bg-white/20" />
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
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-all duration-200 hover:bg-slate-200 hover:text-slate-900 hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                title="Edit"
            >
                <Pencil size={13} />
            </button>
            <button
                type="button"
                disabled={isDeleting}
                onClick={() => onDelete(user)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-400 ring-1 ring-rose-200/60 transition-all duration-200 hover:bg-rose-100 hover:text-rose-600 hover:ring-rose-300/70 disabled:opacity-40"
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
                        {/* Avatar — mirrors ShinyIcon style */}
                        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-600 to-slate-900 font-clash text-xs font-semibold text-white shadow-[0_2px_8px_rgba(15,23,42,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] avatar-glow">
                            {u.name[0]?.toUpperCase()}
                            <span className="pointer-events-none absolute top-[3px] left-[3px] right-[3px] h-[4px] rounded-full bg-white/20 blur-[0.5px]" />
                        </div>
                        <span className="font-clash text-sm font-medium text-slate-900">{u.name}</span>
                    </div>
                );
            },
        }),
        helper.accessor("email", {
            header: "Email",
            cell: (info) => (
                <span className="font-bdo text-sm text-slate-400">{info.getValue()}</span>
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
                <div className="flex flex-col gap-1 pt-4 animate-fade-in-up">
                    <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
                    <span className="font-bdo text-[11px] font-medium tracking-wide text-orange-400">
                        Pengaturan Sistem
                    </span>
                    <h1 className="font-clash text-3xl font-bold tracking-tight xl:text-4xl text-slate-900 uppercase">
                        Pengguna Internal
                    </h1>
                </div>
            }
        >
            <Head title="Internal Users" />

            {/* ── Stats / summary bar ───────────────────────────────────── */}
            <div className="pt-6 pb-3 animate-fade-in-up delay-100">
                <div className="relative card-glint shimmer-once flex flex-wrap items-center justify-between gap-3 overflow-hidden rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
                    <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/70 to-transparent" />

                    <div className="flex items-center gap-3">
                        <ShinyIcon className="h-10 w-10">
                            <Users size={16} className="text-amber-300" />
                        </ShinyIcon>
                        <div>
                            <p className="font-bdo text-[10px] font-medium tracking-wide text-slate-400">
                                Manajemen Akun
                            </p>
                            <p className="font-clash text-lg font-Semibold leading-tight text-slate-900">
                                Pengguna Internal
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        {/* User count chip */}
                        <div className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 ring-1 ring-emerald-200/70">
                            <span className="h-1.5 w-1.5 rounded-full bg-lime-400 animate-pulse" />
                            <span className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-600 tabular-nums">
                                {users.length} Akun
                            </span>
                        </div>

                        {/* Add staff button */}
                        <button
                            type="button"
                            onClick={openCreate}
                            className="btn-sheen relative flex items-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 px-4 py-2.5 font-clash text-sm font-semibold text-white shadow-[0_4px_14px_rgba(15,23,42,0.22),inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-200 hover:shadow-[0_6px_20px_rgba(15,23,42,0.28)] hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <span className="pointer-events-none absolute top-0 left-0 right-0 h-px rounded-t-xl bg-white/20" />
                            <Plus size={15} />
                            Tambah Staff
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Data table ────────────────────────────────────────────── */}
            <div className="animate-fade-in-up delay-200">
                <DataTable
                    columns={columns}
                    data={users}
                    searchColumn="name"
                    searchPlaceholder="Cari nama peran…"
                    emptyMessage="Belum ada internal staff. Tambahkan akun baru."
                    toolbar={null}
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
                                <p className="mt-1 font-bdo text-[11px] text-rose-500">{errors.name}</p>
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
                                <p className="mt-1 font-bdo text-[11px] text-rose-500">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className={labelBase}>
                                Password
                                {editingUser && (
                                    <span className="ml-1 normal-case font-normal text-slate-400">
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
                                <p className="mt-1 font-bdo text-[11px] text-rose-500">{errors.password}</p>
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
                                <p className="mt-1 font-bdo text-[11px] text-rose-500">{errors.role}</p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={saving || !form.name.trim() || !form.email.trim()}
                                className="btn-sheen relative flex-1 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 py-3 font-clash text-sm font-semibold text-white shadow-[0_4px_14px_rgba(15,23,42,0.22),inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-200 hover:shadow-[0_6px_20px_rgba(15,23,42,0.28)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            >
                                <span className="pointer-events-none absolute top-0 left-0 right-0 h-px rounded-t-2xl bg-white/20" />
                                {saving
                                    ? "Menyimpan…"
                                    : editingUser ? "Simpan Perubahan" : "Buat Akun"}
                            </button>
                            <button
                                type="button"
                                onClick={closeSlideOver}
                                className="rounded-2xl px-5 py-3 font-clash text-sm font-medium text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700"
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