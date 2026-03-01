import {
    Map,
    MapMarker,
    MarkerContent,
    MarkerLabel,
    MarkerPopup,
} from "@/Components/Landing/map";
// import { Button } from "@/components/ui/button";
import { Star, Navigation, Clock, ExternalLink } from "lucide-react";

const places = [
    {
        id: 1,
        name: "Lapangan Sepak Bola Universitas Brawijaya",
        label: "Football Field",
        category: "Football Field",
        rating: 4.5,
        reviews: 54,
        hours: "06:00 AM - 10:00 PM",
        image: "https://images.unsplash.com/photo-1575223970966-76ae61ee7838?w=300&h=200&fit=crop",
        lng: 112.59151096357927,
        lat: -7.9691905411073645,
    },
    {
        id: 2,
        name: "UBSC Cabang Transmart",
        label: "Sport Facility",
        category: "Sport Facility",
        rating: 4.4,
        reviews: 1570,
        hours: "9:00 AM - 10:00 PM",
        image: "https://images.unsplash.com/photo-1496588152823-86ff7695e68f?w=300&h=200&fit=crop",
        lng: 112.61788923503353,
        lat: -7.956800793398481,
    },
    {
        id: 3,
        name: "UB Sports Center",
        label: "Sport Facility",
        category: "Sport Facility",
        rating: 4.4,
        reviews: 1189,
        hours: "6:00 AM - 10:00 PM",
        image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=300&h=200&fit=crop",
        lng: 112.61843891490952,
        lat: -7.955087591403217,
    },
];

export default function SectionEight() {
    return (
        <section id="map" className="w-full bg-gray-50 pt-12 pb-12">
            <div className="mx-auto w-full px-6 sm:px-10 xl:px-24">
                <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-12">
                    <div className="group relative h-[280px] w-full overflow-hidden rounded-3xl md:h-[320px] xl:col-span-4 xl:h-[450px]">
                        <img
                            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80"
                            alt="UB Sport Center gym"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            draggable={false}
                        />
                        <div className="absolute inset-0 bg-black/55" />
                        <div className="absolute inset-0 flex flex-col justify-start p-8">
                            <h2 className="font-monument text-3xl font-bold leading-tight tracking-tight text-white lg:text-4xl">
                                Lokasi Kami
                            </h2>
                            <p className="mt-2 font-clash text-sm font-medium text-gray-300">
                                Malang, Jawa Timur
                            </p>
                        </div>
                    </div>

                    <div className="relative h-[380px] w-full overflow-hidden rounded-3xl bg-gray-200 md:h-[450px] xl:col-span-8 xl:h-full">
                        <div className="absolute inset-0 h-full w-full">
                            <Map
                                center={[112.6206015734149, -7.967043987533171]}
                                zoom={13}
                                theme="light"
                            >
                                {places.map((place) => (
                                    <MapMarker
                                        key={place.id}
                                        longitude={place.lng}
                                        latitude={place.lat}
                                    >
                                        <MarkerContent>
                                            <div className="size-5 rounded-full bg-rose-500 border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform" />
                                            <MarkerLabel position="bottom">
                                                {place.label}
                                            </MarkerLabel>
                                        </MarkerContent>
                                        <MarkerPopup className="p-0 w-62">
                                            <div className="relative h-32 overflow-hidden rounded-t-md">
                                                <img
                                                    src={place.image}
                                                    alt={place.name}
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="space-y-2 p-3">
                                                <div>
                                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                        {place.category}
                                                    </span>
                                                    <h3 className="font-semibold text-foreground leading-tight">
                                                        {place.name}
                                                    </h3>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm">
                                                    <div className="flex items-center gap-1">
                                                        <Star className="size-3.5 fill-amber-400 text-amber-400" />
                                                        <span className="font-medium">
                                                            {place.rating}
                                                        </span>
                                                        <span className="text-muted-foreground">
                                                            (
                                                            {place.reviews.toLocaleString()}
                                                            )
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                                    <Clock className="size-3.5" />
                                                    <span>{place.hours}</span>
                                                </div>
                                                {/* <div className="flex gap-2 pt-1">
                                                    <button className="flex-1 h-8">
                                                        Directions
                                                    </button>
                                                    <button className="h-8">
                                                        <ExternalLink className="size-3.5" />
                                                    </button>
                                                </div> */}
                                            </div>
                                        </MarkerPopup>
                                    </MapMarker>
                                ))}
                            </Map>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
