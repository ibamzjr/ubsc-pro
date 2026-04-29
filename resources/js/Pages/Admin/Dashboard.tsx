import { Head, usePage } from "@inertiajs/react";
import { Activity, CalendarCheck2, TrendingUp, Users, Wallet } from "lucide-react";
import IdentityQueueCard from "@/Components/Admin/IdentityQueueCard";
import RevenueChart from "@/Components/Admin/RevenueChart";
import StatCard from "@/Components/Admin/StatCard";
import { ADMIN_TOKENS } from "@/Components/Admin/tokens";
import AdminLayout from "@/Layouts/AdminLayout";
import { PageProps } from "@/types";

interface DashboardStats {
    pendingIdentities: number;
    activeFacilities: number;
    todaysBookings: number;
    totalRevenue: number;
    activeMemberships: number;
}

type DashboardProps = PageProps<{ stats: DashboardStats }>;

function formatRevenue(amount: number): string {
    if (amount >= 1_000_000) {
        return `${(amount / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })}JT`;
    }
    if (amount >= 1_000) {
        return `${(amount / 1_000).toLocaleString("id-ID", { maximumFractionDigits: 0 })}rb`;
    }
    return amount.toLocaleString("id-ID");
}

// 30 daily revenue values for April (thousands IDR) — sums to ~15,390
const DASHBOARD_DAILY = [
    420, 480, 350, 560, 600, 570, 490,
    440, 510, 580, 450, 500, 560, 590,
    420, 460, 630, 650, 530, 460,
    440, 500, 560, 610, 550, 480, 430,
    500, 570, 500,
];

const OCCUPANCY_FACILITIES = [
    { name: "Futsal A",    pct: 92, color: "#3b82f6" },
    { name: "Futsal B",    pct: 87, color: "#8b5cf6" },
    { name: "Basket",      pct: 78, color: "#10b981" },
    { name: "Tennis 1",    pct: 74, color: "#f59e0b" },
    { name: "Badminton 1", pct: 68, color: "#ef4444" },
    { name: "Badminton 2", pct: 53, color: "#6b7280" },
];

function OccupancyCard() {
    const overall = 82;
    const stops = `#10b981 0% ${overall}%, #e5e7eb ${overall}% 100%`;

    return (
        <div
            className={`${ADMIN_TOKENS.CARD_LARGE} flex flex-col gap-5 p-6`}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50">
                        <Activity size={16} className="text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="font-clash text-sm font-medium text-gray-900">
                            Okupansi Lapangan
                        </h2>
                        <p className="text-[11px] text-gray-400">
                            6 fasilitas aktif
                        </p>
                    </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                    Apr 2026
                </span>
            </div>

            {/* Occupancy ring */}
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

            {/* Per-facility bars */}
            <ul className="flex flex-col gap-3">
                {OCCUPANCY_FACILITIES.map((f) => (
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
                                style={{
                                    width: `${f.pct}%`,
                                    backgroundColor: f.color,
                                }}
                            />
                        </div>
                    </li>
                ))}
            </ul>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-1 text-xs text-gray-400">
                <span>Rata-rata keseluruhan</span>
                <span className="font-clash font-medium text-gray-700">
                    {overall}%
                </span>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { auth, stats } = usePage<DashboardProps>().props;
    const firstName = auth.user?.name?.split(" ")[0] ?? "Admin";
    const primaryRole = auth.user?.role ?? "Staff";

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
                        gradient={ADMIN_TOKENS.STAT_GRADIENT_PURPLE}
                        badge="Sekarang"
                    />
                </section>

                {/* ── Revenue Trend Chart ── */}
                <section className={`${ADMIN_TOKENS.CARD_LARGE} p-6`}>
                    <div className="mb-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50">
                                <TrendingUp
                                    size={16}
                                    className="text-emerald-600"
                                />
                            </div>
                            <div>
                                <h2 className="font-clash text-sm font-medium text-gray-900">
                                    Grafik Pendapatan Harian
                                </h2>
                                <p className="text-[11px] text-gray-400">
                                    Total pendapatan per hari — April 2026
                                </p>
                            </div>
                        </div>
                        <span className="hidden rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-600 md:block">
                            {primaryRole}
                        </span>
                    </div>
                    <RevenueChart data={DASHBOARD_DAILY} color="#10b981" />
                </section>

                {/* ── Bottom 2-col: Identity Queue + Occupancy ── */}
                <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                    <IdentityQueueCard />
                    <OccupancyCard />
                </section>
            </div>
        </AdminLayout>
    );
}
