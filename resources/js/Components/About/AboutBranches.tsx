import SectionDivider from "@/Components/Landing/SectionDivider";
import ScrollStack, { ScrollStackItem } from "@/Components/Landing/ScrollStack";
import gym from "../../../assets/hero/gym.svg";
import branchesIcon from "../../../assets/icons/branches.svg";

interface Branch {
    id: number;
    name: string;
    category: string;
    image: string;
    mapLink?: string;
}

const BRANCHES: Branch[] = [
    {
        id: 1,
        name: "UB Sport Center Veteran",
        category: "Pusat Kebugaran Utama",
        image: "/assets/images/ub-sport-center-kantor-pusat-malang.avif",
        mapLink: "https://maps.app.goo.gl/JLc41TfD5TuLfu8h9",
    },
    {
        id: 2,
        name: "UB Sport Center Dieng",
        category: "Cabang Arena Terbuka",
        image: "/assets/images/fasilitas-arena-terbuka-dieng-ub-sport-center-malang.avif",
        mapLink: "https://maps.app.goo.gl/RNPXp5pW2TqcE2YGA",
    },
    // {
    //     id: 3,
    //     name: "UB Sport Center Transmart",
    //     category: "Cabang Eksklusif",
    //     image: "/assets/images/cabang-eksklusif-transmart-ub-sport-center-malang.avif",
    //     mapLink: "https://maps.app.goo.gl/rNEukCEQAQSZDAga6",
    // },
];

function BranchCard({ branch }: { branch: Branch }) {
    return (
        <a
            href={branch.mapLink ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-6 w-full cursor-pointer group"
        >
            <div className="relative w-full overflow-hidden">
                {/* Layer 1 — blurred backdrop */}
                <div className="absolute inset-0">
                    <img
                        src={branch.image}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover scale-110 blur-sm saturate-150 brightness-75"
                    />
                </div>

                {/* Layer 2 — sharp foreground image with Padding */}
                <div
                    className="rounded-none relative z-10 p-5 py-16 sm:px-[clamp(2rem,5vw,5rem)] 
                    xl:px-[clamp(5rem,6vw,10rem)] xl:py-24 flex flex-col gap-5"
                >
                    <div className="relative w-full aspect-[16/11] overflow-hidden transition-transform duration-300 ease-out group-hover:scale-[1.02]">
                        <img
                            src={branch.image}
                            alt={branch.name}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* TEXT CONTENT (Outside the image container as per SS1) */}
            <div className="flex items-start justify-between px-2 bg-[#F5F7F9] shadow-none">
                <div className="flex flex-col gap-1">
                    <h3 className="font-bdo font-semibold text-[clamp(1.25rem,1.3vw,32px)] text-black leading-tight">
                        {branch.name}
                    </h3>
                    <p className="font-bdo font-regular text-[clamp(0.875rem,1vw,18px)] text-gray-500">
                        {branch.category}
                    </p>
                </div>

                {/* SVG Icon CTA - Refined as per UI */}
                <div className="flex-shrink-0 flex items-center justify-center size-10 xl:size-12  text-gray-400 transition-all duration-300">
                    <img
                        src={branchesIcon}
                        alt="View on Map"
                        className="h-4 w-4"
                    />
                </div>
            </div>
        </a>
    );
}

interface AboutBranchesProps {
    sectionNumber?: string;
    sectionTitle?: string;
    sectionSubtitle?: string;
}

export default function AboutBranches({
    sectionNumber = "02",
    sectionTitle = "Cabang Kami",
    sectionSubtitle = "02 aboutpage",
}: AboutBranchesProps = {}) {
    return (
        <section
            className="w-full bg-[#F5F7F9] pb-10 lg:pb-24"
            id="about-branches"
        >
            <div className="mx-auto max-w px-6 pt-8 sm:px-10 sm:pt-12 lg:px-16 lg:pt-16 xl:px-24 xl:pt-10">
                <SectionDivider
                    number={sectionNumber}
                    title={sectionTitle}
                    subtitle={sectionSubtitle}
                    theme="light"
                />
            </div>

            <div className="mx-auto px-6 mt-12 sm:px-10 lg:px-16 xl:px-24 flex flex-col gap-6 xl:flex-row xl:gap-32 xl:items-start">
                {/* Left — label static (scrolls away); badge viewport-center sticky */}
                <div className="xl:w-64 xl:flex-shrink-0 xl:self-stretch">
                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 flex-shrink-0 bg-[#FF0000] rounded-sm" />
                        <span className="font-bdo text-[clamp(1rem,1rem,1.5rem)] font-medium tracking-wide text-gray-900">
                            Eksplorasi Cabang Kami
                        </span>
                    </div>
                    <div className="xl:hidden mt-4 font-bdo font-medium text-[clamp(1.24rem,4vw,1.5rem)] leading-tight text-black">
                        <h2>Pusat Olahraga saat ini</h2>
                        <h2>ada di Berbagai Lokasi</h2>
                    </div>
                    <div className="hidden xl:block xl:sticky xl:top-[50vh] xl:-translate-y-1/2 xl:mt-[12rem]">
                        <div className="inline-flex w-fit items-center gap-4 overflow-hidden rounded-xl border border-gray-100 bg-white p-1 pr-5 shadow-sm">
                            <div className="flex h-12 w-14 items-center justify-center rounded-lg bg-gradient-to-tr from-[#002244] to-[#15678D]">
                                <img
                                    src={gym}
                                    alt="Gym Icon"
                                    className="h-3 w-3"
                                />
                            </div>
                            <span className="font-bdo font-semibold text-[15px] text-black/70">
                                <span className="font-light">01/03</span> Cabang
                            </span>
                        </div>
                    </div>
                </div>

                {/* ScrollStack cards */}
                <div className="flex-1 min-w-0">
                    <ScrollStack topStart={100} cardOffset={40}>
                        {BRANCHES.map((loc) => (
                            <ScrollStackItem key={loc.id}>
                                <div className="bg-[#F5F7F9]">
                                    {" "}
                                    {/* Background matching the section for clean stack */}
                                    <BranchCard branch={loc} />
                                </div>
                            </ScrollStackItem>
                        ))}
                    </ScrollStack>
                </div>

                {/* Right sticky description */}
                <div className=" xl:hidden">
                    <div className="inline-flex w-fit items-center gap-4 overflow-hidden rounded-xl border border-gray-200 bg-white p-1 pr-5 shadow-sm">
                        <div className="flex h-11 w-14 items-center justify-center rounded-lg bg-gradient-to-tr from-[#002244] to-[#15678D]">
                            <img src={gym} alt="Gym Icon" className="h-3 w-3" />
                        </div>
                        <span className="font-bdo font-semibold text-[14px] text-black/70">
                            <span className="font-light">01/03</span> Cabang
                        </span>
                    </div>
                </div>
                {/* Right — viewport-center sticky with initial offset */}
                <div className="hidden xl:flex xl:w-56 xl:flex-shrink-0 xl:self-stretch flex-col">
                    <div className="xl:sticky xl:top-[50vh] xl:-translate-y-1/2 xl:mt-[12rem]">
                        <h2 className="font-bdo font-medium text-[20px] leading-[1.4] text-black">
                            Pusat Olahraga saat ini ada di Berbagai Lokasi
                        </h2>
                    </div>
                </div>
            </div>
        </section>
    );
}
