import FacilityBadge from "@/Components/Landing/FacilityBadge";

export interface FacilityItem {
    id: string;
    title: string;
    code: string;
    image: string;
    badgeLocation: string;
    badgeType: string;
}

interface Props {
    item: FacilityItem;
}

export default function FacilityListItem({ item }: Props) {
    return (
        <div className="flex flex-col xl:flex-row xl:items-center gap-4 xl:gap-8 py-6 border-b border-white/10 w-full group cursor-pointer transition-colors hover:bg-white/5">

            {/* Image — full width on mobile, fixed on desktop */}
            <div className="relative w-full xl:w-[280px] aspect-video xl:aspect-[16/9] rounded-xl overflow-hidden flex-shrink-0">
                <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-4 left-4">
                    <FacilityBadge
                        location={item.badgeLocation}
                        category={item.badgeType}
                    />
                </div>
            </div>

            {/* Title */}
            <div className="flex-grow">
                <span
                    className="font-bdo font-normal text-white tracking-tighter"
                    style={{ fontSize: "clamp(2rem, 3.5vw, 2.5rem)" }}
                >
                    {item.title}
                </span>
            </div>

            {/* Status code */}
            <span className="font-bdo font-medium text-sm text-gray-400 whitespace-nowrap">
                {item.code}
            </span>
        </div>
    );
}
