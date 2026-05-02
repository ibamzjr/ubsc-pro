import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useEmblaNav } from "@/hooks/useEmblaNav";
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

    const { scrollPrev, scrollNext } = useEmblaNav(emblaApi);

    const [linkHovered, setLinkHovered] = useState(false);

    return (
        <div className="mx-auto mt-16 flex max-w-[95%] flex-col px-0 xl:px-0">
            <div className="px-8">
                <SectionDivider
                    number="05"
                    title="Berita"
                    subtitle="01/ homepage"
                    theme="dark"
                />
            </div>

            <h2 className="px-8 font-bdo text-[clamp(1.5rem,2.7vw,52px)] font-semibold text-white leading-[1.1]">
                Berita & Artikel
            </h2>

            {/* Desktop layout: left link, right text, nav buttons */}
            <div className="mt-8 mb-12 px-8 hidden xl:flex md:mt-32 items-center justify-between gap-8">
                <a
                    href="/coming-soon"
                    className="relative block w-80 cursor-pointer select-none overflow-hidden border-b border-white pb-3 transition-colors hover:border-white"
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
                        <span className="text-[clamp(1rem,1.04vw,20px)] font-medium text-white">
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
                            <Arrow size={20} />
                        </span>
                    </span>
                </a>
                <div className="flex-1 flex items-center justify-center">
                    <p className="font-bdo text-left font-light text-[clamp(1rem,1.25vw,24px)] leading-relaxed text-white max-w-2xl">
                        Komitmen kami adalah menghadirkan{" "}
                        <span className="font-semibold text-white">
                            ekosistem <br />olahraga yang inklusif.
                        </span>
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={scrollPrev}
                        aria-label="Previous articles"
                        className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-white text-white transition hover:bg-white hover:text-black"
                    >
                        <ChevronLeft size={22} />
                    </button>
                    <button
                        type="button"
                        onClick={scrollNext}
                        aria-label="Next articles"
                        className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-white text-black transition hover:bg-gray-200"
                    >
                        <ChevronRight size={22} />
                    </button>
                </div>
            </div>

            {/* Mobile/tablet: keep previous stacked/grid layout */}
            <div className="mt-8 mb-12 flex flex-col gap-6 px-8 md:mt-32 md:grid md:grid-cols-12 md:items-end md:gap-8 xl:hidden">
                <div className="order-1 md:order-none md:col-span-6">
                    <p className="font-bdo text-left font-light text-base sm:text-lg leading-relaxed text-white">
                        Komitmen kami adalah menghadirkan<br/>
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
                            <span className="text-[clamp(0.875rem,1.04vw,20px)] font-medium text-white">
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
