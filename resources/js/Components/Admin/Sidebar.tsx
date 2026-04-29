import { Link } from "@inertiajs/react";
import {
    Award,
    BadgeCheck,
    BarChart3,
    CalendarCheck2,
    CalendarRange,
    Dumbbell,
    Film,
    HelpCircle,
    ImagePlus,
    LayoutDashboard,
    LogOut,
    MessageSquare,
    Newspaper,
    ShieldCheck,
    UserCog,
    Users2,
    X,
} from "lucide-react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { cn } from "@/lib/utils";
import SidebarGroup from "./SidebarGroup";
import SidebarNavLink from "./SidebarNavLink";

interface SidebarProps {
    mobileOpen: boolean;
    onClose: () => void;
}

function isCurrent(name: string): boolean {
    if (typeof window === "undefined") return false;
    try {
        return route().current(name) ?? false;
    } catch {
        return false;
    }
}

function safeRoute(name: string): string | undefined {
    try {
        return route(name);
    } catch {
        return undefined;
    }
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
    const dashboardActive = isCurrent("admin.dashboard");
    const identityActive = isCurrent("admin.identity.*");
    const facilitiesActive = isCurrent("admin.facilities.*");
    const bookingsActive = isCurrent("admin.bookings.*");
    const newsActive = isCurrent("admin.news.*");
    const promoActive = isCurrent("admin.promo.*");
    const sponsorsActive = isCurrent("admin.sponsors.*");
    const reelsActive = isCurrent("admin.reels.*");
    const testimonialsActive = isCurrent("admin.testimonials.*");
    const membershipsActive = isCurrent("admin.memberships.*");
    const financeActive = isCurrent("admin.finance.*");
    const schedulesActive = isCurrent("admin.settings.schedules");
    const rolesActive = isCurrent("admin.settings.roles");
    const usersActive = isCurrent("admin.settings.users*");

    return (
        <>
            {/* Mobile backdrop */}
            <div
                onClick={onClose}
                className={cn(
                    "fixed inset-0 z-30 bg-black/40 backdrop-blur-sm transition-opacity duration-200 xl:hidden",
                    mobileOpen
                        ? "opacity-100"
                        : "pointer-events-none opacity-0",
                )}
                aria-hidden="true"
            />

            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-white transition-transform duration-300 ease-out",
                    "xl:sticky xl:top-0 xl:h-screen xl:w-64 xl:translate-x-0",
                    mobileOpen ? "translate-x-0" : "-translate-x-full",
                )}
                aria-label="Admin sidebar"
            >
                <div className="flex h-16 items-center justify-between px-6">
                    <Link href="/" className="flex items-center gap-2">
                        <img
                            src="/UBSC PRO.png"
                            alt="UBSC Logo"
                            className="h-16 w-auto"
                        />
                    </Link>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl p-2 text-gray-500 hover:bg-gray-100 xl:hidden"
                        aria-label="Close sidebar"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="border-b border-gray-100" />

                <nav className="flex-1 overflow-y-auto px-3 py-4">
                    <SidebarGroup label="Main">
                        <SidebarNavLink
                            icon={LayoutDashboard}
                            label="Dashboard"
                            href={safeRoute("admin.dashboard")}
                            active={dashboardActive}
                        />
                        <SidebarNavLink
                            icon={BadgeCheck}
                            label="Identity Queue"
                            href={safeRoute("admin.identity.index")}
                            active={identityActive}
                        />
                        <SidebarNavLink
                            icon={Dumbbell}
                            label="Facilities"
                            href={safeRoute("admin.facilities.index")}
                            active={facilitiesActive}
                        />
                        <SidebarNavLink
                            icon={CalendarCheck2}
                            label="Bookings"
                            href={safeRoute("admin.bookings.index")}
                            active={bookingsActive}
                            badge="Preview"
                        />
                        <SidebarNavLink
                            icon={Users2}
                            label="Memberships"
                            href={safeRoute("admin.memberships.index")}
                            active={membershipsActive}
                        />
                        <SidebarNavLink
                            icon={BarChart3}
                            label="Finance"
                            href={safeRoute("admin.finance.index")}
                            active={financeActive}
                            badge="Preview"
                        />
                    </SidebarGroup>

                    <SidebarGroup label="Content">
                        <SidebarNavLink
                            icon={Newspaper}
                            label="News"
                            href={safeRoute("admin.news.index")}
                            active={newsActive}
                        />
                        <SidebarNavLink
                            icon={ImagePlus}
                            label="Promo"
                            href={safeRoute("admin.promo.index")}
                            active={promoActive}
                        />
                        <SidebarNavLink
                            icon={Award}
                            label="Sponsors"
                            href={safeRoute("admin.sponsors.index")}
                            active={sponsorsActive}
                        />
                        <SidebarNavLink
                            icon={Film}
                            label="Reels"
                            href={safeRoute("admin.reels.index")}
                            active={reelsActive}
                        />
                        <SidebarNavLink
                            icon={MessageSquare}
                            label="Testimonials"
                            href={safeRoute("admin.testimonials.index")}
                            active={testimonialsActive}
                        />
                    </SidebarGroup>

                    <SidebarGroup label="Settings">
                        <SidebarNavLink
                            icon={CalendarRange}
                            label="Schedule Control"
                            href={safeRoute("admin.settings.schedules")}
                            active={schedulesActive}
                        />
                        <SidebarNavLink
                            icon={ShieldCheck}
                            label="Role & Access"
                            href={safeRoute("admin.settings.roles")}
                            active={rolesActive}
                        />
                        <SidebarNavLink
                            icon={UserCog}
                            label="Internal Users"
                            href={safeRoute("admin.settings.users")}
                            active={usersActive}
                        />
                    </SidebarGroup>

                    <SidebarGroup label="Other">
                        <SidebarNavLink
                            icon={HelpCircle}
                            label="Help"
                            disabled
                        />
                    </SidebarGroup>
                </nav>

                <div className="border-t border-gray-100 p-3">
                    <SidebarNavLink
                        icon={LogOut}
                        label="Log out"
                        href={safeRoute("logout")}
                        method="post"
                        as="button"
                    />
                </div>
            </aside>
        </>
    );
}
