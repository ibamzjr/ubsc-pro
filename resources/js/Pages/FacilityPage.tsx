import Navbar from "@/Components/Landing/Navbar";
import FacilityHero from "@/Components/Facility/FacilityHero";
import FacilityMembership from "@/Components/Facility/FacilityMembership";
import FacilityListSection from "@/Components/Facility/FacilityListSection";
import FacilityClassSection from "@/Components/Facility/FacilityClassSection";
import CurvedLoop from "@/Components/Landing/CurvedLoop";
import bg from "@/../assets/images/bg-about.avif";
import person from "@/../assets/images/person.avif";
import AboutBranches from "@/Components/About/AboutBranches";
import SectionSeven from "@/Components/Landing/SectionSeven";
import AboutSectionContact from "@/Components/About/AboutSectionContact";
import Footer from "@/Components/Landing/Footer";
import { Head } from "@inertiajs/react";

export default function FacilityPage() {
    return (
        <>
            <Head>
                <title>Fasilitas | UB Sport Center</title>
                <meta
                    name="description"
                    content="Temukan fasilitas olahraga terlengkap di UB Sport Center Malang — gym, lapangan futsal, yoga, zumba, dan masih banyak lagi."
                />
                <meta
                    property="og:title"
                    content="Fasilitas | UB Sport Center"
                />
                <meta
                    property="og:description"
                    content="Fasilitas olahraga terlengkap di UB Sport Center Malang."
                />
                <meta
                    property="og:image"
                    content="/assets/images/fasilitas-arena-terbuka-dieng-ub-sport-center-malang.avif"
                />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <main className="relative">
                <Navbar activeSection="Facilities" />
                <FacilityHero />
                <FacilityMembership />
                <FacilityListSection />
                <FacilityClassSection />
                <AboutBranches
                    sectionNumber="04"
                    sectionTitle="Cabang Kami"
                    sectionSubtitle="04 facility page"
                />
                <SectionSeven
                    sectionNumber="05"
                    sectionTitle="Testimoni"
                    sectionSubtitle="05 facility page"
                />
                <AboutSectionContact
                    sectionNumber="06"
                    sectionTitle="Informasi"
                    sectionSubtitle="06 facility page"
                />
            </main>
            <Footer />
        </>
    );
}
