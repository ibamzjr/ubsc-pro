import { useState } from "react";
import SectionDivider from "@/Components/Landing/SectionDivider";
import AnimatedBookingLink from "@/Components/News/AnimatedBookingLink";
import PricingAccordionItem, {
    ClassAccordionData,
} from "./PricingAccordionItem";

const CLASSES_DATA: ClassAccordionData[] = [
    {
        id: "01",
        title: "/ Sepak Bola",
        badgeLocation: "Veteran",
        badgeType: "Arena Luar",
        classCode: "/Terbuka 003/",
        pricingDetails: [
            "1.750K / 2 Jam",
            "Extension 875K / Jam",
        ],
    },
    {
        id: "02",
        title: "/Basket",
        badgeLocation: "Veteran",
        badgeType: "Arena Luar",
        classCode: "/Terbuka 004/",
        pricingDetails: [
            "Reguler 50K — 100K",
            "Sewa 200K / Jam",
            "Event 3.000K / Hari",
        ],
    },
    {
        id: "03",
        title: "/Volly",
        badgeLocation: "Veteran",
        badgeType: "Arena Luar",
        classCode: "/Terbuka 005/",
        pricingDetails: [
            "Reguler 40K — 85K",
            "Sewa 180K / Jam",
            "Event 2.500K / Hari",
        ],
    },
    {
        id: "04",
        title: "/Futsal Dieng",
        badgeLocation: "Dieng",
        badgeType: "Indoor Facility",
        classCode: "/Terbuka 006/",
        pricingDetails: [
            "Pagi 120K / 2 Jam",
            "Malam 160K / 2 Jam",
            "Event 5.000K / Hari",
        ],
    },
];

export default function PricingAccordionSection() {
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    return (
        <section className="bg-[#242424] overflow-x-clip" id="pricing-accordion">
            <div className="mx-auto max-w px-6 pt-8 sm:px-10 sm:pt-12 lg:px-16 xl:px-24 xl:pt-10">
            <SectionDivider
                number="04"
                title="Kelas Outdoor"
                subtitle="05 pricing page"
                theme="dark"
            />
            </div>
            <div className="max-w-8xl mx-auto max-w px-6 pt-8 sm:px-10 sm:pt-12 lg:px-16 xl:px-24 xl:py-10">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-16">
                    <div className="xl:col-span-4 flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="size-[17px] rounded-[5px] bg-accent-red flex-shrink-0" />
                            <span className="font-bdo font-normal text-[clamp(1rem,1.25vw,24px)] text-white">
                                Gabung Member Sekarang
                            </span>
                        </div>
                        <AnimatedBookingLink
                            label="More about me"
                            href="/coming-soon"
                        />
                        <div className="w-[80%] aspect-square overflow-hidden rounded-2xl mt-6">
                            <img
                                src="/assets/images/fasilitas-arena-terbuka-dieng-ub-sport-center-malang.avif"
                                alt="UB Sport Center"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="xl:col-span-8 flex flex-col">
                        <h2 className="font-bdo font-medium text-[clamp(2rem,2.7vw,52px)] leading-[1.1] tracking-[-0.021em] text-white max-w-3xl">
                            Area gym ini dirancang kardio yang nyaman bagi
                            seluruh pengguna yang ada di UB Sport Center.
                            <sup className="text-[0.6em]">®</sup>
                        </h2>

                        <div className="mt-16 flex flex-col">
                            <div className="border-t border-white/10" />
                            {CLASSES_DATA.map((item, idx) => (
                                <PricingAccordionItem
                                    key={item.id}
                                    item={item}
                                    isOpen={activeIndex === idx}
                                    onToggle={() =>
                                        setActiveIndex(
                                            activeIndex === idx ? null : idx,
                                        )
                                    }
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
