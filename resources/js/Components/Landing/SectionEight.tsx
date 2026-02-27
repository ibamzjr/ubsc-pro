export default function SectionEight() {
    return (
        <section id="map" className="w-full bg-gray-50 pt-12 pb-12">
            <div className="mx-auto w-full px-6 sm:px-10 lg:px-24">
                <div className="grid h-[360px] grid-cols-1 items-stretch gap-6 lg:h-[450px] lg:grid-cols-12">
                    <div className="group relative w-full overflow-hidden rounded-3xl lg:col-span-4">
                        <img
                            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80"
                            alt="UB Sport Center gym"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            draggable={false}
                        />

                        <div className="absolute inset-0 bg-black/55" />

                        <div className="absolute inset-0 flex flex-col justify-start p-8">
                            <h2 className="font-monument text-3xl font-bold leading-tight tracking-tight text-white lg:text-4xl">
                                Lokasi Kami
                            </h2>
                            <p className="mt-2 font-clash text-sm font-medium text-gray-300">
                                Malang, Jawa Timur
                            </p>
                        </div>
                    </div>

                    <div className="relative w-full overflow-hidden rounded-3xl bg-gray-200 lg:col-span-8">
                        {/*
                         * TODO: Replace with Google Maps JS API or Mapbox for:
                         *   - Multiple custom red-pin markers (UB Sport Center locations)
                         */}
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.4233043091886!2d112.61591407573144!3d-7.955131992069455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7882788af472d9%3A0x12f8cee690772ec5!2sSport%20Center%20UB!5e0!3m2!1sid!2sid!4v1772111126107!5m2!1sid!2sid"
                            className="absolute inset-0 h-full w-full border-0"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="UB Sport Center — Lokasi"
                            // Temporary dark-mode approximation via CSS filter.
                            // Remove once replaced with a proper styled-map solution.
                            // style={{
                            //     filter: "grayscale(10%) invert(9%) contrast(83%) hue-rotate(180deg)",
                            // }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
