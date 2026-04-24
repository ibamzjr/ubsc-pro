import HeroBottomBar from "@/Components/Landing/HeroBottomBar";
import TopBg from "@/../assets/hero/Top.png";
import RightBg from "@/../assets/images/bg-heropricing.avif";

export default function PricingHero() {
    return (
        <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute left-0 right-0 top-0 h-[45vh] overflow-hidden bg-black xl:h-[63vh]">
                <img
                    src={TopBg}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 h-full w-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
                <div className="absolute bottom-8 left-8 right-8 z-20 block lg:hidden">
                    <p className="font-bdo font-light text-[clamp(0.85rem,3.5vw,1rem)] leading-relaxed text-white/80">
                        Pilih jadwal dan paket terbaik Anda, lalu{" "}
                        <span className="font-medium text-white">
                            mulai perjalanan menuju tubuh yang lebih kuat dan bugar.
                        </span>
                    </p>
                </div>
            </div>

            <div className="pointer-events-none absolute bottom-0 left-0 right-0 top-[45vh] xl:top-[63vh]">
                <div className="absolute inset-0 bg-black" />
                <img
                    src={RightBg}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 h-full w-full object-cover xl:hidden"
                />
                <div className="absolute inset-0 bg-black/45 xl:hidden" />
                <div className="absolute inset-y-0 right-0 hidden w-2/3 xl:block">
                    <img
                        src={RightBg}
                        alt=""
                        aria-hidden
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/35" />
                </div>
            </div>

            <section className="relative flex min-h-screen flex-col" id="pricing-hero">
                <div className="h-[45vh] flex-shrink-0 xl:h-[63vh]" />

                <div className="relative flex flex-1 flex-col xl:flex-row">
                    <div className="hidden lg:flex flex-col justify-center bg-black px-8 py-10 xl:basis-1/3 xl:bg-transparent xl:px-14 xl:py-0">
                        <img
                            src="/assets/hero/star.png"
                            alt=""
                            aria-hidden
                            className="mb-6 h-12 w-12 xl:h-20 xl:w-20"
                        />
                        <h1 className="font-bdo font-medium text-[clamp(2rem,4vw,3.25rem)] text-white leading-tight">
                            Jadwal &amp; Paket Harga
                        </h1>
                    </div>

                    <div className="flex flex-1 items-center w-full lg:basis-2/3">
                        <p className="relative z-10 ml-auto w-full px-8 py-10 text-right font-bdo font-light text-[clamp(0.9rem,1.5vw,1.3rem)] leading-relaxed text-white/80 hidden lg:block xl:max-w-md xl:py-0 xl:pr-16">
                            Pilih jadwal dan paket terbaik Anda, lalu{" "}
                            <span className="font-medium text-white">
                                mulai perjalanan menuju tubuh yang lebih kuat dan bugar.
                            </span>
                        </p>
                        <div className="block lg:hidden px-8 py-10 w-full">
                            <img
                                src="/assets/hero/star.png"
                                alt=""
                                aria-hidden
                                className="mb-4 h-12 w-12"
                            />
                            <h1 className="font-bdo font-medium text-[clamp(2rem,8vw,3rem)] text-white leading-tight">
                                Jadwal &amp; Paket Harga
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10" />
            </section>

            <HeroBottomBar
                variant="transparent"
                sectionNumber="05/"
                sectionLabel="schedulepage"
                description="Pilih paket olahraga yang sesuai dengan kebutuhan dan anggaran Anda di UB Sport Center."
                targetId="pricing-info"
                showVideo={false}
            />
        </div>
    );
}
