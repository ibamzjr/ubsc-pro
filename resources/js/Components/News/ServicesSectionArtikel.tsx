import { ArrowRight } from "lucide-react";
import NewsCard from "@/Components/Landing/NewsCard";
import type { NewsItem } from "@/Components/Landing/NewsCard";
import SectionDivider from "@/Components/Landing/SectionDivider";
import NewsHeroBg from "@/../assets/images/news-hero.avif";

interface DummyArtikelItem extends NewsItem {
    description: string;
}

const DUMMY_ARTIKEL: DummyArtikelItem[] = [
    {
        id: 1,
        title: "Dalam Pengembangan: Fitur artikel dan berita akan Segera Hadir",
        description:
            "Streaming is transforming how we watch movies and TV. Explore trends shaping 2025, including......",
        date: "26.02.2026",
        category: "Artikel",
        image: NewsHeroBg,
    },
    {
        id: 2,
        title: "Dalam Pengembangan: Fitur artikel dan berita akan Segera Hadir",
        description:
            "Streaming is transforming how we watch movies and TV. Explore trends shaping 2025, including......",
        date: "26.02.2026",
        category: "Artikel",
        image: "/assets/images/comingsoon.avif",
    },
    {
        id: 3,
        title: "Dalam Pengembangan: Fitur artikel dan berita akan Segera Hadir",
        description:
            "Streaming is transforming how we watch movies and TV. Explore trends shaping 2025, including......",
        date: "26.02.2026",
        category: "Artikel",
        image: "/assets/images/comingsoon.avif",
    },
    {
        id: 4,
        title: "Dalam Pengembangan: Fitur artikel dan berita akan Segera Hadir",
        description:
            "Streaming is transforming how we watch movies and TV. Explore trends shaping 2025, including......",
        date: "26.02.2026",
        category: "Artikel",
        image: "/assets/images/comingsoon.avif",
    },
    {
        id: 5,
        title: "Dalam Pengembangan: Fitur artikel dan berita akan Segera Hadir",
        description:
            "Streaming is transforming how we watch movies and TV. Explore trends shaping 2025, including......",
        date: "26.02.2026",
        category: "Artikel",
        image: "/assets/images/comingsoon.avif",
    },
    {
        id: 6,
        title: "Dalam Pengembangan: Fitur artikel dan berita akan Segera Hadir",
        description:
            "Streaming is transforming how we watch movies and TV. Explore trends shaping 2025, including......",
        date: "26.02.2026",
        category: "Artikel",
        image: "/assets/images/comingsoon.avif",
    },
    {
        id: 7,
        title: "Dalam Pengembangan: Fitur artikel dan berita akan Segera Hadir",
        description:
            "Streaming is transforming how we watch movies and TV. Explore trends shaping 2025, including......",
        date: "26.02.2026",
        category: "Artikel",
        image: "/assets/images/comingsoon.avif",
    },
];

const CARD_CLASS = "h-[clamp(22.5rem,19rem+9vw,30rem)] w-full";
const COMPACT_CARD_CLASS = "w-full aspect-[208/267]";

export default function ServicesSectionArtikel({
    articles,
}: {
    articles?: DummyArtikelItem[];
}) {
    const activeArticles =
        articles && articles.length > 0 ? articles : DUMMY_ARTIKEL;
    const [featured, ...rest] = activeArticles;

    return (
        <section
            className="bg-[#F5F7F9] overflow-x-clip py-12"
            id="artikel-content"
        >
            <div className="mx-auto max-w px-6 sm:px-10 xl:px-24">
                <SectionDivider
                    number="02"
                    title="Artikel Kami"
                    subtitle="News page /02"
                    theme="light"
                />

                {/* Header */}
                <div className="mt-10 flex flex-col xl:flex-row xl:items-end justify-between mb-8 xl:mb-12 gap-3 xl:gap-0">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <div className="size-[14px] xl:size-[17px] rounded-[5px] bg-[#ff0000] flex-shrink-0" />
                            <span className="font-bdo font-regular text-[clamp(1rem,1.25vw,1.5rem)] text-black">
                                Artikel Terbaru Kami
                            </span>
                        </div>
                        <h2 className="mt-10 font-bdo font-medium text-[clamp(2rem,2.7vw,52px)] leading-[1.1] tracking-[-0.021em] text-black  ">
                            Artikel Terkini Kami
                        </h2>
                    </div>
                    {/* Desktop-only nav link */}
                    <a
                        href="#"
                        className="hidden xl:flex items-center gap-2 font-bdo font-normal text-[clamp(1rem,1.25vw,24px)] text-[#ff0000] xl:flex-shrink-0 hover:gap-3 transition-all duration-300"
                    >
                        Lihat Selengkapnya
                        <ArrowRight size={18} />
                    </a>
                </div>

                {/* === MOBILE LAYOUT (hidden on xl+) === */}
                <div className="xl:hidden">
                    {/* 1. Featured card — full width */}
                    <NewsCard
                        {...featured}
                        description={undefined}
                        index={0}
                        layoutOverride="artikel"
                        className={CARD_CLASS}
                    />

                    {/* 2. Lihat Selengkapnya — right-aligned, immediately after featured */}
                    <div className="flex justify-end mt-3 mb-4">
                        <a
                            href="#"
                            className="flex items-center gap-2 font-bdo font-normal text-sm text-[#ff0000] hover:gap-3 transition-all duration-300"
                        >
                            Lihat Selengkapnya
                            <ArrowRight size={16} />
                        </a>
                    </div>

                    {/* 3. 2-column grid — remaining cards with Figma proportions */}
                    <div className="grid grid-cols-2 gap-3">
                        {rest.map((item, idx) => (
                            <NewsCard
                                key={item.id}
                                {...item}
                                index={idx + 1}
                                layoutOverride="artikel"
                                className={COMPACT_CARD_CLASS}
                                compact
                            />
                        ))}
                    </div>
                </div>

                {/* === DESKTOP LAYOUT (hidden on mobile) === */}
                <div className="hidden xl:grid xl:grid-cols-4 xl:gap-8 pb-12">
                    <div className="xl:col-span-2">
                        <NewsCard
                            {...featured}
                            description={undefined}
                            index={0}
                            layoutOverride="artikel"
                            className={CARD_CLASS}
                        />
                    </div>
                    {rest.map((item, idx) => (
                        <div key={item.id} className="col-span-1">
                            <NewsCard
                                {...item}
                                index={idx + 1}
                                layoutOverride="artikel"
                                className={CARD_CLASS}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
