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
}: NewsCardProps) {
    const isImageTop =
        layoutOverride === "berita" ? true :
        layoutOverride === "artikel" ? false :
        index % 2 === 0;

    const outerClass = className ?? "h-[450px] w-[300px] flex-shrink-0";

    return (
        <article className={`group cursor-pointer flex flex-col border border-white/10 ${outerClass}`}>
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
                            className="absolute left-4 top-4 px-3 py-1 text-xs font-bold text-white rounded-[5px]"
                            style={{ background: "linear-gradient(to right, red, #790a0a)" }}
                        >
                            {category}
                        </span>
                    </div>

                    <div className="flex flex-1 flex-col justify-between bg-white p-6">
                        <div className="flex flex-col gap-1">
                            <p className="line-clamp-3 font-bdo font-medium text-[clamp(1rem,1.25vw,24px)] leading-snug text-black">
                                {title}
                            </p>
                            {description && (
                                <p className="font-bdo font-normal text-[clamp(0.875rem,0.83vw,16px)] text-black/70 line-clamp-3 mt-1">
                                    {description}
                                </p>
                            )}
                        </div>
                        <span className="font-bdo font-normal text-[clamp(1rem,1.04vw,20px)] text-black/70">
                            {date}
                        </span>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex flex-[0_0_44%] flex-col justify-between bg-black p-6">
                        <span className="font-bdo font-normal text-[clamp(1rem,1.04vw,20px)] text-white/70">
                            {date}
                        </span>
                        <div className="flex flex-col gap-1">
                            <p className="line-clamp-3 font-bdo font-medium text-[clamp(1rem,1.25vw,24px)] leading-snug text-white">
                                {title}
                            </p>
                            {description && (
                                <p className="font-bdo font-normal text-[clamp(0.875rem,0.83vw,16px)] text-white/70 line-clamp-3 mt-1">
                                    {description}
                                </p>
                            )}
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
                            className="absolute bottom-4 left-4 px-3 py-1 text-xs font-bold text-white rounded-[5px]"
                            style={{ background: "linear-gradient(to right, #153359, #15678d)" }}
                        >
                            {category}
                        </span>
                    </div>
                </>
            )}
        </article>
    );
}
