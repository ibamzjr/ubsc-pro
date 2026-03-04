import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import SectionDivider from "@/Components/Landing/SectionDivider";
import NewsCard from "@/Components/Landing/NewsCard";
import type { NewsItem } from "@/Components/Landing/NewsCard";

const Arrow: React.FC<{ size?: number }> = ({ size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <path
            d="M12 32H52M52 32L34 14M52 32L34 50"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const DUMMY_NEWS: NewsItem[] = [
    {
        id: 1,
        title: "Dalam Pengembangan: Fitur artikel dan berita akan Segera Hadir",
        date: "26.02.2026",
        category: "Berita",
        image: "/assets/images/comingsoon.avif",
    },
    {
        id: 2,
        title: "Dalam Pengembangan: Fitur artikel dan berita akan Segera Hadir",
        date: "26.02.2026",
        category: "Artikel",
        image: "/assets/images/comingsoon.avif",
    },
    {
        id: 3,
        title: "Dalam Pengembangan: Fitur artikel dan berita akan Segera Hadir",
        date: "24.02.2026",
        category: "Berita",
        image: "/assets/images/comingsoon.avif",
    },
    {
        id: 4,
        title: "Dalam Pengembangan: Fitur artikel dan berita akan Segera Hadir",
        date: "22.02.2026",
        category: "Artikel",
        image: "/assets/images/comingsoon.avif",
    },
    {
        id: 5,
        title: "Dalam Pengembangan: Fitur artikel dan berita akan Segera Hadir",
        date: "20.02.2026",
        category: "Berita",
        image: "/assets/images/comingsoon.avif",
    },
    {
        id: 6,
        title: "Dalam Pengembangan: Fitur artikel dan berita akan Segera Hadir",
        date: "18.02.2026",
        category: "Artikel",
        image: "/assets/images/comingsoon.avif",
    },
    {
        id: 7,
        title: "Dalam Pengembangan: Fitur artikel dan berita akan Segera Hadir",
        date: "18.02.2026",
        category: "Artikel",
        image: "/assets/images/comingsoon.avif",
    },
];

interface NewsSectionProps {
    news?: NewsItem[];
}

export default function NewsSection({ news = DUMMY_NEWS }: NewsSectionProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "start",
        dragFree: true,
    });

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    const [linkHovered, setLinkHovered] = useState(false);

    return (
        <div className="mx-auto mt-16 flex max-w-[95%] flex-col px-0 xl:px-0">
            <div className="px-8">
                <SectionDivider
                    number="04"
                    title="Berita"
                    subtitle="01/ homepage"
                    theme="dark"
                />
            </div>

            <h2 className="px-8 font-bdo text-4xl font-semibold text-white md:text-4xl xl:text-5xl">
                Berita & Artikel
            </h2>

            <div className="mt-8 mb-12 flex flex-col gap-6 px-8 md:mt-32 md:grid md:grid-cols-12 md:items-end md:gap-8">
                <div className="order-1 md:order-none md:col-span-6">
                    <p className="font-bdo font-light text-base sm:text-lg leading-relaxed text-white">
                        Komitmen kami adalah menghadirkan{" "}
                        <strong className="font-medium text-white">
                            ekosistem olahraga yang inklusif.
                        </strong>
                    </p>
                </div>
                <div className="order-2 flex items-center justify-between gap-4 md:order-none md:col-span-6 md:justify-end">
                    <a
                        href="/coming-soon"
                        className="relative block w-full max-w-[220px] cursor-pointer select-none overflow-hidden border-b border-gray-500 pb-3 transition-colors hover:border-white"
                        onMouseEnter={() => setLinkHovered(true)}
                        onMouseLeave={() => setLinkHovered(false)}
                    >
                        <span
                            aria-hidden
                            className="pointer-events-none absolute bg-accent-red"
                            style={{
                                top: "-50%",
                                left: "-5%",
                                right: "-5%",
                                bottom: "-50%",
                                transform: linkHovered
                                    ? "skewY(-5deg) translateY(0%)"
                                    : "skewY(-5deg) translateY(130%)",
                                transition:
                                    "transform 0.55s cubic-bezier(0.76, 0, 0.24, 1)",
                                zIndex: 0,
                            }}
                        />
                        <span className="pointer-events-none relative z-10 flex w-full items-center justify-between">
                            <span className="font-clash text-sm xl:text-xl font-medium text-white">
                                Lihat Selengkapnya
                            </span>
                            <span
                                style={{
                                    transform: linkHovered
                                        ? "rotate(0deg)"
                                        : "rotate(-45deg)",
                                    transition:
                                        "transform 0.55s cubic-bezier(0.76, 0, 0.24, 1)",
                                }}
                            >
                                <Arrow size={16} />
                            </span>
                        </span>
                    </a>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={scrollPrev}
                            aria-label="Previous articles"
                            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-gray-600 text-white transition hover:bg-white hover:text-black"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            type="button"
                            onClick={scrollNext}
                            aria-label="Next articles"
                            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white text-black transition hover:bg-gray-200"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden px-8" ref={emblaRef}>
                <div className="flex gap-6">
                    {news.map((item, i) => (
                        <NewsCard key={item.id} {...item} index={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}
