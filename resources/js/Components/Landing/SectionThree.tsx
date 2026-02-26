import SectionDivider from "@/Components/Landing/SectionDivider";
export interface Location {
    id: string;
    image: string;
    title: string;
    subtitle: string;
    slug?: string;
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
                    <img
                        src={location.image}
                        alt={location.title}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105 rounded-xl"
                        draggable={false}
                    />
                ) : (
                    <div className="h-full w-full bg-gray-200" />
                )}
            </div>

            <div className="flex items-center justify-between p-5">
                <div>
                    <p className="text-lg font-semibold text-black">
                        {location.title}
                    </p>
                    <p className="mt-1 text-sm font-regular text-black opacity-60">
                        {location.subtitle}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => onViewDetail?.(location)}
                    className="flex-shrink-0 rounded-full bg-[#FF0000] px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 border border-gray-400"
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
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        title: "UB Sport Center Veteran",
        subtitle: "Pusat Kebugaran Utama",
        slug: "veteran",
    },
    {
        id: "2",
        image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&q=80",
        title: "UB Sport Center Dieng",
        subtitle: "Cabang Eksklusif",
        slug: "dieng",
    },
    {
        id: "3",
        image: "https://images.unsplash.com/photo-1496256654245-8f3d0ef3bebe?w=800&q=80",
        title: "UB Sport Center Transmart",
        subtitle: "Cabang Modern & Lifestyle",
        slug: "transmart",
    },
];

export default function SectionThree() {
    // TODO: Replace with usePage / useQuery / fetch from BE
    const locations = DUMMY_LOCATIONS;
    const total = locations.length;

    const handleViewDetail = (location: Location) => {
        // TODO: navigate to /locations/:slug or open modal
        console.log("View detail:", location.slug);
    };

    return (
        <section id="locations" className="w-full bg-white pb-20 pt-12">
            <div className="mx-auto px-10 lg:px-24">
                <SectionDivider
                    number="01"
                    title="Lokasi Kami"
                    subtitle="01 homepage"
                />

                <div className="mb-16 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-3">
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 flex-shrink-0 bg-red-600" />
                            <span className="text-sm lg:text-xl font-semibold text-gray-800">
                                Eksplorasi Cabang Kami
                            </span>
                        </div>
                    </div>

                    <div className="lg:col-span-6">
                        <h2 className="text-5xl font-medium leading-tight tracking-tight text-center text-gray-900">
                            Pusat Olahraga saat ini <br /> ada di Berbagai
                            Lokasi
                        </h2>
                    </div>

                    <div className="lg:col-span-3 lg:pt-2">
                        <p className="text-sm lg:text-xl leading-relaxed text-black">
                            Hadir di tiga lokasi strategis untuk memastikan Anda
                            selalu punya akses ke fasilitas olahraga terbaik
                            kapan saja.
                        </p>
                    </div>
                </div>

                <div className="mb-6 flex items-center justify-between">
                    <span className="text-lg lg:text-xl font-regular text-gray-900">
                        Lokasi Strategis Kami
                    </span>
                    <span className="text-lg lg:text-xl font-medium text-gray-900">
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

                <div className="mt-5 lg:text-2xl flex items-center justify-between text-lg font-regular text-gray-900">
                    <span>Pengalaman olahraga</span>
                    <span>Demi Kemajuan</span>
                </div>
            </div>
        </section>
    );
}
