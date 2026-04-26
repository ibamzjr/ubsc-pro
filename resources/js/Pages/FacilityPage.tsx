import Navbar from "@/Components/Landing/Navbar";
import FacilityHero from "@/Components/Facility/FacilityHero";
import FacilityMembership from "@/Components/Facility/FacilityMembership";
import FacilityListSection from "@/Components/Facility/FacilityListSection";
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
                <Navbar activeSection = "Facilities"/>
                <FacilityHero />
                <FacilityMembership />
                <FacilityListSection />
                <div
                    className="relative bg-[#0B1E3B] py-32 mx-16 overflow-hidden  xl:mb-12"
                    style={{ background: `url(${bg}) repeat` }}
                >
                    <CurvedLoop
                        marqueeText="UB * SPORT CENTER * "
                        speed={1.5}
                        curveAmount={80}
                        direction="left"
                        interactive
                    />

                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <img
                            src={person}
                            alt="UB Sport Center athlete"
                            className="h-64 xl:h-80 w-auto object-cover shadow-2xl"
                        />
                    </div>
                </div>{" "}
                <AboutBranches />
                <SectionSeven />
                <AboutSectionContact />
            </main>
            <Footer />
        </>
    );
}
