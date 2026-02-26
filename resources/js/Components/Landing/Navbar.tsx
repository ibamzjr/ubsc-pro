import { useState } from "react";
import { ArrowRight } from "lucide-react";
import square from "../../../assets/hero/square.png";

interface NavItem {
    label: string;
    number: string;
    href: string;
}

const NAV_ITEMS: NavItem[] = [
    { label: "Home", number: "01", href: "#home" },
    { label: "About", number: "02", href: "#about" },
    { label: "Facilities", number: "03", href: "#facilities" },
    { label: "Services", number: "04", href: "#services" },
    { label: "Pricing", number: "05", href: "#pricing" },
    { label: "Booking", number: "06", href: "#booking" },
];

interface NavbarProps {
    activeSection?: string;
}

export default function Navbar({ activeSection = "Home" }: NavbarProps) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            <nav className="absolute left-0 right-0 top-0 z-50 flex items-center justify-between px-8 py-6 lg:px-12">
                <div className="flex items-center gap-2">
                    <img
                        src="/UBSC.svg"
                        alt="UB Sport Center Logo"
                        className="h-12 w-auto"
                    />
                </div>

                <ul className="hidden items-center gap-12 lg:flex">
                    {NAV_ITEMS.map((item) => (
                        <li key={item.number}>
                            <a
                                href={item.href}
                                className={`font-clash relative text-2xl tracking-wide transition-opacity duration-200 ${
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
                    href="#booking"
                    className="group hidden items-stretch overflow-hidden rounded-md bg-white transition-shadow hover:shadow-lg lg:flex"
                >
                    <div className="mt-1 ml-1 h-full w-14 flex-shrink-0 self-stretch">
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
                        <p className="font-clash text-[10px] text-navy-900/40">
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
                    className="flex flex-col items-end justify-center gap-[6px] p-1 lg:hidden"
                    aria-label="Toggle menu"
                >
                    <span
                        className={`block h-[2px] bg-white transition-all duration-300 ${
                            mobileOpen ? "w-6 translate-y-2 rotate-45" : "w-7"
                        }`}
                    />
                    <span
                        className={`block h-[2px] bg-white transition-all duration-300 ${
                            mobileOpen ? "w-6 -translate-y-2 -rotate-45" : "w-5"
                        }`}
                    />
                </button>
            </nav>

            <div
                className={`fixed inset-0 z-40 flex flex-col bg-navy-900/95 px-8 pt-28 pb-12 backdrop-blur-sm transition-all duration-300 lg:hidden ${
                    mobileOpen
                        ? "pointer-events-auto opacity-100"
                        : "pointer-events-none opacity-0"
                }`}
            >
                <ul className="flex flex-col gap-8">
                    {NAV_ITEMS.map((item) => (
                        <li key={item.number}>
                            <a
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={`font-clash flex items-baseline gap-2 text-4xl tracking-wide transition-opacity duration-200 ${
                                    item.label === activeSection
                                        ? "text-white"
                                        : "text-white/50"
                                }`}
                            >
                                {item.label}
                                <sup className="text-xs text-white/30">
                                    {item.number}
                                </sup>
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="mt-auto">
                    <a
                        href="#booking"
                        onClick={() => setMobileOpen(false)}
                        className="group flex items-stretch overflow-hidden rounded-md bg-white"
                    >
                        <div className="mt-1 ml-1 h-full w-14 flex-shrink-0 self-stretch">
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
                            <p className="font-clash text-[10px] text-navy-900/40">
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
                </div>
            </div>
        </>
    );
}
