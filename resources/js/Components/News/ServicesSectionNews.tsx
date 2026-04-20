import { ArrowRight } from "lucide-react";
import NewsCard from "@/Components/Landing/NewsCard";
import type { NewsItem } from "@/Components/Landing/NewsCard";
import CurvedLoop from "@/Components/Landing/CurvedLoop";
import person from "@/../assets/images/person.avif";
import bg from "@/../assets/images/bg-about.avif";

interface DummyNewsItem extends NewsItem {
    description: string;
}

const DUMMY_NEWS: DummyNewsItem[] = [
    {
        id: 1,
        title: "Dalam Pengembangan: Fitur artikel dan berita akan Segera Hadir",
        description:
            "Streaming is transforming how we watch movies and TV. Explore trends shaping 2025, including......",
        date: "26.02.2026",
        category: "Berita",
        image: "/assets/images/gym-konten-1-olahraga-ub-sport-center.avif",
    },
    {
        id: 2,
        title: "Dalam Pengembangan: Fitur artikel dan berita akan Segera Hadir",
        description:
            "Streaming is transforming how we watch movies and TV. Explore trends shaping 2025, including......",
        date: "26.02.2026",
        category: "Berita",
        image: "/assets/images/fasilitas-arena-terbuka-dieng-ub-sport-center-malang.avif",
    },
    {
        id: 3,
        title: "Dalam Pengembangan: Fitur artikel dan berita akan Segera Hadir",
        description:
            "Streaming is transforming how we watch movies and TV. Explore trends shaping 2025, including......",
        date: "26.02.2026",
        category: "Berita",
        image: "/assets/images/fasilitas-arena-terbuka-dieng-ub-sport-center-malang.avif",
    },
    {
        id: 4,
        title: "Dalam Pengembangan: Fitur artikel dan berita akan Segera Hadir",
        description:
            "Streaming is transforming how we watch movies and TV. Explore trends shaping 2025, including......",
        date: "26.02.2026",
        category: "Berita",
        image: "/assets/images/fasilitas-arena-terbuka-dieng-ub-sport-center-malang.avif",
    },
    {
        id: 5,
        title: "Dalam Pengembangan: Fitur artikel dan berita akan Segera Hadir",
        description:
            "Streaming is transforming how we watch movies and TV. Explore trends shaping 2025, including......",
        date: "26.02.2026",
        category: "Berita",
        image: "/assets/images/fasilitas-arena-terbuka-dieng-ub-sport-center-malang.avif",
    },
    {
        id: 6,
        title: "Dalam Pengembangan: Fitur artikel dan berita akan Segera Hadir",
        description:
            "Streaming is transforming how we watch movies and TV. Explore trends shaping 2025, including......",
        date: "26.02.2026",
        category: "Berita",
        image: "/assets/images/fasilitas-arena-terbuka-dieng-ub-sport-center-malang.avif",
    },
];

const CARD_CLASS = "h-[420px] xl:h-[530px] w-full";

export default function ServicesSectionNews() {
    const [featured, standard, ...bottom4] = DUMMY_NEWS;

    return (
        <section className="bg-[#F5F7F9] overflow-x-clip" id="news-content">
            <div className="max-w-8xl mx-auto px-4 sm:px-8 xl:px-16 pt-12 xl:pt-24">
                <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-8 xl:mb-12 gap-3 xl:gap-0">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <div className="size-[14px] xl:size-[17px] rounded-[5px] bg-accent-red flex-shrink-0" />
                            <span className="font-bdo font-normal text-[18px] xl:text-[24px] text-black">
                                Berita Terbaru Kami
                            </span>
                        </div>
                        <h2 className="font-bdo font-medium text-[clamp(1.75rem,4vw,3.25rem)] text-black leading-none">
                            Berita Terkini Kami
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

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 xl:gap-8 pb-12 xl:pb-24">
                    <div className="col-span-1 sm:col-span-2 xl:col-span-2 order-last sm:order-first xl:order-none">
                        <NewsCard
                            {...featured}
                            description={undefined}
                            index={0}
                            layoutOverride="berita"
                            className={CARD_CLASS}
                        />
                    </div>

                    <div className="col-span-1">
                        <NewsCard
                            {...standard}
                            index={1}
                            layoutOverride="berita"
                            className={CARD_CLASS}
                        />
                    </div>

                    <div className="col-span-1 order-[998] xl:order-none">
                        <div
                            className="h-[420px] xl:h-[530px] w-full flex flex-col p-6 overflow-hidden"
                            style={{
                                background:
                                    "linear-gradient(266deg, #15678d 3%, #173859 61%, #002244 97%)",
                            }}
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <div className="size-[17px] rounded-[5px] bg-accent-red flex-shrink-0" />
                                <p className="font-bdo font-medium text-[14px] text-white">
                                    Unggulan Kami
                                </p>
                            </div>

                            <p className="font-bdo font-medium text-[15px] text-white leading-snug max-w-[200px]">
                                Dalam Pengembangan: Fitur artikel dan berita
                                akan Segera Hadir
                            </p>

                            <div className="flex-1 mt-4 bg-black/40 rounded-sm flex items-center justify-center">
                                <video
                                    src="/assets/reels/reels ubsc 1.mp4"
                                    className="h-full w-full object-cover"
                                    autoPlay
                                    loop
                                    muted
                                />
                            </div>
                        </div>
                    </div>

                    {bottom4.map((item, idx) => (
                        <div key={item.id} className="col-span-1">
                            <NewsCard
                                {...item}
                                index={idx}
                                layoutOverride="berita"
                                className={CARD_CLASS}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div
                className="relative py-24 xl:py-32 overflow-hidden"
                style={{ background: `url(${bg}) repeat` }}
            >
                <CurvedLoop
                    marqueeText="UB * SPORT CENTER * "
                    speed={1.5}
                    curveAmount={80}
                    direction="left"
                    interactive
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <img
                        src={person}
                        alt="UB Sport Center athlete"
                        className="h-64 xl:h-80 w-auto object-cover shadow-2xl"
                    />
                </div>
            </div>
        </section>
    );
}
