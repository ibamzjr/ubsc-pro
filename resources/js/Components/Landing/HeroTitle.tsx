export default function HeroTitle() {
    return (
        <div className="pointer-events-none select-none max-w-full w-full">
            <div className="mb-6 flex items-center gap-2 lg:mb-8">
                <span className="font-bdo text-sm font-medium tracking-wide text-red-600 lg:text-xl">
                    © <span className="font-bold text-white">2026</span>
                </span>
            </div>

            <h1 className="font-archivo font-bold text-[clamp(3.5rem,12vw,13rem)] uppercase leading-[0.8] tracking-[-0.02em] text-white lg:text-[clamp(8rem,8vw,13rem)] max-w-full break-words">
                <span className="block">SPORT</span>
                <span className="relative block">
                    CENTER UB
                    <span className="ml-3 inline-block h-[clamp(12px,1.5vw,24px)] w-[clamp(12px,1.5vw,24px)] translate-y-[-30%] bg-accent-red lg:ml-6 lg:h-[clamp(16px,1.8vw,32px)] lg:w-[clamp(16px,1.8vw,32px)]" />
                </span>
            </h1>
        </div>
    );
}
