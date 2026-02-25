import { Link } from "@inertiajs/react";
import { ArrowUpRight } from "lucide-react";
import FacilityBadge from "@/Components/Landing/FacilityBadge";

export interface Facility {
    id: string;         
    name: string;       
    location: string;   
    category: string; 
    bgImage: string;
    href: string;
    slug?: string;      
}

interface FacilityRowProps {
    facility: Facility;
}

export default function FacilityRow({ facility }: FacilityRowProps) {
    return (
        <Link
            href={facility.href}
            className="group relative block w-full overflow-hidden text-white transition-all duration-300 hover:brightness-110"
            style={{ height: "clamp(96px, 14vw, 160px)" }}
        >
            <img
                src={facility.bgImage}
                alt={facility.name}
                className="absolute inset-0 z-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                draggable={false}
            />

            <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />

            <div className="relative z-20 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-8">

                <span className="hidden w-36 flex-shrink-0 text-xs font-medium tracking-widest text-white/70 sm:block">
                    /Tertutup {facility.id}/
                </span>

                <div className="hidden flex-shrink-0 md:block">
                    <FacilityBadge
                        location={facility.location}
                        category={facility.category}
                    />
                </div>

                <span className="ml-0 flex-1 truncate text-2xl font-bold tracking-tight sm:ml-6 sm:text-3xl md:ml-10 md:text-4xl lg:text-5xl">
                    /{facility.name}.
                </span>

                <div className="ml-4 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-red-600 transition-transform duration-300 group-hover:translate-x-1 sm:h-11 sm:w-11 md:h-12 md:w-12">
                    <ArrowUpRight size={16} className="sm:hidden" />
                    <ArrowUpRight size={20} className="hidden sm:block" />
                </div>

            </div>
        </Link>
    );
}
