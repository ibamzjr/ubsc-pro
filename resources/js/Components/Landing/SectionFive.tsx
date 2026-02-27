import { useState } from "react";
import { Link } from "@inertiajs/react";
import SectionDivider from "@/Components/Landing/SectionDivider";
import ReelsSection from "@/Components/Landing/ReelsSection";
import NewsSection from "@/Components/Landing/NewsSection";

const Arrow: React.FC<{ size?: number }> = ({ size = 32 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M12 32H52M52 32L34 14M52 32L34 50"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const STATS = [
    {
        value: "99.9%",
        description:
            "Akurasi standar layanan kami yang selalu terjaga setiap saat.",
    },
    {
        value: "1M+",
        description: "Kunjungan pengguna yang telah berlatih bersama kami.",
    },
    {
        value: "3X",
        description: "Peningkatan fasilitas dan layanan jadi lebih optimal",
    },
    {
        value: "24/7",
        description:
            "Akses informasi dan sistem booking online aktif setiap saat.",
    },
];

export default function SectionFive() {
    const [hovered, setHovered] = useState(false);
    return (
        <section
            id="impact"
            className="w-full py-24 text-white"
            style={{
                background:
                    "linear-gradient(180deg, #000000 0%, #09172B 50%, #173859 100%)",
            }}
        >
            <div className="mx-auto max-w px-6 sm:px-10 lg:px-24">
                <SectionDivider
                    number="03"
                    title="Dampak"
                    subtitle="01/ homepage"
                    theme="dark"
                />

                <div className="lg:mt-4 grid grid-cols-1 gap-12 lg:grid-cols-12">
                    <div className="col-span-1 lg:col-span-8">
                        <h2 className="text-3xl font-clash font-medium leading-[1.1] tracking-tight lg:text-7xl">
                            Standar baru berolahraga
                            <br />
                            hanya di{" "}
                            <span className="text-red-600">
                                UB Sport Center.
                            </span>
                        </h2>
                    </div>

                    <div className="col-span-1 flex flex-col justify-end lg:col-span-4">
                        <p className="mb-8 text-lg leading-relaxed text-gray-300">
                            Komitmen kami adalah menghadirkan{" "}
                            <strong className="text-white font-semibold">
                                ekosistem olahraga yang inklusif.
                            </strong>
                        </p>

                        <Link
                            href="#"
                            className="relative w-full cursor-pointer select-none overflow-hidden border-b border-white/35 py-1"
                            onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}
                        >
                            <span
                                aria-hidden
                                className="pointer-events-none absolute bg-accent-red"
                                style={{
                                    top: "-50%",
                                    left: "-5%",
                                    right: "-5%",
                                    bottom: "-50%",
                                    transform: hovered
                                        ? "skewY(-5deg) translateY(0%)"
                                        : "skewY(-5deg) translateY(130%)",
                                    transition:
                                        "transform 0.55s cubic-bezier(0.76, 0, 0.24, 1)",
                                    zIndex: 0,
                                }}
                            />

                            <span className="pointer-events-none relative z-10 flex w-full items-center justify-between py-2">
                                <span className="text-lg font-medium text-white">
                                    Mulai Reservasi Sekarang
                                </span>
                                <span
                                    className="flex flex-shrink-0 items-center justify-center"
                                    style={{
                                        width: 32,
                                        height: 32,
                                        transform: hovered
                                            ? "rotate(0deg)"
                                            : "rotate(-45deg)",
                                        transition:
                                            "transform 0.55s cubic-bezier(0.76, 0, 0.24, 1)",
                                    }}
                                >
                                    <Arrow size={24} />
                                </span>
                            </span>
                        </Link>
                    </div>
                </div>

                <div className="mt-32 grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                    {STATS.map((stat) => (
                        <div key={stat.value} className="flex flex-col">
                            <span className="mb-6 text-6xl font-regular tracking-tighter lg:text-8xl">
                                {stat.value}
                            </span>
                            <p className="max-w-[250px] font-light text-sm leading-relaxed text-gray-400">
                                {stat.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-24 border-t border-white/10" />
            </div>

            <ReelsSection />
            <NewsSection />
        </section>
    );
}
