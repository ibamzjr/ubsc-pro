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
    Package,
    ShieldCheck,
    UserCog,
    Users2,
    X,
} from "lucide-react";
import React from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { cn } from "@/lib/utils";

// ── Inlined Premium Components ───────────────────────────────────────────────
// (Digabungkan langsung ke sini agar efek visual SaaS bisa dikontrol 100% 
// tanpa merusak file komponen eksternal)

const SidebarGroup = ({ label, children, delay }: { label: string, children: React.ReactNode, delay: string }) => (
    <div className={`mb-6 animate-fade-in-up ${delay}`}>
        <h4 className="px-3 mb-2 font-bdo text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            {label}
        </h4>
        <div className="flex flex-col gap-1.5">
            {children}
        </div>
    </div>
);

const SidebarNavLink = ({
    icon: Icon,
    label,
    href,
    active,
    badge,
    disabled,
    method,
    as
}: any) => {
    const isLogout = label.toLowerCase().includes("log out");

    const content = (
        <>
            <Icon 
                size={18} 
                className={cn(
                    "shrink-0 transition-all duration-300 relative z-10", 
                    active 
                        ? "text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)] scale-110" 
                        : isLogout
                            ? "text-slate-400 group-hover:text-rose-500 group-hover:scale-110"
                            : "text-slate-400 group-hover:text-blue-500 group-hover:scale-110"
                )} 
            />
            <span className={cn(
                "flex-1 font-clash font-medium text-sm relative z-10 transition-colors",
                active ? "text-white" : isLogout ? "group-hover:text-rose-600" : "text-slate-600 group-hover:text-slate-900"
            )}>
                {label}
            </span>
            {badge && (
                <span className={cn(
                    "font-bdo text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md relative z-10 transition-colors", 
                    active 
                        ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" 
                        : "bg-slate-100 text-slate-500 border border-slate-200 group-hover:border-slate-300"
                )}>
                    {badge}
                </span>
            )}
            {/* Active Dark Glassmorphism + Water Caustics */}
            {active && (
                <div className="absolute inset-0 water-caustics-effect opacity-20 pointer-events-none rounded-xl"></div>
            )}
        </>
    );

    const className = cn(
        "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 outline-none w-full text-left overflow-hidden",
        active
            ? "bg-[#12131c] shadow-[inset_0_-8px_15px_-5px_rgba(59,130,246,0.6),_0_5px_15px_rgba(0,0,0,0.05)] translate-x-1"
            : isLogout 
                ? "hover:bg-rose-50 hover:border-rose-100 border border-transparent"
                : "hover:bg-slate-50 hover:border-slate-200/60 border border-transparent",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none"
    );

    if (disabled || !href) {
        return <button type="button" disabled className={className}>{content}</button>;
    }

    if (as === "button") {
        return <Link href={href} method={method as any} as="button" type="button" className={className}>{content}</Link>;
    }

    return <Link href={href} className={className}>{content}</Link>;
};


// ── Original Logic & State ───────────────────────────────────────────────────

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

// ── Sidebar Component ────────────────────────────────────────────────────────

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
    const membershipsActive = isCurrent("admin.memberships.index") || isCurrent("admin.memberships.store");
    const plansActive = isCurrent("admin.memberships.plans.*");
    const financeActive = isCurrent("admin.finance.*");
    const schedulesActive = isCurrent("admin.settings.schedules");
    const rolesActive = isCurrent("admin.settings.roles");
    const usersActive = isCurrent("admin.settings.users*");

    return (
        <>
            {/* GLOBAL STYLES & CSS ANIMATIONS (Dipastikan ada jika Sidebar dirender mandiri) */}
            <style dangerouslySetInnerHTML={{__html: `
                .font-clash { font-family: 'Clash Display', sans-serif; }
                .font-bdo { font-family: 'BDO Grotesk', sans-serif; }
                @keyframes caustics { 0% { background-position: 0% 50%; opacity: 0.15; } 50% { background-position: 100% 50%; opacity: 0.35; } 100% { background-position: 0% 50%; opacity: 0.15; } }
                .water-caustics-effect { background: radial-gradient(circle at top left, rgba(255,255,255,0.3) 0%, transparent 40%), radial-gradient(circle at bottom right, rgba(255,255,255,0.2) 0%, transparent 50%); background-size: 150% 150%; animation: caustics 8s ease-in-out infinite; mix-blend-mode: overlay; }
                @keyframes fadeInUp { from { opacity: 0; transform: translate3d(0, 20px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
                .animate-fade-in-up { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; will-change: opacity, transform; }
                .delay-100 { animation-delay: 50ms; } .delay-200 { animation-delay: 100ms; } .delay-300 { animation-delay: 150ms; }
                .sidebar-scrollbar::-webkit-scrollbar { width: 4px; } .sidebar-scrollbar::-webkit-scrollbar-track { background: transparent; } .sidebar-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; } .sidebar-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            `}} />

            {/* Mobile backdrop with Blur */}
            <div
                onClick={onClose}
                className={cn(
                    "fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 xl:hidden",
                    mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
                )}
                aria-hidden="true"
            />

            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col bg-white/95 backdrop-blur-xl border-r border-slate-200/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-transform duration-400 ease-out",
                    "xl:sticky xl:top-0 xl:h-screen xl:translate-x-0",
                    mobileOpen ? "translate-x-0" : "-translate-x-full",
                )}
                aria-label="Admin sidebar"
            >
                {/* Header / Logo Area */}
                <div className="flex h-[76px] items-center justify-between px-6 border-b border-slate-100">
                    <Link href="/" className="flex items-center gap-2 group outline-none">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full scale-50 group-hover:scale-100 transition-transform duration-500"></div>
                            <img
                                src="/UBSC PRO.png"
                                alt="UBSC Logo"
                                className="h-10 w-auto relative z-10 drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    </Link>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 xl:hidden transition-colors"
                        aria-label="Close sidebar"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto px-4 py-6 sidebar-scrollbar">
                    <SidebarGroup label="Main" delay="delay-100">
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
                            icon={Package}
                            label="Paket Membership"
                            href={safeRoute("admin.memberships.plans.index")}
                            active={plansActive}
                        />
                        <SidebarNavLink
                            icon={BarChart3}
                            label="Finance"
                            href={safeRoute("admin.finance.index")}
                            active={financeActive}
                            badge="Preview"
                        />
                    </SidebarGroup>

                    <SidebarGroup label="Content" delay="delay-200">
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

                    <SidebarGroup label="Settings" delay="delay-300">
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

                    <SidebarGroup label="Other" delay="delay-300">
                        <SidebarNavLink
                            icon={HelpCircle}
                            label="Help"
                            disabled
                        />
                    </SidebarGroup>
                </nav>

                {/* Logout Area */}
                <div className="border-t border-slate-100 p-4 bg-white/50 backdrop-blur-sm z-10">
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