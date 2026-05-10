import SectionDivider from "@/Components/Landing/SectionDivider";
import ReservasiButton from "@/Components/Landing/ReservasiButton";
import LogoMarquee from "@/Components/Landing/LogoMarquee";
import CurvedLoop from "@/Components/Landing/CurvedLoop";
import person from "@/../assets/images/person.avif";
import bg from "@/../assets/images/bg-about.avif";

export default function FacilityMembership() {
    return (
        <section className="bg-white overflow-x-clip" id="facility-membership">
            <div className="mx-auto max-w px-6 pt-8 sm:px-10 sm:pt-12 lg:px-16 xl:px-24 xl:pt-10">
                <SectionDivider
                    number="01"
                    title="Fasilitas Gym"
                    subtitle="04 facility page"
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
                            className="font-bdo font-medium text-[clamp(1.5rem,2.7vw,52px)] text-black leading-[1.15]"
                            style={{ letterSpacing: "-1.7px" }}
                        >
                            Bergabunglah dengan komunitas olahraga terbaik dan
                            capai target Anda.{" "}
                            <span>Kami sedia program terstruktur</span> — semua
                            di satu tempat.
                        </h2>

                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 mt-12">
                            <p className="font-bdo font-normal text-[clamp(1rem,0.9rem+0.44vw,1rem)] tracking-[-0.42px] leading-[1.2] text-[#242424] max-w-md">
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
            <div
                className="relative bg-[#0B1E3B] py-52 mx-16 overflow-hidden xl:mb-12"
                style={{ background: `url(${bg}) repeat` }}
            >
                <CurvedLoop
                    marqueeText="UB   ✦   SPORT  ✦  CENTER   ✦   UBSC   ✦   "
                    speed={1.5}
                    curveAmount={200}
                    direction="left"
                    interactive
                    className="z-100 absolute -top-16 h-full"
                />

                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <img
                        src={person}
                        alt="UB Sport Center athlete"
                        className="h-64 xl:h-80 w-auto object-cover shadow-2xl"
                    />
                </div>
            </div>
        </section>
    );
}
