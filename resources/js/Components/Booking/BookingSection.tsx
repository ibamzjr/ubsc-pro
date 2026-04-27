import { useState } from "react";
import SectionDivider from "@/Components/Landing/SectionDivider";
import BookingListItem, { type BookingFacility } from "./BookingListItem";

const DUMMY_BOOKINGS: BookingFacility[] = [
    {
        id: "01",
        title: "/Futsal Veteran",
        code: "/Arena Dalam 004/",
        image: "/assets/images/fasilitas-futsal-ub-sport-center.avif",
        badgeLocation: "Veteran",
        badgeType: "Kebugaran",
        availableSlots: [
            { time: "06 - 07 AM", price: "Rp135.000", status: "selected" },
            { time: "07 - 08 AM", price: "Rp135.000", status: "available" },
            { time: "08 - 09 AM", price: "Rp135.000", status: "available" },
            { time: "09 - 10 AM", price: "Rp135.000", status: "available" },
            { time: "10 - 11 AM", price: "Rp135.000", status: "available" },
            { time: "11 - 12 AM", price: "Rp135.000", status: "available" },
            { time: "12 - 01 PM", price: "Rp135.000", status: "booked" },
            { time: "01 - 02 PM", price: "Rp135.000", status: "available" },
            { time: "02 - 03 PM", price: "Rp135.000", status: "booked" },
            { time: "03 - 04 PM", price: "Rp135.000", status: "booked" },
            { time: "04 - 05 PM", price: "Rp135.000", status: "available" },
            { time: "05 - 06 PM", price: "Rp135.000", status: "available" },
            { time: "06 - 07 PM", price: "Rp135.000", status: "available" },
            { time: "07 - 08 PM", price: "Rp135.000", status: "available" },
        ],
    },
    {
        id: "02",
        title: "/Tennis Meja",
        code: "/Arena Dalam 003/",
        image: "/assets/images/fasilitas-tennis-meja-ub-sport-center.avif",
        badgeLocation: "Veteran",
        badgeType: "Kebugaran",
        availableSlots: [
            { time: "06 - 07 AM", price: "Rp100.000", status: "available" },
            { time: "07 - 08 AM", price: "Rp100.000", status: "available" },
            { time: "08 - 09 AM", price: "Rp100.000", status: "booked" },
            { time: "09 - 10 AM", price: "Rp100.000", status: "booked" },
            { time: "10 - 11 AM", price: "Rp100.000", status: "available" },
            { time: "11 - 12 AM", price: "Rp100.000", status: "available" },
            { time: "12 - 01 PM", price: "Rp100.000", status: "available" },
            { time: "01 - 02 PM", price: "Rp100.000", status: "booked" },
            { time: "02 - 03 PM", price: "Rp100.000", status: "available" },
            { time: "03 - 04 PM", price: "Rp100.000", status: "available" },
            { time: "04 - 05 PM", price: "Rp100.000", status: "available" },
            { time: "05 - 06 PM", price: "Rp100.000", status: "booked" },
            { time: "06 - 07 PM", price: "Rp100.000", status: "available" },
            { time: "07 - 08 PM", price: "Rp100.000", status: "available" },
        ],
    },
    {
        id: "03",
        title: "/Futsal Dieng",
        code: "/Kelas 001/",
        image: "/assets/images/fasilitas-futsal-dieng-ub-sport-center.avif",
        badgeLocation: "Dieng",
        badgeType: "Kebugaran",
        availableSlots: [
            { time: "06 - 07 AM", price: "Rp135.000", status: "available" },
            { time: "07 - 08 AM", price: "Rp135.000", status: "booked" },
            { time: "08 - 09 AM", price: "Rp135.000", status: "booked" },
            { time: "09 - 10 AM", price: "Rp135.000", status: "available" },
            { time: "10 - 11 AM", price: "Rp135.000", status: "available" },
            { time: "11 - 12 AM", price: "Rp135.000", status: "available" },
            { time: "12 - 01 PM", price: "Rp135.000", status: "available" },
            { time: "01 - 02 PM", price: "Rp135.000", status: "available" },
            { time: "02 - 03 PM", price: "Rp135.000", status: "booked" },
            { time: "03 - 04 PM", price: "Rp135.000", status: "available" },
            { time: "04 - 05 PM", price: "Rp135.000", status: "available" },
            { time: "05 - 06 PM", price: "Rp135.000", status: "available" },
            { time: "06 - 07 PM", price: "Rp135.000", status: "available" },
            { time: "07 - 08 PM", price: "Rp135.000", status: "available" },
        ],
    },
    {
        id: "04",
        title: "/Sepak Bola",
        code: "/Kelas 001/",
        image: "/assets/images/fasilitas-sepak-bola-ub-sport-center.avif",
        badgeLocation: "Veteran",
        badgeType: "Arena",
        availableSlots: [
            { time: "06 - 07 AM", price: "Rp150.000", status: "available" },
            { time: "07 - 08 AM", price: "Rp150.000", status: "available" },
            { time: "08 - 09 AM", price: "Rp150.000", status: "available" },
            { time: "09 - 10 AM", price: "Rp150.000", status: "booked" },
            { time: "10 - 11 AM", price: "Rp150.000", status: "booked" },
            { time: "11 - 12 AM", price: "Rp150.000", status: "booked" },
            { time: "12 - 01 PM", price: "Rp150.000", status: "available" },
            { time: "01 - 02 PM", price: "Rp150.000", status: "available" },
            { time: "02 - 03 PM", price: "Rp150.000", status: "available" },
            { time: "03 - 04 PM", price: "Rp150.000", status: "available" },
            { time: "04 - 05 PM", price: "Rp150.000", status: "available" },
            { time: "05 - 06 PM", price: "Rp150.000", status: "booked" },
            { time: "06 - 07 PM", price: "Rp150.000", status: "available" },
            { time: "07 - 08 PM", price: "Rp150.000", status: "available" },
        ],
    },
];

export default function BookingSection() {
    const [openId, setOpenId] = useState<string>("01");

    return (
        <section className="bg-white overflow-x-clip" id="booking-content">
            <div className="mx-auto max-w px-6 pt-8 sm:px-10 sm:pt-12 lg:px-16 xl:px-24 xl:pt-10">
            <SectionDivider
                number="01"
                title="Lokasi Kami"
                subtitle="/01 bookingpage"
                theme="light"
            />
            </div>
            <div className="mx-auto max-w px-6 sm:px-10  lg:px-16 xl:px-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-16 mb-16">
                    <div className="lg:col-span-3">
                        <div className="flex items-center gap-3">
                            <div className="size-[17px] rounded-[5px] bg-accent-red flex-shrink-0" />
                            <span className="font-bdo font-normal text-[1.5rem] text-black">
                                Reservasi Lewat Website
                            </span>
                        </div>
                    </div>
                    <div className="lg:col-span-9">
                        <h2
                            className="font-bdo font-medium text-[clamp(2rem,3.5vw,3rem)] text-black leading-[1.15]"
                            style={{ letterSpacing: "-1.5px" }}
                        >
                            Booking fasilitas olahraga terbaik kami kapan saja,
                            langsung dari website.{" "}
                            <span style={{ color: "#ABABAB" }}>
                                Pilih jadwal, pilih fasilitas,
                            </span>{" "}
                            selesai dalam hitungan menit.
                        </h2>
                    </div>
                </div>

                <div className="flex flex-col w-full border-t border-gray-200">
                    {DUMMY_BOOKINGS.map((item) => (
                        <BookingListItem
                            key={item.id}
                            item={item}
                            isOpen={openId === item.id}
                            onToggle={() =>
                                setOpenId(openId === item.id ? "" : item.id)
                            }
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
