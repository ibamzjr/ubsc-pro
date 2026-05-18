import { useState } from "react";
import { Clock } from "lucide-react";
import SectionDivider from "@/Components/Landing/SectionDivider";
import ReservasiButton from "@/Components/Landing/ReservasiButton";
import FacilityBadge from "@/Components/Landing/FacilityBadge";
import star from "@/../assets/hero/star.png";

interface PricingPeriod {
    label: string;
    wargaPrice: string;
    umumPrice: string;
}

interface FacilityPricing {
    id: string;
    name: string;
    classCode: string;
    periods: PricingPeriod[];
    additionalDetails: string[];
    timeSlot: string;
    badgeLocation: string;
    badgeType: string;
    image: string;
}

interface BackendFacility {
    id: number;
    name: string;
    slug: string;
    image: string;
    category: string;
    location?: string | null;
    venue_type?: string | null;
    class_code?: string | null;
    rating?: number | null;
    display_metadata?: Record<string, unknown> | null;
}

const ArrowChevron = () => (
    <svg
        width="16"
        height="20"
        viewBox="0 0 12 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M2 2L10 10L2 18"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);


interface Props {
    facilities?: BackendFacility[];
}

export default function PricingFacilityList({ facilities = [] }: Props) {
    // Map real facilities to PricingFacility format, filter to arena facilities only
    const facilitiesData: FacilityPricing[] = facilities
        .filter((f) => f.category === 'Lapangan & Arena')
        .map((f, idx) => ({
            id: String(idx + 1).padStart(2, '0'),
            name: `/${f.name}.`,
            classCode: f.class_code || `/Class ${String(idx + 1).padStart(3, '0')}/`,
            periods: (f.display_metadata as any)?.periods || [
                {
                    label: "Pagi/ 06.00 - 12.00",
                    wargaPrice: "Warga UB 95K/ Jam",
                    umumPrice: "Umum 105K/ Jam",
                },
            ],
            additionalDetails: (f.display_metadata as any)?.additionalDetails || ["Sewa Event 8500K/ Hari"],
            timeSlot: "06.00 - 22.00",
            badgeLocation: f.location ?? 'Veteran',
            badgeType: f.venue_type ?? 'Indoor Facility',
            image: f.image || '/assets/images/comingsoon.avif',
        }))
        .slice(0, 5); // Limit to 5 items

    const activeData: FacilityPricing[] = facilitiesData;
    const [activeIndex, setActiveIndex] = useState(0);
    const activeFacility = activeData[activeIndex];

    const leftItems = activeData.slice(0, 3);
    const rightItems = activeData.slice(3);

    return (
        <section className="bg-white overflow-x-clip" id="pricing-facilities">
            <div className="mx-auto max-w px-6 py-16 sm:px-10 lg:px-16 xl:px-24">
                <SectionDivider
                    number="02"
                    title="Arena Dalam"
                    subtitle="05 pricing page"
                    theme="light"
                />
            </div>

            <div className="mx-auto max-w px-6 sm:px-10 lg:px-16 xl:px-24 pb-20">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-12 mb-16 xl:mb-20">
                    <div className="xl:col-span-4 flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="size-[17px] rounded-[5px] bg-accent-red flex-shrink-0" />
                            <span className="font-bdo font-normal text-[clamp(1rem,1.25vw,24px)] text-black">
                                Gabung Member Sekarang
                            </span>
                        </div>
                        <ReservasiButton label="Mulai Reservasi" href="#" />
                    </div>

                    <div className="xl:col-span-8 flex items-start">
                        <h2 className="font-bdo font-medium text-[clamp(2rem,2.7vw,52px)] leading-[1.1] tracking-[-0.021em] text-black max-w-3xl">
                            Area gym ini dirancang kardio yang nyaman bagi
                            seluruh pengguna yang ada di UB Sport Center.
                            <sup className="text-[0.6em]">®</sup>
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-24 mb-12 xl:mb-16">
                    <div>
                        {leftItems.map((facility, idx) => (
                            <button
                                key={facility.id}
                                onClick={() => setActiveIndex(idx)}
                                className={`w-full flex items-center justify-between border-b py-5 text-left transition-opacity duration-200 ${
                                    activeIndex === idx
                                        ? "border-black/80 opacity-100"
                                        : "border-black opacity-[0.36] hover:opacity-60"
                                }`}
                            >
                                <div className="flex items-center gap-5">
                                    <span className="font-bdo font-normal text-[clamp(1.25rem,1.67vw,32px)] tracking-[-0.1rem] text-black">
                                        ({facility.id})
                                    </span>
                                    <span className="font-bdo font-medium text-[clamp(1.125rem,1.46vw,28px)] tracking-[-0.077rem] text-black">
                                        {facility.name}
                                    </span>
                                </div>
                                {activeIndex === idx && (
                                    <span className="flex-shrink-0 flex size-11 items-center justify-center rounded-full backdrop-blur-sm bg-black/10">
                                        <ArrowChevron />
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    <div>
                        {rightItems.map((facility, idx) => {
                            const globalIdx = idx + 3;
                            return (
                                <button
                                    key={facility.id}
                                    onClick={() => setActiveIndex(globalIdx)}
                                    className={`w-full flex items-center justify-between border-b py-5 text-left transition-opacity duration-200 ${
                                        activeIndex === globalIdx
                                            ? "border-black/80 opacity-100"
                                            : "border-black opacity-[0.36] hover:opacity-60"
                                    }`}
                                >
                                    <div className="flex items-center gap-5">
                                        <span className="font-bdo font-normal text-[clamp(1.25rem,1.67vw,32px)] tracking-[-0.1rem] text-black">
                                            ({facility.id})
                                        </span>
                                        <span className="font-bdo font-medium text-[clamp(1.125rem,1.46vw,28px)] tracking-[-0.077rem] text-black">
                                            {facility.name}
                                        </span>
                                    </div>
                                    {activeIndex === globalIdx && (
                                        <span className="flex-shrink-0 flex size-11 items-center justify-center rounded-full backdrop-blur-sm bg-black/10">
                                            <ArrowChevron />
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex flex-col xl:flex-row w-full bg-[#212121] rounded-[1.25rem] overflow-hidden min-h-[29rem]">
                    <div className="flex-1 p-8 xl:p-10 flex flex-col">
                        <div className="flex items-start justify-between">
                            <img
                                src={star}
                                alt=""
                                aria-hidden
                                className="w-10 h-10 xl:w-12 xl:h-12 object-contain"
                            />
                            <Clock
                                size={20}
                                className="text-white/80 flex-shrink-0"
                            />
                            <span className="font-bdo font-medium text-[clamp(0.875rem,0.83vw,16px)] text-white/80">
                                {activeFacility.timeSlot}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 xl:mt-12">
                            {activeFacility.periods.map((period, i) => (
                                <div key={i} className="flex flex-col gap-0.5">
                                    <p className="font-bdo font-medium text-[clamp(1rem,1.04vw,20px)] text-white/80 leading-[1.68rem] whitespace-pre-line">
                                        {period.label}
                                    </p>
                                    <p className="font-bdo font-medium text-[clamp(1rem,1.04vw,20px)] text-white/80 leading-[1.68rem]">
                                        {period.wargaPrice}
                                    </p>
                                    <p className="font-bdo font-medium text-[clamp(1rem,1.04vw,20px)] text-white/80 leading-[1.68rem]">
                                        {period.umumPrice}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-x-16 gap-y-2 mt-8">
                            {activeFacility.additionalDetails.map(
                                (detail, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-2"
                                    >
                                        <div className="size-2 rounded-sm bg-white/80 flex-shrink-0" />
                                        <span className="font-bdo font-medium text-[clamp(1rem,1.04vw,20px)] text-white/80">
                                            {detail}
                                        </span>
                                    </div>
                                ),
                            )}
                        </div>

                        <div className="mt-auto pt-10 xl:pt-12 flex items-end justify-between xl:pb-12">
                            <div className="flex items-center gap-2">
                                <span className="font-bdo font-medium text-[1.1rem] text-white">
                                    {activeFacility.classCode}
                                </span>
                            </div>
                            <FacilityBadge
                                location={activeFacility.badgeLocation}
                                category={activeFacility.badgeType}
                            />
                        </div>
                    </div>

                    <div className="xl:w-[30%] min-h-[300px] xl:min-h-0 relative">
                        <img
                            src={activeFacility.image}
                            alt={activeFacility.name}
                            className="absolute inset-0 w-full p-4 rounded-xl h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
