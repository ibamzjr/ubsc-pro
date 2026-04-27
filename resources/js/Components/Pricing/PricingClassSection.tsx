import useEmblaCarousel from "embla-carousel-react";
import SectionDivider from "@/Components/Landing/SectionDivider";
import AnimatedBookingLink from "@/Components/News/AnimatedBookingLink";
import PricingClassCard, { ClassPricing } from "./PricingClassCard";

const ArrowLeft = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M19 12H5M5 12L12 19M5 12L12 5" />
    </svg>
);

const ArrowRight = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M5 12H19M19 12L12 5M19 12L12 19" />
    </svg>
);

const CLASSES_DATA: ClassPricing[] = [
    {
        id: "01",
        title: "/Yoga.",
        description:
            "Tingkatkan fleksibilitas dan keseimbangan dengan latihan yoga yang dipandu instruktur berpengalaman.",
        image: "/assets/images/fasilitas-yoga-ub-sport-center.avif",
        badgeLocation: "Veteran",
        badgeType: "Indoor Facility",
        daftarHarga: {
            left: [
                { label: "Beginner" },
                { label: "Warga UB 25K" },
                { label: "Umum 23K" },
            ],
            right: [{ label: "Intermediate" }, { label: "Umum 35K" }],
        },
        persewaan: {
            left: [
                { label: "Sewa Ruang Yoga" },
                { label: "Warga UB 100K" },
                { label: "Umum 150K" },
            ],
            right: [
                { label: "Sewa Event Ruang" },
                { label: "1650K Hari" },
                { label: "(Matras Kami Fasilitasi)" },
            ],
        },
    },
    {
        id: "02",
        title: "/Zumba.",
        description:
            "Bakar kalori dengan gerakan dansa energik yang menyenangkan bersama komunitas aktif UB Sport Center.",
        image: "/assets/images/fasilitas-zumba-ub-sport-center.avif",
        badgeLocation: "Veteran",
        badgeType: "Indoor Facility",
        daftarHarga: {
            left: [
                { label: "Reguler" },
                { label: "Warga UB 30K" },
                { label: "Umum 40K" },
            ],
            right: [
                { label: "Paket 10x" },
                { label: "Warga UB 250K" },
                { label: "Umum 350K" },
            ],
        },
        persewaan: {
            left: [
                { label: "Sewa Ruang Zumba" },
                { label: "Warga UB 120K" },
                { label: "Umum 170K" },
            ],
            right: [
                { label: "Sewa Event" },
                { label: "2000K Hari" },
                { label: "(Sound System Tersedia)" },
            ],
        },
    },
    {
        id: "03",
        title: "/Aerobik.",
        description:
            "Latihan kardio intensitas tinggi untuk meningkatkan stamina dan kesehatan jantung secara optimal.",
        image: "/assets/images/fasilitas-aerobik-ub-sport-center.avif",
        badgeLocation: "Dieng",
        badgeType: "Indoor Facility",
        daftarHarga: {
            left: [
                { label: "Low Impact" },
                { label: "Warga UB 25K" },
                { label: "Umum 35K" },
            ],
            right: [
                { label: "High Impact" },
                { label: "Warga UB 35K" },
                { label: "Umum 45K" },
            ],
        },
        persewaan: {
            left: [
                { label: "Sewa Ruang Aerobik" },
                { label: "Warga UB 110K" },
                { label: "Umum 160K" },
            ],
            right: [
                { label: "Sewa Event" },
                { label: "1800K Hari" },
                { label: "(Stereo System Tersedia)" },
            ],
        },
    },
    {
        id: "04",
        title: "/Pilates.",
        description:
            "Perkuat otot inti dan perbaiki postur tubuh dengan metode Pilates yang telah terbukti secara ilmiah.",
        image: "/assets/images/comingsoon.avif",
        badgeLocation: "Veteran",
        badgeType: "Indoor Facility",
        daftarHarga: {
            left: [
                { label: "Mat Pilates" },
                { label: "Warga UB 35K" },
                { label: "Umum 45K" },
            ],
            right: [
                { label: "Reformer" },
                { label: "Warga UB 55K" },
                { label: "Umum 70K" },
            ],
        },
        persewaan: {
            left: [
                { label: "Sewa Ruang Pilates" },
                { label: "Warga UB 130K" },
                { label: "Umum 180K" },
            ],
            right: [
                { label: "Sewa Event" },
                { label: "2200K Hari" },
                { label: "(Peralatan Tersedia)" },
            ],
        },
    },
];

export default function PricingClassSection() {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "start",
        dragFree: true,
    });

    return (
        <section className="bg-[#121212] overflow-x-clip" id="pricing-classes">
            <div className="mx-auto max-w px-6 pt-8 sm:px-10 sm:pt-12 lg:px-16 xl:px-24 xl:pt-10">
            <SectionDivider
                number="02"
                title="Kelas"
                subtitle="02 schedulepage"
                theme="dark"
            />
            </div>
            <div className="max-w-8xl mx-auto px-4 sm:px-8 xl:px-16 pb-24">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-12 mb-12 xl:mb-16">
                    <div className="xl:col-span-8 flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="size-[17px] rounded-[5px] bg-accent-red flex-shrink-0" />
                            <span className="font-bdo font-normal text-[1.5rem] text-white">
                                Kelas Olahraga Terstruktur
                            </span>
                        </div>
                        <h2 className="font-bdo font-medium text-[clamp(2rem,4vw,3.25rem)] text-white leading-[1.2]">
                            Ikuti kelas yang dipandu instruktur berpengalaman,
                            sesuai level dan tujuan Anda.
                        </h2>
                    </div>

                    <div className="xl:col-span-4 flex xl:flex-col xl:items-end xl:justify-end gap-6">
                        <AnimatedBookingLink
                            label="More about me"
                            href="/coming-soon"
                        />
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => emblaApi?.scrollPrev()}
                                aria-label="Previous"
                                className="flex-shrink-0 flex size-11 items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
                            >
                                <ArrowLeft />
                            </button>
                            <button
                                onClick={() => emblaApi?.scrollNext()}
                                aria-label="Next"
                                className="flex-shrink-0 flex size-11 items-center justify-center rounded-full bg-white text-black hover:bg-white/90 transition-colors"
                            >
                                <ArrowRight />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="min-w-0 overflow-hidden" ref={emblaRef}>
                    <div className="flex gap-4 xl:gap-6">
                        {CLASSES_DATA.map((item) => (
                            <PricingClassCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
