import { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

export interface ReelItem {
    id: string | number;
    thumbnail: string;
    title: string; // e.g. "SPORT CENTER UB."
    subtitle?: string; // e.g. "Kegiatan Latihan Arema FC Yang Berlangsung di"
    date: string; // e.g. "15/12 2025"
    videoUrl?: string; // real video src — place file in public/reels/
    isActive?: boolean;
}

interface ReelCardProps {
    item: ReelItem;
    /** When true, renders larger as the highlighted "featured" first card */
    featured?: boolean;
}

export default function ReelCard({ item, featured = false }: ReelCardProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [playing, setPlaying] = useState(false);

    const togglePlay = () => {
        const vid = videoRef.current;
        if (!vid) return;
        if (playing) {
            vid.pause();
            setPlaying(false);
        } else {
            vid.play();
            setPlaying(true);
        }
    };

    // Split trailing dot so we can colour it red
    const titleBody = item.title.endsWith(".")
        ? item.title.slice(0, -1)
        : item.title;
    const hasDot = item.title.endsWith(".");

    return (
        <div
            className={[
                "group relative flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-neutral-800",
                featured
                    ? "aspect-[9/16] w-[260px] self-stretch sm:w-[340px] lg:w-[380px]"
                    : "aspect-[9/16] w-[200px] sm:w-[230px] lg:w-[320px]",
            ].join(" ")}
            onClick={item.videoUrl ? togglePlay : undefined}
        >
            {item.videoUrl ? (
                <video
                    ref={videoRef}
                    src={item.videoUrl}
                    poster={item.thumbnail}
                    playsInline
                    loop
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onEnded={() => setPlaying(false)}
                />
            ) : (
                <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    draggable={false}
                />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/20" />

            <span className="absolute left-4 top-4 text-[10px] text-gray-300">
                {item.date}
            </span>

            <div className="absolute right-4 top-4 flex h-4 w-8 items-center justify-center rounded-sm bg-white/20">
                <span className="font-monument text-[7px] font-black leading-none text-white">
                    UB
                </span>
            </div>

            <div
                className={[
                    "absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all duration-300",
                    playing
                        ? "opacity-0 group-hover:scale-110 group-hover:opacity-100"
                        : "opacity-100 group-hover:scale-110",
                ].join(" ")}
            >
                {playing ? (
                    <Pause size={18} fill="white" />
                ) : (
                    <Play size={18} fill="white" className="ml-0.5" />
                )}
            </div>

            <div className="absolute bottom-4 left-4 right-4">
                {item.subtitle && (
                    <p className="mb-1 text-xs leading-snug text-gray-300">
                        {item.subtitle}
                    </p>
                )}
                <p
                    className={[
                        "font-black leading-none tracking-tighter text-white",
                        featured ? "text-4xl" : "text-2xl",
                    ].join(" ")}
                >
                    {titleBody}
                    {hasDot && <span className="text-red-600">.</span>}
                </p>
            </div>
        </div>
    );
}
