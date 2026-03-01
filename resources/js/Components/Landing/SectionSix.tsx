import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import SectionDivider from "@/Components/Landing/SectionDivider";
import ReservasiButton from "@/Components/Landing/ReservasiButton";
import PriceCard from "@/Components/Landing/PriceCard";
import type { PriceItem } from "@/Components/Landing/PriceCard";
import futsal from "@/../assets/images/futsal.png";

const PAGE_SIZE = 4;

const DUMMY_PRICES: PriceItem[] = [
    {
        id: 1,
        title: "Tennis Reborn",
        price: "105.000 - 115.000 / Jam",
        rating: 5,
        image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600&q=80",
    },
    {
        id: 2,
        title: "Badminton",
        price: "50.000 - 65.000 / Jam",
        rating: 5,
        image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80",
    },
    {
        id: 3,
        title: "Table Tennis",
        price: "50.000 - 55.000 / Jam",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1611251135345-18c56206b863?w=600&q=80",
    },
    {
        id: 4,
        title: "Futsal",
        price: "45.000 - 50.000 / Jam",
        rating: 4.5,
        image: futsal,
    },
];

function FeatureItem({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#2D7D9A] text-white">
                <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M6 1V11M1 6H11"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            </div>
            <span className="text-sm font-semibold text-gray-800">{label}</span>
        </div>
    );
}

interface SectionSixProps {
    prices?: PriceItem[];
}

export default function SectionSix({ prices = DUMMY_PRICES }: SectionSixProps) {
    const totalPages = Math.ceil(prices.length / PAGE_SIZE);
    const [page, setPage] = useState(0); // 0-indexed
    const visiblePrices = prices.slice(
        page * PAGE_SIZE,
        page * PAGE_SIZE + PAGE_SIZE,
    );

    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "start",
        dragFree: true,
    });

    const scrollPrev = useCallback(() => {
        // desktop
        setPage((p) => Math.max(0, p - 1));
        // mobile
        emblaApi && emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        // desktop
        setPage((p) => Math.min(totalPages - 1, p + 1));
        // mobile
        emblaApi && emblaApi.scrollNext();
    }, [emblaApi, totalPages]);

    const prevDisabled = page === 0;
    const nextDisabled = page >= totalPages - 1;

    return (
        <section id="pricing" className="w-full bg-white  pt-12 pb-24">
            <div className="mx-auto w-full px-6 sm:px-10 xl:px-24">
                <SectionDivider
                    number="04"
                    title="Daftar harga"
                    subtitle="01/ homepage"
                    theme="light"
                />

                <div className="mt-16 grid grid-cols-1 gap-12 xl:grid-cols-12 xl:gap-8">
                    <div className="col-span-1 flex flex-col xl:col-span-5">
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 flex-shrink-0 bg-red-600" />
                            <span className="text-sm font-semibold text-gray-800">
                                Tarif Lapangan
                            </span>
                        </div>

                        <h2 className="mb-4 mt-6 max-w-sm text-4xl font-bold leading-[1.1] tracking-tight text-gray-900 md:text-4xl xl:text-5xl">
                            Raih Performa Terbaik Dengan Paket Fasilitas
                            Unggulan
                        </h2>

                        <p className="mb-8 max-w-sm text-base leading-relaxed text-gray-600">
                            Penyewaan arena olahraga standar profesional untuk
                            kebutuhan tim dan komunitas Anda.
                        </p>

                        <div className="mb-6 max-w-sm border-t border-gray-200" />

                        <div className="mb-12 flex flex-col gap-4">
                            <FeatureItem label="Cabang Olahraga Lengkap" />
                            <FeatureItem label="Fasilitas Standar Atlet" />
                        </div>

                        <div className="mt-auto flex items-center justify-between">
                            <ReservasiButton label="Mulai Reservasi" />

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={scrollPrev}
                                    disabled={prevDisabled}
                                    aria-label="Previous"
                                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-black text-black transition-colors duration-200 hover:bg-gray-100 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-300"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    type="button"
                                    onClick={scrollNext}
                                    disabled={nextDisabled}
                                    aria-label="Next"
                                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-black text-white transition-colors duration-200 hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 grid grid-cols-1 gap-4 md:grid-cols-2 xl:col-span-7 xl:grid-cols-1">
                        {visiblePrices.map((item) => (
                            <PriceCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
