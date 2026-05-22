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
        <div className="flex flex-row items-start py-2 border-b border-white/10 w-full group cursor-pointer transition-colors hover:bg-white/5">
            {/* Image — portrait on mobile (3:4), widescreen on desktop (16:9) */}
            <div className="relative w-[82px] aspect-[3/4] xl:w-[280px] xl:aspect-[16/9] rounded-sm overflow-hidden flex-shrink-0">
                <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
            </div>

            {/* Content column — min-h matches portrait image height (82px × 4/3 ≈ 110px) */}
            <div className="flex-grow flex flex-col justify-between pt-3 xl:py-0 pl-4 min-h-[110px] xl:min-h-0">
                {/* Top row: Title & Code */}
                <div className="flex justify-between items-start w-full gap-2">
                    <span className="font-bdo font-normal text-white tracking-tighter text-base xl:text-[clamp(2rem,3.5vw,2.5rem)] leading-tight">
                        {item.title}
                    </span>
                    <span className="font-bdo font-medium text-xs xl:text-lg text-gray-400 whitespace-nowrap flex-shrink-0 pt-1">
                        /{item.code}/
                    </span>
                </div>

                {/* Bottom row: Badge */}
                <div className="mt-auto pt-3">
                    <FacilityBadge
                        location={item.badgeLocation}
                        category={item.badgeType}
                    />
                </div>
            </div>
        </div>
    );
}
