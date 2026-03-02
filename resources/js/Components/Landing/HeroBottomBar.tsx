import DownRight from "@/../assets/icons/DownRight.svg";

export default function HeroBottomBar() {
    // Scroll to SectionTwo
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
                src="/reels/footer.mp4"
                autoPlay
                loop
                muted
                playsInline
            />

            <div className="absolute inset-0 bg-[#0B1E3B]/70" />

            <div className="absolute left-0 right-0 top-0 border-t border-white/10" />

            <div className="relative z-10 w-full px-8 py-8 lg:px-16 lg:py-10">
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

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            aria-label="Scroll to section two"
                            className="group flex items-center gap-2 rounded-full border border-white/20 px-8 py-2.5 font-bdo text-lg font-light text-white transition hover:bg-gray-300 hover:text-black hover:border-gray-300"
                            onClick={scrollToSectionTwo}
                        >
                            <span className="font-bdo">Scroll down</span>
                            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-gray-600 transition group-hover:border-black">
                                <img
                                    src={DownRight}
                                    alt="Scroll down"
                                    className="transition duration-200 ease-in-out group-hover:[filter:grayscale(1)_brightness(0)]"
                                />
                            </span>
                        </button>
                    </div>
                </div>

                <div className="flex items-start justify-between gap-4 lg:hidden">
                    <div className="flex flex-col gap-4">
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
                            className="group flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 font-bdo text-sm font-light text-white transition hover:bg-white hover:text-black hover:border-white"
                            onClick={scrollToSectionTwo}
                        >
                            <span className="font-bdo">Scroll down</span>
                            {/* <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white transition group-hover:border-black">
                                <FooterArrow />
                            </span> */}
                        </button>
                    </div>

                    <p className="max-w-[55%] font-bdo text-sm font-light leading-relaxed text-white/80">
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
