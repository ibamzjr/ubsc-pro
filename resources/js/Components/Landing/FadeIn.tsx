import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function FadeIn({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        >
            {children}
        </motion.div>
    );
}
