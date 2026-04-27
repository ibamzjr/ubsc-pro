import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SectionDivider from "@/Components/Landing/SectionDivider";
import ReservasiButton from "@/Components/Landing/ReservasiButton";

const LOGOS = [
    { id: 1, name: "SAVANNAH" },
    { id: 2, name: "oslo." },
    { id: 3, name: "Manila." },
    { id: 4, name: "monaco" },
    { id: 5, name: "UBSC Pro" },
];

const duplicatedLogos = [...LOGOS, ...LOGOS];

export default function FacilityMembership() {
    const [marqueeDuration, setMarqueeDuration] = useState(20);

    useEffect(() => {
        const update = () =>
            setMarqueeDuration(window.innerWidth < 768 ? 8 : 20);
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

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

                <div className="flex items-center gap-8 overflow-hidden w-full">
                    <p className="whitespace-nowrap font-bdo font-medium text-sm uppercase text-black flex-shrink-0">
                        /Worked With
                    </p>
                    <div className="overflow-hidden flex-1">
                        <motion.div
                            className="flex gap-4"
                            animate={{ x: ["-50%", "0%"] }}
                            transition={{
                                repeat: Infinity,
                                ease: "linear",
                                duration: marqueeDuration,
                            }}
                        >
                            {duplicatedLogos.map((logo, i) => (
                                <div
                                    key={i}
                                    className="bg-gray-50 flex items-center justify-center w-[200px] h-[100px] rounded-lg flex-shrink-0 pointer-events-none"
                                >
                                    <span className="font-bdo font-medium text-sm text-black/40 uppercase tracking-widest">
                                        {logo.name}
                                    </span>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
