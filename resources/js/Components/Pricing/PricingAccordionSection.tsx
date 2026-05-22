import { useState } from "react";
import { motion } from "framer-motion";
import SectionDivider from "@/Components/Landing/SectionDivider";
import AnimatedBookingLink from "@/Components/News/AnimatedBookingLink";
import PricingAccordionItem, {
    ClassAccordionData,
} from "./PricingAccordionItem";

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

interface Props {
    facilities?: BackendFacility[];
}

const DUMMY_ACCORDION: ClassAccordionData[] = [
    {
        id: "01",
        title: "/Sepak Bola",
        image: "/assets/images/fasilitas-futsal-ub-sport-center.avif",
        badgeLocation: "Veteran",
        badgeType: "Indoor Facility",
        classCode: "/Terbuka 003/",
        pricingDetails: [
            { label: "1750K/2 Jam" },
            { label: "Extension 875K/ Jam" },
        ],
    },
    {
        id: "02",
        title: "/Basket",
        image: "/assets/images/fasilitas-yoga-ub-sport-center.avif",
        badgeLocation: "Veteran",
        badgeType: "Indoor Facility",
        classCode: "/Terbuka 004/",
        pricingDetails: [
            { label: "1200K/2 Jam" },
            { label: "Extension 600K/ Jam" },
        ],
    },
    {
        id: "03",
        title: "/Volly",
        image: "/assets/images/fasilitas-aerobik-ub-sport-center.avif",
        badgeLocation: "Veteran",
        badgeType: "Indoor Facility",
        classCode: "/Terbuka 005/",
        pricingDetails: [
            { label: "1000K/2 Jam" },
            { label: "Extension 500K/ Jam" },
        ],
    },
    {
        id: "04",
        title: "/Futsal Dieng",
        image: "/assets/images/fasilitas-arena-terbuka-dieng-ub-sport-center-malang.avif",
        badgeLocation: "Dieng",
        badgeType: "Outdoor Arena",
        classCode: "/Terbuka 006/",
        pricingDetails: [
            { label: "1500K/2 Jam" },
            { label: "Extension 750K/ Jam" },
        ],
    },
];

export default function PricingAccordionSection({ facilities = [] }: Props) {
    const facilitiesData: ClassAccordionData[] = facilities
        .filter(
            (f) =>
                f.category === "Lapangan & Arena" &&
                Array.isArray((f.display_metadata as any)?.pricingDetails),
        )
        .map((f, idx) => ({
            id: String(idx + 1).padStart(2, "0"),
            title: `/${f.name}`,
            image: f.image || "/assets/images/comingsoon.avif",
            badgeLocation: f.location ?? "Veteran",
            badgeType: f.venue_type ?? "Arena Luar",
            classCode:
                f.class_code ?? `/Terbuka ${String(idx + 3).padStart(3, "0")}/`,
            pricingDetails: ((f.display_metadata as any)?.pricingDetails ??
                []) as { label: string }[],
        }));

    const activeData =
        facilitiesData.length > 0 ? facilitiesData : DUMMY_ACCORDION;

    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    return (
        <section
            className="bg-[#242424] overflow-x-clip"
            id="pricing-accordion"
        >
            <div className="mx-auto max-w px-6 pt-8 sm:px-10 sm:pt-12 lg:px-16 xl:px-24 xl:pt-10">
                <SectionDivider
                    number="04"
                    title="Kelas Outdoor"
                    subtitle="05 pricing page"
                    theme="dark"
                />
            </div>

            <div className="max-w-8xl mx-auto px-6 pt-8 sm:px-10 sm:pt-12 lg:px-16 xl:px-24 xl:py-10 pb-16">
                {/* ── MOBILE LAYOUT (xl:hidden) ───────────────────────────────── */}
                <div className="xl:hidden">
                    <div className="flex flex-col gap-6 mb-10">
                        <div className="mt-5 flex items-center gap-3">
                            <div className="size-[14px] rounded-[5px] bg-accent-red flex-shrink-0" />
                            <span className="font-bdo font-normal text-base text-white">
                                Gabung Member Sekarang
                            </span>
                        </div>
                        <h2 className="mt-5 font-bdo font-medium text-[clamp(2rem,2.7vw,52px)] leading-[1.1] tracking-[-0.021em] text-white">
                            Area gym ini dirancang kardio yang nyaman bagi
                            seluruh pengguna yang ada di UB Sport Center.
                            <sup className="text-[0.6em]">®</sup>
                        </h2>
                        <AnimatedBookingLink
                            label="Ikuti Keseruan Kami"
                            href="/coming-soon"
                        />
                    </div>

                    <div className="border-t border-white/10" />
                    {activeData.map((item, idx) => (
                        <PricingAccordionItem
                            key={item.id}
                            item={item}
                            isOpen={activeIndex === idx}
                            onToggle={() =>
                                setActiveIndex(activeIndex === idx ? null : idx)
                            }
                        />
                    ))}
                </div>

                {/* ── DESKTOP LAYOUT (hidden xl:block) ────────────────────────── */}
                <div className="hidden xl:block">
                    <div className="grid xl:grid-cols-12 gap-8 xl:gap-16">
                        <div className="xl:col-span-4 flex flex-col gap-6">
                            <div className="flex items-center gap-3">
                                <div className="size-[17px] rounded-[5px] bg-accent-red flex-shrink-0" />
                                <span className="font-bdo font-normal text-[clamp(1rem,1.25vw,24px)] text-white">
                                    Gabung Member Sekarang
                                </span>
                            </div>
                            <AnimatedBookingLink
                                label="Ikuti Keseruan Kami"
                                href="/coming-soon"
                            />
                            <div className="w-[80%] aspect-square overflow-hidden rounded-2xl mt-6">
                                <motion.img
                                    key={activeIndex ?? 0}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    src={
                                        activeIndex !== null
                                            ? activeData[activeIndex].image
                                            : activeData[0].image
                                    }
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
                                {activeData.map((item, idx) => (
                                    <PricingAccordionItem
                                        key={item.id}
                                        item={item}
                                        isOpen={activeIndex === idx}
                                        onToggle={() =>
                                            setActiveIndex(
                                                activeIndex === idx
                                                    ? null
                                                    : idx,
                                            )
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
