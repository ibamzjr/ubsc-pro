export interface NewsItem {
    id: string | number;
    title: string;
    date: string;
    category: "Berita" | "Artikel";
    image: string;
    description?: string;
}

interface NewsCardProps extends NewsItem {
    index: number;
    layoutOverride?: "berita" | "artikel" | "alternate";
    className?: string;
    compact?: boolean;
}

export default function NewsCard({
    title,
    date,
    category,
    image,
    description,
    index,
    layoutOverride,
    className,
    compact = false,
}: NewsCardProps) {
    const isImageTop =
        layoutOverride === "berita"
            ? true
            : layoutOverride === "artikel"
              ? false
              : index % 2 === 0;

    const outerClass =
        className ??
        "h-[clamp(21.875rem,18rem+10vw,28.125rem)] w-[clamp(17.5rem,15rem+8vw,21.875rem)] flex-shrink-0";

    const titleClass = compact
        ? "text-[12px] xl:text-[clamp(1rem,1.25vw,24px)]"
        : "text-[clamp(1rem,1.25vw,24px)]";

    const descClass = compact
        ? "text-[8px] xl:text-[clamp(0.875rem,0.83vw,16px)]"
        : "text-[clamp(0.875rem,0.83vw,16px)]";

    const dateClass = compact
        ? "text-[10px] xl:text-[clamp(1rem,0.75vw,20px)]"
        : "text-[clamp(1rem,0.75vw,20px)]";

    const padClass = compact ? "p-3 xl:p-6" : "p-6";

    return (
        <article
            className={`group cursor-pointer flex flex-col border border-white/10 overflow-hidden ${outerClass}`}
        >
            {isImageTop ? (
                <>
                    <div className="relative flex-[0_0_44%] overflow-hidden">
                        <img
                            src={image}
                            alt={title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            draggable={false}
                            loading="lazy"
                        />
                        <span
                            className="absolute left-3 top-3 px-2 py-0.5 text-[10px] font-medium text-white rounded-[4px] xl:left-4 xl:top-4 xl:px-3 xl:py-1 xl:text-xs"
                            style={{
                                background:
                                    "linear-gradient(to right, #790a0a, #FF0000)",
                            }}
                        >
                            {category}
                        </span>
                    </div>

                    <div
                        className={`flex flex-1 flex-col justify-between bg-white ${padClass}`}
                    >
                        <div className="flex flex-col gap-1">
                            <p
                                className={`line-clamp-3 font-bdo font-medium leading-snug text-black ${titleClass}`}
                            >
                                {title}
                            </p>
                            {description && (
                                <p
                                    className={`font-bdo font-normal text-black/70 line-clamp-3 mt-1 ${descClass}`}
                                >
                                    {description}
                                </p>
                            )}
                        </div>
                        <span
                            className={`font-bdo font-normal text-black/70 ${dateClass}`}
                        >
                            {date}
                        </span>
                    </div>
                </>
            ) : (
                <>
                    <div
                        className={`flex flex-[0_0_44%] flex-col justify-between bg-black ${padClass}`}
                    >
                        <span
                            className={`font-bdo font-normal text-white/70 ${dateClass}`}
                        >
                            {date}
                        </span>
                        <div className="flex flex-col gap-1">
                            {description && (
                                <p
                                    className={`font-bdo font-normal text-white/70 line-clamp-3 mt-1 ${descClass}`}
                                >
                                    {description}
                                </p>
                            )}
                            <p
                                className={`line-clamp-3 font-bdo font-medium leading-snug text-white mt-2 ${titleClass}`}
                            >
                                {title}
                            </p>
                        </div>
                    </div>

                    <div className="relative flex-1 overflow-hidden">
                        <img
                            src={image}
                            alt={title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            draggable={false}
                            loading="lazy"
                        />
                        <span
                            className="absolute bottom-3 left-3 px-2 py-0.5 text-[10px] font-medium text-white rounded-[4px] xl:bottom-4 xl:left-4 xl:px-3 xl:py-1 xl:text-xs"
                            style={{
                                background:
                                    "linear-gradient(to right, #15678d, #153359)",
                            }}
                        >
                            {category}
                        </span>
                    </div>
                </>
            )}
        </article>
    );
}
