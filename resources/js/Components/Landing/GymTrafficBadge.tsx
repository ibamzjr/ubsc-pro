import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gym from "../../../assets/hero/gym.svg";

interface GymTrafficBadgeProps {
    variant?: "default" | "reversed";
    stretch?: boolean;
}

type StatusType =
    | "High Occupancy"
    | "Medium Occupancy"
    | "Low Occupancy"
    | "Coming Soon"
    | "Just a Test"
    | "Stay Tune";

const STATUSES: StatusType[] = [
    "High Occupancy",
    "Coming Soon",
    "Medium Occupancy",
    "Just a Test",
    "Low Occupancy",
    "Stay Tune",
];

function getStatusStyles(status: StatusType) {
    switch (status) {
        case "High Occupancy":
            return {
                bg: "from-red-600 via-red-500 to-red-700",
                glow: "shadow-[0_0_40px_rgba(239,68,68,0.6)]",
            };
        case "Medium Occupancy":
            return {
                bg: "from-yellow-400 via-orange-400 to-orange-500",
                glow: "shadow-[0_0_40px_rgba(251,146,60,0.6)]",
            };
        case "Low Occupancy":
            return {
                bg: "from-green-500 via-emerald-500 to-green-600",
                glow: "shadow-[0_0_40px_rgba(34,197,94,0.6)]",
            };
        default:
            return {
                bg: "from-[#15678D] to-[#153359]",
                glow: "shadow-[0_0_40px_rgba(59,130,246,0.6)]",
            };
    }
}

export default function GymTrafficBadge({
    variant = "default",
    stretch = false,
}: GymTrafficBadgeProps) {
    const [index, setIndex] = useState(0);
    const status = STATUSES[index];
    const styles = getStatusStyles(status);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % STATUSES.length);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    const Shimmer = (
        <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
    );

    const Glow = (
        <motion.div
            className={`absolute inset-0 ${styles.glow}`}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
        />
    );

    /* ─── STRETCH mode: absolute-fills a flex-1 wrapper (SectionTwo) ─── */
    const StatusStretched = (
        <motion.div
            key={status}
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className={`absolute inset-0 flex items-center bg-gradient-to-r ${styles.bg} px-5 overflow-hidden`}
        >
            {Glow}
            {Shimmer}
            <span className="relative font-clash text-[clamp(0.875rem,0.83vw,16px)] font-bold text-white whitespace-nowrap">
                {status}
            </span>
        </motion.div>
    );

    /* ─── FLOW mode: natural content-width (Hero) ─── */
    const StatusFlow = (
        <motion.div
            key={status}
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className={`relative flex items-center bg-gradient-to-r ${styles.bg} px-5 py-3 md:px-8 md:py-5 xl:px-10 xl:py-3 overflow-hidden`}
        >
            {Glow}
            {Shimmer}
            <span className="relative font-clash text-[clamp(0.875rem,0.83vw,16px)] font-bold text-white whitespace-nowrap">
                {status}
            </span>
        </motion.div>
    );

    const GymTrafficLabel = (
        <div className="flex items-center gap-2 bg-black px-5 py-3 md:px-8 md:py-5 xl:px-10 xl:py-5">
            <motion.img
                src={gym}
                alt="Gym Traffic"
                className="h-4 w-4 text-white/70"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <span className="font-bdo text-[clamp(0.875rem,0.83vw,16px)] font-medium text-white/90 whitespace-nowrap">
                Gym Traffic
            </span>
        </div>
    );

    if (variant === "reversed") {
        return (
            <motion.div
                whileHover={{ scale: 1.05, rotateX: 3 }}
                className="flex items-stretch overflow-hidden rounded-lg border-4 border-black mt-5 xl:mt-0 perspective-[1000px]"
            >
                {stretch ? (
                    <div className="relative flex-1 overflow-hidden">
                        <AnimatePresence>{StatusStretched}</AnimatePresence>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">{StatusFlow}</AnimatePresence>
                )}

                <div className="flex items-center gap-2 bg-gray-200 px-5 py-4 md:px-8 md:py-5 xl:px-12 xl:py-3">
                    <motion.img
                        src={gym}
                        alt="Gym Traffic"
                        className="h-4 w-4 opacity-70"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                    <span className="font-clash text-[clamp(0.875rem,0.83vw,16px)] font-medium text-black whitespace-nowrap">
                        Gym Traffic
                    </span>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            whileHover={{ scale: 1.05, rotateX: 3 }}
            className={`${stretch ? "flex" : "inline-flex"} items-stretch overflow-hidden rounded-lg border-4 border-black mt-16 xl:mt-0 perspective-[1000px]`}
        >
            {GymTrafficLabel}

            {stretch ? (
                <div className="relative flex-1 overflow-hidden">
                    <AnimatePresence>{StatusStretched}</AnimatePresence>
                </div>
            ) : (
                <AnimatePresence mode="wait">{StatusFlow}</AnimatePresence>
            )}
        </motion.div>
    );
}
