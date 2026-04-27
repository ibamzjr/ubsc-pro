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
        thumbnail:
            "/assets/images/fasilitas-arena-terbuka-dieng-ub-sport-center-malang.avif",
        classCode: "/Class 003/",
        pricingLeft: [
            {
                title: "Berginner",
                warga: "Warga UB 25K",
                umum: "Umum 230K",
            },
            {
                title: "Intermediate",
                warga: "Warga UB 23K",
                umum: "Umum 35K",
            },
        ],
        pricingRight: [
            {
                title: "Sewa Ruang Yoga",
                warga: "Warga UB 100K",
                umum: "Umum 150K",
            },
            {
                title: "Sewa Event Ruang",
                warga: "1650K/ Hari",
                umum: "",
                note: "* Matras Kami Fasilitasi",
            },
        ],
    },
    {
        id: "02",
        title: "/Basket",
        badgeLocation: "Veteran",
        badgeType: "Arena Luar",
        thumbnail:
            "/assets/images/gym-konten-1-olahraga-ub-sport-center.avif",
        classCode: "/Class 004/",
        pricingLeft: [
            {
                title: "Reguler",
                warga: "Warga UB 50K",
                umum: "Umum 70K",
            },
            {
                title: "Turnamen",
                warga: "Warga UB 80K",
                umum: "Umum 100K",
            },
        ],
        pricingRight: [
            {
                title: "Sewa Lapangan",
                warga: "Warga UB 200K",
                umum: "Umum 250K",
            },
            {
                title: "Sewa Event",
                warga: "3000K/ Hari",
                umum: "",
                note: "* Termasuk Penerangan",
            },
        ],
    },
    {
        id: "03",
        title: "/Volly",
        badgeLocation: "Veteran",
        badgeType: "Arena Luar",
        thumbnail:
            "/assets/images/ub-sport-center-kantor-pusat-malang.avif",
        classCode: "/Class 005/",
        pricingLeft: [
            {
                title: "Reguler",
                warga: "Warga UB 40K",
                umum: "Umum 55K",
            },
            {
                title: "Kompetisi",
                warga: "Warga UB 65K",
                umum: "Umum 85K",
            },
        ],
        pricingRight: [
            {
                title: "Sewa Lapangan",
                warga: "Warga UB 180K",
                umum: "Umum 220K",
            },
            {
                title: "Sewa Event",
                warga: "2500K/ Hari",
                umum: "",
                note: "* Net & Bola Tersedia",
            },
        ],
    },
    {
        id: "04",
        title: "/Futsal Dieng",
        badgeLocation: "Dieng",
        badgeType: "Indoor Facility",
        thumbnail:
            "/assets/images/fasilitas-arena-terbuka-dieng-ub-sport-center-malang.avif",
        classCode: "/Class 006/",
        pricingLeft: [
            {
                title: "Pagi",
                warga: "Warga UB 120K",
                umum: "Umum 150K",
            },
            {
                title: "Malam",
                warga: "Warga UB 160K",
                umum: "Umum 190K",
            },
        ],
        pricingRight: [
            {
                title: "Sewa Lapangan",
                warga: "Warga UB 500K",
                umum: "Umum 650K",
            },
            {
                title: "Sewa Event",
                warga: "5000K/ Hari",
                umum: "",
                note: "* Bola & Rompi Tersedia",
            },
        ],
    },
];

export default function PricingAccordionSection() {
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    return (
        <section className="bg-[#1a1a1a] overflow-x-clip" id="pricing-accordion">
            <div className="mx-auto max-w px-6 pt-8 sm:px-10 sm:pt-12 lg:px-16 xl:px-24 xl:pt-10">
            <SectionDivider
                number="01"
                title="Kelas"
                subtitle="01 schedulepage"
                theme="dark"
            />
            </div>
            <div className="max-w-8xl mx-auto max-w px-6 pt-8 sm:px-10 sm:pt-12 lg:px-16 xl:px-24 xl:py-10">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-16">
                    <div className="xl:col-span-4 flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="size-[17px] rounded-[5px] bg-accent-red flex-shrink-0" />
                            <span className="font-bdo font-normal text-[1.5rem] text-white">
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
                        <h2 className="font-bdo font-medium text-[clamp(2rem,4vw,3.25rem)] text-white leading-[1.27] max-w-3xl">
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
