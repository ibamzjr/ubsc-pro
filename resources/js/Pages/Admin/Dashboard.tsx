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
    ChevronRight
} from "lucide-react";

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
import type { PageProps, RecentActivity } from "@/types";

// ── Types ──────────────────────────────────────────────────────────────────────

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

// ── Helpers ───────────────────────────────────────────────────────────────────

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

// ── Premium Stat Card (preserved – kept as design backup) ─────────────────────

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

// ── CUSTOM INTERACTIVE CHART (Low Spec, SVG Based) ───────────────────────────

function InteractiveRevenueChart({ data, monthLabel }: { data: number[], monthLabel: string }) {
    const [activePoint, setActivePoint] = useState<number | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsLoaded(true), 100);
    }, []);

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
            {/* Y-Axis Labels */}
            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] font-medium text-slate-400 pointer-events-none">
                <span>{formatRevenue(maxVal)}</span>
                <span>{formatRevenue(maxVal / 2)}</span>
                <span>0</span>
            </div>

            {/* Chart Area */}
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

                    <path
                        d={linePath}
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#lineGlow)"
                        className="transition-all duration-1000 ease-out"
                        style={{
                            strokeDasharray: 500,
                            strokeDashoffset: isLoaded ? 0 : 500
                        }}
                    />

                    {points.map((p, i) => (
                        <g key={i} onClick={() => setActivePoint(i)} className="cursor-crosshair group">
                            <line
                                x1={p.x} y1="100" x2={p.x} y2={p.y}
                                stroke="#fed7aa" strokeWidth="0.5" strokeDasharray="1 1"
                                className={`transition-opacity ${activePoint === i ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}
                            />
                            <circle
                                cx={p.x} cy={p.y}
                                r={activePoint === i ? 2 : 1.5}
                                fill={activePoint === i ? "#ffffff" : "#f97316"}
                                stroke="#ea580c" strokeWidth="0.5"
                                className={`transition-all ${activePoint === i ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                            />
                            <circle cx={p.x} cy={p.y} r="4" fill="transparent" />
                        </g>
                    ))}
                </svg>

                {/* X-Axis Month Label */}
                <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[10px] font-medium text-slate-400">
                    <span>1 {monthLabel}</span>
                    <span>15 {monthLabel}</span>
                    <span>{points.length} {monthLabel}</span>
                </div>

                {/* HTML Tooltip */}
                {activePoint !== null && (
                    <div
                        className="absolute z-20 bg-[#12131c] border border-orange-500/30 text-white p-3 rounded-xl shadow-[0_10px_25px_rgba(249,115,22,0.3)] pointer-events-none animate-fade-in-up"
                        style={{
                            left: `${points[activePoint].x}%`,
                            top: `${points[activePoint].y}%`,
                            transform: `translate(${points[activePoint].x > 50 ? '-110%' : '10%'}, -110%)`
                        }}
                    >
                        <p className="font-bdo text-[10px] text-orange-300 uppercase tracking-widest mb-1">
                            {points[activePoint].day} {monthLabel}
                        </p>
                        <p className="font-clash text-lg font-bold">
                            {formatRupiahFull(points[activePoint].val)}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Premium Identity Queue ────────────────────────────────────────────────────

function PremiumIdentityQueue({ count }: { count: number }) {
    return (
        <div className="animate-fade-in-up delay-400 bg-white rounded-[24px] p-7 shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
            <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-3">
                    <div className="bg-[#12131c] p-2.5 rounded-xl shadow-[inset_0_-10px_20px_-5px_rgba(249,115,22,0.6)] animate-float">
                        <UserCheck className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                        <h2 className="font-clash text-lg font-medium text-slate-900">Antrean Identitas</h2>
                        <p className="font-bdo text-[11px] font-medium text-slate-500">Menunggu verifikasi</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center py-3">
                <div className="relative group cursor-pointer">
                    <div className="absolute inset-0 bg-orange-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                    <div className="relative bg-gradient-to-b from-slate-50 to-white border border-slate-200 w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500">
                        <span className="font-clash text-4xl font-bold text-slate-900">{count}</span>
                        <span className="font-bdo text-[10px] uppercase font-bold text-slate-400 mt-1">Pending</span>
                    </div>
                </div>
            </div>

            <button className="w-full mt-4 bg-[#12131c] hover:bg-slate-900 text-white font-clash text-sm font-medium py-3.5 rounded-xl shadow-[inset_0_-8px_15px_-5px_rgba(249,115,22,0.4)] transition-all flex items-center justify-center gap-2 group">
                Kelola Antrean
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-orange-400" />
            </button>
        </div>
    );
}

// ── Activity feed ─────────────────────────────────────────────────────────────

const ACTIVITY_ICON: Record<RecentActivity["type"], React.ReactNode> = {
    booking:    <CalendarCheck2 className="w-5 h-5 text-white" />,
    membership: <Users         className="w-5 h-5 text-white" />,
    payment:    <CreditCard    className="w-5 h-5 text-white" />,
};

const ACTIVITY_BAR: Record<RecentActivity["type"], string> = {
    booking:    "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.6)]",
    membership: "bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.6)]",
    payment:    "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]",
};

function ActivityFeed({ items }: { items: RecentActivity[] }) {
    if (items.length === 0) {
        return <p className="py-6 text-center text-sm font-bdo text-gray-400 animate-fade-in-up">Belum ada aktivitas.</p>;
    }

    return (
        <div className="space-y-4">
            {items.map((item, index) => {
                const isFirst = index === 0;
                const animDelay = `delay-[${(index + 1) * 100}ms]`;

                if (isFirst) {
                    return (
                        <div key={`${item.type}-${item.id}`} className={`animate-fade-in-up ${animDelay} bg-[#12131c] p-5 rounded-2xl border border-slate-800 shadow-[inset_0_-15px_30px_-10px_rgba(249,115,22,0.3),_0_10px_20px_rgba(0,0,0,0.2)] relative overflow-hidden group cursor-pointer hover:border-orange-500/50 transition-colors`}>
                            <div className="absolute inset-0 water-caustics-effect opacity-10 pointer-events-none"></div>
                            <div className="flex justify-between items-start mb-5 relative z-10">
                                <div className="flex gap-4">
                                    <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-md border border-white/10 animate-float shadow-lg">
                                        {ACTIVITY_ICON[item.type]}
                                    </div>
                                    <div>
                                        <h3 className="font-clash text-sm font-medium text-white group-hover:text-orange-400 transition-colors">{item.title}</h3>
                                        <p className="font-bdo text-xs font-light text-slate-400 mt-1">{item.subtitle}</p>
                                    </div>
                                </div>
                                <MoreHorizontal className="w-4 h-4 text-slate-500 hover:text-white transition-colors" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-center font-bdo text-[11px] font-bold mb-2.5">
                                    <span className="text-white uppercase tracking-wider">Aktivitas Baru</span>
                                    <span className="text-orange-300 flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 px-2 py-1 rounded-md">{item.time}</span>
                                </div>
                                <div className="w-full bg-slate-800/50 rounded-full h-2.5 overflow-hidden backdrop-blur-sm border border-slate-700/50">
                                    <div className={`h-2.5 rounded-full ${ACTIVITY_BAR[item.type]} w-0 group-hover:w-full transition-all duration-1000 ease-out`} style={{ width: '100%' }}></div>
                                </div>
                            </div>
                        </div>
                    );
                }

                return (
                    <div key={`${item.type}-${item.id}`} className={`animate-fade-in-up ${animDelay} p-5 rounded-2xl border bg-white border-slate-100 hover:border-orange-200 hover:shadow-md transition-all cursor-pointer relative group`}>
                        <div className="flex justify-between items-start mb-5">
                            <div className="flex gap-4">
                                <div className="bg-[#12131c] p-2.5 rounded-xl shadow-[inset_0_-8px_15px_-5px_rgba(249,115,22,0.5)] group-hover:scale-105 transition-transform duration-300">
                                    {ACTIVITY_ICON[item.type]}
                                </div>
                                <div>
                                    <h3 className="font-clash text-sm font-medium text-slate-900">{item.title}</h3>
                                    <p className="font-bdo text-xs font-light text-slate-500 mt-1">{item.subtitle}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center font-bdo text-[11px] font-bold mb-2.5">
                                <span className="text-slate-500 uppercase tracking-wide">Selesai</span>
                                <span className="text-slate-500 flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">{item.time}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                <div className={`h-2.5 rounded-full ${ACTIVITY_BAR[item.type]} shadow-none`} style={{ width: '100%' }}></div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ── Occupancy card ────────────────────────────────────────────────────────────

function OccupancyCard({ facilities }: { facilities: OccupancyFacility[] }) {
    const overall = facilities.length > 0
        ? Math.round(facilities.reduce((sum, f) => sum + f.pct, 0) / facilities.length)
        : 0;

    const dashArray = `${(overall / 100) * 251.3} 251.3`;

    return (
        <div className="bg-white rounded-[24px] p-7 shadow-sm border border-slate-200 animate-fade-in-up delay-300 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-[#12131c] p-2.5 rounded-xl shadow-[inset_0_-10px_20px_-5px_rgba(249,115,22,0.6)] animate-float">
                        <Activity className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                        <h2 className="font-clash text-lg font-medium text-slate-900">Okupansi Lapangan</h2>
                        <p className="font-bdo text-[11px] font-medium text-slate-500">{facilities.length} fasilitas aktif</p>
                    </div>
                </div>
                <span className="rounded-full font-bdo bg-orange-50 px-3 py-1.5 text-[11px] font-bold text-orange-600 border border-orange-100">
                    Hari Ini
                </span>
            </div>

            <div className="flex flex-col items-center">
                <div className="relative w-44 h-44 mb-6 hover:scale-105 transition-transform duration-500 cursor-default">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-xl">
                        <defs>
                            <pattern id="modernStripes" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                                <rect width="3" height="6" fill="#f97316" opacity="0.3" />
                                <rect x="3" width="3" height="6" fill="#fb923c" opacity="0.1" />
                            </pattern>
                            <linearGradient id="shinyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#fb923c" />
                                <stop offset="30%" stopColor="#f97316" />
                                <stop offset="50%" stopColor="#fed7aa" />
                                <stop offset="70%" stopColor="#ea580c" />
                                <stop offset="100%" stopColor="#c2410c" />
                            </linearGradient>
                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>

                        <circle cx="50" cy="50" r="40" fill="none" stroke="#f8fafc" strokeWidth="12" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="url(#modernStripes)" strokeWidth="12" strokeDasharray="251.3 251.3" strokeDashoffset={dashArray} strokeLinecap="butt" className="transition-all duration-1000 ease-out" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="url(#shinyGradient)" strokeWidth="12" strokeDasharray={dashArray} strokeLinecap="round" filter="url(#glow)" className="transition-all duration-1000 ease-out" style={{ animation: 'drawCircle 1.5s ease-out forwards' }} />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in-up delay-500">
                        <span className="font-clash text-3xl font-bold text-slate-900">
                            <ShinyText text={`${overall}%`} speed={4} className="text-slate-900" />
                        </span>
                        <span className="font-bdo text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Okupansi</span>
                    </div>
                </div>

                <div className="w-full space-y-3 bg-slate-50/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-100 shadow-inner">
                    {facilities.length > 0 ? (
                        facilities.map((f, i) => (
                            <div key={f.name} className={`flex items-center justify-between w-full animate-fade-in-up delay-[${(i + 4) * 100}ms] group`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-3.5 h-3.5 rounded-full shadow-sm relative group-hover:scale-125 transition-transform" style={{ backgroundColor: f.color }}>
                                        <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white/60 rounded-full"></div>
                                    </div>
                                    <span className="font-bdo text-[13px] font-medium text-slate-600">{f.name}</span>
                                </div>
                                <span className="font-clash text-[15px] font-medium text-slate-900">{f.pct}%</span>
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Dashboard() {
    const { auth, stats, revenueTrend, dailyRevenue, daysInMonth, currentMonthLabel, occupancyData, recentActivity } = usePage<DashboardProps>().props;
    const firstName = auth.user?.name?.split(" ")[0] ?? "Admin";

    const trendPositive = revenueTrend >= 0;

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4 animate-fade-in-up">
                    {/* HARDWARE-ACCELERATED CSS ANIMATIONS */}
                    <style dangerouslySetInnerHTML={{__html: `
                        .font-clash { font-family: 'Clash Display', sans-serif; }
                        .font-bdo { font-family: 'BDO Grotesk', sans-serif; }

                        /* BLACK SHINY TEXT */
                        @keyframes shinyBlackText {
                            0% { background-position: -200% center; }
                            100% { background-position: 200% center; }
                        }
                        .animate-shiny-black {
                            background: linear-gradient(120deg, #0f172a 35%, #cbd5e1 50%, #0f172a 65%);
                            background-size: 200% auto;
                            color: transparent;
                            -webkit-background-clip: text;
                            background-clip: text;
                            animation: shinyBlackText linear infinite;
                        }

                        /* WHITE SHINY TEXT */
                        @keyframes shinyText {
                            0% { background-position: -200% center; }
                            100% { background-position: 200% center; }
                        }
                        .animate-shiny-text {
                            background: linear-gradient(120deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.4) 100%);
                            background-size: 200% auto;
                            color: transparent;
                            -webkit-background-clip: text;
                            background-clip: text;
                            animation: shinyText linear infinite;
                        }

                        /* Water Caustics Effect */
                        @keyframes caustics {
                            0% { background-position: 0% 50%; opacity: 0.15; }
                            50% { background-position: 100% 50%; opacity: 0.35; }
                            100% { background-position: 0% 50%; opacity: 0.15; }
                        }
                        .water-caustics-effect {
                            background: radial-gradient(circle at top left, rgba(255,255,255,0.3) 0%, transparent 40%),
                                        radial-gradient(circle at bottom right, rgba(255,255,255,0.2) 0%, transparent 50%);
                            background-size: 150% 150%;
                            animation: caustics 8s ease-in-out infinite;
                            mix-blend-mode: overlay;
                        }
                        
                        /* Layout & Element Animations */
                        @keyframes fadeInUp {
                            from { opacity: 0; transform: translate3d(0, 30px, 0); }
                            to { opacity: 1; transform: translate3d(0, 0, 0); }
                        }
                        @keyframes float {
                            0%, 100% { transform: translate3d(0, 0, 0); }
                            50% { transform: translate3d(0, -6px, 0); }
                        }
                        @keyframes pulseGlow {
                            0%, 100% { opacity: 0.4; transform: scale(1) translate3d(0,0,0); }
                            50% { opacity: 1; transform: scale(1.1) translate3d(0,0,0); }
                        }
                        @keyframes drawCircle {
                            from { stroke-dashoffset: 251.3; }
                        }

                        /* Base Classes */
                        .animate-fade-in-up { 
                            animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
                            opacity: 0;
                            will-change: opacity, transform;
                        }
                        .animate-float { 
                            animation: float 3.5s ease-in-out infinite; 
                            will-change: transform;
                        }
                        .animate-pulse-glow { 
                            animation: pulseGlow 2.5s ease-in-out infinite; 
                            will-change: opacity, transform;
                        }

                        /* Delays */
                        .delay-100 { animation-delay: 100ms; }
                        .delay-200 { animation-delay: 200ms; }
                        .delay-300 { animation-delay: 300ms; }
                        .delay-400 { animation-delay: 400ms; }
                        .delay-500 { animation-delay: 500ms; }

                        /* Custom Scrollbar */
                        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                        .custom-scrollbar::-webkit-scrollbar-thumb { background: #fed7aa; border-radius: 4px; }
                    `}} />

                    <span className="font-bdo text-[11px] font-medium tracking-wide text-slate-400">
                        Selamat Datang Kembali, {firstName}
                    </span>
                    <h1 className="font-clash text-3xl font-bold uppercase tracking-tight xl:text-4xl">
                        {/* Judul Hitam Mengkilap/Shiny */}
                        <ShinyTextBlack text="UB Sport System" speed={5} />
                    </h1>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="flex flex-col gap-6 pt-6 pb-20 overflow-x-hidden">

                {/* ══════════════════════════════════════════════════════════
                    ROW 1 — Tiga kolom: Featured Card | Metrics Grid | Chart
                    Layout referensi: Total Balance | 4 Metrics | Profit Chart
                ══════════════════════════════════════════════════════════ */}
                <section className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-stretch">

                    {/* ── Col 1: Featured Revenue Card (seperti Total Balance) ── */}
                    <div className="relative rounded-[28px] overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 p-7 shadow-2xl shadow-orange-200/40 flex flex-col justify-between animate-fade-in-up delay-100 group hover:-translate-y-1 hover:shadow-orange-300/50 transition-all duration-500 min-h-[380px]">
                        {/* Decorative layers */}
                        <div className="absolute inset-0 water-caustics-effect pointer-events-none opacity-50"></div>
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full pointer-events-none"></div>
                        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-orange-400/20 rounded-full pointer-events-none blur-3xl"></div>

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
                            </div>
                        </div>

                        {/* Wallet-style sub-stats list */}
                        <div className="relative z-10 my-5 flex-1 flex flex-col justify-center">
                            <p className="font-bdo text-[10px] font-bold text-orange-200/80 uppercase tracking-widest mb-3">Ringkasan Operasional</p>
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/15 divide-y divide-white/10 overflow-hidden">
                                {[
                                    { label: "Booking Hari Ini", value: String(stats.todaysBookings), Icon: CalendarCheck2 },
                                    { label: "Fasilitas Aktif",  value: String(stats.activeFacilities),  Icon: LayoutGrid },
                                    { label: "Membership Aktif", value: String(stats.activeMemberships), Icon: Users },
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
                            <button className="bg-white text-orange-600 font-clash text-sm font-semibold py-3.5 rounded-xl hover:bg-orange-50 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10">
                                <TrendingUp className="w-4 h-4" />
                                Laporan
                            </button>
                            <button className="bg-white/15 backdrop-blur-md border border-white/30 text-white font-clash text-sm font-semibold py-3.5 rounded-xl hover:bg-white/25 active:scale-95 transition-all flex items-center justify-center gap-2">
                                <Activity className="w-4 h-4" />
                                Analitik
                            </button>
                        </div>
                    </div>

                    {/* ── Col 2: 2×2 Metrics Grid (seperti 4 stat mini cards) ── */}
                    <div className="grid grid-cols-2 gap-4 content-stretch">

                        {/* Booking Hari Ini — Orange gradient */}
                        <div className="relative bg-gradient-to-br from-orange-500 to-red-500 rounded-[20px] p-5 shadow-md hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-200/50 transition-all duration-300 animate-fade-in-up delay-200 flex flex-col justify-between min-h-[160px] overflow-hidden">
                            <div className="absolute inset-0 water-caustics-effect opacity-30 pointer-events-none"></div>
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

                        {/* Membership Aktif — Dark */}
                        <div className="bg-[#12131c] rounded-[20px] p-5 shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-300 animate-fade-in-up delay-200 flex flex-col justify-between min-h-[160px] border border-slate-800/80">
                            <div className="flex justify-between items-start">
                                <div className="bg-orange-500/20 p-2 rounded-xl shadow-[inset_0_-4px_8px_-2px_rgba(249,115,22,0.4)]">
                                    <Users className="w-4 h-4 text-orange-400" />
                                </div>
                                <span className="font-bdo text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-lg">Aktif</span>
                            </div>
                            <div>
                                <p className="font-clash text-[1.9rem] font-bold text-white leading-none">{stats.activeMemberships}</p>
                                <p className="font-bdo text-[11px] font-medium text-slate-400 mt-1.5">Membership Aktif</p>
                            </div>
                        </div>

                        {/* Fasilitas Aktif — Dark */}
                        <div className="bg-[#12131c] rounded-[20px] p-5 shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-300 animate-fade-in-up delay-300 flex flex-col justify-between min-h-[160px] border border-slate-800/80">
                            <div className="flex justify-between items-start">
                                <div className="bg-orange-500/20 p-2 rounded-xl shadow-[inset_0_-4px_8px_-2px_rgba(249,115,22,0.4)]">
                                    <LayoutGrid className="w-4 h-4 text-orange-400" />
                                </div>
                                <span className="font-bdo text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-lg">Online</span>
                            </div>
                            <div>
                                <p className="font-clash text-[1.9rem] font-bold text-white leading-none">{stats.activeFacilities}</p>
                                <p className="font-bdo text-[11px] font-medium text-slate-400 mt-1.5">Fasilitas Aktif</p>
                            </div>
                        </div>

                        {/* Pending Identitas — Orange soft */}
                        <div className="bg-orange-50 border border-orange-100 rounded-[20px] p-5 shadow-md hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-100/80 transition-all duration-300 animate-fade-in-up delay-300 flex flex-col justify-between min-h-[160px]">
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

                    {/* ── Col 3: Revenue Chart (seperti Profit & Loss bar chart) ── */}
                    <div className="animate-fade-in-up delay-400 bg-white rounded-[24px] p-7 shadow-sm border border-slate-200 relative overflow-hidden group flex flex-col min-h-[380px]">
                        <div className="absolute inset-0 bg-gradient-to-b from-orange-50/40 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                        {/* Chart Header */}
                        <div className="mb-4 flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#12131c] p-2.5 rounded-xl shadow-[inset_0_-10px_20px_-5px_rgba(249,115,22,0.6),_0_5px_15px_rgba(0,0,0,0.1)] group-hover:scale-105 transition-transform duration-300 animate-float">
                                    <TrendingUp className="w-5 h-5 text-orange-400" />
                                </div>
                                <div>
                                    <h2 className="font-clash text-lg font-medium text-slate-900">
                                        <SplitText text="Grafik Pendapatan" delay={500} />
                                    </h2>
                                    <p className="font-bdo text-[10px] font-medium text-slate-400 mt-0.5 uppercase tracking-wider">
                                        Total per hari · Klik titik di grafik
                                    </p>
                                </div>
                            </div>
                            <span className={cn(
                                "flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-bdo text-[11px] font-bold shadow-sm cursor-default",
                                trendPositive
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                    : "bg-rose-50 text-rose-600 border border-rose-100"
                            )}>
                                {trendPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {Math.abs(revenueTrend)}% vs bulan lalu
                            </span>
                        </div>

                        {/* Inject Custom SVG Chart */}
                        <div className="flex-1 relative z-10">
                            <InteractiveRevenueChart data={dailyRevenue} monthLabel={currentMonthLabel} />
                        </div>
                    </div>

                </section>

                {/* ══════════════════════════════════════════════════════════
                    ROW 2 — Dua kolom: Left Stack | Activity Feed
                    Layout referensi: Spending Limit+Cards | Recent Activities
                ══════════════════════════════════════════════════════════ */}
                <section className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] items-start">

                    {/* ── Left: OccupancyCard + Identity Queue stacked ── */}
                    <div className="flex flex-col gap-6">
                        <OccupancyCard facilities={occupancyData ?? []} />
                        <PremiumIdentityQueue count={stats.pendingIdentities} />
                    </div>

                    {/* ── Right: Activity Feed (seperti Recent Activities table) ── */}
                    <div className="animate-fade-in-up delay-500 bg-white rounded-[24px] p-7 shadow-sm border border-slate-200 flex flex-col">
                        {/* Header */}
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#12131c] p-2.5 rounded-xl shadow-[inset_0_-8px_15px_-5px_rgba(249,115,22,0.6)] animate-float">
                                    <LayoutGrid className="w-5 h-5 text-orange-400" />
                                </div>
                                <div>
                                    <h2 className="font-clash text-lg font-medium text-slate-900">
                                        <SplitText text="Aktivitas Terbaru" delay={600} />
                                    </h2>
                                    <p className="font-bdo text-[11px] font-medium text-slate-400 mt-0.5">Riwayat kegiatan sistem secara real-time</p>
                                </div>
                            </div>
                            <span className="font-bdo text-[11px] font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100 uppercase tracking-wide">
                                Live Feed
                            </span>
                        </div>

                        {/* Feed */}
                        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                            <ActivityFeed items={recentActivity ?? []} />
                        </div>
                    </div>

                </section>

            </div>
        </AdminLayout>
    );
}