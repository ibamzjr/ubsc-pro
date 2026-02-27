import Hero from "@/Components/Landing/Hero";
import Navbar from "@/Components/Landing/Navbar";
import SectionTwo from "@/Components/Landing/SectionTwo";
import SectionThree from "@/Components/Landing/SectionThree";
import SectionFour from "@/Components/Landing/SectionFour";
import SectionFive from "@/Components/Landing/SectionFive";
import SectionSix from "@/Components/Landing/SectionSix";
import SectionSeven from "@/Components/Landing/SectionSeven";
import SectionEight from "@/Components/Landing/SectionEight";
import Footer from "@/Components/Landing/Footer";
import FadeIn from "@/Components/Landing/FadeIn";
import { Head } from "@inertiajs/react";

export default function HomePage() {
    return (
        <>
            <Head>
                <title>UB Sport Center | Pusat Olahraga Modern Malang</title>
                <meta
                    name="description"
                    content="UB Sport Center: pusat fasilitas olahraga modern, gym, lapangan, dan kelas kebugaran di Malang. Booking online mudah & cepat."
                />
                <meta
                    property="og:title"
                    content="UB Sport Center | Pusat Olahraga Modern Malang"
                />
                <meta
                    property="og:description"
                    content="UB Sport Center: pusat fasilitas olahraga modern, gym, lapangan, dan kelas kebugaran di Malang. Booking online mudah & cepat."
                />
                <meta property="og:image" content="/assets/hero/Hero.avif" />
                <meta property="og:type" content="website" />
                {/* <meta
                    property="og:url"
                    content="https://ubsportcenter.co.id/"
                /> */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content="UB Sport Center | Pusat Olahraga Modern Malang"
                />
                <meta
                    name="twitter:description"
                    content="UB Sport Center: pusat fasilitas olahraga modern, gym, lapangan, dan kelas kebugaran di Malang. Booking online mudah & cepat."
                />
                <meta name="twitter:image" content="/assets/hero/Hero.avif" />
                {/* <link rel="canonical" href="https://ubsportcenter.co.id/" /> */}
            </Head>
            <main className="relative">
                <Navbar activeSection="Home" />
                <Hero />
                <FadeIn>
                    <SectionTwo />
                </FadeIn>
                <FadeIn>
                    <SectionThree />
                </FadeIn>
                <FadeIn>
                    <SectionFour />
                </FadeIn>
                <FadeIn>
                    <SectionFive />
                </FadeIn>
                <FadeIn>
                    <SectionSix />
                </FadeIn>
                <FadeIn>
                    <SectionSeven />
                </FadeIn>
                <FadeIn>
                    <SectionEight />
                </FadeIn>
            </main>
            <Footer />
        </>
    );
}
