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
        <div className="flex items-stretch overflow-hidden rounded-md text-sm border-2 border-black font-medium">
            <div className="flex items-center gap-1.5 bg-black/75 px-2 py-1 lg:px-3 lg:py-2 font-bdo font-regular text-white text-xs lg:text-xl backdrop-blur-sm">
                <MapPin size={10} className="flex-shrink-0 opacity-70" />
                <span>{location}</span>
            </div>
            <div className="flex items-center font-clash font-semibold bg-gradient-to-r from-[#153359] to-[#15678D] text-xs px-2 py-1 lg:px-3 lg:py-2  lg:text-xl  text-white ring-1 ring-inset ring-white/10">
                <span>{category}</span>
            </div>
        </div>
    );
}
