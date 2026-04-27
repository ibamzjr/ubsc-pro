import SectionDivider from "@/Components/Landing/SectionDivider";
import ReservasiButton from "@/Components/Landing/ReservasiButton";
import LogoMarquee from "@/Components/Landing/LogoMarquee";

export default function FacilityMembership() {

    return (
        <section className="bg-white overflow-x-clip" id="facility-membership">
            <div className="mx-auto max-w px-6 pt-8 sm:px-10 sm:pt-12 lg:px-16 xl:px-24 xl:pt-10">
            <SectionDivider
                number="01"
                title="Lokasi Kami"
                subtitle="/01 homepage"
                theme="light"
            />
            </div>
            <div className="x-auto max-w px-6 pb-16 sm:px-10 xl:px-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16">
                    <div className="lg:col-span-4 flex flex-col gap-8">
                        <div className="flex items-center gap-3">
                            <div className="size-[17px] rounded-[5px] bg-accent-red flex-shrink-0" />
                            <span className="font-bdo font-normal text-[1.5rem] text-black">
                                Program Membership
                            </span>
                        </div>
                        <div className="w-full aspect-[2/1] overflow-hidden rounded-xl">
                            <img
                                src="/assets/images/gym-konten-2-olahraga-ub-sport-center.avif"
                                alt="UB Sport Center membership"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-8 flex flex-col">
                        <h2
                            className="font-bdo font-medium text-[clamp(2rem,3.5vw,3rem)] text-black leading-[1.15]"
                            style={{ letterSpacing: "-2.1px" }}
                        >
                            Bergabunglah dengan komunitas olahraga terbaik dan
                            capai target Anda.{" "}
                            <span style={{ color: "#ABABAB" }}>
                                Kami sedia program terstruktur 
                                berpengalaman, 
                            </span>{" "}
                            — semua satu tempat.
                        </h2>

                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 mt-12">
                            <p className="font-bdo font-normal text-sm text-black/60 max-w-md leading-relaxed">
                                Daftarkan diri Anda sekarang dan rasakan
                                pengalaman berolahraga yang sesungguhnya. Pilih
                                paket membership yang sesuai dengan kebutuhan
                                dan jadwal Anda di UB Sport Center.
                            </p>
                            <ReservasiButton label="Daftar Sekarang" href="#" />
                        </div>
                    </div>
                </div>

                <hr className="border-gray-200 w-full my-16" />

                <LogoMarquee />
            </div>
        </section>
    );
}
