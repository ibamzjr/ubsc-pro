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
} from "lucide-react";
import { useState } from "react";
import RevenueChart from "@/Components/Admin/RevenueChart";
import StatCard from "@/Components/Admin/StatCard";
import { ADMIN_TOKENS } from "@/Components/Admin/tokens";
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
        return `Rp ${(amount / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })}JT`;
    }
    return `Rp ${amount.toLocaleString("id-ID")}`;
}

const MONTH_NAMES = [
    "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

// ── Finance Doughnut ──────────────────────────────────────────────────────────

interface DoughnutSegment {
    name: string;
    value: number;  // percentage (0–100)
    color: string;
    displayValue: string;
}

function FinanceDoughnut({
    segments,
    centerValue,
    centerSub,
}: {
    segments: DoughnutSegment[];
    centerValue: string;
    centerSub: string;
}) {
    const total = segments.reduce((sum, s) => sum + s.value, 0);
    let cumulative = 0;
    const stops = segments
        .map((s) => {
            const start = (cumulative / total) * 100;
            cumulative += s.value;
            const end = (cumulative / total) * 100;
            return `${s.color} ${start.toFixed(1)}% ${end.toFixed(1)}%`;
        })
        .join(", ");

    return (
        <div className="flex flex-col items-center gap-6">
            {/* Ring */}
            <div className="relative h-40 w-40 shrink-0">
                <div
                    className="h-full w-full rounded-full"
                    style={{ background: `conic-gradient(${stops})` }}
                />
                <div className="absolute inset-[18px] flex flex-col items-center justify-center rounded-full bg-white shadow-[0_4px_20px_rgb(0,0,0,0.06)]">
                    <span className="font-monument text-lg font-normal leading-tight text-gray-900">
                        {centerValue}
                    </span>
                    <span className="mt-0.5 text-[10px] uppercase tracking-wide text-gray-400">
                        {centerSub}
                    </span>
                </div>
            </div>

            {/* Legend */}
            <ul className="w-full space-y-2.5">
                {segments.map((seg) => (
                    <li key={seg.name} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-600">
                            <span
                                className="h-2.5 w-2.5 shrink-0 rounded-full"
                                style={{ backgroundColor: seg.color }}
                            />
                            {seg.name}
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="font-clash text-xs font-medium text-gray-900">
                                {seg.displayValue}
                            </span>
                            <span className="w-7 text-right text-[11px] text-gray-400">
                                {seg.value}%
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// ── Facility Breakdown List ───────────────────────────────────────────────────

function FacilityRow({
    color,
    name,
    share,
    valueLabel,
}: {
    color: string;
    name: string;
    share: number;
    valueLabel: string;
}) {
    return (
        <li className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium text-gray-800">
                    <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: color }}
                    />
                    {name}
                </span>
                <div className="flex items-center gap-3">
                    <span className="font-clash text-sm font-medium text-gray-900">
                        {valueLabel}
                    </span>
                    <span className="w-8 text-right text-[11px] text-gray-400">
                        {share}%
                    </span>
                </div>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${share}%`, backgroundColor: color }}
                />
            </div>
        </li>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

type DetailTab = "revenue" | "bookings";

export default function FinanceIndex() {
    const { facilityRevenue, facilityBookings, dailyRevenue, stats, period, revenueTrend, recentTransactions } =
        usePage<FinanceProps>().props;

    const trendPositive = revenueTrend >= 0;

    const [activeTab, setActiveTab] = useState<DetailTab>("revenue");

    const periodLabel = `${MONTH_NAMES[period.month] ?? ""} ${period.year}`;

    const peakRevenue = Math.max(...dailyRevenue, 0);
    const peakLabel   = peakRevenue > 0
        ? `Rp ${(peakRevenue).toLocaleString("id-ID")}rb`
        : undefined;

    const totalRevenueLabel = formatRevenue(stats.totalRevenue);
    const totalBookingsLabel = stats.totalBookings.toLocaleString("id-ID");
    const totalFacilityRevenue = facilityRevenue.reduce((s, f) => s + f.revenue, 0);
    const totalFacilityBookings = facilityBookings.reduce((s, f) => s + f.count, 0);

    const revenueDoughnutSegments: DoughnutSegment[] = facilityRevenue.map((f) => ({
        name: f.name,
        value: f.share,
        color: f.color,
        displayValue: formatRevenue(f.revenue),
    }));

    const bookingDoughnutSegments: DoughnutSegment[] = facilityBookings.map((f) => ({
        name: f.name,
        value: f.share,
        color: f.color,
        displayValue: `${f.count} booking`,
    }));

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4">
                    <span className="font-clash text-xs uppercase tracking-[0.2em] text-gray-400">
                        Laporan Keuangan
                    </span>
                    <div className="flex items-center justify-between gap-4">
                        <h1 className="font-monument text-3xl font-normal tracking-tight text-gray-900">
                            Finance & Analytics
                        </h1>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => router.get(route("admin.finance.export", { month: period.month, year: period.year }))}
                                className="flex shrink-0 items-center gap-2 rounded-2xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                            >
                                <Download size={14} />
                                Export PDF
                            </button>
                            <button
                                type="button"
                                className="flex shrink-0 items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-[0_2px_8px_rgb(0,0,0,0.04)] transition-colors hover:bg-gray-50"
                            >
                                <CalendarDays size={15} className="text-gray-400" />
                                <span>{periodLabel}</span>
                                <ChevronDown size={14} className="text-gray-400" />
                            </button>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Finance & Analytics" />

            <div className="flex flex-col gap-6 pt-6">

                {/* ── KPI Stat Cards ── */}
                <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    <div className="relative">
                        <StatCard
                            icon={Wallet}
                            label="Total Pendapatan"
                            value={totalRevenueLabel}
                            caption={`${periodLabel}`}
                            gradient="bg-gradient-to-br from-emerald-400 via-green-500 to-teal-700"
                            badge={periodLabel}
                        />
                        {/* Revenue trend overlay badge */}
                        <span className={cn(
                            "absolute bottom-5 right-5 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                            trendPositive
                                ? "bg-white/20 text-white"
                                : "bg-rose-900/40 text-rose-200",
                        )}>
                            {trendPositive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                            {Math.abs(revenueTrend)}%
                        </span>
                    </div>
                    <StatCard
                        icon={BarChart3}
                        label="Jumlah Reservasi"
                        value={totalBookingsLabel}
                        caption={`Total booking bulan ini`}
                        gradient={ADMIN_TOKENS.STAT_GRADIENT_BLUE}
                        badge={periodLabel}
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Membership Aktif"
                        value={String(stats.activeMemberships)}
                        caption="Member gym terdaftar"
                        gradient={ADMIN_TOKENS.STAT_GRADIENT_PURPLE}
                        badge={periodLabel}
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
                                    Total pendapatan per hari (dalam ribuan IDR)
                                </p>
                            </div>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                            {periodLabel}
                        </span>
                    </div>
                    <RevenueChart
                        data={dailyRevenue}
                        color="#10b981"
                        peakLabel={peakLabel}
                    />
                </section>

                {/* ── Detail Tab Section ── */}
                <section className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center rounded-2xl bg-gray-100 p-1">
                            <button
                                type="button"
                                onClick={() => setActiveTab("revenue")}
                                className={cn(
                                    "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all",
                                    activeTab === "revenue"
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700",
                                )}
                            >
                                <Wallet size={14} />
                                Detail Pendapatan
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab("bookings")}
                                className={cn(
                                    "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all",
                                    activeTab === "bookings"
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700",
                                )}
                            >
                                <BarChart3 size={14} />
                                Detail Reservasi
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                        {/* Left: Facility breakdown */}
                        <div className={`${ADMIN_TOKENS.CARD_LARGE} p-6`}>
                            <div className="mb-5 flex items-center justify-between">
                                <h3 className="font-clash text-sm font-medium text-gray-900">
                                    {activeTab === "revenue"
                                        ? "Pendapatan per Fasilitas"
                                        : "Reservasi per Fasilitas"}
                                </h3>
                                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-500">
                                    {periodLabel}
                                </span>
                            </div>

                            <ul className="flex flex-col gap-4">
                                {activeTab === "revenue"
                                    ? facilityRevenue.map((f) => (
                                          <FacilityRow
                                              key={f.name}
                                              color={f.color}
                                              name={f.name}
                                              share={f.share}
                                              valueLabel={formatRevenue(f.revenue)}
                                          />
                                      ))
                                    : facilityBookings.map((f) => (
                                          <FacilityRow
                                              key={f.name}
                                              color={f.color}
                                              name={f.name}
                                              share={f.share}
                                              valueLabel={`${f.count} booking`}
                                          />
                                      ))}
                            </ul>

                            <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                                <span className="text-sm text-gray-500">Total</span>
                                <span className="font-clash font-semibold text-gray-900">
                                    {activeTab === "revenue"
                                        ? formatRevenue(totalFacilityRevenue)
                                        : `${totalFacilityBookings.toLocaleString("id-ID")} booking`}
                                </span>
                            </div>
                        </div>

                        {/* Right: Doughnut */}
                        <div className={`${ADMIN_TOKENS.CARD_LARGE} p-6`}>
                            <div className="mb-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gray-900 text-white">
                                        <PieChart size={15} />
                                    </div>
                                    <h3 className="font-clash text-sm font-medium text-gray-900">
                                        {activeTab === "revenue"
                                            ? "Distribusi Pendapatan"
                                            : "Distribusi Reservasi"}
                                    </h3>
                                </div>
                                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-500">
                                    {facilityRevenue.length} Fasilitas
                                </span>
                            </div>

                            {facilityRevenue.length === 0 ? (
                                <p className="py-12 text-center text-sm text-gray-400">
                                    Belum ada data transaksi bulan ini.
                                </p>
                            ) : activeTab === "revenue" ? (
                                <FinanceDoughnut
                                    segments={revenueDoughnutSegments}
                                    centerValue={formatRevenue(totalFacilityRevenue)}
                                    centerSub="pendapatan"
                                />
                            ) : (
                                <FinanceDoughnut
                                    segments={bookingDoughnutSegments}
                                    centerValue={totalFacilityBookings.toLocaleString("id-ID")}
                                    centerSub="reservasi"
                                />
                            )}
                        </div>
                    </div>
                </section>

                {/* ── Recent PAID Transactions ── */}
                <section className={`${ADMIN_TOKENS.CARD_LARGE} p-6`}>
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50">
                            <CreditCard size={15} className="text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="font-clash text-sm font-medium text-gray-900">
                                Transaksi Terakhir
                            </h2>
                            <p className="text-[11px] text-gray-400">5 pembayaran lunas terbaru</p>
                        </div>
                    </div>

                    {recentTransactions.length === 0 ? (
                        <p className="py-6 text-center text-sm text-gray-400">
                            Belum ada transaksi lunas.
                        </p>
                    ) : (
                        <ul className="divide-y divide-gray-50">
                            {recentTransactions.map((tx) => (
                                <li key={tx.id} className="flex items-center justify-between gap-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                                            <CreditCard size={13} className="text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {tx.user_name}
                                            </p>
                                            <p className="text-[11px] text-gray-400">
                                                {tx.type || "Transaksi"} · {tx.paid_at}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="font-clash text-sm font-semibold text-gray-900">
                                        Rp {tx.amount.toLocaleString("id-ID")}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

            </div>
        </AdminLayout>
    );
}
