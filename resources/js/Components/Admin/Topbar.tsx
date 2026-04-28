import { usePage } from "@inertiajs/react";
import { Bell, Menu, Search } from "lucide-react";
import { PageProps } from "@/types";
import { ADMIN_TOKENS } from "./tokens";

interface TopbarProps {
    onMobileMenuClick: () => void;
}

export default function Topbar({ onMobileMenuClick }: TopbarProps) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    const initials = (user?.name ?? "??")
        .split(" ")
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const handle = (user?.email ?? "").split("@")[0];

    return (
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 bg-[#F8F9FA] px-4 xl:px-8">
            <button
                type="button"
                onClick={onMobileMenuClick}
                className="rounded-xl p-2 text-gray-700 hover:bg-gray-100 xl:hidden"
                aria-label="Open sidebar"
            >
                <Menu size={20} />
            </button>

            <div className="ml-auto flex items-center gap-3">
                <div
                    className={`hidden h-10 items-center gap-2 px-4 md:flex ${ADMIN_TOKENS.CARD}`}
                >
                    <Search size={16} className="text-gray-400" />
                    <input
                        type="search"
                        placeholder="Search…"
                        className="w-44 border-0 bg-transparent p-0 text-sm font-medium text-gray-700 placeholder:text-gray-400 focus:ring-0"
                    />
                </div>

                <button
                    type="button"
                    className={`relative flex h-10 w-10 items-center justify-center text-gray-700 hover:text-gray-900 ${ADMIN_TOKENS.CARD}`}
                    aria-label="Notifications"
                >
                    <Bell size={18} />
                    <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500" />
                </button>

                <div
                    className={`flex h-10 items-center gap-3 px-3 ${ADMIN_TOKENS.CARD}`}
                >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-navy-800 to-navy-950 font-clash text-[11px] font-medium text-white">
                        {initials}
                    </div>
                    <div className="hidden flex-col leading-tight md:flex">
                        <span className="font-clash text-sm font-medium text-gray-900">
                            {user?.name ?? "Guest"}
                        </span>
                        <span className="text-[11px] text-gray-500">
                            @{handle || "guest"}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}
