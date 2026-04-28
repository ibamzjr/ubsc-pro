import { Head, Link, router, usePage } from "@inertiajs/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import {
    ChevronDown,
    ChevronRight,
    FolderOpen,
    Pencil,
    Plus,
    Trash2,
} from "lucide-react";
import { useState } from "react";
import { ActiveBadge } from "@/Components/Admin/StatusBadge";
import DataTable from "@/Components/Admin/DataTable";
import { ADMIN_TOKENS } from "@/Components/Admin/tokens";
import AdminLayout from "@/Layouts/AdminLayout";
import type { FacilityCategory, FacilityItem, PageProps } from "@/types";

type Props = PageProps<{
    facilities: FacilityItem[];
    categories: (FacilityCategory & { facilities_count: number })[];
}>;

const helper = createColumnHelper<FacilityItem>();

function FacilityRowActions({ facility }: { facility: FacilityItem }) {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = () => {
        if (!confirm(`Delete "${facility.name}"? This cannot be undone.`)) return;
        setDeleting(true);
        router.delete(route("admin.facilities.destroy", facility.id), {
            onFinish: () => setDeleting(false),
        });
    };

    return (
        <div className="flex items-center gap-1.5">
            <Link
                href={route("admin.facilities.edit", facility.id)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                title="Edit"
            >
                <Pencil size={13} />
            </Link>
            <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-400 transition-colors hover:bg-rose-100 hover:text-rose-600 disabled:opacity-40"
                title="Delete"
            >
                <Trash2 size={13} />
            </button>
        </div>
    );
}

const columns = [
    helper.accessor("name", {
        header: "Facility",
        enableSorting: true,
        cell: (info) => {
            const f = info.row.original;
            return (
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 font-clash text-sm font-medium text-white">
                        {f.name[0]}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{f.name}</p>
                        <p className="text-[11px] text-gray-400">{f.slug}</p>
                    </div>
                </div>
            );
        },
    }),
    helper.accessor("category", {
        header: "Category",
        cell: (info) => (
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                {info.getValue()?.name ?? "—"}
            </span>
        ),
    }),
    helper.accessor("is_active", {
        header: "Status",
        cell: (info) => <ActiveBadge active={info.getValue()} />,
    }),
    helper.accessor("prices_count", {
        header: "Prices",
        enableSorting: true,
        cell: (info) => (
            <span className="text-sm text-gray-600">{info.getValue()}</span>
        ),
    }),
    helper.accessor("sort_order", {
        header: "Order",
        enableSorting: true,
        cell: (info) => (
            <span className="font-mono text-xs text-gray-500">
                {info.getValue()}
            </span>
        ),
    }),
    helper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <FacilityRowActions facility={row.original} />,
    }),
];

function CategoriesPanel({
    categories,
}: {
    categories: (FacilityCategory & { facilities_count: number })[];
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className={`${ADMIN_TOKENS.CARD_LARGE} overflow-hidden`}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between p-5 text-left"
            >
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gray-900 text-white">
                        <FolderOpen size={15} />
                    </div>
                    <span className="font-clash text-sm font-medium text-gray-900">
                        Facility Categories
                    </span>
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                        {categories.length}
                    </span>
                </div>
                {open ? (
                    <ChevronDown size={16} className="text-gray-400" />
                ) : (
                    <ChevronRight size={16} className="text-gray-400" />
                )}
            </button>

            {open && (
                <div className="border-t border-gray-100 p-5">
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
                        {categories.map((cat) => (
                            <div
                                key={cat.id}
                                className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3"
                            >
                                <div>
                                    <p className="font-clash text-sm font-medium text-gray-900">
                                        {cat.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {cat.facilities_count} facilities ·{" "}
                                        {cat.slug}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function FacilitiesIndex() {
    const { facilities, categories } = usePage<Props>().props;

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4">
                    <span className="font-clash text-xs uppercase tracking-[0.2em] text-gray-400">
                        Facility Management
                    </span>
                    <h1 className="font-monument text-3xl font-normal tracking-tight text-gray-900">
                        Facilities
                    </h1>
                </div>
            }
        >
            <Head title="Facilities" />

            <div className="flex flex-col gap-5 pt-6">
                <CategoriesPanel categories={categories} />

                <DataTable
                    columns={columns as ColumnDef<FacilityItem, unknown>[]}
                    data={facilities}
                    searchColumn="name"
                    searchPlaceholder="Search facilities…"
                    emptyMessage="No facilities yet. Create one above."
                    toolbar={
                        <Link
                            href={route("admin.facilities.create")}
                            className="flex items-center gap-2 rounded-2xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                        >
                            <Plus size={15} />
                            New Facility
                        </Link>
                    }
                />
            </div>
        </AdminLayout>
    );
}
