import { motion } from "framer-motion";
import FacilityBadge from "@/Components/Landing/FacilityBadge";

export interface ClassAccordionData {
    id: string;
    title: string;
    image: string;
    badgeLocation: string;
    badgeType: string;
    classCode: string;
    pricingDetails: { label: string }[];
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
                <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    {/* ── MOBILE BODY (xl:hidden) ─────────────────────── */}
                    <div className="xl:hidden flex flex-col py-6 border-b border-white/10">
                        {/* Top: Badge */}
                        <FacilityBadge
                            location={item.badgeLocation}
                            category={item.badgeType}
                            variant="red"
                        />
                        {/* Body row: image left + list right */}
                        <div className="flex flex-row items-start gap-4 mt-4 w-full">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-[153px] h-[101px] object-cover rounded-xl flex-shrink-0"
                            />
                            <div className="flex flex-col gap-2">
                                {item.pricingDetails.map((detail, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="size-1.5 rounded-full bg-white/60 flex-shrink-0" />
                                        <span className="font-bdo font-medium text-[clamp(0.875rem,1vw,18px)] text-white">
                                            {detail.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Footer: classCode */}
                        <p className="font-bdo font-medium text-[0.65rem] text-white/50 tracking-widest uppercase mt-3">
                            {item.classCode}
                        </p>
                    </div>

                    {/* ── DESKTOP BODY (hidden xl:block) ──────────────── */}
                    <div className="hidden xl:block py-10 border-b border-white/10 pl-0">
                        {/* Top: Badge */}
                        <FacilityBadge
                            location={item.badgeLocation}
                            category={item.badgeType}
                            variant="red"
                        />
                        {/* Bottom: image + list + classCode */}
                        <div className="flex flex-row items-start gap-8 mt-4">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-[240px] h-[140px] object-cover rounded-xl flex-shrink-0"
                            />
                            <div className="flex-grow flex flex-col gap-2">
                                {item.pricingDetails.map((detail, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="size-1.5 rounded-full bg-white/60 flex-shrink-0" />
                                        <span className="font-bdo font-medium text-[clamp(1rem,1.1vw,20px)] text-white">
                                            {detail.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <p className="font-bdo font-medium text-[clamp(0.875rem,0.9vw,16px)] text-white/70 tracking-widest uppercase text-right flex-shrink-0">
                                {item.classCode}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
