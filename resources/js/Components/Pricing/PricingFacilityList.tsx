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

const ArrowChevron = () => (
    <svg
        width="12"
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

const FACILITIES_DATA: FacilityPricing[] = [
    {
        id: "01",
        name: "/Tennis Reborn.",
        classCode: "/Class 003/",
        periods: [
            {
                label: "Pagi/ 06.00 - 12.00",
                wargaPrice: "Warga UB 95K/ Jam",
                umumPrice: "Umum 105K/ Jam",
            },
            {
                label: "Malam/ 16.00 - 22.00",
                wargaPrice: "Warga UB 105K/ Jam",
                umumPrice: "Umum 115K/ Jam",
            },
            {
                label: "Sabtu - Minggu\nMalam/ 18.00 - 22.00",
                wargaPrice: "Warga UB 50K/ Jam",
                umumPrice: "Umum 65K/ Jam",
            },
        ],
        additionalDetails: [
            "Sewa Event 8500K/ Hari",
            "Sewa Raket 10K/ Max. 2 Jam",
            "Sewa Event Non Sport 25000K/ Hari",
        ],
        timeSlot: "16.00 - 18.00",
        badgeLocation: "Veteran",
        badgeType: "Indoor Facility",
        image: "/assets/images/fasilitas-arena-terbuka-dieng-ub-sport-center-malang.avif",
    },
    {
        id: "02",
        name: "/Badminton.",
        classCode: "/Class 001/",
        periods: [
            {
                label: "Pagi/ 06.00 - 12.00",
                wargaPrice: "Warga UB 40K/ Jam",
                umumPrice: "Umum 50K/ Jam",
            },
            {
                label: "Siang/ 12.00 - 17.00",
                wargaPrice: "Warga UB 50K/ Jam",
                umumPrice: "Umum 60K/ Jam",
            },
            {
                label: "Malam/ 17.00 - 22.00",
                wargaPrice: "Warga UB 55K/ Jam",
                umumPrice: "Umum 65K/ Jam",
            },
        ],
        additionalDetails: [
            "Sewa Event 7500K/ Hari",
            "Sewa Raket 8K/ Max. 2 Jam",
        ],
        timeSlot: "07.00 - 22.00",
        badgeLocation: "Veteran",
        badgeType: "Indoor Facility",
        image: "/assets/images/fasilitas-arena-terbuka-dieng-ub-sport-center-malang.avif",
    },
    {
        id: "03",
        name: "/Table Tennis.",
        classCode: "/Class 002/",
        periods: [
            {
                label: "Pagi/ 06.00 - 12.00",
                wargaPrice: "Warga UB 25K/ Jam",
                umumPrice: "Umum 35K/ Jam",
            },
            {
                label: "Siang/ 12.00 - 17.00",
                wargaPrice: "Warga UB 30K/ Jam",
                umumPrice: "Umum 40K/ Jam",
            },
            {
                label: "Malam/ 17.00 - 22.00",
                wargaPrice: "Warga UB 35K/ Jam",
                umumPrice: "Umum 45K/ Jam",
            },
        ],
        additionalDetails: ["Sewa Event 5000K/ Hari", "Peminjaman Bet 5K"],
        timeSlot: "07.00 - 22.00",
        badgeLocation: "Dieng",
        badgeType: "Indoor Facility",
        image: "/assets/images/ub-sport-center-kantor-pusat-malang.avif",
    },
    {
        id: "04",
        name: "/Futsal Veteran.",
        classCode: "/Class 004/",
        periods: [
            {
                label: "Pagi/ 06.00 - 12.00",
                wargaPrice: "Warga UB 120K/ Jam",
                umumPrice: "Umum 150K/ Jam",
            },
            {
                label: "Siang/ 12.00 - 17.00",
                wargaPrice: "Warga UB 140K/ Jam",
                umumPrice: "Umum 170K/ Jam",
            },
            {
                label: "Malam/ 17.00 - 22.00",
                wargaPrice: "Warga UB 160K/ Jam",
                umumPrice: "Umum 190K/ Jam",
            },
        ],
        additionalDetails: ["Sewa Event 15000K/ Hari", "Sewa Bola 10K"],
        timeSlot: "06.00 - 22.00",
        badgeLocation: "Veteran",
        badgeType: "Outdoor Facility",
        image: "/assets/images/fasilitas-arena-terbuka-dieng-ub-sport-center-malang.avif",
    },
    {
        id: "05",
        name: "/Ruang Beladiri.",
        classCode: "/Class 005/",
        periods: [
            {
                label: "Pagi/ 06.00 - 12.00",
                wargaPrice: "Warga UB 60K/ Sesi",
                umumPrice: "Umum 75K/ Sesi",
            },
            {
                label: "Sore/ 15.00 - 18.00",
                wargaPrice: "Warga UB 70K/ Sesi",
                umumPrice: "Umum 85K/ Sesi",
            },
            {
                label: "Malam/ 18.00 - 21.00",
                wargaPrice: "Warga UB 80K/ Sesi",
                umumPrice: "Umum 95K/ Sesi",
            },
        ],
        additionalDetails: ["Sewa Ruang 8000K/ Hari", "Matras Ekstra 15K"],
        timeSlot: "06.00 - 21.00",
        badgeLocation: "Veteran",
        badgeType: "Indoor Facility",
        image: "/assets/images/gym-konten-1-olahraga-ub-sport-center.avif",
    },
];

export default function PricingFacilityList() {
    const [activeIndex, setActiveIndex] = useState(0);
    const activeFacility = FACILITIES_DATA[activeIndex];

    const leftItems = FACILITIES_DATA.slice(0, 3);
    const rightItems = FACILITIES_DATA.slice(3);

    return (
        <section className="bg-white overflow-x-clip" id="pricing-facilities">
            <div className="mx-auto max-w px-6 py-16 sm:px-10 lg:px-16 xl:px-24">
                <SectionDivider
                    number="01"
                    title="Arena Dalam"
                    subtitle="01 schedulepage"
                    theme="light"
                />
            </div>

            <div className="mx-auto max-w px-6 sm:px-10 lg:px-16 xl:px-24">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-12 mb-16 xl:mb-20">
                    <div className="xl:col-span-4 flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="size-[17px] rounded-[5px] bg-accent-red flex-shrink-0" />
                            <span className="font-bdo font-normal text-[1.5rem] text-black">
                                Gabung Member Sekarang
                            </span>
                        </div>
                        <ReservasiButton label="Mulai Reservasi" href="#" />
                    </div>

                    <div className="xl:col-span-8 flex items-start">
                        <h2 className="font-bdo font-medium text-[clamp(2rem,4vw,3.25rem)] text-black leading-[1.27] max-w-3xl">
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
                                    <span className="font-bdo font-normal text-[2rem] tracking-[-0.1rem] text-black">
                                        ({facility.id})
                                    </span>
                                    <span className="font-bdo font-medium text-[1.75rem] tracking-[-0.077rem] text-black">
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
                                        <span className="font-bdo font-normal text-[2rem] tracking-[-0.1rem] text-black">
                                            ({facility.id})
                                        </span>
                                        <span className="font-bdo font-medium text-[1.75rem] tracking-[-0.077rem] text-black">
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
                            <span className="font-bdo font-medium text-[1.25rem] text-white">
                                {activeFacility.classCode}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 xl:mt-12">
                            {activeFacility.periods.map((period, i) => (
                                <div key={i} className="flex flex-col gap-0.5">
                                    <p className="font-bdo font-medium text-[1.25rem] text-white/80 leading-[1.68rem] whitespace-pre-line">
                                        {period.label}
                                    </p>
                                    <p className="font-bdo font-medium text-[1.25rem] text-white/80 leading-[1.68rem]">
                                        {period.wargaPrice}
                                    </p>
                                    <p className="font-bdo font-medium text-[1.25rem] text-white/80 leading-[1.68rem]">
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
                                        <span className="font-bdo font-medium text-[1.25rem] text-white/80">
                                            {detail}
                                        </span>
                                    </div>
                                ),
                            )}
                        </div>

                        <div className="mt-auto pt-10 xl:pt-12 flex items-end justify-between">
                            <div className="flex items-center gap-2">
                                <Clock
                                    size={20}
                                    className="text-white/80 flex-shrink-0"
                                />
                                <span className="font-bdo font-medium text-[1rem] text-white/80">
                                    {activeFacility.timeSlot}
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
