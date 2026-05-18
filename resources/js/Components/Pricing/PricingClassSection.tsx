import useEmblaCarousel from "embla-carousel-react";
import SectionDivider from "@/Components/Landing/SectionDivider";
import AnimatedBookingLink from "@/Components/News/AnimatedBookingLink";
import PricingClassCard, { ClassPricing } from "./PricingClassCard";

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


interface Props {
    facilities?: BackendFacility[];
}

export default function PricingClassSection({ facilities = [] }: Props) {
    // Map real facilities to ClassPricing format, filter to fitness classes only
    const classesData: ClassPricing[] = facilities
        .filter((f) => f.category === 'Kelas & Kebugaran')
        .map((f, idx) => ({
            id: String(idx + 1).padStart(2, '0'),
            title: `/${f.name}.`,
            description: `Ikuti kelas ${f.name} yang dipandu instruktur berpengalaman di UB Sport Center.`,
            image: f.image || '/assets/images/comingsoon.avif',
            badgeLocation: f.location ?? 'Veteran',
            badgeType: f.venue_type ?? 'Indoor Facility',
            daftarHarga: (f.display_metadata as any)?.daftarHarga || {
                left: [{ label: "Reguler" }, { label: "Warga UB 25K" }, { label: "Umum 35K" }],
                right: [{ label: "Paket" }, { label: "Diskon Tersedia" }],
            },
            persewaan: (f.display_metadata as any)?.persewaan || {
                left: [{ label: "Sewa Ruang" }, { label: "Hubungi Kami" }],
                right: [{ label: "Event" }, { label: "Custom Quote" }],
            },
        }));

    // Use real data if available, fallback to DUMMY data
    const activeClasses: ClassPricing[] = classesData;
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "start",
        dragFree: true,
    });

    return (
        <section className="bg-[#242424] overflow-x-clip" id="pricing-classes">
            <div className="mx-auto max-w px-6 pt-8 sm:px-10 sm:pt-12 lg:px-16 xl:px-24 xl:pt-10">
            <SectionDivider
                number="03"
                title="Kelas"
                subtitle="05 pricing page"
                theme="dark"
            />
            </div>
            <div className="max-w-8xl mx-auto px-4 sm:px-8 xl:px-16 pb-24">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-12 mb-12 xl:mb-16">
                    <div className="xl:col-span-8 flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="size-[17px] rounded-[5px] bg-accent-red flex-shrink-0" />
                            <span className="font-bdo font-normal text-[clamp(1rem,1.25vw,24px)] text-white">
                                Kelas Olahraga Terstruktur
                            </span>
                        </div>
                        <h2 className="font-bdo font-medium text-[clamp(2rem,2.7vw,52px)] leading-[1.1] tracking-[-0.021em] text-white">
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
                        {activeClasses.map((item) => (
                            <PricingClassCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
