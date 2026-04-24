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
        <div className="flex items-center gap-6 xl:gap-8 py-6 border-b border-gray-200 w-full group cursor-pointer transition-colors hover:bg-gray-50 -mx-4 px-4 xl:-mx-8 xl:px-8">
            <div className="relative w-[240px] xl:w-[320px] aspect-[16/9] rounded-xl overflow-hidden flex-shrink-0">
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

            <div className="flex-grow">
                <span className="font-bdo font-light text-[clamp(1.5rem,2vw,2rem)] text-black">
                    {item.title}
                </span>
            </div>

            <span className="font-bdo font-medium text-sm text-gray-400 whitespace-nowrap">
                {item.code}
            </span>
        </div>
    );
}
