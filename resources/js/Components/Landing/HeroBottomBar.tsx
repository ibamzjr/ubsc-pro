import DownRight from "@/../assets/icons/DownRight.svg";
import { useState } from "react";

interface HeroBottomBarProps {
    sectionNumber?: string;
    sectionLabel?: string;
    description?: string;
    targetId?: string;
    showVideo?: boolean;
    /** 'solid' = opaque bg (default); 'transparent' = no bg, only the top border line */
    variant?: "solid" | "transparent";
}

export default function HeroBottomBar({
    sectionNumber = "01/",
    sectionLabel = "homepage",
    description = "Temukan fasilitas olahraga modern untuk berlatih, berprestasi, dan berkembang bersama.",
    targetId = "about",
    showVideo = true,
    variant = "solid",
}: HeroBottomBarProps) {
    const [rotated, setRotated] = useState(false);
    const scrollToTarget = () => {
        const el = document.getElementById(targetId);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };
    return (
        <div className="relative w-full overflow-hidden">
            {variant === "solid" && showVideo && (
                <video
                    className="absolute inset-0 h-full w-full object-cover"
                    src="/assets/reels/Hero.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="none"
                />
            )}

            {variant === "solid" && (
                <div className={`absolute inset-0 ${showVideo ? "bg-[#0B1E3B]/70" : "bg-[#0B0F18]"}`} />
            )}

            <div className="absolute left-0 right-0 top-0 border-t border-white/10" />

            <div className="relative z-10 w-full px-6 py-8 lg:px-16 lg:py-10">
                <div className="hidden items-center justify-between lg:flex">
                    <div className="flex items-center gap-2">
                        <span className="font-bdo text-[clamp(0.875rem,0.94vw,18px)] font-medium text-white/40">
                            {sectionNumber}
                        </span>
                        <span className="font-bdo text-[clamp(0.875rem,0.94vw,18px)] font-medium text-white/80">
                            {sectionLabel}
                        </span>
                    </div>

                    <p className="max-w-lg text-center font-bdo text-[clamp(0.875rem,0.94vw,18px)] font-light leading-relaxed text-white">
                        {description}
                    </p>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            aria-label="Scroll to next section"
                            onClick={() => {
                                setRotated(true);
                                scrollToTarget();
                            }}
                            onMouseEnter={() => setRotated(true)}
                            onMouseLeave={() => setRotated(false)}
                            className="group flex items-center"
                        >
                            {/* Capsule */}
                            <div className="flex items-center justify-center rounded-full border border-white/40 px-6 sm:px-8 py-2 sm:py-2.5 text-white transition-all duration-300 group-hover:bg-white group-hover:text-black">
                                <span className="font-bdo text-[clamp(0.75rem,0.94vw,18px)] font-light tracking-wide">
                                    Scroll down
                                </span>
                            </div>
                            {/* Arrow only for xl+ */}
                            <div className="-ml-[1px] hidden xl:flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/40 transition-all duration-300 group-hover:bg-white">
                                <img
                                    src={DownRight}
                                    alt="Scroll down"
                                    className={`
                w-3 xs:w-4
                transition-transform duration-500 ease-in-out
                ${rotated ? "rotate-[55deg]" : "rotate-[5deg]"}
                group-hover:[filter:grayscale(1)_brightness(0)]
            `}
                                />
                            </div>
                        </button>
                    </div>
                </div>

                <div className="flex items-start justify-between gap-8 lg:hidden">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1">
                            <span className="font-bdo text-sm font-medium text-white/40">
                                {sectionNumber}
                            </span>
                            <span className="font-bdo text-sm font-medium text-white/80">
                                {sectionLabel}
                            </span>
                        </div>

                        <button
                            type="button"
                            aria-label="Scroll to next section"
                            className="group flex items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-1 font-bdo text-[12px] font-light text-white transition hover:bg-white hover:text-black hover:border-white w-fit mx-auto"
                            onClick={scrollToTarget}
                        >
                            <span className="font-bdo">Scroll down</span>
                        </button>
                    </div>

                    <p
                        className="w-full max-w-[95%] lg:max-w-[55%] font-bdo font-light leading-relaxed text-white/80 text-[clamp(0.75rem,1.5vw,1rem)]"
                    >
                        <span className="font-bold text-white">
                            UB Sport Center –
                        </span>{" "}
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}
