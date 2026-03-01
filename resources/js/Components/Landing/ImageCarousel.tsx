import useEmblaCarousel from "embla-carousel-react";

export interface CarouselImage {
    id: string;
    src: string;
    alt: string;
}

interface ImageCarouselProps {
    images: CarouselImage[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
    const [emblaRef] = useEmblaCarousel({
        align: "start",
        dragFree: true,
        containScroll: "keepSnaps",
    });

    return (
        <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-5">
                {images.map((image) => (
                    <div
                        key={image.id}
                        // ~2.5 slides visible: 3rd peeks from right edge
                        className="w-[85%] flex-[0_0_auto] sm:w-[65%] md:w-[50%] lg:w-[42%] xl:w-[38%]"
                    >
                        <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-200">
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                draggable={false}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
