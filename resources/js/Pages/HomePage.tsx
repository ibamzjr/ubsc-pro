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
import { Head } from "@inertiajs/react";

export default function HomePage() {
    return (
        <>
            <Head title="UB Sport Center" />
            <main className="relative">
                <Navbar activeSection="Home" />
                <Hero />
                <SectionTwo />
                <SectionThree />
                <SectionFour />
                <SectionFive />
                <SectionSix />
                <SectionSeven />
                <SectionEight />
            </main>
            <Footer />
        </>
    );
}
