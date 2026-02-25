interface SectionDividerProps {
    number: string;  // e.g. "01", "02"
    title: string;   // e.g. "Fasilitas"
    subtitle: string; // e.g. "01 homepage"
}

export default function SectionDivider({
    number,
    title,
    subtitle,
}: SectionDividerProps) {
    return (
        <div className="mb-16 border-t border-black pt-4">
            <div className="flex items-center justify-between text-xs font-medium text-gray-600">
                <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                    ({number})
                </span>
                <span>({title})</span>
                <span>/{subtitle}</span>
            </div>
        </div>
    );
}
