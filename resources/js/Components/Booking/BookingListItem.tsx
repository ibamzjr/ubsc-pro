import { motion, AnimatePresence } from "framer-motion";
import FacilityBadge from "@/Components/Landing/FacilityBadge";
import ReservasiButton from "@/Components/Landing/ReservasiButton";

interface TimeSlot {
    time: string;
    price: string;
    status: "available" | "selected" | "booked";
}

export interface BookingFacility {
    id: string;
    title: string;
    code: string;
    image: string;
    badgeLocation: string;
    badgeType: string;
    availableSlots: TimeSlot[];
}

interface Props {
    item: BookingFacility;
    isOpen: boolean;
    onToggle: () => void;
}

const EASE = [0.76, 0, 0.24, 1] as const;

const DAYS = [
    { day: "Sen", date: "01" },
    { day: "Sol", date: "02" },
    { day: "Rao", date: "03" },
    { day: "Kam", date: "04" },
    { day: "Jum", date: "05" },
    { day: "Sab", date: "06" },
    { day: "Min", date: "07" },
    { day: "Sen", date: "08" },
    { day: "Sol", date: "09" },
];
const SELECTED_DAY = "04";
const MONTH_LABEL = "Februari 2025";

const ChevronDown = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9l6 6 6-6" />
    </svg>
);

const XIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M18 6L6 18M6 6l12 12" />
    </svg>
);

const ChevronLeft = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6 6-6" />
    </svg>
);

const ChevronRight = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18l6-6-6-6" />
    </svg>
);

function CalendarUI({ slots }: { slots: TimeSlot[] }) {
    return (
        <div className="rounded-2xl border border-gray-200 p-6 xl:p-8">
            <div className="flex justify-between items-center mb-6">
                <button
                    type="button"
                    className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 font-bdo text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    {MONTH_LABEL}
                    <ChevronDown />
                </button>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="flex size-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                        <ChevronLeft />
                    </button>
                    <button
                        type="button"
                        className="flex size-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                        <ChevronRight />
                    </button>
                </div>
            </div>

            <div className="flex gap-2 xl:gap-3 mb-8 overflow-x-auto pb-2">
                {DAYS.map((d) => (
                    <div
                        key={d.date}
                        className={`flex flex-col items-center justify-center py-3 px-3 xl:px-4 rounded-xl border flex-shrink-0 min-w-[52px] xl:min-w-[60px] select-none ${
                            d.date === SELECTED_DAY
                                ? "bg-slate-500 border-transparent text-white"
                                : "bg-white border-gray-200 text-gray-400"
                        }`}
                    >
                        <span className="font-bdo text-xs">{d.day}</span>
                        <span className="font-bdo font-medium text-sm xl:text-base">{d.date}</span>
                    </div>
                ))}
            </div>

            <p className="font-bdo font-medium text-base text-gray-600 mb-4">
                Waktu Yang Tersedia
            </p>
            <div className="relative">
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
                    {slots.map((slot, i) => (
                        <div
                            key={i}
                            className={`flex flex-col items-center py-4 px-2 rounded-xl text-sm transition-colors ${
                                slot.status === "selected"
                                    ? "bg-slate-500 text-white"
                                    : slot.status === "booked"
                                    ? "bg-rose-200 text-rose-800"
                                    : "bg-gray-50 text-gray-400"
                            }`}
                        >
                            <span className="font-bdo font-medium text-xs xl:text-sm">
                                {slot.status === "booked" ? "DIPESAN" : slot.time}
                            </span>
                            {slot.status !== "booked" && (
                                <span className="font-bdo font-light text-xs opacity-70 mt-1">
                                    {slot.price}
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/40 backdrop-blur-[2px]">
                    <div className="bg-[#B90000] text-white text-[clamp(1.5rem,3vw,2.5rem)] font-black italic tracking-wider px-8 py-4 rounded-md shadow-2xl -rotate-2">
                        COMING SOON
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function BookingListItem({ item, isOpen, onToggle }: Props) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr] gap-6 xl:gap-8 py-6 border-b border-gray-200 w-full items-start">

            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden">
                <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                {!isOpen && (
                    <div className="absolute bottom-3 left-3">
                        <FacilityBadge
                            location={item.badgeLocation}
                            category={item.badgeType}
                        />
                    </div>
                )}
            </div>

            <div className="flex flex-col w-full min-w-0">

                <div
                    onClick={onToggle}
                    role="button"
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between cursor-pointer pb-2 gap-4"
                >
                    <span className="flex-grow font-bdo font-light text-[clamp(1.25rem,1.67vw,32px)] text-black leading-tight">
                        {item.title}
                    </span>
                    <span className="hidden sm:block font-bdo font-medium text-sm text-gray-400 whitespace-nowrap">
                        {item.code}
                    </span>
                    <div
                        className={`flex-shrink-0 flex size-10 xl:size-11 items-center justify-center rounded-full transition-colors ${
                            isOpen ? "bg-accent-red text-white" : "bg-black text-white"
                        }`}
                    >
                        {isOpen ? <XIcon /> : <ChevronDown />}
                    </div>
                </div>

                <AnimatePresence initial={false}>
                    {isOpen && (
                        <motion.div
                            key="body"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.45, ease: EASE }}
                            className="overflow-hidden"
                        >
                            <div className="mt-6">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                                    <ReservasiButton label="Mulai Reservasi" href="#" />
                                    <FacilityBadge
                                        location={item.badgeLocation}
                                        category={item.badgeType}
                                    />
                                </div>

                                <CalendarUI slots={item.availableSlots} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
