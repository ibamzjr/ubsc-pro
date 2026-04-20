import TopBg from "@/../assets/hero/Top.png";
import RightBg from "@/../assets/images/bg-heroabout.avif";
import HeroBottomBar from "@/Components/Landing/HeroBottomBar";

export default function AboutHero() {
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
            </div>

           
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 top-[45vh] xl:top-[63vh]">
                <div className="absolute inset-0 bg-black" />

                <img
                    src={RightBg}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 h-full w-full object-cover object-center xl:hidden"
                />
                <div className="absolute inset-0 bg-black/45 xl:hidden" />

                <div className="absolute inset-y-0 right-0 hidden w-2/3 xl:block">
                    <img
                        src={RightBg}
                        alt=""
                        aria-hidden
                        className="h-full w-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-black/35" />
                </div>
            </div>

          
            <section className="relative flex min-h-screen flex-col" id="about-hero">

              
                <div className="h-[45vh] flex-shrink-0 xl:h-[63vh]" />

               
                <div className="relative flex flex-1 flex-col xl:flex-row">

                    <div className="flex flex-col justify-center bg-black px-8 py-10 xl:basis-1/3 xl:bg-transparent xl:px-14 xl:py-0">
                        <div className="pointer-events-none mb-3 xl:mb-6">
                            <img
                                src="/assets/hero/star.png"
                                alt=""
                                aria-hidden
                                className="h-12 w-12 object-contain opacity-90 xl:h-20 xl:w-20"
                            />
                        </div>

                        <h1 className="font-bdo font-medium text-[clamp(2rem,4vw,3.25rem)] leading-tight text-white">
                            Tentang Kami
                        </h1>
                    </div>

                   
                    <div className="flex flex-1 items-center xl:basis-2/3">
                        <p className="relative z-10 ml-auto w-full px-8 py-10 text-right font-bdo font-light text-[clamp(0.9rem,1.5vw,1.3rem)] leading-relaxed text-white/80 xl:max-w-md xl:py-0 xl:pr-16">
                            Welcome to the UB Sport where people work on{" "}
                            <span className="font-medium text-white">strength body</span>{" "}
                            where people on{" "}
                            <span className="font-medium text-white">
                                strengthening body
                            </span>
                            .
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10" />
            </section>

           
            <HeroBottomBar
                variant="transparent"
                sectionNumber="02/"
                sectionLabel="aboutuspage"
                description="Pelajari sejarah, visi, dan perkembangan UB Sport Center — pusat olahraga terkemuka di Malang."
                targetId="about-history"
                showVideo={false}
            />
        </div>
    );
}
