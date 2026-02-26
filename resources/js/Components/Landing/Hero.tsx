import GymTrafficBadge from "@/Components/Landing/GymTrafficBadge";
import HeroBottomBar from "@/Components/Landing/HeroBottomBar";
import HeroContent from "@/Components/Landing/HeroContent";
import HeroTitle from "@/Components/Landing/HeroTitle";

export default function Hero() {
    return (
        <>
            <section
                id="home"
                className="relative flex min-h-screen flex-col overflow-hidden bg-[#0B1E3B]"
            >
                <div
                    className="pointer-events-none absolute inset-0 z-0"
                    style={{
                        backgroundImage: `url('/assets/hero/Top.png')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                />

                <div className="relative z-10 hidden h-screen flex-col px-16 pt-32 lg:flex">
                    <div className="flex flex-1 items-end justify-between pb-32">
                        <GymTrafficBadge />
                        <HeroContent />
                    </div>

                    <div className="flex flex-col justify-end pb-14">
                        <HeroTitle />
                    </div>

                    <div className="absolute bottom-12 right-16">
                        <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-white shadow-xl">
                            <img
                                src="/BMU.svg"
                                alt="Brawijaya Multi Usaha"
                                className="h-full w-full object-contain"
                            />
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex h-screen flex-col px-8 pt-28 lg:hidden">
                    <div className="flex-shrink-0">
                        <GymTrafficBadge />
                    </div>

                    <div className="mt-8 flex-shrink-0">
                        <HeroContent />
                    </div>

                    <div className="flex flex-1 flex-col justify-end pb-10">
                        <div className="mb-6">
                            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-white shadow-xl">
                                <img
                                    src="/BMU.svg"
                                    alt="Brawijaya Multi Usaha"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                        </div>

                        <HeroTitle />
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10" />
            </section>

            <HeroBottomBar />
        </>
    );
}
