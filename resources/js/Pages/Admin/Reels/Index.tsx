import { Head, router, useForm, usePage } from "@inertiajs/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import DataTable from "@/Components/Admin/DataTable";
import { SingleDropzone } from "@/Components/Admin/ImageDropzone";
import { ActiveBadge } from "@/Components/Admin/StatusBadge";
import SlideOver from "@/Components/Admin/SlideOver";
import AdminLayout from "@/Layouts/AdminLayout";
import type { AdminReelItem, PageProps } from "@/types";

type Props = PageProps<{ items: AdminReelItem[] }>;

const helper = createColumnHelper<AdminReelItem>();

const inputBase =
    "w-full rounded-2xl border-0 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-900 transition-colors";
const labelBase =
    "font-clash text-xs font-medium uppercase tracking-wider text-gray-500";

type FormData = {
    title: string;
    subtitle: string;
    video_url: string;
    is_featured: boolean;
    is_active: boolean;
    sort_order: number;
    thumbnail: File | null;
    _method?: string;
};

function ReelForm({
    item,
    onClose,
}: {
    item: AdminReelItem | null;
    onClose: () => void;
}) {
    const isEdit = item !== null;

    const { data, setData, post, processing, errors } = useForm<FormData>({
        title: item?.title ?? "",
        subtitle: item?.subtitle ?? "",
        video_url: item?.video_url ?? "",
        is_featured: item?.is_featured ?? false,
        is_active: item?.is_active ?? true,
        sort_order: item?.sort_order ?? 0,
        thumbnail: null,
        ...(isEdit ? { _method: "PUT" } : {}),
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEdit
            ? route("admin.reels.update", item!.id)
            : route("admin.reels.store");
        post(url, { forceFormData: true, onSuccess: onClose });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-5">
            <div>
                <label className={labelBase}>Title</label>
                <input
                    type="text"
                    value={data.title}
                    onChange={(e) => setData("title", e.target.value)}
                    placeholder="Reel title…"
                    className={`${inputBase} mt-1.5`}
                />
                {errors.title && (
                    <p className="mt-1 text-xs text-rose-500">{errors.title}</p>
                )}
            </div>

            <div>
                <label className={labelBase}>Subtitle</label>
                <input
                    type="text"
                    value={data.subtitle}
                    onChange={(e) => setData("subtitle", e.target.value)}
                    placeholder="Date or caption (optional)…"
                    className={`${inputBase} mt-1.5`}
                />
            </div>

            <div>
                <label className={labelBase}>Video URL</label>
                <input
                    type="text"
                    value={data.video_url}
                    onChange={(e) => setData("video_url", e.target.value)}
                    placeholder="/reels/filename.mp4 or YouTube URL…"
                    className={`${inputBase} mt-1.5`}
                />
                {errors.video_url && (
                    <p className="mt-1 text-xs text-rose-500">
                        {errors.video_url}
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
                <div className="flex flex-col justify-end gap-2 pb-1">
                    <label className="flex cursor-pointer items-center gap-3">
                        <input
                            type="checkbox"
                            checked={data.is_featured}
                            onChange={(e) =>
                                setData("is_featured", e.target.checked)
                            }
                            className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                        />
                        <span className={labelBase}>Featured</span>
                    </label>
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
                <label className={`${labelBase} mb-1.5 block`}>Thumbnail</label>
                <SingleDropzone
                    label=""
                    currentUrl={item?.thumbnail_url ?? null}
                    onFileSelect={(f) => setData("thumbnail", f)}
                />
                {errors.thumbnail && (
                    <p className="mt-1 text-xs text-rose-500">
                        {errors.thumbnail}
                    </p>
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
                          : "Add Reel"}
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

export default function ReelsIndex() {
    const { items } = usePage<Props>().props;
    const [slideOver, setSlideOver] = useState<{
        open: boolean;
        item: AdminReelItem | null;
    }>({ open: false, item: null });

    const openNew = () => setSlideOver({ open: true, item: null });
    const openEdit = (item: AdminReelItem) =>
        setSlideOver({ open: true, item });
    const close = () => setSlideOver({ open: false, item: null });

    const handleDelete = (item: AdminReelItem) => {
        if (!confirm(`Delete "${item.title}"?`)) return;
        router.delete(route("admin.reels.destroy", item.id));
    };

    const columns = [
        helper.accessor("thumbnail_url", {
            header: "Thumbnail",
            cell: (info) => {
                const url = info.getValue();
                return url ? (
                    <img
                        src={url}
                        alt=""
                        className="h-10 w-16 rounded-xl object-cover"
                    />
                ) : (
                    <div className="flex h-10 w-16 items-center justify-center rounded-xl bg-gray-100 text-[10px] text-gray-400">
                        No img
                    </div>
                );
            },
        }),
        helper.accessor("title", {
            header: "Title",
            enableSorting: true,
            cell: (info) => {
                const r = info.row.original;
                return (
                    <div>
                        <p className="font-medium text-sm text-gray-900 line-clamp-1">
                            {r.title}
                        </p>
                        {r.subtitle && (
                            <p className="text-[11px] text-gray-400">
                                {r.subtitle}
                            </p>
                        )}
                    </div>
                );
            },
        }),
        helper.accessor("video_url", {
            header: "Video URL",
            cell: (info) => (
                <span className="max-w-[140px] truncate text-xs text-gray-500 block">
                    {info.getValue()}
                </span>
            ),
        }),
        helper.accessor("is_featured", {
            header: "Featured",
            cell: (info) =>
                info.getValue() ? (
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700 ring-1 ring-inset ring-amber-200">
                        Featured
                    </span>
                ) : null,
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
    const featured = items.filter((i) => i.is_featured).length;

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4">
                    <span className="font-clash text-xs uppercase tracking-[0.2em] text-gray-400">
                        Content Management
                    </span>
                    <h1 className="font-monument text-3xl font-normal tracking-tight text-gray-900">
                        Video Reels
                    </h1>
                </div>
            }
        >
            <Head title="Video Reels" />

            <div className="flex flex-col gap-5 pt-6">
                <div className="flex items-center gap-3">
                    <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-200">
                        {active} active
                    </span>
                    {featured > 0 && (
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 ring-1 ring-inset ring-amber-200">
                            {featured} featured
                        </span>
                    )}
                    <span className="text-sm text-gray-500">
                        {items.length} total
                    </span>
                </div>

                <DataTable
                    columns={columns as ColumnDef<AdminReelItem, unknown>[]}
                    data={items}
                    searchColumn="title"
                    searchPlaceholder="Search reels…"
                    emptyMessage="No reels yet."
                    toolbar={
                        <button
                            type="button"
                            onClick={openNew}
                            className="flex items-center gap-2 rounded-2xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                        >
                            <Plus size={15} />
                            Add Reel
                        </button>
                    }
                />
            </div>

            <SlideOver
                isOpen={slideOver.open}
                onClose={close}
                title={slideOver.item ? "Edit Reel" : "Add Reel"}
                description={
                    slideOver.item
                        ? "Update reel details."
                        : "Add a new video reel."
                }
            >
                {slideOver.open && (
                    <ReelForm
                        key={slideOver.item?.id ?? "new"}
                        item={slideOver.item}
                        onClose={close}
                    />
                )}
            </SlideOver>
        </AdminLayout>
    );
}
