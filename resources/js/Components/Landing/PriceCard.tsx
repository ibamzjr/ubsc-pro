import { Star } from "lucide-react";

export interface PriceItem {
    id: string | number;
    image: string;
    title: string;
    price: string;
    rating?: number; // 1–5, default 5
}

interface PriceCardProps {
    item: PriceItem;
}

export default function PriceCard({ item }: PriceCardProps) {
    const rating = item.rating ?? 5;
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    return (
        <div className="flex cursor-pointer items-center gap-4 rounded-2xl bg-gray-100 p-3 transition-colors duration-200 hover:bg-gray-200 md:gap-6 md:p-4">
            <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-xl md:h-20 md:w-32">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                        draggable={false}
                    />
                ) : (
                    <div className="h-full w-full bg-gray-300" />
                )}
            </div>

            <div className="flex flex-1 flex-col">
                <span className="text-lg font-bold text-gray-900 md:text-xl">
                    {item.title}
                </span>
                <span className="mt-1 text-sm text-gray-600">{item.price}</span>
            </div>

            <div className="flex flex-shrink-0 items-center gap-0.5 pr-1 md:gap-1">
                {Array.from({ length: 5 }).map((_, i) => {
                    const filled = i < fullStars;
                    const half = !filled && i === fullStars && hasHalf;
                    return (
                        <Star
                            key={i}
                            size={16}
                            strokeWidth={1.5}
                            className={
                                filled || half
                                    ? "text-orange-400"
                                    : "text-gray-300"
                            }
                            fill={filled ? "currentColor" : "none"}
                            style={
                                half
                                    ? {
                                          fill: "url(#half-fill)",
                                          color: "#fb923c",
                                      }
                                    : undefined
                            }
                        />
                    );
                })}
                <svg width="0" height="0" className="absolute">
                    <defs>
                        <linearGradient
                            id="half-fill"
                            x1="0"
                            x2="1"
                            y1="0"
                            y2="0"
                        >
                            <stop offset="50%" stopColor="#fb923c" />
                            <stop offset="50%" stopColor="transparent" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>
    );
}
