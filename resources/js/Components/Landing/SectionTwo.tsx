import GymTrafficBadge from "@/Components/Landing/GymTrafficBadge";
import ReservasiButton from "@/Components/Landing/ReservasiButton";
import LogoMarquee from "@/Components/Landing/LogoMarquee";
import type { SponsorItem } from "@/Components/Landing/LogoMarquee";
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

interface SectionTwoProps {
    promos?: CarouselImage[];
    sponsors?: SponsorItem[];
}

const StarIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        className={className}
        aria-hidden
    >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

export default function SectionTwo({ promos, sponsors }: SectionTwoProps) {
    return (
        <section id="about" className="overflow-x-clip bg-white">
            <div className="mx-auto px-6 py-8 sm:px-10 sm:py-12 xl:px-20 xl:pb-24">
                <SectionDivider
                    number="01"
                    title="Gym Kami"
                    subtitle="01 homepage"
                    theme="light"
                />

                {/*
                 * Mobile: flex-col — JSX order IS the visual order.
                 * Desktop (lg+): explicit 12-col grid with row-start placement.
                 *
                 * Mobile order:
                 *   ① Badge  ② Heading  ③ CTA  ④ Image  ⑤ Text  ⑥ GymBadge
                 */}
                <div className="mt-10 flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:items-stretch lg:gap-x-0 lg:gap-y-0">
                    {/* ① Identity Badge ── col 1-4, row 1 */}
                    <div className="flex items-center gap-3 lg:col-span-4 xl:col-span-3 lg:row-start-1 lg:self-start">
                        <span className="h-3 w-3 flex-shrink-0 rounded-sm bg-[#FF0000]" />
                        <span className="font-bdo font-regular text-base md:text-[clamp(1.25rem,1.15rem,1.5rem)] tracking-wide text-black">
                            Gabung Member Sekarang
                        </span>
                    </div>

                    {/* ② Main Heading ── col 5-12, row 1 */}
                    <h2 className="text-[clamp(1.75rem,2.8vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.03em] text-black indent-[2rem] sm:indent-[4rem] lg:indent-[8rem] xl:indent-[8rem] lg:col-span-8 xl:col-span-8 xl:col-start-5 lg:row-start-1">
                        Area gym ini dirancang sebagai ruang latihan yang nyaman
                        dan fungsional untuk mendukung, latihan kekuatan, dan
                        kardio bagi seluruh pengguna UB Sport Center.®
                    </h2>

                    {/* ③ CTA Button + GymTrafficBadge ── col 5-12, row 2
                         Desktop: button left, badge right (flex-row justify-between)
                         Mobile:  button only here; badge rendered separately at bottom */}
                    <div className="self-start lg:col-span-8 xl:col-span-8 xl:col-start-5 lg:row-start-2 lg:pt-14 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <ReservasiButton label="Daftar Sekarang" href="..." />
                        <div className="hidden lg:block">
                            <GymTrafficBadge />
                        </div>
                    </div>

                    {/* ④ Primary Visual ── col 1-4, rows 2-3 (self-end aligns with text) */}
                    <div className="w-full overflow-hidden rounded-[20px] aspect-[443/342] lg:col-span-4 xl:col-span-3 lg:row-start-2 lg:row-span-2 lg:self-end lg:mt-12">
                        <img
                            src="/assets/images/gym-konten-1-olahraga-ub-sport-center.webp"
                            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                            alt="Gym"
                            loading="lazy"
                        />
                    </div>

                    {/* ⑤ Text Content ── col 5-12, row 3 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 lg:col-span-8 xl:col-span-8 xl:col-start-5 lg:row-start-3 lg:mt-16">
                        <div className="flex flex-col gap-3">
                            <p className="text-[clamp(1.25rem,1.15rem+0.5vw,1.5rem)] font-semibold tracking-tight text-black">
                                {" "}
                                Jadwal
                            </p>
                            <p className="text-[clamp(1rem,0.875rem+0.257vw,1.25rem)] leading-[1.618] text-gray-500 text-left">
                                {" "}
                                UB Sport Center buka setiap hari pukul 06.00 -
                                21.00 dengan pilihan paket bulanan dan tahunan
                                yang fleksibel serta akses fasilitas lengkap
                                untuk mendukung kebutuhan latihan Anda.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p className="text-[clamp(1.25rem,1.15rem+0.5vw,1.5rem)] font-semibold tracking-tight text-black">
                                {" "}
                                Maskulin
                            </p>
                            <p className="text-[clamp(1rem,0.875rem+0.257vw,1.25rem)] leading-[1.618] text-gray-500 text-left">
                                {" "}
                                Temukan paket membership terbaik dengan
                                fasilitas modern dan program latihan profesional
                                untuk membantu Anda mencapai target kebugaran
                                secara maksimal dan berkelanjutan.
                            </p>
                        </div>
                    </div>

                    {/* ⑥ Gym Traffic Badge ── mobile only, appears last in stack */}
                    <div className="lg:hidden">
                        <GymTrafficBadge />
                    </div>
                </div>

                {/* Embla looping image carousel */}
                <div className="mt-16 lg:mt-24">
                    <ImageCarousel images={promos ?? DUMMY_IMAGES} loop />
                </div>

                {/* Jelajahi Program Kami */}
                <div className="mt-12">
                    {/* ── Mobile: "Jelajahi Program" + stars right-aligned, "Kami" wraps below ── */}
                    <div className="lg:hidden flex flex-col gap-4">
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-[clamp(1.5rem,2.5vw,40px)] font-medium tracking-tight text-gray-900">
                                    Jelajahi Program
                                </span>
                                <span className="flex items-center gap-1 flex-shrink-0">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <StarIcon
                                            key={i}
                                            className="h-4 w-4 text-[#15678D] fill-current"
                                        />
                                    ))}
                                </span>
                            </div>
                            <span className="block text-[clamp(1.5rem,2.5vw,40px)] font-medium tracking-tight text-gray-900">
                                Kami
                            </span>
                        </div>
                        <p className="hidden text-[16px] leading-relaxed text-gray-500">
                            Jelajahi berbagai program pilihan dan aktivitas
                            menarik yang dirancang khusus untuk anda.
                        </p>
                    </div>

                    {/* ── Desktop: 3-col grid — heading | stars centered | text ── */}
                    <div className="hidden lg:grid lg:grid-cols-12 lg:items-center lg:gap-6">
                        <div className="lg:col-span-5">
                            <h2 className="text-[clamp(1.5rem,2.5vw,40px)] font-medium tracking-tight text-gray-900">
                                Jelajahi Program Kami
                            </h2>
                        </div>
                        <div className="lg:col-span-3 flex items-center justify-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <StarIcon
                                    key={i}
                                    className="h-5 w-5 text-[#15678D] fill-current"
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
            </div>

            {/* Logo Marquee */}
            <div className="px-6 pb-12 sm:px-10 xl:px-24">
                <LogoMarquee sponsors={sponsors} />
            </div>
        </section>
    );
}
