import SectionDivider from "@/Components/Landing/SectionDivider";
import { router } from "@inertiajs/react";
export interface Location {
    id: string;
    image: string;
    title: string;
    subtitle: string;
    slug?: string;
    mapLink?: string;
}

interface LocationCardProps {
    location: Location;
    onViewDetail?: (location: Location) => void;
}

function LocationCard({ location, onViewDetail }: LocationCardProps) {
    return (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="aspect-[4/3] w-full overflow-hidden p-2">
                {location.image ? (
                    <picture>
                        <img
                            src={location.image}
                            alt={location.title}
                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105 rounded-xl"
                            draggable={false}
                            loading="lazy"
                        />
                    </picture>
                ) : (
                    <div className="h-full w-full bg-gray-200" />
                )}
            </div>

            {/* Mobile: stacked, Desktop: flex-row */}
            <div className="flex flex-row flex-wrap items-center gap-3 p-5 justify-between">
                <div>
                    <p className="text-base md:text-lg font-semibold text-black">
                        {location.title}
                    </p>
                    <p className="mt-1 text-sm font-regular text-black opacity-60">
                        {location.subtitle}
                    </p>
                </div>

                <button
    type="button"
    onClick={() => onViewDetail?.(location)}
    className="
        rounded-full 
        bg-[#FF0000] 
        px-6 sm:px-5 md:px-6 
        py-2 
        text-[12px] sm:text-[13px] md:text-[14px] 
        font-medium 
        text-white 
        border border-red-400
        flex-shrink-0
        transition-transform transition-colors duration-200 ease-in-out
        hover:bg-red-700 hover:scale-105
        active:scale-95
    "
>
    Lihat Detail
</button>
            </div>
        </div>
    );
}

const DUMMY_LOCATIONS: Location[] = [
    {
        id: "1",
        image: "/assets/images/ub-sport-center-kantor-pusat-malang.avif",
        title: "UB Sport Center Veteran",
        subtitle: "Pusat Kebugaran Utama",
        slug: "veteran",
        mapLink: "https://maps.app.goo.gl/JLc41TfD5TuLfu8h9",
    },
    {
        id: "2",
        image: "/assets/images/fasilitas-arena-terbuka-dieng-ub-sport-center-malang.avif",
        title: "UB Sport Center Dieng",
        subtitle: "Cabang Eksklusif",
        slug: "dieng",
        mapLink: "https://maps.app.goo.gl/RNPXp5pW2TqcE2YGA",
    },
    {
        id: "3",
        image: "/assets/images/cabang-eksklusif-transmart-ub-sport-center-malang.avif",
        title: "UB Sport Center Transmart",
        subtitle: "Cabang Modern & Lifestyle",
        slug: "transmart",
        mapLink: "https://maps.app.goo.gl/rNEukCEQAQSZDAga6",
    },
];

export default function SectionThree() {
    // TODO: Replace with usePage / useQuery / fetch from BE
    const locations = DUMMY_LOCATIONS;
    const total = locations.length;

    const handleViewDetail = (location: Location) => {
    if (location.mapLink) {
        window.open(location.mapLink, "_blank", "noopener,noreferrer");
    }
};

    return (
        <section id="locations" className="w-full bg-white">
            <div className="mx-auto max-w px-6 py-8 sm:px-10 sm:py-12 lg:px-16 lg:py-16 xl:px-24 xl:py-24">
                <SectionDivider
                    number="01"
                    title="Lokasi Kami"
                    subtitle="01 homepage"
                />

                <div className="mb-8 xl:mb-16 grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
                    <div className="xl:col-span-3">
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 flex-shrink-0 bg-red-600" />
                            <span className="text-sm md:text-lg xl:text-xl font-semibold text-gray-800">
                                Eksplorasi Cabang Kami
                            </span>
                        </div>
                    </div>

                    <div className="xl:col-span-6">
                        <h2 className="text-3xl md:text-5xl xl:text-5xl font-medium leading-tight tracking-tight xl:text-center text-gray-900">
                            Pusat Olahraga saat ini{" "}
                            <br className="hidden xl:block" /> ada di Berbagai
                            Lokasi
                        </h2>
                    </div>

                    <div className="xl:col-span-3 xl:pt-2">
                        <p className="text-sm md:text-lg xl:text-xl leading-relaxed text-black opacity-70 xl:opacity-100">
                            Hadir di tiga lokasi strategis untuk memastikan Anda
                            selalu punya akses ke fasilitas olahraga terbaik
                            kapan saja.
                        </p>
                    </div>
                </div>

                <div className="mb-6 flex items-center justify-between">
                    <span className="text-sm md:text-base xl:text-xl font-regular text-gray-900">
                        Lokasi Strategis Kami
                    </span>
                    <span className="text-sm md:text-base xl:text-xl font-medium text-gray-900">
                        01/{String(total).padStart(2, "0")}
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {locations.map((loc) => (
                        <LocationCard
                            key={loc.id}
                            location={loc}
                            onViewDetail={handleViewDetail}
                        />
                    ))}
                </div>

                <div className="mt-5 text-xs md:text-base xl:text-2xl flex items-center justify-between font-regular text-gray-900">
                    <span>Pengalaman olahraga</span>
                    <span>Demi Kemajuan</span>
                </div>
            </div>
        </section>
    );
}
