import { Link } from "@inertiajs/react";
import { ArrowUpRight, MapPin } from "lucide-react";

export interface ArenaItem {
    id: string;       // e.g. "/Terbuka 001/"
    title: string;    // e.g. "/Sepak Bola"
    location: string;
    category: string;
    image: string;
    href: string;
    slug?: string;
}

interface ArenaCardProps {
    item: ArenaItem;
}

export default function ArenaCard({ item }: ArenaCardProps) {
    return (
        <Link
            href={item.href}
            className="group flex w-full cursor-pointer flex-col overflow-hidden border-b border-neutral-700 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
        >
            <div className="relative h-[220px] w-full overflow-hidden md:h-[260px]">
                <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    draggable={false}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <span className="absolute left-4 top-4 z-10 text-xs font-medium tracking-widest text-white/80">
                    {item.id}
                </span>

                <div className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-red-600 transition-transform duration-300 group-hover:scale-110">
                    <ArrowUpRight size={16} className="text-white" />
                </div>

                <div className="absolute bottom-4 left-4 z-10 flex overflow-hidden rounded-md text-[10px] font-semibold md:text-xs">
                    <span className="flex items-center gap-1 bg-black px-2.5 py-1.5 text-white">
                        <MapPin size={9} className="flex-shrink-0 opacity-75" />
                        {item.location}
                    </span>
                    <span className="flex items-center bg-red-600 px-2.5 py-1.5 text-white">
                        {item.category}
                    </span>
                </div>
            </div>

            <div className="flex items-center bg-neutral-800 p-5">
                <span className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                    {item.title}
                </span>
            </div>
        </Link>
    );
}
