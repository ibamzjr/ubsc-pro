import SectionDivider from "@/Components/Landing/SectionDivider";
import FacilityRow from "@/Components/Landing/FacilityRow";
import ReservasiButton from "@/Components/Landing/ReservasiButton";
import ClassCard from "@/Components/Landing/ClassCard";
import ArenaCard from "@/Components/Landing/ArenaCard";
import type { Facility } from "@/Components/Landing/FacilityRow";
import type { ClassItem } from "@/Components/Landing/ClassCard";
import type { ArenaItem } from "@/Components/Landing/ArenaCard";

const DUMMY_FACILITIES: Facility[] = [
    {
        id: "001",
        name: "Lapangan Tenis",
        location: "Veteran",
        category: "Arena Dalam",
        bgImage: "/assets/images/fasilitas-tenis-ub-sport-center.avif",
        href: "https://ayo.co.id/v/ub-sport-center",
        slug: "lapangan-tenis",
    },
    {
        id: "002",
        name: "Lapangan Bulutangkis",
        location: "Veteran",
        category: "Arena Dalam",
        bgImage: "/assets/images/fasilitas-bulutangkis-ub-sport-center.avif",
        href: "#",
        slug: "lapangan-bulutangkis",
    },
    {
        id: "003",
        name: "Tenis Meja",
        location: "Veteran",
        category: "Ruang Olahraga",
        bgImage: "/assets/images/fasilitas-tennis-meja-ub-sport-center.avif",
        href: "#",
        slug: "tenis-meja",
    },
    {
        id: "004",
        name: "Lapangan Futsal",
        location: "Veteran",
        category: "Arena Dalam",
        bgImage: "/assets/images/fasilitas-futsal-ub-sport-center.avif",
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
        image: "/assets/images/fasilitas-yoga-ub-sport-center.avif",
        href: "#",
    },
    {
        id: "/Kelas 002/",
        title: "/Aerobik",
        location: "Veteran",
        category: "Kebugaran",
        image: "/assets/images/fasilitas-aerobik-ub-sport-center.avif",
        href: "#",
    },
    {
        id: "/Kelas 003/",
        title: "/Zumba",
        location: "Veteran",
        category: "Olah Tubuh",
        image: "/assets/images/fasilitas-zumba-ub-sport-center.avif",
        href: "#",
    },
    {
        id: "/Kelas 004/",
        title: "/BMU Karate",
        location: "Veteran",
        category: "Kelas Intens",
        image: "/assets/images/fasilitas-beladiri-ub-sport-center.avif",
        href: "#",
    },
];

const DUMMY_ARENAS: ArenaItem[] = [
    {
        id: "/Terbuka 001/",
        title: "/Sepak Bola",
        location: "Dieng",
        category: "Arena Lapangan",
        image: "/assets/images/fasilitas-sepak-bola-ub-sport-center.avif",
        href: "#",
    },
    {
        id: "/Terbuka 002/",
        title: "/Basket",
        location: "Dieng",
        category: "Arena Lapangan",
        image: "/assets/images/fasilitas-basket-akurasi-ub-sport-center.avif",
        href: "#",
    },
    {
        id: "/Terbuka 003/",
        title: "/Volly",
        location: "Dieng",
        category: "Arena Lapangan",
        image: "/assets/images/fasilitas-voli-ub-sport-center.avif",
        href: "#",
    },
    {
        id: "/Terbuka 004/",
        title: "/Futsal Dieng",
        location: "Dieng",
        category: "Arena Lapangan",
        image: "/assets/images/fasilitas-futsal-dieng-ub-sport-center.avif",
        href: "#",
    },
];

export default function SectionFour() {
    const facilities = DUMMY_FACILITIES;

    return (
        <section id="facilities" className="w-full bg-[#FAFAFA]">
            <div className="mx-auto max-w px-6 sm:px-10 lg:px-16 xl:px-24">
                <SectionDivider
                    number="02"
                    title="Fasilitas"
                    subtitle="01 homepage"
                />

                <div className="mb-10 xl:mb-16 grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
                    <div className="xl:col-span-3">
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 flex-shrink-0 bg-red-600" />
                            <span className="text-sm md:text-base xl:text-2xl font-regular text-gray-800">
                                Fasilitas Kami
                            </span>
                        </div>
                        <div className="mt-6 hidden xl:block">
                            <ReservasiButton label="Mulai Reservasi" />
                        </div>
                    </div>

                    <div className="xl:col-span-6">
                        <h2 className="max-w-lg text-3xl font-medium leading-tight tracking-tight text-gray-900 md:text-4xl xl:text-5xl xl:text-center xl:max-w-none">
                            Dukungan Penuh Untuk
                            <br />
                            Setiap Cabang Olahraga
                        </h2>
                    </div>

                    <div className="flex h-full flex-col xl:col-span-3 xl:pt-2">
                        <div className="flex flex-col gap-2 xl:block">
                            <p className="text-sm md:text-base xl:text-xl font-regular leading-relaxed text-black opacity-70 xl:opacity-100">
                                Kami menghadirkan berbagai pilihan fasilitas
                                olahraga indoor dan fitness untuk kenyamanan
                                latihan Anda.
                            </p>
                            <div className="mt-4 flex items-center gap-4 xl:hidden">
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
                        <p className="mt-12 text-right text-sm font-regular text-gray-900 xl:text-left hidden xl:block">
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

            <div className="grid w-full grid-cols-2 md:grid-cols-4">
                {DUMMY_ARENAS.map((item) => (
                    <ArenaCard key={item.id} item={item} />
                ))}
            </div>
        </section>
    );
}
