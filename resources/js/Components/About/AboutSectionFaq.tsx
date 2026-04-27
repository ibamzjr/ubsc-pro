import SectionDivider from "@/Components/Landing/SectionDivider";
import FaqItem from "@/Components/About/FaqItem";

interface FaqItemData {
    id: number;
    number: string;
    question: string;
    answer: string;
}

const DUMMY_FAQS: FaqItemData[] = [
    {
        id: 1,
        number: "01",
        question: "Siapa saja yang dapat menggunakan fasilitas UB Sport Center?",
        answer: "UB Sport Center terbuka untuk seluruh sivitas akademika Universitas Brawijaya maupun masyarakat umum dengan ketentuan dan tarif yang berlaku. Pengguna cukup melakukan pendaftaran keanggotaan di front desk kami.",
    },
    {
        id: 2,
        number: "02",
        question: "Bagaimana cara melakukan pemesanan fasilitas?",
        answer: "Pemesanan fasilitas dapat dilakukan secara langsung di front desk UB Sport Center atau melalui nomor WhatsApp resmi kami. Pastikan ketersediaan jadwal sebelum melakukan reservasi.",
    },
    {
        id: 3,
        number: "03",
        question: "Apakah pemesanan harus dilakukan terlebih dahulu?",
        answer: "Untuk fasilitas tertentu seperti lapangan dan studio kelas, reservasi sangat dianjurkan agar Anda mendapatkan slot waktu yang diinginkan. Fasilitas gym dapat digunakan langsung tanpa reservasi sesuai jam operasional.",
    },
    {
        id: 4,
        number: "04",
        question: "Metode pembayaran apa saja yang tersedia?",
        answer: "Kami menerima berbagai metode pembayaran termasuk tunai, transfer bank, dan pembayaran digital (QRIS, e-wallet). Untuk membership bulanan, tersedia opsi pembayaran via autodebet.",
    },
    {
        id: 5,
        number: "05",
        question: "Apakah jadwal penggunaan dapat diubah atau dibatalkan?",
        answer: "Perubahan atau pembatalan jadwal dapat dilakukan maksimal 24 jam sebelum waktu reservasi tanpa dikenakan biaya. Pembatalan kurang dari 24 jam akan dikenakan biaya administrasi sesuai ketentuan yang berlaku.",
    },
    {
        id: 6,
        number: "06",
        question: "Apakah UB Sport Center melayani kegiatan atau event?",
        answer: "Ya, UB Sport Center menyediakan layanan penyelenggaraan event olahraga mulai dari turnamen, liga komunitas, hingga pelatihan tim. Hubungi tim kami untuk konsultasi kebutuhan event Anda.",
    },
];

export default function AboutSectionFaq() {
    return (
        <section className="w-full bg-white" id="about-faq">
            <div className="mx-auto max-w px-6 py-8 sm:px-10 sm:py-12 lg:px-16 lg:py-16 xl:px-24 xl:py-24">
                <SectionDivider
                    number="06"
                    title="General FAQs"
                    subtitle="aboutpage /05"
                    theme="light"
                />

                <div className="grid grid-cols-1 gap-12 xl:grid-cols-12 xl:gap-8 xl:items-start">
                    <div className="xl:col-span-4 xl:sticky xl:top-24">
                        <h2 className="font-bdo font-medium text-[clamp(2rem,2.7vw,52px)] leading-[1.1] tracking-[-0.021em] text-black">
                            General FAQs
                        </h2>
                        <p className="mt-6 font-bdo font-normal text-[clamp(1rem,1.04vw,20px)] leading-relaxed text-black/50">
                            UB Sport Center berkomitmen untuk menghadirkan lingkungan yang profesional dan nyaman melalui.
                        </p>
                    </div>

                    <div className="xl:col-span-8 flex flex-col border-t border-black/10">
                        {DUMMY_FAQS.map((faq) => (
                            <FaqItem
                                key={faq.id}
                                number={faq.number}
                                question={faq.question}
                                answer={faq.answer}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
