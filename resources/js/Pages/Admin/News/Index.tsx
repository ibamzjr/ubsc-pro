import { Head, Link, router, usePage } from "@inertiajs/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import {
    ChevronDown,
    ChevronRight,
    Pencil,
    Plus,
    Trash2,
} from "lucide-react";
import { useState } from "react";
import DataTable from "@/Components/Admin/DataTable";
import { ADMIN_TOKENS } from "@/Components/Admin/tokens";
import AdminLayout from "@/Layouts/AdminLayout";
import type { NewsCategory, NewsItem, NewsStatus, PageProps } from "@/types";
import { cn } from "@/lib/utils";

type Props = PageProps<{
    news: NewsItem[];
    categories: (NewsCategory & { news_count: number })[];
}>;

const STATUS_STYLE: Record<NewsStatus, string> = {
    draft:     "bg-gray-100 text-gray-600",
    published: "bg-green-50 text-green-700 ring-1 ring-inset ring-green-200",
    archived:  "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
};

const helper = createColumnHelper<NewsItem>();

function NewsRowActions({ article }: { article: NewsItem }) {
    const [deleting, setDeleting] = useState(false);
    const handleDelete = () => {
        if (!confirm(`Delete "${article.title}"?`)) return;
        setDeleting(true);
        router.delete(route("admin.news.destroy", article.id), {
            onFinish: () => setDeleting(false),
        });
    };
    return (
        <div className="flex items-center gap-1.5">
            <Link
                href={route("admin.news.edit", article.id)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
                <Pencil size={13} />
            </Link>
            <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-400 transition-colors hover:bg-rose-100 disabled:opacity-40"
            >
                <Trash2 size={13} />
            </button>
        </div>
    );
}

const columns = [
    helper.accessor("title", {
        header: "Article",
        enableSorting: true,
        cell: (info) => {
            const a = info.row.original;
            return (
                <div className="flex items-center gap-3">
                    {a.thumbnail ? (
                        <img
                            src={a.thumbnail}
                            alt=""
                            className="h-9 w-14 shrink-0 rounded-xl object-cover"
                        />
                    ) : (
                        <div className="flex h-9 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-400 text-xs">
                            No img
                        </div>
                    )}
                    <div>
                        <p className="font-medium text-gray-900 line-clamp-1">{a.title}</p>
                        <p className="text-[11px] text-gray-400">{a.slug}</p>
                    </div>
                </div>
            );
        },
    }),
    helper.accessor("category", {
        header: "Category",
        cell: (info) => (
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                {info.getValue()?.name ?? "Uncategorized"}
            </span>
        ),
    }),
    helper.accessor("author", {
        header: "Author",
        cell: (info) => (
            <span className="text-sm text-gray-600">{info.getValue().name}</span>
        ),
    }),
    helper.accessor("status", {
        header: "Status",
        cell: (info) => {
            const s = info.getValue();
            return (
                <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide", STATUS_STYLE[s])}>
                    {s}
                </span>
            );
        },
    }),
    helper.accessor("updated_at", {
        header: "Updated",
        enableSorting: true,
        cell: (info) => <span className="text-xs text-gray-500">{info.getValue()}</span>,
    }),
    helper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <NewsRowActions article={row.original} />,
    }),
];

function CategoriesPanel({ categories }: { categories: (NewsCategory & { news_count: number })[] }) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`${ADMIN_TOKENS.CARD_LARGE} overflow-hidden`}>
            <button type="button" onClick={() => setOpen(v => !v)}
                className="flex w-full items-center justify-between p-5 text-left">
                <div className="flex items-center gap-3">
                    <span className="font-clash text-sm font-medium text-gray-900">News Categories</span>
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">{categories.length}</span>
                </div>
                {open ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
            </button>
            {open && (
                <div className="border-t border-gray-100 p-5">
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <span key={cat.id} className="rounded-2xl bg-gray-50 px-4 py-2 text-sm text-gray-700">
                                {cat.name}
                                <span className="ml-1.5 text-xs text-gray-400">{cat.news_count}</span>
                            </span>
                        ))}
                        {categories.length === 0 && (
                            <p className="text-sm text-gray-400">No categories yet.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function NewsIndex() {
    const { news, categories } = usePage<Props>().props;
    const published = news.filter(n => n.status === "published").length;

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4">
                    <span className="font-clash text-xs uppercase tracking-[0.2em] text-gray-400">Content Management</span>
                    <h1 className="font-monument text-3xl font-normal tracking-tight text-gray-900">News & Articles</h1>
                </div>
            }
        >
            <Head title="News" />
            <div className="flex flex-col gap-5 pt-6">
                <div className="flex items-center gap-3">
                    <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-200">
                        {published} published
                    </span>
                    <span className="text-sm text-gray-500">{news.length} total</span>
                </div>

                <CategoriesPanel categories={categories} />

                <DataTable
                    columns={columns as ColumnDef<NewsItem, unknown>[]}
                    data={news}
                    searchColumn="title"
                    searchPlaceholder="Search articles…"
                    emptyMessage="No articles yet."
                    toolbar={
                        <Link
                            href={route("admin.news.create")}
                            className="flex items-center gap-2 rounded-2xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                        >
                            <Plus size={15} />
                            New Article
                        </Link>
                    }
                />
            </div>
        </AdminLayout>
    );
}
