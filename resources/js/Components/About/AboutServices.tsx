import SectionDivider from "@/Components/Landing/SectionDivider";
import ServiceCard from "@/Components/About/ServiceCard";

interface ServiceItem {
    id: number;
    numberString: string;
    title: string;
    subtitle: string;
    image: string;
}

const DUMMY_SERVICES: ServiceItem[] = [
    {
        id: 1,
        numberString: "001",
        title: "Pusat Layanan Pengguna",
        subtitle: "Layanan ramah dan responsif",
        image: "/assets/images/gym-konten-1-olahraga-ub-sport-center.avif",
    },
    {
        id: 2,
        numberString: "002",
        title: "Fasilitas Peminjaman Olahraga",
        subtitle: "Alat lengkap dan terawat",
        image: "/assets/images/ub-sport-center-kantor-pusat-malang.avif",
    },
    {
        id: 3,
        numberString: "003",
        title: "Bimbingan Pelatih Olahraga",
        subtitle: "Pendamping latihan profesional",
        image: "/assets/images/fasilitas-arena-terbuka-dieng-ub-sport-center-malang.avif",
    },
    {
        id: 4,
        numberString: "004",
        title: "Penyelenggaraan Event Sport",
        subtitle: "Event tertata dan sukses",
        image: "/assets/images/cabang-eksklusif-transmart-ub-sport-center-malang.avif",
    },
];

export default function AboutServices() {
    return (
        <section className="w-full bg-white" id="about-services">
            <div className="mx-auto max-w-8xl px-8 pt-16 pb-32">

                <SectionDivider
                    number="03"
                    title="Sorotan"
                    subtitle="01 aboutpage"
                    theme="light"
                />

                <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
                    <div className="xl:col-span-3">
                        <div className="flex items-center gap-2">
                            <div className="h-[17px] w-[17px] flex-shrink-0 rounded bg-accent-red" />
                            <span className="font-bdo text-xl text-black">
                                Layanan Unggulan
                            </span>
                        </div>
                    </div>

                    <div className="xl:col-span-6">
                        <h2 className="font-bdo font-medium text-[clamp(2rem,3.5vw,3.25rem)] leading-tight text-black xl:text-center">
                            Mendukung Kebutuhan Aktivitas Olahraga Anda
                        </h2>
                    </div>

                    <div className="xl:col-span-3 xl:pt-2">
                        <p className="font-bdo text-lg leading-relaxed text-black/70">
                            Beragam layanan pendukung kami hadir untuk memberikan
                            kenyamanan terbaik bagi pengguna.
                        </p>
                    </div>
                </div>

                <div className="mt-16 grid grid-cols-1 items-start gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {DUMMY_SERVICES.map((service, i) => (
                        <ServiceCard
                            key={service.id}
                            index={i}
                            numberString={service.numberString}
                            title={service.title}
                            subtitle={service.subtitle}
                            image={service.image}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}
