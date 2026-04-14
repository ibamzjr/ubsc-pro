import Navbar from "@/Components/Landing/Navbar";
import FadeIn from "@/Components/Landing/FadeIn";
import AboutHero from "@/Components/Landing/AboutHero";
import { Head } from "@inertiajs/react";

export default function AboutPage() {
    return (
        <>
            <Head>
                <title>Tentang Kami | UB Sport Center</title>
                <meta
                    name="description"
                    content="Pelajari sejarah, visi, dan perkembangan UB Sport Center — pusat olahraga terkemuka di Malang yang melayani sivitas akademika dan masyarakat umum."
                />
                <meta
                    property="og:title"
                    content="Tentang Kami | UB Sport Center"
                />
                <meta
                    property="og:description"
                    content="Pelajari sejarah, visi, dan perkembangan UB Sport Center — pusat olahraga terkemuka di Malang."
                />
                <meta property="og:image" content="/assets/images/gym-konten-1-olahraga-ub-sport-center.avif" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <main className="relative">
                <Navbar />
                <AboutHero />
                {/* Sections will be added here one by one */}
            </main>
        </>
    );
}
