import React, { useState, useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import {
    Activity,
    ArrowDownRight,
    ArrowUpRight,
    CalendarCheck2,
    CreditCard,
    LayoutGrid,
    TrendingUp,
    Users,
    Wallet,
    MoreHorizontal,
    Coins,
    Ticket,
    Star,
    UserCheck,
    ChevronRight,
    BarChart3,
    FileText,
    X,
} from "lucide-react";

// --- FALLBACK REACT BITS (preserved) ---
const SplitText = ({ text, className, delay = 50 }: { text: string, className?: string, delay?: number }) => (
    <span className={className} style={{ animation: `fadeInUp 0.5s ease forwards ${delay}ms`, opacity: 0 }}>{text}</span>
);
const ShinyTextBlack = ({ text, speed = 3, className = '' }: { text: string, speed?: number, className?: string }) => (
    <span className={`animate-shiny-black ${className}`} style={{ animationDuration: `${speed}s` }}>{text}</span>
);
const ShinyText = ({ text, speed = 3, className = '' }: { text: string, speed?: number, className?: string }) => (
    <span className={`animate-shiny-text ${className}`} style={{ animationDuration: `${speed}s` }}>{text}</span>
);

import AdminLayout from "@/Layouts/AdminLayout";
import { cn } from "@/lib/utils";
import type { PageProps, RecentActivity } from "@/types";

// ── Types (preserved) ──────────────────────────────────────────────────────────

interface DashboardStats {
    pendingIdentities: number;
    activeFacilities: number;
    todaysBookings: number;
    totalRevenue: number;
    activeMemberships: number;
}

interface OccupancyFacility {
    name: string;
    pct: number;
    color: string;
}

type DashboardProps = PageProps<{
    stats: DashboardStats;
    revenueTrend: number;
    dailyRevenue: number[];
    daysInMonth: number;
    currentMonthLabel: string;
    occupancyData: OccupancyFacility[];
    recentActivity: RecentActivity[];
}>;

// ── Helpers (preserved) ───────────────────────────────────────────────────────

function formatRevenue(amount: number): string {
    if (amount >= 1_000_000) {
        return `${(amount / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })}JT`;
    }
    if (amount >= 1_000) {
        return `${(amount / 1_000).toLocaleString("id-ID", { maximumFractionDigits: 0 })}rb`;
    }
    return amount.toLocaleString("id-ID");
}

function formatRupiahFull(amount: number): string {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

// ── Global Styles (merged from Dashboard + Roles) ─────────────────────────────

const DASHBOARD_STYLES = `
    .font-clash { font-family: 'Clash Display', sans-serif; }
    .font-bdo   { font-family: 'BDO Grotesk', sans-serif; }

    /* ── Shiny text animations ── */
    @keyframes shinyBlackText {
        0%   { background-position: -200% center; }
        100% { background-position:  200% center; }
    }
    .animate-shiny-black {
        background: linear-gradient(120deg, #0f172a 35%, #cbd5e1 50%, #0f172a 65%);
        background-size: 200% auto;
        color: transparent;
        -webkit-background-clip: text;
        background-clip: text;
        animation: shinyBlackText linear infinite;
    }
    @keyframes shinyText {
        0%   { background-position: -200% center; }
        100% { background-position:  200% center; }
    }
    .animate-shiny-text {
        background: linear-gradient(120deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.4) 100%);
        background-size: 200% auto;
        color: transparent;
        -webkit-background-clip: text;
        background-clip: text;
        animation: shinyText linear infinite;
    }

    /* ── Water caustics ── */
    @keyframes caustics {
        0%   { background-position:   0% 50%; opacity: 0.15; }
        50%  { background-position: 100% 50%; opacity: 0.35; }
        100% { background-position:   0% 50%; opacity: 0.15; }
    }
    .water-caustics-effect {
        background: radial-gradient(circle at top left,  rgba(255,255,255,0.3) 0%, transparent 40%),
                    radial-gradient(circle at bottom right, rgba(255,255,255,0.2) 0%, transparent 50%);
        background-size: 150% 150%;
        animation: caustics 8s ease-in-out infinite;
        mix-blend-mode: overlay;
    }

    /* ── Entrance animations ── */
    @keyframes fadeInUp {
        from { opacity: 0; transform: translate3d(0, 28px, 0); }
        to   { opacity: 1; transform: translate3d(0,  0,   0); }
    }
    @keyframes fadeInLeft {
        from { opacity: 0; transform: translate3d(-20px, 0, 0); }
        to   { opacity: 1; transform: translate3d(  0,   0, 0); }
    }
    @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.96); }
        to   { opacity: 1; transform: scale(1);    }
    }
    @keyframes float {
        0%, 100% { transform: translate3d(0,    0, 0); }
        50%       { transform: translate3d(0, -6px, 0); }
    }
    @keyframes pulseGlow {
        0%, 100% { opacity: 0.4; transform: scale(1)   translate3d(0,0,0); }
        50%       { opacity: 1;   transform: scale(1.1) translate3d(0,0,0); }
    }
    @keyframes drawCircle { from { stroke-dashoffset: 251.3; } }
    @keyframes progressFill { from { width: 0%; } }
    @keyframes barGrow {
        from { transform: scaleY(0); transform-origin: bottom; }
        to   { transform: scaleY(1); transform-origin: bottom; }
    }
    @keyframes slideDown {
        from { opacity: 0; transform: translateY(-14px); }
        to   { opacity: 1; transform: translateY(0);     }
    }

    .animate-fade-in-up   { animation: fadeInUp   0.7s  cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; will-change: opacity, transform; }
    .animate-fade-in-left { animation: fadeInLeft  0.55s cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; will-change: opacity, transform; }
    .animate-scale-in     { animation: scaleIn     0.5s  cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; }
    .animate-float        { animation: float       3.5s  ease-in-out infinite;                 will-change: transform; }
    .animate-pulse-glow   { animation: pulseGlow   2.5s  ease-in-out infinite;                 will-change: opacity, transform; }
    .progress-fill        { animation: progressFill 0.8s cubic-bezier(0.16,1,0.3,1) forwards; }
    .bar-grow             { animation: barGrow      0.6s cubic-bezier(0.16,1,0.3,1) forwards; }
    .analytics-enter      { animation: slideDown    0.5s cubic-bezier(0.16,1,0.3,1) forwards; }

    /* ── Delays ── */
    .delay-50  { animation-delay:  50ms; }
    .delay-100 { animation-delay: 100ms; }
    .delay-150 { animation-delay: 150ms; }
    .delay-200 { animation-delay: 200ms; }
    .delay-250 { animation-delay: 250ms; }
    .delay-300 { animation-delay: 300ms; }
    .delay-400 { animation-delay: 400ms; }
    .delay-500 { animation-delay: 500ms; }
    .delay-600 { animation-delay: 600ms; }

    /* ── Card effects (ported from Roles.tsx) ── */
    @keyframes cardBreath {
        0%, 100% { box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 0 0 1px rgba(226,232,240,0.8); }
        50%       { box-shadow: 0 4px 16px rgba(0,0,0,0.07), 0 0 0 1px rgba(249,115,22,0.2); }
    }
    .card-breath { animation: cardBreath 5s ease-in-out infinite; }

    .card-glint { position: relative; }
    .card-glint::before {
        content: '';
        position: absolute;
        top: 0; left: 20px; right: 20px; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent);
        pointer-events: none;
        z-index: 2;
    }

    /* ── Shimmer sweep — one-shot on load (ported from Roles.tsx) ── */
    @keyframes shimmerSweep {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(200%);  }
    }
    .shimmer-once { position: relative; overflow: hidden; }
    .shimmer-once::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.42) 50%, transparent 100%);
        width: 60%;
        animation: shimmerSweep 1.1s ease-out 0.45s forwards;
        pointer-events: none;
        border-radius: inherit;
    }

    /* ── Button shimmer (ported from Roles.tsx) ── */
    @keyframes btnSheen {
        0%   { left: -80%; }
        100% { left: 120%; }
    }
    .btn-sheen { position: relative; overflow: hidden; }
    .btn-sheen::before {
        content: '';
        position: absolute;
        top: 0; bottom: 0; width: 50%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
        animation: btnSheen 3s ease-in-out 1s infinite;
    }

    /* ── Icon glow (ported from Roles.tsx) ── */
    @keyframes iconGlow {
        0%, 100% { box-shadow: 0 2px 8px  rgba(15,23,42,0.20); }
        50%       { box-shadow: 0 2px 16px rgba(15,23,42,0.30), 0 0 24px rgba(249,115,22,0.18); }
    }
    .icon-glow { animation: iconGlow 3.5s ease-in-out infinite; }

    /* ── Active role sheen (ported from Roles.tsx) ── */
    @keyframes roleBtnSheen {
        0%   { left: -80%; }
        100% { left: 120%; }
    }

    /* ── Stagger children (ported from Roles.tsx) ── */
    .stagger > *:nth-child(1) { animation-delay:  80ms; }
    .stagger > *:nth-child(2) { animation-delay: 140ms; }
    .stagger > *:nth-child(3) { animation-delay: 200ms; }
    .stagger > *:nth-child(4) { animation-delay: 260ms; }
    .stagger > *:nth-child(5) { animation-delay: 320ms; }
    .stagger > *:nth-child(6) { animation-delay: 380ms; }

    /* ── Custom scrollbar ── */
    .custom-scrollbar::-webkit-scrollbar       { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #fed7aa; border-radius: 4px; }

    /* ── Badge pulse glow (low-spec: simple opacity + scale) ── */
    @keyframes badgePulseGreen {
        0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
        50%       { box-shadow: 0 0 0 5px rgba(34,197,94,0); }
    }
    @keyframes badgePulseBlue {
        0%, 100% { box-shadow: 0 0 0 0 rgba(56,189,248,0.5); }
        50%       { box-shadow: 0 0 0 5px rgba(56,189,248,0); }
    }
    @keyframes dotPingGreen {
        0%, 100% { opacity: 1; transform: scale(1); }
        50%       { opacity: 0.6; transform: scale(1.35); }
    }
    @keyframes dotPingBlue {
        0%, 100% { opacity: 1; transform: scale(1); }
        50%       { opacity: 0.6; transform: scale(1.4); }
    }
    .badge-aktif {
        background: rgba(16,185,129,0.12);
        border: 1px solid rgba(52,211,153,0.35);
        color: #34d399;
        animation: badgePulseGreen 2.5s ease-in-out infinite;
    }
    .badge-online {
        background: rgba(56,189,248,0.12);
        border: 1px solid rgba(56,189,248,0.35);
        color: #38bdf8;
        animation: badgePulseBlue 2.2s ease-in-out infinite;
    }
    .dot-ping-green { animation: dotPingGreen 2.5s ease-in-out infinite; }
    .dot-ping-blue  { animation: dotPingBlue  2.2s ease-in-out infinite; }

    /* ── Shiny occupancy text (visible on light bg) ── */
    @keyframes shinyOrangeText {
        0%   { background-position: -200% center; }
        100% { background-position:  200% center; }
    }
    .animate-shiny-orange {
        background: linear-gradient(120deg, #ea580c 25%, #fed7aa 50%, #ea580c 75%);
        background-size: 200% auto;
        color: transparent;
        -webkit-background-clip: text;
        background-clip: text;
        animation: shinyOrangeText 3s linear infinite;
    }

    /* ── Section separator accent ── */
    .section-divider {
        position: relative;
    }
    .section-divider::before {
        content: '';
        position: absolute;
        left: 0; top: 0; bottom: 0;
        width: 3px;
        background: linear-gradient(180deg, #f97316, #ea580c80, transparent);
        border-radius: 2px;
    }

    /* ── Bar chart bar hover ── */
    .bar-col:hover { filter: brightness(1.15); transform: scaleY(1.04); transform-origin: bottom; }
    .bar-col { transition: filter 0.15s, transform 0.15s; cursor: pointer; }

    /* ── Analytics dark panel ── */
    @keyframes analyticsSlide {
        from { opacity: 0; transform: translateY(-18px) scale(0.98); }
        to   { opacity: 1; transform: translateY(0)    scale(1); }
    }
    .analytics-dark-enter { animation: analyticsSlide 0.45s cubic-bezier(0.16,1,0.3,1) forwards; }

    /* ── Occupancy bar gradient glow ── */
    .occ-bar-inner { transition: width 0.9s cubic-bezier(0.16,1,0.3,1), filter 0.3s; }
    .occ-bar-inner:hover { filter: brightness(1.2) saturate(1.3); }

    /* ══════════════════════════════════════════════════════════════
       PRINT — Laporan Operasional (struktur invoice, isi laporan)
    ══════════════════════════════════════════════════════════════ */

    /* Hidden on screen */
    .print-report-template { display: none; }

    /* A4 paper container — height fit-content mencegah halaman kosong */
    .prt-a4-page {
        width: 210mm;
        height: auto;
        max-height: 297mm;
        overflow: hidden;
        margin: 0 auto;
        background: #fff;
        padding: 14mm 16mm;
        box-sizing: border-box;
        font-family: 'Courier New', Courier, monospace;
        font-size: 9pt;
        color: #111;
    }

    /* ── KOP SURAT persis invoice ── */
    .prt-header {
        display: flex;
        align-items: flex-start;
        gap: 0;
        margin-bottom: 0;
    }
    .prt-header-left {
        width: 72pt;
        flex-shrink: 0;
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
    }
    /* Logo: proporsi & ukuran sama dengan yang ada di file invoice */
    .prt-logo-img {
        width: 68pt;
        height: 68pt;
        object-fit: contain;
        display: block;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }
    .prt-header-right {
        flex: 1;
        padding-left: 10pt;
    }
    .prt-company-name-main {
        font-family: 'Courier New', Courier, monospace;
        font-size: 13pt;
        font-weight: bold;
        letter-spacing: 0.14em;
        line-height: 1.15;
        margin: 0;
    }
    .prt-company-name-sub {
        font-family: 'Courier New', Courier, monospace;
        font-size: 10pt;
        font-weight: bold;
        letter-spacing: 0.10em;
        margin: 1pt 0 3pt 0;
    }
    .prt-company-address {
        font-size: 8pt;
        line-height: 1.45;
        margin-bottom: 4pt;
        font-family: 'Courier New', Courier, monospace;
    }
    /* Garis bawah alamat — sama persis dengan garis invoice */
    .prt-header-divider {
        border: none;
        border-top: 1.5pt solid #111;
        margin: 3pt 0 4pt 0;
    }
    /* Judul dokumen tengah — bukan "Faktur Penjualan" */
    .prt-doc-title {
        font-family: 'Courier New', Courier, monospace;
        font-size: 15pt;
        font-weight: bold;
        letter-spacing: 0.04em;
        text-align: center;
        margin: 0;
    }

    /* META SECTION — Kepada kosong | info grid kanan */
    .prt-meta-outer {
        display: flex;
        gap: 0;
        margin-top: 6pt;
        margin-bottom: 8pt;
        border: 0.75pt solid #444;
    }
    .prt-meta-left {
        flex: 1;
        padding: 5pt 8pt 8pt 8pt;
        font-size: 8.5pt;
        border-right: 0.75pt solid #444;
        font-family: 'Courier New', Courier, monospace;
    }
    .prt-kepada-line {
        display: flex;
        align-items: baseline;
        gap: 2pt;
    }
    .prt-kepada-label { font-weight: bold; white-space: nowrap; }
    /* Garis kosong dashed — diisi manual, identik invoice */
    .prt-kepada-blank {
        flex: 1;
        border-bottom: 0.75pt dashed #888;
        min-width: 80pt;
        height: 10pt;
        display: inline-block;
    }
    /* Bank info — persis seperti di invoice, teks satu baris tidak terputus */
    .prt-payment-note {
        margin-top: 22pt;
        font-size: 8pt;
        font-weight: bold;
        line-height: 1.75;
        font-family: 'Courier New', Courier, monospace;
        white-space: nowrap;
    }
    .prt-meta-right { width: 230pt; flex-shrink: 0; }
    .prt-meta-right table {
        width: 100%;
        border-collapse: collapse;
        font-size: 8.5pt;
        font-family: 'Courier New', Courier, monospace;
    }
    /* Meta rows: label kiri | nilai kanan dalam SATU BARIS */
    .prt-meta-right table td {
        border-bottom: 0.75pt dashed #888;
        border-left: 0.75pt dashed #888;
        padding: 3.5pt 6pt;
        vertical-align: middle;
    }
    .prt-meta-right table td.meta-label-col {
        width: 45%;
        font-size: 8pt;
        color: #555;
        font-weight: normal;
        white-space: nowrap;
    }
    .prt-meta-right table td.meta-value-col {
        width: 55%;
        font-size: 8.5pt;
        font-weight: normal;
    }
    .prt-meta-right table td.meta-value-bold {
        font-weight: bold;
    }
    .prt-meta-right table tr:last-child td { border-bottom: none; }

    /* TABEL LAPORAN — kolom konteks laporan, BUKAN barang invoice */
    .prt-report-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 6pt;
        font-size: 8.5pt;
        font-family: 'Courier New', Courier, monospace;
    }
    .prt-report-table th {
        border: 0.75pt solid #111;
        padding: 4pt 6pt;
        text-align: center;
        font-weight: bold;
        background: #fff;
        font-family: 'Courier New', Courier, monospace;
    }
    .prt-report-table td {
        border: 0.75pt solid #444;
        padding: 4.5pt 6pt;
        vertical-align: middle;
        font-family: 'Courier New', Courier, monospace;
    }
    .prt-report-table td.rt-center { text-align: center; }
    .prt-report-table td.rt-right  { text-align: right; }
    .prt-report-table td.rt-bold   { font-weight: bold; }
    .prt-report-table tr.rt-filler td { color: #ddd; border-color: #eee; }

    /* BAWAH — Keterangan kosong | Ringkasan nilai */
    .prt-bottom-row { display: flex; gap: 0; margin-bottom: 0; }
    .prt-keterangan {
        flex: 1;
        border: 0.75pt solid #444;
        padding: 5pt 7pt;
        font-size: 8.5pt;
        min-height: 64pt;
        font-family: 'Courier New', Courier, monospace;
    }
    .prt-keterangan-label {
        font-weight: bold;
        font-size: 8pt;
        display: block;
        margin-bottom: 4pt;
        border-bottom: 0.5pt solid #ccc;
        padding-bottom: 2pt;
    }
    .prt-summary { width: 185pt; flex-shrink: 0; }
    .prt-summary table {
        width: 100%;
        border-collapse: collapse;
        font-size: 8.5pt;
        font-family: 'Courier New', Courier, monospace;
    }
    .prt-summary table td { border: 0.75pt solid #444; padding: 3.5pt 6pt; }
    .prt-summary table td:last-child { text-align: right; }
    .prt-summary table tr.sum-total td { font-weight: bold; }

    /* ── Footer halaman: pojok kiri bawah "Halaman X dari Y" ── */
    .prt-page-footer {
        margin-top: 10pt;
        font-family: 'Courier New', Courier, monospace;
        font-size: 8pt;
        color: #555;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 0.5pt solid #ccc;
        padding-top: 5pt;
    }

    /* @media print: tampilkan template, sembunyikan UI layar */
    @media print {
        @page { size: A4 portrait; margin: 0; }

        body * { visibility: hidden !important; }

        .print-report-template,
        .print-report-template * { visibility: visible !important; }

        .print-report-template {
            display: block !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            z-index: 99999 !important;
        }

        .prt-a4-page {
            width: 210mm !important;
            /* Gunakan height: fit-content agar tidak ada halaman kosong */
            height: auto !important;
            min-height: unset !important;
            max-height: 297mm !important;
            overflow: hidden !important;
            padding: 14mm 16mm !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
        }

        .prt-logo-img {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            width: 68pt !important;
            height: 68pt !important;
        }
    }
`;


// ── ShinyIcon — ported from Roles.tsx ────────────────────────────────────────

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
            <span className="pointer-events-none absolute top-[3px] left-[5px] right-[5px] h-[5px] rounded-full bg-white/20 blur-[1px]" />
        </div>
    );
}

// ── PremiumStatCard (preserved – design backup) ───────────────────────────────

function PremiumStatCard({
    title, value, subtitle, icon: Icon, decorIcon: DecorIcon, bgGradient, statusDot, statusText, delay
}: {
    title: string; value: string; subtitle: string; icon: React.ElementType; decorIcon: React.ElementType;
    bgGradient: string; statusDot: string; statusText: string; delay: string;
}) {
    return (
        <div className={`relative h-[230px] rounded-[24px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer ${bgGradient} animate-fade-in-up ${delay}`}>
            <div className="absolute inset-0 water-caustics-effect pointer-events-none"></div>
            <div className="absolute top-6 left-6 opacity-30 animate-pulse-glow pointer-events-none">
                <DecorIcon className="w-10 h-10 text-white drop-shadow-md" />
            </div>
            <div className="absolute top-5 right-5 bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-xl flex items-center gap-2 z-10 hover:bg-white/20 transition-colors">
                <div className={`w-2 h-2 rounded-full ${statusDot} shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse-glow`}></div>
                <span className="font-bdo text-[11px] font-bold text-white tracking-wide uppercase">{statusText}</span>
            </div>
            <div className="absolute bottom-0 w-full h-[65%] bg-[#12131c] border-t border-white/10 rounded-t-[24px] flex flex-col justify-end p-6 shadow-[inset_0_-20px_40px_-15px_rgba(249,115,22,0.5)]">
                <div className="absolute -top-6 left-6 bg-white/10 backdrop-blur-xl p-3 rounded-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] animate-float">
                    <Icon className="w-6 h-6 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                </div>
                <h3 className="text-white font-clash font-medium text-base mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] leading-tight w-4/5">
                    <SplitText text={title} delay={200} />
                </h3>
                <div className="flex justify-between items-end mb-3">
                    <span className="font-clash text-3xl font-bold tracking-tight">
                        <ShinyText text={value} speed={3} className="text-white" />
                    </span>
                    <span className="font-bdo text-[11px] text-slate-400 font-medium mb-1.5">{subtitle}</span>
                </div>
                <div className="w-full flex items-center gap-1.5 opacity-80">
                    {[...Array(15)].map((_, i) => (
                        <div key={i} className={`h-[3px] rounded-full flex-1 transition-all duration-700 delay-[${i * 50}ms] ${i < 10 ? 'bg-orange-400 shadow-[0_0_5px_rgba(251,146,60,0.8)]' : 'bg-white/10'}`}></div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── Smooth bezier path helper ─────────────────────────────────────────────────

function smoothBezierPath(pts: { x: number; y: number }[]): string {
    if (pts.length < 2) return '';
    const d: string[] = [`M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`];
    for (let i = 1; i < pts.length; i++) {
        const p0 = pts[Math.max(0, i - 2)];
        const p1 = pts[i - 1];
        const p2 = pts[i];
        const p3 = pts[Math.min(pts.length - 1, i + 1)];
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        d.push(`C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`);
    }
    return d.join(' ');
}

// ── CUSTOM INTERACTIVE CHART (enhanced – smooth bezier, avg line, better UX) ──

function InteractiveRevenueChart({ data, monthLabel }: { data: number[], monthLabel: string }) {
    const [activePoint, setActivePoint] = useState<number | null>(null);
    const [isLoaded, setIsLoaded]       = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setIsLoaded(true), 150);
        return () => clearTimeout(t);
    }, []);

    const chartData = data && data.length > 0 ? data : Array(30).fill(0);
    const maxVal    = Math.max(...chartData, 1000);
    const avgVal    = chartData.reduce((a, b) => a + b, 0) / chartData.length;

    const points = chartData.map((val, i) => ({
        x: (i / (chartData.length - 1)) * 100,
        y: 100 - (val / maxVal) * 100,
        val,
        day: i + 1,
    }));

    const smoothLine = smoothBezierPath(points);
    const smoothArea = `${smoothLine} L 100 100 L 0 100 Z`;
    const avgY       = 100 - (avgVal / maxVal) * 100;

    const peakIdx  = chartData.indexOf(Math.max(...chartData));
    const peakDay  = peakIdx + 1;
    const activeDays = chartData.filter(v => v > 0).length;

    return (
        <div className="flex flex-col gap-3 w-full mt-2 font-bdo select-none">

            {/* Mini stats strip */}
            <div className="grid grid-cols-3 gap-2">
                {[
                    { label: "Hari Puncak", value: `Tgl ${peakDay}`, accent: "text-orange-500", bg: "bg-orange-50 border-orange-100" },
                    { label: "Rata-rata", value: formatRevenue(Math.round(avgVal)), accent: "text-slate-800", bg: "bg-slate-50 border-slate-100" },
                    { label: "Hari Aktif", value: `${activeDays} hari`, accent: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
                ].map(s => (
                    <div key={s.label} className={`rounded-xl border px-2.5 py-2 ${s.bg}`}>
                        <p className="font-bdo text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">{s.label}</p>
                        <p className={`font-clash text-sm font-bold ${s.accent}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Chart */}
            <div className="relative w-full h-[200px]">
                {/* Y-Axis Labels */}
                <div className="absolute left-0 top-0 bottom-7 flex flex-col justify-between text-[9px] font-medium text-slate-300 pointer-events-none">
                    <span>{formatRevenue(maxVal)}</span>
                    <span>{formatRevenue(maxVal * 0.67)}</span>
                    <span>{formatRevenue(maxVal * 0.33)}</span>
                    <span className="text-slate-200">0</span>
                </div>

                {/* Chart Area */}
                <div className="absolute left-10 right-0 top-0 bottom-7">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                        <defs>
                            <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%"   stopColor="#f97316" stopOpacity="0.28" />
                                <stop offset="45%"  stopColor="#f97316" stopOpacity="0.08" />
                                <stop offset="100%" stopColor="#f97316" stopOpacity="0"    />
                            </linearGradient>
                            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%"   stopColor="#c2410c" />
                                <stop offset="40%"  stopColor="#f97316" />
                                <stop offset="100%" stopColor="#fb923c" />
                            </linearGradient>
                            <linearGradient id="avgLineGrad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%"   stopColor="#fdba74" stopOpacity="0" />
                                <stop offset="30%"  stopColor="#fdba74" stopOpacity="0.9" />
                                <stop offset="70%"  stopColor="#fdba74" stopOpacity="0.9" />
                                <stop offset="100%" stopColor="#fdba74" stopOpacity="0" />
                            </linearGradient>
                            <filter id="lineGlow" x="-20%" y="-40%" width="140%" height="180%">
                                <feGaussianBlur stdDeviation="1.5" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                            <filter id="dotGlow" x="-80%" y="-80%" width="260%" height="260%">
                                <feGaussianBlur stdDeviation="2" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>

                        {/* Subtle grid */}
                        <line x1="0" y1="0"   x2="100" y2="0"   stroke="#f1f5f9" strokeWidth="0.4" />
                        <line x1="0" y1="33"  x2="100" y2="33"  stroke="#f1f5f9" strokeWidth="0.35" strokeDasharray="1.5 2" />
                        <line x1="0" y1="67"  x2="100" y2="67"  stroke="#f1f5f9" strokeWidth="0.35" strokeDasharray="1.5 2" />
                        <line x1="0" y1="100" x2="100" y2="100" stroke="#e2e8f0" strokeWidth="0.7" />

                        {/* Average reference line */}
                        <line
                            x1="0" y1={avgY} x2="100" y2={avgY}
                            stroke="url(#avgLineGrad)" strokeWidth="0.7" strokeDasharray="4 2.5"
                            className={`transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                        />

                        {/* Area fill */}
                        <path
                            d={smoothArea}
                            fill="url(#chartAreaGrad)"
                            className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                        />

                        {/* Smooth line */}
                        <path
                            d={smoothLine}
                            fill="none"
                            stroke="url(#lineGrad)"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            filter="url(#lineGlow)"
                            style={{
                                strokeDasharray: 600,
                                strokeDashoffset: isLoaded ? 0 : 600,
                                transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
                            }}
                        />

                        {/* Peak highlight dot (always visible) */}
                        {isLoaded && points[peakIdx] && (
                            <g filter="url(#dotGlow)">
                                <circle cx={points[peakIdx].x} cy={points[peakIdx].y} r="3.5" fill="#f97316" opacity="0.3" />
                                <circle cx={points[peakIdx].x} cy={points[peakIdx].y} r="2"   fill="#f97316" />
                                <circle cx={points[peakIdx].x} cy={points[peakIdx].y} r="0.9" fill="#fff" />
                            </g>
                        )}

                        {/* Interactive hit targets + dots */}
                        {points.map((p, i) => (
                            <g key={i} onClick={() => setActivePoint(activePoint === i ? null : i)} className="cursor-crosshair group">
                                <line
                                    x1={p.x} y1="100" x2={p.x} y2={p.y}
                                    stroke="#f97316" strokeWidth="0.6" strokeDasharray="1 1.5"
                                    opacity={activePoint === i ? 0.6 : 0}
                                    style={{ transition: 'opacity 0.15s' }}
                                />
                                <circle
                                    cx={p.x} cy={p.y}
                                    r={activePoint === i ? 2.8 : 1.6}
                                    fill={activePoint === i ? "#fff" : "#f97316"}
                                    stroke={activePoint === i ? "#f97316" : "#ea580c"}
                                    strokeWidth={activePoint === i ? "1.2" : "0.5"}
                                    className={`transition-all duration-200 ${activePoint === i ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                />
                                {/* Enlarged invisible hit area */}
                                <circle cx={p.x} cy={p.y} r="4.5" fill="transparent" />
                            </g>
                        ))}
                    </svg>

                    {/* X-Axis labels */}
                    <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[9px] font-medium text-slate-300">
                        <span>1</span>
                        <span className="text-orange-400 font-bold">{monthLabel}</span>
                        <span>{points.length}</span>
                    </div>

                    {/* Avg label */}
                    {isLoaded && avgVal > 100 && (
                        <div
                            className="absolute pointer-events-none"
                            style={{ top: `${(avgY / 100) * 100}%`, left: '2px', transform: 'translateY(-50%)' }}
                        >
                            <span className="font-bdo text-[8px] font-bold text-amber-500 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md leading-none shadow-sm">
                                avg
                            </span>
                        </div>
                    )}

                    {/* HTML Tooltip */}
                    {activePoint !== null && (
                        <div
                            className="absolute z-20 pointer-events-none animate-scale-in"
                            style={{
                                left: `${points[activePoint].x}%`,
                                top:  `${points[activePoint].y}%`,
                                transform: `translate(${points[activePoint].x > 60 ? '-108%' : '12%'}, -130%)`,
                            }}
                        >
                            <div className="bg-white border border-orange-200 text-slate-900 rounded-2xl shadow-[0_8px_28px_rgba(249,115,22,0.15),0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden min-w-[140px]">
                                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-1.5 flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_4px_rgba(255,255,255,0.9)]"></span>
                                    <p className="font-bdo text-[9px] font-bold text-white uppercase tracking-widest">
                                        {points[activePoint].day} {monthLabel}
                                    </p>
                                </div>
                                <div className="px-3 py-2.5">
                                    <p className="font-clash text-sm font-bold text-slate-900 leading-tight">
                                        {formatRupiahFull(points[activePoint].val)}
                                    </p>
                                    <p className={cn("font-bdo text-[9px] mt-0.5 font-semibold",
                                        points[activePoint].val > avgVal ? "text-emerald-600" :
                                        points[activePoint].val === 0 ? "text-slate-400" : "text-rose-500"
                                    )}>
                                        {points[activePoint].val > avgVal ? '↑ di atas rata-rata' : points[activePoint].val === 0 ? '— tidak ada transaksi' : '↓ di bawah rata-rata'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Premium Identity Queue (enhanced – card-glint, shimmer, urgency bar) ─────

function PremiumIdentityQueue({ count }: { count: number }) {
    const urgencyPct   = Math.min(count * 10, 100);
    const urgencyLabel = count > 5 ? 'Tinggi' : count > 2 ? 'Sedang' : 'Rendah';
    const urgencyColor = count > 5 ? '#ef4444' : count > 2 ? '#f97316' : '#22c55e';

    return (
        <div className="animate-fade-in-up delay-400 bg-white rounded-[24px] p-6 shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow relative overflow-hidden flex flex-col gap-5 card-glint shimmer-once">
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent z-10" />

            {/* Header — sama persis dengan OccupancyCard */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <ShinyIcon className="h-10 w-10">
                        <UserCheck className="w-4 h-4 text-orange-300" />
                    </ShinyIcon>
                    <div>
                        <p className="font-bdo text-[10px] font-bold uppercase tracking-widest text-slate-400">Verifikasi</p>
                        <h2 className="font-clash text-base font-semibold text-slate-900 leading-tight">Antrean Identitas</h2>
                        <p className="font-bdo text-[11px] font-medium text-slate-500">Menunggu verifikasi</p>
                    </div>
                </div>
                {/* Overall count circle — mirip donut di OccupancyCard */}
                <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 rounded-full blur-xl opacity-20" style={{ background: urgencyColor }} />
                    <div className="relative bg-gradient-to-b from-slate-50 to-white border border-slate-200 w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-inner">
                        <span className="font-clash text-2xl font-bold text-slate-900 leading-none">{count}</span>
                        <span className="font-bdo text-[8px] uppercase font-bold text-slate-400 mt-0.5">item</span>
                    </div>
                </div>
            </div>

            {/* Progress bar rows — style sama dengan OccupancyCard per-facility */}
            <div className="w-full space-y-3.5 bg-slate-50/60 p-4 rounded-2xl border border-slate-100/80">
                {/* Pending row */}
                <div className="group animate-fade-in-up" style={{ animationDelay: '320ms' }}>
                    <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 relative animate-pulse" style={{ backgroundColor: urgencyColor, boxShadow: `0 0 6px ${urgencyColor}70` }}>
                                <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white/60 rounded-full"></div>
                            </div>
                            <span className="font-bdo text-[12px] font-medium text-slate-600">Pending</span>
                        </div>
                        <span className="font-clash text-[13px] font-semibold text-slate-800">{count}</span>
                    </div>
                    <div className="h-[4px] w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                        <div
                            className="occ-bar-inner h-full rounded-full progress-fill"
                            style={{
                                width: `${urgencyPct}%`,
                                background: `linear-gradient(90deg, ${urgencyColor}aa, ${urgencyColor})`,
                                boxShadow: `0 0 8px ${urgencyColor}55`,
                                animationDelay: '400ms',
                            }}
                        />
                    </div>
                </div>

                {/* Urgensi row */}
                <div className="group animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                    <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 relative" style={{ backgroundColor: '#94a3b8', boxShadow: '0 0 6px #94a3b870' }}>
                                <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white/60 rounded-full"></div>
                            </div>
                            <span className="font-bdo text-[12px] font-medium text-slate-600">Urgensi</span>
                        </div>
                        <span className="font-clash text-[13px] font-semibold" style={{ color: urgencyColor }}>{urgencyLabel}</span>
                    </div>
                    <div className="h-[4px] w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                        <div
                            className="occ-bar-inner h-full rounded-full progress-fill"
                            style={{
                                width: `${urgencyPct}%`,
                                background: `linear-gradient(90deg, #94a3b8aa, #94a3b8)`,
                                boxShadow: '0 0 8px #94a3b855',
                                animationDelay: '480ms',
                            }}
                        />
                    </div>
                </div>
            </div>

            <button className="w-full bg-[#12131c] hover:bg-slate-900 text-white font-clash text-sm font-medium py-3.5 rounded-xl shadow-[inset_0_-8px_15px_-5px_rgba(249,115,22,0.4)] transition-all flex items-center justify-center gap-2 group btn-sheen active:scale-[0.98]">
                Kelola Antrean
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-orange-400" />
            </button>
        </div>
    );
}

// ── Activity Feed (enhanced) ──────────────────────────────────────────────────

const ACTIVITY_ICON: Record<RecentActivity["type"], React.ReactNode> = {
    booking:    <CalendarCheck2 className="w-4 h-4 text-orange-400" />,
    membership: <Users          className="w-4 h-4 text-purple-400" />,
    payment:    <CreditCard     className="w-4 h-4 text-emerald-400" />,
};

const ACTIVITY_BAR: Record<RecentActivity["type"], string> = {
    booking:    "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.6)]",
    membership: "bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.6)]",
    payment:    "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]",
};

const ACTIVITY_TYPE_LABEL: Record<RecentActivity["type"], string> = {
    booking:    "Booking",
    membership: "Membership",
    payment:    "Pembayaran",
};

const ACTIVITY_TYPE_COLOR: Record<RecentActivity["type"], string> = {
    booking:    "text-orange-600 bg-orange-50 border-orange-100",
    membership: "text-purple-600 bg-purple-50 border-purple-100",
    payment:    "text-emerald-600 bg-emerald-50 border-emerald-100",
};

function ActivityFeed({ items }: { items: RecentActivity[] }) {
    if (items.length === 0) {
        return (
            <div className="py-12 flex flex-col items-center justify-center gap-3 animate-fade-in-up">
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <Activity className="w-8 h-8 text-slate-300" />
                </div>
                <p className="font-bdo text-sm text-slate-400">Belum ada aktivitas.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {items.map((item, index) => {
                const isFirst  = index === 0;
                const animDelay = `${(index + 1) * 80}ms`;

                if (isFirst) {
                    return (
                        <div
                            key={`${item.type}-${item.id}`}
                            className="animate-fade-in-up bg-[#12131c] p-5 rounded-2xl border border-slate-800 shadow-[inset_0_-15px_30px_-10px_rgba(249,115,22,0.3),_0_8px_24px_rgba(0,0,0,0.18)] relative overflow-hidden group cursor-pointer hover:border-orange-500/40 transition-all duration-300"
                            style={{ animationDelay: animDelay }}
                        >
                            {/* Left accent strip */}
                            <div className="absolute left-0 top-4 bottom-4 w-[3px] bg-gradient-to-b from-orange-400 via-orange-500 to-orange-500/30 rounded-full" />
                            <div className="absolute inset-0 water-caustics-effect opacity-10 pointer-events-none"></div>
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent pointer-events-none"></div>

                            {/* Top row */}
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className="flex gap-3 flex-1 min-w-0">
                                    <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-md border border-white/10 animate-float shadow-lg flex-shrink-0">
                                        {ACTIVITY_ICON[item.type]}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                            <h3 className="font-clash text-sm font-medium text-white group-hover:text-orange-400 transition-colors">{item.title}</h3>
                                            <span className={cn("font-bdo text-[10px] font-bold uppercase tracking-wide border rounded-md px-1.5 py-0.5", ACTIVITY_TYPE_COLOR[item.type])}>
                                                {ACTIVITY_TYPE_LABEL[item.type]}
                                            </span>
                                        </div>
                                        <p className="font-bdo text-[11px] font-light text-slate-400 truncate">{item.subtitle}</p>
                                    </div>
                                </div>
                                <MoreHorizontal className="w-4 h-4 text-slate-500 hover:text-white transition-colors flex-shrink-0 ml-2" />
                            </div>

                            {/* Bottom row */}
                            <div className="relative z-10 flex items-center justify-between">
                                <span className="font-bdo text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_6px_rgba(249,115,22,0.8)]"></span>
                                    Terbaru
                                </span>
                                <span className="font-bdo text-[11px] text-orange-300 flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-lg">
                                    {item.time}
                                </span>
                            </div>

                            <div className="mt-3 relative z-10">
                                <div className="w-full bg-slate-800/50 rounded-full h-1.5 overflow-hidden border border-slate-700/50">
                                    <div className={`h-1.5 rounded-full ${ACTIVITY_BAR[item.type]}`} style={{ width: '100%' }}></div>
                                </div>
                            </div>
                        </div>
                    );
                }

                return (
                        <div
                            key={`${item.type}-${item.id}`}
                            className="animate-fade-in-up p-4 rounded-2xl border border-slate-100 bg-white hover:border-orange-200 hover:shadow-md transition-all cursor-pointer group card-glint relative overflow-hidden"
                            style={{ animationDelay: animDelay }}
                        >
                            {/* Subtle bottom color accent */}
                            <div className={`absolute bottom-0 left-4 right-4 h-[2px] rounded-full opacity-40 ${ACTIVITY_BAR[item.type].split(' ')[0]}`} />
                            <div className="flex justify-between items-center">
                                <div className="flex gap-3 items-start flex-1 min-w-0">
                                    <div className="bg-[#12131c] p-2.5 rounded-xl shadow-[inset_0_-8px_15px_-5px_rgba(249,115,22,0.5),0_0_0_1px_rgba(249,115,22,0.1)] group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                                        {ACTIVITY_ICON[item.type]}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                            <h3 className="font-clash text-sm font-medium text-slate-900">{item.title}</h3>
                                            <span className={cn("font-bdo text-[10px] font-bold uppercase tracking-wide border rounded-md px-1.5 py-0.5", ACTIVITY_TYPE_COLOR[item.type])}>
                                                {ACTIVITY_TYPE_LABEL[item.type]}
                                            </span>
                                        </div>
                                        <p className="font-bdo text-[11px] font-light text-slate-500 truncate">{item.subtitle}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1.5 flex-shrink-0 ml-3">
                                    <span className="font-bdo text-[11px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 whitespace-nowrap">{item.time}</span>
                                    <div className={`h-1 w-14 rounded-full ${ACTIVITY_BAR[item.type].split(' ')[0]} opacity-60`}></div>
                                </div>
                            </div>
                        </div>
                );
            })}
        </div>
    );
}

// ── OccupancyCard (enhanced – ShinyIcon, progress bars, card-glint) ───────────

function OccupancyCard({ facilities }: { facilities: OccupancyFacility[] }) {
    const overall = facilities.length > 0
        ? Math.round(facilities.reduce((sum, f) => sum + f.pct, 0) / facilities.length)
        : 0;

    const dashArray = `${(overall / 100) * 251.3} 251.3`;

    return (
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-200/80 animate-fade-in-up delay-300 flex flex-col justify-between card-glint shimmer-once relative overflow-hidden">
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent z-10" />

            <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-3">
                    <ShinyIcon className="h-10 w-10">
                        <Activity className="w-4 h-4 text-orange-300" />
                    </ShinyIcon>
                    <div>
                        <p className="font-bdo text-[10px] font-bold uppercase tracking-widest text-slate-400">Real-time</p>
                        <h2 className="font-clash text-base font-semibold text-slate-900 leading-tight">Okupansi Lapangan</h2>
                        <p className="font-bdo text-[11px] font-medium text-slate-500">{facilities.length} fasilitas aktif</p>
                    </div>
                </div>
                <span className="rounded-xl font-bdo bg-orange-50 px-3 py-1.5 text-[10px] font-bold text-orange-600 border border-orange-100 uppercase tracking-wide">
                    Hari Ini
                </span>
            </div>

            <div className="flex flex-col items-center">
                {/* Donut gauge */}
                <div className="relative w-40 h-40 mb-5 hover:scale-105 transition-transform duration-500 cursor-default">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-xl">
                        <defs>
                            <linearGradient id="trackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%"   stopColor="#f1f5f9" />
                                <stop offset="100%" stopColor="#e2e8f0" />
                            </linearGradient>
                            <linearGradient id="shinyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%"   stopColor="#fb923c" />
                                <stop offset="35%"  stopColor="#f97316" />
                                <stop offset="65%"  stopColor="#ea580c" />
                                <stop offset="100%" stopColor="#c2410c" />
                            </linearGradient>
                            <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                                <feGaussianBlur stdDeviation="2.5" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>

                        {/* Track */}
                        <circle cx="50" cy="50" r="40" fill="none" stroke="url(#trackGrad)" strokeWidth="11" />
                        {/* Main progress arc */}
                        <circle cx="50" cy="50" r="40" fill="none" stroke="url(#shinyGradient)" strokeWidth="11"
                            strokeDasharray={dashArray} strokeLinecap="round" filter="url(#glow)"
                            className="transition-all duration-1000 ease-out"
                            style={{ animation: 'drawCircle 1.5s ease-out forwards' }}
                        />
                        {/* Inner ring accent */}
                        <circle cx="50" cy="50" r="31" fill="none" stroke="#f97316" strokeWidth="0.4" opacity="0.18" />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in-up delay-500">
                        <span className="font-clash text-3xl font-bold leading-none animate-shiny-orange">{overall}%</span>
                        <span className="font-bdo text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wider">Okupansi</span>
                    </div>
                </div>

                {/* Per-facility breakdown with progress bars */}
                <div className="w-full space-y-3.5 bg-slate-50/60 p-4 rounded-2xl border border-slate-100/80">
                    {facilities.length > 0 ? (
                        facilities.map((f, i) => (
                            <div
                                key={f.name}
                                className="animate-fade-in-up group"
                                style={{ animationDelay: `${(i + 4) * 80}ms` }}
                            >
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 relative group-hover:scale-125 transition-transform" style={{ backgroundColor: f.color, boxShadow: `0 0 6px ${f.color}70` }}>
                                            <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white/60 rounded-full"></div>
                                        </div>
                                        <span className="font-bdo text-[12px] font-medium text-slate-600">{f.name}</span>
                                    </div>
                                    <span className="font-clash text-[13px] font-semibold text-slate-800">{f.pct}%</span>
                                </div>
                                <div className="h-[4px] w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className="occ-bar-inner h-full rounded-full progress-fill"
                                        style={{
                                            width: `${f.pct}%`,
                                            background: `linear-gradient(90deg, ${f.color}aa, ${f.color})`,
                                            boxShadow: `0 0 8px ${f.color}55`,
                                            animationDelay: `${(i + 4) * 80 + 200}ms`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="py-2 text-center text-sm font-bdo text-slate-400">Belum ada data fasilitas.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Analytics Panel (NEW — visual-only, uses existing props, no backend calls) ─

function AnalyticsPanel({
    dailyRevenue,
    occupancyData,
    stats,
    currentMonthLabel,
    onClose,
}: {
    dailyRevenue: number[];
    occupancyData: OccupancyFacility[];
    stats: DashboardStats;
    currentMonthLabel: string;
    onClose: () => void;
}) {
    const safeData  = dailyRevenue && dailyRevenue.length > 0 ? dailyRevenue : [];
    const maxRev    = Math.max(...safeData, 1);
    const avgRev    = safeData.length > 0 ? safeData.reduce((a, b) => a + b, 0) / safeData.length : 0;
    const peakIdx   = safeData.indexOf(Math.max(...safeData));
    const peakDay   = peakIdx + 1;
    const activeDays = safeData.filter(d => d > 0).length;
    const overallOcc = occupancyData.length > 0
        ? Math.round(occupancyData.reduce((s, f) => s + f.pct, 0) / occupancyData.length)
        : 0;

    const [selectedBar, setSelectedBar] = useState<number | null>(null);

    const kpis = [
        {
            label:  "Hari Puncak",
            value:  `${peakDay} ${currentMonthLabel}`,
            sub:    formatRupiahFull(Math.max(...safeData, 0)),
            accent: "text-orange-600",
            icon:   "🏆",
            bg:     "bg-orange-50 border-orange-200",
            iconBg: "bg-orange-100",
        },
        {
            label:  "Rata-rata Harian",
            value:  formatRevenue(Math.round(avgRev)),
            sub:    `per hari di ${currentMonthLabel}`,
            accent: "text-slate-800",
            icon:   "📊",
            bg:     "bg-slate-50 border-slate-200",
            iconBg: "bg-slate-100",
        },
        {
            label:  "Hari Aktif",
            value:  `${activeDays}`,
            sub:    `dari ${safeData.length} hari`,
            accent: "text-emerald-700",
            icon:   "✅",
            bg:     "bg-emerald-50 border-emerald-200",
            iconBg: "bg-emerald-100",
        },
        {
            label:  "Rerata Okupansi",
            value:  `${overallOcc}%`,
            sub:    `${occupancyData.length} fasilitas`,
            accent: "text-violet-700",
            icon:   "🏟️",
            bg:     "bg-violet-50 border-violet-200",
            iconBg: "bg-violet-100",
        },
    ];

    return (
        <div className="analytics-dark-enter bg-white rounded-[24px] border border-slate-200/80 shadow-[0_8px_32px_rgba(0,0,0,0.06)] overflow-hidden relative card-glint">
            {/* Top shimmer line */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-300/60 to-transparent z-10" />
            {/* Subtle bg decoration */}
            <div className="pointer-events-none absolute top-0 right-0 w-72 h-72 bg-orange-50/60 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 w-48 h-48 bg-violet-50/40 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-orange-50/60 via-white to-white relative z-10">
                <div className="flex items-center gap-3">
                    <div className="relative flex shrink-0 items-center justify-center rounded-xl h-10 w-10
                        bg-gradient-to-br from-orange-500 to-orange-700
                        shadow-[0_4px_16px_rgba(249,115,22,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]">
                        <BarChart3 className="w-4 h-4 text-white" />
                        <span className="pointer-events-none absolute top-[3px] left-[5px] right-[5px] h-[5px] rounded-full bg-white/25 blur-[1px]" />
                    </div>
                    <div>
                        <p className="font-bdo text-[10px] font-bold uppercase tracking-widest text-orange-500">Analitik Mendalam</p>
                        <p className="font-clash text-lg font-semibold text-slate-900 leading-tight">Ringkasan {currentMonthLabel}</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700 border border-transparent hover:border-slate-200"
                    aria-label="Tutup panel analitik"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-6 border-b border-slate-100 relative z-10">
                {kpis.map((kpi, i) => (
                    <div
                        key={kpi.label}
                        className={cn("rounded-2xl p-4 border animate-fade-in-up relative overflow-hidden", kpi.bg)}
                        style={{ animationDelay: `${i * 70}ms` }}
                    >
                        <div className="absolute top-3 right-3 text-base opacity-50">{kpi.icon}</div>
                        <p className="font-bdo text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">{kpi.label}</p>
                        <p className={cn("font-clash text-xl font-bold leading-tight", kpi.accent)}>{kpi.value}</p>
                        <p className="font-bdo text-[10px] text-slate-500 mt-1.5">{kpi.sub}</p>
                    </div>
                ))}
            </div>

            {/* Daily Revenue Bar Chart */}
            {safeData.length > 0 && (
                <div className="px-6 py-5 border-b border-slate-100 relative z-10">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                        <div>
                            <p className="font-bdo text-[9px] font-bold uppercase tracking-widest text-slate-400">Distribusi Pendapatan Harian</p>
                            <p className="font-clash text-sm font-semibold text-slate-800 mt-0.5">{currentMonthLabel}</p>
                        </div>
                        <div className="flex items-center gap-3 font-bdo text-[10px] text-slate-400">
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-sm bg-orange-500 inline-block shadow-[0_0_4px_rgba(249,115,22,0.4)]"></span>Puncak
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-sm bg-orange-200 inline-block"></span>Di atas rata-rata
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-sm bg-slate-200 inline-block"></span>Rendah
                            </span>
                        </div>
                    </div>

                    {/* Selected day detail card */}
                    {selectedBar !== null && (
                        <div className="mb-3 bg-orange-50 border border-orange-200 rounded-2xl px-4 py-3 flex items-center justify-between animate-scale-in">
                            <div>
                                <p className="font-bdo text-[9px] font-bold uppercase tracking-widest text-orange-500/80">Detail Hari</p>
                                <p className="font-clash text-base font-bold text-slate-900">{formatRupiahFull(safeData[selectedBar])}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bdo text-[9px] text-slate-500 uppercase tracking-wide">{selectedBar + 1} {currentMonthLabel}</p>
                                <p className={cn("font-bdo text-[10px] font-bold mt-0.5", safeData[selectedBar] > avgRev ? "text-emerald-600" : safeData[selectedBar] === 0 ? "text-slate-400" : "text-rose-500")}>
                                    {safeData[selectedBar] > avgRev ? '↑ Di atas rata-rata' : safeData[selectedBar] === 0 ? '— Tidak ada transaksi' : '↓ Di bawah rata-rata'}
                                </p>
                            </div>
                            <button onClick={() => setSelectedBar(null)} className="text-slate-400 hover:text-slate-700 transition-colors ml-3">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}

                    <div className="relative bg-slate-50/70 rounded-2xl p-3 border border-slate-100">
                        <div className="flex items-end gap-[2px] sm:gap-[3px] h-36 w-full">
                            {safeData.map((val, i) => {
                                const heightPct  = maxRev > 0 ? (val / maxRev) * 92 : 2;
                                const isPeak     = i === peakIdx;
                                const isAboveAvg = val > avgRev && !isPeak;
                                const isSelected = i === selectedBar;
                                return (
                                    <div
                                        key={i}
                                        className="bar-col relative flex-1 rounded-t-[3px] group"
                                        style={{
                                            height: `${Math.max(heightPct, 2)}%`,
                                            background: isPeak
                                                ? 'linear-gradient(180deg, #f97316, #ea580c)'
                                                : isAboveAvg
                                                    ? 'linear-gradient(180deg, #fdba74, #fb923c)'
                                                    : '#e2e8f0',
                                            boxShadow: isPeak ? '0 0 8px rgba(249,115,22,0.4)' : 'none',
                                            outline: isSelected ? '2px solid rgba(249,115,22,0.6)' : 'none',
                                            outlineOffset: '1px',
                                            borderRadius: '3px 3px 0 0',
                                        }}
                                        title={`${i + 1} ${currentMonthLabel}: ${formatRupiahFull(val)}`}
                                        onClick={() => setSelectedBar(selectedBar === i ? null : i)}
                                    >
                                        {isPeak && (
                                            <span className="absolute -top-5 left-1/2 -translate-x-1/2 font-bdo text-[9px] font-bold text-orange-500 whitespace-nowrap">▲</span>
                                        )}
                                        {/* Hover tooltip */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10 whitespace-nowrap">
                                            <div className="bg-white border border-orange-200 rounded-lg px-2 py-1 shadow-md">
                                                <p className="font-bdo text-[9px] text-orange-500 font-bold">{i + 1}</p>
                                                <p className="font-clash text-[10px] text-slate-800 font-semibold">{formatRevenue(val)}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {/* Avg reference line */}
                        <div
                            className="absolute left-3 right-3 border-t border-dashed border-orange-400/40 pointer-events-none"
                            style={{ bottom: `calc(${(avgRev / maxRev) * 92}% + 12px)` }}
                        >
                            <span className="absolute right-0 -top-3.5 font-bdo text-[8px] text-orange-500/70 font-bold bg-white px-1 rounded">avg</span>
                        </div>
                    </div>
                    <div className="flex justify-between mt-2 font-bdo text-[9px] text-slate-400">
                        <span>1</span>
                        <span className="text-orange-500/70 font-bold">{currentMonthLabel}</span>
                        <span>{safeData.length}</span>
                    </div>
                </div>
            )}

            {/* Occupancy Breakdown */}
            {occupancyData.length > 0 && (
                <div className="px-6 pb-6 pt-5 relative z-10">
                    <p className="font-bdo text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                        Breakdown Fasilitas
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {occupancyData.map((f, i) => (
                            <div
                                key={f.name}
                                className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 animate-fade-in-up hover:bg-white hover:shadow-sm transition-all duration-200"
                                style={{ animationDelay: `${i * 60 + 200}ms` }}
                            >
                                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: f.color, boxShadow: `0 0 6px ${f.color}70` }} />
                                <span className="font-bdo text-[12px] text-slate-600 flex-1 min-w-0 truncate">{f.name}</span>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <div className="w-16 h-[3px] bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full progress-fill" style={{ width: `${f.pct}%`, background: `linear-gradient(90deg, ${f.color}aa, ${f.color})`, animationDelay: `${i * 60 + 300}ms` }} />
                                    </div>
                                    <span className="font-clash text-[13px] font-semibold text-slate-700 w-8 text-right tabular-nums">{f.pct}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ── ReportPrintTemplate ───────────────────────────────────────────────────────
// Hidden on screen via CSS. Becomes the ONLY visible content on @media print.
// Struktur: header/kop (invoice) + meta + tabel laporan + keterangan + ringkasan.
// TIDAK ada: terbilang, tanda tangan, kolom barang/harga/diskon invoice.

interface ReportPrintTemplateProps {
    stats: DashboardStats;
    revenueTrend: number;
    dailyRevenue: number[];
    currentMonthLabel: string;
    occupancyData: OccupancyFacility[];
}

function ReportPrintTemplate({
    stats, revenueTrend, dailyRevenue, currentMonthLabel, occupancyData,
}: ReportPrintTemplateProps) {
    const now        = new Date();
    const dateStr    = now.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
    const reportNo   = `LPR/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}`;
    const trendSign  = revenueTrend >= 0 ? "+" : "";

    const safeRevenue  = dailyRevenue ?? [];
    const activeDays   = safeRevenue.filter(v => v > 0).length;
    const avgRevenue   = activeDays > 0
        ? Math.round(safeRevenue.reduce((a, b) => a + b, 0) / safeRevenue.length)
        : 0;
    const peakRevenue  = safeRevenue.length > 0 ? Math.max(...safeRevenue) : 0;
    const peakDay      = safeRevenue.indexOf(peakRevenue) + 1;

    const rp = (v: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);
    const num = (v: number) => new Intl.NumberFormat("id-ID").format(v);

    // ── Baris laporan: konteks operasional, bukan barang invoice ──
    const rows: { kategori: string; detail: string; satuan: string; nilai: string }[] = [
        {
            kategori : "Pendapatan",
            detail   : "Total Pendapatan Bulan Ini",
            satuan   : currentMonthLabel,
            nilai    : rp(stats.totalRevenue),
        },
        {
            kategori : "Pendapatan",
            detail   : "Rata-rata Pendapatan Harian",
            satuan   : `${activeDays} hari aktif`,
            nilai    : rp(avgRevenue),
        },
        {
            kategori : "Pendapatan",
            detail   : `Puncak Pendapatan Harian (Tgl ${peakDay})`,
            satuan   : "1 hari",
            nilai    : rp(peakRevenue),
        },
        {
            kategori : "Trend",
            detail   : "Perubahan vs Bulan Lalu",
            satuan   : "MoM",
            nilai    : `${trendSign}${revenueTrend}%`,
        },
        {
            kategori : "Operasional",
            detail   : "Booking Hari Ini",
            satuan   : "transaksi",
            nilai    : num(stats.todaysBookings),
        },
        {
            kategori : "Operasional",
            detail   : "Membership Aktif",
            satuan   : "anggota",
            nilai    : num(stats.activeMemberships),
        },
        {
            kategori : "Operasional",
            detail   : "Fasilitas Beroperasi",
            satuan   : "unit",
            nilai    : num(stats.activeFacilities),
        },
        ...(occupancyData ?? []).map(f => ({
            kategori : "Okupansi",
            detail   : f.name,
            satuan   : "tingkat pemakaian",
            nilai    : `${f.pct}%`,
        })),
    ];

    const MINIMUM_ROWS = 10;
    const fillerCount  = Math.max(0, MINIMUM_ROWS - rows.length);

    return (
        <div className="print-report-template">
            <div className="prt-a4-page">

                {/* ════════════════════════════════════════════
                    KOP SURAT — identik dengan file invoice
                    Logo kiri | Nama perusahaan + alamat kanan
                ════════════════════════════════════════════ */}
                <div className="prt-header">

                    {/* Logo /public/BES.png — proporsi sama dengan invoice */}
                    <div className="prt-header-left">
                        <img
                            src="/BES.png"
                            alt="Brawijaya Edusport"
                            className="prt-logo-img"
                        />
                    </div>

                    {/* Nama perusahaan + alamat + garis + judul dokumen */}
                    <div className="prt-header-right">
                        <div className="prt-company-name-main">BRAWIJAYA EDUSPORT</div>
                        <div className="prt-company-name-sub">PT BRAWIJAYA MULTI USAHA</div>
                        <div className="prt-company-address">
                            Jln. Terusan Cibogo No.1 Kota Malang<br />
                            NPWP 3295.65.312
                        </div>
                        <hr className="prt-header-Divider" />
                        {/* Judul laporan — BUKAN "Faktur Penjualan" */}
                        <div className="prt-doc-title">Laporan Operasional</div>
                    </div>

                </div>

                {/* ════════════════════════════════════════════
                    META SECTION
                    Kiri : Kepada (kosong, diisi manual) + bank info
                    Kanan: grid info laporan (Tanggal, Nomor, dll)
                ════════════════════════════════════════════ */}
                <div className="prt-meta-outer">

                    {/* Info bank — tanpa baris Kepada */}
                    <div className="prt-meta-left">
                        <div className="prt-payment-note">
                            Pembayaran melalui Bank Mandiri<br />
                            144-0-02487884-2<br />
                            An Brawijaya Multi Usaha
                        </div>
                    </div>

                    {/* Grid kanan: label kiri | nilai kanan — format menyamping setiap baris */}
                    <div className="prt-meta-right">
                        <table>
                            <tbody>
                                <tr>
                                    <td className="meta-label-col">Tanggal</td>
                                    <td className="meta-value-col">{dateStr}</td>
                                </tr>
                                <tr>
                                    <td className="meta-label-col">Nomor</td>
                                    <td className="meta-value-col">{reportNo}</td>
                                </tr>
                                <tr>
                                    <td className="meta-label-col">Periode</td>
                                    <td className="meta-value-col">{currentMonthLabel}</td>
                                </tr>
                                <tr>
                                    <td className="meta-label-col">Hari Aktif</td>
                                    <td className="meta-value-col">{activeDays} hari</td>
                                </tr>
                                <tr>
                                    <td className="meta-label-col">Trend Bulan Ini</td>
                                    <td className="meta-value-col">{trendSign}{revenueTrend}% vs bln lalu</td>
                                </tr>
                                <tr>
                                    <td className="meta-label-col">Mata Uang</td>
                                    <td className="meta-value-col meta-value-bold">Indonesian Rupiah</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>

                {/* ════════════════════════════════════════════
                    TABEL LAPORAN
                    Kolom: No | Kategori | Detail | Satuan | Nilai
                    BUKAN kolom barang/harga/diskon invoice
                ════════════════════════════════════════════ */}
                <table className="prt-report-table">
                    <thead>
                        <tr>
                            <th style={{ width: "5%"  }}>No.</th>
                            <th style={{ width: "16%" }}>Kategori</th>
                            <th style={{ width: "43%" }}>Keterangan / Detail</th>
                            <th style={{ width: "18%" }}>Satuan</th>
                            <th style={{ width: "18%" }}>Nilai</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, idx) => (
                            <tr key={idx}>
                                <td className="rt-center">{idx + 1}</td>
                                <td>{row.kategori}</td>
                                <td>{row.detail}</td>
                                <td className="rt-center">{row.satuan}</td>
                                <td className="rt-right rt-bold">{row.nilai}</td>
                            </tr>
                        ))}
                        {Array.from({ length: fillerCount }).map((_, i) => (
                            <tr key={`f${i}`} className="rt-filler">
                                <td>&nbsp;</td><td></td><td></td><td></td><td></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* ════════════════════════════════════════════
                    BAWAH: Keterangan (kosong) | Ringkasan angka
                    Tidak ada terbilang. Tidak ada tanda tangan.
                ════════════════════════════════════════════ */}
                <div className="prt-bottom-row">

                    {/* Keterangan — kosong, diisi manual */}
                    <div className="prt-keterangan">
                        <span className="prt-keterangan-label">Keterangan :</span>
                    </div>

                    {/* Ringkasan laporan — adaptasi blok total invoice */}
                    <div className="prt-summary">
                        <table>
                            <tbody>
                                <tr>
                                    <td>Total Pendapatan</td>
                                    <td>{rp(stats.totalRevenue)}</td>
                                </tr>
                                <tr>
                                    <td>Rata-rata Harian</td>
                                    <td>{rp(avgRevenue)}</td>
                                </tr>
                                <tr>
                                    <td>Booking Hari Ini</td>
                                    <td>{num(stats.todaysBookings)} trx</td>
                                </tr>
                                <tr>
                                    <td>Membership Aktif</td>
                                    <td>{num(stats.activeMemberships)} orang</td>
                                </tr>
                                <tr className="sum-total">
                                    <td>Trend Bulan Ini</td>
                                    <td>{trendSign}{revenueTrend}%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>

                {/* ════════════════════════════════════════════
                    FOOTER — "Halaman 1 dari 1" pojok kiri bawah
                ════════════════════════════════════════════ */}
                <div className="prt-page-footer">
                    <span>Halaman 1 dari 1</span>
                    <span style={{ fontSize: '7.5pt', color: '#888' }}>Dicetak: {dateStr}</span>
                </div>

            </div>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Dashboard() {
    const {
        auth, stats, revenueTrend, dailyRevenue, daysInMonth,
        currentMonthLabel, occupancyData, recentActivity,
    } = usePage<DashboardProps>().props;

    const firstName    = auth.user?.name?.split(" ")[0] ?? "Admin";
    const trendPositive = revenueTrend >= 0;

    // ── Visual-only UI state ─────────────────────────────────────────────────
    const [showAnalytics, setShowAnalytics] = useState(false);

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4 animate-fade-in-up">
                    <style dangerouslySetInnerHTML={{ __html: DASHBOARD_STYLES }} />
                    <span className="font-bdo text-[11px] font-medium tracking-wide text-orange-500">
                        Selamat Datang Kembali, {firstName}
                    </span>
                    <h1 className="font-clash text-3xl font-bold uppercase tracking-tight xl:text-4xl">
                        <ShinyTextBlack text="UB Sport System" speed={5} />
                    </h1>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="flex flex-col gap-6 pt-6 pb-20 overflow-x-hidden">

                {/* ══════════════════════════════════════════════════════════════
                    ROW 1 — Three columns: Featured Card | Metrics Grid | Chart
                    Mobile: stacked · Tablet (md): 1-col then 2-col · Desktop (lg): 3-col
                ══════════════════════════════════════════════════════════════ */}
                <section className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-stretch">

                    {/* ── Col 1: Featured Revenue Card ── */}
                    <div className="relative rounded-[28px] overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 p-7 shadow-2xl shadow-orange-200/40 flex flex-col justify-between animate-fade-in-up delay-100 group hover:-translate-y-1 hover:shadow-orange-300/50 transition-all duration-500 min-h-[380px] shimmer-once">
                        {/* Decorative layers */}
                        <div className="absolute inset-0 water-caustics-effect pointer-events-none opacity-50"></div>
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full pointer-events-none"></div>
                        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-orange-400/20 rounded-full pointer-events-none blur-3xl"></div>
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"></div>

                        {/* Header: label + icon */}
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-lg">
                                        <Wallet className="w-4 h-4 text-white" />
                                    </div>
                                    <p className="font-bdo text-[11px] font-bold text-orange-100 uppercase tracking-widest">Total Pendapatan</p>
                                </div>
                                <h2 className="font-clash text-[2rem] font-bold text-white leading-none tracking-tight">
                                    Rp <ShinyText text={formatRevenue(stats.totalRevenue)} speed={4} />
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-lg">
                                        <Wallet className="w-4 h-4 text-white" />
                                    </div>
                                    <p className="font-bdo text-[11px] font-bold text-orange-100 uppercase tracking-widest">Total Pendapatan</p>
                                </div>
                                <h2 className="font-clash text-[2rem] font-bold text-white leading-none tracking-tight">
                                    Rp <ShinyText text={formatRevenue(stats.totalRevenue)} speed={4} />
                                </h2>
                                <div className="mt-2.5">
                                    <div className={cn(
                                        "inline-flex items-center gap-1 text-[11px] font-bold font-bdo px-2.5 py-1 rounded-lg backdrop-blur-md",
                                        trendPositive
                                            ? "bg-white/15 text-white border border-white/20"
                                            : "bg-red-900/30 text-red-200 border border-red-700/30"
                                    )}>
                                        {trendPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                        {Math.abs(revenueTrend)}% bulan ini
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/15 backdrop-blur-xl border border-white/25 p-3.5 rounded-2xl shadow-lg animate-float flex-shrink-0">
                                <TrendingUp className="w-6 h-6 text-white" />
                                <div className="mt-2.5">
                                    <div className={cn(
                                        "inline-flex items-center gap-1 text-[11px] font-bold font-bdo px-2.5 py-1 rounded-lg backdrop-blur-md",
                                        trendPositive
                                            ? "bg-white/15 text-white border border-white/20"
                                            : "bg-red-900/30 text-red-200 border border-red-700/30"
                                    )}>
                                        {trendPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                        {Math.abs(revenueTrend)}% bulan ini
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/15 backdrop-blur-xl border border-white/25 p-3.5 rounded-2xl shadow-lg animate-float flex-shrink-0">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                        </div>

                        {/* Wallet-style sub-stats */}
                        <div className="relative z-10 my-5 flex-1 flex flex-col justify-center">
                            <p className="font-bdo text-[10px] font-bold text-orange-200/80 uppercase tracking-widest mb-3">Ringkasan Operasional</p>
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/15 divide-y divide-white/10 overflow-hidden">
                                {[
                                    { label: "Booking Hari Ini",  value: String(stats.todaysBookings),    Icon: CalendarCheck2 },
                                    { label: "Fasilitas Aktif",   value: String(stats.activeFacilities),  Icon: LayoutGrid     },
                                    { label: "Membership Aktif",  value: String(stats.activeMemberships), Icon: Users          },
                                ].map(({ label, value, Icon }) => (
                                    <div key={label} className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors">
                                        <div className="flex items-center gap-2.5">
                                            <div className="bg-white/15 p-1.5 rounded-lg">
                                                <Icon className="w-3.5 h-3.5 text-white" />
                                            </div>
                                            <span className="font-bdo text-[12px] font-medium text-orange-100">{label}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-clash text-sm font-bold text-white">{value}</span>
                                            <span className="font-bdo text-[10px] font-bold text-green-300 bg-green-500/20 px-2 py-0.5 rounded-md">Aktif</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="relative z-10 grid grid-cols-2 gap-3">
                            <button
                                onClick={() => window.print()}
                                className="btn-sheen bg-white text-orange-600 font-clash text-sm font-semibold py-3.5 rounded-xl hover:bg-orange-50 active:scale-[0.97] transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10"
                            >
                                <FileText className="w-4 h-4" />
                                Laporan
                            </button>
                            <button
                                onClick={() => setShowAnalytics(prev => !prev)}
                                className={cn(
                                    "btn-sheen border font-clash text-sm font-semibold py-3.5 rounded-xl active:scale-[0.97] transition-all flex items-center justify-center gap-2",
                                    showAnalytics
                                        ? "bg-white/30 backdrop-blur-md border-white/40 text-white"
                                        : "bg-white/15 backdrop-blur-md border-white/30 text-white hover:bg-white/25"
                                )}
                            >
                                <BarChart3 className="w-4 h-4" />
                                Analitik
                            </button>
                        </div>
                    </div>

                    {/* ── Col 2: 2×2 Metrics Grid ── */}
                    <div className="grid grid-cols-2 gap-4 content-stretch">

                        {/* Booking Hari Ini — Orange gradient */}
                        <div className="relative bg-gradient-to-br from-orange-500 to-red-500 rounded-[20px] p-5 shadow-md hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-200/50 transition-all duration-300 animate-fade-in-up delay-200 flex flex-col justify-between min-h-[150px] overflow-hidden shimmer-once">
                            <div className="absolute inset-0 water-caustics-effect opacity-30 pointer-events-none"></div>
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"></div>
                            <div className="relative z-10 flex justify-between items-start">
                                <div className="bg-white/20 p-2 rounded-xl">
                                    <CalendarCheck2 className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-bdo text-[10px] font-bold text-orange-100 bg-white/15 px-2 py-0.5 rounded-lg">Hari ini</span>
                            </div>
                            <div className="relative z-10">
                                <p className="font-clash text-[1.9rem] font-bold text-white leading-none">{stats.todaysBookings}</p>
                                <p className="font-bdo text-[11px] font-medium text-orange-100 mt-1.5">Booking Hari Ini</p>
                            </div>
                        </div>

                        {/* Membership Aktif — Light style (konsisten dgn Okupansi & Aktivitas) */}
                        <div className="bg-white rounded-[20px] p-5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 animate-fade-in-up delay-200 flex flex-col justify-between min-h-[150px] border border-slate-200/80 card-glint relative overflow-hidden">
                            {/* Left accent */}
                            <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-gradient-to-b from-emerald-400/80 via-emerald-500/50 to-transparent rounded-full" />
                            <div className="flex justify-between items-start">
                                <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                                    <Users className="w-4 h-4 text-emerald-600" />
                                </div>
                                <span className="font-bdo text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.9)]"></span>
                                    Aktif
                                </span>
                            </div>
                            <div>
                                <p className="font-clash text-[1.9rem] font-bold text-slate-900 leading-none">{stats.activeMemberships}</p>
                                <p className="font-bdo text-[11px] font-medium text-slate-500 mt-1.5">Membership Aktif</p>
                            </div>
                        </div>

                        {/* Fasilitas Aktif — Light style (konsisten dgn Okupansi & Aktivitas) */}
                        <div className="bg-white rounded-[20px] p-5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 animate-fade-in-up delay-300 flex flex-col justify-between min-h-[150px] border border-slate-200/80 card-glint relative overflow-hidden">
                            {/* Left accent */}
                            <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-gradient-to-b from-sky-400/80 via-sky-500/50 to-transparent rounded-full" />
                            <div className="flex justify-between items-start">
                                <div className="bg-sky-50 p-2 rounded-xl border border-sky-100">
                                    <LayoutGrid className="w-4 h-4 text-sky-600" />
                                </div>
                                <span className="font-bdo text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 bg-sky-50 border border-sky-200 text-sky-700">
                                    <span className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse shadow-[0_0_6px_rgba(56,189,248,0.9)]"></span>
                                    Online
                                </span>
                            </div>
                            <div>
                                <p className="font-clash text-[1.9rem] font-bold text-slate-900 leading-none">{stats.activeFacilities}</p>
                                <p className="font-bdo text-[11px] font-medium text-slate-500 mt-1.5">Fasilitas Aktif</p>
                            </div>
                        </div>

                        {/* Pending Identitas — Orange soft */}
                        <div className="bg-orange-50 border border-orange-300 rounded-[20px] p-5 shadow-md hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-100/80 transition-all duration-300 animate-fade-in-up delay-300 flex flex-col justify-between min-h-[150px] relative overflow-hidden shimmer-once">
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-200/50 to-transparent pointer-events-none"></div>
                            <div className="flex justify-between items-start">
                                <div className="bg-orange-100 p-2 rounded-xl">
                                    <UserCheck className="w-4 h-4 text-orange-600" />
                                </div>
                                <span className="font-bdo text-[10px] font-bold text-orange-500 bg-orange-100 px-2 py-0.5 rounded-lg">Pending</span>
                            </div>
                            <div>
                                <p className="font-clash text-[1.9rem] font-bold text-orange-600 leading-none">{stats.pendingIdentities}</p>
                                <p className="font-bdo text-[11px] font-medium text-orange-500 mt-1.5">Antrean Identitas</p>
                            </div>
                        </div>

                    </div>

                    {/* ── Col 3: Revenue Chart ── */}
                    <div className="animate-fade-in-up delay-400 bg-white rounded-[24px] p-6 shadow-sm border border-slate-200/80 relative overflow-hidden group flex flex-col min-h-[380px] card-glint">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-slate-50/20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent z-10" />

                        {/* Chart Header */}
                        <div className="mb-5 relative z-10">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-3 min-w-0">
                                    <ShinyIcon className="h-10 w-10 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                                        <TrendingUp className="w-4 h-4 text-orange-300" />
                                    </ShinyIcon>
                                    <div className="min-w-0">
                                        <h2 className="font-clash text-sm font-semibold text-slate-900 leading-tight whitespace-nowrap">
                                            <SplitText text="Grafik Pendapatan" delay={500} />
                                        </h2>
                                        <p className="font-bdo text-[10px] font-medium text-slate-400 mt-0.5 whitespace-nowrap">Pendapatan bulan berjalan</p>
                                    </div>
                                </div>
                                <span className={cn(
                                    "flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 font-bdo text-[10px] font-bold shadow-sm cursor-default flex-shrink-0",
                                    trendPositive
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                        : "bg-rose-50 text-rose-600 border border-rose-100"
                                )}>
                                    {trendPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                    <span className="whitespace-nowrap">{Math.abs(revenueTrend)}% vs bln lalu</span>
                                </span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent mb-4 relative z-10" />

                        {/* Inject Custom SVG Chart */}
                        <div className="flex-1 relative z-10">
                            <InteractiveRevenueChart data={dailyRevenue} monthLabel={currentMonthLabel} />
                        </div>
                    </div>

                </section>

                {/* ══════════════════════════════════════════════════════════════
                    ANALYTICS PANEL — slides in when "Analitik" is toggled
                ══════════════════════════════════════════════════════════════ */}
                {showAnalytics && (
                    <AnalyticsPanel
                        dailyRevenue={dailyRevenue ?? []}
                        occupancyData={occupancyData ?? []}
                        stats={stats}
                        currentMonthLabel={currentMonthLabel}
                        onClose={() => setShowAnalytics(false)}
                    />
                )}

                {/* ══════════════════════════════════════════════════════════════
                    ROW 2 — Dua kolom: Left Stack | Activity Feed
                    Mobile: stacked · Tablet+: 1fr | 2fr
                ══════════════════════════════════════════════════════════════ */}
                <section className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] items-start">

                    {/* ── Left: OccupancyCard + Identity Queue stacked ── */}
                    <div className="flex flex-col gap-6">
                        <OccupancyCard facilities={occupancyData ?? []} />
                        <PremiumIdentityQueue count={stats.pendingIdentities} />
                    </div>

                    {/* ── Right: Activity Feed ── */}
                    <div className="animate-fade-in-up delay-500 bg-white rounded-[24px] p-7 shadow-sm border border-slate-200/80 flex flex-col card-glint relative overflow-hidden">
                        <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent z-10" />

                        {/* Header */}
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <ShinyIcon className="h-10 w-10">
                                    <Activity className="w-4 h-4 text-orange-300" />
                                </ShinyIcon>
                                <div>
                                    <p className="font-bdo text-[10px] font-bold uppercase tracking-widest text-slate-400">Sistem</p>
                                    <h2 className="font-clash text-base font-semibold text-slate-900">
                                        <SplitText text="Aktivitas Terbaru" delay={600} />
                                    </h2>
                                    <p className="font-bdo text-[11px] font-medium text-slate-400 mt-0.5">Riwayat kegiatan sistem secara real-time</p>
                                </div>
                            </div>
                            <span className="font-bdo text-[11px] font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100 uppercase tracking-wide flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_6px_rgba(249,115,22,0.8)]"></span>
                                Live Feed
                            </span>
                        </div>

                        {/* Feed */}
                        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                        {/* Feed */}
                        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                            <ActivityFeed items={recentActivity ?? []} />
                        </div>
                    </div>


                </section>


            </div>

            {/* Print-only — hidden on screen, sole content on @media print */}
            <ReportPrintTemplate
                stats={stats}
                revenueTrend={revenueTrend}
                dailyRevenue={dailyRevenue ?? []}
                currentMonthLabel={currentMonthLabel}
                occupancyData={occupancyData ?? []}
            />

        </AdminLayout>
    );
}