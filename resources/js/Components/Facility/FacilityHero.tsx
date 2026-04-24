import useEmblaCarousel from "embla-carousel-react";
import HeroBottomBar from "@/Components/Landing/HeroBottomBar";
import TopBg from "@/../assets/hero/Top.png";

const FACILITY_IMAGES = [
    { src: "/assets/images/fasilitas-futsal-ub-sport-center.avif", alt: "" },
    { src: "/assets/images/fasilitas-yoga-ub-sport-center.avif", alt: "" },
    {
        src: "/assets/images/fasilitas-arena-terbuka-dieng-ub-sport-center-malang.avif",
        alt: "",
    },
    { src: "/assets/images/fasilitas-aerobik-ub-sport-center.avif", alt: "" },
    {
        src: "/assets/images/fasilitas-bulutangkis-ub-sport-center.avif",
        alt: "",
    },
    {
        src: "/assets/images/gym-konten-1-olahraga-ub-sport-center.avif",
        alt: "",
    },
];

const ArrowRight = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M5 12H19M19 12L12 5M19 12L12 19" />
    </svg>
);

export default function FacilityHero() {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: "start",
    });

    return (
        <section
            className="relative w-full h-screen min-h-[700px] flex flex-col overflow-hidden"
            id="facility-hero"
        >
            <div className="pointer-events-none absolute inset-0 z-0">
                <img
                    src={TopBg}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 h-full w-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-[#0B0F18]/80" />
            </div>

            <div className="relative z-10 pt-32 px-8 xl:px-20">
                <h1 className="font-monument font-extrabold text-[clamp(3rem,5vw,4.5rem)] text-white leading-[1.2]">
                    Fasilitas Terbaik Kami
                </h1>
            </div>

            <div className="flex-1" />

            <div className="relative z-10">
                <HeroBottomBar
                    variant="transparent"
                    sectionNumber="03/"
                    sectionLabel="facilitypage"
                    description="Temukan fasilitas olahraga terlengkap di UB Sport Center Malang."
                    targetId="facility-content"
                    showVideo={false}
                />
            </div>

            <div className="relative z-10 pt-6 pb-8">
                <div
                    className="min-w-0 overflow-hidden pl-8 xl:pl-20 pr-20"
                    ref={emblaRef}
                >
                    <div className="flex gap-4">
                        {FACILITY_IMAGES.map((img, i) => (
                            <div
                                key={i}
                                className={`flex-shrink-0 overflow-hidden rounded-2xl h-[260px] ${
                                    i % 2 === 0 ? "w-[380px]" : "w-[210px]"
                                }`}
                            >
                                <img
                                    src={img.src}
                                    alt={img.alt}
                                    aria-hidden
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    onClick={() => emblaApi?.scrollNext()}
                    aria-label="Next"
                    className="absolute right-8 top-1/2 -translate-y-1/2 z-20 flex size-12 items-center justify-center rounded-full bg-accent-red text-white hover:bg-accent-red/90 transition-colors flex-shrink-0"
                >
                    <ArrowRight />
                </button>
            </div>
        </section>
    );
}
