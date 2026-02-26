import gym from "../../../assets/hero/gym.svg";

interface GymTrafficBadgeProps {
    variant?: "default" | "reversed";
}

export default function GymTrafficBadge({
    variant = "default",
}: GymTrafficBadgeProps) {
    if (variant === "reversed") {
        return (
            <div className="flex items-stretch overflow-hidden rounded-lg">
                <div className="flex items-center bg-red-600 lg:px-12 lg:py-8">
                    <span className="font-clash text-sm lg:text-xl font-bold text-white">
                        High Occupancy
                    </span>
                </div>
                <div className="flex items-center gap-2 bg-gray-200 lg:px-12 lg:py-3">
                    <img
                        src={gym}
                        alt="Gym Traffic"
                        className="h-4 w-4 opacity-70"
                    />
                    <span className="font-clash lg:text-xl font-medium text-black">
                        Gym Traffic
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-stretch overflow-hidden rounded-lg border border-black">
            <div className="flex items-center gap-2 bg-black px-5 py-4 lg:px-10 lg:py-3">
                <img
                    src={gym}
                    alt="Gym Traffic"
                    className="h-4 w-4 text-white/70"
                />
                <span className="font-bdo text-sm lg:text-xl font-medium text-white/90">
                    Gym Traffic
                </span>
            </div>
            <div className="flex items-center bg-accent-red px-8 py-4 lg:px-10 lg:py-5 rounded-lg">
                <span className="font-clash text-sm lg:text-xl font-bold text-white">
                    High Occupancy
                </span>
            </div>
        </div>
    );
}
