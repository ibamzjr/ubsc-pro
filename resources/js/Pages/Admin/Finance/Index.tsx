// ── ALL IMPORTS AT TOP (fixes UserCheck bug that was duplicated at bottom) ──
import { Head, router, usePage } from "@inertiajs/react";
import {
    ArrowDownRight,
    ArrowUpRight,
    BarChart3,
    CalendarDays,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    Download,
    FileText,
    PieChart,
    TrendingUp,
    Wallet,
    Coins,
    Ticket,
    Star,
    LayoutGrid,
    Activity,
    UserCheck,
    X,
    CheckCircle2,
    Zap,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { cn } from "@/lib/utils";
import type { PageProps, RecentTransaction } from "@/types";

// ── Fallback visual components (identical to Dashboard) ───────────────────────

const SplitText = ({ text, className, delay = 50 }: { text: string; className?: string; delay?: number }) => (
    <span className={className} style={{ animation: `fadeInUp 0.5s ease forwards ${delay}ms`, opacity: 0 }}>{text}</span>
);

const ShinyTextBlack = ({ text, speed = 3, className = "" }: { text: string; speed?: number; className?: string }) => (
    <span className={`animate-shiny-black ${className}`} style={{ animationDuration: `${speed}s` }}>{text}</span>
);

const ShinyText = ({ text, speed = 3, className = "" }: { text: string; speed?: number; className?: string }) => (
    <span className={`animate-shiny-text ${className}`} style={{ animationDuration: `${speed}s` }}>{text}</span>
);

// ── Types ─────────────────────────────────────────────────────────────────────

interface FacilityRevenue {
    name: string;
    revenue: number;
    share: number;
    color: string;
}

interface FacilityBooking {
    name: string;
    count: number;
    share: number;
    color: string;
}

interface FinanceStats {
    totalRevenue: number;
    totalBookings: number;
    activeMemberships: number;
}

type FinanceProps = PageProps<{
    facilityRevenue: FacilityRevenue[];
    facilityBookings: FacilityBooking[];
    dailyRevenue: number[];
    monthlyRevenue?: number[];
    stats: FinanceStats;
    period: { month: number; year: number };
    revenueTrend: number;
    recentTransactions: RecentTransaction[];
}>;

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatRevenue(amount: number): string {
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })}JT`;
    if (amount >= 1_000)     return `${(amount / 1_000).toLocaleString("id-ID",     { maximumFractionDigits: 0 })}rb`;
    return amount.toLocaleString("id-ID");
}

function formatRupiahFull(amount: number): string {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

const MONTH_NAMES = [
    "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const MONTH_SHORT = ["", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];

// ── Global Styles (full Dashboard parity) ────────────────────────────────────

const FINANCE_STYLES = `
    .font-clash { font-family: 'Clash Display', sans-serif; }
    .font-bdo   { font-family: 'BDO Grotesk', sans-serif;   }

    @keyframes shinyBlackText { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
    .animate-shiny-black {
        background: linear-gradient(120deg, #0f172a 35%, #cbd5e1 50%, #0f172a 65%);
        background-size: 200% auto; color: transparent;
        -webkit-background-clip: text; background-clip: text;
        animation: shinyBlackText linear infinite;
    }
    @keyframes shinyText { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
    .animate-shiny-text {
        background: linear-gradient(120deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.4) 100%);
        background-size: 200% auto; color: transparent;
        -webkit-background-clip: text; background-clip: text;
        animation: shinyText linear infinite;
    }
    @keyframes shinyOrangeText { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
    .animate-shiny-orange {
        background: linear-gradient(120deg, #ea580c 25%, #fed7aa 50%, #ea580c 75%);
        background-size: 200% auto; color: transparent;
        -webkit-background-clip: text; background-clip: text;
        animation: shinyOrangeText 3s linear infinite;
    }

    @keyframes caustics {
        0%   { background-position: 0%   50%; opacity: 0.15; }
        50%  { background-position: 100% 50%; opacity: 0.35; }
        100% { background-position: 0%   50%; opacity: 0.15; }
    }
    .water-caustics-effect {
        background: radial-gradient(circle at top left, rgba(255,255,255,0.3) 0%, transparent 40%),
                    radial-gradient(circle at bottom right, rgba(255,255,255,0.2) 0%, transparent 50%);
        background-size: 150% 150%;
        animation: caustics 8s ease-in-out infinite;
        mix-blend-mode: overlay;
    }

    @keyframes fadeInUp    { from { opacity: 0; transform: translate3d(0, 28px, 0); } to { opacity: 1; transform: translate3d(0,0,0); } }
    @keyframes scaleIn     { from { opacity: 0; transform: scale(0.96); }            to { opacity: 1; transform: scale(1); }           }
    @keyframes float       { 0%,100% { transform: translate3d(0,0,0); }  50% { transform: translate3d(0,-6px,0); }                    }
    @keyframes pulseGlow   { 0%,100% { opacity: 0.4; transform: scale(1);   } 50% { opacity: 1; transform: scale(1.1); }              }
    @keyframes barGrow     { from { transform: scaleY(0); transform-origin: bottom; } to { transform: scaleY(1); transform-origin: bottom; } }
    @keyframes modalFadeIn { from { opacity: 0; transform: scale(0.96) translateY(-8px); } to { opacity: 1; transform: scale(1) translateY(0); } }

    .animate-fade-in-up  { animation: fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; will-change: opacity,transform; }
    .animate-scale-in    { animation: scaleIn  0.5s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }
    .animate-float       { animation: float    3.5s ease-in-out infinite; will-change: transform; }
    .animate-pulse-glow  { animation: pulseGlow 2.5s ease-in-out infinite; }
    .bar-grow            { animation: barGrow   0.6s cubic-bezier(0.16,1,0.3,1) forwards; }
    .modal-enter         { animation: modalFadeIn 0.25s cubic-bezier(0.16,1,0.3,1) forwards; }

    .delay-50  { animation-delay: 50ms;  }
    .delay-100 { animation-delay: 100ms; }
    .delay-150 { animation-delay: 150ms; }
    .delay-200 { animation-delay: 200ms; }
    .delay-300 { animation-delay: 300ms; }
    .delay-400 { animation-delay: 400ms; }
    .delay-500 { animation-delay: 500ms; }

    @keyframes shimmerSweep { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
    .shimmer-once { position: relative; overflow: hidden; }
    .shimmer-once::after {
        content: ''; position: absolute; inset: 0;
        background: linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.42) 50%, transparent 100%);
        width: 60%; animation: shimmerSweep 1.1s ease-out 0.45s forwards;
        pointer-events: none; border-radius: inherit;
    }

    @keyframes btnSheen { 0% { left: -80%; } 100% { left: 120%; } }
    .btn-sheen { position: relative; overflow: hidden; }
    .btn-sheen::before {
        content: ''; position: absolute; top: 0; bottom: 0; width: 50%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
        animation: btnSheen 3s ease-in-out 1s infinite;
    }

    @keyframes iconGlow {
        0%,100% { box-shadow: 0 2px 8px rgba(15,23,42,0.20); }
        50%     { box-shadow: 0 2px 16px rgba(15,23,42,0.30), 0 0 24px rgba(249,115,22,0.18); }
    }
    .icon-glow { animation: iconGlow 3.5s ease-in-out infinite; }

    @keyframes cardBreath {
        0%,100% { box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 0 0 1px rgba(226,232,240,0.8); }
        50%     { box-shadow: 0 4px 16px rgba(0,0,0,0.07), 0 0 0 1px rgba(249,115,22,0.2); }
    }
    .card-breath { animation: cardBreath 5s ease-in-out infinite; }
    .card-glint { position: relative; }
    .card-glint::before {
        content: ''; position: absolute; top: 0; left: 20px; right: 20px; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent);
        pointer-events: none; z-index: 2;
    }

    .occ-bar-inner { transition: width 0.9s cubic-bezier(0.16,1,0.3,1), filter 0.3s; }
    .bar-col:hover { filter: brightness(1.15); transform: scaleY(1.04); transform-origin: bottom; }
    .bar-col { transition: filter 0.15s, transform 0.15s; cursor: pointer; }

    .custom-scrollbar::-webkit-scrollbar       { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #fed7aa; border-radius: 4px; }

    /* ── Print Template ── */
    .print-finance-template { display: none; }
    .prt-a4-page {
        width: 210mm; height: auto; max-height: 297mm; overflow: hidden;
        margin: 0 auto; background: #fff; padding: 14mm 16mm; box-sizing: border-box;
        font-family: 'Courier New', Courier, monospace; font-size: 9pt; color: #111;
    }
    .prt-header { display: flex; align-items: flex-start; gap: 0; margin-bottom: 0; }
    .prt-header-left { width: 72pt; flex-shrink: 0; display: flex; align-items: flex-start; justify-content: flex-start; }
    .prt-logo-img { width: 68pt; height: 68pt; object-fit: contain; display: block; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .prt-header-right { flex: 1; padding-left: 10pt; }
    .prt-company-name-main { font-family: 'Courier New', Courier, monospace; font-size: 13pt; font-weight: bold; letter-spacing: 0.14em; line-height: 1.15; margin: 0; }
    .prt-company-name-sub  { font-family: 'Courier New', Courier, monospace; font-size: 10pt; font-weight: bold; letter-spacing: 0.10em; margin: 1pt 0 3pt 0; }
    .prt-company-address   { font-size: 8pt; line-height: 1.45; margin-bottom: 4pt; font-family: 'Courier New', Courier, monospace; }
    .prt-header-divider    { border: none; border-top: 1.5pt solid #111; margin: 3pt 0 4pt 0; }
    .prt-doc-title         { font-family: 'Courier New', Courier, monospace; font-size: 15pt; font-weight: bold; letter-spacing: 0.04em; text-align: center; margin: 0; }
    .prt-meta-outer        { display: flex; gap: 0; margin-top: 6pt; margin-bottom: 8pt; border: 0.75pt solid #444; }
    .prt-meta-left         { flex: 1; padding: 5pt 8pt 8pt 8pt; font-size: 8.5pt; border-right: 0.75pt solid #444; font-family: 'Courier New', Courier, monospace; }
    .prt-payment-note      { margin-top: 22pt; font-size: 8pt; font-weight: bold; line-height: 1.75; font-family: 'Courier New', Courier, monospace; white-space: nowrap; }
    .prt-meta-right        { width: 230pt; flex-shrink: 0; }
    .prt-meta-right table  { width: 100%; border-collapse: collapse; font-size: 8.5pt; font-family: 'Courier New', Courier, monospace; }
    .prt-meta-right table td { border-bottom: 0.75pt dashed #888; border-left: 0.75pt dashed #888; padding: 3.5pt 6pt; vertical-align: middle; }
    .prt-meta-right table td.meta-label-col { width: 45%; font-size: 8pt; color: #555; font-weight: normal; white-space: nowrap; }
    .prt-meta-right table td.meta-value-col { width: 55%; font-size: 8.5pt; font-weight: normal; }
    .prt-meta-right table td.meta-value-bold { font-weight: bold; }
    .prt-meta-right table tr:last-child td { border-bottom: none; }
    .prt-report-table { width: 100%; border-collapse: collapse; margin-bottom: 6pt; font-size: 8.5pt; font-family: 'Courier New', Courier, monospace; }
    .prt-report-table th { border: 0.75pt solid #111; padding: 4pt 6pt; text-align: center; font-weight: bold; background: #fff; font-family: 'Courier New', Courier, monospace; }
    .prt-report-table td { border: 0.75pt solid #444; padding: 4.5pt 6pt; vertical-align: middle; font-family: 'Courier New', Courier, monospace; }
    .prt-report-table td.rt-center { text-align: center; }
    .prt-report-table td.rt-right  { text-align: right; }
    .prt-report-table td.rt-bold   { font-weight: bold; }
    .prt-report-table tr.rt-filler td { color: #ddd; border-color: #eee; }
    .prt-bottom-row { display: flex; gap: 0; margin-bottom: 0; }
    .prt-keterangan { flex: 1; border: 0.75pt solid #444; padding: 5pt 7pt; font-size: 8.5pt; min-height: 64pt; font-family: 'Courier New', Courier, monospace; }
    .prt-keterangan-label { font-weight: bold; font-size: 8pt; display: block; margin-bottom: 4pt; border-bottom: 0.5pt solid #ccc; padding-bottom: 2pt; }
    .prt-summary { width: 185pt; flex-shrink: 0; }
    .prt-summary table { width: 100%; border-collapse: collapse; font-size: 8.5pt; font-family: 'Courier New', Courier, monospace; }
    .prt-summary table td { border: 0.75pt solid #444; padding: 3.5pt 6pt; }
    .prt-summary table td:last-child { text-align: right; }
    .prt-summary table tr.sum-total td { font-weight: bold; }
    .prt-page-footer { margin-top: 10pt; font-family: 'Courier New', Courier, monospace; font-size: 8pt; color: #555; display: flex; justify-content: space-between; align-items: center; border-top: 0.5pt solid #ccc; padding-top: 5pt; }

    /* ── Responsive KPI: 3rd item spans 2 cols when grid is 2-col on mobile ── */
    @media (max-width: 639px) {
        .kpi-third { grid-column: span 2; }
    }

    /* ── Safe area: prevent content from touching screen edges on mobile ── */
    @media (max-width: 639px) {
        .finance-page-wrap { padding-left: 0; padding-right: 0; }
    }

    @media print {
        @page { size: A4 portrait; margin: 0; }
        body * { visibility: hidden !important; }
        .print-finance-template, .print-finance-template * { visibility: visible !important; }
        .print-finance-template { display: block !important; position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; z-index: 99999 !important; }
        .prt-a4-page { width: 210mm !important; height: auto !important; min-height: unset !important; max-height: 297mm !important; overflow: hidden !important; padding: 14mm 16mm !important; margin: 0 !important; box-sizing: border-box !important; page-break-after: avoid !important; break-after: avoid !important; }
        .prt-logo-img { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; width: 68pt !important; height: 68pt !important; }
    }
`;


// ── ShinyIcon (identical to Dashboard) ───────────────────────────────────────

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

// ── Smooth bezier path (same as Dashboard) ────────────────────────────────────

function smoothBezierPath(pts: { x: number; y: number }[]): string {
    if (pts.length < 2) return "";
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
    return d.join(" ");
}

// ── Interactive Daily Revenue Chart (enhanced, same approach as Dashboard) ───

function InteractiveRevenueChart({ data, monthLabel }: { data: number[]; monthLabel: string }) {
    const [activePoint, setActivePoint] = useState<number | null>(null);
    const [isLoaded, setIsLoaded]       = useState(false);
    useEffect(() => { const t = setTimeout(() => setIsLoaded(true), 150); return () => clearTimeout(t); }, []);

    const chartData = data && data.length > 0 ? data : Array(30).fill(0);
    const maxVal    = Math.max(...chartData, 1000);
    const avgVal    = chartData.reduce((a, b) => a + b, 0) / chartData.length;
    const points    = chartData.map((val, i) => ({ x: (i / (chartData.length - 1)) * 100, y: 100 - (val / maxVal) * 100, val, day: i + 1 }));
    const smoothLine = smoothBezierPath(points);
    const smoothArea = `${smoothLine} L 100 100 L 0 100 Z`;
    const avgY       = 100 - (avgVal / maxVal) * 100;
    const peakIdx    = chartData.indexOf(Math.max(...chartData));

    return (
        <div className="relative w-full h-[200px] mt-4 font-bdo select-none">
            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] font-medium text-slate-400 pointer-events-none">
                <span>{formatRevenue(maxVal)}</span>
                <span>{formatRevenue(maxVal / 2)}</span>
                <span>0</span>
            </div>
            <div className="absolute left-8 right-0 top-2 bottom-6">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                    <defs>
                        <linearGradient id="fcChartGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f97316" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                        </linearGradient>
                        <filter id="fcLineGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="1.2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>
                    <line x1="0" y1="0"   x2="100" y2="0"   stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="2" />
                    <line x1="0" y1="50"  x2="100" y2="50"  stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="2" />
                    <line x1="0" y1="100" x2="100" y2="100" stroke="#e2e8f0" strokeWidth="1" />
                    {/* Avg line */}
                    <line x1="0" y1={avgY} x2="100" y2={avgY} stroke="#f9731640" strokeWidth="0.6" strokeDasharray="1.5 1.5" />
                    <path d={smoothArea} fill="url(#fcChartGlow)" className={`transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`} />
                    <path d={smoothLine} fill="none" stroke="#f97316" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" filter="url(#fcLineGlow)" style={{ strokeDasharray: 600, strokeDashoffset: isLoaded ? 0 : 600, transition: "stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)" }} />
                    {/* Peak star */}
                    {isLoaded && (
                        <circle cx={points[peakIdx]?.x} cy={points[peakIdx]?.y} r="2.5" fill="#f97316" stroke="#fff" strokeWidth="1" className="animate-pulse-glow" />
                    )}
                    {points.map((p, i) => (
                        <g key={i} onClick={() => setActivePoint(activePoint === i ? null : i)} className="cursor-crosshair">
                            <line x1={p.x} y1="100" x2={p.x} y2={p.y} stroke="#fed7aa" strokeWidth="0.5" strokeDasharray="1 1" className={`transition-opacity ${activePoint === i ? "opacity-100" : "opacity-0 group-hover:opacity-40"}`} />
                            <circle cx={p.x} cy={p.y} r={activePoint === i ? 2.2 : 1.5} fill={activePoint === i ? "#ffffff" : "#f97316"} stroke="#ea580c" strokeWidth="0.5" className={`transition-all ${activePoint === i ? "opacity-100" : "opacity-0 group-hover:opacity-80"}`} />
                            <circle cx={p.x} cy={p.y} r="4" fill="transparent" />
                        </g>
                    ))}
                </svg>
                {activePoint !== null && (
                    <div className="absolute z-20 bg-[#12131c] border border-orange-500/30 text-white p-3 rounded-xl shadow-[0_10px_25px_rgba(249,115,22,0.3)] pointer-events-none animate-scale-in" style={{ left: `${points[activePoint].x}%`, top: `${points[activePoint].y}%`, transform: `translate(${points[activePoint].x > 50 ? "-110%" : "10%"}, -110%)` }}>
                        <p className="font-bdo text-[10px] text-orange-300 uppercase tracking-widest mb-1">{points[activePoint].day} {monthLabel}</p>
                        <p className="font-clash text-base font-bold">{formatRupiahFull(points[activePoint].val)}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Monthly Revenue Bar Chart ─────────────────────────────────────────────────

function MonthlyRevenueBarChart({
    data,
    currentMonth,
    currentYear,
}: {
    data: number[];
    currentMonth: number;
    currentYear: number;
}) {
    const [hoveredBar, setHoveredBar] = useState<number | null>(null);
    const [loaded,     setLoaded]     = useState(false);
    useEffect(() => { const t = setTimeout(() => setLoaded(true), 200); return () => clearTimeout(t); }, []);

    const maxVal    = Math.max(...data, 1000);
    const avgVal    = data.reduce((a, b) => a + b, 0) / 12;
    const peakIdx   = data.indexOf(Math.max(...data));
    const ytdTotal  = data.reduce((a, b) => a + b, 0);
    const activeMo  = data.filter(v => v > 0).length;

    return (
        <div className="w-full">
            {/* KPI strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                {[
                    { label: "Total YTD",      value: formatRevenue(ytdTotal),         accent: "text-slate-900", bg: "bg-slate-50 border-slate-100" },
                    { label: "Rata-rata/Bulan", value: formatRevenue(Math.round(avgVal)), accent: "text-orange-600", bg: "bg-orange-50 border-orange-100" },
                    { label: "Bulan Terbaik",  value: MONTH_SHORT[peakIdx + 1] || "—",   accent: "text-emerald-700", bg: "bg-emerald-50 border-emerald-100" },
                ].map((kpi, i) => (
                    <div key={i} className={cn("rounded-2xl p-3 sm:p-4 border animate-fade-in-up", kpi.bg, i === 2 && "kpi-third")} style={{ animationDelay: `${i * 60}ms` }}>
                        <p className="font-bdo text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">{kpi.label}</p>
                        <p className={cn("font-clash text-lg font-bold leading-tight", kpi.accent)}>{kpi.value}</p>
                    </div>
                ))}
            </div>

            {/* Bar chart */}
            <div className="relative overflow-x-hidden">
                {/* Y axis labels */}
                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[9px] font-bdo font-medium text-slate-400 pointer-events-none" style={{ width: 30 }}>
                    <span>{formatRevenue(maxVal)}</span>
                    <span>{formatRevenue(maxVal / 2)}</span>
                    <span>0</span>
                </div>
                {/* Bars */}
                <div className="ml-8 sm:ml-10 flex items-end gap-1 sm:gap-1.5" style={{ height: 160 }}>
                    {data.map((val, i) => {
                        const month     = i + 1;
                        const isCurrent = month === currentMonth;
                        const isPeak    = i === peakIdx && val > 0;
                        const isHovered = hoveredBar === i;
                        const pct       = maxVal > 0 ? (val / maxVal) * 100 : 0;
                        const aboveAvg  = val > avgVal;

                        return (
                            <div
                                key={i}
                                className="flex-1 flex flex-col items-center gap-1 group cursor-pointer"
                                onMouseEnter={() => setHoveredBar(i)}
                                onMouseLeave={() => setHoveredBar(null)}
                            >
                                {/* Tooltip */}
                                {isHovered && val > 0 && (
                                    <div className="absolute -top-10 z-20 bg-[#12131c] text-white text-[10px] font-bdo font-bold px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap animate-scale-in border border-orange-500/20">
                                        {formatRupiahFull(val)}
                                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900" />
                                    </div>
                                )}
                                {/* Bar */}
                                <div className="w-full flex-1 flex items-end relative">
                                    <div
                                        className={cn(
                                            "w-full rounded-t-lg transition-all duration-200",
                                            isCurrent
                                                ? "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]"
                                                : isPeak
                                                ? "bg-orange-400"
                                                : aboveAvg
                                                ? "bg-orange-200"
                                                : val === 0
                                                ? "bg-slate-100"
                                                : "bg-slate-200",
                                            isHovered && "brightness-110 scale-y-[1.03] origin-bottom",
                                        )}
                                        style={{
                                            height: loaded && val > 0 ? `${Math.max(pct, 2)}%` : val > 0 ? "2%" : "2px",
                                            transition: loaded ? "height 0.7s cubic-bezier(0.16,1,0.3,1)" : "none",
                                            transitionDelay: loaded ? `${i * 30}ms` : "0ms",
                                        }}
                                    />
                                    {isCurrent && val > 0 && (
                                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.8)] animate-pulse-glow" />
                                    )}
                                </div>
                                {/* Label */}
                                <span className={cn(
                                    "font-bdo text-[9px] font-bold uppercase",
                                    isCurrent ? "text-orange-500" : "text-slate-400",
                                )}>
                                    {MONTH_SHORT[month]}
                                </span>
                            </div>
                        );
                    })}
                </div>
                {/* Avg dashed line */}
                {maxVal > 0 && (
                    <div
                        className="absolute left-8 sm:left-10 right-0 border-t border-dashed border-orange-300/50 pointer-events-none"
                        style={{ bottom: `calc(${(avgVal / maxVal) * 160}px + 32px)` }}
                    >
                        <span className="absolute right-0 -top-3.5 font-bdo text-[8px] text-orange-400/80 font-bold bg-white px-1 rounded">avg</span>
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 font-bdo text-[10px] text-slate-400">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-orange-500 inline-block shadow-[0_0_4px_rgba(249,115,22,0.4)]" /> Bulan ini</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-orange-400 inline-block" /> Puncak</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-orange-200 inline-block" /> Di atas rata-rata</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-200 inline-block" /> Di bawah rata-rata</span>
                <span className="font-bold text-slate-500">{activeMo}/12 bulan aktif</span>
            </div>
        </div>
    );
}

// ── Finance Doughnut ──────────────────────────────────────────────────────────

interface DoughnutSegment { name: string; value: number; color: string; displayValue: string; }

function FinanceDoughnut({ segments, centerValue, centerSub }: { segments: DoughnutSegment[]; centerValue: string; centerSub: string }) {
    const total = segments.reduce((sum, s) => sum + s.value, 0);
    let cumulative = 0;
    // FIX: removed duplicate `const stops` declaration — kept only one
    const stops = segments.map((s) => {
        const start = (cumulative / total) * 100;
        cumulative += s.value;
        const end = (cumulative / total) * 100;
        return `${s.color} ${start.toFixed(1)}% ${end.toFixed(1)}%`;
    }).join(", ");

    return (
        <div className="flex flex-col items-center gap-8 animate-fade-in-up">
            <div className="relative h-44 w-44 shrink-0 hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 rounded-full bg-orange-500/20 blur-xl" />
                <div className="h-full w-full rounded-full shadow-lg border-4 border-white/50" style={{ background: `conic-gradient(${stops})` }} />
                <div className="absolute inset-[22px] flex flex-col items-center justify-center rounded-full bg-white shadow-[inset_0_4px_10px_rgba(0,0,0,0.05),_0_10px_20px_rgba(0,0,0,0.1)]">
                    <span className="font-clash text-xl font-bold tracking-tight text-slate-900 text-center px-2">{centerValue}</span>
                    <span className="font-bdo mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">{centerSub}</span>
                </div>
            </div>
        </div>
    );
}

// ── Facility Breakdown Row ────────────────────────────────────────────────────

function FacilityRow({ color, name, share, valueLabel }: { color: string; name: string; share: number; valueLabel: string }) {
    return (
        <li className="flex flex-col gap-2 p-3 hover:bg-slate-50 rounded-xl transition-colors group">
            <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-3 font-bdo font-medium text-slate-700 min-w-0">
                    <div className="h-3 w-3 shrink-0 rounded-full shadow-sm group-hover:scale-125 transition-transform relative" style={{ backgroundColor: color }}>
                        <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white/60 rounded-full" />
                    </div>
                    {name}
                </span>
                <div className="flex items-center gap-3">
                    <span className="font-clash text-sm font-medium text-slate-900">{valueLabel}</span>
                    <span className="w-8 text-right font-clash text-[12px] font-bold text-slate-400">{share}%</span>
                </div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner">
                <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${share}%`, backgroundColor: color }} />
            </div>
        </li>
    );
}

// ── Export Modal with Month Picker ────────────────────────────────────────────

const YEARS_BACK = 3;

function ExportModal({
    isOpen,
    onClose,
    currentMonth,
    currentYear,
    onPrint,
    onBackendExport,
}: {
    isOpen: boolean;
    onClose: () => void;
    currentMonth: number;
    currentYear: number;
    onPrint: (month: number, year: number) => void;
    onBackendExport: (month: number, year: number) => void;
}) {
    const [selMonth, setSelMonth] = useState(currentMonth);
    const [selYear,  setSelYear]  = useState(currentYear);

    const isCurrentPeriod = selMonth === currentMonth && selYear === currentYear;
    const nowYear = new Date().getFullYear();
    const years = Array.from({ length: YEARS_BACK + 1 }, (_, i) => nowYear - i);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
            {/* Modal */}
            <div className="relative z-10 w-full max-w-sm mx-4 bg-white rounded-[28px] shadow-[0_32px_80px_-12px_rgba(0,0,0,0.25)] overflow-hidden modal-enter">
                {/* Top shimmer */}
                <div className="pointer-events-none absolute top-0 left-20 right-20 h-px bg-gradient-to-r from-transparent via-white to-transparent z-10" />

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-orange-50/60 via-white to-white">
                    <div className="flex items-center gap-3">
                        <ShinyIcon className="h-10 w-10">
                            <Download className="w-4 h-4 text-orange-300" />
                        </ShinyIcon>
                        <div>
                            <p className="font-bdo text-[10px] font-bold uppercase tracking-widest text-orange-500">Export Laporan</p>
                            <p className="font-clash text-base font-semibold text-slate-900 leading-tight">Pilih Periode</p>
                        </div>
                    </div>
                    <button title="X" onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 flex flex-col gap-5">
                    <p className="font-bdo text-sm text-slate-500 leading-relaxed">
                        Pilih bulan dan tahun yang ingin Anda ekspor sebagai laporan PDF.
                    </p>

                    {/* Month + Year selectors */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Bulan</label>
                            <select
                                title="nama"
                                value={selMonth}
                                onChange={e => setSelMonth(Number(e.target.value))}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-sm font-bdo text-slate-900 focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                            >
                                {MONTH_NAMES.slice(1).map((name, i) => (
                                    <option key={i + 1} value={i + 1}>{name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Tahun</label>
                            <select
                                title="tahun"
                                value={selYear}
                                onChange={e => setSelYear(Number(e.target.value))}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-sm font-bdo text-slate-900 focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                            >
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Preview badge */}
                    <div className={cn(
                        "flex items-center gap-2 rounded-xl px-3.5 py-2.5 border text-sm font-bdo font-medium",
                        isCurrentPeriod
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                            : "bg-orange-50 border-orange-200 text-orange-700",
                    )}>
                        {isCurrentPeriod ? <CheckCircle2 size={15} /> : <CalendarDays size={15} />}
                        <span>
                            {isCurrentPeriod
                                ? `Mencetak data aktif — ${MONTH_NAMES[selMonth]} ${selYear}`
                                : `Mengekspor via server — ${MONTH_NAMES[selMonth]} ${selYear}`}
                        </span>
                    </div>

                    <p className="font-bdo text-[11px] text-slate-400 -mt-2">
                        {isCurrentPeriod
                            ? "Laporan akan dibuka di dialog cetak browser Anda."
                            : "Data periode lain akan diproses oleh server dan diunduh otomatis."}
                    </p>
                </div>

                {/* Footer actions */}
                <div className="flex items-center gap-3 px-6 py-4 bg-slate-50/60 border-t border-slate-100">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-xl py-3 font-clash text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-all active:scale-95"
                    >
                        Batal
                    </button>
                    <button
                        onClick={() => {
                            if (isCurrentPeriod) onPrint(selMonth, selYear);
                            else onBackendExport(selMonth, selYear);
                        }}
                        className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-[#12131c] py-3 font-clash text-sm font-medium text-white btn-sheen shadow-[inset_0_-8px_15px_-5px_rgba(249,115,22,0.5)] transition-all hover:scale-[0.98] active:scale-95"
                    >
                        <Download size={15} className="text-orange-400" />
                        Export Laporan
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Finance Print Template ────────────────────────────────────────────────────

interface FinancePrintTemplateProps {
    stats: FinanceStats;
    facilityRevenue: FacilityRevenue[];
    dailyRevenue: number[];
    revenueTrend: number;
    period: { month: number; year: number };
    exportMonth: number;
    exportYear: number;
}

function FinancePrintTemplate({
    stats, facilityRevenue, dailyRevenue, revenueTrend, period, exportMonth, exportYear,
}: FinancePrintTemplateProps) {
    const now       = new Date();
    const dateStr   = now.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
    const reportNo  = `LPK/${exportYear}/${String(exportMonth).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}`;
    const trendSign = revenueTrend >= 0 ? "+" : "";

    const safe       = dailyRevenue ?? [];
    const activeDays = safe.filter(v => v > 0).length;
    const avgRevenue = activeDays > 0 ? Math.round(safe.reduce((a, b) => a + b, 0) / safe.length) : 0;
    const peakRev    = safe.length > 0 ? Math.max(...safe) : 0;
    const peakDay    = safe.indexOf(peakRev) + 1;

    const rp  = (v: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);
    const num = (v: number) => new Intl.NumberFormat("id-ID").format(v);

    const periodLabel = `${MONTH_NAMES[exportMonth]} ${exportYear}`;

    const rows: { kategori: string; detail: string; satuan: string; nilai: string }[] = [
        { kategori: "Keuangan",    detail: "Total Pendapatan Periode",           satuan: periodLabel,                nilai: rp(stats.totalRevenue)  },
        { kategori: "Keuangan",    detail: "Rata-rata Pendapatan Harian",        satuan: `${activeDays} hari aktif`, nilai: rp(avgRevenue)          },
        { kategori: "Keuangan",    detail: `Puncak Pendapatan (Tgl ${peakDay})`, satuan: "1 hari",                  nilai: rp(peakRev)             },
        { kategori: "Trend",       detail: "Perubahan vs Bulan Lalu",            satuan: "MoM",                     nilai: `${trendSign}${revenueTrend}%` },
        { kategori: "Operasional", detail: "Total Reservasi Bulan Ini",          satuan: "transaksi",               nilai: num(stats.totalBookings)      },
        { kategori: "Operasional", detail: "Membership Aktif",                   satuan: "anggota",                 nilai: num(stats.activeMemberships)  },
        ...facilityRevenue.map(f => ({
            kategori: "Fasilitas", detail: f.name, satuan: `${f.share}% pangsa pasar`, nilai: rp(f.revenue),
        })),
    ];

    const MINIMUM_ROWS = 10;
    const fillerCount  = Math.max(0, MINIMUM_ROWS - rows.length);

    return (
        <div className="print-finance-template">
            <div className="prt-a4-page">
                <div className="prt-header">
                    <div className="prt-header-left">
                        <img src="/BES.png" alt="Brawijaya Edusport" className="prt-logo-img" />
                    </div>
                    <div className="prt-header-right">
                        <div className="prt-company-name-main">BRAWIJAYA EDUSPORT</div>
                        <div className="prt-company-name-sub">PT BRAWIJAYA MULTI USAHA</div>
                        <div className="prt-company-address">Jln. Terusan Cibogo No.1 Kota Malang<br />NPWP 3295.65.312</div>
                        <hr className="prt-header-divider" />
                        <div className="prt-doc-title">Laporan Keuangan</div>
                    </div>
                </div>

                <div className="prt-meta-outer">
                    <div className="prt-meta-left">
                        <div className="prt-payment-note">
                            Pembayaran melalui Bank Mandiri<br />
                            144-0-02487884-2<br />
                            An Brawijaya Multi Usaha
                        </div>
                    </div>
                    <div className="prt-meta-right">
                        <table>
                            <tbody>
                                <tr><td className="meta-label-col">Tanggal</td><td className="meta-value-col">{dateStr}</td></tr>
                                <tr><td className="meta-label-col">Nomor</td><td className="meta-value-col">{reportNo}</td></tr>
                                <tr><td className="meta-label-col">Periode</td><td className="meta-value-col">{periodLabel}</td></tr>
                                <tr><td className="meta-label-col">Hari Aktif</td><td className="meta-value-col">{activeDays} hari</td></tr>
                                <tr><td className="meta-label-col">Trend Bulan Ini</td><td className="meta-value-col">{trendSign}{revenueTrend}% vs bln lalu</td></tr>
                                <tr><td className="meta-label-col">Mata Uang</td><td className="meta-value-col meta-value-bold">Indonesian Rupiah</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

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
                                <td>&nbsp;</td><td /><td /><td /><td />
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="prt-bottom-row">
                    <div className="prt-keterangan">
                        <span className="prt-keterangan-label">Keterangan :</span>
                    </div>
                    <div className="prt-summary">
                        <table>
                            <tbody>
                                <tr><td>Total Pendapatan</td><td>{rp(stats.totalRevenue)}</td></tr>
                                <tr><td>Rata-rata Harian</td><td>{rp(avgRevenue)}</td></tr>
                                <tr><td>Total Reservasi</td><td>{num(stats.totalBookings)} trx</td></tr>
                                <tr><td>Membership Aktif</td><td>{num(stats.activeMemberships)} orang</td></tr>
                                <tr className="sum-total"><td>Trend Bulan Ini</td><td>{trendSign}{revenueTrend}%</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="prt-page-footer">
                    <span>Halaman 1 dari 1</span>
                    <span>Laporan Keuangan — {periodLabel} — Brawijaya Edusport</span>
                    <span>Dicetak: {dateStr}</span>
                </div>
            </div>
        </div>
    );
}

// ── Main Page Component ───────────────────────────────────────────────────────

type DetailTab = "revenue" | "bookings";

export default function FinanceIndex() {
    const {
        facilityRevenue, facilityBookings, dailyRevenue,
        monthlyRevenue, stats, period, revenueTrend, recentTransactions,
    } = usePage<FinanceProps>().props;

    const trendPositive = revenueTrend >= 0;
    const [activeTab,       setActiveTab]       = useState<DetailTab>("revenue");
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportMonth,     setExportMonth]     = useState(period.month);
    const [exportYear,      setExportYear]      = useState(period.year);

    const periodLabel = `${MONTH_NAMES[period.month] ?? ""} ${period.year}`;

    const totalFacilityRevenue  = facilityRevenue.reduce((s, f) => s + f.revenue, 0);
    const totalFacilityBookings = facilityBookings.reduce((s, f) => s + f.count, 0);

    const revenueDoughnutSegments: DoughnutSegment[] = facilityRevenue.map(f => ({
        name: f.name, value: f.share, color: f.color, displayValue: formatRupiahFull(f.revenue),
    }));
    const bookingDoughnutSegments: DoughnutSegment[] = facilityBookings.map(f => ({
        name: f.name, value: f.share, color: f.color, displayValue: `${f.count} booking`,
    }));

    const safeMonthlyRevenue = monthlyRevenue
        ?? Array.from({ length: 12 }, (_, i) => i + 1 === period.month ? stats.totalRevenue : 0);

    const avgPerBooking = stats.totalBookings > 0
        ? Math.round(stats.totalRevenue / stats.totalBookings)
        : 0;

    function handlePrint(month: number, year: number) {
        setExportMonth(month);
        setExportYear(year);
        setShowExportModal(false);
        setTimeout(() => window.print(), 150);
    }

    function handleBackendExport(month: number, year: number) {
        setShowExportModal(false);
        router.get(route("admin.finance.export", { month, year }));
    }

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4 animate-fade-in-up">
                    <style dangerouslySetInnerHTML={{ __html: FINANCE_STYLES }} />

                    <span className="font-bdo text-[11px] font-bold tracking-wide text-orange-500">
                        Analisis Keuangan
                    </span>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-1">
                        <h1 className="font-clash text-3xl font-bold uppercase tracking-tight xl:text-4xl">
                            <ShinyTextBlack text="Finance Overview" speed={5} />
                        </h1>
                        <div className="flex flex-row flex-wrap items-center gap-2 sm:gap-3">
                            <button
                                onClick={() => setShowExportModal(true)}
                                className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 sm:px-5 py-2 sm:py-2.5 font-clash text-sm font-medium text-white btn-sheen shadow-[inset_0_-8px_15px_-5px_rgba(249,115,22,0.5)] transition-all hover:scale-[1.02] active:scale-[0.97]"
                            >
                                <Download size={15} className="text-white" />
                                Export PDF
                            </button>
                            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-md px-4 sm:px-5 py-2 sm:py-2.5 font-bdo text-sm font-medium text-slate-700 shadow-sm">
                                <CalendarDays size={15} className="text-orange-400" />
                                <span>{periodLabel}</span>
                            </div>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Finance Overview" />

            <div className="flex flex-col gap-5 sm:gap-6 pt-6 pb-20 overflow-x-hidden">

                {/* ── ROW 1: Hero Stats ── */}
                <section className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">

                    {/* Main Revenue Card */}
                    <div className="md:col-span-2 lg:col-span-1 relative rounded-[28px] overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 p-5 sm:p-7 shadow-2xl shadow-orange-200/40 flex flex-col justify-between animate-fade-in-up group hover:-translate-y-1 transition-all duration-500 min-h-[260px] sm:min-h-[320px] lg:min-h-[380px]">
                        <div className="absolute inset-0 water-caustics-effect pointer-events-none opacity-50" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-lg animate-float">
                                    <Wallet className="w-4 h-4 text-white" />
                                </div>
                                <p className="font-bdo text-[11px] font-bold text-orange-100 uppercase tracking-widest">Total Pendapatan</p>
                            </div>
                            <h2 className="font-clash text-2xl sm:text-[2rem] font-bold text-white leading-none tracking-tight">
                                Rp <ShinyText text={formatRevenue(stats.totalRevenue)} speed={4} />
                            </h2>
                            <div className={cn(
                                "mt-4 inline-flex items-center gap-1 text-[11px] font-bold font-bdo px-2.5 py-1 rounded-lg backdrop-blur-md",
                                trendPositive
                                    ? "bg-white/15 text-white border border-white/20"
                                    : "bg-red-900/30 text-red-200 border border-red-700/30",
                            )}>
                                {trendPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                {Math.abs(revenueTrend)}% bulan ini
                            </div>
                        </div>

                        <div className="relative z-10 my-5 flex-1 flex flex-col justify-center">
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/15 divide-y divide-white/10 overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors">
                                    <span className="font-bdo text-[12px] font-medium text-orange-100">Total Reservasi</span>
                                    <span className="font-clash text-sm font-bold text-white">{stats.totalBookings}</span>
                                </div>
                                <div className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors">
                                    <span className="font-bdo text-[12px] font-medium text-orange-100">Membership Aktif</span>
                                    <span className="font-clash text-sm font-bold text-white">{stats.activeMemberships}</span>
                                </div>
                                <div className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors">
                                    <span className="font-bdo text-[12px] font-medium text-orange-100">Avg/Booking</span>
                                    <span className="font-clash text-sm font-bold text-white">{formatRevenue(avgPerBooking)}</span>
                                </div>
                            </div>
                        </div>

                        <button className="relative z-10 w-full bg-white text-orange-600 font-clash text-sm font-semibold py-3.5 rounded-xl hover:bg-orange-50 active:scale-95 transition-all flex items-center justify-center gap-2">
                            <Activity className="w-4 h-4" /> Lihat Analitik Lengkap
                        </button>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 content-stretch animate-fade-in-up delay-100">
                        {/* Reservasi Selesai */}
                        <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-[20px] sm:rounded-[24px] p-4 sm:p-6 shadow-md hover:-translate-y-1 transition-all border border-orange-200 flex flex-col justify-between card-glint shimmer-once">
                            <div className="bg-orange-400/75 p-2 rounded-xl w-fit animate-float">
                                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div>
                                <p className="font-clash text-xl sm:text-2xl font-bold text-white">{stats.totalBookings}</p>
                                <p className="font-bdo text-[10px] sm:text-[11px] text-white mt-1">Reservasi Selesai</p>
                            </div>
                        </div>
                        {/* Member Gym */}
                        <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-[20px] sm:rounded-[24px] p-4 sm:p-6 shadow-md hover:-translate-y-1 transition-all border border-orange-300 flex flex-col justify-between card-glint shimmer-once">
                            <div className="bg-orange-400/75 p-2 rounded-xl w-fit animate-float" style={{ animationDelay: "0.5s" }}>
                                <Ticket className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div>
                                <p className="font-clash text-xl sm:text-2xl font-bold text-white">{stats.activeMemberships}</p>
                                <p className="font-bdo text-[10px] sm:text-[11px] text-white mt-1">Member Gym</p>
                            </div>
                        </div>
                        {/* Avg per Booking */}
                        <div className="bg-white rounded-[20px] sm:rounded-[24px] p-4 sm:p-6 shadow-sm border border-slate-200 hover:-translate-y-1 transition-all card-glint flex flex-col justify-between">
                            <div className="flex items-center gap-2">
                                <div className="bg-emerald-100 p-1.5 sm:p-2 rounded-xl">
                                    <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                                </div>
                                <span className="font-bdo text-[9px] font-bold uppercase tracking-widest text-slate-400">Avg Booking</span>
                            </div>
                            <div>
                                <p className="font-clash text-xl sm:text-2xl font-bold text-slate-900">{formatRevenue(avgPerBooking)}</p>
                                <p className="font-bdo text-[10px] sm:text-[11px] text-slate-500 mt-0.5">Per transaksi</p>
                            </div>
                        </div>
                        {/* Trend KPI */}
                        <div className={cn(
                            "rounded-[20px] sm:rounded-[24px] p-4 sm:p-6 shadow-sm border hover:-translate-y-1 transition-all flex flex-col justify-between card-glint",
                            trendPositive
                                ? "bg-emerald-50 border-emerald-200"
                                : "bg-rose-50 border-rose-200",
                        )}>
                            <div className={cn("p-1.5 sm:p-2 rounded-xl w-fit", trendPositive ? "bg-emerald-100" : "bg-rose-100")}>
                                {trendPositive
                                    ? <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                                    : <ArrowDownRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600" />}
                            </div>
                            <div>
                                <p className={cn("font-clash text-xl sm:text-2xl font-bold", trendPositive ? "text-emerald-700" : "text-rose-600")}>
                                    {trendPositive ? "+" : ""}{revenueTrend}%
                                </p>
                                <p className={cn("font-bdo text-[10px] sm:text-[11px] mt-0.5", trendPositive ? "text-emerald-600" : "text-rose-500")}>
                                    vs bulan lalu
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Daily Revenue Chart */}
                    <div className="bg-white rounded-[28px] p-5 sm:p-7 shadow-sm border border-slate-200 relative overflow-hidden group flex flex-col animate-fade-in-up delay-200 card-glint">
                        <div className="absolute inset-0 bg-gradient-to-b from-orange-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                        <div className="mb-4 flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-3">
                                <ShinyIcon className="h-10 w-10 group-hover:scale-105 transition-transform duration-300">
                                    <TrendingUp className="w-4 h-4 text-orange-300" />
                                </ShinyIcon>
                                <div>
                                    <h2 className="font-clash text-base font-semibold text-slate-900 leading-tight">
                                        <SplitText text="Trend Harian" delay={300} />
                                    </h2>
                                    <p className="font-bdo text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Bulan {MONTH_NAMES[period.month]}</p>
                                </div>
                            </div>
                            <span className={cn(
                                "flex items-center gap-1 rounded-xl px-2.5 py-1.5 font-bdo text-[10px] font-bold shadow-sm",
                                trendPositive
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                    : "bg-rose-50 text-rose-600 border border-rose-100",
                            )}>
                                {trendPositive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                                {Math.abs(revenueTrend)}% vs bln lalu
                            </span>
                        </div>
                        <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent mb-2 relative z-10" />
                        <div className="flex-1 relative z-10">
                            <InteractiveRevenueChart data={dailyRevenue} monthLabel={MONTH_NAMES[period.month]} />
                        </div>
                    </div>

                </section>

                {/* ── ROW 2: Annual Monthly Revenue Chart ── */}
                <section className="animate-fade-in-up delay-200">
                    <div className="bg-white rounded-[28px] p-5 sm:p-7 shadow-sm border border-slate-200 relative overflow-hidden group card-glint">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                        <div className="pointer-events-none absolute top-0 left-20 right-20 h-px bg-gradient-to-r from-transparent via-white to-transparent z-10" />

                        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                            <div className="flex items-center gap-3">
                                <ShinyIcon className="h-10 w-10">
                                    <BarChart3 className="w-4 h-4 text-orange-300" />
                                </ShinyIcon>
                                <div>
                                    <p className="font-bdo text-[10px] font-bold uppercase tracking-widest text-orange-500">Tahun {period.year}</p>
                                    <h2 className="font-clash text-lg font-semibold text-slate-900 leading-tight">
                                        <SplitText text="Pendapatan Bulanan" delay={200} />
                                    </h2>
                                    <p className="font-bdo text-[11px] text-slate-400 mt-0.5">Ringkasan 12 bulan dalam satu tahun</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-bdo text-[11px] font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                                    Aktif: <span className="text-orange-500">{MONTH_NAMES[period.month]}</span>
                                </span>
                            </div>
                        </div>

                        <div className="relative z-10">
                            <MonthlyRevenueBarChart
                                data={safeMonthlyRevenue}
                                currentMonth={period.month}
                                currentYear={period.year}
                            />
                        </div>

                        {!monthlyRevenue && (
                            <p className="mt-4 font-bdo text-[11px] text-slate-400 flex items-center gap-1.5 relative z-10">
                                <Zap size={11} className="text-orange-400" />
                                Chart menampilkan data bulan aktif. Data 12 bulan penuh tersedia setelah integrasi backend.
                            </p>
                        )}
                    </div>
                </section>

                {/* ── ROW 3: Detailed Analytics ── */}
                <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">

                    {/* Left: Tabs & Breakdown */}
                    <div className="lg:col-span-7 flex flex-col gap-6 animate-fade-in-up delay-300">
                        {/* Tab switcher */}
                        <div className="flex items-center gap-2 sm:gap-3 bg-white p-1.5 rounded-2xl w-full sm:w-fit border border-slate-200 shadow-inner overflow-hidden">
                            <button
                                onClick={() => setActiveTab("revenue")}
                                className={cn(
                                    "flex flex-1 sm:flex-none items-center justify-center sm:justify-start gap-2 rounded-xl px-3 sm:px-5 py-2.5 font-clash text-sm font-medium transition-all",
                                    activeTab === "revenue"
                                        ? "bg-slate-100 text-orange-600 shadow-inner"
                                        : "text-slate-500 hover:bg-slate-200/50",
                                )}
                            >
                                <Wallet size={16} className={activeTab === "revenue" ? "text-orange-400" : ""} />
                                Pendapatan
                            </button>
                            <button
                                onClick={() => setActiveTab("bookings")}
                                className={cn(
                                    "flex flex-1 sm:flex-none items-center justify-center sm:justify-start gap-2 rounded-xl px-3 sm:px-5 py-2.5 font-clash text-sm font-medium transition-all",
                                    activeTab === "bookings"
                                        ? "bg-slate-100 text-orange-600 shadow-inner"
                                        : "text-slate-500 hover:bg-slate-200/50",
                                )}
                            >
                                <BarChart3 size={16} className={activeTab === "bookings" ? "text-orange-400" : ""} />
                                Reservasi
                            </button>
                        </div>

                        {/* Facility breakdown card */}
                        <div className="bg-white rounded-[28px] p-5 sm:p-7 shadow-sm border border-slate-200 card-glint flex-1">
                            <h3 className="font-clash text-lg font-semibold text-slate-900 mb-6 flex items-center gap-3">
                                <div className="bg-orange-50 p-1.5 rounded-lg border border-orange-100">
                                    <LayoutGrid className="w-4 h-4 text-orange-500" />
                                </div>
                                Detail per Fasilitas
                            </h3>
                            <ul className="space-y-2">
                                {activeTab === "revenue"
                                    ? facilityRevenue.map(f => <FacilityRow key={f.name} {...f} valueLabel={formatRupiahFull(f.revenue)} />)
                                    : facilityBookings.map(f => <FacilityRow key={f.name} {...f} valueLabel={`${f.count} booking`} />)
                                }
                            </ul>
                            <div className="mt-8 flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-4 sm:p-5 rounded-[20px] border border-slate-100">
                                <span className="font-bdo text-xs font-bold text-slate-400 uppercase tracking-widest">Total Akumulasi</span>
                                <span className="font-clash text-xl font-bold text-slate-900">
                                    <ShinyTextBlack
                                        text={activeTab === "revenue" ? formatRupiahFull(totalFacilityRevenue) : `${totalFacilityBookings} Bookings`}
                                        speed={4}
                                    />
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Distribution */}
                    <div className="lg:col-span-5 flex flex-col gap-6 animate-fade-in-up delay-300">
                        <div className="bg-white rounded-[28px] p-5 sm:p-7 shadow-sm border border-slate-200 card-glint flex flex-col items-center justify-center min-h-[380px] sm:min-h-[450px]">
                            <div className="w-full mb-6 sm:mb-8 flex items-center justify-between">
                                <h3 className="font-clash text-lg font-semibold text-slate-900">Distribusi</h3>
                                <div className="bg-orange-50 p-1.5 rounded-lg border border-orange-100">
                                    <PieChart className="w-4 h-4 text-orange-500" />
                                </div>
                            </div>
                            <FinanceDoughnut
                                segments={activeTab === "revenue" ? revenueDoughnutSegments : bookingDoughnutSegments}
                                centerValue={activeTab === "revenue" ? formatRevenue(totalFacilityRevenue) : String(totalFacilityBookings)}
                                centerSub={activeTab === "revenue" ? "Pendapatan" : "Reservasi"}
                            />
                            <div className="mt-6 sm:mt-10 grid grid-cols-2 gap-2 sm:gap-3 w-full">
                                {(activeTab === "revenue" ? revenueDoughnutSegments : bookingDoughnutSegments).slice(0, 4).map(seg => (
                                    <div key={seg.name} className="flex items-center gap-2 bg-slate-50 p-2 sm:p-2.5 rounded-xl border border-slate-100 hover:bg-white hover:shadow-sm transition-all min-w-0">
                                        <div className="h-2 w-2 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: seg.color }} />
                                        <span className="font-bdo text-[10px] text-slate-600 truncate">{seg.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </section>

                {/* ── ROW 4: Recent Transactions ── */}
                <section className="animate-fade-in-up delay-400">
                    <div className="bg-white rounded-[28px] p-5 sm:p-7 shadow-sm border border-slate-200 card-glint">
                        <div className="pointer-events-none absolute top-0 left-20 right-20 h-px bg-gradient-to-r from-transparent via-white to-transparent z-10" />

                        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <ShinyIcon className="h-10 w-10 animate-float">
                                    <CreditCard className="w-4 h-4 text-orange-300" />
                                </ShinyIcon>
                                <div>
                                    <p className="font-bdo text-[10px] font-bold uppercase tracking-widest text-slate-400">Keuangan</p>
                                    <h2 className="font-clash text-base font-semibold text-slate-900">
                                        <SplitText text="Transaksi Lunas Terbaru" delay={500} />
                                    </h2>
                                    <p className="font-bdo text-[11px] text-slate-400 mt-0.5">Update real-time aktivitas pembayaran</p>
                                </div>
                            </div>
                            <span className="font-bdo text-[11px] font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100 uppercase tracking-wide flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_6px_rgba(249,115,22,0.8)]" />
                                Live Feed
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recentTransactions.map((tx, idx) => (
                                <div
                                    key={tx.id}
                                    className={cn(
                                        "p-5 rounded-2xl transition-all border group relative overflow-hidden",
                                        idx === 0
                                            ? "bg-[#12131c] border-slate-800 shadow-xl"
                                            : "bg-white border-slate-100 hover:border-orange-200 hover:shadow-md card-breath",
                                    )}
                                >
                                    {idx === 0 && <div className="absolute inset-0 water-caustics-effect opacity-10 pointer-events-none" />}
                                    <div className="flex justify-between items-start relative z-10 gap-2">
                                        <div className="flex gap-3 min-w-0">
                                            <div className={cn("p-2.5 rounded-xl shrink-0 animate-float", idx === 0 ? "bg-white/10" : "bg-orange-50")} style={{ animationDelay: `${idx * 0.3}s` }}>
                                                <UserCheck className={cn("w-5 h-5", idx === 0 ? "text-white" : "text-orange-500")} />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className={cn("font-clash text-sm font-medium leading-tight truncate", idx === 0 ? "text-white" : "text-slate-900")}>
                                                    {tx.user_name}
                                                </h4>
                                                <p className={cn("font-bdo text-[10px] mt-1", idx === 0 ? "text-slate-400" : "text-slate-500")}>
                                                    {tx.paid_at}
                                                </p>
                                            </div>
                                        </div>
                                        <p className={cn("font-clash text-sm sm:text-base font-bold shrink-0", idx === 0 ? "text-emerald-400" : "text-slate-900")}>
                                            Rp {tx.amount.toLocaleString("id-ID")}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </div>

            {/* ── Export Modal ── */}
            <ExportModal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                currentMonth={period.month}
                currentYear={period.year}
                onPrint={handlePrint}
                onBackendExport={handleBackendExport}
            />

            {/* ── Finance Print Template ── */}
            <FinancePrintTemplate
                stats={stats}
                facilityRevenue={facilityRevenue}
                dailyRevenue={dailyRevenue}
                revenueTrend={revenueTrend}
                period={period}
                exportMonth={exportMonth}
                exportYear={exportYear}
            />

        </AdminLayout>
    );
}