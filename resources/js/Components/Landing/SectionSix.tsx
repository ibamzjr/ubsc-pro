import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import SectionDivider from "@/Components/Landing/SectionDivider";
import ReservasiButton from "@/Components/Landing/ReservasiButton";
import PriceCard from "@/Components/Landing/PriceCard";
import type { PriceItem } from "@/Components/Landing/PriceCard";

const PAGE_SIZE = 4;

const DUMMY_PRICES: PriceItem[] = [
    {
        id: 1,
        title: "Lapangan Tennis",
        price: "105.000 - 115.000 / Jam",
        rating: 5,
        image: "/assets/images/fasilitas-tenis-ub-sport-center.avif",
        href: "https://ayo.co.id/v/ub-sport-center",
    },
    {
        id: 2,
        title: "Lapangan Badminton",
        price: "50.000 - 65.000 / Jam",
        rating: 5,
        image: "/assets/images/fasilitas-bulutangkis-ub-sport-center.avif",
        href: "https://ayo.co.id/v/ub-sport-center",
    },
    {
        id: 3,
        title: "Lapangan Tenis Meja",
        price: "50.000 - 55.000 / Jam",
        rating: 4.5,
        image: "/assets/images/fasilitas-tennis-meja-ub-sport-center.avif",
        href: "https://api.whatsapp.com/send?phone=6285280809080&text=Halo+UB+Sport+Center+%F0%9F%91%8B%0A%0ASaya+ingin+melakukan+reservasi+ruang+tenis+meja.%0AMohon+informasi+terkait+ketersediaan+jadwal%2C+durasi+pemakaian%2C+serta+biaya+sewa+yang+berlaku.%0A%0ABerikut+detail+rencana+pemesanan+saya%3A%0ANama%3A%0ATanggal%3A%0AJam%3A%0ADurasi%3A%0A%0ATerima+kasih+atas+bantuannya+%F0%9F%99%8F",
    },
    {
        id: 4,
        title: "Lapangan Futsal",
        price: "45.000 - 50.000 / Jam",
        rating: 4.5,
        image: "/assets/images/fasilitas-futsal-ub-sport-center.avif",
        href: "https://api.whatsapp.com/send?phone=6285280809080&text=Halo+UB+Sport+Center+%F0%9F%91%8B%0A%0ASaya+ingin+melakukan+reservasi+lapangan+futsal.%0AMohon+informasi+mengenai+ketersediaan+jadwal%2C+durasi+sewa%2C+serta+tarif+yang+berlaku.%0A%0ABerikut+detail+rencana+pemesanan+saya%3A%0ANama%3A%0ATanggal%3A%0AJam%3A%0ADurasi%3A%0A%0ATerima+kasih+atas+bantuannya+%F0%9F%99%8F",
    },
    {
        id: 5,
        title: "Ruang Beladiri",
        price: "75.000 - 100.000 / Jam",
        rating: 5,
        image: "/assets/images/fasilitas-beladiri-ub-sport-center.avif",
        href: "https://api.whatsapp.com/send/?phone=6285280809080&text=Halo+UB+Sport+Center+%F0%9F%A5%8B%0A%0ASaya+tertarik+untuk+mengikuti+kelas+BMU+Karate.+Mohon+informasi+lebih+lanjut+mengenai+jadwal%2C+durasi%2C+dan+prosedur+pendaftaran+kelas+ini.%0A%0ATerima+kasih+%F0%9F%98%8A&type=phone_number&app_absent=0",
    },
    {
        id: 6,
        title: "Yoga",
        price: "25.000 - 35.000 / Jam",
        rating: 5,
        image: "/assets/images/fasilitas-yoga-ub-sport-center.avif",
        href: "https://api.whatsapp.com/send?phone=6285280809080&text=Halo+UB+Sport+Center+%F0%9F%91%8B%0A%0ASaya+ingin+mendapatkan+informasi+terkait+layanan+Yoga.%0AMohon+dibantu+untuk+pilihan+berikut%3A%0A%0AJenis+Permintaan%3A%0A%5B+%5D+Ikut+Kelas+Yoga%0A%5B+%5D+Reservasi+Ruang+Yoga%0A%0ABerikut+detail+yang+ingin+saya+ajukan%3A%0ANama%3A%0ATanggal%3A%0AJam%3A%0ADurasi+(jika+reservasi+ruang)%3A%0A%0AMohon+informasi+mengenai+jadwal+yang+tersedia%2C+biaya%2C+serta+ketentuan+yang+berlaku.%0A%0ATerima+kasih+atas+bantuannya+%F0%9F%99%8F",
    },
    {
        id: 7,
        title: "Aerobik",
        price: "23.000 - 28.000 / Jam",
        rating: 4.5,
        image: "/assets/images/fasilitas-aerobik-ub-sport-center.avif",
        href: "https://api.whatsapp.com/send?phone=6285280809080&text=Halo+UB+Sport+Center+%F0%9F%91%8B%0A%0ASaya+ingin+mendapatkan+informasi+terkait+layanan+Aerobik.%0AMohon+bantuan+untuk+pilihan+berikut%3A%0A%0AJenis+Permintaan%3A%0A%E2%80%A2+Ikut+Kelas+Aerobik%0A%E2%80%A2+Reservasi+Ruang+Aerobik%0A%0ABerikut+detail+pengajuan+saya%3A%0ANama%3A%0ATanggal%3A%0AJam%3A%0ADurasi+(khusus+reservasi+ruang)%3A%0A%0AMohon+informasi+mengenai+jadwal+yang+tersedia%2C+biaya%2C+serta+ketentuan+yang+berlaku.%0A%0ATerima+kasih+atas+bantuannya+%F0%9F%99%8F",
    },
    {
        id: 8,
        title: "Zumba",
        price: "28.000 - 33.000 / Jam",
        rating: 4.5,
        image: "/assets/images/fasilitas-zumba-ub-sport-center.avif",
    },
    {
        id: 9,
        title: "BMU Karate",
        price: "100.000 - 175.000 / Jam",
        rating: 5,
        image: "/assets/images/fasilitas-beladiri-ub-sport-center.avif",
        href: "https://api.whatsapp.com/send/?phone=6285280809080&text=Halo+UB+Sport+Center+%F0%9F%A5%8B%0A%0ASaya+tertarik+untuk+mengikuti+kelas+BMU+Karate.+Mohon+informasi+lebih+lanjut+mengenai+jadwal%2C+durasi%2C+dan+prosedur+pendaftaran+kelas+ini.%0A%0ATerima+kasih+%F0%9F%98%8A&type=phone_number&app_absent=0",
    },
    {
        id: 10,
        title: "Zona Akurasi",
        price: "Klik Disini",
        rating: 5,
        image: "/assets/images/fasilitas-zona-akurasi-ub-sport-center.avif",
        href: "https://api.whatsapp.com/send?phone=6285280809080&text=Halo+UB+Sport+Center+%F0%9F%91%8B%0A%0ASaya+ingin+melakukan+reservasi+lapangan+basket.%0AMohon+informasi+mengenai+ketersediaan+jadwal%2C+durasi+pemakaian%2C+serta+tarif+sewa+yang+berlaku.%0A%0ABerikut+detail+rencana+pemesanan+saya%3A%0ANama%3A%0ATanggal%3A%0AJam%3A%0ADurasi%3A%0A%0AMohon+konfirmasi+ketersediaannya.%0A%0ATerima+kasih+atas+bantuannya+%F0%9F%99%8F",
    },
    {
        id: 11,
        title: "Pilates",
        price: "Coming Soon",
        rating: 4.5,
        image: "/assets/images/comingsoon.avif",
    },
];

function FeatureItem({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#2D7D9A] text-white">
                <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M6 1V11M1 6H11"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            </div>
            <span className="text-[clamp(0.75rem,0.83vw,16px)] font-semibold text-gray-800">{label}</span>
        </div>
    );
}

interface SectionSixProps {
    prices?: PriceItem[];
}

export default function SectionSix({ prices = DUMMY_PRICES }: SectionSixProps) {
    const totalPages = Math.ceil(prices.length / PAGE_SIZE);
    const [page, setPage] = useState(0); // 0-indexed
    const visiblePrices = prices.slice(
        page * PAGE_SIZE,
        page * PAGE_SIZE + PAGE_SIZE,
    );

    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "start",
        dragFree: true,
    });

    const scrollPrev = useCallback(() => {
        // desktop
        setPage((p) => Math.max(0, p - 1));
        // mobile
        emblaApi && emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        // desktop
        setPage((p) => Math.min(totalPages - 1, p + 1));
        // mobile
        emblaApi && emblaApi.scrollNext();
    }, [emblaApi, totalPages]);

    const prevDisabled = page === 0;
    const nextDisabled = page >= totalPages - 1;

    return (
        <section id="pricing" className="w-full bg-white  pt-12 xl:pb-12">
            <div className="mx-auto w-full px-6 sm:px-10 xl:px-24">
                <SectionDivider
                    number="04"
                    title="Daftar harga"
                    subtitle="01/ homepage"
                    theme="light"
                />

                <div className="mt-16 grid grid-cols-1 gap-12 xl:grid-cols-12 xl:gap-8">
                    <div className="col-span-1 flex flex-col xl:col-span-5">
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 flex-shrink-0 bg-red-600" />
                            <span className="text-[clamp(0.75rem,0.83vw,16px)] font-semibold text-gray-800">
                                Tarif Lapangan
                            </span>
                        </div>

                        <h2 className="mb-4 mt-6 max-w-sm text-[clamp(1.5rem,2.7vw,52px)] font-bold leading-[1.1] tracking-[-0.021em] text-gray-900">
                            Raih Performa Terbaik Dengan Paket Fasilitas
                            Unggulan
                        </h2>

                        <p className="mb-8 max-w-sm text-[clamp(0.875rem,0.83vw,16px)] leading-relaxed text-gray-600">
                            Penyewaan arena olahraga standar profesional untuk
                            kebutuhan tim dan komunitas Anda.
                        </p>

                        <div className="mb-6 max-w-sm border-t border-gray-200" />

                        <div className="mb-12 flex flex-col gap-4">
                            <FeatureItem label="Cabang Olahraga Lengkap" />
                            <FeatureItem label="Fasilitas Standar Atlet" />
                        </div>

                        <div className="mt-auto flex items-center justify-between">
                            <ReservasiButton label="Mulai Reservasi" />

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={scrollPrev}
                                    disabled={prevDisabled}
                                    aria-label="Previous"
                                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-black text-black transition-colors duration-200 hover:bg-gray-100 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-300"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    type="button"
                                    onClick={scrollNext}
                                    disabled={nextDisabled}
                                    aria-label="Next"
                                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-black text-white transition-colors duration-200 hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 grid grid-cols-1 gap-4 md:grid-cols-2 xl:col-span-7 xl:grid-cols-1">
                        {visiblePrices.map((item) => (
                            <PriceCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
