import { ArrowUpRight, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_TOKENS } from "./tokens";

export interface IdentityQueueItem {
    id: number;
    name: string;
    identityNumber: string;
    category: "Mahasiswa" | "Dosen" | "Staf" | "Umum";
    submittedAt: string;
    progress: number;
}

interface IdentityQueueCardProps {
    items?: IdentityQueueItem[];
    title?: string;
    countLabel?: string;
}

const PLACEHOLDER_ITEMS: IdentityQueueItem[] = [
    {
        id: 1,
        name: "—",
        identityNumber: "—",
        category: "Mahasiswa",
        submittedAt: "—",
        progress: 0,
    },
    {
        id: 2,
        name: "—",
        identityNumber: "—",
        category: "Dosen",
        submittedAt: "—",
        progress: 0,
    },
    {
        id: 3,
        name: "—",
        identityNumber: "—",
        category: "Staf",
        submittedAt: "—",
        progress: 0,
    },
];

const CATEGORY_TONE: Record<IdentityQueueItem["category"], string> = {
    Mahasiswa: "bg-rose-50 text-rose-600",
    Dosen: "bg-blue-50 text-blue-600",
    Staf: "bg-purple-50 text-purple-600",
    Umum: "bg-gray-100 text-gray-600",
};

export default function IdentityQueueCard({
    items = PLACEHOLDER_ITEMS,
    title = "Identity Queue",
    countLabel,
}: IdentityQueueCardProps) {
    const count = countLabel ?? `${items.length} pending`;

    return (
        <div className={`p-5 ${ADMIN_TOKENS.CARD_LARGE}`}>
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gray-900 text-white">
                        <ListChecks size={16} />
                    </div>
                    <span className="font-clash text-sm font-medium text-gray-900">
                        {title}
                    </span>
                </div>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-600">
                    {count}
                </span>
            </div>

            <ul className="mt-4 flex flex-col gap-3">
                {items.map((item) => (
                    <li
                        key={item.id}
                        className="group flex items-center gap-4 rounded-2xl bg-gray-50 p-4 transition-colors hover:bg-gray-100/80"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white font-clash text-sm font-medium text-gray-700 shadow-[0_4px_12px_rgb(0,0,0,0.04)]">
                            {item.name === "—"
                                ? "··"
                                : item.name
                                      .split(" ")
                                      .map((part) => part[0])
                                      .filter(Boolean)
                                      .slice(0, 2)
                                      .join("")
                                      .toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <p className="truncate font-clash text-sm font-medium text-gray-900">
                                    {item.name}
                                </p>
                                <span
                                    className={cn(
                                        "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                                        CATEGORY_TONE[item.category],
                                    )}
                                >
                                    {item.category}
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                {item.identityNumber} · submitted{" "}
                                {item.submittedAt}
                            </p>
                            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-200">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-orange-400 to-rose-500"
                                    style={{
                                        width: `${Math.max(8, item.progress)}%`,
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            disabled
                            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-gray-400 shadow-[0_4px_12px_rgb(0,0,0,0.04)] transition-colors group-hover:text-gray-700 disabled:cursor-not-allowed"
                            aria-label="Open queue item"
                        >
                            <ArrowUpRight size={14} />
                        </button>
                    </li>
                ))}
            </ul>

            <p className="mt-4 text-[11px] text-gray-400">
                Live verification queue ships in PHASE 5.
            </p>
        </div>
    );
}
