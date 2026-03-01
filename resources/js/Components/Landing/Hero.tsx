import GymTrafficBadge from "@/Components/Landing/GymTrafficBadge";
import HeroBottomBar from "@/Components/Landing/HeroBottomBar";
import HeroContent from "@/Components/Landing/HeroContent";
import HeroTitle from "@/Components/Landing/HeroTitle";
import { motion, AnimatePresence } from "framer-motion";
import { Head } from "@inertiajs/react";
import { useState } from "react";
// Remove FluidGlassCursor import, add FluidGlass from library
// import FluidGlass from "@/Components/Landing/FluidGlass";

export default function Hero() {
    const [isLoaded, setIsLoaded] = useState(false);
    return (
        <>
            <Head>
                <link rel="preload" as="image" href="/assets/hero/Hero.avif" />
            </Head>
            <section
                id="home"
                className="relative flex min-h-screen flex-col overflow-hidden bg-slate-500"
            >
                <AnimatePresence>
                    {!isLoaded && (
                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center"
                            style={{
                                background:
                                    "linear-gradient(180deg, #000000 0%, #173859 100%)",
                            }}
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 0.5 } }}
                        >
                            <img
                                src="/ubsc.svg"
                                alt="UBSC"
                                className="h-24 w-24 animate-pulse"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
                <motion.img
                    src="/assets/hero/Hero.avif"
                    alt="UBSC Hero Background"
                    className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center select-none"
                    initial={{ opacity: 0, scale: 1.15 }}
                    animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                    onLoad={() => setIsLoaded(true)}
                    draggable={false}
                    loading="eager"
                    style={{ transitionProperty: "opacity, transform" }}
                />
                {/* FluidGlass lens effect (desktop only) */}
                {/* <div
                    className="hidden xl:block absolute inset-0 z-40"
                    style={{
                        height: "100vh",
                        position: "absolute",
                        width: "100vw",
                    }}
                >
                </div> */}
                <motion.div
                    className="absolute inset-0 z-0 bg-slate-500"
                    animate={{ opacity: isLoaded ? 0 : 1 }}
                    transition={{ duration: 0.5, delay: isLoaded ? 0.1 : 0 }}
                />

                <div className="relative z-10 hidden xl:flex flex-col items-stretch h-screen max-h-screen overflow-hidden">
                    <div className="flex flex-1 items-end justify-between pb-32 px-16 pt-32 min-h-0">
                        <motion.div
                            initial={{ opacity: 0, x: -32 }}
                            animate={isLoaded ? { opacity: 1, x: 0 } : {}}
                            transition={{
                                duration: 0.8,
                                delay: 0.7,
                                ease: [0.4, 0, 0.2, 1],
                            }}
                        >
                            <GymTrafficBadge />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 32 }}
                            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                            transition={{
                                duration: 0.8,
                                delay: 0.9,
                                ease: [0.4, 0, 0.2, 1],
                            }}
                        >
                            <HeroContent />
                        </motion.div>
                    </div>

                    <div className="flex flex-col justify-end pb-14 px-16 min-h-0">
                        <motion.div
                            initial={{ opacity: 0, y: 32 }}
                            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                            transition={{
                                duration: 0.8,
                                delay: 1.1,
                                ease: [0.4, 0, 0.2, 1],
                            }}
                        >
                            <HeroTitle />
                        </motion.div>
                    </div>

                    <motion.div
                        className="absolute bottom-12 right-16"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
                        transition={{
                            duration: 0.8,
                            delay: 1.3,
                            ease: [0.4, 0, 0.2, 1],
                        }}
                    >
                        <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-white shadow-xl">
                            <motion.img
                                src="/BMU.svg"
                                alt="Brawijaya Multi Usaha"
                                className="h-full w-full object-contain"
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 8,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                            />
                        </div>
                    </motion.div>
                </div>

                <div className="relative z-10 flex h-screen flex-col px-8 pt-28 xl:hidden">
                    <motion.div
                        className="flex-shrink-0"
                        initial={{ opacity: 0, x: -32 }}
                        animate={isLoaded ? { opacity: 1, x: 0 } : {}}
                        transition={{
                            duration: 0.8,
                            delay: 0.7,
                            ease: [0.4, 0, 0.2, 1],
                        }}
                    >
                        <GymTrafficBadge />
                    </motion.div>

                    <motion.div
                        className="mt-8 flex-shrink-0"
                        initial={{ opacity: 0, y: 32 }}
                        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                        transition={{
                            duration: 0.8,
                            delay: 0.9,
                            ease: [0.4, 0, 0.2, 1],
                        }}
                    >
                        <HeroContent />
                    </motion.div>

                    <div className="flex flex-1 flex-col justify-end pb-10">
                        <motion.div
                            className="mb-6"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
                            transition={{
                                duration: 0.8,
                                delay: 1.3,
                                ease: [0.4, 0, 0.2, 1],
                            }}
                        >
                            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-white shadow-xl">
                                <motion.img
                                    src="/BMU.svg"
                                    alt="Brawijaya Multi Usaha"
                                    className="h-full w-full object-contain"
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 8,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 32 }}
                            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                            transition={{
                                duration: 0.8,
                                delay: 1.1,
                                ease: [0.4, 0, 0.2, 1],
                            }}
                        >
                            <HeroTitle />
                        </motion.div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10" />
            </section>

            <HeroBottomBar />
        </>
    );
}
