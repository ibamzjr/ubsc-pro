import { useCallback, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";
import SectionDivider from "@/Components/Landing/SectionDivider";

interface Testimonial {
    id: string | number;
    image: string;
    quote: string;
    authorName: string;
    authorRole: string;
    authorLogo?: string;
}

const DUMMY_TESTIMONIALS: Testimonial[] = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
        quote: "Fasilitas gym di UB Sport Center peralatan lengkap, dan suasana latihan yang mendukung, sehingga performa tim kami meningkat sangat pesat berkat layanan yang profesional.",
        authorName: "Arema FC",
        authorRole: "Footbal Club",
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80",
        quote: "Lapangan yang selalu terjaga kebersihannya, staff yang ramah, dan sistem booking online yang sangat memudahkan tim kami dalam merencanakan sesi latihan.",
        authorName: "Komunitas Basket",
        authorRole: "Sport Community",
        authorLogo:
            "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
        quote: "Program kelas kebugaran di sini benar-benar terstruktur dan dipandu oleh instruktur berpengalaman. Saya sudah merasakan manfaatnya dalam waktu singkat.",
        authorName: "Sarah Wijaya",
        authorRole: "Member Gym",
    },
];

const FIXED_STATS = [
    { value: "122+", label: "Jumlah Ulasan", sublabel: "Pelayanan Terpercaya" },
    { value: "99%", label: "Tingkat Kepuasan", sublabel: "Kualitas Terjamin" },
];

interface SectionSevenProps {
    testimonials?: Testimonial[];
}

export default function SectionSeven({
    testimonials = DUMMY_TESTIMONIALS,
}: SectionSevenProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

    // Track active slide for the author pill (outside Embla)
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (!emblaApi) return;
        const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap());
        emblaApi.on("select", onSelect);
        onSelect(); // sync on mount
        return () => {
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi]);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    const activeItem = testimonials[activeIndex % testimonials.length];

    return (
        <section
            id="testimonials"
            className="w-full bg-white pt-12 pb-12 px-6 sm:px-10 lg:px-24"
        >
            <div className="mx-auto">
                <SectionDivider
                    number="06"
                    title="Testimoni"
                    subtitle="01/ homepage"
                    theme="light"
                />
            </div>

            <div className="mb-8 flex items-center gap-2">
                <span className="h-3 w-3 flex-shrink-0 bg-red-600" />
                <span className="font-bdo text-sm font-regular text-gray-800">
                    Ulasan Pengguna
                </span>
            </div>

            <div className="block lg:hidden">
                <div className="flex flex-row items-center gap-6 mb-6">
                    <div className="w-28 h-40 md:w-36 md:h-52 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                        <img
                            src={activeItem.image}
                            alt={activeItem.authorName}
                            className="h-full w-full object-cover"
                            draggable={false}
                        />
                    </div>
                    <div className="flex flex-row gap-8">
                        {FIXED_STATS.map((stat) => (
                            <div
                                key={stat.label}
                                className="flex flex-col items-center"
                            >
                                <span className="font-bdo text-2xl md:text-3xl font-regular tracking-tight text-gray-900">
                                    {stat.value}
                                </span>
                                <span className="mt-1 font-bdo text-xs font-semibold text-gray-800">
                                    {stat.label}
                                </span>
                                <span className="font-bdo text-[10px] font-regular text-gray-500">
                                    {stat.sublabel}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Nav buttons */}
                <div className="flex justify-start gap-3 mb-6">
                    <button
                        type="button"
                        onClick={scrollPrev}
                        aria-label="Previous testimonial"
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-gray-900 text-gray-900 transition-colors duration-200 hover:bg-gray-200"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={scrollNext}
                        aria-label="Next testimonial"
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-900 text-white transition-colors duration-200 hover:bg-gray-700"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
                <blockquote className="mb-8">
                    <p className="font-bdo text-3xl md:text-4xl font-semibold leading-[1.2] tracking-tight text-gray-900">
                        &ldquo;{activeItem.quote}&rdquo;
                    </p>
                </blockquote>
                <div className="inline-flex items-center gap-4 rounded-2xl bg-white px-4 py-3 shadow-sm">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                        {activeItem.authorLogo ? (
                            <img
                                src={activeItem.authorLogo}
                                alt={activeItem.authorName}
                                className="h-full object-contain"
                            />
                        ) : (
                            <span className="text-xl font-bold text-gray-400">
                                {activeItem.authorName.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-clash text-base font-medium leading-tight text-gray-900">
                            {activeItem.authorName}
                        </span>
                        <span className="mt-0.5 font-clash text-xs font-regular text-gray-500">
                            {activeItem.authorRole}
                        </span>
                    </div>
                </div>
            </div>

            <div className="hidden lg:block">
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex">
                        {testimonials.map((item) => (
                            <div
                                key={item.id}
                                className="min-w-0 flex-[0_0_100%]"
                            >
                                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
                                    <div className="lg:col-span-4">
                                        <div className="aspect-[3/4] w-2/3 overflow-hidden rounded-2xl bg-gray-200">
                                            <img
                                                src={item.image}
                                                alt={item.authorName}
                                                className="h-full w-full object-cover"
                                                draggable={false}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center lg:col-span-8">
                                        <blockquote>
                                            <p className="font-bdo text-3xl font-semibold leading-[1.15] tracking-tight text-gray-900 lg:text-4xl xl:text-5xl 2xl:text-6xl">
                                                &ldquo;{item.quote}&rdquo;
                                            </p>
                                        </blockquote>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
                    <div className="flex items-center gap-3 lg:col-span-4">
                        <button
                            type="button"
                            onClick={scrollPrev}
                            aria-label="Previous testimonial"
                            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-gray-900 text-gray-900 transition-colors duration-200 hover:bg-gray-200"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            type="button"
                            onClick={scrollNext}
                            aria-label="Next testimonial"
                            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-900 text-white transition-colors duration-200 hover:bg-gray-700"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                    <div className="lg:col-span-8">
                        <div className="mb-8 border-t border-gray-200" />
                        <div className="flex flex-nowrap items-center gap-6 lg:gap-8 xl:gap-14">
                            <div className="inline-flex items-center gap-4 rounded-2xl bg-white px-4 py-3 shadow-sm">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100 xl:h-14 xl:w-14">
                                    {activeItem.authorLogo ? (
                                        <img
                                            src={activeItem.authorLogo}
                                            alt={activeItem.authorName}
                                            className="h-full w-full object-contain p-1"
                                        />
                                    ) : (
                                        <span className="text-xl font-bold text-gray-400">
                                            {activeItem.authorName
                                                .charAt(0)
                                                .toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-clash text-base font-medium leading-tight text-gray-900">
                                        {activeItem.authorName}
                                    </span>
                                    <span className="mt-0.5 font-clash text-sm font-regular text-gray-500">
                                        {activeItem.authorRole}
                                    </span>
                                </div>
                            </div>
                            {FIXED_STATS.map((stat) => (
                                <div key={stat.label} className="flex flex-col">
                                    <span className="font-bdo text-2xl font-regular tracking-tight text-gray-900 lg:text-3xl xl:text-4xl">
                                        {stat.value}
                                    </span>
                                    <span className="mt-1 font-bdo text-sm font-semibold text-gray-800">
                                        {stat.label}
                                    </span>
                                    <span className="font-bdo text-xs font-regular text-gray-500">
                                        {stat.sublabel}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
