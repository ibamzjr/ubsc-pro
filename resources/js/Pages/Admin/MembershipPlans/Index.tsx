import { Head, router, usePage } from "@inertiajs/react";
import {
    CheckCircle,
    Crown,
    Package,
    Pencil,
    Plus,
    Sparkles,
    Trash2,
    Users,
} from "lucide-react";
import { useState } from "react";
import SlideOver from "@/Components/Admin/SlideOver";
import { ADMIN_TOKENS } from "@/Components/Admin/tokens";
import AdminLayout from "@/Layouts/AdminLayout";
import { cn } from "@/lib/utils";
import type { MembershipPlanItem, PageProps } from "@/types";

// ── Types ─────────────────────────────────────────────────────────────────────

type Props = PageProps<{ plans: MembershipPlanItem[] }>;

// ── Global styles ─────────────────────────────────────────────────────────────

const GLOBAL_STYLES = `
    .font-clash { font-family: 'Clash Display', sans-serif; }
    .font-bdo   { font-family: 'BDO Grotesk', sans-serif; }

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
    @keyframes shimmerSweep {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(220%); }
    }
    @keyframes iconGlow {
        0%, 100% { box-shadow: 0 2px 8px rgba(15,23,42,0.2); }
        50%       { box-shadow: 0 2px 16px rgba(15,23,42,0.3), 0 0 24px rgba(251,191,36,0.12); }
    }
    @keyframes btnSheen {
        0%   { left: -80%; }
        100% { left: 120%; }
    }
    @keyframes thumbGlow {
        0%, 100% { box-shadow: 0 1px 4px rgba(0,0,0,0.2), 0 0 0 0 rgba(251,191,36,0); }
        50%       { box-shadow: 0 1px 8px rgba(0,0,0,0.25), 0 0 10px 2px rgba(251,191,36,0.35); }
    }
    @keyframes cardBreath {
        0%, 100% { box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 0 0 1px rgba(226,232,240,0.8); }
        50%       { box-shadow: 0 4px 16px rgba(0,0,0,0.07), 0 0 0 1px rgba(251,191,36,0.15); }
    }
    @keyframes flashIn {
        from { opacity: 0; transform: translate3d(0, -10px, 0); }
        to   { opacity: 1; transform: translate3d(0, 0, 0); }
    }

    .animate-fade-in-up   { animation: fadeInUp  0.65s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; will-change: opacity, transform; }
    .animate-fade-in-left { animation: fadeInLeft 0.55s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }
    .animate-scale-in     { animation: scaleIn    0.50s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }
    .animate-flash-in     { animation: flashIn    0.45s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }

    .delay-50  { animation-delay:  50ms; }
    .delay-100 { animation-delay: 100ms; }
    .delay-150 { animation-delay: 150ms; }
    .delay-200 { animation-delay: 200ms; }
    .delay-250 { animation-delay: 250ms; }
    .delay-300 { animation-delay: 300ms; }
    .delay-350 { animation-delay: 350ms; }
    .delay-400 { animation-delay: 400ms; }

    /* Shimmer (one-shot) */
    .shimmer-once { position: relative; overflow: hidden; }
    .shimmer-once::after {
        content: '';
        position: absolute; inset: 0;
        background: linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%);
        width: 60%;
        animation: shimmerSweep 1.1s ease-out 0.4s forwards;
        pointer-events: none;
        border-radius: inherit;
    }

    .icon-glow  { animation: iconGlow  3.5s ease-in-out infinite; }
    .card-breath { animation: cardBreath 5s  ease-in-out infinite; }
    .thumb-glow { animation: thumbGlow 2.5s ease-in-out infinite; }

    /* Top glint */
    .card-glint { position: relative; }
    .card-glint::before {
        content: '';
        position: absolute;
        top: 0; left: 20px; right: 20px; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent);
        pointer-events: none; z-index: 1;
    }

    /* Button sheen */
    .btn-sheen { position: relative; overflow: hidden; }
    .btn-sheen::before {
        content: '';
        position: absolute;
        top: 0; bottom: 0; width: 50%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        animation: btnSheen 3s ease-in-out 1s infinite;
    }

    /* Plan card accent bar sweep */
    @keyframes accentSweep {
        from { opacity: 0; transform: scaleX(0); transform-origin: left; }
        to   { opacity: 1; transform: scaleX(1); transform-origin: left; }
    }
    .accent-bar { animation: accentSweep 0.6s cubic-bezier(0.16,1,0.3,1) 0.3s both; }

    /* Stagger children */
    .stagger > *:nth-child(1) { animation-delay:  80ms; }
    .stagger > *:nth-child(2) { animation-delay: 160ms; }
    .stagger > *:nth-child(3) { animation-delay: 240ms; }
    .stagger > *:nth-child(4) { animation-delay: 320ms; }
    .stagger > *:nth-child(5) { animation-delay: 400ms; }
    .stagger > *:nth-child(6) { animation-delay: 480ms; }

    /* ── Input system (SlideOver form) ── */
    .mp-input {
        width: 100%;
        border-radius: 0.75rem;
        border: 1px solid rgb(226 232 240 / 0.8);
        background: rgb(248 250 252 / 0.6);
        padding: 0.75rem 1rem;
        font-family: 'BDO Grotesk', sans-serif;
        font-size: 0.875rem;
        color: #0f172a;
        transition: all 0.15s;
        outline: none;
    }
    .mp-input::placeholder { color: rgb(148 163 184); }
    .mp-input:focus {
        background: white;
        border-color: rgb(251 191 36 / 0.6);
        box-shadow: 0 0 0 4px rgb(251 191 36 / 0.08);
    }

    /* Section divider */
    .mp-divider {
        height: 1px;
        background: linear-gradient(90deg, transparent, rgb(226 232 240), transparent);
    }

    /* Feature chip */
    .feature-chip {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        border-radius: 999px;
        background: rgb(241 245 249);
        border: 1px solid rgb(226 232 240);
        padding: 0.25rem 0.375rem 0.25rem 0.75rem;
        font-family: 'BDO Grotesk', sans-serif;
        font-size: 0.6875rem;
        font-weight: 600;
        color: #475569;
    }
    .feature-chip-remove {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.125rem;
        height: 1.125rem;
        border-radius: 999px;
        color: rgb(148 163 184);
        transition: all 0.12s;
        font-size: 0.875rem;
        line-height: 1;
    }
    .feature-chip-remove:hover { background: rgb(226 232 240); color: rgb(71 85 105); }
`;

// ── Plan tier palette — purely visual, index-based ────────────────────────────

const TIER_PALETTE = [
    {
        bar:    "bg-gradient-to-r from-sky-400 to-indigo-500",
        avatar: "from-sky-400 to-indigo-500",
        glow:   "shadow-[0_4px_20px_rgba(99,102,241,0.18)]",
        ring:   "ring-indigo-100",
        badge:  "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200/80",
        check:  "text-indigo-500",
        hover:  "hover:shadow-[0_8px_32px_rgba(99,102,241,0.16)]",
    },
    {
        bar:    "bg-gradient-to-r from-amber-400 to-orange-500",
        avatar: "from-amber-400 to-orange-500",
        glow:   "shadow-[0_4px_20px_rgba(251,146,60,0.18)]",
        ring:   "ring-amber-100",
        badge:  "bg-amber-50 text-amber-700 ring-1 ring-amber-200/80",
        check:  "text-amber-500",
        hover:  "hover:shadow-[0_8px_32px_rgba(251,146,60,0.16)]",
    },
    {
        bar:    "bg-gradient-to-r from-violet-500 to-purple-600",
        avatar: "from-violet-500 to-purple-600",
        glow:   "shadow-[0_4px_20px_rgba(139,92,246,0.18)]",
        ring:   "ring-violet-100",
        badge:  "bg-violet-50 text-violet-700 ring-1 ring-violet-200/80",
        check:  "text-violet-500",
        hover:  "hover:shadow-[0_8px_32px_rgba(139,92,246,0.16)]",
    },
    {
        bar:    "bg-gradient-to-r from-teal-400 to-emerald-500",
        avatar: "from-teal-400 to-emerald-500",
        glow:   "shadow-[0_4px_20px_rgba(16,185,129,0.18)]",
        ring:   "ring-emerald-100",
        badge:  "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80",
        check:  "text-emerald-500",
        hover:  "hover:shadow-[0_8px_32px_rgba(16,185,129,0.16)]",
    },
    {
        bar:    "bg-gradient-to-r from-rose-400 to-pink-500",
        avatar: "from-rose-400 to-pink-500",
        glow:   "shadow-[0_4px_20px_rgba(244,63,94,0.18)]",
        ring:   "ring-rose-100",
        badge:  "bg-rose-50 text-rose-700 ring-1 ring-rose-200/80",
        check:  "text-rose-500",
        hover:  "hover:shadow-[0_8px_32px_rgba(244,63,94,0.16)]",
    },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function durationLabel(months: number): string {
    if (months === 12) return "1 Tahun";
    if (months === 1)  return "1 Bulan";
    return `${months} Bulan`;
}

function formatIDR(amount: number): string {
    return `Rp ${amount.toLocaleString("id-ID")}`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ShinyIcon({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`relative flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-600 to-slate-900 shadow-[0_2px_10px_rgba(15,23,42,0.22),inset_0_1px_0_rgba(255,255,255,0.12)] icon-glow ${className}`}>
            {children}
            <span className="pointer-events-none absolute top-[3px] left-[5px] right-[5px] h-[5px] rounded-full bg-white/20 blur-[1px]" />
        </div>
    );
}

function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => onChange(!enabled)}
            className={cn(
                "relative inline-flex h-[26px] w-12 shrink-0 rounded-full p-[3px] transition-all duration-300",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2 cursor-pointer",
                enabled
                    ? "bg-gradient-to-r from-amber-400 to-yellow-500 shadow-[0_2px_8px_rgba(251,191,36,0.4),inset_0_1px_0_rgba(255,255,255,0.3)]"
                    : "bg-slate-200 shadow-[inset_0_1px_3px_rgba(0,0,0,0.12)]",
            )}
        >
            <span className={cn(
                "relative inline-block h-5 w-5 rounded-full bg-white transition-all duration-300",
                enabled
                    ? "translate-x-[22px] shadow-[0_1px_4px_rgba(0,0,0,0.2)] thumb-glow"
                    : "translate-x-0 shadow-[0_1px_3px_rgba(0,0,0,0.15)]",
            )}>
                <span className="pointer-events-none absolute top-[3px] left-[3px] right-[3px] h-[5px] rounded-full bg-white/70 blur-[0.5px]" />
            </span>
        </button>
    );
}

// ── Plan Form (Create / Edit) inside SlideOver ────────────────────────────────

function PlanForm({ item, onClose }: { item: MembershipPlanItem | null; onClose: () => void }) {
    const isEdit = item !== null;

    const [name, setName]                 = useState(item?.name ?? "");
    const [description, setDescription]   = useState(item?.description ?? "");
    const [price, setPrice]               = useState(String(item?.price ?? ""));
    const [duration, setDuration]         = useState<number>(item?.duration_months ?? 1);
    const [sortOrder, setSortOrder]       = useState(String(item?.sort_order ?? "0"));
    const [isActive, setIsActive]         = useState(item?.is_active ?? true);
    const [features, setFeatures]         = useState<string[]>(item?.features ?? []);
    const [featureInput, setFeatureInput] = useState("");
    const [processing, setProcessing]     = useState(false);

    const addFeature = () => {
        const trimmed = featureInput.trim();
        if (!trimmed) return;
        setFeatures((prev) => [...prev, trimmed]);
        setFeatureInput("");
    };

    const removeFeature = (idx: number) =>
        setFeatures((prev) => prev.filter((_, i) => i !== idx));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        const payload = {
            name,
            description: description || null,
            price: Number(price),
            duration_months: duration,
            features,
            is_active: isActive,
            sort_order: Number(sortOrder),
        };
        if (isEdit) {
            router.patch(route("admin.memberships.plans.update", item.id), payload, {
                onSuccess: onClose,
                onFinish: () => setProcessing(false),
            });
        } else {
            router.post(route("admin.memberships.plans.store"), payload, {
                onSuccess: onClose,
                onFinish: () => setProcessing(false),
            });
        }
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-5 animate-fade-in-up">

            {/* Name */}
            <div>
                <label className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                    Nama Paket
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Basic, Pro, Elite…"
                    className="mp-input"
                    required
                />
            </div>

            {/* Description */}
            <div>
                <label className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                    Deskripsi
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    placeholder="Penjelasan singkat tentang paket ini…"
                    className="mp-input resize-none leading-relaxed"
                />
            </div>

            <div className="mp-divider" />

            {/* Price + Duration */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                        Harga (IDR)
                    </label>
                    <input
                        type="number"
                        min="0"
                        step="1000"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="150000"
                        className="mp-input"
                        required
                    />
                </div>
                <div>
                    <label className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                        Durasi
                    </label>
                    <select
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="mp-input"
                    >
                        <option value={1}>1 Bulan</option>
                        <option value={3}>3 Bulan</option>
                        <option value={6}>6 Bulan</option>
                        <option value={12}>12 Bulan / 1 Tahun</option>
                    </select>
                </div>
            </div>

            {/* Sort order */}
            <div>
                <label className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                    Urutan Tampil
                </label>
                <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="mp-input"
                />
                <p className="mt-1.5 font-bdo text-[10px] text-slate-400">Angka lebih kecil tampil lebih dulu</p>
            </div>

            <div className="mp-divider" />

            {/* Features builder */}
            <div>
                <label className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                    Fitur Paket
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                addFeature();
                            }
                        }}
                        placeholder="Akses gym 24 jam… lalu Enter"
                        className="mp-input"
                    />
                    <button
                        type="button"
                        onClick={addFeature}
                        className="shrink-0 rounded-xl bg-slate-100 px-4 py-2 font-bdo text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                        + Tambah
                    </button>
                </div>

                {features.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                        {features.map((f, i) => (
                            <span key={i} className="feature-chip animate-scale-in" style={{ animationDelay: `${i * 30}ms` }}>
                                <CheckCircle size={10} className="shrink-0 text-emerald-500" />
                                {f}
                                <button
                                    type="button"
                                    onClick={() => removeFeature(i)}
                                    className="feature-chip-remove"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                {features.length === 0 && (
                    <p className="mt-2 font-bdo text-[10px] text-slate-400 italic">
                        Belum ada fitur. Ketik lalu tekan Enter atau klik Tambah.
                    </p>
                )}
            </div>

            <div className="mp-divider" />

            {/* is_active toggle */}
            <div className="flex items-center justify-between rounded-xl bg-slate-50/80 px-4 py-3.5 ring-1 ring-slate-200/60">
                <div>
                    <p className="font-clash text-sm font-semibold text-slate-800">Status Aktif</p>
                    <p className="font-bdo text-[11px] text-slate-400 mt-0.5">
                        {isActive ? "Paket tersedia untuk pembelian" : "Paket disembunyikan dari publik"}
                    </p>
                </div>
                <ToggleSwitch enabled={isActive} onChange={(v) => setIsActive(v)} />
            </div>

            {/* Submit */}
            <div className="flex items-center gap-3 pt-1 border-t border-slate-100">
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl px-5 py-2.5 font-clash text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="btn-sheen relative flex-1 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 py-2.5 font-clash text-sm font-semibold text-white transition-all shadow-[0_4px_14px_rgba(5,150,105,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] hover:shadow-[0_6px_20px_rgba(5,150,105,0.4)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0"
                >
                    <span className="pointer-events-none absolute top-0 left-0 right-0 h-px rounded-t-xl bg-white/20" />
                    {processing ? "Menyimpan…" : isEdit ? "Simpan Perubahan" : "Buat Paket"}
                </button>
            </div>
        </form>
    );
}

// ── Plan Card ─────────────────────────────────────────────────────────────────

function PlanCard({
    plan,
    onEdit,
    onDelete,
    index,
}: {
    plan: MembershipPlanItem;
    onEdit:   (p: MembershipPlanItem) => void;
    onDelete: (p: MembershipPlanItem) => void;
    index: number;
}) {
    const tier = TIER_PALETTE[index % TIER_PALETTE.length]!;

    return (
        <div
            className={cn(
                "animate-scale-in card-glint shimmer-once group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300",
                "shadow-[0_2px_8px_rgba(0,0,0,0.06)]",
                tier.hover,
                !plan.is_active && "opacity-70 grayscale-[30%]",
            )}
        >
            {/* ── Top accent bar ── */}
            <div className={cn("accent-bar h-1 w-full", tier.bar)} />

            {/* ── Card body ── */}
            <div className="flex flex-col gap-4 p-5 flex-1">

                {/* Header row: avatar + name + status */}
                <div className="flex items-start gap-3">
                    {/* Tier avatar */}
                    <div className={cn(
                        "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br font-clash text-base font-bold text-white",
                        "shadow-[0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.25)]",
                        tier.avatar,
                    )}>
                        {plan.name[0]?.toUpperCase()}
                        <span className="pointer-events-none absolute top-[3px] left-[4px] right-[4px] h-[4px] rounded-full bg-white/30 blur-[0.5px]" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="font-clash text-[15px] font-bold text-slate-900 leading-snug truncate">
                            {plan.name}
                        </p>
                        {plan.description && (
                            <p className="mt-0.5 font-bdo text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                                {plan.description}
                            </p>
                        )}
                    </div>

                    {/* Status badge */}
                    <span className={cn(
                        "shrink-0 rounded-lg px-2 py-0.5 font-bdo text-[10px] font-bold uppercase tracking-wider",
                        plan.is_active
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80"
                            : "bg-slate-100 text-slate-400 ring-1 ring-slate-200/60",
                    )}>
                        {plan.is_active ? "Aktif" : "Nonaktif"}
                    </span>
                </div>

                {/* ── Price + Duration ── */}
                <div className="flex items-end gap-2 px-0.5">
                    <span className="font-clash text-2xl font-bold text-slate-900 leading-none tabular-nums">
                        {formatIDR(plan.price)}
                    </span>
                    <span className={cn(
                        "mb-0.5 rounded-lg px-2 py-0.5 font-bdo text-[11px] font-bold",
                        tier.badge,
                    )}>
                        / {durationLabel(plan.duration_months)}
                    </span>
                </div>

                {/* ── Active members chip ── */}
                <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1.5 rounded-xl bg-slate-50 px-2.5 py-1.5 ring-1 ring-slate-200/60">
                        <Users size={11} className="text-slate-400" />
                        <span className="font-bdo text-[11px] font-bold text-slate-600 tabular-nums">
                            {plan.active_members_count} anggota aktif
                        </span>
                    </div>
                </div>

                {/* ── Features list ── */}
                {plan.features.length > 0 && (
                    <>
                        <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
                        <ul className="flex flex-col gap-2">
                            {plan.features.map((f, i) => (
                                <li key={i} className="flex items-start gap-2 font-bdo text-[12px] text-slate-700 leading-snug">
                                    <CheckCircle
                                        size={13}
                                        className={cn("mt-px shrink-0", tier.check)}
                                    />
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>

            {/* ── Footer actions ── */}
            <div className="mt-auto flex items-center gap-1.5 border-t border-slate-100 bg-slate-50/60 px-4 py-3">
                <button
                    type="button"
                    onClick={() => onEdit(plan)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 font-bdo text-xs font-bold text-slate-600 transition-all hover:bg-white hover:shadow-sm hover:text-slate-900"
                >
                    <Pencil size={12} />
                    Edit
                </button>
                <span className="w-px h-5 bg-slate-200" />
                <button
                    type="button"
                    onClick={() => onDelete(plan)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 font-bdo text-xs font-bold text-rose-500 transition-all hover:bg-rose-50 hover:text-rose-700"
                >
                    <Trash2 size={12} />
                    Hapus
                </button>
            </div>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MembershipPlansIndex() {
    const { plans, flash } = usePage<Props>().props;

    const [slideOver, setSlideOver] = useState<{
        open: boolean;
        item: MembershipPlanItem | null;
    }>({ open: false, item: null });

    const openNew  = () => setSlideOver({ open: true,  item: null });
    const openEdit = (item: MembershipPlanItem) => setSlideOver({ open: true, item });
    const close    = () => setSlideOver({ open: false, item: null });

    const handleDelete = (plan: MembershipPlanItem) => {
        if (!window.confirm(`Hapus paket "${plan.name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
        router.delete(route("admin.memberships.plans.destroy", plan.id));
    };

    const activeCount = plans.filter((p) => p.is_active).length;

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4 animate-fade-in-up">
                    <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
                    <span className="font-bdo text-[11px] font-medium tracking-wide text-orange-500">
                        Manajemen Keanggotaan
                    </span>
                    <h1 className="font-clash text-3xl font-bold uppercase tracking-tight xl:text-4xl text-slate-900">
                        Paket Membership
                    </h1>
                </div>
            }
        >
            <Head title="Paket Membership" />

            <div className="flex flex-col gap-6 pt-6 pb-20 overflow-x-hidden">

                {/* ── Flash banner ── */}
                {flash?.success && (
                    <div className="animate-flash-in flex items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-3.5 ring-1 ring-inset ring-emerald-200">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                            <CheckCircle size={14} className="text-emerald-600" />
                        </span>
                        <p className="font-bdo text-sm font-semibold text-emerald-700">{flash.success}</p>
                    </div>
                )}

                {/* ── Toolbar ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up delay-100">

                    {/* Stats pills */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3.5 py-1.5 border border-slate-200 shadow-sm">
                            <Crown size={11} className="text-slate-500" />
                            <span className="font-bdo text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                {plans.length} Paket
                            </span>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-1.5 border border-emerald-100 shadow-sm">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="font-bdo text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                                {activeCount} Aktif
                            </span>
                        </div>
                        {plans.length - activeCount > 0 && (
                            <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3.5 py-1.5 border border-slate-200 shadow-sm">
                                <span className="h-2 w-2 rounded-full bg-slate-400" />
                                <span className="font-bdo text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    {plans.length - activeCount} Nonaktif
                                </span>
                            </div>
                        )}
                    </div>

                    {/* CTA */}
                    <button
                        type="button"
                        onClick={openNew}
                        className="btn-sheen relative flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 px-5 py-3 font-clash text-sm font-semibold text-white transition-all shadow-[0_4px_14px_rgba(5,150,105,0.35),inset_0_1px_0_rgba(255,255,255,0.15)] hover:shadow-[0_6px_20px_rgba(5,150,105,0.45)] hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <span className="pointer-events-none absolute top-0 left-0 right-0 h-px rounded-t-xl bg-white/20" />
                        <Plus size={16} />
                        Tambah Paket
                    </button>
                </div>

                {/* ── Plan grid / empty state ── */}
                {plans.length === 0 ? (

                    /* Empty state */
                    <div className="animate-fade-in-up delay-200 card-glint shimmer-once relative overflow-hidden flex flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200/80 bg-white py-20 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 shadow-inner">
                            <Package size={28} className="text-slate-400" />
                        </div>
                        <div className="text-center">
                            <p className="font-clash text-base font-semibold text-slate-600">Belum ada paket membership</p>
                            <p className="mt-1 font-bdo text-sm text-slate-400">Buat paket pertama untuk mulai menarik anggota.</p>
                        </div>
                        <button
                            type="button"
                            onClick={openNew}
                            className="btn-sheen relative flex items-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 px-6 py-2.5 font-clash text-sm font-semibold text-white shadow-[0_4px_14px_rgba(5,150,105,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] hover:-translate-y-0.5 transition-all active:translate-y-0"
                        >
                            <span className="pointer-events-none absolute top-0 left-0 right-0 h-px rounded-t-xl bg-white/20" />
                            <Plus size={15} />
                            Tambah Paket Pertama
                        </button>
                    </div>

                ) : (

                    /* Plan grid */
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 stagger">
                        {plans.map((plan, idx) => (
                            <PlanCard
                                key={plan.id}
                                plan={plan}
                                onEdit={openEdit}
                                onDelete={handleDelete}
                                index={idx}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ── Create / Edit SlideOver ── */}
            <SlideOver
                isOpen={slideOver.open}
                onClose={close}
                title={
                    <span className="font-clash text-xl font-bold">
                        {slideOver.item ? "Edit Paket" : "Tambah Paket"}
                    </span>
                }
                description={
                    slideOver.item
                        ? <span className="font-bdo text-sm text-slate-500">Mengedit <strong className="text-slate-700">"{slideOver.item.name}"</strong></span>
                        : <span className="font-bdo text-sm text-slate-500">Isi detail paket membership baru.</span>
                }
            >
                {slideOver.open && (
                    <PlanForm
                        key={slideOver.item?.id ?? "new"}
                        item={slideOver.item}
                        onClose={close}
                    />
                )}
            </SlideOver>
        </AdminLayout>
    );
}