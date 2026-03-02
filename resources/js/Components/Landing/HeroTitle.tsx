export default function HeroTitle() {
    return (
        <div className="pointer-events-none select-none max-w-full w-full">
            <div className="mb-6 flex items-center gap-2 lg:mb-8">
                <span className="font-bdo text-sm font-medium tracking-wide text-red-600 lg:text-xl">
                    © <span className="font-medium text-white">2026</span>
                </span>
            </div>

            <h1 className="font-archivo font-bold text-[clamp(2.5rem,8vw,6rem)] sm:text-[clamp(3rem,10vw,8rem)] md:text-[clamp(3.5rem,12vw,10rem)] xl:text-[clamp(8rem,8vw,13rem)] uppercase leading-[0.9] tracking-[-0.02em] text-white max-w-full break-words whitespace-nowrap">
                <span className="block">SPORT</span>
                <span className="block">
                    CENTER UB
                    <span className="ml-2 inline-block h-[clamp(10px,2vw,18px)] w-[clamp(10px,2vw,18px)] translate-y-[-15%] bg-accent-red xl:ml-6 xl:h-[clamp(16px,1.8vw,32px)] xl:w-[clamp(16px,1.8vw,32px)]" />
                </span>
            </h1>
        </div>
    );
}
