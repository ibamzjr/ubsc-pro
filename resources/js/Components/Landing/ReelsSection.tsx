import { useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReelCard from "@/Components/Landing/ReelCard";
import type { ReelItem } from "@/Components/Landing/ReelCard";

const DUMMY_REELS: ReelItem[] = [
    {
        id: 1,
        date: "31/12 2025",
        thumbnail:
            "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600&q=80",
        subtitle: "Kegiatan Latihan FC Yang Berlangsung di",
        title: "SPORT CENTER UB.",
        isActive: true,
        videoUrl: "/reels/sg.mp4", // Sample video URL for testing
    },
    {
        id: 2,
        date: "16/12 2025",
        thumbnail:
            "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
        subtitle: "Kegiatan Latihan Arema FC Yang Berlangsung di",
        title: "SPORT CENTER UB.",
    },
    {
        id: 3,
        date: "16/12 2025",
        thumbnail:
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
        subtitle: "Kegiatan Latihan Arema FC Yang Berlangsung di",
        title: "SPORT CENTER UB.",
    },
    {
        id: 4,
        date: "16/12 2025",
        thumbnail:
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
        subtitle: "Kegiatan Latihan Arema FC Yang Berlangsung di",
        title: "SPORT CENTER UB.",
    },
    {
        id: 5,
        date: "16/12 2025",
        thumbnail:
            "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
        subtitle: "Kegiatan Latihan Arema FC Yang Berlangsung di",
        title: "SPORT CENTER UB.",
    },
    {
        id: 6,
        date: "16/12 2025",
        thumbnail:
            "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80",
        subtitle: "Kegiatan Latihan Arema FC Yang Berlangsung di",
        title: "SPORT CENTER UB.",
    },
];

const SlideArrow: React.FC<{ size?: number; color?: string }> = ({
    size = 20,
    color = "currentColor",
}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M12 32H52M52 32L34 14M52 32L34 50"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

interface NavBtnProps {
    onClick: () => void;
    children: React.ReactNode;
    label: string;
}
function NavBtn({ onClick, children, label }: NavBtnProps) {
    return (
        <button
            onClick={onClick}
            aria-label={label}
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-gray-600 text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-black"
        >
            {children}
        </button>
    );
}

interface ReelsSectionProps {
    reels?: ReelItem[];
}

export default function ReelsSection({
    reels = DUMMY_REELS,
}: ReelsSectionProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "start",
        dragFree: true,
    });

    const scrollPrev = useCallback(
        () => emblaApi && emblaApi.scrollPrev(),
        [emblaApi],
    );
    const scrollNext = useCallback(
        () => emblaApi && emblaApi.scrollNext(),
        [emblaApi],
    );

    const [linkHovered, setLinkHovered] = useState(false);

    return (
        <div className="mt-32 flex flex-col">
            <div className="mx-auto w-full px-24">
                <div className="mb-6 flex items-center justify-between">
                    <span className="rounded-full bg-white px-5 py-2 text-sm font-bold text-black">
                        Sport center
                    </span>
                    <span className="text-sm text-gray-400">
                        1/5 <strong className="text-white">Detail</strong>
                    </span>
                </div>

                {/* Row 2: title + description */}
                <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
                    <h3 className="text-4xl font-bold text-white lg:text-5xl">
                        Reels UB Sport Center
                    </h3>
                    <p className="text-lg leading-relaxed text-gray-400 md:ml-auto md:max-w-md md:text-left">
                        Intip keseruan latihan, tips kebugaran, dan atmosfer
                        energi positif langsung melalui media sosial kami.
                    </p>
                </div>
            </div>

            <div className="flex items-stretch">

                <div className="relative z-10 hidden w-48 flex-shrink-0 flex-col justify-between pb-2 pl-8 md:flex lg:pl-24">
                    <span className="text-xl font-semibold text-white">
                        Sorotan
                        <br />
                        Komunitas
                    </span>
                    <div className="flex gap-3">
                        <NavBtn onClick={scrollPrev} label="Previous reel">
                            <ChevronLeft size={20} />
                        </NavBtn>
                        <NavBtn onClick={scrollNext} label="Next reel">
                            <ChevronRight size={20} />
                        </NavBtn>
                    </div>
                </div>

                <div className="min-w-0 flex-1 overflow-hidden" ref={emblaRef}>
                    <div className="flex items-end gap-4 pl-8 lg:pl-20">
                        {reels.map((reel, index) => (
                            <ReelCard
                                key={reel.id}
                                item={reel}
                                featured={index === 0}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="mx-auto mt-16 w-full max-w-7xl  px-8 pt-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex gap-3 md:hidden">
                        <NavBtn onClick={scrollPrev} label="Previous reel">
                            <ChevronLeft size={20} />
                        </NavBtn>
                        <NavBtn onClick={scrollNext} label="Next reel">
                            <ChevronRight size={20} />
                        </NavBtn>
                    </div>

                    <span className="flex-1 text-center text-sm font-medium text-white">
                        Welcome Sport Center.
                    </span>

                    <div
                        className="relative w-64 cursor-pointer select-none overflow-hidden border-b border-white/35 py-1"
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
                        <span className="pointer-events-none relative z-10 flex w-full items-center justify-between py-1.5">
                            <span className="text-sm font-medium text-white">
                                Ikuti Keseruan Kami
                            </span>
                            <span
                                className="flex flex-shrink-0 items-center justify-center"
                                style={{
                                    width: 24,
                                    height: 24,
                                    transform: linkHovered
                                        ? "rotate(0deg)"
                                        : "rotate(-45deg)",
                                    transition:
                                        "transform 0.55s cubic-bezier(0.76, 0, 0.24, 1)",
                                }}
                            >
                                <SlideArrow size={16} />
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
