import gym from "../../../assets/hero/gym.svg";

interface GymTrafficBadgeProps {
    variant?: "default" | "reversed";
}

export default function GymTrafficBadge({
    variant = "default",
}: GymTrafficBadgeProps) {
    if (variant === "reversed") {
        return (
            <div className="flex items-stretch overflow-hidden rounded-lg mt-5 xl:mt-0">
                <div className="flex items-center bg-red-600 px-8 py-4 md:px-8 md:py-5 xl:px-12 xl:py-8">
                    <span className="font-clash text-sm xl:text-xl font-bold text-white">
                        High Occupancy
                    </span>
                </div>
                <div className="flex items-center gap-2 bg-gray-200 px-5 py-4 md:px-8 md:py-5 xl:px-12 xl:py-3">
                    <img
                        src={gym}
                        alt="Gym Traffic"
                        className="h-4 w-4 opacity-70"
                    />
                    <span className="font-clash xl:text-xl font-medium text-black">
                        Gym Traffic
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="inline-flex items-stretch overflow-hidden rounded-lg border-4 border-black mt-16 xl:mt-0">
            <div className="flex items-center gap-2 bg-black px-5 py-3 md:px-8 md:py-5 xl:px-10 xl:py-5">
                <img
                    src={gym}
                    alt="Gym Traffic"
                    className="h-4 w-4 text-white/70"
                />
                <span className="font-bdo text-sm xl:text-xl font-medium text-white/90">
                    Gym Traffic
                </span>
            </div>
            <div className="flex items-center bg-accent-red px-8 py-3 md:px-8 md:py-5 xl:px-10 xl:py-3">
                <span className="font-clash text-sm xl:text-xl font-bold text-white">
                    High Occupancy
                </span>
            </div>
        </div>
    );
}
