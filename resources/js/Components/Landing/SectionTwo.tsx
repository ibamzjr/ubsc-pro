import { useState } from "react";
import { Star } from "lucide-react";
import GymTrafficBadge from "@/Components/Landing/GymTrafficBadge";
import MembershipModal from "@/Components/Landing/MembershipModal";
import DaftarButton from "@/Components/Landing/DaftarButton";
import ImageCarousel from "@/Components/Landing/ImageCarousel";
import type { CarouselImage } from "@/Components/Landing/ImageCarousel";

const DUMMY_IMAGES: CarouselImage[] = [
    {
        id: "1",
        src: "/assets/images/poster-gym-konten-program-ub-sport-center.avif",
        alt: "Gym training area",
    },
    {
        id: "3",
        src: "/assets/images/poster-sepakbola-konten-program-ub-sport-center.avif",
        alt: "Weight training",
    },
    {
        id: "5",
        src: "/assets/images/poster-basket-konten-program-ub-sport-center.avif",
        alt: "Sports facility",
    },
    {
        id: "6",
        src: "/assets/images/poster-mahal-konten-program-ub-sport-center.avif",
        alt: "Group fitness class",
    },
];

export default function SectionTwo() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <section id="about" className="overflow-x-clip bg-white">
                <div className="mx-auto max-w px-6 py-8 sm:px-10 sm:py-12 lg:px-16 lg:py-16 xl:px-24 xl:py-24">
                    <div className="grid grid-cols-1 items-start gap-10 xl:grid-cols-12 xl:gap-20">
                        <div className="xl:col-span-5">
                            <div className="flex items-center gap-2">
                                <span className="h-3 w-3 flex-shrink-0 bg-red-600" />
                                <span className="text-sm md:text-lg xl:text-xl font-regular tracking-wide text-black">
                                    Gabung Member Sekarang
                                </span>
                            </div>

                            <h2 className="mt-4 text-[clamp(1.75rem,5vw,3.25rem)] font-bold leading-[1.1] tracking-tight text-black max-w-[95%]">
                                Latihan Kekuatan dan Kebugaran Untukmu
                            </h2>

                            {/* Mobile: Area gym paragraph first, then image */}
                            <div className="block xl:hidden">
                                <p className="mt-6 text-lg font-bdo font-regular md:text-2xl leading-relaxed text-black opacity-70">
                                    Area gym ini dirancang sebagai ruang latihan
                                    yang nyaman dan fungsional untuk mendukung
                                    aktivitas kebugaran, latihan kekuatan, dan
                                    kardio bagi seluruh pengguna UB Sport
                                    Center.
                                </p>
                                <div className="mt-8 w-full max-w-[90%] sm:max-w-[400px] md:max-w-[480px] self-start md:mt-10">
                                    <div className="aspect-[6/5] w-full overflow-hidden rounded-2xl">
                                        <img
                                            src="/assets/images/gym-konten-1-olahraga-ub-sport-center.webp"
                                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                            alt="Gym"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Desktop: image only, paragraph is in right column */}
                            <div className="hidden xl:block mt-8 xl:mt-10 w-full max-w-[560px] self-start">
                                <div className="aspect-[6/5] w-full overflow-hidden rounded-2xl">
                                    <img
                                        src="/assets/images/gym-konten-1-olahraga-ub-sport-center.webp"
                                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                        alt="Gym"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col xl:col-span-7 xl:pt-2 xl:pl-12">
                            {/* Desktop: Area gym paragraph here */}
                            <p className="hidden xl:block text-lg font-bdo font-regular md:text-2xl xl:text-4xl leading-relaxed text-black opacity-70">
                                Area gym ini dirancang sebagai ruang latihan
                                yang nyaman dan fungsional untuk mendukung
                                aktivitas kebugaran, latihan kekuatan, dan
                                kardio bagi seluruh pengguna UB Sport Center.
                            </p>

                            <div className="mt-6 md:mt-8">
                                <DaftarButton
                                    label="Daftar Sekarang"
                                    href="https://api.whatsapp.com/send/?phone=6285280809080&text=Halo+UB+Sport+Center+%F0%9F%92%AA%0A%0ASaya+tertarik+untuk+mendaftar+%2AMembership+Gym%2A.+Mohon+informasi+mengenai+paket+yang+tersedia%2C+prosedur+pendaftaran%2C+dan+langkah+aktivasi+membership.%0A%0ATerima+kasih+%F0%9F%98%8A&type=phone_number&app_absent=0"
                                    onClick={() => setIsModalOpen(true)}
                                />
                            </div>

                            <div className="mt-8 md:mt-10">
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            fill="currentColor"
                                            className="h-5 w-5 text-orange-500"
                                        />
                                    ))}
                                </div>
                                <div className="mt-6 md:mt-8 xl:mt-10 flex flex-col gap-1 font-bdo font-medium text-black text-opacity-60">
                                    <p className="text-sm md:text-xl xl:text-2xl">
                                        Fasilitas gym lengkap
                                    </p>
                                    <p className="text-sm md:text-xl xl:text-2xl">
                                        Aktivitas latihan harian di pusat
                                        olahraga
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-end justify-between gap-6">
                                <GymTrafficBadge />

                               <div className="hidden 2xl:flex flex-1 items-end justify-end transition-all duration-300">
    <                               div className="w-52 h-52 flex-shrink-0 overflow-hidden rounded-tl-3xl rounded-tr-md rounded-br-3xl rounded-bl-md flex items-end shadow-2xl">
                                        <img
                                        src="/assets/images/gym-konten-2-olahraga-ub-sport-center.avif"
                                        className="h-full w-full object-cover transform hover:scale-110 transition-transform duration-500"
                                        alt="Athlete"
                                        loading="lazy"
                                    />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-0 px-6 py-6 sm:px-10 lg:px-0 lg:pl-16 xl:px-24">
                    <ImageCarousel images={DUMMY_IMAGES} />

                    <div className="mx-auto max-w px-0 sm:px-10">
                        <div className="mt-10 grid grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 xl:gap-48">
                            <div>
                                <h2 className="text-2xl sm:text-2xl md:text-3xl xl:text-4xl font-medium tracking-tight text-gray-900">
                                    Jelajahi Program Kami
                                </h2>
                            </div>
                            <div>
                                <p className="text-xs sm:text-base xl:text-xl leading-relaxed font-regular text-gray-600">
                                    Jelajahi berbagai program pilihan dan
                                    aktivitas menarik yang dirancang khusus
                                    untuk anda.
                                </p>
                            </div>
                            <div className="hidden xl:block">
                                <p className="text-xs xl:text-lg leading-relaxed font-regular text-gray-600">
                                    Jangan lewatkan kesempatan untuk bergabung
                                    dalam berbagai agenda rutin dan penawaran
                                    spesial.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <MembershipModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
