import SectionDivider from "@/Components/Landing/SectionDivider";
import ReservasiButton from "@/Components/Landing/ReservasiButton";
import asset1 from "@/../assets/images/asset1-pricing.avif"

export default function PricingSectionTwo() {
    return (
        <section className="bg-white overflow-x-clip" id="pricing-info">
            <div className="mx-auto max-w px-6 py-16 sm:px-10 lg:px-16 xl:px-24">
            <SectionDivider
                number="01"
                title="Lokasi Kami"
                subtitle="/01 homepage"
                theme="light"
            />
            </div>

            <div className="mx-auto max-w px-6 sm:px-10 lg:px-16 xl:px-24">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-12">

                    <div className="xl:col-span-4 flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="size-[14px] xl:size-[17px] rounded-[5px] bg-accent-red flex-shrink-0" />
                            <span className="font-bdo font-normal text-[clamp(0.875rem,0.94vw,18px)] text-black">
                                Informasi Jadwal dan Harga
                            </span>
                        </div>
                        <div className="w-2/3 aspect-[4/5] overflow-hidden rounded-2xl">
                            <img
                                src={asset1}
                                alt="UB Sport Center"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="xl:col-span-8 flex flex-col justify-between gap-10">
                        <h2 className="font-bdo font-medium text-[clamp(2rem,2.7vw,52px)] leading-[1.1] tracking-[-0.021em] text-black max-w">
                            Temukan paket membership terbaik dengan fasilitas modern dan program latihan profesional untuk membantu dalam Anda.®
                        </h2>

                        <ReservasiButton label="Mulai Reservasi" href="#" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-b border-gray-200">
                            <div className="sm:border-r border-gray-200 py-8 sm:pr-8">
                                <h3 className="font-bdo font-medium text-[clamp(1.125rem,1.46vw,28px)] text-black mb-3">
                                    Fleksibel
                                </h3>
                                <p className="font-bdo font-normal text-[clamp(0.875rem,0.83vw,16px)] text-black/60 leading-relaxed">
                                    UB Sport Center buka setiap hari pukul 06.00 - 21.00 dengan pilihan paket bulanan dan tahunan yang fleksibel serta akses fasilitas lengkap untuk mendukung kebutuhan latihan Anda.
                                </p>
                            </div>
                            <div className="py-8 sm:pl-8">
                                <h3 className="font-bdo font-medium text-[clamp(1.125rem,1.46vw,28px)] text-black mb-3">
                                    Terjangkau
                                </h3>
                                <p className="font-bdo font-normal text-[clamp(0.875rem,0.83vw,16px)] text-black/60 leading-relaxed">
                                    Temukan paket membership terbaik dengan fasilitas modern dan program latihan profesional untuk membantu Anda mencapai target kebugaran secara maksimal dan berkelanjutan.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
