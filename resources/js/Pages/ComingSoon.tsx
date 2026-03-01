import { motion } from "framer-motion";
import { Link } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import bola from "@/../assets/images/bola ubsc.avif";

export default function ComingSoon() {
    return (
        <>
            <Head>
                <title>Segera Hadir — UB Sport Center</title>
            </Head>

            <div className="relative overflow-hidden">
                <div className="relative h-screen w-full overflow-hidden bg-black">
                    <div className="absolute -right-64 top-16 -z-0 aspect-square h-[60%] rounded-full bg-[#09172B] blur-[125px] lg:-right-32 lg:-top-56 lg:h-auto lg:w-2/4" />

                    <motion.p
                        initial={{ y: 350, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                            y: { duration: 0.5, delay: 3 },
                            opacity: { duration: 1.5, delay: 3 },
                        }}
                        className="absolute left-10 top-24 z-10 w-[65%] font-bdo text-sm font-light text-gray-300 md:top-36 lg:top-10 lg:w-full lg:text-lg"
                    >
                        Shh… Kami sedang mempersiapkan sesuatu yang luar biasa.
                        Nantikan!
                    </motion.p>

                    <div className="absolute bottom-40 left-10 flex w-full flex-col lg:bottom-3">
                        <motion.h1
                            initial={{ y: 500, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                                y: { duration: 0.5, delay: 2.5 },
                                opacity: { duration: 1.5, delay: 2.5 },
                            }}
                            className="z-10 -mb-[7vw] font-monument text-[9vh] font-extrabold text-white md:text-[13vh] lg:text-[12vw]"
                        >
                            COMING
                        </motion.h1>

                        <div className="flex w-full items-center">
                            <motion.h1
                                initial={{ y: 500, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{
                                    y: { duration: 0.5, delay: 2 },
                                    opacity: { duration: 1.5, delay: 2 },
                                }}
                                className="z-10 -me-[2.5%] font-monument text-[9vh] font-extrabold text-white md:text-[13vh] lg:text-[12vw]"
                            >
                                SO
                            </motion.h1>

                            <motion.img
                                initial={{ y: 500 }}
                                animate={{ y: 0, rotate: [0, 360] }}
                                transition={{
                                    y: { duration: 0.5, delay: 2 },
                                    rotate: {
                                        duration: 5,
                                        repeat: Infinity,
                                        ease: "linear",
                                    },
                                }}
                                src={bola}
                                alt="UB Sport Center"
                                className="w-[24%] md:w-[23%] lg:w-[15%]"
                                draggable={false}
                            />

                            <motion.h1
                                initial={{ y: 500, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{
                                    y: { duration: 0.5, delay: 2 },
                                    opacity: { duration: 1.5, delay: 2 },
                                }}
                                className="z-10 ms-[-3%] font-monument text-[9vh] font-extrabold text-white md:text-[13vh] lg:text-[12vw]"
                            >
                                N!
                            </motion.h1>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 3.5 }}
                        className="absolute bottom-8 left-10 z-10"
                    >
                        <Link
                            href="/"
                            className="font-bdo text-sm font-medium text-gray-400 underline underline-offset-4 transition hover:text-white"
                        >
                            ← Kembali ke Beranda
                        </Link>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ y: 0, opacity: 1 }}
                    animate={{ y: "-100%" }}
                    transition={{ y: { duration: 1.3, delay: 1 } }}
                    className="absolute left-0 top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-black"
                >
                    <div className="absolute left-1/2 top-1/2 -z-0 h-3/5 w-3/5 -translate-x-1/2 -translate-y-1/2 blur-3xl lg:h-4/5 lg:w-4/5 bg-[#09172B]" />
                    <motion.img
                        initial={{ y: 350, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                            y: { duration: 0.5 },
                            opacity: { duration: 1 },
                        }}
                        src="/ubsc.svg"
                        alt="UB Sport Center"
                        className="z-10 w-2/4 lg:w-1/4"
                        draggable={false}
                    />
                </motion.div>
            </div>
        </>
    );
}
