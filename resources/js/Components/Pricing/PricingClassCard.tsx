import FacilityBadge from "@/Components/Landing/FacilityBadge";

interface ClassPriceItem {
    label: string;
}

export interface ClassPricing {
    id: string;
    title: string;
    description: string;
    image: string;
    badgeLocation: string;
    badgeType: string;
    daftarHarga: { left: ClassPriceItem[]; right: ClassPriceItem[] };
    persewaan: { left: ClassPriceItem[]; right: ClassPriceItem[] };
}

interface Props {
    item: ClassPricing;
}

export default function PricingClassCard({ item }: Props) {
    return (
        <div className="flex flex-col flex-shrink-0 w-[320px] xl:w-[380px] bg-black border border-white/10 overflow-hidden rounded-2xl">
            <div className="relative h-[220px] xl:h-[250px]">
                <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-between p-5 xl:p-6">
                    <div>
                        <p className="font-bdo font-medium text-[1.25rem] text-white leading-snug">
                            {item.title}
                        </p>
                        <p className="font-bdo font-normal text-[0.775rem] text-white/70 mt-1 leading-relaxed ">
                            {item.description}
                        </p>
                    </div>
                    <div>
                        <FacilityBadge
                            location={item.badgeLocation}
                            category={item.badgeType}
                        />
                    </div>
                </div>
            </div>

            <div className="p-5 xl:p-6">
                <p className="font-bdo font-medium text-[0.75rem] text-white/40 uppercase tracking-widest mb-4">
                    Daftar Harga
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div className="flex flex-col gap-2">
                        {item.daftarHarga.left.map((entry, i) => (
                            <span
                                key={i}
                                className="font-bdo font-normal text-[0.9375rem] text-white/80"
                            >
                                + {entry.label}
                            </span>
                        ))}
                    </div>
                    <div className="flex flex-col gap-2">
                        {item.daftarHarga.right.map((entry, i) => (
                            <span
                                key={i}
                                className="font-bdo font-normal text-[0.9375rem] text-white/80"
                            >
                                + {entry.label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-5 xl:p-6 border-t border-white/10">
                <p className="font-bdo font-medium text-[0.75rem] text-white/40 uppercase tracking-widest mb-4">
                    Persewaan
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div className="flex flex-col gap-2">
                        {item.persewaan.left.map((entry, i) => (
                            <span
                                key={i}
                                className="font-bdo font-normal text-[0.9375rem] text-white/80"
                            >
                                + {entry.label}
                            </span>
                        ))}
                    </div>
                    <div className="flex flex-col gap-2">
                        {item.persewaan.right.map((entry, i) => (
                            <span
                                key={i}
                                className="font-bdo font-normal text-[0.9375rem] text-white/80"
                            >
                                + {entry.label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
