import { Head, usePage } from "@inertiajs/react";
import {
    BadgeCheck,
    CalendarCheck2,
    Dumbbell,
    Sparkles,
} from "lucide-react";
import DoughnutPlaceholder from "@/Components/Admin/DoughnutPlaceholder";
import IdentityQueueCard from "@/Components/Admin/IdentityQueueCard";
import StatCard from "@/Components/Admin/StatCard";
import { ADMIN_TOKENS } from "@/Components/Admin/tokens";
import AdminLayout from "@/Layouts/AdminLayout";
import { PageProps } from "@/types";

interface DashboardStats {
    pendingIdentities: number;
    activeFacilities: number;
    todaysBookings: number | null;
}

type DashboardProps = PageProps<{ stats: DashboardStats }>;

export default function Dashboard() {
    const { stats, auth } = usePage<DashboardProps>().props;
    const firstName = auth.user?.name?.split(" ")[0] ?? "Admin";
    const primaryRole = auth.roles[0] ?? "Staff";

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
                <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    <StatCard
                        icon={BadgeCheck}
                        label="Pending Identities"
                        value={stats.pendingIdentities}
                        caption="Awaiting Staff Front Officer review"
                        gradient={ADMIN_TOKENS.STAT_GRADIENT_ORANGE}
                        badge="Live"
                    />
                    <StatCard
                        icon={Dumbbell}
                        label="Active Facilities"
                        value={stats.activeFacilities}
                        caption="Visible on the public landing page"
                        gradient={ADMIN_TOKENS.STAT_GRADIENT_BLUE}
                        badge="Live"
                    />
                    <StatCard
                        icon={CalendarCheck2}
                        label="Today's Bookings"
                        value={stats.todaysBookings ?? "—"}
                        caption="Booking module ships in next PRD"
                        gradient={ADMIN_TOKENS.STAT_GRADIENT_PURPLE}
                        badge="Soon"
                    />
                </section>

                <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
                    <div className="xl:col-span-8">
                        <IdentityQueueCard />
                    </div>
                    <div className="xl:col-span-4">
                        <DoughnutPlaceholder />
                    </div>
                </section>

                <section
                    className={`relative overflow-hidden p-6 ${ADMIN_TOKENS.CARD_LARGE}`}
                >
                    <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-900 text-white">
                            <Sparkles size={18} />
                        </div>
                        <div className="flex-1">
                            <h2 className="font-clash text-base font-medium text-gray-900">
                                Booking calendar — coming soon
                            </h2>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                The weekly booking calendar lands once the
                                booking schema is approved. For now, this card
                                is a placeholder for the future Gantt-style
                                facility schedule.
                            </p>
                            <div className="mt-4 grid grid-cols-5 gap-2">
                                {["MON", "TUE", "WED", "THU", "FRI"].map(
                                    (day, idx) => (
                                        <div
                                            key={day}
                                            className="rounded-2xl bg-gray-50 p-3"
                                        >
                                            <div className="font-clash text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                                {day}
                                            </div>
                                            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600"
                                                    style={{
                                                        width: `${20 + idx * 12}%`,
                                                    }}
                                                />
                                            </div>
                                            <div className="mt-2 text-[10px] text-gray-400">
                                                {`Apr ${8 + idx}`}
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                        <span className="hidden rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-600 md:inline-block">
                            Logged in as {primaryRole}
                        </span>
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}
