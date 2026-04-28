import { Head, router, useForm, usePage } from "@inertiajs/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import DataTable from "@/Components/Admin/DataTable";
import { SingleDropzone } from "@/Components/Admin/ImageDropzone";
import { ActiveBadge } from "@/Components/Admin/StatusBadge";
import SlideOver from "@/Components/Admin/SlideOver";
import AdminLayout from "@/Layouts/AdminLayout";
import type { PageProps, TestimonialItem } from "@/types";

type Props = PageProps<{ items: TestimonialItem[] }>;

const helper = createColumnHelper<TestimonialItem>();

const inputBase =
    "w-full rounded-2xl border-0 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-900 transition-colors";
const labelBase =
    "font-clash text-xs font-medium uppercase tracking-wider text-gray-500";

type FormData = {
    name: string;
    instance: string;
    message: string;
    rating: number | "";
    is_active: boolean;
    sort_order: number;
    avatar: File | null;
    _method?: string;
};

function TestimonialForm({
    item,
    onClose,
}: {
    item: TestimonialItem | null;
    onClose: () => void;
}) {
    const isEdit = item !== null;

    const { data, setData, post, processing, errors } = useForm<FormData>({
        name: item?.name ?? "",
        instance: item?.instance ?? "",
        message: item?.message ?? "",
        rating: item?.rating ?? "",
        is_active: item?.is_active ?? true,
        sort_order: item?.sort_order ?? 0,
        avatar: null,
        ...(isEdit ? { _method: "PUT" } : {}),
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEdit
            ? route("admin.testimonials.update", item!.id)
            : route("admin.testimonials.store");
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
                    placeholder="Full name…"
                    className={`${inputBase} mt-1.5`}
                />
                {errors.name && (
                    <p className="mt-1 text-xs text-rose-500">{errors.name}</p>
                )}
            </div>

            <div>
                <label className={labelBase}>Instance / Organization</label>
                <input
                    type="text"
                    value={data.instance}
                    onChange={(e) => setData("instance", e.target.value)}
                    placeholder="Faculty, company, or affiliation…"
                    className={`${inputBase} mt-1.5`}
                />
                {errors.instance && (
                    <p className="mt-1 text-xs text-rose-500">
                        {errors.instance}
                    </p>
                )}
            </div>

            <div>
                <label className={labelBase}>Message</label>
                <textarea
                    value={data.message}
                    onChange={(e) => setData("message", e.target.value)}
                    rows={4}
                    placeholder="Testimonial text…"
                    className={`${inputBase} mt-1.5 resize-none`}
                />
                {errors.message && (
                    <p className="mt-1 text-xs text-rose-500">
                        {errors.message}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelBase}>Rating</label>
                    <select
                        value={data.rating}
                        onChange={(e) =>
                            setData(
                                "rating",
                                e.target.value ? Number(e.target.value) : "",
                            )
                        }
                        className={`${inputBase} mt-1.5`}
                    >
                        <option value="">No rating</option>
                        {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>
                                {"★".repeat(n)} {n}/5
                            </option>
                        ))}
                    </select>
                </div>
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
            </div>

            <div className="flex items-center gap-3">
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

            <div>
                <label className={`${labelBase} mb-1.5 block`}>Avatar</label>
                <SingleDropzone
                    label=""
                    currentUrl={item?.avatar_url ?? null}
                    onFileSelect={(f) => setData("avatar", f)}
                />
                {errors.avatar && (
                    <p className="mt-1 text-xs text-rose-500">
                        {errors.avatar}
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
                          : "Add Testimonial"}
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

function StarRating({ rating }: { rating: number | null | undefined }) {
    if (!rating) return <span className="text-gray-400 italic text-xs">—</span>;
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
                <Star
                    key={n}
                    size={12}
                    className={
                        n <= rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-200"
                    }
                />
            ))}
        </div>
    );
}

export default function TestimonialsIndex() {
    const { items } = usePage<Props>().props;
    const [slideOver, setSlideOver] = useState<{
        open: boolean;
        item: TestimonialItem | null;
    }>({ open: false, item: null });

    const openNew = () => setSlideOver({ open: true, item: null });
    const openEdit = (item: TestimonialItem) =>
        setSlideOver({ open: true, item });
    const close = () => setSlideOver({ open: false, item: null });

    const handleDelete = (item: TestimonialItem) => {
        if (!confirm(`Delete testimonial from "${item.name}"?`)) return;
        router.delete(route("admin.testimonials.destroy", item.id));
    };

    const columns = [
        helper.accessor("avatar_url", {
            header: "Avatar",
            cell: (info) => {
                const url = info.getValue();
                const name = info.row.original.name;
                return url ? (
                    <img
                        src={url}
                        alt={name}
                        className="h-9 w-9 rounded-full object-cover"
                    />
                ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-500">
                        {name.charAt(0).toUpperCase()}
                    </div>
                );
            },
        }),
        helper.accessor("name", {
            header: "Person",
            enableSorting: true,
            cell: (info) => {
                const t = info.row.original;
                return (
                    <div>
                        <p className="font-medium text-sm text-gray-900">
                            {t.name}
                        </p>
                        <p className="text-[11px] text-gray-400">{t.instance}</p>
                    </div>
                );
            },
        }),
        helper.accessor("message", {
            header: "Message",
            cell: (info) => (
                <p className="max-w-[200px] line-clamp-2 text-xs text-gray-600">
                    {info.getValue()}
                </p>
            ),
        }),
        helper.accessor("rating", {
            header: "Rating",
            cell: (info) => <StarRating rating={info.getValue()} />,
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
                        Testimonials
                    </h1>
                </div>
            }
        >
            <Head title="Testimonials" />

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
                    columns={
                        columns as ColumnDef<TestimonialItem, unknown>[]
                    }
                    data={items}
                    searchColumn="name"
                    searchPlaceholder="Search testimonials…"
                    emptyMessage="No testimonials yet."
                    toolbar={
                        <button
                            type="button"
                            onClick={openNew}
                            className="flex items-center gap-2 rounded-2xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                        >
                            <Plus size={15} />
                            Add Testimonial
                        </button>
                    }
                />
            </div>

            <SlideOver
                isOpen={slideOver.open}
                onClose={close}
                title={slideOver.item ? "Edit Testimonial" : "Add Testimonial"}
                description={
                    slideOver.item
                        ? "Update testimonial details."
                        : "Add a new testimonial."
                }
            >
                {slideOver.open && (
                    <TestimonialForm
                        key={slideOver.item?.id ?? "new"}
                        item={slideOver.item}
                        onClose={close}
                    />
                )}
            </SlideOver>
        </AdminLayout>
    );
}
