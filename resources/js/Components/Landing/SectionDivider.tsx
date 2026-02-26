interface SectionDividerProps {
    number: string; // e.g. "01", "02"
    title: string; // e.g. "Fasilitas"
    subtitle: string; // e.g. "01 homepage"
    theme?: "light" | "dark";
}

export default function SectionDivider({
    number,
    title,
    subtitle,
    theme = "light",
}: SectionDividerProps) {
    const isDark = theme === "dark";

    return (
        <div
            className={`mb-16 border-t pt-4 ${
                isDark ? "border-white/20" : "border-black"
            }`}
        >
            <div
                className={`flex items-center justify-between text-xs ${
                    isDark ? "text-white" : "text-black"
                }`}
            >
                <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full font-bdo font-light bg-red-600" />
                    ({number})
                </span>
                <span className="font-bdo font-medium">({title})</span>
                <span className="font-bdo font-medium">/{subtitle}</span>
            </div>
        </div>
    );
}
