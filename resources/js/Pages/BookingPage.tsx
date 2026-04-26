import Navbar from "@/Components/Landing/Navbar";
import BookingHero from "@/Components/Booking/BookingHero";
import BookingSection from "@/Components/Booking/BookingSection";
import BookingFacilitiesSection from "@/Components/Booking/BookingFacilitiesSection";
import BookingReviewSection from "@/Components/Booking/BookingReviewSection";
import AboutSectionContact from "@/Components/About/AboutSectionContact";
import Footer from "@/Components/Landing/Footer";
import { Head } from "@inertiajs/react";

export default function BookingPage() {
    return (
        <>
            <Head>
                <title>Booking | UB Sport Center</title>
                <meta
                    name="description"
                    content="Booking fasilitas olahraga terbaik di UB Sport Center Malang — gym, lapangan futsal, yoga, dan banyak lagi."
                />
                <meta property="og:title" content="Booking | UB Sport Center" />
                <meta
                    property="og:description"
                    content="Temukan fasilitas terbaik dan booking sesi latihan Anda dengan mudah di UB Sport Center."
                />
                <meta
                    property="og:image"
                    content="/assets/images/gym-konten-1-olahraga-ub-sport-center.avif"
                />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <main className="relative">
                <Navbar activeSection = "Booking"/>
                <BookingHero />
                <BookingSection />
                <BookingFacilitiesSection />
                <BookingReviewSection />
                <AboutSectionContact />
            </main>
            <Footer />
        </>
    );
}
