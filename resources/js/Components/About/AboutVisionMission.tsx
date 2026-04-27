import SectionDivider from "@/Components/Landing/SectionDivider";
import AccordionItem from "@/Components/About/AccordionItem";

interface VisionItem {
    id: number;
    number: string;
    title: string;
    badgeText: string;
    bigNumber: string;
    bigNumberLabel: string;
    innerHeading: string;
    redLabel: string;
    description: string;
    image: string;
    initialIsOpen?: boolean;
}

const DUMMY_VISIONS: VisionItem[] = [
    {
        id: 1,
        number: "01",
        title: "Profil Kami dan Arah Pengembangan",
        badgeText: "Eksistensi",
        bigNumber: "01",
        bigNumberLabel: "Progresif",
        innerHeading:
            "Tempat Di Mana Dedikasi Bertemu Dengan Fasilitas Berkualitas dan Terbaik",
        redLabel: "Prioritas Kami",
        description:
            "UB Sport Center merupakan pusat olahraga milik Universitas Brawijaya yang dikelola oleh PT Brawijaya Multi Usaha, kami selalu berfokus pada peningkatan layanan, kualitas fasilitas, dan kenyamanan pengguna. Pengembangan diarahkan secara terstruktur, adaptif, dan berkelanjutan.",
        image: "/assets/images/gym-konten-1-olahraga-ub-sport-center.avif",
        initialIsOpen: true,
    },
    {
        id: 2,
        number: "02",
        title: "Visi Menuju Masa Depan",
        badgeText: "Visi Kami",
        bigNumber: "02",
        bigNumberLabel: "Berkelanjutan",
        innerHeading:
            "Komitmen Kami dalam Mendukung Aktivitas Olahraga Berkualitas",
        redLabel: "Komitmen Layanan",
        description:
            "UB Sport Center berkomitmen untuk menghadirkan lingkungan olahraga yang profesional dan nyaman melalui pengelolaan fasilitas yang optimal, pelayanan yang responsif, serta dukungan sistem yang memudahkan pengguna dalam mengakses informasi dan layanan olahraga.",
        image: "/assets/images/ub-sport-center-kantor-pusat-malang.avif",
    },
    {
        id: 3,
        number: "03",
        title: "Misi Untuk Kemajuan",
        badgeText: "Misi Kami",
        bigNumber: "03",
        bigNumberLabel: "Berkelanjutan",
        innerHeading:
            "Komitmen Kami dalam Mendukung Aktivitas Olahraga Berkualitas",
        redLabel: "Komitmen Layanan",
        description:
            "UB Sport Center berkomitmen untuk menghadirkan lingkungan olahraga yang profesional dan nyaman melalui pengelolaan fasilitas yang optimal, pelayanan yang responsif, serta dukungan sistem yang memudahkan pengguna dalam mengakses informasi dan layanan olahraga.",
        image: "/assets/images/fasilitas-arena-terbuka-dieng-ub-sport-center-malang.avif",
    },
];

export default function AboutVisionMission() {
    return (
        <section className="w-full bg-[#F5F7F9]" id="about-vision">
            <div className="mx-auto max-w px-6 py-8 sm:px-10 sm:py-12 lg:px-16 lg:pt-16 xl:px-24 xl:pt-24">
                <SectionDivider
                    number="05"
                    title="Visi & Misi"
                    subtitle="aboutpage /04"
                    theme="light"
                />

                <div className="mb-16 grid grid-cols-1 gap-8 xl:grid-cols-12">
                    <div className="xl:col-span-4">
                        <div className="flex items-center gap-2">
                            <div className="h-[17px] w-[17px] flex-shrink-0 rounded bg-accent-red" />
                            <span className="font-bdo font-medium text-[clamp(1rem,1.25vw,24px)] text-black">
                                Visi &amp; Misi
                            </span>
                        </div>
                    </div>

                    <div className="xl:col-span-8">
                        <h2 className="font-bdo font-medium text-[clamp(2rem,2.7vw,52px)] leading-[1.1] tracking-[-0.021em] text-black">
                            Menetapkan Arah dan Tujuan Perjalanan Perusahaan
                        </h2>
                    </div>
                </div>

                <div className="flex flex-col border-t border-black/10">
                    {DUMMY_VISIONS.map((item) => (
                        <AccordionItem
                            key={item.id}
                            number={item.number}
                            title={item.title}
                            badgeText={item.badgeText}
                            bigNumber={item.bigNumber}
                            bigNumberLabel={item.bigNumberLabel}
                            innerHeading={item.innerHeading}
                            redLabel={item.redLabel}
                            description={item.description}
                            image={item.image}
                            initialIsOpen={item.initialIsOpen}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
