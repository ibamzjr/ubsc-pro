import { motion } from "framer-motion";
import SectionDivider from "@/Components/Landing/SectionDivider";
import BookingReviewCard, { type Review } from "./BookingReviewCard";

const DUMMY_REVIEWS: Review[] = [
    {
        id: "01",
        rating: 4,
        text: "Working with this designer was an effortless experience. The visuals were not only beautiful but deeply aligned with our goals.",
        authorName: "Jordan Wells",
        authorDate: "22 April 2026",
        avatar: "/assets/icons/ulasan-malang-tennis-academy-ubsc.avif",
    },
    {
        id: "02",
        rating: 5,
        text: "Great eye for detail and a sense of narrative. The final output elevated our presentation and made a real impact on stakeholders.",
        authorName: "Daniel Okoro",
        authorDate: "22 April 2026",
        avatar: "/assets/icons/ulasan-malang-tennis-academy-ubsc.avif",
    },
    {
        id: "03",
        rating: 5,
        text: "Clear communication, thoughtful design choices, and a strong sense of ownership throughout the process. The outcome exceeded expectations on every level.",
        authorName: "Lina Moreau",
        authorDate: "22 April 2026",
        avatar: "/assets/icons/ulasan-malang-tennis-academy-ubsc.avif",
    },
    {
        id: "04",
        rating: 5,
        text: "Working with Lucas was an absolute pleasure. He took our vision and turned it into visuals that truly resonated with our audience.",
        authorName: "Renee Takada",
        authorDate: "22 April 2026",
        avatar: "/assets/icons/ulasan-malang-tennis-academy-ubsc.avif",
    },
    {
        id: "05",
        rating: 4,
        text: "Luar biasa! Fasilitas UB Sport Center benar-benar mendukung aktivitas latihan kami dengan sangat baik. Rekomendasikan untuk semua kalangan.",
        authorName: "Ahmad Farid",
        authorDate: "22 April 2026",
        avatar: "/assets/icons/ulasan-malang-tennis-academy-ubsc.avif",
    },
];

const duplicatedReviews = [...DUMMY_REVIEWS, ...DUMMY_REVIEWS];

export default function BookingReviewSection() {
    return (
        <section className="w-full bg-[#F9F9F9] py-24 overflow-hidden">
            <div className="mx-auto max-w px-6 sm:px-10 lg:px-16 xl:px-24">
                <SectionDivider
                    number="06"
                    title="Informasi"
                    subtitle="02 bookingpage"
                    theme="light"
                />

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start mt-16 mb-20">
                    <div className="xl:col-span-3">
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 flex-shrink-0 bg-red-600" />
                            <span className="font-bdo text-sm md:text-base xl:text-2xl text-gray-800">
                                Ulasan Pelanggan
                            </span>
                        </div>
                    </div>

                    <div className="xl:col-span-6">
                        <h2 className="text-3xl font-medium leading-tight tracking-tight text-gray-900 md:text-4xl xl:text-5xl">
                            Dukungan Penuh Untuk
                            <br />
                            Setiap Cabang Olahraga
                        </h2>
                    </div>

                    <div className="xl:col-span-3">
                        <p className="font-bdo font-light text-sm md:text-base xl:text-xl leading-relaxed text-black opacity-70">
                            Kami menghadirkan berbagai pilihan fasilitas
                            olahraga indoor dan fitness untuk kenyamanan
                            latihan Anda.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex w-full relative">
                <motion.div
                    className="flex gap-6 xl:gap-8 pl-6 xl:pl-24 pointer-events-none"
                    animate={{ x: ["-50%", "0%"] }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
                >
                    {duplicatedReviews.map((review, i) => (
                        <BookingReviewCard key={`${review.id}-${i}`} review={review} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
