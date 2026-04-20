import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

interface FaqItemProps {
    number: string;
    question: string;
    answer: string;
}

const EASE = [0.76, 0, 0.24, 1] as const;

export default function FaqItem({ number, question, answer }: FaqItemProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-black/10">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between py-6 cursor-pointer text-left"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-6 xl:gap-8 min-w-0">
                    <span className="font-bdo font-light text-[28px] text-black leading-none flex-shrink-0 w-12">
                        {number}
                    </span>
                    <span className="font-bdo font-medium text-[clamp(0.95rem,1.5vw,1.75rem)] text-black leading-snug">
                        {question}
                    </span>
                </div>

                <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="ml-6 flex-shrink-0 text-black"
                >
                    <Plus size={22} strokeWidth={1.5} />
                </motion.div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.38, ease: EASE }}
                        className="overflow-hidden"
                    >
                        <p className="font-bdo font-light text-base xl:text-lg leading-relaxed text-black/60 pb-8 pl-[4.5rem] xl:pl-20">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
