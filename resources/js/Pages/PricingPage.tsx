import Navbar from "@/Components/Landing/Navbar";
import PricingHero from "@/Components/Pricing/PricingHero";
import PricingInfo from "@/Components/Pricing/PricingInfo";
import PricingFacilityList from "@/Components/Pricing/PricingFacilityList";
import PricingClassSection from "@/Components/Pricing/PricingClassSection";
import PricingAccordionSection from "@/Components/Pricing/PricingAccordionSection";
import AboutSectionContact from "@/Components/About/AboutSectionContact";
import Footer from "@/Components/Landing/Footer";
import { Head } from "@inertiajs/react";

export default function PricingPage() {
    return (
        <>
            <Head>
                <title>Jadwal &amp; Paket Harga | UB Sport Center</title>
                <meta
                    name="description"
                    content="Pilih jadwal dan paket olahraga terbaik di UB Sport Center Malang."
                />
                <meta
                    property="og:title"
                    content="Jadwal & Paket Harga | UB Sport Center"
                />
                <meta
                    property="og:description"
                    content="Berbagai pilihan paket harga fleksibel dan terjangkau di UB Sport Center."
                />
                <meta
                    property="og:image"
                    content="/assets/images/gym-konten-1-olahraga-ub-sport-center.avif"
                />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <main className="relative">
                <Navbar activeSection = "Pricing"/>
                <PricingHero />
                <PricingInfo />
                <PricingFacilityList />
                <PricingClassSection />
                <PricingAccordionSection />
                <AboutSectionContact />
            </main>
            <Footer />
        </>
    );
}
