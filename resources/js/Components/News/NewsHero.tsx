import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import AnimatedBookingLink from "@/Components/News/AnimatedBookingLink";
import HeroBottomBar from "@/Components/Landing/HeroBottomBar";
import TopBg from "@/../assets/hero/Top.png";

const PrevArrow = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M26 16H6M6 16L16 6M6 16L16 26"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const NextArrow = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M6 16H26M26 16L16 6M26 16L16 26"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

interface NewsSlide {
    id: number;
    badge: string;
    title: string;
    description: string;
    date: string;
    image: string;
}

const DUMMY_NEWS_SLIDES: NewsSlide[] = [
    {
        id: 1,
        badge: "Berita",
        title: "The Future of Streaming: What to Expect From Movies and TV in 2025",
        description:
            "Streaming is transforming how we watch movies and TV. Explore trends shaping 2025, including new technologies, content strategies, and viewer habits.",
        date: "26.02.2026",
        image: "/assets/images/ub-sport-center-kantor-pusat-malang.avif",
    },
    {
        id: 2,
        badge: "Artikel",
        title: "Dalam Pengembangan: Fitur artikel dan berita akan Segera Hadir",
        description:
            "Konten berita UB Sport Center sedang dalam pengembangan. Nantikan pembaruan terbaru dari kami.",
        date: "26.02.2026",
        image: "/assets/images/ub-sport-center-kantor-pusat-malang.avif",
    },
    {
        id: 3,
        badge: "Berita",
        title: "Raih Performa Terbaik Dengan Paket Fasilitas Unggulan",
        description:
            "Tingkatkan performa olahraga Anda bersama instruktur berpengalaman dan fasilitas kelas asia tenggara dunia champion.",
        date: "26.02.2026",
        image: "/assets/images/ub-sport-center-kantor-pusat-malang.avif",
    },
];

export default function NewsHero() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    return (
        <section className="relative w-full bg-black overflow-x-clip" id="home">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {DUMMY_NEWS_SLIDES.map((slide, idx) => (
                        <div
                            key={slide.id}
                            className="flex-[0_0_100%] min-w-0"
                        >
                            <div className="relative">
                                <img
                                    src={TopBg}
                                    alt=""
                                    aria-hidden
                                    className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top"
                                />
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/80" />

                                <div className="h-28 xl:h-36" />

                                <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-8 px-8 xl:px-16 pb-10 xl:pb-12 items-end">
                                    <div className="xl:col-span-8 flex flex-col gap-4">
                                        <div
                                            className="flex h-9 w-fit items-center rounded-md px-4"
                                            style={{ background: "linear-gradient(to right, red, #790a0a)" }}
                                        >
                                            <span className="font-clash font-bold text-[16px] text-white">
                                                {slide.badge}
                                            </span>
                                        </div>
                                        <h1 className="font-bdo font-medium text-[clamp(1.25rem,2vw,1.75rem)] text-white leading-snug max-w-[656px]">
                                            {slide.title}
                                        </h1>
                                        <p className="font-bdo font-normal text-[clamp(1rem,1.5vw,1.5rem)] text-white/70 max-w-[643px]">
                                            {slide.description}
                                        </p>
                                    </div>

                                    <div className="xl:col-span-4 flex flex-row xl:flex-col items-start xl:items-end justify-between xl:h-full gap-4">
                                        <span className="font-bdo font-normal text-[20px] text-white/80">
                                            {slide.date}
                                        </span>
                                        <AnimatedBookingLink />
                                    </div>
                                </div>
                            </div>

                            <div
                                className="relative w-full bg-neutral-900"
                                style={{ height: "68vh" }}
                            >
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="absolute inset-0 h-full w-full object-cover"
                                    loading={idx === 0 ? "eager" : "lazy"}
                                    draggable={false}
                                />
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
                                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />

                                <button
                                    onClick={scrollPrev}
                                    aria-label="Previous slide"
                                    className="absolute left-3 xl:left-6 top-1/2 -translate-y-1/2 z-10 flex size-[40px] xl:size-[60px] flex-shrink-0 items-center justify-center rounded-full border border-white/30 bg-black/30 backdrop-blur-sm text-white transition-colors duration-300 hover:bg-white hover:text-black"
                                >
                                    <PrevArrow />
                                </button>

                                <button
                                    onClick={scrollNext}
                                    aria-label="Next slide"
                                    className="absolute right-3 xl:right-6 top-1/2 -translate-y-1/2 z-10 flex size-[40px] xl:size-[60px] flex-shrink-0 items-center justify-center rounded-full border border-white/30 bg-black/30 backdrop-blur-sm text-white transition-colors duration-300 hover:bg-white hover:text-black"
                                >
                                    <NextArrow />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full z-20">
                <HeroBottomBar
                    sectionNumber="03/"
                    sectionLabel="newspage"
                    description="UB Sport Center – Temukan fasilitas olahraga modern untuk berlatih, berprestasi, dan berkembang bersama."
                    targetId="news-content"
                    showVideo={false}
                    variant="transparent"
                />
            </div>
        </section>
    );
}
