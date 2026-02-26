import { useState } from "react";
import { Star } from "lucide-react";
import GymTrafficBadge from "@/Components/Landing/GymTrafficBadge";
import MembershipModal from "@/Components/Landing/MembershipModal";
import DaftarButton from "@/Components/Landing/DaftarButton";
import ImageCarousel from "@/Components/Landing/ImageCarousel";
import type { CarouselImage } from "@/Components/Landing/ImageCarousel";
import left from "../../../assets/images/sec2.png";
import right from "../../../assets/images/sec2-1.png";

const DUMMY_IMAGES: CarouselImage[] = [
    {
        id: "1",
        src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
        alt: "Gym training area",
    },
    {
        id: "3",
        src: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
        alt: "Weight training",
    },
    {
        id: "5",
        src: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80",
        alt: "Sports facility",
    },
    {
        id: "6",
        src: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80",
        alt: "Group fitness class",
    },
];

export default function SectionTwo() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <section id="about" className="overflow-x-clip bg-white">
                <div className="mx-auto max-w px-24 py-24">
                    <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-20">
                        <div className="lg:col-span-5">
                            <div className="flex items-center gap-2">
                                <span className="h-3 w-3 flex-shrink-0 bg-red-600" />
                                <span className="text-sm lg:text-xl font-regular tracking-wide text-black">
                                    Gabung Member Sekarang
                                </span>
                            </div>

                            <h2 className="mt-4 text-[2.75rem] font-semibold leading-[1.1] tracking-tight text-black lg:text-6xl">
                                Latihan Kekuatan dan Kebugaran Untukmu
                            </h2>

                            <div className="mt-10 aspect-[6/5] w-full overflow-hidden rounded-2xl bg-gray-200">
                                <img
                                    src={left}
                                    className="h-full w-full object-cover"
                                    alt="Gym"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col lg:col-span-7 lg:pt-2 lg:pl-12">
                            <p className="text-xl font-bdo font-regular lg:text-5xl leading-relaxed text-black">
                                Area gym ini dirancang sebagai ruang latihan
                                yang nyaman dan fungsional untuk mendukung
                                aktivitas kebugaran, latihan kekuatan, dan
                                kardio bagi seluruh pengguna UB Sport Center.
                            </p>

                            <div className="mt-8">
                                <DaftarButton
                                    label="Daftar Sekarang"
                                    onClick={() => setIsModalOpen(true)}
                                />
                            </div>

                            <div className="mt-10">
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            fill="currentColor"
                                            className="h-5 w-5 text-orange-500"
                                        />
                                    ))}
                                </div>
                                <div className="mt-10 flex flex-col gap-1 font-bdo font-medium text-black text-opacity-60">
                                    <p className="text-sm  lg:text-2xl">
                                        Fasilitas gym lengkap
                                    </p>
                                    <p className="text-sm lg:text-2xl">
                                        Aktivitas latihan harian di pusat
                                        olahraga
                                    </p>
                                </div>
                            </div>

                            <div className="mt-14 flex items-end justify-between gap-6">
                                <GymTrafficBadge variant="reversed" />

                                <div className="h-44 w-44 flex-shrink-0 overflow-hidden rounded-tl-3xl rounded-tr-md rounded-br-3xl rounded-bl-md bg-gray-200">
                                    <img
                                        src={right}
                                        className="h-full w-full object-cover"
                                        alt="Athlete"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-0 pl-24">
                    <ImageCarousel images={DUMMY_IMAGES} />

                    <div className="mx-auto max-w-8xl px-24">
                        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                            <h2 className="text-4xl lg:text-5xl font-medium tracking-tight text-gray-900">
                                Jelajahi Program Kami
                            </h2>

                            <p className="text-lg leading-relaxed font-regular text-gray-600">
                                Jelajahi berbagai program pilihan dan aktivitas
                                menarik yang dirancang khusus untuk anda.
                            </p>

                            <p className="text-lg leading-relaxed font-regular text-gray-600">
                                Jangan lewatkan kesempatan untuk bergabung dalam
                                berbagai agenda rutin dan penawaran spesial.
                            </p>
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
