import FacilityBadge from "@/Components/Landing/FacilityBadge";

export interface ClassPricingTier {
    title: string;
    warga: string;
    umum: string;
    note?: string;
}

export interface ClassAccordionData {
    id: string;
    title: string;
    badgeLocation: string;
    badgeType: string;
    thumbnail: string;
    classCode: string;
    pricingLeft: ClassPricingTier[];
    pricingRight: ClassPricingTier[];
}

interface Props {
    item: ClassAccordionData;
    isOpen: boolean;
    onToggle: () => void;
}

const XIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
    >
        <path d="M18 6L6 18M6 6l12 12" />
    </svg>
);

const ChevronDown = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M6 9l6 6 6-6" />
    </svg>
);

export default function PricingAccordionItem({
    item,
    isOpen,
    onToggle,
}: Props) {
    return (
        <div>
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between py-6 border-b border-white/10 text-left"
            >
                <div className="flex items-center gap-8 xl:gap-12">
                    <span className="font-bdo font-medium text-[clamp(1.125rem,1.46vw,28px)] text-white leading-[1.48]">
                        {item.id}
                    </span>
                    <span className="font-bdo font-light text-[clamp(1.5rem,2.08vw,40px)] text-white leading-snug">
                        {item.title}
                    </span>
                </div>
                <div
                    className={`flex-shrink-0 flex size-11 items-center justify-center rounded-full transition-colors ${
                        isOpen
                            ? "bg-accent-red text-white"
                            : "bg-white/10 text-white"
                    }`}
                >
                    {isOpen ? <XIcon /> : <ChevronDown />}
                </div>
            </button>

            {isOpen && (
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 py-8 border-b border-white/10">
                    <div className="flex flex-col gap-4">
                        <FacilityBadge
                            location={item.badgeLocation}
                            category={item.badgeType}
                        />
                        <div className="relative aspect-video overflow-hidden rounded-lg bg-black/40">
                            <img
                                src={item.thumbnail}
                                alt={item.title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/25" />
                            <div className="absolute inset-0 flex items-end justify-between px-3 py-2.5">
                                <div className="flex items-center gap-1.5 bg-white rounded-[4px] px-2 py-1">
                                    <span className="font-bdo font-medium text-[0.75rem] text-black">
                                        ▶ Play
                                    </span>
                                </div>
                                <span className="font-bdo font-medium text-[0.75rem] text-white/60">
                                    Showreel
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="font-bdo font-medium text-[clamp(1rem,1.04vw,20px)] text-white">
                            {item.classCode}
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        {item.pricingLeft.map((tier, i) => (
                            <div key={i} className="flex flex-col gap-0.5">
                                <p className="font-bdo font-normal text-[clamp(1rem,1.04vw,20px)] text-white">
                                    {tier.title}
                                </p>
                                <p className="font-bdo font-normal text-[clamp(1rem,1.04vw,20px)] text-white/60">
                                    {tier.warga}
                                </p>
                                <p className="font-bdo font-normal text-[clamp(1rem,1.04vw,20px)] text-white/60">
                                    {tier.umum}
                                </p>
                                {tier.note && (
                                    <p className="font-bdo font-normal text-[clamp(0.875rem,0.83vw,16px)] text-white/40 mt-0.5">
                                        {tier.note}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-6">
                        {item.pricingRight.map((tier, i) => (
                            <div key={i} className="flex flex-col gap-0.5">
                                <p className="font-bdo font-normal text-[clamp(1rem,1.04vw,20px)] text-white">
                                    {tier.title}
                                </p>
                                <p className="font-bdo font-normal text-[clamp(1rem,1.04vw,20px)] text-white/60">
                                    {tier.warga}
                                </p>
                                {tier.umum && (
                                    <p className="font-bdo font-normal text-[clamp(1rem,1.04vw,20px)] text-white/60">
                                        {tier.umum}
                                    </p>
                                )}
                                {tier.note && (
                                    <p className="font-bdo font-normal text-[clamp(0.875rem,0.83vw,16px)] text-white/40 mt-0.5">
                                        {tier.note}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
