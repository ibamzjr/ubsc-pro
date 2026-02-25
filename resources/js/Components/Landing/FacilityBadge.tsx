import { MapPin } from "lucide-react";


interface FacilityBadgeProps {
    location: string; 
    category: string; 
}

export default function FacilityBadge({
    location,
    category,
}: FacilityBadgeProps) {
    return (
        <div className="flex items-stretch overflow-hidden rounded-full text-xs font-medium">
            <div className="flex items-center gap-1.5 bg-black/75 px-3 py-1.5 text-white backdrop-blur-sm">
                <MapPin size={10} className="flex-shrink-0 opacity-70" />
                <span>{location}</span>
            </div>
            <div className="flex items-center bg-navy-800 px-3 py-1.5 text-white ring-1 ring-inset ring-white/10">
                <span>{category}</span>
            </div>
        </div>
    );
}
