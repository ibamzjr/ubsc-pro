import { Head, router, useForm, usePage } from "@inertiajs/react";
import {
    ArrowLeft,
    BookOpen,
    CalendarClock,
    FileText,
    Image,
    Save,
    Sparkles,
} from "lucide-react";
import { useEffect } from "react";
import RichEditor from "@/Components/Admin/RichEditor";
import { SingleDropzone } from "@/Components/Admin/ImageDropzone";
import { ADMIN_TOKENS } from "@/Components/Admin/tokens";
import AdminLayout from "@/Layouts/AdminLayout";
import type { NewsCategory, NewsItem, NewsStatus, PageProps } from "@/types";

// ── Global styles ─────────────────────────────────────────────────────────────

const GLOBAL_STYLES = `
    .font-clash { font-family: 'Clash Display', sans-serif; }
    .font-bdo   { font-family: 'BDO Grotesk', sans-serif; }

    @keyframes fadeInUp {
        from { opacity: 0; transform: translate3d(0, 28px, 0); }
        to   { opacity: 1; transform: translate3d(0, 0, 0); }
    }
    @keyframes fadeInLeft {
        from { opacity: 0; transform: translate3d(-20px, 0, 0); }
        to   { opacity: 1; transform: translate3d(0, 0, 0); }
    }
    @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.97); }
        to   { opacity: 1; transform: scale(1); }
    }
    @keyframes shimmerSweep {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(200%); }
    }
    @keyframes iconGlow {
        0%, 100% { box-shadow: 0 2px 8px rgba(15,23,42,0.2); }
        50%       { box-shadow: 0 2px 16px rgba(15,23,42,0.3), 0 0 24px rgba(251,191,36,0.12); }
    }
    @keyframes btnSheen {
        0%   { left: -80%; }
        100% { left: 120%; }
    }
    @keyframes statusPulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
        50%       { box-shadow: 0 0 0 3px rgba(16,185,129,0.15); }
    }

    .animate-fade-in-up   { animation: fadeInUp  0.65s cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; will-change:opacity,transform; }
    .animate-fade-in-left { animation: fadeInLeft 0.55s cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; }
    .animate-scale-in     { animation: scaleIn    0.5s  cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; }

    .delay-50  { animation-delay:  50ms; }
    .delay-100 { animation-delay: 100ms; }
    .delay-150 { animation-delay: 150ms; }
    .delay-200 { animation-delay: 200ms; }
    .delay-250 { animation-delay: 250ms; }
    .delay-300 { animation-delay: 300ms; }

    .shimmer-once { position: relative; overflow: hidden; }
    .shimmer-once::after {
        content: '';
        position: absolute; inset: 0;
        background: linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%);
        width: 60%;
        animation: shimmerSweep 1.1s ease-out 0.5s forwards;
        pointer-events: none;
        border-radius: inherit;
    }

    .icon-glow { animation: iconGlow 3.5s ease-in-out infinite; }

    .card-glint { position: relative; }
    .card-glint::before {
        content: '';
        position: absolute;
        top: 0; left: 20px; right: 20px; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent);
        pointer-events: none;
        z-index: 1;
    }

    .btn-sheen { position: relative; overflow: hidden; }
    .btn-sheen::before {
        content: '';
        position: absolute;
        top: 0; bottom: 0; width: 50%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        animation: btnSheen 3s ease-in-out 1s infinite;
    }

    /* ── Field system ── */
    .nf-input {
        width: 100%;
        border-radius: 0.75rem;
        border: 1px solid rgb(226 232 240 / 0.8);
        background: rgb(248 250 252 / 0.6);
        padding: 0.75rem 1rem;
        font-family: 'BDO Grotesk', sans-serif;
        font-size: 0.875rem;
        color: #0f172a;
        transition: all 0.15s;
        outline: none;
        -webkit-appearance: none;
    }
    .nf-input::placeholder { color: rgb(148 163 184); }
    .nf-input:focus {
        background: white;
        border-color: rgb(99 102 241 / 0.5);
        box-shadow: 0 0 0 4px rgb(99 102 241 / 0.07);
    }
    .nf-input.mono { font-family: ui-monospace, SFMono-Regular, monospace; font-size: 0.8125rem; letter-spacing: -0.01em; }
    .nf-input.title-input {
        font-family: 'Clash Display', sans-serif;
        font-size: 1.0625rem;
        font-weight: 600;
        color: #0f172a;
    }

    /* ── Status badge colours ── */
    .status-draft     { background: #f8fafc; color: #475569; border: 1px solid #e2e8f0; }
    .status-published { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; animation: statusPulse 3s ease-in-out infinite; }
    .status-archived  { background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; }

    /* ── Section divider ── */
    .n-divider {
        height: 1px;
        background: linear-gradient(90deg, transparent, rgb(226 232 240), transparent);
    }

    /* ── Rich editor wrapper ── */
    .rich-editor-wrap {
        border-radius: 0.875rem;
        border: 1px solid rgb(226 232 240 / 0.8);
        overflow: hidden;
        transition: box-shadow 0.15s, border-color 0.15s;
    }
    .rich-editor-wrap:focus-within {
        border-color: rgb(99 102 241 / 0.4);
        box-shadow: 0 0 0 4px rgb(99 102 241 / 0.06);
    }
`;

// ── Types ─────────────────────────────────────────────────────────────────────

type Props = PageProps<{
    article: (NewsItem & { content: string }) | null;
    categories: Pick<NewsCategory, "id" | "name">[];
}>;

type FormData = {
    news_category_id: number | "";
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    status: NewsStatus;
    published_at: string;
    thumbnail: File | null;
    _method?: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugify(str: string): string {
    return str.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ShinyIcon({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`relative flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-600 to-slate-900 shadow-[0_2px_10px_rgba(15,23,42,0.22),inset_0_1px_0_rgba(255,255,255,0.12)] icon-glow ${className}`}>
            {children}
            <span className="pointer-events-none absolute top-[3px] left-[5px] right-[5px] h-[5px] rounded-full bg-white/20 blur-[1px]" />
        </div>
    );
}

const STATUS_META: Record<NewsStatus, { label: string; dot: string; cls: string }> = {
    draft:     { label: "Draft",     dot: "bg-slate-400",   cls: "status-draft"     },
    published: { label: "Terbit",    dot: "bg-emerald-500", cls: "status-published" },
    archived:  { label: "Diarsipkan",dot: "bg-orange-400",  cls: "status-archived"  },
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NewsForm() {
    const { article, categories, auth } = usePage<Props>().props;
    const isEdit = article !== null;
    const canPublish = auth.user?.permissions?.includes("manage-promos") ?? false;

    const { data, setData, post, processing, errors } = useForm<FormData>({
        news_category_id: article?.category?.id ?? "",
        title:       article?.title       ?? "",
        slug:        article?.slug        ?? "",
        excerpt:     article?.excerpt     ?? "",
        content:     article?.content     ?? "",
        status:      article?.status      ?? "draft",
        published_at: article?.published_at ?? "",
        thumbnail:   null,
        ...(isEdit ? { _method: "PUT" } : {}),
    });

    useEffect(() => {
        if (!isEdit && data.title) setData("slug", slugify(data.title));
    }, [data.title, isEdit]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEdit
            ? route("admin.news.update", article!.id)
            : route("admin.news.store");
        post(url, { forceFormData: true });
    };

    const currentStatus = STATUS_META[data.status] ?? STATUS_META.draft;

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4 animate-fade-in-up">
                    <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
                    <span className="font-bdo text-[11px] font-medium tracking-wide text-slate-400">
                        {isEdit ? "Edit Artikel" : "Artikel Baru"}
                    </span>
                    <div className="flex items-end gap-3 flex-wrap">
                        <h1 className="font-clash text-3xl font-bold uppercase tracking-tight xl:text-4xl text-slate-900 leading-none">
                            {isEdit ? article!.title : "Tulis Artikel"}
                        </h1>
                        {/* Live status pill */}
                        <span className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 font-bdo text-[11px] font-bold uppercase tracking-wider mb-0.5 ${currentStatus.cls}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${currentStatus.dot}`} />
                            {currentStatus.label}
                        </span>
                    </div>
                </div>
            }
        >
            <Head title={isEdit ? `Edit: ${article!.title}` : "New Article"} />

            <form
                onSubmit={submit}
                className="flex flex-col gap-6 pt-6 pb-20"
                encType="multipart/form-data"
            >
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

                    {/* ═══════════════════════════════════════
                        LEFT — Main content (spans 2 cols)
                    ═══════════════════════════════════════ */}
                    <div className="xl:col-span-2 flex flex-col gap-5">

                        {/* Title + Slug card */}
                        <div className="animate-fade-in-up delay-100 card-glint shimmer-once relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-shadow duration-300 hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)]">
                            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
                                <ShinyIcon className="h-9 w-9">
                                    <FileText size={14} className="text-sky-300" />
                                </ShinyIcon>
                                <div>
                                    <p className="font-clash text-sm font-semibold text-slate-800 leading-tight">Identitas Artikel</p>
                                    <p className="font-bdo text-[11px] text-slate-400 mt-0.5">Judul dan URL slug artikel</p>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col gap-5">
                                {/* Title */}
                                <div>
                                    <label className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                                        Judul Artikel
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={e => setData("title", e.target.value)}
                                        placeholder="Tulis headline yang menarik…"
                                        className="nf-input title-input"
                                    />
                                    {errors.title && (
                                        <p className="mt-1.5 font-bdo text-[11px] text-rose-500">{errors.title}</p>
                                    )}
                                </div>

                                {/* Slug */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                            Slug URL
                                        </label>
                                        <span className="font-bdo text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg ring-1 ring-slate-200/80">
                                            Auto dari judul
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        value={data.slug}
                                        onChange={e => setData("slug", e.target.value)}
                                        className="nf-input mono"
                                        placeholder="artikel-slug-url"
                                    />
                                    {errors.slug && (
                                        <p className="mt-1.5 font-bdo text-[11px] text-rose-500">{errors.slug}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Excerpt card */}
                        <div className="animate-fade-in-up delay-150 card-glint shimmer-once relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-shadow duration-300 hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)]">
                            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
                                <ShinyIcon className="h-9 w-9">
                                    <Sparkles size={14} className="text-amber-300" />
                                </ShinyIcon>
                                <div>
                                    <p className="font-clash text-sm font-semibold text-slate-800 leading-tight">Ringkasan</p>
                                    <p className="font-bdo text-[11px] text-slate-400 mt-0.5">Ditampilkan di kartu & preview artikel</p>
                                </div>
                            </div>
                            <div className="p-6">
                                <textarea
                                    value={data.excerpt}
                                    onChange={e => setData("excerpt", e.target.value)}
                                    rows={3}
                                    placeholder="Tulis ringkasan singkat yang menggugah rasa ingin tahu…"
                                    className="nf-input resize-none leading-relaxed"
                                />
                            </div>
                        </div>

                        {/* Content editor card */}
                        <div className="animate-fade-in-up delay-200 card-glint relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-shadow duration-300 hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)]">
                            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
                                <ShinyIcon className="h-9 w-9">
                                    <BookOpen size={14} className="text-violet-300" />
                                </ShinyIcon>
                                <div>
                                    <p className="font-clash text-sm font-semibold text-slate-800 leading-tight">Konten Artikel</p>
                                    <p className="font-bdo text-[11px] text-slate-400 mt-0.5">Editor teks lengkap dengan format rich text</p>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="rich-editor-wrap">
                                    <RichEditor
                                        value={data.content}
                                        onChange={html => setData("content", html)}
                                        error={errors.content}
                                    />
                                </div>
                                {errors.content && (
                                    <p className="mt-2 font-bdo text-[11px] text-rose-500">{errors.content}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════
                        RIGHT — Sidebar: Publish + Thumbnail
                    ═══════════════════════════════════════ */}
                    <div className="flex flex-col gap-5">

                        {/* Publish settings card */}
                        <div className="animate-fade-in-left delay-100 card-glint shimmer-once relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-shadow duration-300 hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)]">
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
                                <ShinyIcon className="h-9 w-9">
                                    <CalendarClock size={14} className="text-amber-300" />
                                </ShinyIcon>
                                <div>
                                    <p className="font-clash text-sm font-semibold text-slate-800 leading-tight">Penerbitan</p>
                                    <p className="font-bdo text-[11px] text-slate-400 mt-0.5">Status & jadwal publikasi</p>
                                </div>
                            </div>

                            <div className="p-5 flex flex-col gap-4">

                                {/* Status select */}
                                <div>
                                    <label className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                                        Status
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={data.status}
                                            onChange={e => setData("status", e.target.value as NewsStatus)}
                                            className="nf-input pr-8 appearance-none"
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="published" disabled={!canPublish}>
                                                Terbit{!canPublish ? " (butuh izin)" : ""}
                                            </option>
                                            <option value="archived">Diarsipkan</option>
                                        </select>
                                        {/* Live status indicator */}
                                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                                            <span className={`h-2 w-2 rounded-full block ${currentStatus.dot}`} />
                                        </div>
                                    </div>
                                    {errors.status && (
                                        <p className="mt-1.5 font-bdo text-[11px] text-rose-500">{errors.status}</p>
                                    )}

                                    {/* Permission warning */}
                                    {!canPublish && (
                                        <p className="mt-2 flex items-center gap-1.5 font-bdo text-[10px] text-amber-600 bg-amber-50 px-2.5 py-1.5 rounded-lg ring-1 ring-amber-200/60">
                                            <span>⚠</span>
                                            Butuh izin <strong>publish-news</strong> untuk menerbitkan
                                        </p>
                                    )}
                                </div>

                                <div className="n-divider" />

                                {/* Category */}
                                <div>
                                    <label className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                                        Kategori
                                    </label>
                                    <select
                                        value={data.news_category_id}
                                        onChange={e => setData("news_category_id", Number(e.target.value) || "")}
                                        className="nf-input"
                                    >
                                        <option value="">Tanpa kategori</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Published at — conditional, no logic change */}
                                {data.status === "published" && (
                                    <>
                                        <div className="n-divider" />
                                        <div className="animate-scale-in">
                                            <label className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                                                Waktu Terbit
                                            </label>
                                            <input
                                                type="datetime-local"
                                                value={data.published_at}
                                                onChange={e => setData("published_at", e.target.value)}
                                                className="nf-input"
                                            />
                                            <p className="mt-1.5 font-bdo text-[10px] text-slate-400">
                                                Kosongkan untuk menggunakan waktu saat ini.
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Thumbnail card */}
                        <div className="animate-fade-in-left delay-150 card-glint shimmer-once relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-shadow duration-300 hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)]">
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
                                <ShinyIcon className="h-9 w-9">
                                    <Image size={14} className="text-violet-300" />
                                </ShinyIcon>
                                <div>
                                    <p className="font-clash text-sm font-semibold text-slate-800 leading-tight">Thumbnail</p>
                                    <p className="font-bdo text-[11px] text-slate-400 mt-0.5">Gambar utama untuk kartu artikel</p>
                                </div>
                            </div>
                            <div className="p-5">
                                <SingleDropzone
                                    label=""
                                    currentUrl={article?.thumbnail ?? null}
                                    onFileSelect={file => setData("thumbnail", file)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Action bar ── */}
                <div className="animate-fade-in-up delay-250 flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">

                    {/* Cancel */}
                    <a
                        href={route("admin.news.index")}
                        className="flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-clash text-sm font-semibold text-slate-600 bg-slate-100 transition-all hover:bg-slate-200 hover:text-slate-900"
                    >
                        <ArrowLeft size={14} />
                        Batal
                    </a>

                    {/* Divider */}
                    <span className="hidden sm:block w-px h-8 bg-slate-200 mx-1" />

                    {/* Hint */}
                    <p className="flex-1 font-bdo text-[11px] text-slate-400 hidden sm:block">
                        {isEdit
                            ? "Perubahan akan langsung tersimpan ke sistem."
                            : "Artikel baru akan disimpan sebagai draft hingga diterbitkan."
                        }
                    </p>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="btn-sheen relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 px-7 py-2.5 font-clash text-sm font-semibold text-white transition-all shadow-[0_4px_14px_rgba(5,150,105,0.35),inset_0_1px_0_rgba(255,255,255,0.15)] hover:shadow-[0_6px_20px_rgba(5,150,105,0.45)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                    >
                        <span className="pointer-events-none absolute top-0 left-0 right-0 h-px rounded-t-xl bg-white/20" />
                        <Save size={14} />
                        {processing
                            ? "Menyimpan…"
                            : isEdit
                              ? "Simpan Perubahan"
                              : "Buat Artikel"
                        }
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}