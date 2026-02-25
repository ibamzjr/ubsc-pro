import { ChevronRight } from "lucide-react";

export default function HeroBottomBar() {
    return (
        <div
            className="relative w-full overflow-hidden"
            style={{
                backgroundImage: `url('/assets/hero/Bottom.png')`,
                backgroundSize: "cover",
                backgroundPosition: "center bottom",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className="absolute left-0 right-0 top-0 border-t border-white/10" />

            <div className="flex w-full items-center justify-between px-8 py-8 lg:px-16 lg:py-10">
                <div className="flex items-center gap-2">
                    <span className="font-bdo text-lg font-medium text-white/40">
                        01/
                    </span>
                    <span className="font-bdo text-lg font-medium text-white/80">
                        homepage
                    </span>
                </div>

                <p className="hidden max-w-lg text-center font-bdo font-light text-lg leading-relaxed text-white lg:block">
                    <span className="font-bold text-white">
                        UB Sport Center –
                    </span>{" "}
                    Temukan fasilitas olahraga modern untuk berlatih,
                    berprestasi, dan berkembang bersama.
                </p>

                <div className="flex items-center gap-3">
                    <span className="font-bdo  font-light rounded-full border border-white/20 px-8 py-2.5 text-lg text-white transition-colors hover:border-white/40">
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
        </div>
    );
}
