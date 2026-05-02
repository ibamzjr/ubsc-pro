import { motion } from "framer-motion";

interface SectionDividerProps {
    number: string;
    title: string;
    subtitle: string;
    theme?: "light" | "dark";
}

export default function SectionDivider({
    number,
    title,
    subtitle,
    theme = "light",
}: SectionDividerProps) {
    const isDark = theme === "dark";

    return (
        <div
            className={`mb-16 border-t pt-4 ${
                isDark ? "border-white/20" : "border-black"
            }`}
        >
            <div
                className={`flex items-center justify-between text-[clamp(0.875rem,0.813rem+0.208vw,1rem)] ${
                    isDark ? "text-white" : "text-black"
                }`}
            >
                <span className="flex items-center gap-2">
                    <motion.span
                        className="h-1.5 w-1.5 rounded-full bg-[#ff0000] flex-shrink-0"
                        animate={{
                            scale: [1, 1.7, 1],
                            boxShadow: [
                                "0 0 0px 0px rgba(220,38,38,0)",
                                "0 0 6px 3px rgba(220,38,38,0.35)",
                                "0 0 0px 0px rgba(220,38,38,0)",
                            ],
                        }}
                        transition={{
                            duration: 2.2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    ({number})
                </span>
                <span className="font-bdo font-medium">({title})</span>
                <span className="font-bdo font-medium hidden lg:block">
                    /{subtitle}
                </span>
            </div>
        </div>
    );
}
