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
} from "lucide-react";
import IdentityQueueCard from "@/Components/Admin/IdentityQueueCard";
import RevenueChart from "@/Components/Admin/RevenueChart";
import StatCard from "@/Components/Admin/StatCard";
import { ADMIN_TOKENS } from "@/Components/Admin/tokens";
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


// ── Activity feed ─────────────────────────────────────────────────────────────

const ACTIVITY_ICON: Record<RecentActivity["type"], React.ReactNode> = {
    booking:    <CalendarCheck2 size={14} className="text-blue-500" />,
    membership: <Users         size={14} className="text-purple-500" />,
    payment:    <CreditCard    size={14} className="text-emerald-500" />,
};

const ACTIVITY_DOT: Record<RecentActivity["type"], string> = {
    booking:    "bg-blue-500",
    membership: "bg-purple-500",
    payment:    "bg-emerald-500",
};

function ActivityFeed({ items }: { items: RecentActivity[] }) {
    if (items.length === 0) {
        return (
            <p className="py-6 text-center text-sm text-gray-400">
                Belum ada aktivitas terbaru.
            </p>
        );
    }

    return (
        <ul className="flex flex-col divide-y divide-gray-50">
            {items.map((item) => (
                <li key={`${item.type}-${item.id}`} className="flex items-start gap-3 py-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gray-50">
                        {ACTIVITY_ICON[item.type]}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 leading-snug">
                            {item.title}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-gray-500">
                            {item.subtitle}
                        </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                        <span
                            className={cn(
                                "mt-1 h-1.5 w-1.5 rounded-full",
                                ACTIVITY_DOT[item.type],
                            )}
                        />
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">
                            {item.time}
                        </span>
                    </div>
                </li>
            ))}
        </ul>
    );
}

// ── Occupancy card ─────────────────────────────────────────────────────────────

function OccupancyCard({ facilities }: { facilities: OccupancyFacility[] }) {
    const overall = facilities.length > 0
        ? Math.round(facilities.reduce((sum, f) => sum + f.pct, 0) / facilities.length)
        : 0;
    const stops = `#10b981 0% ${overall}%, #e5e7eb ${overall}% 100%`;

    return (
        <div className={`${ADMIN_TOKENS.CARD_LARGE} flex flex-col gap-5 p-6`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50">
                        <Activity size={16} className="text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="font-clash text-sm font-medium text-gray-900">
                            Okupansi Lapangan
                        </h2>
                        <p className="text-[11px] text-gray-400">{facilities.length} fasilitas aktif</p>
                    </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                    Hari Ini
                </span>
            </div>

            <div className="relative mx-auto h-36 w-36 shrink-0">
                <div
                    className="h-full w-full rounded-full"
                    style={{ background: `conic-gradient(${stops})` }}
                />
                <div className="absolute inset-[16px] flex flex-col items-center justify-center rounded-full bg-white shadow-[0_4px_20px_rgb(0,0,0,0.06)]">
                    <span className="font-monument text-2xl font-normal leading-tight text-gray-900">
                        {overall}%
                    </span>
                    <span className="mt-0.5 text-[10px] uppercase tracking-wide text-gray-400">
                        Okupansi
                    </span>
                </div>
            </div>

            {facilities.length > 0 ? (
                <ul className="flex flex-col gap-3">
                    {facilities.map((f) => (
                        <li key={f.name} className="flex flex-col gap-1">
                            <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-1.5 text-gray-600">
                                    <span
                                        className="h-2 w-2 shrink-0 rounded-full"
                                        style={{ backgroundColor: f.color }}
                                    />
                                    {f.name}
                                </span>
                                <span className="font-clash font-medium text-gray-700">
                                    {f.pct}%
                                </span>
                            </div>
                            <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{ width: `${f.pct}%`, backgroundColor: f.color }}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="py-2 text-center text-sm text-gray-400">Belum ada fasilitas aktif.</p>
            )}

            <div className="flex items-center justify-between border-t border-gray-100 pt-1 text-xs text-gray-400">
                <span>Rata-rata keseluruhan</span>
                <span className="font-clash font-medium text-gray-700">{overall}%</span>
            </div>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Dashboard() {
    const { auth, stats, revenueTrend, dailyRevenue, daysInMonth, currentMonthLabel, occupancyData, recentActivity } = usePage<DashboardProps>().props;
    const firstName  = auth.user?.name?.split(" ")[0] ?? "Admin";
    const primaryRole = auth.user?.role ?? "Staff";

    const trendPositive = revenueTrend >= 0;

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4">
                    <span className="font-clash text-xs uppercase tracking-[0.2em] text-gray-400">
                        Welcome back, {firstName}
                    </span>
                    <h1 className="font-monument text-3xl font-normal tracking-tight text-gray-900 xl:text-4xl">
                        UBSC Control Hub
                    </h1>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="flex flex-col gap-6 pt-6">
                {/* ── KPI Stat Cards ── */}
                <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    <StatCard
                        icon={Wallet}
                        label="Total Pendapatan"
                        value={formatRevenue(stats.totalRevenue)}
                        caption="Pendapatan bulan ini"
                        gradient="bg-gradient-to-br from-emerald-400 via-green-500 to-teal-700"
                        badge="Bulan ini"
                    />
                    <StatCard
                        icon={CalendarCheck2}
                        label="Booking Hari Ini"
                        value={String(stats.todaysBookings)}
                        caption={`${stats.activeFacilities} fasilitas aktif`}
                        gradient={ADMIN_TOKENS.STAT_GRADIENT_BLUE}
                        badge="Hari ini"
                    />
                    <StatCard
                        icon={Users}
                        label="Membership (Gym)"
                        value={`${stats.activeMemberships} Aktif`}
                        caption={`${stats.pendingIdentities} identitas pending`}
                        gradient="bg-gradient-to-br from-purple-500 via-indigo-600 to-purple-800"
                        badge="Sekarang"
                    />
                </section>

                {/* ── Revenue Trend Chart ── */}
                <section className={`${ADMIN_TOKENS.CARD_LARGE} p-6`}>
                    <div className="mb-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50">
                                <TrendingUp size={16} className="text-emerald-600" />
                            </div>
                            <div>
                                <h2 className="font-clash text-sm font-medium text-gray-900">
                                    Grafik Pendapatan Harian
                                </h2>
                                <p className="text-[11px] text-gray-400">
                                    Total pendapatan per hari — bulan ini
                                </p>
                            </div>
                        </div>

                        {/* Revenue trend badge */}
                        <div className="flex items-center gap-2">
                            <span
                                className={cn(
                                    "flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium",
                                    trendPositive
                                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
                                        : "bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-200",
                                )}
                            >
                                {trendPositive
                                    ? <ArrowUpRight size={12} />
                                    : <ArrowDownRight size={12} />
                                }
                                {Math.abs(revenueTrend)}% vs bulan lalu
                            </span>
                            <span className="hidden rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-600 md:block">
                                {primaryRole}
                            </span>
                        </div>
                    </div>
                    <RevenueChart
                        data={dailyRevenue ?? []}
                        color="#10b981"
                        currentMonth={currentMonthLabel}
                        daysInMonth={daysInMonth}
                    />
                </section>

                {/* ── Bottom 3-col: Occupancy + Identity Queue + Activity Feed ── */}
                <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                    <OccupancyCard facilities={occupancyData ?? []} />
                    <IdentityQueueCard count={stats.pendingIdentities} />

                    {/* ── Recent Activity Feed ── */}
                    <div className={`${ADMIN_TOKENS.CARD_LARGE} flex flex-col p-6`}>
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gray-100">
                                <LayoutGrid size={15} className="text-gray-600" />
                            </div>
                            <div>
                                <h2 className="font-clash text-sm font-medium text-gray-900">
                                    Aktivitas Terbaru
                                </h2>
                                <p className="text-[11px] text-gray-400">
                                    Reservasi, member & pembayaran
                                </p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <ActivityFeed items={recentActivity ?? []} />
                        </div>
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}
