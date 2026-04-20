import SectionDivider from "@/Components/Landing/SectionDivider";
import ScrollStack, { ScrollStackItem } from "@/Components/Landing/ScrollStack";
import gym from "../../../assets/hero/gym.svg";

const Arrow: React.FC<{ size?: number }> = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <path
            d="M12 32H52M52 32L34 14M52 32L34 50"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

interface Branch {
    id: number;
    name: string;
    category: string;
    image: string;
}

const BRANCHES: Branch[] = [
    {
        id: 1,
        name: "UB Sport Center Veteran",
        category: "Pusat Kebugaran Utama",
        image: "/assets/images/ub-sport-center-kantor-pusat-malang.avif",
    },
    {
        id: 2,
        name: "UB Sport Center Dieng",
        category: "Cabang Arena Terbuka",
        image: "/assets/images/fasilitas-arena-terbuka-dieng-ub-sport-center-malang.avif",
    },
    {
        id: 3,
        name: "UB Sport Center Transmart",
        category: "Cabang Eksklusif",
        image: "/assets/images/cabang-eksklusif-transmart-ub-sport-center-malang.avif",
    },
];

function BranchCard({ branch }: { branch: Branch }) {
    return (
        <div className="relative h-72 xl:h-96 w-full overflow-hidden rounded-2xl bg-gray-900">
            <img
                src={branch.image}
                alt={branch.name}
                className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div className="flex flex-col gap-0.5">
                    <span className="font-bdo font-light text-xs text-white/60 uppercase tracking-widest">
                        {branch.category}
                    </span>
                    <span className="font-bdo font-medium text-lg xl:text-xl text-white leading-tight">
                        {branch.name}
                    </span>
                </div>
                <div
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/50 text-white"
                    style={{ transform: "rotate(-45deg)" }}
                >
                    <Arrow size={14} />
                </div>
            </div>
        </div>
    );
}

export default function AboutBranches() {
    return (
        <section className="w-full bg-white" id="about-branches">
            <div className="mx-auto max-w-8xl px-8 pt-16 pb-0">
                <SectionDivider
                    number="03"
                    title="Cabang Kami"
                    subtitle="aboutpage /02"
                    theme="light"
                />
            </div>

            <div className="mx-auto max-w-8xl px-8 pb-32 mt-12 flex flex-col gap-12 xl:flex-row xl:gap-10 xl:items-start">
                <div className="xl:sticky xl:top-24 xl:w-56 xl:flex-shrink-0 flex flex-col gap-5">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-xl bg-accent-red flex-shrink-0" />
                        <span className="font-bdo font-medium text-sm text-black tracking-widest">
                            Eksplorasi Cabang Kami
                        </span>
                    </div>

                    <div className="inline-flex w-fit items-center gap-3 overflow-hidden rounded-md border border-gray-200 bg-white pr-4 shadow-sm">
                        <div className="flex h-12 w-16 items-center justify-center rounded-md bg-gradient-to-tr from-[#002244] to-[#15678D]">
                            <span className="text-white text-xs font-bdo font-medium">
                                <img
                                    src={gym}
                                    alt="Gym Icon"
                                    className="h-5 w-5"
                                />
                            </span>
                        </div>
                        <span className="font-bdo font-medium text-sm text-black">
                            Cabang Kami
                        </span>
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <ScrollStack topStart={80} cardOffset={20}>
                        {BRANCHES.map((branch) => (
                            <ScrollStackItem key={branch.id}>
                                <BranchCard branch={branch} />
                            </ScrollStackItem>
                        ))}
                    </ScrollStack>
                </div>

                <div className="hidden xl:flex xl:sticky xl:top-24 xl:w-52 xl:flex-shrink-0 flex-col justify-start pt-2">
                    <h2 className="font-bdo font-medium text-[clamp(1rem,1vw,1rem)] text-black leading-snug">
                        Pusat Olahraga saat ini ada di Berbagai Lokasi
                    </h2>
                </div>
            </div>
        </section>
    );
}
