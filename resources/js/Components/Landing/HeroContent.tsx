import { useState } from "react";

const Arrow: React.FC<{ size?: number }> = ({ size = 56 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M12 32H52M52 32L34 14M52 32L34 50"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default function HeroContent() {
    const [hovered, setHovered] = useState(false);

    return (
        <div className="flex max-w-sm flex-col items-end gap-6 text-right lg:max-w-md lg:pt-10 lg:mt-24">
            <div className="flex h-20 w-20 items-center justify-center lg:h-24 lg:w-20 mt-12 lg:mt-0">
                <img
                    src="/assets/hero/star.png"
                    alt="Decorative mesh"
                    className="h-full w-full object-contain opacity-90"
                />
            </div>

            <p className="font-bdo text-base leading-relaxed text-white/80 lg:text-2xl">
                Selamat Datang di UB Sport Center,{" "}
                <br className="hidden lg:block" />
                pusat fasilitas{" "}
                <span className="font-semibold text-white">
                    olahraga modern
                </span>{" "}
                <br />
                untuk gaya hidup aktif Anda.
            </p>

            <a
                href="#booking"
                className="relative lg:w-full cursor-pointer select-none overflow-hidden border-b border-white/35 py-1"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <span
                    aria-hidden
                    className="pointer-events-none absolute bg-accent-red"
                    style={{
                        top: "-50%",
                        left: "-5%",
                        right: "-5%",
                        bottom: "-50%",
                        transform: hovered
                            ? "skewY(-5deg) translateY(0%)"
                            : "skewY(-5deg) translateY(130%)",
                        transition:
                            "transform 0.55s cubic-bezier(0.76, 0, 0.24, 1)",
                        zIndex: 0,
                    }}
                />

                <span className="pointer-events-none relative z-10 flex w-full items-center justify-between">
                    <span className="font-bdo text-lg font-extrabold leading-tight tracking-tight text-white lg:text-2xl">
                        Booking sekarang juga!
                    </span>

                    <span
                        className="flex flex-shrink-0 items-center justify-center"
                        style={{
                            width: "clamp(32px, 3vw, 48px)",
                            height: "clamp(32px, 3vw, 48px)",
                            transform: hovered
                                ? "rotate(0deg)"
                                : "rotate(-45deg)",
                            transition:
                                "transform 0.55s cubic-bezier(0.76, 0, 0.24, 1)",
                        }}
                    >
                        <Arrow size={32} />
                    </span>
                </span>
            </a>
        </div>
    );
}
