import FacilityBadge from "@/Components/Landing/FacilityBadge";

export interface ClassAccordionData {
    id: string;
    title: string;
    badgeLocation: string;
    badgeType: string;
    classCode: string;
    // TODO: Fetch this array from Backend API
    pricingDetails: string[];
}

interface Props {
    item: ClassAccordionData;
    isOpen: boolean;
    onToggle: () => void;
}

const XIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M18 6L6 18M6 6l12 12" />
    </svg>
);

const ChevronDown = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9l6 6 6-6" />
    </svg>
);

export default function PricingAccordionItem({ item, isOpen, onToggle }: Props) {
    return (
        <div>
            {/* ACCORDION HEADER */}
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between py-6 border-b border-white/10 text-left group"
            >
                <div className="flex items-center gap-8 xl:gap-24">
                    <span className="font-bdo font-medium text-[clamp(1.125rem,1.46vw,28px)] text-white leading-[1.48]">
                        {item.id}
                    </span>
                    <span className="font-bdo font-medium text-[clamp(1.5rem,2vw,32px)] text-white leading-snug group-hover:text-gray-300 transition-colors">
                        {item.title}
                    </span>
                </div>
                <div
                    className={`flex-shrink-0 flex size-11 items-center justify-center rounded-full transition-colors ${
                        isOpen
                            ? "bg-[#FF0000] text-white"
                            : "bg-white/10 text-white group-hover:bg-white/20"
                    }`}
                >
                    {isOpen ? <XIcon /> : <ChevronDown />}
                </div>
            </button>

            {/* ACCORDION BODY */}
            {isOpen && (
                <div className="flex flex-col xl:flex-row items-start xl:items-center gap-8 xl:gap-0 py-10 border-b border-white/10 xl:pl-[120px]">
                    {/* 1. Badge */}
                    <div className="shrink-0 xl:w-[220px]">
                        <FacilityBadge
                            location={item.badgeLocation}
                            category={item.badgeType}
                            variant="red"
                        />
                    </div>

                    {/* 2. Pricing list */}
                    <div className="flex-1">
                        <ul className="list-disc list-inside flex flex-col gap-3">
                            {item.pricingDetails.map((detail, i) => (
                                <li
                                    key={i}
                                    className="font-bdo font-medium text-[clamp(1rem,1.1vw,20px)] text-white"
                                >
                                    {detail}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 3. Class code */}
                    <div className="shrink-0 xl:w-[140px] xl:text-right">
                        <p className="font-bdo font-medium text-[clamp(0.875rem,0.9vw,16px)] text-white/70 tracking-widest uppercase">
                            {item.classCode}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
