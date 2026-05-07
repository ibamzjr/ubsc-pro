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

// ── Global styles ──────────────────────────────────────────────────────────────

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

    /* ── Active role button sheen ── */
    @keyframes roleBtnSheen {
        0%   { left: -80%; }
        100% { left: 120%; }
    }
    .role-btn-active {
        background: linear-gradient(145deg, #1a1f35, #252b44, #1c2236);
        position: relative;
        overflow: hidden;
    }
    .role-btn-active::before {
        content: '';
        position: absolute;
        top: 0; bottom: 0; width: 40%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
        animation: roleBtnSheen 4s ease-in-out 0.8s infinite;
    }

    /* ── Toggle thumb amber glow ── */
    @keyframes thumbGlow {
        0%, 100% { box-shadow: 0 1px 4px rgba(0,0,0,0.2), 0 0 0 0 rgba(251,191,36,0); }
        50%       { box-shadow: 0 1px 8px rgba(0,0,0,0.25), 0 0 10px 2px rgba(251,191,36,0.35); }
    }
    .thumb-glow { animation: thumbGlow 2.5s ease-in-out infinite; }

    /* ── Progress bar fill animation ── */
    @keyframes progressFill {
        from { width: 0%; }
    }
    .progress-fill { animation: progressFill 0.7s cubic-bezier(0.16,1,0.3,1) forwards; }

    /* ── Save button shimmer ── */
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

    /* ── Stagger children ── */
    .stagger > *:nth-child(1) { animation-delay:  80ms; }
    .stagger > *:nth-child(2) { animation-delay: 140ms; }
    .stagger > *:nth-child(3) { animation-delay: 200ms; }
    .stagger > *:nth-child(4) { animation-delay: 260ms; }
    .stagger > *:nth-child(5) { animation-delay: 320ms; }
    .stagger > *:nth-child(6) { animation-delay: 380ms; }

    /* ── Top glint line on cards ── */
    .card-glint::before {
        content: '';
        position: absolute;
        top: 0; left: 20px; right: 20px; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent);
        pointer-events: none;
    }
`;

// ── Group accent palette — muted, refined, no harsh colors ────────────────────

const GROUP_ACCENT: Record<string, { bg: string; text: string; ring: string }> = {
    A: { bg: "bg-amber-50",   text: "text-amber-700",  ring: "ring-1 ring-amber-200/70"  },
    B: { bg: "bg-sky-50",     text: "text-sky-700",    ring: "ring-1 ring-sky-200/70"    },
    C: { bg: "bg-violet-50",  text: "text-violet-700", ring: "ring-1 ring-violet-200/70" },
    D: { bg: "bg-teal-50",    text: "text-teal-700",   ring: "ring-1 ring-teal-200/70"   },
    E: { bg: "bg-rose-50",    text: "text-rose-700",   ring: "ring-1 ring-rose-200/70"   },
    F: { bg: "bg-slate-100",  text: "text-slate-600",  ring: "ring-1 ring-slate-200/70"  },
};

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
                "relative inline-flex h-[26px] w-12 shrink-0 rounded-full p-[3px] transition-all duration-300",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2",
                disabled ? "cursor-not-allowed opacity-35" : "cursor-pointer",
                enabled
                    ? "bg-gradient-to-r from-amber-400 to-yellow-500 shadow-[0_2px_8px_rgba(251,191,36,0.4),inset_0_1px_0_rgba(255,255,255,0.3)]"
                    : "bg-slate-200 shadow-[inset_0_1px_3px_rgba(0,0,0,0.12)]",
            )}
        >
            <span
                className={cn(
                    "relative inline-block h-5 w-5 rounded-full bg-white transition-all duration-300",
                    enabled
                        ? "translate-x-[22px] shadow-[0_1px_4px_rgba(0,0,0,0.2)] thumb-glow"
                        : "translate-x-0 shadow-[0_1px_3px_rgba(0,0,0,0.15)]",
                )}
            >
                {/* Thumb inner glint */}
                <span className="pointer-events-none absolute top-[3px] left-[3px] right-[3px] h-[5px] rounded-full bg-white/70 blur-[0.5px]" />
            </span>
        </button>
    );
}

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

function GroupCard({
    group,
    perms,
    readOnly,
    onToggle,
    index,
}: {
    group: PermissionGroup;
    perms: Set<string>;
    readOnly: boolean;
    onToggle: (key: string) => void;
    index: number;
}) {
    const activeCount = group.items.filter((i) => perms.has(i.key)).length;
    const total       = group.items.length;
    const allOn       = activeCount === total;
    const allOff      = activeCount === 0;
    const accent      = GROUP_ACCENT[group.letter] ?? GROUP_ACCENT["F"];
    const fillPct     = total > 0 ? Math.round((activeCount / total) * 100) : 0;

    return (
        <div
            className="animate-scale-in relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)] card-glint transition-all duration-300 hover:shadow-[0_6px_24px_rgba(0,0,0,0.09)] hover:-translate-y-px"
            style={{ animationDelay: `${index * 65 + 180}ms` }}
        >
            {/* One-shot shimmer sweep on load */}
            <div className="shimmer-once pointer-events-none absolute inset-0 z-10 rounded-2xl" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100/80 px-5 py-3.5">
                <div className="flex items-center gap-3">
                    {/* Letter badge */}
                    <div className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-clash text-[13px] font-bold",
                        accent.bg, accent.text, accent.ring,
                    )}>
                        {group.letter}
                    </div>

                    <div>
                        <p className="font-clash text-sm font-semibold text-slate-800 leading-tight">
                            {group.label}
                        </p>
                        {/* Thin progress bar */}
                        <div className="mt-1.5 flex items-center gap-2">
                            <div className="h-[3px] w-20 overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className={cn(
                                        "h-full rounded-full progress-fill",
                                        allOn  ? "bg-emerald-400" :
                                        allOff ? "bg-slate-200"   :
                                                 "bg-amber-400",
                                    )}
                                    style={{
                                        width: `${fillPct}%`,
                                        animationDelay: `${index * 65 + 400}ms`,
                                    }}
                                />
                            </div>
                            <span className="font-bdo text-[10px] text-slate-400 tabular-nums">
                                {activeCount}/{total}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Status chip */}
                <span className={cn(
                    "rounded-lg px-2.5 py-[5px] font-bdo text-[10px] font-bold uppercase tracking-wider",
                    allOn  ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/70" :
                    allOff ? "bg-slate-100  text-slate-400  ring-1 ring-slate-200/70"    :
                             "bg-yellow-50   text-yellow-400/80  ring-1 ring-yellow-200",
                )}>
                    {allOn ? "Semua Aktif" : allOff ? "Nonaktif" : "Sebagian"}
                </span>
            </div>

            {/* Permission rows — whole row is clickable */}
            <ul className="divide-y divide-slate-50/80 px-5">
                {group.items.map((item) => {
                    const on = perms.has(item.key);
                    return (
                        <li
                            key={item.key}
                            className={cn(
                                "flex items-center justify-between gap-4 py-3.5 transition-colors duration-150",
                                !readOnly && "cursor-pointer select-none rounded-lg -mx-2 px-2 hover:bg-slate-50/80",
                            )}
                            onClick={() => !readOnly && onToggle(item.key)}
                        >
                            <div className="flex items-center gap-2.5 min-w-0">
                                {/* Glow dot */}
                                <span className={cn(
                                    "h-[7px] w-[7px] shrink-0 rounded-full transition-all duration-300",
                                    on
                                        ? "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.65)]"
                                        : "bg-slate-200",
                                )} />
                                <span className={cn(
                                    "font-bdo text-sm leading-snug transition-colors duration-200",
                                    on ? "text-slate-800" : "text-slate-400",
                                )}>
                                    {item.label}
                                </span>
                            </div>
                            {/* Prevent double-toggle from row click */}
                            <div onClick={(e) => e.stopPropagation()}>
                                <ToggleSwitch
                                    enabled={on}
                                    disabled={readOnly}
                                    onChange={() => onToggle(item.key)}
                                />
                            </div>
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
        <div className="flex flex-col gap-3">
            {PERMISSION_GROUPS.map((group, i) => (
                <GroupCard
                    key={group.id}
                    group={group}
                    perms={perms}
                    readOnly={readOnly}
                    onToggle={toggle}
                    index={i}
                />
            ))}
        </div>
    );

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4 animate-fade-in-up">
                    <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
                    <span className="font-bdo text-[11px] font-medium tracking-wide text-orange-400">
                        Pengaturan Sistem
                    </span>
                    <span className="font-clash uppercase text-3xl font-bold tracking-tight xl:text-4xl text-slate-900">
                        Peran & Akses
                    </span>
                </div>
            }
        >
            <Head title="Role & Access" />

            {isAdmin ? (
                /* ══════════════════════════════════════════════════════════════
                   ADMIN VIEW — Split-pane editable matrix
                ══════════════════════════════════════════════════════════════ */
                <div className="flex flex-col gap-5 pt-6 pb-20 xl:flex-row xl:items-start overflow-x-hidden">

                    {/* ── Left pane: role selector ── */}
                    <div className="w-full shrink-0 animate-fade-in-left delay-100 xl:sticky xl:top-6 xl:w-72">
                        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] card-breath">

                            {/* Pane header */}
                            <div className="relative px-5 pb-4 pt-5 border-b border-slate-100">
                                <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                                <div className="flex items-center gap-3">
                                    <ShinyIcon className="h-9 w-9">
                                        <Lock size={14} className="text-amber-300" />
                                    </ShinyIcon>
                                    <div>
                                        <p className="font-clash text-sm font-semibold text-slate-800">
                                            Daftar Peran
                                        </p>
                                        <p className="font-bdo text-[11px] text-slate-400">
                                            Pilih peran untuk mengatur aksesnya
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3">
                                {/* Administrator — locked (non-interactive) */}
                                <div className="mb-2 flex items-center gap-3 rounded-xl bg-slate-50/80 px-3.5 py-3 ring-1 ring-inset ring-slate-200/60">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/80 ring-1 ring-slate-200/60">
                                        <ShieldCheck size={16} className="text-slate-300" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-clash text-sm font-medium text-slate-400">
                                            Administrator
                                        </p>
                                        <p className="font-bdo text-[10px] text-slate-300">
                                            Akses penuh — tidak dapat diubah
                                        </p>
                                    </div>
                                    <Lock size={12} className="shrink-0 text-slate-300" />
                                </div>

                                {/* Selectable roles */}
                                <div className="flex flex-col gap-1 stagger">
                                    {roles.map((role, idx) => {
                                        const isActive = role.id === activeRoleId;
                                        const count    = localPerms[role.id]?.size ?? 0;
                                        const Icon     = role.name === "Manager" ? ShieldCheck : Shield;
                                        return (
                                            <button
                                                key={role.id}
                                                type="button"
                                                onClick={() => setActiveRoleId(role.id)}
                                                className={cn(
                                                    "animate-fade-in-left relative flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left transition-all duration-200",
                                                    isActive
                                                        ? "role-btn-active shadow-[0_4px_20px_rgba(15,23,42,0.22),inset_0_1px_0_rgba(255,255,255,0.08)]"
                                                        : "hover:bg-slate-50 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]",
                                                )}
                                                style={{ animationDelay: `${idx * 55 + 160}ms` }}
                                            >
                                                {/* Icon wrapper */}
                                                <div className={cn(
                                                    "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200",
                                                    isActive
                                                        ? "bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                                                        : "bg-slate-100",
                                                )}>
                                                    <Icon size={16} className={isActive ? "text-amber-300" : "text-slate-500"} />
                                                    {isActive && (
                                                        <span className="pointer-events-none absolute top-[3px] left-[4px] right-[4px] h-[5px] rounded-full bg-white/20 blur-[1px]" />
                                                    )}
                                                </div>

                                                {/* Text */}
                                                <div className="min-w-0 flex-1">
                                                    <p className={cn(
                                                        "font-clash text-sm font-semibold truncate leading-tight",
                                                        isActive ? "text-white" : "text-slate-800",
                                                    )}>
                                                        {role.name}
                                                    </p>
                                                    <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5">
                                                        <span className={cn(
                                                            "font-bdo text-[10px]",
                                                            isActive ? "text-white/50" : "text-slate-400",
                                                        )}>
                                                            {count} izin
                                                        </span>
                                                        <span className={cn("text-[9px]", isActive ? "text-white/20" : "text-slate-300")}>·</span>
                                                        <span className={cn(
                                                            "font-bdo text-[10px]",
                                                            isActive ? "text-white/50" : "text-slate-400",
                                                        )}>
                                                            {role.users_count} akun
                                                        </span>
                                                        {role.online_users_count > 0 && (
                                                            <>
                                                                <span className={cn("text-[9px]", isActive ? "text-white/20" : "text-slate-300")}>·</span>
                                                                <span className="flex items-center gap-1">
                                                                    <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.7)]" />
                                                                    <span className={cn(
                                                                        "font-bdo text-[10px] font-semibold",
                                                                        isActive ? "text-emerald-300" : "text-emerald-500",
                                                                    )}>
                                                                        {role.online_users_count} online
                                                                    </span>
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Active accent bar */}
                                                {isActive && (
                                                    <span className="h-7 w-0.5 shrink-0 rounded-full bg-gradient-to-b from-amber-300/80 to-amber-500/40 shadow-[0_0_8px_rgba(251,191,36,0.4)]" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Add role footer */}
                            <div className="border-t border-slate-100 p-3">
                                <button
                                    type="button"
                                    className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-bdo text-sm font-medium text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-700"
                                >
                                    <Plus size={14} />
                                    Tambah Peran Baru
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── Right pane: editable matrix ── */}
                    <div className="flex min-w-0 flex-1 flex-col gap-4 animate-fade-in-up delay-200">

                        {/* Right pane header */}
                        <div className="relative card-glint overflow-hidden flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.05)] shimmer-once">
                            <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/70 to-transparent" />

                            <div className="flex items-center gap-3">
                                <ShinyIcon className="h-10 w-10">
                                    <Shield size={16} className="text-amber-300" />
                                </ShinyIcon>
                                <div>
                                    <p className="font-bdo text-[10px] font-bold uppercase tracking-wide     text-slate-400">
                                        Edit Akses
                                    </p>
                                    <p className="font-clash text-lg font-semibold text-slate-900 leading-tight">
                                        {activeRole?.name}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2.5">
                                {/* Active permission count chip */}
                                <div className="flex items-center gap-1.5 rounded-xl bg-sky-100 ring-1 ring-sky-200 px-3 py-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-sky-500 shadow-[0_0_6px_rgba(251,191,36,0.7)]" />
                                    <span className="font-bdo text-[11px] font-bold text-sky-600 uppercase tracking-wider tabular-nums">
                                        {currentPerms.size} Izin Aktif
                                    </span>
                                </div>

                                {/* Save button */}
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={saveStatus === "saving"}
                                    className={cn(
                                        "btn-sheen relative flex items-center gap-2 rounded-xl px-5 py-2.5 font-clash text-sm font-semibold transition-all duration-200",
                                        saveStatus === "saved"
                                            ? "bg-gradient-to-br from-sky-400 to-sky-700 text-white shadow-[0_4px_14px_rgba(16,185,129,0.35),inset_0_1px_0_rgba(255,255,255,0.2)]"
                                            : "bg-gradient-to-br bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-[0_4px_14px_rgba(15,23,42,0.22),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_6px_20px_rgba(15,23,42,0.28)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60",
                                    )}
                                >
                                    {/* Top glint */}
                                    <span className="pointer-events-none absolute top-0 left-0 right-0 h-px rounded-t-xl bg-white/20" />
                                    {saveStatus === "saving" && "Menyimpan…"}
                                    {saveStatus === "saved"  && "✓ Tersimpan"}
                                    {saveStatus === "idle"   && "Simpan Perubahan"}
                                </button>
                            </div>
                        </div>

                        {renderMatrix(currentPerms, false)}
                    </div>
                </div>
            ) : (
                /* ══════════════════════════════════════════════════════════════
                   NON-ADMIN VIEW — Read-only "Hak Akses Saya"
                ══════════════════════════════════════════════════════════════ */
                <div className="mx-auto max-w-2xl pt-6 pb-20 animate-fade-in-up delay-100">

                    {/* Info header card */}
                    <div className="relative card-glint overflow-hidden mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] shimmer-once">
                        <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/70 to-transparent" />

                        <div className="flex items-center gap-4">
                            <ShinyIcon className="h-10 w-10">
                                <ShieldCheck size={18} className="text-amber-300" />
                            </ShinyIcon>
                            <div>
                                <p className="font-bdo text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    Peran Anda
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <p className="font-clash text-lg font-semibold text-slate-900 leading-tight">
                                        Hak Akses Saya
                                    </p>
                                    <span className="rounded-lg bg-slate-100 ring-1 ring-slate-200/80 px-2.5 py-0.5 font-bdo text-xs font-semibold text-slate-600">
                                        {auth.user?.role ?? "—"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p className="font-bdo text-[11px] text-slate-400 leading-relaxed sm:text-right">
                            Hanya Administrator yang<br className="hidden sm:block" /> dapat mengubah hak akses.
                        </p>
                    </div>

                    {renderMatrix(myPerms, true)}
                </div>
            )}
        </AdminLayout>
    );
}