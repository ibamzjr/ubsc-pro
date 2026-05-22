import SectionDivider from "@/Components/Landing/SectionDivider";
import ReservasiButton from "@/Components/Landing/ReservasiButton";
import pricingLeft from "@/../assets/images/PricingLeft.avif";

const STATS_DATA = [
    { label: "Jadwal Latihan", value: "Fleksibel 06.00 - 21.00" },
    { label: "Paket Membership", value: "Mulai dari 150K / Bulan" },
    { label: "Cabang Tersedia", value: "2 Lokasi Aktif" },
];

export default function PricingSectionTwo() {
    return (
        <section className="bg-white overflow-x-clip" id="pricing-info">
            <div className="mx-auto max-w px-6 py-16 sm:px-10 lg:px-16 xl:px-24">
                <SectionDivider
                    number="01"
                    title="Paket Kami"
                    subtitle="05 pricing page"
                    theme="light"
                />
            </div>

            <div className="mx-auto max-w px-6 sm:px-10 lg:px-16 xl:px-24 ">
                {/* ── MOBILE LAYOUT (xl:hidden) ───────────────────────────────── */}
                <div className="xl:hidden flex flex-col gap-6">
                    {/* 1. Label */}
                    <div className="flex items-center gap-3">
                        <div className="size-[14px] mt-0.5 rounded-[5px] bg-[#FF0000] flex-shrink-0" />
                        <span className="font-bdo font-medium text-[clamp(1rem,1.04vw,1.25rem)] text-black">
                            Program Membership
                        </span>
                    </div>

                    {/* 2. Heading  */}
                    <h2 className="indent-[2rem] sm:indent-[4rem] lg:indent-[8rem] xl:indent-[8rem]  font-bdo font-medium text-[clamp(1.7rem,2.7vw,3.5rem)] leading-[1.05] tracking-[-0.03em] text-black">
                        Nikmati semua fasilitas olahraga yang pasti modern untuk
                        mendukung kebugaran, performa, dan gaya hidup. Nikmati
                        semua fasilitas olahraga yang modern untuk mendukung.
                    </h2>

                    {/* 3. Image */}
                    <div className="w-full max-w-[350px] aspect-[410/550] overflow-hidden rounded-2xl bg-gray-100 mx-auto my-6">
                        <img
                            src={pricingLeft}
                            alt="Program Membership"
                            className="h-full w-full object-cover object-top"
                        />
                    </div>

                    {/* 4. CTA Button */}
                    <ReservasiButton label="Daftar Sekarang" href="#" />

                    {/* 5. Stats table */}
                    <div className="flex flex-col mt-2">
                        <span className="font-bdo font-medium text-black/40 text-[clamp(0.75rem,0.8vw,0.875rem)] mb-2">
                            (=Results)
                        </span>
                        {STATS_DATA.map((stat, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between py-3 border-b border-gray-200/80 last:border-b-0"
                            >
                                <span className="font-bdo font-medium text-black text-[clamp(0.875rem,1vw,18px)]">
                                    {stat.label}
                                </span>
                                <span className="font-bdo font-medium text-gray-500 text-[clamp(0.875rem,1vw,18px)] text-right pl-4">
                                    {stat.value}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* 6. Footer paragraph */}
                    <p className="font-bdo font-normal text-[clamp(0.75rem,0.8vw,0.875rem)] text-gray-500 leading-relaxed">
                        UB Sport Center hadir untuk mendukung gaya hidup aktif
                        Anda dengan fasilitas olahraga modern, instruktur
                        profesional, dan program membership yang dirancang untuk
                        semua kalangan di Kota Malang.
                    </p>
                </div>

                {/* ── DESKTOP LAYOUT (hidden xl:grid) ─────────────────────────── */}
                {/* MAIN CONTAINER: items-stretch locks left & right column heights */}
                <div className="hidden xl:grid xl:grid-cols-12 xl:gap-x-12 xl:items-stretch">
                    {/* --- LEFT COLUMN (cols 1–3) --- */}
                    <div className="xl:col-span-3 flex flex-col justify-between items-start gap-12">
                        {/* 1. Label */}
                        <div className="flex items-center gap-3">
                            <div className="size-[17px] mt-0.5 rounded-[5px] bg-[#FF0000] flex-shrink-0" />
                            <span className="font-bdo font-medium text-[clamp(1rem,1.04vw,1.25rem)] text-black">
                                Program Membership
                            </span>
                        </div>

                        {/* Image — pushed to absolute bottom via mt-auto */}
                        <div className="mt-auto w-[350px] aspect-[410/550] overflow-hidden rounded-2xl bg-gray-100 flex-shrink-0">
                            <img
                                src={pricingLeft}
                                alt="Program Membership"
                                className="h-full w-full object-cover object-top"
                            />
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN (cols 5–12, col 4 left empty as gutter) --- */}
                    <div className="xl:col-span-8 xl:col-start-5 flex flex-col items-start gap-10 xl:gap-14">
                        {/* Heading */}
                        <h2 className="font-bdo font-medium text-[clamp(1.75rem,2.7vw,3.5rem)] leading-[1.05] tracking-[-0.03em] text-black">
                            Nikmati semua fasilitas olahraga yang pasti modern
                            untuk mendukung kebugaran, performa, dan gaya hidup.
                            Nikmati semua fasilitas olahraga yang modern untuk
                            mendukung.
                        </h2>

                        {/* Stats table + muted paragraph */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 w-full">
                            <div className="md:col-span-3 pt-4">
                                <span className="font-bdo font-medium text-black/40 text-[clamp(0.75rem,0.8vw,0.875rem)]">
                                    (=Results)
                                </span>
                            </div>
                            <div className="md:col-span-9 flex flex-col">
                                {STATS_DATA.map((stat, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between py-3 border-b border-gray-200/80 last:border-b-0"
                                    >
                                        <span className="font-bdo font-medium text-black text-[clamp(0.875rem,1vw,18px)]">
                                            {stat.label}
                                        </span>
                                        <span className="font-bdo font-medium text-gray-500 text-[clamp(0.875rem,1vw,18px)] text-right pl-4">
                                            {stat.value}
                                        </span>
                                    </div>
                                ))}
                                {/* Muted paragraph aligned with table rows */}
                                <p className="mt-8 font-bdo font-normal text-[clamp(0.75rem,0.8vw,0.875rem)] text-gray-500 leading-relaxed max-w-[95%]">
                                    UB Sport Center hadir untuk mendukung gaya
                                    hidup aktif Anda dengan fasilitas olahraga
                                    modern, instruktur profesional, dan program
                                    membership yang dirancang untuk semua
                                    kalangan di Kota Malang.
                                </p>
                            </div>
                        </div>

                        {/* Button — pushed to absolute bottom via mt-auto */}
                        <div className="w-full self-start mt-auto pb-1">
                            <ReservasiButton label="Daftar Sekarang" href="#" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
