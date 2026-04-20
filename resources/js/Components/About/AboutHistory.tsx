import { useEffect, useState } from "react";
import { useMotionValue, useAnimationFrame } from "framer-motion";
import SectionDivider from "@/Components/Landing/SectionDivider";
import CurvedLoop from "@/Components/Landing/CurvedLoop";
import person from "@/../assets/images/person.avif";
import bg from "@/../assets/images/bg-about.avif";

function useCountUp(target: number, duration: number = 2.3) {
    const motionValue = useMotionValue(0);
    const [value, setValue] = useState(0);
    useEffect(() => {
        const start = performance.now();
        function animate(now: number) {
            const elapsed = (now - start) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            const current = target * progress;
            motionValue.set(current);
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        requestAnimationFrame(animate);
    }, [target, duration, motionValue]);
    useAnimationFrame(() => {
        setValue(motionValue.get());
    });
    return value;
}

const STATS = [
    { value: 81.5, suffix: "%", label: "Tingkat Kepuasan" },
    { value: 122, suffix: "+", label: "Karyawan" },
    { value: 17, suffix: "+", label: "Fasilitas" },
    { value: 231, suffix: "", label: "Membership" },
];

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
    const animated = useCountUp(value, 1.4);
    let display: string;
    if (suffix === "%") {
        display = `${animated.toFixed(1)}%`;
    } else if (suffix === "+") {
        if (value >= 1000) display = `${Math.round(animated / 1000)}K+`;
        else display = `${Math.round(animated)}+`;
    } else {
        display = `${Math.round(animated)}`;
    }

    return (
        <div className="flex flex-col gap-1">
            <span className="font-bdo font-medium text-[clamp(2rem,4vw,3rem)] text-black leading-none">
                {display}
            </span>
            <span className="font-bdo font-light text-sm text-gray-500 uppercase tracking-widest">
                {label}
            </span>
        </div>
    );
}

export default function AboutHistory() {
    return (
        <section className="w-full bg-white" id="about-history">
            <div className="mx-auto max-w-8xl px-8 pt-16 pb-0">
                <SectionDivider
                    number="02"
                    title="Sejarah Kami"
                    subtitle="aboutpage /01"
                    theme="light"
                />

                <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-3 xl:gap-12">
                    <h2 className="font-bdo font-medium text-[clamp(2rem,3.5vw,3.25rem)] text-black leading-tight">
                        Sejarah dan Perkembangan
                    </h2>
                    <p className="font-bdo font-light text-base xl:text-lg leading-relaxed text-gray-600 xl:pt-2">
                        UB Sport Center merupakan pusat olahraga milik Universitas
                        Brawijaya yang dikelola oleh PT Brawijaya Multi Usaha,
                        dengan tujuan menyediakan fasilitas olahraga yang
                        representatif bagi sivitas akademika dan masyarakat umum.
                    </p>
                    <p className="font-bdo font-light text-base xl:text-lg leading-relaxed text-gray-600 xl:pt-2">
                        Berdiri sejak tahun 2008 sebagai Fitness Centre di
                        lingkungan Universitas Brawijaya, UB Sport Center
                        berkembang menjadi pusat olahraga terpadu berbasis
                        pendidikan dengan layanan dan fasilitas yang terkelola
                        secara profesional.
                    </p>
                </div>

                <div className="mt-16 grid grid-cols-2 gap-10 md:grid-cols-4 border-t border-l border-r border-gray-200 pt-8 pb-24 pl-12">
                    {STATS.map((stat) => (
                        <StatItem key={stat.label} {...stat} />
                    ))}
                </div>
            </div>

            <div className="relative bg-[#0B1E3B] py-32 overflow-hidden"
            style={{ background: `url(${bg}) repeat` }}>
                <CurvedLoop
                    marqueeText="UB * SPORT CENTER * "
                    speed={1.5}
                    curveAmount={80}
                    direction="left"
                    interactive
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
