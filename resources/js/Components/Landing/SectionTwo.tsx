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
            <div className="mx-auto px-6 py-8 sm:px-10 sm:py-12 xl:px-20 xl:pb-24">
                <SectionDivider
                    number="01"
                    title="Gym Kami"
                    subtitle="01 homepage"
                    theme="light"
                />

                <div className="mt-16 grid grid-cols-1 items-stretch gap-12 lg:grid-cols-12 xl:gap-0">
                    {/* LEFT COLUMN: Menjaga proporsi gambar dan badge */}
                    <div className="flex flex-col lg:col-span-4 xl:col-span-3">
                        <div className="flex flex-col space-y-0 lg:space-y-5 xl:space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="h-3 w-3 flex-shrink-0 bg-[#FF0000] rounded-sm" />
                                <span className="text-[clamp(1.25rem,1.15rem,1.5rem)] font-medium tracking-wide text-gray-900">
                                    Gabung Member Sekarang
                                </span>
                            </div>

                            {/* GAP LEBAR antara badge dan gambar (mt-8) */}
                            <div className="self-start mt-6">
                                <GymTrafficBadge />
                            </div>
                        </div>

                        {/* Spacer untuk mendorong gambar ke paling bawah agar sejajar dengan teks kanan */}
                        <div className="flex-grow" />

                        {/* Gambar dengan aspect ratio asli sesuai permintaan (443/342) */}
                        <div className="mt-12 w-full overflow-hidden rounded-[20px] aspect-[443/342]">
                            <img
                                src="/assets/images/gym-konten-1-olahraga-ub-sport-center.webp"
                                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                                alt="Gym"
                                loading="lazy"
                            />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Tipografi High-End & Spacing Presisi */}
                    <div className="flex flex-col lg:col-span-8 xl:col-span-8 xl:col-start-5">
                        {/* JUDUL: Menggunakan indent untuk spasi awal & text-justify untuk alur natural */}
                        <h2 className="text-[clamp(1.75rem,2.8vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.03em] text-black  indent-[2rem] sm:indent-[4rem] lg:indent-[8rem] xl:indent-[8rem]">
                            Area gym ini dirancang sebagai ruang latihan yang
                            nyaman dan fungsional untuk mendukung, latihan
                            kekuatan, dan kardio bagi seluruh pengguna UB Sport
                            Center.®
                        </h2>

                        {/* GAP LEBAR antara judul dan button (mt-14) */}
                        <div className="self-start mt-14">
                            <ReservasiButton
                                label="Daftar Sekarang"
                                href="..."
                            />
                        </div>

                        {/* GAP LEBAR ke konten bawah (mt-16) */}
                        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
                            <div className="flex flex-col gap-3">
                                <p className="text-[clamp(1.25rem,1.15rem+0.5vw,1.5rem)] font-semibold tracking-tight text-black">
                                    {" "}
                                    Jadwal
                                </p>
                                <p className="text-[clamp(1rem,0.875rem+0.257vw,1.25rem)] leading-[1.618] text-gray-500 text-justify">
                                    {" "}
                                    UB Sport Center buka setiap hari pukul 06.00
                                    - 21.00 dengan pilihan paket bulanan dan
                                    tahunan yang fleksibel serta akses fasilitas
                                    lengkap untuk mendukung kebutuhan latihan
                                    Anda.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <p className="text-[clamp(1.25rem,1.15rem+0.5vw,1.5rem)] font-semibold tracking-tight text-black">
                                    {" "}
                                    Maskulin
                                </p>
                                <p className="text-[clamp(1rem,0.875rem+0.257vw,1.25rem)] leading-[1.618] text-gray-500 text-justify">
                                    {" "}
                                    Temukan paket membership terbaik dengan
                                    fasilitas modern dan program latihan
                                    profesional untuk membantu Anda mencapai
                                    target kebugaran secara maksimal dan
                                    berkelanjutan.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Embla looping image carousel */}
                <div className="mt-24">
                    <ImageCarousel images={DUMMY_IMAGES} loop />
                </div>

                {/* Jelajahi Program Kami */}
                <div className="mt-12 grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <h2 className="text-[clamp(1.5rem,2.5vw,40px)] font-medium tracking-tight text-gray-900">
                            Jelajahi Program Kami
                        </h2>
                    </div>
                    <div className="flex items-center gap-1 lg:col-span-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                fill="currentColor"
                                className="h-5 w-5 text-blue-600"
                            />
                        ))}
                    </div>
                    <div className="lg:col-span-4">
                        <p className="text-[16px] leading-relaxed text-gray-500">
                            Jelajahi berbagai program pilihan dan aktivitas
                            menarik yang dirancang khusus untuk anda.
                        </p>
                    </div>
                </div>
            </div>

            {/* Logo Marquee */}
            <div className="px-6 pb-12 sm:px-10 xl:px-24">
                <hr className="mb-10 w-full border-gray-200" />
                <LogoMarquee />
            </div>
        </section>
    );
}
