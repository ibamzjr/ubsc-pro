import SectionDivider from "@/Components/Landing/SectionDivider";
import ReservasiButton from "@/Components/Landing/ReservasiButton";
import { Plus } from "lucide-react";
import fresh from "@/../assets/images/fresh water.avif";

function FeatureItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent-red/10">
                <Plus size={10} className="text-accent-red" strokeWidth={2.5} />
            </div>
            <span className="font-bdo font-medium text-[20px] text-black leading-snug">
                {text}
            </span>
        </div>
    );
}

export default function AboutSectionContact() {
    return (
        <section className="w-full bg-[#F5F7F9]" id="about-contact">
            <div className="mx-auto max-w px-6 py-8 sm:px-10 sm:py-12 lg:px-16 lg:py-16 xl:px-24 xl:py-24">
                <SectionDivider
                    number="07"
                    title="Informasi"
                    subtitle="aboutpage /06"
                    theme="light"
                />

                <div className="grid grid-cols-1 gap-12 xl:grid-cols-12 xl:items-center">
                    <div className="xl:col-span-5 flex flex-col">
                        <div className="mb-6 flex items-center gap-2">
                            <div className="h-[17px] w-[17px] flex-shrink-0 rounded bg-accent-red" />
                            <span className="font-bdo font-normal text-2xl text-black">
                                Pusat Bantuan
                            </span>
                        </div>

                        <h2 className="mb-8 font-bdo font-medium text-[clamp(2rem,4vw,3.25rem)] text-black leading-tight">
                            Hubungi Kami!
                        </h2>

                        <p className="mb-8 font-bdo font-normal text-[20px] leading-relaxed text-black/50">
                            Tim UB Sport Center siap membantu kebutuhan
                            reservasi, informasi layanan, dan konsultasi
                            fasilitas olahraga Anda.
                        </p>

                        <hr className="mb-8 border-black/10" />

                        <div className="mb-10 flex flex-col gap-5">
                            <FeatureItem text="Respon cepat dan profesional" />
                            <FeatureItem text="Layanan reservasi mudah" />
                        </div>

                        <ReservasiButton label="Hubungi Kami" href="#" />
                    </div>

                    <div className="xl:col-span-7">
                        <div className="flex flex-col xl:flex-row overflow-hidden rounded-[15px] min-h-[320px]">
                            <div className="relative h-52 flex-shrink-0 xl:h-auto xl:w-[390px]">
                                <img
                                    src={fresh}
                                    alt="UB Sport Center"
                                    className="absolute inset-0 h-full w-full object-cover"
                                    loading="lazy"
                                />
                            </div>

                            <div className="flex flex-1 flex-col justify-center bg-black p-8 xl:p-10">
                                <p className="font-bdo font-normal text-[32px] text-white leading-tight mb-4">
                                    Hubungi Kami
                                </p>
                                <hr className="border-white/20 mb-8" />

                                <div className="flex flex-col gap-7">
                                    <div>
                                        <p className="font-bdo font-medium text-[16px] text-white/80 mb-2">
                                            Email
                                        </p>
                                        <p className="font-bdo font-normal text-[18px] text-white">
                                            contact@ubsportcenter.co.id
                                        </p>
                                    </div>

                                    <div>
                                        <p className="font-bdo font-medium text-[16px] text-white/80 mb-2">
                                            Pusat Panggilan
                                        </p>
                                        <p className="font-bdo font-normal text-[18px] text-white">
                                            (0341) 579955
                                        </p>
                                        <p className="font-bdo font-normal text-[18px] text-white mt-1.5">
                                            +62 852-8080-9080
                                        </p>
                                    </div>

                                    <div>
                                        <p className="font-bdo font-medium text-[16px] text-white/80 mb-2">
                                            Lokasi Kami
                                        </p>
                                        <p className="font-bdo font-normal text-[18px] text-white leading-relaxed">
                                            Jl. Terusan Cibogo No.1,
                                            Penanggungan,
                                            <br />
                                            Kec. Klojen, Kota Malang, Jawa Timur
                                            65113
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
