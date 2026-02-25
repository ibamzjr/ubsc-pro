import GymTrafficBadge from "@/Components/Landing/GymTrafficBadge";
import HeroBottomBar from "@/Components/Landing/HeroBottomBar";
import HeroContent from "@/Components/Landing/HeroContent";
import HeroTitle from "@/Components/Landing/HeroTitle";

export default function Hero() {
    return (
        <>
            <section
                id="home"
                className="relative flex h-screen flex-col overflow-hidden bg-[#0B1E3B]"
            >
                <div
                    className="pointer-events-none absolute left-0 right-0 top-0 z-0 h-1/2"
                    style={{
                        backgroundImage: `url('/assets/hero/Top.png')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                />

                <div
                    className="pointer-events-none absolute bottom-0 left-0 right-0 z-0 h-1/2"
                    style={{
                        backgroundImage: `url('/assets/hero/Bottom.png')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                />

                <div className="relative z-10 flex h-full flex-col px-8 pt-28 lg:px-16 lg:pt-32">
                    <div className="flex flex-1 items-end justify-between pb-8 lg:pb-32">
                        <div className="">
                            <GymTrafficBadge />
                        </div>

                        <div className="hidden lg:block">
                            <HeroContent />
                        </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-end pb-16 lg:pb-14">
                        <HeroTitle />
                    </div>

                    <div className="absolute bottom-14 right-12 hidden lg:right-16 lg:block xl:bottom-12 xl:right-16">
                        <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-white shadow-xl">
                            <img
                                src="/BMU.svg"
                                alt="Brawijaya Multi Usaha"
                                className="h-full w-full object-contain"
                            />
                        </div>
                    </div>

                    <div className="mt-8 lg:hidden">
                        <HeroContent />
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10" />
            </section>
            <HeroBottomBar />
        </>
    );
}
