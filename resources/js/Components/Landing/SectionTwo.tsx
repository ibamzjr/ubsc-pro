import { Star } from "lucide-react";
import GymTrafficBadge from "@/Components/Landing/GymTrafficBadge";
import ReservasiButton from "@/Components/Landing/ReservasiButton";
import LogoMarquee from "@/Components/Landing/LogoMarquee";
import SectionDivider from "@/Components/Landing/SectionDivider";
import ImageCarousel from "@/Components/Landing/ImageCarousel";
import type { CarouselImage } from "@/Components/Landing/ImageCarousel";

const DUMMY_IMAGES: CarouselImage[] = [
    {
        id: "1",
        src: "/assets/images/poster-gym-konten-program-ub-sport-center.avif",
        alt: "Gym training area",
    },
    {
        id: "2",
        src: "/assets/images/poster-sepakbola-konten-program-ub-sport-center.avif",
        alt: "Football training",
    },
    {
        id: "3",
        src: "/assets/images/poster-basket-konten-program-ub-sport-center.avif",
        alt: "Basketball court",
    },
    {
        id: "4",
        src: "/assets/images/poster-mahal-konten-program-ub-sport-center.avif",
        alt: "Group fitness class",
    },
];

export default function SectionTwo() {
    return (
        <section id="about" className="overflow-x-clip bg-white">
            <div className="mx-auto px-6 py-8 sm:px-10 sm:py-12 xl:px-24 xl:pb-24">
                <SectionDivider
                    number="01"
                    title="Gym Kami"
                    subtitle="01/ homepage"
                    theme="light"
                />

                <div className="mt-12 grid grid-cols-1 items-start gap-10 xl:grid-cols-12 xl:gap-16">
                    {/* Left column: badge + GymTrafficBadge + image */}
                    <div className="xl:col-span-4 flex flex-col gap-6">
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 flex-shrink-0 bg-red-600" />
                            <span className="text-[clamp(0.875rem,1.04vw,20px)] font-normal tracking-wide text-black">
                                Gabung Member Sekarang
                            </span>
                        </div>

                        <GymTrafficBadge />

                        <div className="w-full aspect-[473/365] overflow-hidden rounded-2xl">
                            <img
                                src="/assets/images/gym-konten-1-olahraga-ub-sport-center.webp"
                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                alt="Gym"
                                loading="lazy"
                            />
                        </div>
                    </div>

                    {/* Right column: h2 + ReservasiButton + feature grid */}
                    <div className="xl:col-span-8 flex flex-col gap-8 xl:pt-2">
                        <h2 className="text-[clamp(1.875rem,2.6vw,52px)] font-bold leading-[1.1] tracking-[-0.021em] text-black max-w indent-[4rem] md:indent-[6rem] lg:indent-[120px]">
                            Area gym ini dirancang sebagai ruang latihan
                            <span className="text-[#888888] font-medium"> yang nyaman dan fungsional untuk mendukung, latihan kekuatan, dan </span>
                            kardio bagi seluruh pengguna UB Sport Center.®
                        </h2>

                        <ReservasiButton
                            label="Daftar Sekarang"
                            href="https://api.whatsapp.com/send/?phone=6285280809080&text=Halo+UB+Sport+Center+%F0%9F%92%AA%0A%0ASaya+tertarik+untuk+mendaftar+%2AMembership+Gym%2A.+Mohon+informasi+mengenai+paket+yang+tersedia%2C+prosedur+pendaftaran%2C+dan+langkah+aktivasi+membership.%0A%0ATerima+kasih+%F0%9F%98%8A&type=phone_number&app_absent=0"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
                            <div>
                                <p className="text-[clamp(0.875rem,1.04vw,20px)] font-medium text-black">
                                    Jadwal
                                </p>
                                <p className="mt-1 text-[clamp(0.75rem,0.83vw,16px)] leading-relaxed text-gray-500">
                                    UB Sport Center buka setiap hari pukul 06.00 - 21.00 dengan pilihan paket bulanan dan tahunan yang fleksibel serta akses fasilitas lengkap untuk mendukung kebutuhan latihan Anda.
                                </p>
                            </div>
                            <div>
                                <p className="text-[clamp(0.875rem,1.04vw,20px)] font-medium text-black">
                                    Maskulin
                                </p>
                                <p className="mt-1 text-[clamp(0.75rem,0.83vw,16px)] leading-relaxed text-gray-500">
                                    Temukan paket membership terbaik dengan fasilitas modern dan program latihan profesional untuk membantu Anda mencapai target kebugaran secara maksimal dan berkelanjutan.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Embla looping image carousel */}
                <div className="mt-16">
                    <ImageCarousel images={DUMMY_IMAGES} loop />
                </div>

                {/* Jelajahi Program Kami — 3-col grid */}
                <div className="mt-8 grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <h2 className="text-[clamp(1.25rem,2.08vw,40px)] font-medium tracking-tight text-gray-900">
                            Jelajahi Program Kami
                        </h2>
                    </div>
                    <div className="flex items-center gap-1 lg:col-span-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                fill="currentColor"
                                className="h-5 w-5 text-blue-500"
                            />
                        ))}
                    </div>
                    <div className="lg:col-span-4">
                        <p className="text-[clamp(0.75rem,1.04vw,20px)] leading-relaxed font-normal text-gray-600">
                            Jelajahi berbagai program pilihan dan aktivitas
                            menarik yang dirancang khusus untuk anda.
                        </p>
                    </div>
                </div>
            </div>

            {/* Logo Marquee */}
            <div className="px-6 pb-8 sm:px-10 xl:px-24">
                <hr className="mb-8 w-full border-gray-200" />
                <LogoMarquee />
            </div>
        </section>
    );
}
