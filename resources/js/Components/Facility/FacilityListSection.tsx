import { motion } from "framer-motion";
import { Dumbbell } from "lucide-react";
import SectionDivider from "@/Components/Landing/SectionDivider";
import FacilityListItem from "./FacilityListItem";
import type { FacilityItem } from "./FacilityListItem";
import person from "@/../assets/images/person.avif";

const MARQUEE_ITEMS = Array(40).fill(null);

const FACILITIES: FacilityItem[] = [
    {
        id: "01",
        title: "/Tennis Reborn.",
        code: "/Tertutup 001/",
        image: "/assets/images/fasilitas-tenis-ub-sport-center.avif",
        badgeLocation: "Veteran",
        badgeType: "Outdoor Facility",
    },
    {
        id: "02",
        title: "/Badminton.",
        code: "/Tertutup 002/",
        image: "/assets/images/fasilitas-bulutangkis-ub-sport-center.avif",
        badgeLocation: "Veteran",
        badgeType: "Outdoor Facility",
    },
    {
        id: "03",
        title: "/Table Tennis.",
        code: "/Tertutup 003/",
        image: "/assets/images/fasilitas-tennis-meja-ub-sport-center.avif",
        badgeLocation: "Veteran",
        badgeType: "Outdoor Facility",
    },
    {
        id: "04",
        title: "/Futsal Veteran.",
        code: "/Tertutup 004/",
        image: "/assets/images/fasilitas-futsal-dieng-ub-sport-center.avif",
        badgeLocation: "Veteran",
        badgeType: "Outdoor Facility",
    },
    {
        id: "05",
        title: "/Ruang Beladiri.",
        code: "/Tertutup 005/",
        image: "/assets/images/fasilitas-beladiri-ub-sport-center.avif",
        badgeLocation: "Veteran",
        badgeType: "Outdoor Facility",
    },
];

function FasilitasKamiBadge() {
    return (
        <div className="inline-flex w-fit items-center gap-4 overflow-hidden rounded-sm border border-gray-200 bg-white p-0.5 pr-5 shadow-sm">
            <div className="flex h-11 w-14 items-center justify-center rounded-sm bg-gradient-to-tr from-[#002244] to-[#15678D]">
                <Dumbbell className="h-5 w-5 text-white" />
            </div>
            <span className="font-bdo font-medium text-[14px] text-black whitespace-nowrap">
                FASILITAS KAMI
            </span>
        </div>
    );
}

interface FacilityListSectionProps {
    sectionNumber?: string;
    sectionTitle?: string;
    sectionSubtitle?: string;
    facilities?: FacilityItem[];
}

export default function FacilityListSection({
    sectionNumber = "02",
    sectionTitle = "Kelas Outdoor",
    sectionSubtitle = "04 facility page",
    facilities,
}: FacilityListSectionProps = {}) {
    const activeList = facilities && facilities.length > 0 ? facilities : FACILITIES;
    return (
        <section className="bg-[#242424] overflow-x-clip" id="facility-content">
            {/* --- MARQUEE STRIP --- */}
            <div className="relative z-0 overflow-hidden bg-black border-b border-white/10 py-2">
                <motion.div
                    className="flex items-center"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 30,
                    }}
                >
                    {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((_, i) => (
                        <span
                            key={i}
                            className="pr-12 font-clash font-semibold text-[12px] lg:text-[16px] tracking-widest uppercase text-white/70 flex-shrink-0"
                        >
                            UBSC
                        </span>
                    ))}
                </motion.div>
            </div>

            {/* --- TOP INFO / DIVIDER --- */}
            <div className="mx-auto max-w px-6 pt-8 sm:px-10 sm:pt-12 lg:px-16 xl:px-24 xl:pt-10">
                <SectionDivider
                    number={sectionNumber}
                    title={sectionTitle}
                    subtitle={sectionSubtitle}
                    theme="dark"
                />
            </div>

            <div className="mx-auto max-w px-6 py-6 sm:px-10 xl:px-24">
                {/* --- HERO INTRO EDITORIAL LAYOUT --- */}
                <div className="flex flex-col gap-10 mt-12 mb-20 xl:grid xl:grid-cols-12 xl:gap-0">
                    {/* SISI KIRI: Makan 3 Kolom Pertama (1, 2, 3) */}
                    <div className="xl:col-span-3 flex flex-col items-start justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="size-[17px] rounded-[5px] bg-[#FF0000] flex-shrink-0" />
                            <span className="font-bdo font-normal text-[1.5rem] text-white">
                                Layanan Unggulan
                            </span>
                        </div>
                        <div className="hidden xl:block mt-auto pb-1">
                            <FasilitasKamiBadge />
                        </div>
                    </div>

                    {/* SISI KANAN: Mulai dari kolom ke-5 dan makan 8 kolom. 
        (Artinya kolom ke-4 sengaja kita KOSONGKAN sebagai ruang napas/gap yang lega) 
    */}
                    <div className="xl:col-span-8 xl:col-start-5 block w-full">
                        <h2
                            className="font-bdo font-medium text-white block text-left"
                            style={{
                                fontSize: "clamp(2rem, 3.5vw, 3.25rem)",
                                lineHeight: 1.115,
                                letterSpacing: "-0.017em",
                            }}
                        >
                            <span className="inline-block align-baseline mr-5 xl:mr-8 w-[100px] xl:w-[187px] aspect-[187/253] overflow-hidden rounded-xl shrink-0">
                                <img
                                    src={person}
                                    alt="UB Sport Center"
                                    className="w-full h-full object-cover grayscale object-top"
                                />
                            </span>
                            Mendukung Kebutuhan Aktivitas Olahraga Anda dengan Fasilitas Modern dan Terlengkap.
                        </h2>

                        {/* Mobile Badge */}
                        <div className="pt-10 xl:hidden">
                            <FasilitasKamiBadge />
                        </div>
                    </div>
                </div>

                {/* --- FACILITY LIST (NO GAP) --- */}
                <div className="flex flex-col gap-0 border-t border-white/10">
                    {activeList.map((item) => (
                        <FacilityListItem key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </section>
    );
}