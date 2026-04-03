import DownRight from "@/../assets/icons/DownRight.svg";
import { useState } from "react";

export default function HeroBottomBar() {
    const [rotated, setRotated] = useState(false);
    const scrollToSectionTwo = () => {
        const el = document.getElementById("about");
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };
    return (
        <div className="relative w-full overflow-hidden">
            <video
                className="absolute inset-0 h-full w-full object-cover"
                src="/assets/reels/Hero.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="none"
            />

            <div className="absolute inset-0 bg-[#0B1E3B]/70" />

            <div className="absolute left-0 right-0 top-0 border-t border-white/10" />

            <div className="relative z-10 w-full px-6 py-8 lg:px-16 lg:py-10">
                <div className="hidden items-center justify-between lg:flex">
                    <div className="flex items-center gap-2">
                        <span className="font-bdo text-lg font-medium text-white/40">
                            01/
                        </span>
                        <span className="font-bdo text-lg font-medium text-white/80">
                            homepage
                        </span>
                    </div>

                    <p className="max-w-lg text-left font-bdo text-lg font-light leading-relaxed text-white">
                        <span className="font-medium text-white">
                            UB Sport Center –
                        </span>{" "}
                        Temukan fasilitas olahraga modern <br />
                        untuk berlatih, berprestasi, dan berkembang bersama.
                    </p>

                    {/* Scroll button: capsule only for md/lg, capsule+arrow for xl+ */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            aria-label="Scroll to section two"
                            onClick={() => {
                                setRotated(true);
                                scrollToSectionTwo();
                            }}
                            onMouseEnter={() => setRotated(true)}
                            onMouseLeave={() => setRotated(false)}
                            className="group flex items-center"
                        >
                            {/* Capsule */}
                            <div className="flex items-center justify-center rounded-full border border-white/40 px-6 sm:px-8 py-2 sm:py-2.5 text-white transition-all duration-300 group-hover:bg-white group-hover:text-black">
                                <span className="font-bdo text-sm sm:text-lg font-light tracking-wide">
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
                                01/
                            </span>
                            <span className="font-bdo text-sm font-medium text-white/80">
                                homepage
                            </span>
                        </div>

                        <button
                            type="button"
                            aria-label="Scroll to section two"
                            className="group flex items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-1 font-bdo text-[12px] font-light text-white transition hover:bg-white hover:text-black hover:border-white w-fit mx-auto"
                            onClick={scrollToSectionTwo}
                        >
                            <span className="font-bdo">Scroll down</span>
                        </button>
                    </div>

                    <p
                        className="w-full max-w-[95%] lg:max-w-[55%] font-bdo font-light leading-relaxed text-white/80 /* Clamp: Min: 0.75rem (12px) Ideal: 1.5vw Max: 1rem (16px) */ text-[clamp(0.75rem,1.5vw,1rem)]"
                    >
                        <span className="font-bold text-white">
                            UB Sport Center –
                        </span>{" "}
                        Temukan fasilitas olahraga modern untuk berlatih,
                        berprestasi, dan berkembang bersama.
                    </p>
                </div>
            </div>
        </div>
    );
}
