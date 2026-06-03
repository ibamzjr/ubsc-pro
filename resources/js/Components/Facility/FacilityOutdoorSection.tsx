import SectionDivider from "@/Components/Landing/SectionDivider";
import ScrollStack, { ScrollStackItem } from "@/Components/Landing/ScrollStack";
import gym from "@/../assets/hero/gym.svg";
import branchesIcon from "@/../assets/icons/branches.svg";

export interface OutdoorFacility {
    id: string | number;
    name: string;
    category: string;
    image: string;
    mapLink?: string | null;
}

const DUMMY_OUTDOOR_FACILITIES: OutdoorFacility[] = [
    {
        id: "1",
        name: "Lapangan Sepak Bola Dieng",
        category: "Arena Luar Terbuka",
        image: "/assets/images/fasilitas-arena-terbuka-dieng-ub-sport-center-malang.avif",
    },
    {
        id: "2",
        name: "Lapangan Tenis Veteran",
        category: "Fasilitas Outdoor Utama",
        image: "/assets/images/fasilitas-bulutangkis-ub-sport-center.avif",
    },
    {
        id: "3",
        name: "Lapangan Futsal Dieng",
        category: "Arena Luar Terbuka",
        image: "/assets/images/fasilitas-arena-terbuka-dieng-ub-sport-center-malang.avif",
    },
    {
        id: "4",
        name: "Lapangan Basket Veteran",
        category: "Arena Outdoor",
        image: "/assets/images/fasilitas-bulutangkis-ub-sport-center.avif",
    },
    {
        id: "5",
        name: "Lapangan Voli Outdoor",
        category: "Arena Outdoor",
        image: "/assets/images/fasilitas-yoga-ub-sport-center.avif",
    },
    {
        id: "6",
        name: "Arena Serbaguna",
        category: "Fasilitas Outdoor",
        image: "/assets/images/fasilitas-aerobik-ub-sport-center.avif",
    },
];

function OutdoorFacilityCard({ facility }: { facility: OutdoorFacility }) {
    return (
        <a
            href={facility.mapLink ?? "#"}
            target={facility.mapLink ? "_blank" : undefined}
            rel={facility.mapLink ? "noopener noreferrer" : undefined}
            className="flex flex-col gap-6 w-full cursor-pointer group"
        >
            <div className="relative w-full overflow-hidden">
                {/* Blurred backdrop */}
                <div className="absolute inset-0">
                    <img
                        src={facility.image}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover scale-110 blur-sm saturate-150 brightness-75"
                    />
                </div>

                {/* Sharp foreground image with padding */}
                <div className="rounded-none relative z-10 p-5 py-16 sm:px-[clamp(2rem,5vw,5rem)] xl:px-[clamp(5rem,6vw,10rem)] xl:py-24 flex flex-col gap-5">
                    <div className="relative w-full aspect-[16/11] overflow-hidden transition-transform duration-300 ease-out group-hover:scale-[1.02]">
                        <img
                            src={facility.image}
                            alt={facility.name}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* Text below image */}
            <div className="flex items-start justify-between px-2 bg-[#F5F7F9]">
                <div className="flex flex-col gap-1">
                    <h3 className="font-bdo font-semibold text-[clamp(1.25rem,1.3vw,32px)] text-black leading-tight">
                        {facility.name}
                    </h3>
                    <p className="font-bdo font-normal text-[clamp(0.875rem,1vw,18px)] text-gray-500">
                        {facility.category}
                    </p>
                </div>
                <div className="flex-shrink-0 flex items-center justify-center size-10 xl:size-12 text-gray-400">
                    <img src={branchesIcon} alt="" className="h-4 w-4" />
                </div>
            </div>
        </a>
    );
}

interface FacilityOutdoorSectionProps {
    sectionNumber?: string;
    sectionTitle?: string;
    sectionSubtitle?: string;
    facilities?: OutdoorFacility[];
    isLandingPage?: boolean;
}

export default function FacilityOutdoorSection({
    sectionNumber = "02",
    sectionTitle = "Fasilitas Outdoor",
    sectionSubtitle = "04 facilities",
    facilities,
    isLandingPage = false,
}: FacilityOutdoorSectionProps = {}) {
    const activeFacilities =
        facilities && facilities.length > 0
            ? facilities
            : DUMMY_OUTDOOR_FACILITIES;
    const renderedItems = isLandingPage
        ? activeFacilities.slice(0, 4)
        : activeFacilities;

    return (
        <section
            className="w-full bg-[#F5F7F9] pb-10 lg:pb-24"
            id="facility-outdoor"
        >
            <div className="mx-auto max-w px-6 pt-8 sm:px-10 sm:pt-12 lg:px-16 lg:pt-16 xl:px-24 xl:pt-10">
                <SectionDivider
                    number={sectionNumber}
                    title={sectionTitle}
                    subtitle={sectionSubtitle}
                    theme="light"
                />
            </div>

            <div className="mx-auto px-6 mt-12 sm:px-10 lg:px-16 xl:px-24 flex flex-col gap-6 xl:flex-row xl:gap-32 xl:items-start">
                {/* Left column */}
                <div className="xl:w-64 xl:flex-shrink-0 xl:self-stretch">
                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 flex-shrink-0 bg-[#FF0000] rounded-sm" />
                        <span className="font-bdo text-[clamp(1rem,1rem,1.5rem)] font-medium tracking-wide text-gray-900">
                            Eksplorasi Arena Luar
                        </span>
                    </div>

                    {/* Mobile heading */}
                    <div className="xl:hidden mt-4 font-bdo font-medium text-[clamp(1.24rem,4vw,1.5rem)] leading-tight text-black">
                        <h2>Fasilitas Lapangan Terbuka</h2>
                        <h2>Kelas Dunia Tersedia untuk Anda</h2>
                    </div>

                    {/* Desktop sticky badge */}
                    <div className="hidden xl:block xl:sticky xl:top-[50vh] xl:-translate-y-1/2 xl:mt-[12rem]">
                        <div className="inline-flex w-fit items-center gap-4 overflow-hidden rounded-xl border border-gray-100 bg-white p-1 pr-5 shadow-sm">
                            <div className="flex h-12 w-14 items-center justify-center rounded-lg bg-gradient-to-tr from-[#002244] to-[#15678D]">
                                <img src={gym} alt="" className="h-3 w-3" />
                            </div>
                            <span className="font-bdo font-semibold text-[15px] text-black/70">
                                <span className="font-light">01/04</span>{" "}
                                Fasilitas Outdoor
                            </span>
                        </div>
                    </div>
                </div>

                {/* ScrollStack cards */}
                <div className="flex-1 min-w-0">
                    <ScrollStack topStart={120} cardOffset={0}>
                        {renderedItems.map((facility) => (
                            <ScrollStackItem key={facility.id}>
                                <div className="bg-[#F5F7F9]">
                                    <OutdoorFacilityCard facility={facility} />
                                </div>
                            </ScrollStackItem>
                        ))}
                    </ScrollStack>
                </div>

                {/* Mobile badge */}
                <div className="xl:hidden">
                    <div className="inline-flex w-fit items-center gap-4 overflow-hidden rounded-xl border border-gray-200 bg-white p-1 pr-5 shadow-sm">
                        <div className="flex h-11 w-14 items-center justify-center rounded-lg bg-gradient-to-tr from-[#002244] to-[#15678D]">
                            <img src={gym} alt="" className="h-3 w-3" />
                        </div>
                        <span className="font-bdo font-semibold text-[14px] text-black/70">
                            <span className="font-light">01/04</span>{" "}
                            Fasilitas Outdoor
                        </span>
                    </div>
                </div>

                {/* Right sticky heading — desktop only */}
                <div className="hidden xl:flex xl:w-56 xl:flex-shrink-0 xl:self-stretch flex-col">
                    <div className="xl:sticky xl:top-[50vh] xl:-translate-y-1/2 xl:mt-[12rem]">
                        <h2 className="font-bdo font-medium text-[20px] leading-[1.4] text-black">
                            Fasilitas Lapangan Terbuka Kelas Dunia Tersedia
                            untuk Anda
                        </h2>
                    </div>
                </div>
            </div>
        </section>
    );
}
