import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import NewsCard from "@/Components/Landing/NewsCard";
import type { NewsItem } from "@/Components/Landing/NewsCard";
import CurvedLoop from "@/Components/Landing/CurvedLoop";
import person from "@/../assets/images/person.avif";
import bg from "@/../assets/images/bg-about.avif";
import SectionDivider from "../Landing/SectionDivider";
import NewsHeroBg from "@/../assets/images/news-hero.avif";

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
        image: NewsHeroBg,
    },
    {
        id: 2,
        title: "Dalam Pengembangan: Fitur artikel dan berita akan Segera Hadir",
        description:
            "Streaming is transforming how we watch movies and TV. Explore trends shaping 2025, including......",
        date: "26.02.2026",
        category: "Berita",
        image: "/assets/images/comingsoon.avif",
    },
    {
        id: 3,
        title: "Dalam Pengembangan: Fitur artikel dan berita akan Segera Hadir",
        description:
            "Streaming is transforming how we watch movies and TV. Explore trends shaping 2025, including......",
        date: "26.02.2026",
        category: "Berita",
        image: "/assets/images/comingsoon.avif",
    },
    {
        id: 4,
        title: "Dalam Pengembangan: Fitur artikel dan berita akan Segera Hadir",
        description:
            "Streaming is transforming how we watch movies and TV. Explore trends shaping 2025, including......",
        date: "26.02.2026",
        category: "Berita",
        image: "/assets/images/comingsoon.avif",
    },
    {
        id: 5,
        title: "Dalam Pengembangan: Fitur artikel dan berita akan Segera Hadir",
        description:
            "Streaming is transforming how we watch movies and TV. Explore trends shaping 2025, including......",
        date: "26.02.2026",
        category: "Berita",
        image: "/assets/images/comingsoon.avif",
    },
    {
        id: 6,
        title: "Dalam Pengembangan: Fitur artikel dan berita akan Segera Hadir",
        description:
            "Streaming is transforming how we watch movies and TV. Explore trends shaping 2025, including......",
        date: "26.02.2026",
        category: "Berita",
        image: "/assets/images/comingsoon.avif",
    },
];

const CARD_CLASS = "h-[clamp(22.5rem,19rem+9vw,30rem)] w-full";
const COMPACT_CARD_CLASS = "w-full aspect-[208/267]";

function useResponsiveCurve(mobile: number, desktop: number): number {
    const [curve, setCurve] = useState<number>(() =>
        typeof window !== "undefined" && window.innerWidth < 1280
            ? mobile
            : desktop,
    );
    useEffect(() => {
        const update = () =>
            setCurve(window.innerWidth < 1280 ? mobile : desktop);
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [mobile, desktop]);
    return curve;
}

export default function ServicesSectionNews({
    news,
}: {
    news?: DummyNewsItem[];
}) {
    const curveAmount = useResponsiveCurve(120, 200);
    const activeNews = news && news.length > 0 ? news : DUMMY_NEWS;
    const [featured, standard, ...bottom4] = activeNews;

    const unggulanBg = {
        background:
            "linear-gradient(266deg, #15678d 3%, #173859 61%, #002244 97%)",
    } as const;

    // Mobile: same CARD_CLASS height; video uses absolute inset-0 to truly fill flex-1
    const unggulanCardMobile = (
        <div
            className="w-full flex flex-col p-6 overflow-hidden"
            style={unggulanBg}
        >
            <div className="flex items-center justify-center gap-2 mb-2">
                <p className="font-bdo font-medium text-[0.75rem] text-white text-center">
                    Unggulan Kami
                </p>
            </div>
            <p className="font-bdo font-medium text-[0.875rem] text-white text-center leading-snug">
                Dalam Pengembangan: Fitur artikel dan berita akan Segera Hadir
            </p>
            <div className="mt-4 rounded-sm overflow-hidden">
                <video
                    src="/assets/reels/tennis vid.mp4"
                    className="w-full h-auto block"
                    autoPlay
                    loop
                    muted
                    playsInline
                />
            </div>
        </div>
    );

    // Desktop: fixed card height with flex-1 video container
    const unggulanCardDesktop = (
        <div
            className={`${CARD_CLASS} flex flex-col p-6 overflow-hidden`}
            style={unggulanBg}
        >
            <div className="flex items-center justify-center gap-2 mb-2">
                <p className="font-bdo font-medium text-[clamp(0.75rem,0.73vw,0.875rem)] text-white text-center">
                    Unggulan Kami
                </p>
            </div>
            <p className="font-bdo font-medium text-[clamp(0.875rem,0.83vw,1rem)] text-white text-center leading-snug">
                Dalam Pengembangan: Fitur artikel dan berita akan Segera Hadir
            </p>
            <div className="flex-1 mt-4 bg-black/40 rounded-sm overflow-hidden">
                <video
                    src="/assets/reels/tennis vid.mp4"
                    className="h-full w-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                />
            </div>
        </div>
    );

    return (
        <section className="bg-[#F5F7F9] overflow-x-clip" id="news-content">
            <div className="mx-auto max-w px-6 py-8 sm:px-10 sm:py-12 xl:px-24">
                <SectionDivider
                    number="01"
                    title="Berita Kami"
                    subtitle="Newspage /01"
                    theme="light"
                />

                {/* Header */}
                <div className="mt-10 flex flex-col xl:flex-row xl:items-end justify-between mb-8 xl:mb-12 gap-3 xl:gap-0">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <div className="size-[14px] xl:size-[17px] rounded-[5px] bg-[#ff0000] flex-shrink-0" />
                            <span className="font-bdo font-regular text-[clamp(1rem,1.25vw,1.5rem)] text-black">
                                Berita Terbaru Kami
                            </span>
                        </div>
                        <h2 className="mt-10 font-bdo font-medium text-[clamp(2rem,2.7vw,3.25rem)] leading-[1.1] tracking-[-0.021em] text-black">
                            Berita Terkini Kami
                        </h2>
                    </div>
                    {/* Desktop-only nav link */}
                    <a
                        href="#"
                        className="hidden xl:flex items-center gap-2 font-bdo font-normal text-[clamp(1rem,1.25vw,1.5rem)] text-[#ff0000] xl:flex-shrink-0 hover:gap-3 transition-all duration-300"
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
                        layoutOverride="berita"
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

                    {/* 3. 2-column grid — remaining news cards */}
                    <div className="grid grid-cols-2 gap-3">
                        {[standard, ...bottom4].map((item, idx) => (
                            <NewsCard
                                key={item.id}
                                {...item}
                                index={idx + 1}
                                layoutOverride="berita"
                                className={COMPACT_CARD_CLASS}
                                compact
                            />
                        ))}
                    </div>

                    {/* 4. Unggulan — last on mobile */}
                    <div className="mt-3">{unggulanCardMobile}</div>
                </div>

                {/* === DESKTOP LAYOUT (hidden on mobile) === */}
                <div className="hidden xl:grid xl:grid-cols-4 xl:gap-8 pb-12">
                    {/* Featured — spans 2 cols */}
                    <div className="xl:col-span-2">
                        <NewsCard
                            {...featured}
                            description={undefined}
                            index={0}
                            layoutOverride="berita"
                            className={CARD_CLASS}
                        />
                    </div>
                    {/* Standard — col 3 */}
                    <div className="col-span-1">
                        <NewsCard
                            {...standard}
                            index={1}
                            layoutOverride="berita"
                            className={CARD_CLASS}
                        />
                    </div>
                    {/* Unggulan — col 4 (same row as featured) */}
                    <div className="col-span-1">{unggulanCardDesktop}</div>
                    {/* Bottom 4 news */}
                    {bottom4.map((item, idx) => (
                        <div key={item.id} className="col-span-1">
                            <NewsCard
                                {...item}
                                index={idx + 2}
                                layoutOverride="berita"
                                className={CARD_CLASS}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* CurvedLoop — very bottom */}
            <div
                className="relative mx-4 overflow-hidden py-36 xl:mx-16 xl:mb-12 xl:py-52"
                style={{
                    backgroundImage: `url(${bg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <CurvedLoop
                    marqueeText="UB   ✦   SPORT  ✦  CENTER   ✦   UBSC   ✦   "
                    speed={1.5}
                    curveAmount={curveAmount}
                    direction="left"
                    interactive
                    className="z-100 absolute -top-12 h-full xl:-top-16"
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <img
                        src={person}
                        alt="UB Sport Center athlete"
                        className="h-44 w-auto object-cover shadow-2xl md:h-64 xl:h-80"
                    />
                </div>
            </div>
        </section>
    );
}
