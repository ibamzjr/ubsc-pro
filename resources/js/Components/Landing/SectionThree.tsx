import SectionDivider from "@/Components/Landing/SectionDivider";
import ScrollStack, { ScrollStackItem } from "@/Components/Landing/ScrollStack";
import { ArrowUpRight } from "lucide-react";
import gym from "../../../assets/hero/gym.svg";

export interface Location {
    id: string;
    name: string;
    category: string;
    image: string;
    mapLink?: string;
}

const DUMMY_LOCATIONS: Location[] = [
    {
        id: "1",
        name: "UB Sport Center Veteran",
        category: "Pusat Kebugaran Utama",
        image: "/assets/images/ub-sport-center-kantor-pusat-malang.avif",
        mapLink: "https://maps.app.goo.gl/JLc41TfD5TuLfu8h9",
    },
    {
        id: "2",
        name: "UB Sport Center Dieng",
        category: "Cabang Arena Terbuka",
        image: "/assets/images/fasilitas-arena-terbuka-dieng-ub-sport-center-malang.avif",
        mapLink: "https://maps.app.goo.gl/RNPXp5pW2TqcE2YGA",
    },
    {
        id: "3",
        name: "UB Sport Center Transmart",
        category: "Cabang Eksklusif",
        image: "/assets/images/cabang-eksklusif-transmart-ub-sport-center-malang.avif",
        mapLink: "https://maps.app.goo.gl/rNEukCEQAQSZDAga6",
    },
];

function LocationCard({ location }: { location: Location }) {
    const handleClick = () => {
        if (location.mapLink) {
            window.open(location.mapLink, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <div
            className="flex flex-col w-full bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer"
            onClick={handleClick}
        >
            <div className="relative w-full aspect-[16/11] overflow-hidden">
                <img
                    src={location.image}
                    alt={location.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    draggable={false}
                    loading="lazy"
                />
            </div>

            <div className="flex items-start justify-between p-6">
                <div className="flex flex-col gap-1">
                    <h3 className="font-bdo font-medium text-[clamp(1rem,1.25vw,24px)] text-black leading-tight">
                        {location.name}
                    </h3>
                    <p className="font-bdo font-normal text-[clamp(0.875rem,0.83vw,16px)] text-gray-500">
                        {location.category}
                    </p>
                </div>
                <ArrowUpRight
                    size={24}
                    className="flex-shrink-0 mt-1 text-gray-400 transition-colors hover:text-black"
                />
            </div>
        </div>
    );
}

export default function SectionThree() {
    return (
        <section id="locations" className="w-full bg-[#F5F7F9]">
            <div className="mx-auto px-6 pt-8 sm:px-10 sm:pt-12 lg:px-16 lg:pt-16 xl:px-24 xl:pt-10">
                <SectionDivider
                    number="03"
                    title="Lokasi Kami"
                    subtitle="01/ homepage"
                    theme="light"
                />
            </div>

            <div className="mx-auto px-6 pb-8 sm:px-10 sm:py-12 lg:px-16 xl:px-24 xl:py-3 flex flex-col gap-12 xl:flex-row xl:gap-10 xl:items-start">
                {/* Left sticky sidebar */}
                <div className="xl:sticky xl:top-24 xl:w-56 xl:flex-shrink-0 flex flex-col gap-5">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-xl bg-accent-red flex-shrink-0" />
                        <span className="font-bdo font-medium text-sm text-black tracking-widest">
                            Eksplorasi Cabang Kami
                        </span>
                    </div>

                    <div className="inline-flex w-fit items-center gap-3 overflow-hidden rounded-md border border-gray-200 bg-white pr-4 shadow-sm">
                        <div className="flex h-12 w-16 items-center justify-center rounded-md bg-gradient-to-tr from-[#002244] to-[#15678D]">
                            <img src={gym} alt="Gym Icon" className="h-5 w-5" />
                        </div>
                        <span className="font-bdo font-medium text-sm text-black">
                            Cabang Kami
                        </span>
                    </div>
                </div>

                {/* ScrollStack cards */}
                <div className="flex-1 min-w-0">
                    <ScrollStack topStart={80} cardOffset={20}>
                        {DUMMY_LOCATIONS.map((loc) => (
                            <ScrollStackItem key={loc.id}>
                                <LocationCard location={loc} />
                            </ScrollStackItem>
                        ))}
                    </ScrollStack>
                </div>

                {/* Right sticky description */}
                <div className="hidden xl:flex xl:sticky xl:top-24 xl:w-52 xl:flex-shrink-0 flex-col justify-start pt-2">
                    <h2 className="font-bdo font-medium text-[clamp(1rem,1.04vw,20px)] leading-snug text-black">
                        Pusat Olahraga saat ini ada di Berbagai Lokasi
                    </h2>
                </div>
            </div>
        </section>
    );
}
