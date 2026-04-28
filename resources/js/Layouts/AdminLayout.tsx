import { PropsWithChildren, ReactNode, useEffect, useState } from "react";
import Sidebar from "@/Components/Admin/Sidebar";
import Topbar from "@/Components/Admin/Topbar";

interface AdminLayoutProps {
    header?: ReactNode;
}

export default function AdminLayout({
    header,
    children,
}: PropsWithChildren<AdminLayoutProps>) {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setMobileSidebarOpen(false);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    useEffect(() => {
        if (mobileSidebarOpen) {
            document.body.classList.add("overflow-hidden", "xl:overflow-auto");
        } else {
            document.body.classList.remove(
                "overflow-hidden",
                "xl:overflow-auto",
            );
        }
        return () => {
            document.body.classList.remove(
                "overflow-hidden",
                "xl:overflow-auto",
            );
        };
    }, [mobileSidebarOpen]);

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-bdo text-gray-900">
            <div className="flex">
                <Sidebar
                    mobileOpen={mobileSidebarOpen}
                    onClose={() => setMobileSidebarOpen(false)}
                />

                <div className="flex min-h-screen min-w-0 flex-1 flex-col">
                    <Topbar
                        onMobileMenuClick={() => setMobileSidebarOpen(true)}
                    />

                    {header && (
                        <div className="px-4 pt-2 xl:px-8">{header}</div>
                    )}

                    <main className="flex-1 px-4 pb-10 pt-2 xl:px-8">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
