export interface NewsItem {
    id: string | number;
    title: string;
    date: string;
    category: "Berita" | "Artikel";
    image: string;
}

interface NewsCardProps extends NewsItem {
    index: number;
}

export default function NewsCard({
    title,
    date,
    category,
    image,
    index,
}: NewsCardProps) {
    const isImageTop = index % 2 === 0;

    return (
        <article className="group flex h-[450px] w-[300px] flex-shrink-0 cursor-pointer flex-col border border-white/10 sm:w-[320px]">
            {isImageTop ? (
                <>
                    <div className="relative h-1/2 overflow-hidden">
                        <img
                            src={image}
                            alt={title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            draggable={false}
                        />
                        <span className="absolute left-4 top-4 bg-red-600 px-3 py-1 text-xs font-bold text-white">
                            {category}
                        </span>
                    </div>

                    <div className="flex h-1/2 flex-col justify-between bg-white p-6">
                        <p className="line-clamp-3 text-xl font-bold leading-snug tracking-tight text-black">
                            {title}
                        </p>
                        <span className="text-sm font-medium text-gray-500">
                            {date}
                        </span>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex h-1/2 flex-col justify-between bg-black p-6">
                        <span className="text-sm font-medium text-gray-400">
                            {date}
                        </span>
                        <p className="line-clamp-3 text-xl font-bold leading-snug tracking-tight text-white">
                            {title}
                        </p>
                    </div>

                    <div className="relative h-1/2 overflow-hidden">
                        <img
                            src={image}
                            alt={title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            draggable={false}
                        />
                        <span className="absolute bottom-4 left-4 bg-[#004b79] px-3 py-1 text-xs font-bold text-white">
                            {category}
                        </span>
                    </div>
                </>
            )}
        </article>
    );
}
