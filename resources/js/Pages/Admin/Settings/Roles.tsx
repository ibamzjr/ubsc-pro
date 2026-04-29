import { Head, router, usePage } from "@inertiajs/react";
import { Lock, Plus, Shield, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { ADMIN_TOKENS } from "@/Components/Admin/tokens";
import AdminLayout from "@/Layouts/AdminLayout";
import { cn } from "@/lib/utils";
import type { PageProps } from "@/types";

// ── Types ──────────────────────────────────────────────────────────────────────

interface RoleData {
    id: number;
    name: string;
    permissions: string[];
    users_count: number;
    online_users_count: number;
}

interface PermissionItem {
    key: string;
    label: string;
}

interface PermissionGroup {
    id: string;
    letter: string;
    label: string;
    items: PermissionItem[];
}

type Props = PageProps<{ roles: RoleData[] }>;

// ── Permission groups — keys must match backend permission names ───────────────

// ─── PERMISSION KEY REGISTRY ───────────────────────────────────────────────────
//
// Each `key` here MUST match exactly:
//   • The permission name in RoleAndPermissionSeeder.php
//   • The string passed to $this->authorize() in the relevant controller
//
// If you add a new permission, update the seeder AND the controller first,
// then add it here so the UI can manage it.
//
const PERMISSION_GROUPS: PermissionGroup[] = [
    {
        id: "dashboard", letter: "A", label: "Beranda & Dasbor",
        items: [
            { key: "view-stats",    label: "Melihat Statistik Dasbor" },
            { key: "view-reports",  label: "Melihat Laporan Keuangan" },
        ],
    },
    {
        id: "booking", letter: "B", label: "Reservasi & Jadwal",
        items: [
            { key: "view-bookings",          label: "Melihat Daftar Reservasi" },
            { key: "manage-bookings",        label: "Membuat, Mengubah & Membatalkan Reservasi" },
            { key: "manage-booking-limits",  label: "Mengatur Batas & Jadwal Reservasi" },
        ],
    },
    {
        id: "facility", letter: "C", label: "Fasilitas & Lapangan",
        items: [
            { key: "view-facilities",   label: "Melihat Daftar Fasilitas" },
            { key: "manage-facilities", label: "Menambah, Mengubah & Menghapus Fasilitas" },
            { key: "manage-pricing",    label: "Mengatur Harga & Diskon" },
        ],
    },
    {
        id: "cms", letter: "D", label: "Konten & CMS",
        items: [
            { key: "manage-cms",    label: "Mengelola Berita, Promo, Reels & Sponsor" },
            { key: "publish-news",  label: "Mempublikasikan Artikel Berita" },
        ],
    },
    {
        id: "member", letter: "E", label: "Member & Pelanggan",
        items: [
            { key: "view-members",         label: "Melihat Daftar Member & Pelanggan" },
            { key: "manage-members",       label: "Mengelola Data Member" },
            { key: "manage-payment-links", label: "Membuat & Membatalkan Payment Link" },
        ],
    },
    {
        id: "identity", letter: "F", label: "Verifikasi UBSC",
        items: [
            { key: "verify-identity", label: "Validasi Identitas Warga UB (Identity Queue)" },
        ],
    },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function ToggleSwitch({
    enabled,
    disabled = false,
    onChange,
}: {
    enabled: boolean;
    disabled?: boolean;
    onChange?: (v: boolean) => void;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={enabled}
            disabled={disabled}
            onClick={() => !disabled && onChange?.(!enabled)}
            className={cn(
                "relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2",
                disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
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

function GroupCard({
    group,
    perms,
    readOnly,
    onToggle,
}: {
    group: PermissionGroup;
    perms: Set<string>;
    readOnly: boolean;
    onToggle: (key: string) => void;
}) {
    const activeCount = group.items.filter((i) => perms.has(i.key)).length;
    const total       = group.items.length;
    const allOn       = activeCount === total;
    const allOff      = activeCount === 0;

    return (
        <div className={`${ADMIN_TOKENS.CARD_LARGE} overflow-hidden`}>
            <div className="flex items-center justify-between border-b border-gray-50 px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gray-900 font-clash text-xs font-semibold text-white">
                        {group.letter}
                    </div>
                    <p className="font-clash text-sm font-semibold text-gray-900">
                        {group.label}
                    </p>
                </div>
                <span className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-medium",
                    allOn  ? "bg-emerald-50 text-emerald-600" :
                    allOff ? "bg-gray-100 text-gray-400"       :
                             "bg-amber-50 text-amber-600",
                )}>
                    {activeCount}/{total} aktif
                </span>
            </div>
            <ul className="divide-y divide-gray-50 px-5">
                {group.items.map((item) => {
                    const on = perms.has(item.key);
                    return (
                        <li key={item.key} className="flex items-center justify-between py-3.5">
                            <span className={cn(
                                "text-sm transition-colors",
                                on ? "text-gray-900" : "text-gray-400",
                            )}>
                                {item.label}
                            </span>
                            <ToggleSwitch
                                enabled={on}
                                disabled={readOnly}
                                onChange={() => onToggle(item.key)}
                            />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function RolesPage() {
    const { roles, auth } = usePage<Props>().props;
    const isAdmin = auth.user?.role === "Administrator";

    // ── Admin state ────────────────────────────────────────────────────────────

    const buildLocalPerms = (r: RoleData[]) =>
        Object.fromEntries(r.map((role) => [role.id, new Set(role.permissions)])) as Record<number, Set<string>>;

    const [activeRoleId, setActiveRoleId] = useState<number>(() => roles[0]?.id ?? 0);
    const [localPerms, setLocalPerms]     = useState<Record<number, Set<string>>>(() => buildLocalPerms(roles));
    const [saveStatus, setSaveStatus]     = useState<"idle" | "saving" | "saved">("idle");

    // Sync local state after a successful save (roles prop refreshes from backend)
    const rolesFingerprint = JSON.stringify(roles.map((r) => r.permissions.slice().sort()).join());
    useEffect(() => {
        setLocalPerms(buildLocalPerms(roles));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rolesFingerprint]);

    const activeRole   = roles.find((r) => r.id === activeRoleId) ?? roles[0];
    const currentPerms = localPerms[activeRoleId] ?? new Set<string>();

    const toggle = (key: string) =>
        setLocalPerms((prev) => {
            const next = new Set(prev[activeRoleId]);
            next.has(key) ? next.delete(key) : next.add(key);
            return { ...prev, [activeRoleId]: next };
        });

    const handleSave = () => {
        if (!activeRole) return;
        setSaveStatus("saving");
        router.put(
            route("admin.settings.roles.update", activeRole.id),
            { permissions: Array.from(currentPerms) },
            {
                onSuccess: () => {
                    setSaveStatus("saved");
                    setTimeout(() => setSaveStatus("idle"), 2500);
                },
                onError: () => setSaveStatus("idle"),
            },
        );
    };

    // ── Non-admin: own permissions read-only ───────────────────────────────────

    const myPerms = new Set<string>(auth.user?.permissions ?? []);

    // ── Shared permission matrix renderer ─────────────────────────────────────

    const renderMatrix = (perms: Set<string>, readOnly: boolean) => (
        <div className="flex flex-col gap-4">
            {PERMISSION_GROUPS.map((group) => (
                <GroupCard
                    key={group.id}
                    group={group}
                    perms={perms}
                    readOnly={readOnly}
                    onToggle={toggle}
                />
            ))}
        </div>
    );

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4">
                    <span className="font-clash text-xs uppercase tracking-[0.2em] text-gray-400">
                        Settings
                    </span>
                    <h1 className="font-monument text-3xl font-normal tracking-tight text-gray-900">
                        Role & Access
                    </h1>
                </div>
            }
        >
            <Head title="Role & Access" />

            {isAdmin ? (
                /* ══════════════════════════════════════════════════════════════
                   ADMIN VIEW — Split-pane editable matrix
                ══════════════════════════════════════════════════════════════ */
                <div className="flex flex-col gap-5 pt-6 xl:flex-row xl:items-start">

                    {/* Left pane: role selector */}
                    <div className="w-full shrink-0 xl:sticky xl:top-6 xl:w-72">
                        <div className={`${ADMIN_TOKENS.CARD_LARGE} overflow-hidden`}>
                            <div className="px-5 pb-4 pt-5">
                                <div className="mb-4 flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-900">
                                        <Lock size={14} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="font-clash text-sm font-semibold text-gray-900">
                                            Daftar Peran (Roles)
                                        </p>
                                        <p className="text-[11px] text-gray-400">
                                            Pilih peran untuk mengatur aksesnya
                                        </p>
                                    </div>
                                </div>

                                {/* Administrator — locked */}
                                <div className="mb-3 flex items-center gap-3 rounded-2xl bg-gray-50 px-3.5 py-3 ring-1 ring-inset ring-gray-100">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gray-100">
                                        <ShieldCheck size={16} className="text-gray-300" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-clash text-sm font-medium text-gray-400">
                                            Administrator
                                        </p>
                                        <p className="text-[11px] text-gray-300">
                                            Akses penuh — tidak dapat diubah
                                        </p>
                                    </div>
                                    <Lock size={12} className="shrink-0 text-gray-300" />
                                </div>

                                {/* Selectable roles */}
                                <div className="flex flex-col gap-1.5">
                                    {roles.map((role) => {
                                        const isActive = role.id === activeRoleId;
                                        const count    = localPerms[role.id]?.size ?? 0;
                                        const Icon     = role.name === "Manager" ? ShieldCheck : Shield;
                                        return (
                                            <button
                                                key={role.id}
                                                type="button"
                                                onClick={() => setActiveRoleId(role.id)}
                                                className={cn(
                                                    "flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left transition-all duration-150",
                                                    isActive
                                                        ? "bg-gray-900 shadow-[0_4px_12px_rgb(0,0,0,0.15)]"
                                                        : "hover:bg-gray-50",
                                                )}
                                            >
                                                <div className={cn(
                                                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl transition-colors",
                                                    isActive ? "bg-white/15" : "bg-gray-100",
                                                )}>
                                                    <Icon size={16} className={isActive ? "text-white" : "text-gray-500"} />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className={cn(
                                                        "font-clash text-sm font-medium truncate",
                                                        isActive ? "text-white" : "text-gray-900",
                                                    )}>
                                                        {role.name}
                                                    </p>
                                                    <div className="mt-0.5 flex flex-wrap items-center gap-x-1 gap-y-0.5">
                                                        <span className={cn(
                                                            "text-[11px]",
                                                            isActive ? "text-white/50" : "text-gray-400",
                                                        )}>
                                                            {count} izin aktif
                                                        </span>
                                                        <span className={cn(
                                                            "text-[10px]",
                                                            isActive ? "text-white/20" : "text-gray-300",
                                                        )}>•</span>
                                                        <span className={cn(
                                                            "text-[11px]",
                                                            isActive ? "text-white/50" : "text-gray-400",
                                                        )}>
                                                            {role.users_count} Akun
                                                        </span>
                                                        <span className={cn(
                                                            "text-[10px]",
                                                            isActive ? "text-white/20" : "text-gray-300",
                                                        )}>·</span>
                                                        {role.online_users_count > 0 ? (
                                                            <span className="flex items-center gap-1">
                                                                <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-emerald-400" />
                                                                <span className={cn(
                                                                    "text-[11px] font-medium",
                                                                    isActive ? "text-emerald-300" : "text-emerald-500",
                                                                )}>
                                                                    {role.online_users_count} Online
                                                                </span>
                                                            </span>
                                                        ) : (
                                                            <span className={cn(
                                                                "text-[11px]",
                                                                isActive ? "text-white/25" : "text-gray-300",
                                                            )}>
                                                                0 Online
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {isActive && (
                                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/50" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="border-t border-gray-100 p-3">
                                <button
                                    type="button"
                                    className="flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
                                >
                                    <Plus size={14} />
                                    Tambah Peran Baru
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right pane: editable matrix */}
                    <div className="flex min-w-0 flex-1 flex-col gap-4">

                        {/* Right pane header */}
                        <div className={`${ADMIN_TOKENS.CARD_LARGE} flex items-center justify-between px-5 py-4`}>
                            <div>
                                <p className="font-clash text-[11px] font-medium uppercase tracking-wider text-gray-400">
                                    Edit Akses
                                </p>
                                <p className="font-clash text-lg font-semibold text-gray-900">
                                    {activeRole?.name}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saveStatus === "saving"}
                                className={cn(
                                    "flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-medium transition-all",
                                    saveStatus === "saved"
                                        ? "bg-emerald-600 text-white"
                                        : "bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60",
                                )}
                            >
                                {saveStatus === "saving" && "Menyimpan…"}
                                {saveStatus === "saved"  && "✓ Tersimpan"}
                                {saveStatus === "idle"   && "Simpan Perubahan"}
                            </button>
                        </div>

                        {renderMatrix(currentPerms, false)}
                    </div>
                </div>
            ) : (
                /* ══════════════════════════════════════════════════════════════
                   NON-ADMIN VIEW — Read-only "Hak Akses Saya"
                ══════════════════════════════════════════════════════════════ */
                <div className="mx-auto max-w-2xl pt-6">
                    <div className={`${ADMIN_TOKENS.CARD_LARGE} mb-4 flex items-center gap-4 px-5 py-4`}>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gray-100">
                            <ShieldCheck size={18} className="text-gray-500" />
                        </div>
                        <div>
                            <p className="font-clash text-[11px] font-medium uppercase tracking-wider text-gray-400">
                                Peran Anda
                            </p>
                            <p className="font-clash text-lg font-semibold text-gray-900">
                                Hak Akses Saya
                                <span className="ml-2 rounded-full bg-gray-100 px-2.5 py-0.5 font-clash text-xs font-medium text-gray-600">
                                    {auth.user?.role ?? "—"}
                                </span>
                            </p>
                        </div>
                        <p className="ml-auto text-[11px] text-gray-400">
                            Hanya Administrator yang dapat mengubah hak akses.
                        </p>
                    </div>

                    {renderMatrix(myPerms, true)}
                </div>
            )}
        </AdminLayout>
    );
}
