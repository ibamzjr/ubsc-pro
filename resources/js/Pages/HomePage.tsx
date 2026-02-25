import Hero from "@/Components/Landing/Hero";
import Navbar from "@/Components/Landing/Navbar";
import SectionTwo from "@/Components/Landing/SectionTwo";
import SectionThree from "@/Components/Landing/SectionThree";
import SectionFour from "@/Components/Landing/SectionFour";
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
            </main>
        </>
    );
}
