import { useRef, useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";

export interface ReelItem {
    id: string | number;
    thumbnail?: string;
    title: string;
    subtitle?: string;
    date: string;
    videoUrl?: string;
    isActive?: boolean;
}

interface ReelCardProps {
    item: ReelItem;
    featured?: boolean;
    isActive?: boolean;
}

export default function ReelCard({
    item,
    featured = false,
    isActive,
}: ReelCardProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [playing, setPlaying] = useState(false);
    const [thumbUrl, setThumbUrl] = useState<string | undefined>(
        item.thumbnail,
    );

    const togglePlay = () => {
        const vid = videoRef.current;
        if (!vid) return;
        if (playing) {
            vid.pause();
            setPlaying(false);
        } else {
            vid.play();
            setPlaying(true);
            vid.muted = false;
            vid.volume = 1;
        }
    };

    // Generate thumbnail from video if missing
    useEffect(() => {
        if (!item.thumbnail && item.videoUrl) {
            const vid = document.createElement("video");
            vid.src = item.videoUrl;
            vid.currentTime = 0;
            vid.muted = true;
            vid.playsInline = true;
            vid.addEventListener("loadeddata", () => {
                const canvas = document.createElement("canvas");
                canvas.width = vid.videoWidth;
                canvas.height = vid.videoHeight;
                canvas
                    .getContext("2d")
                    ?.drawImage(vid, 0, 0, canvas.width, canvas.height);
                setThumbUrl(canvas.toDataURL("image/png"));
            });
        }
    }, [item.thumbnail, item.videoUrl]);

    // Split trailing dot so we can colour it red
    const titleBody = item.title.endsWith(".")
        ? item.title.slice(0, -1)
        : item.title;
    const hasDot = item.title.endsWith(".");

    return (
        <div
            className={[
                "group relative flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-neutral-800",
                featured || isActive
                    ? "aspect-[9/16] w-[260px] self-stretch sm:w-[340px] lg:w-[380px]"
                    : "aspect-[9/16] w-[200px] sm:w-[230px] lg:w-[320px]",
            ].join(" ")}
            onClick={item.videoUrl ? togglePlay : undefined}
        >
            {item.videoUrl ? (
                <video
                    ref={videoRef}
                    src={item.videoUrl}
                    poster={thumbUrl}
                    playsInline
                    loop
                    controls={false}
                    muted={false}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onEnded={() => setPlaying(false)}
                />
            ) : (
                <img
                    src={thumbUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    draggable={false}
                />
            )}

            {/* <div className="absolute right-4 top-4 flex h-4 w-8 items-center justify-center rounded-sm bg-white/20">
                <span className="font-monument text-[7px] font-black leading-none text-white">
                    UB
                </span>
            </div> */}

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

            {/* <div className="absolute bottom-4 left-4 right-4">
                {item.subtitle && (
                    <p className="mb-1 text-xs leading-snug text-gray-300">
                        {item.subtitle}
                    </p>
                )}
                <p
                    className={["font-black leading-none tracking-tighter text-white", featured ? "text-4xl" : "text-2xl"].join(" ")}
                >
                    {titleBody}
                    {hasDot && <span className="text-red-600">.</span>}
                </p>
            </div> */}
        </div>
    );
}
