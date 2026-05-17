import SectionDivider from "@/Components/Landing/SectionDivider";
import FacilityBadge from "@/Components/Landing/FacilityBadge";

export interface ClassItem {
    id: string;
    name: string;
    code: string;
    image: string;
    badgeLocation: string;
    badgeCategory: string;
    comingSoon?: boolean;
}

const DUMMY_CLASSES: ClassItem[] = [
    {
        id: "01",
        name: "Yoga",
        code: "001",
        image: "/assets/images/fasilitas-yoga-ub-sport-center.avif",
        badgeLocation: "Veteran",
        badgeCategory: "Kebugaran",
    },
    {
        id: "02",
        name: "Zumba",
        code: "002",
        image: "/assets/images/fasilitas-zumba-ub-sport-center.avif",
        badgeLocation: "Veteran",
        badgeCategory: "Kebugaran",
    },
    {
        id: "03",
        name: "Aerobik",
        code: "003",
        image: "/assets/images/fasilitas-aerobik-ub-sport-center.avif",
        badgeLocation: "Veteran",
        badgeCategory: "Kebugaran",
    },
    {
        id: "04",
        name: "BMU Karate",
        code: "004",
        image: "/assets/images/fasilitas-beladiri-ub-sport-center.avif",
        badgeLocation: "Veteran",
        badgeCategory: "Kebugaran",
    },
    {
        id: "05",
        name: "Zona Akurasi",
        code: "005",
        image: "/assets/images/fasilitas-zona-akurasi-ub-sport-center.avif",
        badgeLocation: "Veteran",
        badgeCategory: "Kebugaran",
    },
    {
        id: "06",
        name: "Pilates",
        code: "006",
        image: "/assets/images/comingsoon.avif",
        badgeLocation: "Veteran",
        badgeCategory: "Kebugaran",
    },
];


// Tailwind z-index per row — later rows cover earlier rows on scroll (all screen sizes)
const ROW_Z: string[] = ["z-10", "z-20", "z-30"];

function BlueDots({ activeIndex }: { activeIndex: number }) {
    return (
        <div className="flex items-center gap-1.5 flex-shrink-0">
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${
                        i === activeIndex ? "bg-blue-500" : "bg-gray-300"
                    }`}
                />
            ))}
        </div>
    );
}

function FacilityClassCard({
    data,
    index,
}: {
    data: ClassItem;
    index: number;
}) {
    return (
        <div className="w-full bg-[#F5F4F3] rounded-xl border border-gray-100 p-5 xl:p-3 shadow-sm">
            {/* Top bar: dots + class name + class ID */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <BlueDots activeIndex={index} />
                    <h3 className="font-bdo font-semibold text-base xl:text-xl tracking-tight text-gray-900 truncate">
                        /{data.name}.
                    </h3>
                </div>
                <span className="font-bdo text-[10px] xl:text-xs text-[#090909] opacity-60 tracking-widest whitespace-nowrap ml-3 flex-shrink-0">
                    /Class {data.code}/
                </span>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-2xl">
                <img
                    src={data.image}
                    alt={data.name}
                    className="h-full w-full object-cover"
                />
                {/* Badge — top-right of image */}
                <div className="absolute top-3 right-3 xl:top-4 xl:right-4">
                    <FacilityBadge
                        location={data.badgeLocation}
                        category={data.badgeCategory}
                        variant="blue-red"
                    />
                </div>
            </div>
        </div>
    );
}

interface FacilityClassSectionProps {
    sectionNumber?: string;
    sectionTitle?: string;
    sectionSubtitle?: string;
    classes?: ClassItem[];
}

export default function FacilityClassSection({
    sectionNumber = "03",
    sectionTitle = "Kelas Indoor",
    sectionSubtitle = "04 facility page",
    classes,
}: FacilityClassSectionProps = {}) {
    const activeClasses = classes && classes.length > 0 ? classes : DUMMY_CLASSES;
    const CLASS_ROWS = [
        activeClasses.slice(0, 2),
        activeClasses.slice(2, 4),
        activeClasses.slice(4, 6),
    ];
    return (
        <section className="bg-white" id="facility-classes">
            <div className="mx-auto max-w px-6 pt-8 sm:px-10 sm:pt-12 lg:px-16 xl:px-24 xl:pt-10">
                <SectionDivider
                    number={sectionNumber}
                    title={sectionTitle}
                    subtitle={sectionSubtitle}
                    theme="light"
                />
            </div>

            <div className="mx-auto max-w px-6 pb-16 sm:px-10 xl:px-24">
                {/* 3-column header: label | heading | description */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-8 items-start mt-12 mb-16">
                    <div className="xl:col-span-3 flex items-center gap-3">
                        <span className="h-3 w-3 flex-shrink-0 bg-[#FF0000] rounded-sm" />
                        <span className="font-bdo text-[clamp(1.25rem,1.15rem,1.5rem)] font-medium tracking-wide text-gray-900">
                            Gabung Member Sekarang
                        </span>
                    </div>

                    <div className="xl:col-span-6">
                        <h2
                            className="font-bdo font-medium text-black leading-[1.1] xl:max-w-none"
                            style={{
                                fontSize: "clamp(1.5rem, 2.7vw, 52px)",
                                letterSpacing: "-0.021em",
                            }}
                        >
                            Mendukung Kebutuhan <br />
                            Aktivitas Olahraga Anda
                        </h2>
                    </div>

                    <div className="xl:col-span-3">
                        <p className="text-[clamp(0.875rem,1.04vw,20px)] font-regular leading-relaxed text-black opacity-70 xl:opacity-100">
                            Beragam layanan pendukung kami hadir untuk
                            memberikan kenyamanan terbaik bagi pengguna.
                        </p>
                    </div>
                </div>

                {/* Mobile: 1 card per sticky unit */}
                <div className="relative xl:hidden">
                    {activeClasses.map((card, index) => (
                        <div
                            key={card.id}
                            className="sticky top-[80px] bg-white pb-4"
                            style={{ zIndex: 10 + index * 10 }}
                        >
                            <FacilityClassCard data={card} index={index} />
                        </div>
                    ))}
                </div>

                {/* Desktop: 2 cards per sticky unit (one row) */}
                <div className="relative hidden xl:block">
                    {CLASS_ROWS.map((row, rowIndex) => (
                        <div
                            key={rowIndex}
                            className={`sticky top-[120px] bg-[white] ${ROW_Z[rowIndex] ?? ""}`}
                        >
                            <div className="grid grid-cols-2 gap-4 pb-4">
                                {row.map((card, cardInRow) => (
                                    <FacilityClassCard
                                        key={card.id}
                                        data={card}
                                        index={rowIndex * 2 + cardInRow}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
