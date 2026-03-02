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
            {/* ─── Navbar utama — selalu di z-50 (paling depan) ─── */}
            <nav className="absolute left-0 right-0 top-0 z-50 flex items-center justify-between px-8 py-6 lg:px-12">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <img
                        src="/UBSC.svg"
                        alt="UB Sport Center Logo"
                        className="h-8 w-auto md:h-12 transition-all duration-200"
                    />
                </div>

                {/* Desktop Nav Links */}
                <ul className="hidden items-center gap-12 xl:flex">
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

                {/* Desktop CTA Button */}
                <a
                    href="/coming-soon"
                    className="group hidden items-stretch overflow-hidden rounded-md bg-white transition-shadow hover:shadow-lg xl:flex"
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

                {/* ── Mobile: Hamburger (kode asli tidak diubah) ── */}
                <button
                    type="button"
                    onClick={() => setMobileOpen((v) => !v)}
                    className="flex flex-col items-end justify-center gap-[6px] p-1 xl:hidden"
                    aria-label={mobileOpen ? "Close menu" : "Open menu"}
                    aria-expanded={mobileOpen}
                >
                    <span
                        className={`block h-[2px] bg-white transition-all duration-300 ${
                            mobileOpen
                                ? "w-6 translate-y-[7px] rotate-45"
                                : "w-7"
                        }`}
                    />
                    <span
                        className={`block h-[2px] bg-white transition-all duration-300 ${
                            mobileOpen
                                ? "w-6 -translate-y-[1px] -rotate-45"
                                : "w-5"
                        }`}
                    />
                </button>
            </nav>

            {/* ─── Mobile: Backdrop kiri (di bawah navbar) ─── */}
            
<div
  onClick={() => setMobileOpen(false)}
  aria-hidden="true"
  className={`fixed inset-0 z-30 xl:hidden transition-opacity duration-300 ${
    mobileOpen
      ? "pointer-events-auto opacity-100"
      : "pointer-events-none opacity-0"
  }`}
  style={{ background: "rgba(0,0,0,0.45)" }}
/>

{/* ─── Mobile: Panel menu (AUTO HEIGHT, FULL WIDTH) ─── */}
<div
  className={`fixed top-0 left-0 right-0 z-40 xl:hidden transition-transform duration-300 ease-out ${
    mobileOpen ? "translate-y-0" : "-translate-y-full"
  }`}
  style={{ background: "#111111" }}
  aria-hidden={!mobileOpen}
>
  {/* Spacer supaya tidak tertutup navbar */}
  <div className="h-[88px] md:h-[104px]" />

  {/* Divider */}
  <div className="h-px w-full bg-white/10" />

  {/* Nav Items */}
  <ul className="flex flex-col px-8 pt-4">
    {NAV_ITEMS.map((item, index) => (
      <li key={item.number}>
        <a
          href={item.href}
          onClick={() => setMobileOpen(false)}
          className={`font-clash flex items-baseline justify-between py-4 text-xl transition-colors ${
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

  {/* Divider bawah */}
  <div className="mx-8 mt-4 h-px bg-white/10" />

  {/* CTA */}
  <div className="px-8 py-6">
    <a
      href="/coming-soon"
      onClick={() => setMobileOpen(false)}
      className="group flex items-stretch overflow-hidden rounded-md bg-white transition-opacity hover:opacity-90"
    >
      <div className="mt-1 ml-1 h-full w-14 flex-shrink-0">
        <img
          src={square}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-col justify-center px-3 py-2 text-left">
        <p className="font-clash text-sm font-semibold text-navy-900">
          Lets Get Started
        </p>
        <p className="font-clash text-[12px] font-medium text-navy-900/80">
          Register Now
        </p>
        <p className="font-clash text-[10px] text-navy-900/40">
          Guest
        </p>
      </div>

      <div className="ml-auto flex items-center pr-3">
        <ArrowRight
          size={20}
          className="text-navy-900 transition-transform group-hover:translate-x-0.5"
        />
      </div>
    </a>
  </div>
</div>
        </>
    );
}