import { ChevronRight } from "lucide-react";

export default function HeroBottomBar() {
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

                    <p className="max-w-lg text-center font-bdo text-lg font-light leading-relaxed text-white">
                        <span className="font-bold text-white">
                            UB Sport Center –
                        </span>{" "}
                        Temukan fasilitas olahraga modern untuk berlatih,
                        berprestasi, dan berkembang bersama.
                    </p>

                    <div className="flex items-center gap-3">
                        <span className="rounded-full border border-white/20 px-8 py-2.5 font-bdo text-lg font-light text-white transition-colors hover:border-white/40">
                            Scroll down
                        </span>
                        <button
                            type="button"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/60 transition-all hover:border-white/40 hover:text-white"
                        >
                            <ChevronRight size={24} />
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

                        <div className="flex items-center gap-2">
                            <span className="rounded-full border border-white/20 px-5 py-2 font-bdo text-sm font-light text-white">
                                Scroll down
                            </span>
                            <button
                                type="button"
                                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/20 text-white/60"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
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
