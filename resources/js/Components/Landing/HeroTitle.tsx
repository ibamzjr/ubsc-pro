export default function HeroTitle() {
    return (
        <div className="pointer-events-none select-none max-w-full w-full px-0 md:px-0">
            {/* Header Year */}
            <div className="mb-4 flex items-center gap-2 lg:mb-4">
                <span className="font-bdo text-xs font-medium tracking-wide text-red-600 sm:text-sm lg:text-xl">
                    © <span className="font-medium text-white">2026</span>
                </span>
            </div>

            <h1 className="font-archivo font-bold uppercase tracking-[-0.03em] text-white leading-[0.8] 
    text-[clamp(3.7rem,14vw,4.5rem)]   /* Mobile */
    md:text-[clamp(4.5rem,10vw,7rem)]   /* Tablet */
    lg:text-[clamp(6rem,8vw,8.5rem)]    /* Resolusi 1125px - 1180px (Titik Aman) */
    xl:text-[clamp(8rem,9vw,11.5rem)]   /* Desktop (Max diturunkan dari 13rem ke 11.5rem) */
    max-w-full break-words">
    
    <span className="block">SPORT</span>
    
    <span className="flex flex-wrap items-baseline mb-5 gap-x-4 md:gap-x-6 lg:block">
    <span className="mr-2 md:mr-4 lg:mr-6">CENTER</span>
    <span className="inline-flex items-baseline">
        UB
        <span className="ml-1 inline-block bg-accent-red
            h-[clamp(10px,2vw,14px)] w-[clamp(10px,2vw,14px)] 
            md:h-[18px] md:w-[18px] 
            lg:h-[22px] lg:w-[22px]
            xl:ml-3 xl:h-[28px] xl:w-[28px] 
            translate-y-[-10%]" 
        />
    </span>
</span>
</h1>

        </div>
    );
}
