import { Head, Link, router, usePage } from "@inertiajs/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import {
    ChevronDown,
    ChevronRight,
    FileText,
    Layers,
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

// ── Types ──────────────────────────────────────────────────────────────────────

type Props = PageProps<{
    news: NewsItem[];
    categories: (NewsCategory & { news_count: number })[];
}>;

// ── Global design-system styles ────────────────────────────────────────────────

const GLOBAL_STYLES = `
    .font-clash { font-family: 'Clash Display', sans-serif; }
    .font-bdo   { font-family: 'BDO Grotesk', sans-serif; }

    /* ── Entrance animations ── */
    @keyframes fadeInUp {
        from { opacity: 0; transform: translate3d(0, 28px, 0); }
        to   { opacity: 1; transform: translate3d(0, 0, 0); }
    }
    @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.96); }
        to   { opacity: 1; transform: scale(1); }
    }
    @keyframes fadeInLeft {
        from { opacity: 0; transform: translate3d(-18px, 0, 0); }
        to   { opacity: 1; transform: translate3d(0, 0, 0); }
    }

    .animate-fade-in-up   { animation: fadeInUp  0.65s cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; will-change:opacity,transform; }
    .animate-scale-in     { animation: scaleIn    0.5s  cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; }
    .animate-fade-in-left { animation: fadeInLeft 0.55s cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; will-change:opacity,transform; }

    .delay-50  { animation-delay:  50ms; }
    .delay-100 { animation-delay: 100ms; }
    .delay-150 { animation-delay: 150ms; }
    .delay-200 { animation-delay: 200ms; }
    .delay-250 { animation-delay: 250ms; }
    .delay-300 { animation-delay: 300ms; }

    /* ── Shimmer sweep — one-shot on load ── */
    @keyframes shimmerSweep {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(200%); }
    }
    .shimmer-once {
        position: relative;
        overflow: hidden;
    }
    .shimmer-once::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
            105deg,
            transparent 0%,
            rgba(255,255,255,0.45) 50%,
            transparent 100%
        );
        width: 60%;
        animation: shimmerSweep 1.1s ease-out 0.5s forwards;
        pointer-events: none;
        border-radius: inherit;
    }

    /* ── Icon glow pulse ── */
    @keyframes iconGlow {
        0%, 100% { box-shadow: 0 2px 8px rgba(15,23,42,0.2); }
        50%       { box-shadow: 0 2px 16px rgba(15,23,42,0.3), 0 0 24px rgba(251,191,36,0.12); }
    }
    .icon-glow { animation: iconGlow 3.5s ease-in-out infinite; }

    /* ── Card border breathing ── */
    @keyframes cardBreath {
        0%, 100% { box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 0 0 1px rgba(226,232,240,0.8); }
        50%       { box-shadow: 0 4px 16px rgba(0,0,0,0.07), 0 0 0 1px rgba(251,191,36,0.18); }
    }
    .card-breath { animation: cardBreath 5s ease-in-out infinite; }

    /* ── Button infinite sheen ── */
    @keyframes btnSheen {
        0%   { left: -80%; }
        100% { left: 120%; }
    }
    .btn-sheen {
        position: relative;
        overflow: hidden;
    }
    .btn-sheen::before {
        content: '';
        position: absolute;
        top: 0; bottom: 0; width: 50%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        animation: btnSheen 3s ease-in-out 1s infinite;
    }

    /* ── Card top glint ── */
    .card-glint { position: relative; }
    .card-glint::before {
        content: '';
        position: absolute;
        top: 0; left: 20px; right: 20px; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent);
        pointer-events: none;
    }

    /* ── Category chip hover ── */
    .cat-chip {
        transition: all 0.18s cubic-bezier(0.16,1,0.3,1);
    }
    .cat-chip:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    /* ── Table row entrance stagger ── */
    @keyframes rowIn {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
    }

    /* ── Thumbnail shimmer on load ── */
    @keyframes thumbLoad {
        from { opacity: 0; transform: scale(0.96); }
        to   { opacity: 1; transform: scale(1); }
    }
    .thumb-load { animation: thumbLoad 0.4s ease-out forwards; }
`;

// ── Status config ──────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<NewsStatus, { label: string; dot: string; chip: string }> = {
    draft: {
        label: "Draft",
        dot:   "bg-slate-400",
        chip:  "bg-slate-100 text-slate-600 ring-1 ring-slate-200/80",
    },
    published: {
        label: "Published",
        dot:   "bg-emerald-400",
        chip:  "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80",
    },
    archived: {
        label: "Archived",
        dot:   "bg-amber-400",
        chip:  "bg-amber-50 text-amber-700 ring-1 ring-amber-200/80",
    },
};

// ── Shared sub-components ──────────────────────────────────────────────────────

function ShinyIcon({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn(
            "relative flex shrink-0 items-center justify-center rounded-xl",
            "bg-gradient-to-br from-orange-400 to-orange-500",
            "shadow-[0_2px_10px_rgba(15,23,42,0.22),inset_0_1px_0_rgba(255,255,255,0.12)]",
            "icon-glow",
            className,
        )}>
            {children}
            <span className="pointer-events-none absolute top-[3px] left-[5px] right-[5px] h-[5px] rounded-full bg-white/20 blur-[1px]" />
        </div>
    );
}

// ── Table column definitions ───────────────────────────────────────────────────

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
                className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-150",
                    "bg-slate-50 text-slate-500 ring-1 ring-slate-200/70",
                    "hover:bg-slate-100 hover:text-slate-900 hover:shadow-sm hover:-translate-y-px",
                )}
            >
                <Pencil size={13} />
            </Link>
            <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-150",
                    "bg-rose-50 text-rose-400 ring-1 ring-rose-200/70",
                    "hover:bg-rose-100 hover:shadow-sm hover:-translate-y-px",
                    "disabled:opacity-40 disabled:cursor-not-allowed",
                )}
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
                <div className="flex items-center gap-3 min-w-0">
                    {/* Thumbnail */}
                    {a.thumbnail ? (
                        <img
                            src={a.thumbnail}
                            alt=""
                            className="thumb-load h-10 w-16 shrink-0 rounded-xl object-cover shadow-sm ring-1 ring-slate-200/60"
                        />
                    ) : (
                        <div className="flex h-10 w-16 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 ring-1 ring-slate-200/60">
                            <FileText size={14} />
                        </div>
                    )}
                    {/* Text */}
                    <div className="min-w-0">
                        <p className="font-clash text-sm font-semibold text-slate-800 line-clamp-1 leading-tight">
                            {a.title}
                        </p>
                        <p className="font-bdo mt-0.5 text-[11px] text-slate-400 line-clamp-1">
                            {a.slug}
                        </p>
                    </div>
                </div>
            );
        },
    }),
    helper.accessor("category", {
        header: "Category",
        cell: (info) => (
            <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 font-bdo text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200/70">
                {info.getValue()?.name ?? "Uncategorized"}
            </span>
        ),
    }),
    helper.accessor("author", {
        header: "Author",
        cell: (info) => (
            <span className="font-bdo text-sm text-slate-600">{info.getValue().name}</span>
        ),
    }),
    helper.accessor("status", {
        header: "Status",
        cell: (info) => {
            const s   = info.getValue();
            const cfg = STATUS_CONFIG[s];
            return (
                <span className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-bdo text-[11px] font-bold uppercase tracking-wider",
                    cfg.chip,
                )}>
                    <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
                    {cfg.label}
                </span>
            );
        },
    }),
    helper.accessor("updated_at", {
        header: "Updated",
        enableSorting: true,
        cell: (info) => (
            <span className="font-bdo text-xs text-slate-400 tabular-nums">{info.getValue()}</span>
        ),
    }),
    helper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <NewsRowActions article={row.original} />,
    }),
];

// ── Categories Panel ───────────────────────────────────────────────────────────

function CategoriesPanel({
    categories,
}: {
    categories: (NewsCategory & { news_count: number })[];
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className={cn(
            "animate-scale-in delay-150",
            "relative card-glint overflow-hidden rounded-2xl border border-slate-200/80 bg-white",
            "shadow-[0_1px_4px_rgba(0,0,0,0.05)]",
        )}>
            {/* Collapsed / expanded toggle header */}
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-slate-50/60"
            >
                <div className="flex items-center gap-3">
                    <ShinyIcon className="h-9 w-9">
                        <Layers size={14} className="text-amber-50" />
                    </ShinyIcon>
                    <div>
                        <p className="font-bdo text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Konten
                        </p>
                        <p className="font-clash text-sm font-semibold text-slate-800 leading-tight">
                            Kategori Berita
                        </p>
                    </div>
                    {/* Count chip */}
                    <span className="ml-1 flex h-6 w-6 items-center justify-center rounded-lg bg-amber-50 font-bdo text-[11px] font-bold text-amber-500 ring-1 ring-amber-200/70">
                        {categories.length}
                    </span>
                </div>

                <div className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-xl transition-all duration-200",
                    open ? "bg-slate-100 text-slate-700" : "bg-slate-50 text-slate-400",
                )}>
                    {open
                        ? <ChevronDown  size={15} />
                        : <ChevronRight size={15} />
                    }
                </div>
            </button>

            {/* Expanded content */}
            {open && (
                <div className="border-t border-slate-100/80 px-5 pb-5 pt-4 animate-fade-in-up">
                    {categories.length === 0 ? (
                        <div className="flex items-center justify-center py-6">
                            <p className="font-bdo text-sm text-slate-400">
                                Belum ada kategori.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <span
                                    key={cat.id}
                                    className={cn(
                                        "cat-chip inline-flex items-center gap-2 rounded-xl px-3.5 py-2",
                                        "bg-slate-50 ring-1 ring-slate-200/70",
                                        "font-bdo text-sm text-slate-700",
                                    )}
                                >
                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_5px_rgba(251,191,36,0.5)]" />
                                    {cat.name}
                                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-md bg-slate-200/70 px-1 font-bdo text-[10px] font-bold text-slate-500 tabular-nums">
                                        {cat.news_count}
                                    </span>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NewsIndex() {
    const { news, categories } = usePage<Props>().props;

    const published = news.filter((n) => n.status === "published").length;
    const drafted   = news.filter((n) => n.status === "draft").length;
    const archived  = news.filter((n) => n.status === "archived").length;

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4 animate-fade-in-up">
                    <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
                    <span className="font-bdo text-[11px] font-medium tracking-wide text-orange-500">
                        Content Management
                    </span>
                    <h1 className="font-clash text-3xl font-bold tracking-tight xl:text-4xl uppercase text-slate-900">
                        News & Articles
                    </h1>
                </div>
            }
        >
            <Head title="News" />

            <div className="flex flex-col gap-5 pt-6 pb-20 overflow-x-hidden">

                {/* ── Stat chips + CTA row ─────────────────────────────────── */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between animate-fade-in-up delay-100">

                    {/* Stat chips */}
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Published */}
                        <div className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 ring-1 ring-emerald-200/70 shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                            </span>
                            <span className="font-bdo text-[11px] font-bold uppercase tracking-wider text-emerald-700 tabular-nums">
                                {published} Published
                            </span>
                        </div>

                        {/* Draft */}
                        {drafted > 0 && (
                            <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 ring-1 ring-slate-200/70 shadow-sm">
                                <span className="h-2 w-2 rounded-full bg-slate-400" />
                                <span className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 tabular-nums">
                                    {drafted} Draft
                                </span>
                            </div>
                        )}

                        {/* Archived */}
                        {archived > 0 && (
                            <div className="flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1.5 ring-1 ring-amber-200/70 shadow-sm">
                                <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_5px_rgba(251,191,36,0.5)]" />
                                <span className="font-bdo text-[11px] font-bold uppercase tracking-wider text-amber-700 tabular-nums">
                                    {archived} Archived
                                </span>
                            </div>
                        )}

                        {/* Total */}
                        <div className="flex items-center rounded-xl bg-white px-3 py-1.5 ring-1 ring-slate-200/70 shadow-sm">
                            <span className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-400 tabular-nums">
                                {news.length} Total
                            </span>
                        </div>
                    </div>

                    {/* New Article CTA */}
                    <Link
                        href={route("admin.news.create")}
                        className={cn(
                            "btn-sheen relative inline-flex shrink-0 items-center gap-2 self-start sm:self-auto",
                            "rounded-xl px-5 py-2.5 font-clash text-sm font-semibold text-white",
                            "bg-gradient-to-br from-emerald-500 to-emerald-600",
                            "shadow-[0_4px_14px_rgba(15,23,42,0.22),inset_0_1px_0_rgba(255,255,255,0.1)]",
                            "transition-all duration-200 hover:shadow-[0_6px_20px_rgba(15,23,42,0.28)] hover:-translate-y-0.5 active:translate-y-0",
                        )}
                    >
                        {/* Top glint */}
                        <span className="pointer-events-none absolute top-0 left-0 right-0 h-px rounded-t-xl bg-white/20" />
                        <Plus size={15} />
                        New Article
                    </Link>
                </div>

                {/* ── Categories collapsible panel ─────────────────────────── */}
                <CategoriesPanel categories={categories} />

                {/* ── Data table card ──────────────────────────────────────── */}
                <div className={cn(
                    "animate-scale-in delay-200",
                    "relative card-glint overflow-hidden rounded-2xl border border-slate-200/80 bg-white",
                    "shadow-[0_1px_4px_rgba(0,0,0,0.05)] shimmer-once",
                )}>
                    {/* Card top highlight */}
                    <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/70 to-transparent" />

                    {/* Card internal header */}
                    <div className="flex flex-col gap-3 border-b border-slate-100/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <ShinyIcon className="h-9 w-9">
                                <FileText size={14} className="text-amber-50" />
                            </ShinyIcon>
                            <div>
                                <p className="font-bdo text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    Daftar Konten
                                </p>
                                <p className="font-clash text-sm font-semibold text-slate-800 leading-tight">
                                    Semua Artikel
                                </p>
                            </div>
                        </div>

                        {/* Inline search + toolbar rendered by DataTable via `toolbar` prop below */}
                    </div>

                    {/* DataTable — toolbar slot carries "New Article" link (original) + search */}
                    <div className="p-4 sm:p-5">
                        <DataTable
                            columns={columns as ColumnDef<NewsItem, unknown>[]}
                            data={news}
                            searchColumn="title"
                            searchPlaceholder="Cari artikel…"
                            emptyMessage="Belum ada artikel."
                            toolbar={
                                /* Toolbar slot — rendered inside DataTable's header row.
                                   We keep the original Link intact; only the visual styling changes. */
                                <Link
                                    href={route("admin.news.create")}
                                    className={cn(
                                        "btn-sheen relative inline-flex items-center gap-2",
                                        "rounded-xl px-4 py-2 font-clash text-sm font-semibold text-white",
                                        "bg-gradient-to-br from-emerald-500 to-emerald-600",
                                        "shadow-[0_3px_10px_rgba(15,23,42,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]",
                                        "transition-all duration-150 hover:shadow-[0_5px_16px_rgba(15,23,42,0.26)] hover:-translate-y-px active:translate-y-0",
                                    )}
                                >
                                    <span className="pointer-events-none absolute top-0 left-0 right-0 h-px rounded-t-xl bg-white/20" />
                                    <Plus size={14} />
                                    New Article
                                </Link>
                            }
                        />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}