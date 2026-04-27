import { motion } from "framer-motion";

const LOGOS = [
    { id: 1, img: "/assets/icons/B1.png" },
    { id: 2, img: "/assets/icons/Mo-Fruits.png" },
    { id: 3, img: "/assets/icons/ExtraJoss.png" },
    { id: 4, img: "/assets/icons/AYO.png" },
    { id: 5, img: "/assets/icons/SC-Mart.png" },
];

const duplicatedLogos = [...LOGOS, ...LOGOS];

export default function LogoMarquee() {
    return (
        <div className="flex items-center gap-8 overflow-hidden w-full">
            <p className="whitespace-nowrap font-bdo font-medium text-sm uppercase text-black flex-shrink-0">
                /Worked With
            </p>
            <div className="overflow-hidden flex-1">
                <motion.div
                    className="flex gap-4"
                    animate={{ x: ["-50%", "0%"] }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
                >
                    {duplicatedLogos.map((logo, i) => (
                        <div
                            key={i}
                            className="bg-[#F7F7F7] flex items-center justify-center w-[200px] h-[100px] rounded-lg flex-shrink-0 pointer-events-none"
                        >
                            <img
                                src={logo.img}
                                alt=""
                                className="max-w-[60%] max-h-[60%] object-contain"
                                draggable={false}
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
