import { ArrowRight } from "lucide-react";
import NewsCard from "@/Components/Landing/NewsCard";
import type { NewsItem } from "@/Components/Landing/NewsCard";

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
        image: "/assets/images/gym-konten-1-olahraga-ub-sport-center.avif",
    },
    {
        id: 2,
        title: "Dalam Pengembangan: Fitur artikel dan berita akan Segera Hadir",
        description:
            "Streaming is transforming how we watch movies and TV. Explore trends shaping 2025, including......",
        date: "26.02.2026",
        category: "Artikel",
        image: "/assets/images/ub-sport-center-kantor-pusat-malang.avif",
    },
    {
        id: 3,
        title: "Dalam Pengembangan: Fitur artikel dan berita akan Segera Hadir",
        description:
            "Streaming is transforming how we watch movies and TV. Explore trends shaping 2025, including......",
        date: "26.02.2026",
        category: "Artikel",
        image: "/assets/images/fasilitas-arena-terbuka-dieng-ub-sport-center-malang.avif",
    },
    {
        id: 4,
        title: "Dalam Pengembangan: Fitur artikel dan berita akan Segera Hadir",
        description:
            "Streaming is transforming how we watch movies and TV. Explore trends shaping 2025, including......",
        date: "26.02.2026",
        category: "Artikel",
        image: "/assets/images/fasilitas-arena-terbuka-dieng-ub-sport-center-malang.avif",
    },
    {
        id: 5,
        title: "Dalam Pengembangan: Fitur artikel dan berita akan Segera Hadir",
        description:
            "Streaming is transforming how we watch movies and TV. Explore trends shaping 2025, including......",
        date: "26.02.2026",
        category: "Artikel",
        image: "/assets/images/ub-sport-center-kantor-pusat-malang.avif",
    },
    {
        id: 6,
        title: "Dalam Pengembangan: Fitur artikel dan berita akan Segera Hadir",
        description:
            "Streaming is transforming how we watch movies and TV. Explore trends shaping 2025, including......",
        date: "26.02.2026",
        category: "Artikel",
        image: "/assets/images/fasilitas-arena-terbuka-dieng-ub-sport-center-malang.avif",
    },
    {
        id: 7,
        title: "Dalam Pengembangan: Fitur artikel dan berita akan Segera Hadir",
        description:
            "Streaming is transforming how we watch movies and TV. Explore trends shaping 2025, including......",
        date: "26.02.2026",
        category: "Artikel",
        image: "/assets/images/gym-konten-1-olahraga-ub-sport-center.avif",
    },
];

const CARD_CLASS = "h-[420px] xl:h-[530px] w-full";

export default function ServicesSectionArtikel() {
    const [featured, rightTop, rightBottom, ...bottom4] = DUMMY_ARTIKEL;

    return (
        <section
            className="bg-[#F5F7F9] overflow-x-clip py-12 xl:py-24"
            id="artikel-content"
        >
            <div className="max-w-8xl mx-auto px-4 sm:px-8 xl:px-16">

                {/* Header */}
                <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-8 xl:mb-12 gap-3 xl:gap-0">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <div className="size-[14px] xl:size-[17px] rounded-[5px] bg-accent-red flex-shrink-0" />
                            <span className="font-bdo font-normal text-[18px] xl:text-[24px] text-black">
                                Artikel Terbaru Kami
                            </span>
                        </div>
                        <h2 className="font-bdo font-medium text-[clamp(1.75rem,4vw,3.25rem)] text-black leading-none">
                            Artikel Terkini Kami
                        </h2>
                    </div>
                    <a
                        href="#"
                        className="flex items-center gap-2 font-bdo font-normal text-[18px] xl:text-[24px] text-accent-red self-start xl:flex-shrink-0 hover:gap-3 transition-all duration-300"
                    >
                        Lihat Selengkapnya
                        <ArrowRight size={18} />
                    </a>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6 xl:gap-8">
                    <div className="col-span-1 xl:col-span-2 order-last xl:order-none">
                        <NewsCard
                            {...featured}
                            description={undefined}
                            index={0}
                            layoutOverride="artikel"
                            className={CARD_CLASS}
                        />
                    </div>

                    <div className="col-span-1">
                        <NewsCard
                            {...rightTop}
                            index={1}
                            layoutOverride="artikel"
                            className={CARD_CLASS}
                        />
                    </div>

                    <div className="col-span-1">
                        <NewsCard
                            {...rightBottom}
                            index={2}
                            layoutOverride="artikel"
                            className={CARD_CLASS}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 xl:gap-8 mt-4 sm:mt-6 xl:mt-8">
                    {bottom4.map((item, idx) => (
                        <div key={item.id} className="col-span-1">
                            <NewsCard
                                {...item}
                                index={idx}
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
