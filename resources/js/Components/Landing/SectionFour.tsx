import SectionDivider from "@/Components/Landing/SectionDivider";
import ReservasiButton from "@/Components/Landing/ReservasiButton";
import FacilityListSection from "@/Components/Facility/FacilityListSection";
import FacilityClassSection from "@/Components/Facility/FacilityClassSection";
import FacilityOutdoorSection from "@/Components/Facility/FacilityOutdoorSection";
import type { FacilityItem } from "@/Components/Facility/FacilityListItem";
import type { ClassItem } from "@/Components/Facility/FacilityClassSection";
import type { OutdoorFacility } from "@/Components/Facility/FacilityOutdoorSection";

interface BackendFacility {
    id: number;
    name: string;
    image: string;
    category: string;
    location?: string | null;
    venue_type?: string | null;
    class_code?: string | null;
    rating?: number | null;
}

interface SectionFourProps {
    facilities?: BackendFacility[];
    isLandingPage?: boolean;
}

export default function SectionFour({
    facilities = [],
    isLandingPage = true,
}: SectionFourProps) {
    const arenaFacilities: FacilityItem[] = facilities
        .filter((f) => f.category === "Lapangan & Arena")
        .map((f, idx) => ({
            id: String(idx + 1).padStart(2, "0"),
            title: `/${f.name}.`,
            code:
                f.class_code ||
                `/Tertutup ${String(idx + 1).padStart(3, "0")}/`,
            image: f.image || "/assets/images/comingsoon.avif",
            badgeLocation: f.location || "Veteran",
            badgeType: f.venue_type || "Indoor Facility",
        }));

    const classFacilities: ClassItem[] = facilities
        .filter((f) => f.category === "Kelas & Kebugaran")
        .map((f, idx) => ({
            id: String(idx + 1).padStart(2, "0"),
            name: f.name,
            code: String(idx + 1).padStart(3, "0"),
            image: f.image || "/assets/images/comingsoon.avif",
            badgeLocation: f.location || "Veteran",
            badgeCategory: f.venue_type || "Kebugaran",
        }));

    const outdoorFacilities: OutdoorFacility[] = facilities
        .filter((f) => f.category === "Lapangan & Arena")
        .map((f) => ({
            id: String(f.id),
            name: f.name,
            category: f.venue_type || "Arena Luar",
            image: f.image || "/assets/images/comingsoon.avif",
            mapLink: null,
        }));
    return (
        <section id="facilities" className="w-full bg-[#FAFAFA]">
            <div className="mx-auto max-w px-6 sm:px-10 lg:px-16 xl:px-20 xl:pt-12">
                <SectionDivider
                    number="03"
                    title="Fasilitas"
                    subtitle="01 homepage"
                />

                <div className="mb-10 xl:mb-16 grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
                    <div className="xl:col-span-3">
                        <div className="mt-12 flex items-center gap-2">
                            <span className="h-3 w-3 flex-shrink-0 bg-[#FF0000] rounded-sm" />
                            <span className="font-bdo text-base md:text-[clamp(1.25rem,1.15rem,1.5rem)] font-regular tracking-wide text-black">
                                Fasilitas Kami
                            </span>
                        </div>
                        <div className="mt-24 hidden xl:block">
                            <ReservasiButton label="Mulai Reservasi" />
                        </div>
                    </div>

                    <div className="xl:col-span-6">
                        <h2 className="max-w-lg text-[clamp(1.5rem,2.7vw,52px)] font-semibold leading-[1.1] tracking-[-0.021em] text-gray xl:text-center xl:max-w-none">
                            Dukungan Penuh Untuk
                            <br />
                            Setiap Cabang Olahraga
                        </h2>
                    </div>

                    <div className="flex h-full flex-col xl:col-span-3 xl:pt-2">
                        <div className="flex flex-col gap-2 xl:block">
                            <p className="text-[clamp(0.875rem,1.04vw,20px)] font-regular leading-relaxed text-black opacity-70 xl:opacity-100">
                                Kami menghadirkan berbagai pilihan fasilitas
                                olahraga indoor dan fitness untuk kenyamanan
                                latihan Anda.
                            </p>
                            <div className="mt-4 flex items-center gap-20 xl:hidden">
                                <ReservasiButton label="Mulai Reservasi" />
                                <span className="text-sm font-regular text-gray-900">
                                    19/20
                                </span>
                            </div>
                        </div>
                        <p className="mt-12 text-right text-sm font-regular text-gray-900 xl:text-right hidden xl:block">
                            19/20
                        </p>
                    </div>
                </div>
            </div>

            <FacilityListSection
                sectionNumber="03"
                sectionTitle="Fasilitas Outdoor"
                sectionSubtitle="01 homepage"
                facilities={
                    arenaFacilities.length > 0 ? arenaFacilities : undefined
                }
                isLandingPage={isLandingPage}
            />
            <FacilityClassSection
                sectionNumber="04"
                sectionTitle="Kelas Indoor"
                sectionSubtitle="01 homepage"
                classes={
                    classFacilities.length > 0 ? classFacilities : undefined
                }
                isLandingPage={isLandingPage}
            />
            <FacilityOutdoorSection
                sectionNumber="05"
                sectionTitle="Fasilitas Outdoor"
                sectionSubtitle="01 homepage"
                facilities={
                    outdoorFacilities.length > 0 ? outdoorFacilities : undefined
                }
                isLandingPage={isLandingPage}
            />
        </section>
    );
}
