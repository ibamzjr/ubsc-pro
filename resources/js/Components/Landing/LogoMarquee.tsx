import { motion } from "framer-motion";

export interface SponsorItem {
    id: number | string;
    name: string;
    img: string;
    link?: string | null;
}

const FALLBACK_LOGOS: SponsorItem[] = [
    { id: 1, name: "B1",        img: "/assets/icons/B1.png" },
    { id: 2, name: "Mo-Fruits", img: "/assets/icons/Mo-Fruits.png" },
    { id: 3, name: "ExtraJoss", img: "/assets/icons/ExtraJoss.png" },
    { id: 4, name: "AYO",       img: "/assets/icons/AYO.png" },
    { id: 5, name: "SC-Mart",   img: "/assets/icons/SC-Mart.png" },
];

export default function LogoMarquee({ sponsors }: { sponsors?: SponsorItem[] }) {
    const logos = sponsors && sponsors.length > 0 ? sponsors : FALLBACK_LOGOS;
    const duplicatedLogos = [...logos, ...logos];

    return (
        <div className="overflow-hidden w-full">
            <motion.div
                className="flex gap-4"
                animate={{ x: ["-50%", "0%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
            >
                {duplicatedLogos.map((logo, i) => (
                    <div
                        key={i}
                        className="bg-[#F7F7F7] flex items-center justify-center w-[144px] h-[96px] md:w-[220px] md:h-[160px] lg:w-[290px] lg:h-[218px] rounded-lg flex-shrink-0 pointer-events-none p-6 md:p-8 lg:p-10"
                    >
                        <img
                            src={logo.img}
                            alt={logo.name}
                            className="max-w-[60%] max-h-[60%] object-contain"
                            draggable={false}
                        />
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
