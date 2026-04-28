import { Head, router, useForm, usePage } from "@inertiajs/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import DataTable from "@/Components/Admin/DataTable";
import { SingleDropzone } from "@/Components/Admin/ImageDropzone";
import { ActiveBadge } from "@/Components/Admin/StatusBadge";
import SlideOver from "@/Components/Admin/SlideOver";
import AdminLayout from "@/Layouts/AdminLayout";
import type { PageProps, SponsorItem } from "@/types";

type Props = PageProps<{ items: SponsorItem[] }>;

const helper = createColumnHelper<SponsorItem>();

const inputBase =
    "w-full rounded-2xl border-0 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-900 transition-colors";
const labelBase =
    "font-clash text-xs font-medium uppercase tracking-wider text-gray-500";

type FormData = {
    name: string;
    link_url: string;
    is_active: boolean;
    sort_order: number;
    logo: File | null;
    _method?: string;
};

function SponsorForm({
    item,
    onClose,
}: {
    item: SponsorItem | null;
    onClose: () => void;
}) {
    const isEdit = item !== null;

    const { data, setData, post, processing, errors } = useForm<FormData>({
        name: item?.name ?? "",
        link_url: item?.link_url ?? "",
        is_active: item?.is_active ?? true,
        sort_order: item?.sort_order ?? 0,
        logo: null,
        ...(isEdit ? { _method: "PUT" } : {}),
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEdit
            ? route("admin.sponsors.update", item!.id)
            : route("admin.sponsors.store");
        post(url, { forceFormData: true, onSuccess: onClose });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-5">
            <div>
                <label className={labelBase}>Name</label>
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    placeholder="Sponsor name…"
                    className={`${inputBase} mt-1.5`}
                />
                {errors.name && (
                    <p className="mt-1 text-xs text-rose-500">{errors.name}</p>
                )}
            </div>

            <div>
                <label className={labelBase}>Website URL</label>
                <input
                    type="text"
                    value={data.link_url}
                    onChange={(e) => setData("link_url", e.target.value)}
                    placeholder="https://…"
                    className={`${inputBase} mt-1.5`}
                />
                {errors.link_url && (
                    <p className="mt-1 text-xs text-rose-500">
                        {errors.link_url}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelBase}>Sort Order</label>
                    <input
                        type="number"
                        min={0}
                        value={data.sort_order}
                        onChange={(e) =>
                            setData("sort_order", Number(e.target.value))
                        }
                        className={`${inputBase} mt-1.5`}
                    />
                </div>
                <div className="flex flex-col justify-end pb-1">
                    <label className="flex cursor-pointer items-center gap-3">
                        <input
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(e) =>
                                setData("is_active", e.target.checked)
                            }
                            className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                        />
                        <span className={labelBase}>Active</span>
                    </label>
                </div>
            </div>

            <div>
                <label className={`${labelBase} mb-1.5 block`}>Logo</label>
                <SingleDropzone
                    label=""
                    currentUrl={item?.logo_url ?? null}
                    onFileSelect={(f) => setData("logo", f)}
                />
                {errors.logo && (
                    <p className="mt-1 text-xs text-rose-500">{errors.logo}</p>
                )}
            </div>

            <div className="flex items-center gap-3 pt-2">
                <button
                    type="submit"
                    disabled={processing}
                    className="flex-1 rounded-2xl bg-gray-900 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-60"
                >
                    {processing
                        ? "Saving…"
                        : isEdit
                          ? "Save Changes"
                          : "Add Sponsor"}
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-2xl px-5 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default function SponsorsIndex() {
    const { items } = usePage<Props>().props;
    const [slideOver, setSlideOver] = useState<{
        open: boolean;
        item: SponsorItem | null;
    }>({ open: false, item: null });

    const openNew = () => setSlideOver({ open: true, item: null });
    const openEdit = (item: SponsorItem) => setSlideOver({ open: true, item });
    const close = () => setSlideOver({ open: false, item: null });

    const handleDelete = (item: SponsorItem) => {
        if (!confirm(`Delete "${item.name}"?`)) return;
        router.delete(route("admin.sponsors.destroy", item.id));
    };

    const columns = [
        helper.accessor("logo_url", {
            header: "Logo",
            cell: (info) => {
                const url = info.getValue();
                return url ? (
                    <img
                        src={url}
                        alt=""
                        className="h-10 w-16 rounded-xl object-contain"
                    />
                ) : (
                    <div className="flex h-10 w-16 items-center justify-center rounded-xl bg-gray-100 text-[10px] text-gray-400">
                        No img
                    </div>
                );
            },
        }),
        helper.accessor("name", {
            header: "Name",
            enableSorting: true,
            cell: (info) => (
                <span className="font-medium text-sm text-gray-900">
                    {info.getValue()}
                </span>
            ),
        }),
        helper.accessor("link_url", {
            header: "Website",
            cell: (info) => {
                const url = info.getValue();
                return url ? (
                    <span className="max-w-[160px] truncate text-xs text-gray-500">
                        {url}
                    </span>
                ) : (
                    <span className="text-gray-400 italic text-xs">—</span>
                );
            },
        }),
        helper.accessor("is_active", {
            header: "Status",
            cell: (info) => <ActiveBadge active={info.getValue()} />,
        }),
        helper.accessor("sort_order", {
            header: "Order",
            enableSorting: true,
            cell: (info) => (
                <span className="text-xs text-gray-500">{info.getValue()}</span>
            ),
        }),
        helper.display({
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={() => openEdit(row.original)}
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                    >
                        <Pencil size={13} />
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDelete(row.original)}
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-400 transition-colors hover:bg-rose-100"
                    >
                        <Trash2 size={13} />
                    </button>
                </div>
            ),
        }),
    ];

    const active = items.filter((i) => i.is_active).length;

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4">
                    <span className="font-clash text-xs uppercase tracking-[0.2em] text-gray-400">
                        Content Management
                    </span>
                    <h1 className="font-monument text-3xl font-normal tracking-tight text-gray-900">
                        Sponsor Logos
                    </h1>
                </div>
            }
        >
            <Head title="Sponsor Logos" />

            <div className="flex flex-col gap-5 pt-6">
                <div className="flex items-center gap-3">
                    <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-200">
                        {active} active
                    </span>
                    <span className="text-sm text-gray-500">
                        {items.length} total
                    </span>
                </div>

                <DataTable
                    columns={columns as ColumnDef<SponsorItem, unknown>[]}
                    data={items}
                    searchColumn="name"
                    searchPlaceholder="Search sponsors…"
                    emptyMessage="No sponsors yet."
                    toolbar={
                        <button
                            type="button"
                            onClick={openNew}
                            className="flex items-center gap-2 rounded-2xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                        >
                            <Plus size={15} />
                            Add Sponsor
                        </button>
                    }
                />
            </div>

            <SlideOver
                isOpen={slideOver.open}
                onClose={close}
                title={slideOver.item ? "Edit Sponsor" : "Add Sponsor"}
                description={
                    slideOver.item
                        ? "Update sponsor details and logo."
                        : "Add a new sponsor to the marquee."
                }
            >
                {slideOver.open && (
                    <SponsorForm
                        key={slideOver.item?.id ?? "new"}
                        item={slideOver.item}
                        onClose={close}
                    />
                )}
            </SlideOver>
        </AdminLayout>
    );
}
