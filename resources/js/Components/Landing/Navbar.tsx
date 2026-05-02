import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import square from "../../../assets/hero/square.png";

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
    const [mobileOpen, setMobileOpen] = useState(false);

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

            /* backdrop blur trigger */
            if (currentScroll > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }

            /* hide / show navbar */
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
        if (mobileOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [mobileOpen]);

    return (
        <>
            <nav
                className={`fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-8 py-6 lg:px-12
                transition-all duration-500 ease-out bg-gradient-to-b to-transparent
                ${navVisible ? "translate-y-0" : "-translate-y-full"}
                ${scrolled ? "from-black" : "from-black"}
                `}
            >
                <div className="flex items-center gap-2">
                    <img
                        src="/UBSC.svg"
                        alt="UB Sport Center Logo"
                        className="h-8 w-auto md:h-12 transition-all duration-200"
                    />
                </div>

                <ul className="hidden items-center gap-6 min-[1100px]:flex xl:gap-12">
                    {NAV_ITEMS.map((item) => (
                        <li key={item.number}>
                            <a
                                href={item.href}
                                className={`font-clash relative text-[clamp(0.75rem,1vw,16px)] tracking-wide transition-opacity duration-200 ${
                                    item.label === activeSection
                                        ? "text-white"
                                        : "text-white/50 hover:text-white/80"
                                }`}
                            >
                                {item.label}
                                <sup className="ml-0.5 text-[10px] text-white/40">
                                    {item.number}
                                </sup>
                            </a>
                        </li>
                    ))}
                </ul>

                <a
                    href="/coming-soon"
                    className="group hidden items-stretch overflow-hidden rounded-md bg-white transition-shadow hover:shadow-lg min-[1100px]:flex scale-90 xl:scale-100 origin-right"
                >
                    <div className="mt-1 mb-1 ml-1 h-full w-14 flex-shrink-0 self-stretch">
                        <img
                            src={square}
                            alt=""
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div className="flex flex-col justify-center px-3 py-2 text-left">
                        <p className="font-clash text-sm font-semibold leading-tight text-navy-900">
                            Lets Get Started
                        </p>
                        <p className="font-clash text-[12px] font-medium text-navy-900/80">
                            Register Now
                        </p>
                        <p className="font-clash text-[10px] -mt-0.5 text-navy-900/40">
                            Guest
                        </p>
                    </div>

                    <div className="flex items-center pr-3">
                        <ArrowRight
                            size={22}
                            className="text-navy-900 transition-transform group-hover:translate-x-0.5"
                        />
                    </div>
                </a>

                <button
                    type="button"
                    onClick={() => setMobileOpen((v) => !v)}
                    className="flex flex-col items-end justify-center gap-[6px] p-1 min-[1100px]:hidden"
                    aria-label={mobileOpen ? "Close menu" : "Open menu"}
                >
                    <span
                        className={`block h-[2px] bg-white transition-all duration-300 ${
                            mobileOpen
                                ? "w-6 translate-y-[4px] rotate-45"
                                : "w-7"
                        }`}
                    />
                    <span
                        className={`block h-[2px] bg-white transition-all duration-300 ${
                            mobileOpen
                                ? "w-6 -translate-y-[4px] -rotate-45"
                                : "w-5"
                        }`}
                    />
                </button>
            </nav>

            <div
                onClick={() => setMobileOpen(false)}
                className={`fixed inset-0 z-30 min-[1100px]:hidden transition-opacity duration-300 ${
                    mobileOpen
                        ? "pointer-events-auto opacity-100"
                        : "pointer-events-none opacity-0"
                }`}
                style={{ background: "rgba(0,0,0,0.6)" }}
            />

            <div
                className={`fixed top-0 left-0 right-0 z-40 min-[1100px]:hidden transition-transform duration-500 ease-out ${
                    mobileOpen ? "translate-y-0" : "-translate-y-full"
                }`}
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
                                className={`font-clash flex items-baseline justify-between py-5 text-xl transition-colors ${
                                    item.label === activeSection
                                        ? "text-white"
                                        : "text-white/40 hover:text-white/70"
                                }`}
                            >
                                <span>{item.label}</span>
                                <sup className="text-[10px] text-white/30">
                                    {item.number}
                                </sup>
                            </a>

                            {index < NAV_ITEMS.length - 1 && (
                                <div className="h-px w-full bg-white/10" />
                            )}
                        </li>
                    ))}
                </ul>

                <div className="mx-8 mt-0 h-px bg-white/10" />

                <div className="px-[clamp(1.25rem,4vw,2rem)] py-[clamp(0.75rem,3vw,1.5rem)]">
                    <a
                        href="/coming-soon"
                        onClick={() => setMobileOpen(false)}
                        className="group flex items-stretch overflow-hidden rounded-xl bg-white transition-opacity hover:opacity-90"
                    >
                        <div className="m-1.5 w-[clamp(3rem,10vw,5rem)] aspect-square flex-shrink-0 overflow-hidden rounded-lg">
                            <img
                                src={square}
                                alt=""
                                className="h-full w-full object-cover"
                            />
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
                    </a>
                </div>
            </div>
        </>
    );
}
