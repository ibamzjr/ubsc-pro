import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionDivider from "@/Components/Landing/SectionDivider";
import ReservasiButton from "@/Components/Landing/ReservasiButton";
import PriceCard from "@/Components/Landing/PriceCard";
import type { PriceItem } from "@/Components/Landing/PriceCard";

const PAGE_SIZE = 4;

interface BackendFacility {
    id: number;
    name: string;
    image: string;
    rating?: number | null;
    price_range?: string | null;
}

function facilitiesToPriceItems(facilities: BackendFacility[]): PriceItem[] {
    return facilities.map((f) => ({
        id: f.id,
        title: f.name,
        image: f.image || "/assets/images/comingsoon.avif",
        rating: f.rating ?? 5,
        price: f.price_range || "Harga belum tersedia",
    }));
}

function FeatureItem({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#15678D] text-white">
                <svg
                    width="8"
                    height="8"
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
            <span className="text-[clamp(0.75rem,0.83vw,16px)] text-black font-bdo font-regular">
                {label}
            </span>
        </div>
    );
}

interface SectionSixProps {
    facilities?: BackendFacility[];
}

export default function SectionSix({ facilities = [] }: SectionSixProps) {
    const prices: PriceItem[] = facilitiesToPriceItems(facilities);
    const totalPages = Math.ceil(prices.length / PAGE_SIZE);
    const [page, setPage] = useState(0);
    const visiblePrices = prices.slice(
        page * PAGE_SIZE,
        page * PAGE_SIZE + PAGE_SIZE,
    );

    const scrollPrev = () => setPage((p) => Math.max(0, p - 1));
    const scrollNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

    const prevDisabled = page === 0;
    const nextDisabled = page >= totalPages - 1;

    return (
        <section id="pricing" className="w-full bg-white  pt-12 xl:pb-12">
            <div className="mx-auto w-full px-6 sm:px-10 xl:px-20">
                <SectionDivider
                    number="06"
                    title="Daftar harga"
                    subtitle="01 homepage"
                    theme="light"
                />

                <div className="mt-10 md:mt-16 grid grid-cols-1 gap-12 xl:grid-cols-12 xl:gap-8 xl:min-h-[440px]">
                    <div className="col-span-1 flex flex-col xl:col-span-5">
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 flex-shrink-0 bg-[#FF0000] rounded-sm" />
                            <span className="font-bdo text-base md:text-[clamp(1.25rem,1.15rem,1.5rem)] font-regular tracking-wide text-black">
                                Tarif Lapangan
                            </span>
                        </div>

                        <h2 className="mb-4 mt-6 max-w-sm text-[clamp(1.5rem,1.8vw,52px)] font-semibold leading-[1.1] tracking-[-0.021em] text-gray-900">
                            Raih Performa Terbaik Dengan Paket Fasilitas
                            Unggulan
                        </h2>

                        <p className="mb-8 max-w-sm text-[clamp(0.875rem,0.83vw,16px)] leading-relaxed text-black/50">
                            Penyewaan arena olahraga standar profesional untuk
                            kebutuhan tim dan komunitas Anda.
                        </p>

                        <div className="mb-6 max-w-sm border-t border-gray-200" />

                        <div className="mb-12 flex flex-col gap-4 ">
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

                    <div className="col-span-1 grid grid-cols-1 gap-4 content-start items-start md:grid-cols-2 xl:col-span-7 xl:grid-cols-1">
                        {visiblePrices.map((item) => (
                            <PriceCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
