import { useState, useEffect, useRef } from "react";
import { ArrowRight, ChevronDown, CreditCard, Dumbbell, LogOut, MessageCircle, User } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import square from "../../../assets/hero/square.png";
import InfoBanner from "@/Components/Landing/InfoBanner";
import AuthModal from "@/Components/Landing/AuthModal";
import ProfileModal from "@/Components/UserDashboard/ProfileModal";
import PaymentHistoryModal from "@/Components/UserDashboard/PaymentHistoryModal";
import GymMembershipModal from "@/Components/UserDashboard/GymMembershipModal";
import { cn } from "@/lib/utils";
import type { PageProps } from "@/types";

type UserModal = "profile" | "history" | "membership";

interface NavItem {
    label: string;
    number: string;
    href: string;
}

const NAV_ITEMS: NavItem[] = [
    { label: "Home", number: "01", href: "/" },
    { label: "About", number: "02", href: "/about" },
    { label: "News", number: "03", href: "/news" },
    { label: "Facilities", number: "04", href: "/facilities" },
    { label: "Pricing", number: "05", href: "/pricing" },
    { label: "Booking", number: "06", href: "/booking" },
];

interface NavbarProps {
    activeSection?: string;
}

export default function Navbar({ activeSection = "Home" }: NavbarProps) {
    const { auth } = usePage<PageProps>().props;
    const user = auth?.user ?? null;

    const [mobileOpen, setMobileOpen] = useState(false);
    const [authOpen, setAuthOpen] = useState(false);
    const [authInitialTab, setAuthInitialTab] = useState<"login" | "register">("login");
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [activeUserModal, setActiveUserModal] = useState<UserModal | null>(null);

    const userMenuRef = useRef<HTMLDivElement>(null);

    /* =========================
       NAV VISIBILITY ENGINE
    ========================= */

    const [navVisible, setNavVisible] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);

    useEffect(() => {
        const updateNav = () => {
            const currentScroll = window.scrollY;
            setScrolled(currentScroll > 20);
            if (currentScroll > lastScrollY.current && currentScroll > 120) {
                setNavVisible(false);
            } else {
                setNavVisible(true);
            }
            lastScrollY.current = currentScroll;
            ticking.current = false;
        };

        const onScroll = () => {
            if (!ticking.current) {
                window.requestAnimationFrame(updateNav);
                ticking.current = true;
            }
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    /* =========================
       LOCK BODY SCROLL MOBILE
    ========================= */

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "unset";
        return () => { document.body.style.overflow = "unset"; };
    }, [mobileOpen]);

    /* =========================
       CLICK-OUTSIDE USER MENU
    ========================= */

    useEffect(() => {
        if (!userMenuOpen) return;
        const handler = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [userMenuOpen]);

    /* =========================
       AUTO-OPEN MODAL FROM URL
    ========================= */

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const authParam = params.get("auth");
        if (authParam === "login" || authParam === "register") {
            setAuthInitialTab(authParam);
            setAuthOpen(true);
            // Clean the query string from the address bar without a navigation
            const cleanUrl = window.location.pathname;
            window.history.replaceState(null, "", cleanUrl);
        }
    }, []);

    /* =========================
       USER DISPLAY HELPERS
    ========================= */

    const firstName = user ? user.name.split(" ")[0] : "";
    const initials  = user ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "";

    return (
        <>
            <InfoBanner />
            <InfoBanner />
            <nav
                className={cn(
                    "fixed left-0 right-0 top-8 z-50 flex items-center justify-between px-8 py-6 lg:px-12",
                    "transition-all duration-500 ease-out bg-gradient-to-b from-black to-transparent",
                    navVisible ? "translate-y-0" : "-translate-y-full",
                )}
            >
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <img
                        src="/UBSC.svg"
                        alt="UB Sport Center Logo"
                        className="h-8 w-auto md:h-12 transition-all duration-200"
                    />
                </div>

                {/* Desktop nav links */}
                <ul className="hidden items-center gap-6 min-[1100px]:flex xl:gap-12">
                    {NAV_ITEMS.map((item) => (
                        <li key={item.number}>
                            <a
                                href={item.href}
                                className={cn(
                                    "font-clash relative text-[clamp(0.75rem,1vw,16px)] tracking-wide transition-opacity duration-200",
                                    item.label === activeSection
                                        ? "text-white"
                                        : "text-white/50 hover:text-white/80",
                                )}
                            >
                                {item.label}
                                <sup className="ml-0.5 text-[10px] text-white/40">{item.number}</sup>
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Desktop CTA — authenticated vs guest */}
                {user ? (
                    <div
                        ref={userMenuRef}
                        className="relative hidden min-[1100px]:flex scale-90 xl:scale-100 origin-right"
                    >
                        <button
                            type="button"
                            onClick={() => setUserMenuOpen((v) => !v)}
                            className="group flex items-stretch overflow-hidden rounded-md bg-white transition-shadow hover:shadow-lg"
                        >
                            {/* Avatar */}
                            <div className="m-1 aspect-square w-12 flex-shrink-0 overflow-hidden rounded-sm bg-navy-900 flex items-center justify-center">
                                {user.avatar ? (
                                    <img
                                        src={"/storage/" + user.avatar}
                                        alt={user.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="font-clash text-sm font-bold text-white leading-none">
                                        {initials}
                                    </span>
                                )}
                            </div>

                            <div className="flex max-w-[150px] flex-col justify-center px-3 py-2 text-left">
                                <p className="font-clash text-[13px] font-semibold leading-tight text-navy-900 truncate">
                                    Halo, {firstName}
                                </p>
                                <p className="font-clash text-[11px] font-medium text-navy-900/70 truncate">
                                    {user.email}
                                </p>
                                <p className="font-clash text-[10px] -mt-0.5 text-navy-900/40 capitalize">
                                    {user.role ?? "Member"}
                                </p>
                            </div>

                            <div className="flex items-center pr-3">
                                <ChevronDown
                                    size={16}
                                    className={cn(
                                        "text-navy-900 transition-transform duration-200",
                                        userMenuOpen && "rotate-180",
                                    )}
                                />
                            </div>
                        </button>

                        {/* Dropdown */}
                        <div
                            className={cn(
                                "absolute right-0 top-full mt-2 w-56 rounded-2xl border border-slate-100 bg-white py-1.5 shadow-2xl transition-all duration-200 origin-top-right z-[100]",
                                userMenuOpen
                                    ? "scale-100 opacity-100 pointer-events-auto"
                                    : "scale-95 opacity-0 pointer-events-none",
                            )}
                        >
                            <div className="px-4 py-3 border-b border-slate-100">
                                <p className="font-clash text-[13px] font-semibold text-slate-900 truncate">
                                    {user.name}
                                </p>
                                <p className="font-bdo text-[11px] text-slate-400 truncate">{user.email}</p>
                            </div>

                            <div className="py-1.5">
                                <DropdownButton icon={<User size={14} />} label="Profil Saya" onClick={() => { setUserMenuOpen(false); setActiveUserModal("profile"); }} />
                                <DropdownButton icon={<CreditCard size={14} />} label="History Pembayaran" onClick={() => { setUserMenuOpen(false); setActiveUserModal("history"); }} />
                                <DropdownButton icon={<Dumbbell size={14} />} label="Membership Gym" onClick={() => { setUserMenuOpen(false); setActiveUserModal("membership"); }} />
                                <a
                                    href="https://wa.me/6281234567890"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex w-full items-center gap-3 px-4 py-2.5 font-bdo text-[13px] text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                                >
                                    <span className="text-slate-400"><MessageCircle size={14} /></span>
                                    Kontak Kami
                                </a>
                            </div>

                            <div className="border-t border-slate-100 py-1.5">
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="flex w-full items-center gap-3 px-4 py-2.5 font-bdo text-[13px] text-rose-500 transition-colors hover:bg-rose-50"
                                >
                                    <LogOut size={14} />
                                    Keluar
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setAuthOpen(true)}
                        className="group hidden items-stretch overflow-hidden rounded-md bg-white transition-shadow hover:shadow-lg min-[1100px]:flex scale-90 xl:scale-100 origin-right"
                    >
                        <div className="mt-1 mb-1 ml-1 h-full w-14 flex-shrink-0 self-stretch">
                            <img src={square} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div className="flex flex-col justify-center px-3 py-2 text-left">
                            <p className="font-clash text-sm font-semibold leading-tight text-navy-900">
                                Lets Get Started
                            </p>
                            <p className="font-clash text-[12px] font-medium text-navy-900/80">Register Now</p>
                            <p className="font-clash text-[10px] -mt-0.5 text-navy-900/40">Guest</p>
                        </div>
                        <div className="flex items-center pr-3">
                            <ArrowRight
                                size={22}
                                className="text-navy-900 transition-transform group-hover:translate-x-0.5"
                            />
                        </div>
                    </button>
                )}

                {/* Hamburger */}
                <button
                    type="button"
                    onClick={() => setMobileOpen((v) => !v)}
                    className="flex flex-col items-end justify-center gap-[6px] p-1 min-[1100px]:hidden"
                    aria-label={mobileOpen ? "Close menu" : "Open menu"}
                >
                    <span
                        className={cn(
                            "block h-[2px] bg-white transition-all duration-300",
                            mobileOpen ? "w-6 translate-y-[4px] rotate-45" : "w-7",
                        )}
                    />
                    <span
                        className={cn(
                            "block h-[2px] bg-white transition-all duration-300",
                            mobileOpen ? "w-6 -translate-y-[4px] -rotate-45" : "w-5",
                        )}
                    />
                </button>
            </nav>

            {/* Mobile overlay */}
            <div
                onClick={() => setMobileOpen(false)}
                className={cn(
                    "fixed inset-0 z-30 min-[1100px]:hidden transition-opacity duration-300",
                    mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
                )}
                style={{ background: "rgba(0,0,0,0.6)" }}
            />

            {/* Mobile drawer */}
            <div
                className={cn(
                    "fixed top-8 left-0 right-0 z-40 min-[1100px]:hidden transition-transform duration-500 ease-out",
                    mobileOpen ? "translate-y-0" : "-translate-y-full",
                )}
                style={{ background: "#111111" }}
            >
                <div className="h-[80px] md:h-[104px]" />
                <div className="h-px w-full bg-white/10" />

                <ul className="flex flex-col px-8 pt-0">
                    {NAV_ITEMS.map((item, index) => (
                        <li key={item.number}>
                            <a
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                    "font-clash flex items-baseline justify-between py-5 text-xl transition-colors",
                                    item.label === activeSection
                                        ? "text-white"
                                        : "text-white/40 hover:text-white/70",
                                )}
                            >
                                <span>{item.label}</span>
                                <sup className="text-[10px] text-white/30">{item.number}</sup>
                            </a>
                            {index < NAV_ITEMS.length - 1 && (
                                <div className="h-px w-full bg-white/10" />
                            )}
                        </li>
                    ))}
                </ul>

                <div className="mx-8 mt-0 h-px bg-white/10" />

                <div className="px-[clamp(1.25rem,4vw,2rem)] py-[clamp(0.75rem,3vw,1.5rem)]">
                    {user ? (
                        /* Mobile authenticated menu */
                        <div className="overflow-hidden rounded-xl bg-white">
                            {/* Profile row */}
                            <div className="flex items-center gap-3 p-4 border-b border-slate-100">
                                <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-navy-900 overflow-hidden flex items-center justify-center">
                                    {user.avatar ? (
                                        <img
                                            src={"/storage/" + user.avatar}
                                            alt={user.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="font-clash text-sm font-bold text-white leading-none">
                                            {initials}
                                        </span>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-clash text-sm font-semibold text-slate-900 truncate">
                                        {user.name}
                                    </p>
                                    <p className="font-bdo text-[11px] text-slate-400 truncate">{user.email}</p>
                                </div>
                            </div>
                            {/* Quick links */}
                            <div className="flex flex-col">
                                <MobileMenuButton icon={<User size={14} />} label="Profil Saya" onClick={() => { setMobileOpen(false); setActiveUserModal("profile"); }} />
                                <MobileMenuButton icon={<CreditCard size={14} />} label="History Pembayaran" onClick={() => { setMobileOpen(false); setActiveUserModal("history"); }} />
                                <MobileMenuButton icon={<Dumbbell size={14} />} label="Membership Gym" onClick={() => { setMobileOpen(false); setActiveUserModal("membership"); }} />
                                <a
                                    href="https://wa.me/6281234567890"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex w-full items-center gap-3 px-4 py-3 font-bdo text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50"
                                >
                                    <span className="text-slate-400"><MessageCircle size={14} /></span>
                                    Kontak Kami
                                </a>
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex w-full items-center gap-3 px-4 py-3 font-bdo text-[13px] font-medium text-rose-500 border-t border-slate-100 transition-colors hover:bg-rose-50"
                                >
                                    <LogOut size={14} />
                                    Keluar
                                </Link>
                            </div>
                        </div>
                    ) : (
                        /* Mobile guest button */
                        <button
                            type="button"
                            onClick={() => { setMobileOpen(false); setAuthOpen(true); }}
                            className="group flex w-full items-stretch overflow-hidden rounded-xl bg-white transition-opacity hover:opacity-90"
                        >
                            <div className="m-1.5 w-[clamp(3rem,10vw,5rem)] aspect-square flex-shrink-0 overflow-hidden rounded-lg">
                                <img src={square} alt="" className="h-full w-full object-cover" />
                            </div>
                            <div className="flex flex-col justify-center px-[clamp(0.5rem,2vw,0.875rem)] py-2 text-left">
                                <p className="font-clash text-[clamp(0.75rem,3.5vw,1rem)] font-semibold leading-tight text-navy-900">
                                    Lets Get Started
                                </p>
                                <p className="font-clash text-[clamp(0.625rem,2.8vw,0.875rem)] mt-0.5 text-navy-900/80">
                                    Register Now
                                </p>
                                <p className="font-clash text-[clamp(0.5rem,2.3vw,0.75rem)] text-navy-900/40">
                                    Guest
                                </p>
                            </div>
                            <div className="ml-auto flex items-center pr-[clamp(0.5rem,2vw,0.875rem)]">
                                <ArrowRight className="h-[clamp(1rem,4vw,1.25rem)] w-[clamp(1rem,4vw,1.25rem)] text-navy-900 transition-transform group-hover:translate-x-0.5" />
                            </div>
                        </button>
                    )}
                </div>
            </div>

            {/* Auth modal — only for guests */}
            {!user && (
                <AuthModal
                    open={authOpen}
                    initialTab={authInitialTab}
                    onClose={() => setAuthOpen(false)}
                />
            )}

            {/* User dashboard modals — only for authenticated users */}
            {activeUserModal === "profile"    && <ProfileModal onClose={() => setActiveUserModal(null)} />}
            {activeUserModal === "history"    && <PaymentHistoryModal  onClose={() => setActiveUserModal(null)} />}
            {activeUserModal === "membership" && <GymMembershipModal   onClose={() => setActiveUserModal(null)} />}
        </>
    );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function DropdownButton({
    icon,
    label,
    onClick,
}: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center gap-3 px-4 py-2.5 font-bdo text-[13px] text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
            <span className="text-slate-400">{icon}</span>
            {label}
        </button>
    );
}

function MobileMenuButton({
    icon,
    label,
    onClick,
}: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center gap-3 px-4 py-3 font-bdo text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
            <span className="text-slate-400">{icon}</span>
            {label}
        </button>
    );
}
