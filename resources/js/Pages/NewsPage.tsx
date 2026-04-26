import Navbar from "@/Components/Landing/Navbar";
import NewsHero from "@/Components/News/NewsHero";
import ServicesSectionNews from "@/Components/News/ServicesSectionNews";
import ServicesSectionArtikel from "@/Components/News/ServicesSectionArtikel";
import Footer from "@/Components/Landing/Footer";
import { Head } from "@inertiajs/react";
import AboutSectionContact from "@/Components/About/AboutSectionContact";

export default function NewsPage() {
    return (
        <>
            <Head>
                <title>Berita | UB Sport Center</title>
                <meta
                    name="description"
                    content="Berita dan artikel terbaru dari UB Sport Center — pusat olahraga terkemuka di Malang."
                />
                <meta property="og:title" content="Berita | UB Sport Center" />
                <meta
                    property="og:description"
                    content="Berita dan artikel terbaru dari UB Sport Center."
                />
                <meta
                    property="og:image"
                    content="/assets/images/gym-konten-1-olahraga-ub-sport-center.avif"
                />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <main className="relative">
                <Navbar activeSection = "News"/>
                <NewsHero />
                <div id="news-content" />
                <ServicesSectionNews />
                <ServicesSectionArtikel />
                <AboutSectionContact />
            </main>
            <Footer />
        </>
    );
}
