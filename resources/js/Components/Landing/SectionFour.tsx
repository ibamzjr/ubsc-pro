import SectionDivider from "@/Components/Landing/SectionDivider";
import FacilityRow from "@/Components/Landing/FacilityRow";
import ReservasiButton from "@/Components/Landing/ReservasiButton";
import ClassCard from "@/Components/Landing/ClassCard";
import ArenaCard from "@/Components/Landing/ArenaCard";
import type { Facility } from "@/Components/Landing/FacilityRow";
import type { ClassItem } from "@/Components/Landing/ClassCard";
import type { ArenaItem } from "@/Components/Landing/ArenaCard";
import futsal from "@/../assets/images/futsal.png";

const DUMMY_FACILITIES: Facility[] = [
    {
        id: "001",
        name: "Lapangan Tenis",
        location: "Veteran",
        category: "Arena Dalam",
        bgImage:
            "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=1400&q=80",
        href: "#",
        slug: "lapangan-tenis",
    },
    {
        id: "002",
        name: "Lapangan Bulutangkis",
        location: "Veteran",
        category: "Arena Dalam",
        bgImage:
            "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1400&q=80",
        href: "#",
        slug: "lapangan-bulutangkis",
    },
    {
        id: "003",
        name: "Tenis Meja",
        location: "Veteran",
        category: "Ruang Olahraga",
        bgImage:
            "https://images.unsplash.com/photo-1611251135345-18c56206b863?w=1400&q=80",
        href: "#",
        slug: "tenis-meja",
    },
    {
        id: "004",
        name: "Lapangan Futsal",
        location: "Veteran",
        category: "Arena Dalam",
        bgImage: futsal,
        href: "#",
        slug: "lapangan-futsal",
    },
];

const DUMMY_CLASSES: ClassItem[] = [
    {
        id: "/Kelas 001/",
        title: "/Yoga",
        location: "Veteran",
        category: "Kebugaran",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
        href: "#",
    },
    {
        id: "/Kelas 002/",
        title: "/Aerobik",
        location: "Veteran",
        category: "Kebugaran",
        image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
        href: "#",
    },
    {
        id: "/Kelas 003/",
        title: "/Zumba",
        location: "Veteran",
        category: "Olah Tubuh",
        image: "https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?w=800&q=80",
        href: "#",
    },
    {
        id: "/Kelas 004/",
        title: "/BMU Karate",
        location: "Veteran",
        category: "Kelas Intens",
        image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&q=80",
        href: "#",
    },
];

const DUMMY_ARENAS: ArenaItem[] = [
    {
        id: "/Terbuka 001/",
        title: "/Sepak Bola",
        location: "Dieng",
        category: "Arena Lapangan",
        image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&q=80",
        href: "#",
    },
    {
        id: "/Terbuka 002/",
        title: "/Basket",
        location: "Dieng",
        category: "Arena Lapangan",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
        href: "#",
    },
    {
        id: "/Terbuka 003/",
        title: "/Volly",
        location: "Dieng",
        category: "Arena Lapangan",
        image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80",
        href: "#",
    },
    {
        id: "/Terbuka 004/",
        title: "/Futsal Dieng",
        location: "Dieng",
        category: "Arena Lapangan",
        image: futsal,
        href: "#",
    },
];

export default function SectionFour() {
    // TODO: Replace with usePage<{ facilities: Facility[] }>().props.facilities
    const facilities = DUMMY_FACILITIES;

    return (
        <section id="facilities" className="w-full bg-[#FAFAFA]">
            <div className="mx-auto max-w px-6 sm:px-10 lg:px-24">
                <SectionDivider
                    number="02"
                    title="Fasilitas"
                    subtitle="01 homepage"
                />

                <div className="mb-16 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-3">
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 flex-shrink-0 bg-red-600" />
                            <span className="text-sm lg:text-2xl font-regular text-gray-800">
                                Fasilitas Kami
                            </span>
                        </div>
                        <div className="mt-6 hidden lg:block">
                            <ReservasiButton label="Mulai Reservasi" />
                        </div>
                    </div>

                    <div className="lg:col-span-6">
                        <h2 className="max-w-lg text-3xl font-medium leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl lg:text-center items-center">
                            Dukungan Penuh Untuk Setiap Cabang Olahraga
                        </h2>
                    </div>

                    <div className="flex h-full flex-col lg:col-span-3 lg:pt-2">
                        <div className="flex flex-col gap-2 lg:block">
                            <p className="text-sm lg:text-xl font-regular leading-relaxed text-black opacity-50 lg:opacity-100">
                                Kami menghadirkan berbagai pilihan fasilitas
                                olahraga indoor dan fitness untuk kenyamanan
                                latihan Anda.
                            </p>
                            <div className="mt-4 flex items-center gap-2 lg:hidden">
                                <ReservasiButton label="Mulai Reservasi" />
                                <span className="text-sm font-regular text-gray-900">
                                    {String(facilities.length).padStart(2, "0")}
                                    /
                                    {String(facilities.length + 14).padStart(
                                        2,
                                        "0",
                                    )}
                                </span>
                            </div>
                        </div>
                        <p className="mt-12 text-right text-sm font-regular text-gray-900 lg:text-left hidden lg:block">
                            {String(facilities.length).padStart(2, "0")}/
                            {String(facilities.length + 14).padStart(2, "0")}
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full">
                {facilities.map((facility) => (
                    <FacilityRow key={facility.id} facility={facility} />
                ))}
            </div>

            <div className="grid w-full grid-cols-1 md:grid-cols-2">
                {DUMMY_CLASSES.map((item) => (
                    <ClassCard key={item.id} item={item} />
                ))}
            </div>

            <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {DUMMY_ARENAS.map((item) => (
                    <ArenaCard key={item.id} item={item} />
                ))}
            </div>
        </section>
    );
}
