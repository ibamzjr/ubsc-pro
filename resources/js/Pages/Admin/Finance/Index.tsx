import { Head, router, usePage } from "@inertiajs/react";
import {
    ArrowDownRight,
    ArrowUpRight,
    BarChart3,
    CalendarDays,
    ChevronDown,
    CreditCard,
    Download,
    PieChart,
    TrendingUp,
    Wallet,
    Coins,
    Ticket,
    Star,
    LayoutGrid,
    Activity,
    ChevronRight
} from "lucide-react";
import React, { useState, useEffect } from "react";

// --- FALLBACK REACT BITS ---
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
import type { PageProps, RecentTransaction } from "@/types";

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
    stats: FinanceStats;
    period: { month: number; year: number };
    revenueTrend: number;
    recentTransactions: RecentTransaction[];
}>;

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatRevenue(amount: number): string {
    if (amount >= 1_000_000) {
        return `${(amount / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })}JT`;
    }
    return amount.toLocaleString("id-ID");
}

function formatRupiahFull(amount: number): string {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

const MONTH_NAMES = [
    "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

// ── CUSTOM INTERACTIVE CHART (Dashboard Sync) ───────────────────────────────

function InteractiveRevenueChart({ data, monthLabel }: { data: number[], monthLabel: string }) {
    const [activePoint, setActivePoint] = useState<number | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => { setTimeout(() => setIsLoaded(true), 100); }, []);

    const chartData = data && data.length > 0 ? data : Array(30).fill(0);
    const maxVal = Math.max(...chartData, 1000);
    const points = chartData.map((val, i) => {
        const x = (i / (chartData.length - 1)) * 100; 
        const y = 100 - (val / maxVal) * 100; 
        return { x, y, val, day: i + 1 };
    });

    const linePath = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
    const areaPath = `${linePath} L 100 100 L 0 100 Z`;

    return (
        <div className="relative w-full h-[220px] mt-4 font-bdo select-none">
            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] font-medium text-slate-400 pointer-events-none">
                <span>{formatRevenue(maxVal)}</span>
                <span>{formatRevenue(maxVal / 2)}</span>
                <span>0</span>
            </div>

            <div className="absolute left-8 right-0 top-2 bottom-6">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                    <defs>
                        <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                        </linearGradient>
                        <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="1.5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>
                    <line x1="0" y1="0" x2="100" y2="0" stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="2" />
                    <line x1="0" y1="50" x2="100" y2="50" stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="2" />
                    <line x1="0" y1="100" x2="100" y2="100" stroke="#e2e8f0" strokeWidth="1" />
                    <path d={areaPath} fill="url(#chartGlow)" className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />
                    <path d={linePath} fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#lineGlow)" className="transition-all duration-1000 ease-out" style={{ strokeDasharray: 500, strokeDashoffset: isLoaded ? 0 : 500 }} />
                    {points.map((p, i) => (
                        <g key={i} onClick={() => setActivePoint(i)} className="cursor-crosshair group">
                            <line x1={p.x} y1="100" x2={p.x} y2={p.y} stroke="#fed7aa" strokeWidth="0.5" strokeDasharray="1 1" className={`transition-opacity ${activePoint === i ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                            <circle cx={p.x} cy={p.y} r={activePoint === i ? 2 : 1.5} fill={activePoint === i ? "#ffffff" : "#f97316"} stroke="#ea580c" strokeWidth="0.5" className={`transition-all ${activePoint === i ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                            <circle cx={p.x} cy={p.y} r="4" fill="transparent" />
                        </g>
                    ))}
                </svg>
                {activePoint !== null && (
                    <div className="absolute z-20 bg-[#12131c] border border-orange-500/30 text-white p-3 rounded-xl shadow-[0_10px_25px_rgba(249,115,22,0.3)] pointer-events-none animate-fade-in-up" style={{ left: `${points[activePoint].x}%`, top: `${points[activePoint].y}%`, transform: `translate(${points[activePoint].x > 50 ? '-110%' : '10%'}, -110%)` }}>
                        <p className="font-bdo text-[10px] text-orange-300 uppercase tracking-widest mb-1">{points[activePoint].day} {monthLabel}</p>
                        <p className="font-clash text-lg font-bold">{formatRupiahFull(points[activePoint].val)}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Finance Doughnut ─────────────────────────────────────────────────────────

interface DoughnutSegment {
    name: string; value: number; color: string; displayValue: string;
}

function FinanceDoughnut({ segments, centerValue, centerSub }: { segments: DoughnutSegment[]; centerValue: string; centerSub: string; }) {
    const total = segments.reduce((sum, s) => sum + s.value, 0);
    let cumulative = 0;
    const stops = segments.map((s) => {
        const start = (cumulative / total) * 100;
        cumulative += s.value;
        const end = (cumulative / total) * 100;
        return `${s.color} ${start.toFixed(1)}% ${end.toFixed(1)}%`;
    }).join(", ");

    return (
        <div className="flex flex-col items-center gap-8 animate-fade-in-up">
            <div className="relative h-44 w-44 shrink-0 hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 rounded-full bg-orange-500/20 blur-xl"></div>
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

function FacilityRow({ color, name, share, valueLabel }: { color: string; name: string; share: number; valueLabel: string; }) {
    return (
        <li className="flex flex-col gap-2 p-3 hover:bg-slate-50 rounded-xl transition-colors group">
            <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-3 font-bdo font-medium text-slate-700">
                    <div className="h-3 w-3 shrink-0 rounded-full shadow-sm group-hover:scale-125 transition-transform relative" style={{ backgroundColor: color }}>
                         <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white/60 rounded-full"></div>
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

// ── Main Page Component ───────────────────────────────────────────────────────

type DetailTab = "revenue" | "bookings";

export default function FinanceIndex() {
    const { facilityRevenue, facilityBookings, dailyRevenue, stats, period, revenueTrend, recentTransactions } = usePage<FinanceProps>().props;

    const trendPositive = revenueTrend >= 0;
    const [activeTab, setActiveTab] = useState<DetailTab>("revenue");
    const periodLabel = `${MONTH_NAMES[period.month] ?? ""} ${period.year}`;

    const totalFacilityRevenue = facilityRevenue.reduce((s, f) => s + f.revenue, 0);
    const totalFacilityBookings = facilityBookings.reduce((s, f) => s + f.count, 0);

    const revenueDoughnutSegments: DoughnutSegment[] = facilityRevenue.map((f) => ({
        name: f.name, value: f.share, color: f.color, displayValue: formatRupiahFull(f.revenue),
    }));

    const bookingDoughnutSegments: DoughnutSegment[] = facilityBookings.map((f) => ({
        name: f.name, value: f.share, color: f.color, displayValue: `${f.count} booking`,
    }));

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4 animate-fade-in-up">
                    <style dangerouslySetInnerHTML={{__html: `
                        .font-clash { font-family: 'Clash Display', sans-serif; }
                        .font-bdo { font-family: 'BDO Grotesk', sans-serif; }
                        @keyframes fadeInUp { from { opacity: 0; transform: translate3d(0, 30px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
                        @keyframes float { 0%, 100% { transform: translate3d(0, 0, 0); } 50% { transform: translate3d(0, -6px, 0); } }
                        @keyframes caustics { 0% { background-position: 0% 50%; opacity: 0.15; } 50% { background-position: 100% 50%; opacity: 0.35; } 100% { background-position: 0% 50%; opacity: 0.15; } }
                        .water-caustics-effect { background: radial-gradient(circle at top left, rgba(255,255,255,0.3) 0%, transparent 40%), radial-gradient(circle at bottom right, rgba(255,255,255,0.2) 0%, transparent 50%); background-size: 150% 150%; animation: caustics 8s ease-in-out infinite; mix-blend-mode: overlay; }
                        .animate-fade-in-up { animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
                        .animate-float { animation: float 3.5s ease-in-out infinite; }
                        .animate-shiny-black { background: linear-gradient(120deg, #0f172a 35%, #cbd5e1 50%, #0f172a 65%); background-size: 200% auto; color: transparent; -webkit-background-clip: text; background-clip: text; animation: shinyBlackText 5s linear infinite; }
                        @keyframes shinyBlackText { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
                        .animate-shiny-text { background: linear-gradient(120deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.4) 100%); background-size: 200% auto; color: transparent; -webkit-background-clip: text; background-clip: text; animation: shinyText 3s linear infinite; }
                        @keyframes shinyText { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
                        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                        .custom-scrollbar::-webkit-scrollbar-thumb { background: #fed7aa; border-radius: 4px; }
                    `}} />
                    <span className="font-bdo text-[11px] font-medium tracking-wide text-slate-400">Analisis Keuangan</span>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-1">
                        <h1 className="font-clash text-3xl font-bold uppercase tracking-tight xl:text-4xl">
                            <ShinyTextBlack text="Finance Overview" speed={5} />
                        </h1>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <button onClick={() => router.get(route("admin.finance.export", { month: period.month, year: period.year }))} className="flex justify-center items-center gap-2 rounded-xl bg-[#12131c] px-5 py-2.5 text-sm font-clash font-medium text-white shadow-[inset_0_-8px_15px_-5px_rgba(249,115,22,0.5)] transition-transform hover:scale-105">
                                <Download size={16} className="text-orange-400" /> Export PDF
                            </button>
                            <button className="flex justify-center items-center gap-2 rounded-xl border border-slate-200 bg-white/50 backdrop-blur-md px-5 py-2.5 text-sm font-bdo font-medium text-slate-700">
                                <CalendarDays size={16} className="text-slate-400" />
                                <span>{periodLabel}</span>
                                <ChevronDown size={14} className="text-slate-400" />
                            </button>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Finance Index" />

            <div className="flex flex-col gap-6 pt-6 pb-20">
                
                {/* ── ROW 1: Hero Section ── */}
                <section className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-stretch">
                    
                    {/* Main Featured Revenue Card */}
                    <div className="relative rounded-[28px] overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 p-7 shadow-2xl shadow-orange-200/40 flex flex-col justify-between animate-fade-in-up group hover:-translate-y-1 transition-all duration-500 min-h-[380px]">
                        <div className="absolute inset-0 water-caustics-effect pointer-events-none opacity-50"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-lg"><Wallet className="w-4 h-4 text-white" /></div>
                                <p className="font-bdo text-[11px] font-bold text-orange-100 uppercase tracking-widest">Total Pendapatan</p>
                            </div>
                            <h2 className="font-clash text-[2rem] font-bold text-white leading-none tracking-tight">
                                Rp <ShinyText text={formatRevenue(stats.totalRevenue)} speed={4} />
                            </h2>
                            <div className={cn("mt-4 inline-flex items-center gap-1 text-[11px] font-bold font-bdo px-2.5 py-1 rounded-lg backdrop-blur-md", trendPositive ? "bg-white/15 text-white border border-white/20" : "bg-red-900/30 text-red-200 border border-red-700/30")}>
                                {trendPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {Math.abs(revenueTrend)}% bulan ini
                            </div>
                        </div>

                        <div className="relative z-10 my-5 flex-1 flex flex-col justify-center">
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/15 divide-y divide-white/10 overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors">
                                    <span className="font-bdo text-[12px] font-medium text-orange-100">Total Reservasi</span>
                                    <span className="font-clash text-sm font-bold text-white">{stats.totalBookings}</span>
                                </div>
                                <div className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors">
                                    <span className="font-bdo text-[12px] font-medium text-orange-100">Membership</span>
                                    <span className="font-clash text-sm font-bold text-white">{stats.activeMemberships}</span>
                                </div>
                            </div>
                        </div>

                        <button className="relative z-10 w-full bg-white text-orange-600 font-clash text-sm font-semibold py-3.5 rounded-xl hover:bg-orange-50 active:scale-95 transition-all flex items-center justify-center gap-2">
                            <Activity className="w-4 h-4" /> Lihat Analitik Lengkap
                        </button>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4 content-stretch">
                        <div className="bg-[#12131c] rounded-[24px] p-6 shadow-md hover:-translate-y-1 transition-all border border-slate-800/80 flex flex-col justify-between">
                             <div className="bg-orange-500/20 p-2 rounded-xl w-fit"><BarChart3 className="w-5 h-5 text-orange-400" /></div>
                             <div>
                                <p className="font-clash text-2xl font-bold text-white">{stats.totalBookings}</p>
                                <p className="font-bdo text-[11px] text-slate-400 mt-1">Reservasi Selesai</p>
                             </div>
                        </div>
                        <div className="bg-[#12131c] rounded-[24px] p-6 shadow-md hover:-translate-y-1 transition-all border border-slate-800/80 flex flex-col justify-between">
                             <div className="bg-orange-500/20 p-2 rounded-xl w-fit"><Ticket className="w-5 h-5 text-orange-400" /></div>
                             <div>
                                <p className="font-clash text-2xl font-bold text-white">{stats.activeMemberships}</p>
                                <p className="font-bdo text-[11px] text-slate-400 mt-1">Member Gym</p>
                             </div>
                        </div>
                        <div className="col-span-2 bg-orange-50 border border-orange-100 rounded-[24px] p-6 shadow-md hover:-translate-y-1 transition-all flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-orange-100 p-3 rounded-2xl"><Coins className="w-6 h-6 text-orange-600" /></div>
                                <div>
                                    <p className="font-clash text-xl font-bold text-orange-600">{periodLabel}</p>
                                    <p className="font-bdo text-[11px] text-orange-500">Periode Laporan Aktif</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-orange-400" />
                        </div>
                    </div>

                    {/* Revenue Chart Card */}
                    <div className="bg-white rounded-[28px] p-7 shadow-sm border border-slate-200 relative overflow-hidden group flex flex-col animate-fade-in-up">
                        <div className="absolute inset-0 bg-gradient-to-b from-orange-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <div className="mb-4 flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#12131c] p-2.5 rounded-xl shadow-lg animate-float"><TrendingUp className="w-5 h-5 text-orange-400" /></div>
                                <div>
                                    <h2 className="font-clash text-lg font-medium text-slate-900">Trend Harian</h2>
                                    <p className="font-bdo text-[10px] text-slate-400 uppercase tracking-wider">Bulan {MONTH_NAMES[period.month]}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 relative z-10">
                            <InteractiveRevenueChart data={dailyRevenue} monthLabel={MONTH_NAMES[period.month]} />
                        </div>
                    </div>

                </section>

                {/* ── ROW 2: Detailed Analytics ── */}
                <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    
                    {/* Left: Tabs & Breakdown (7 Columns) */}
                    <div className="lg:col-span-7 flex flex-col gap-6 animate-fade-in-up">
                        <div className="flex items-center gap-3 bg-slate-100/50 p-1.5 rounded-2xl w-fit border border-slate-200/60 shadow-inner">
                            <button onClick={() => setActiveTab("revenue")} className={cn("flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-clash font-medium transition-all", activeTab === "revenue" ? "bg-[#12131c] text-white shadow-lg" : "text-slate-500 hover:bg-slate-200/50")}>
                                <Wallet size={16} className={activeTab === "revenue" ? "text-orange-400" : ""} /> Pendapatan
                            </button>
                            <button onClick={() => setActiveTab("bookings")} className={cn("flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-clash font-medium transition-all", activeTab === "bookings" ? "bg-[#12131c] text-white shadow-lg" : "text-slate-500 hover:bg-slate-200/50")}>
                                <BarChart3 size={16} className={activeTab === "bookings" ? "text-orange-400" : ""} /> Reservasi
                            </button>
                        </div>

                        <div className="bg-white rounded-[28px] p-7 shadow-sm border border-slate-200">
                            <h3 className="font-clash text-lg font-medium text-slate-900 mb-6 flex items-center gap-3">
                                <LayoutGrid className="w-5 h-5 text-orange-500" /> Detail per Fasilitas
                            </h3>
                            <ul className="space-y-2">
                                {activeTab === "revenue" 
                                    ? facilityRevenue.map(f => <FacilityRow key={f.name} {...f} valueLabel={formatRupiahFull(f.revenue)} />)
                                    : facilityBookings.map(f => <FacilityRow key={f.name} {...f} valueLabel={`${f.count} booking`} />)
                                }
                            </ul>
                            <div className="mt-8 flex items-center justify-between bg-slate-50 p-5 rounded-[20px] border border-slate-100">
                                <span className="text-xs font-bdo font-bold text-slate-400 uppercase tracking-widest">Total Akumulasi</span>
                                <span className="font-clash text-xl font-bold text-slate-900">
                                    <ShinyTextBlack text={activeTab === "revenue" ? formatRupiahFull(totalFacilityRevenue) : `${totalFacilityBookings} Bookings`} speed={4} />
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Distribution (5 Columns) */}
                    <div className="lg:col-span-5 flex flex-col gap-6 animate-fade-in-up">
                        <div className="bg-white rounded-[28px] p-7 shadow-sm border border-slate-200 flex flex-col items-center justify-center min-h-[450px]">
                            <div className="w-full mb-8 flex items-center justify-between">
                                <h3 className="font-clash text-lg font-medium text-slate-900">Distribusi</h3>
                                <PieChart className="w-5 h-5 text-orange-500" />
                            </div>
                            <FinanceDoughnut 
                                segments={activeTab === "revenue" ? revenueDoughnutSegments : bookingDoughnutSegments}
                                centerValue={activeTab === "revenue" ? formatRevenue(totalFacilityRevenue) : String(totalFacilityBookings)}
                                centerSub={activeTab === "revenue" ? "Pendapatan" : "Reservasi"}
                            />
                            <div className="mt-10 grid grid-cols-2 gap-3 w-full">
                                { (activeTab === "revenue" ? revenueDoughnutSegments : bookingDoughnutSegments).slice(0, 4).map(seg => (
                                    <div key={seg.name} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                        <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: seg.color }}></div>
                                        <span className="font-bdo text-[10px] text-slate-600 truncate">{seg.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </section>

                {/* ── ROW 3: Recent Transactions ── */}
                <section className="animate-fade-in-up">
                    <div className="bg-white rounded-[28px] p-7 shadow-sm border border-slate-200">
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-[#12131c] p-2.5 rounded-xl shadow-lg animate-float"><CreditCard className="w-5 h-5 text-orange-400" /></div>
                                <div>
                                    <h2 className="font-clash text-lg font-medium text-slate-900">Transaksi Lunas Terbaru</h2>
                                    <p className="font-bdo text-[11px] text-slate-400">Update real-time aktivitas pembayaran</p>
                                </div>
                            </div>
                            <span className="font-bdo text-[11px] font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100 uppercase tracking-wide">Live Feed</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recentTransactions.map((tx, idx) => (
                                <div key={tx.id} className={cn("p-5 rounded-2xl transition-all border group relative overflow-hidden", idx === 0 ? "bg-[#12131c] border-slate-800 shadow-xl lg:col-span-1" : "bg-white border-slate-100 hover:border-orange-200")}>
                                    {idx === 0 && <div className="absolute inset-0 water-caustics-effect opacity-10 pointer-events-none"></div>}
                                    <div className="flex justify-between items-start relative z-10">
                                        <div className="flex gap-4">
                                            <div className={cn("p-2.5 rounded-xl shrink-0", idx === 0 ? "bg-white/10" : "bg-orange-50")}>
                                                <UserCheck className={cn("w-5 h-5", idx === 0 ? "text-white" : "text-orange-500")} />
                                            </div>
                                            <div>
                                                <h4 className={cn("font-clash text-sm font-medium", idx === 0 ? "text-white" : "text-slate-900")}>{tx.user_name}</h4>
                                                <p className={cn("font-bdo text-[10px] mt-1", idx === 0 ? "text-slate-400" : "text-slate-500")}>{tx.paid_at}</p>
                                            </div>
                                        </div>
                                        <p className={cn("font-clash text-base font-bold", idx === 0 ? "text-emerald-400" : "text-slate-900")}>Rp {tx.amount.toLocaleString("id-ID")}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </div>
        </AdminLayout>
    );
}

// Tambahkan UserCheck ke lucide-react import di paling atas agar tidak error
import { UserCheck } from "lucide-react";