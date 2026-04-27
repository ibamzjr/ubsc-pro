import SectionDivider from "@/Components/Landing/SectionDivider";
import FacilityListItem from "./FacilityListItem";
import type { FacilityItem } from "./FacilityListItem";

const FACILITIES: FacilityItem[] = [
    {
        id: "01",
        title: "/Yoga",
        code: "/Kelas 001/",
        image: "/assets/images/fasilitas-yoga-ub-sport-center.avif",
        badgeLocation: "Veteran",
        badgeType: "Kebugaran",
    },
    {
        id: "02",
        title: "/Zumba",
        code: "/Kelas 002/",
        image: "/assets/images/fasilitas-zumba-ub-sport-center.avif",
        badgeLocation: "Veteran",
        badgeType: "Kebugaran",
    },
    {
        id: "03",
        title: "/Aerobik",
        code: "/Kelas 003/",
        image: "/assets/images/fasilitas-aerobik-ub-sport-center.avif",
        badgeLocation: "Dieng",
        badgeType: "Kebugaran",
    },
    {
        id: "04",
        title: "/BMU Karate",
        code: "/Kelas 004/",
        image: "/assets/images/fasilitas-beladiri-ub-sport-center.avif",
        badgeLocation: "Veteran",
        badgeType: "Kebugaran",
    },
    {
        id: "05",
        title: "/Zona Akurasi",
        code: "/Kelas 005/",
        image: "/assets/images/fasilitas-zona-akurasi-ub-sport-center.avif",
        badgeLocation: "Dieng",
        badgeType: "Arena",
    },
];

export default function FacilityListSection() {
    return (
        <section className="bg-white overflow-x-clip" id="facility-content">
            <div className="mx-auto max-w px-6 pt-8 sm:px-10 sm:pt-12 lg:px-16 xl:px-24 xl:pt-10">
            <SectionDivider
                number="02"
                title="Lokasi Kami"
                subtitle="/01 aboutpage"
                theme="light"
            />
            </div>
            <div className="mx-auto max-w px-6 py-6 sm:px-10 xl:px-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-16 mb-16">
                    <div className="lg:col-span-3">
                        <div className="flex items-center gap-3">
                            <div className="size-[17px] rounded-[5px] bg-accent-red flex-shrink-0" />
                            <span className="font-bdo font-normal text-[1.5rem] text-black">
                                Layanan Unggulan
                            </span>
                        </div>
                    </div>

                    <div className="lg:col-span-6">
                        <h2 className="font-bdo font-medium text-[clamp(2rem,3.5vw,3rem)] text-black leading-[1.15]">
                            Mendukung Kebutuhan Aktivitas Olahraga Anda
                        </h2>
                    </div>

                    <div className="lg:col-span-3">
                        <p className="font-bdo text-sm text-gray-600 leading-relaxed">
                            Beragam layanan pendukung kami hadir untuk
                            memberikan kenyamanan terbaik bagi pengguna.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col w-full border-t border-gray-200">
                    {FACILITIES.map((item) => (
                        <FacilityListItem key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </section>
    );
}
