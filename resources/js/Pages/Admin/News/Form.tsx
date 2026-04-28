import { Head, router, useForm, usePage } from "@inertiajs/react";
import { Save } from "lucide-react";
import { useEffect } from "react";
import RichEditor from "@/Components/Admin/RichEditor";
import { SingleDropzone } from "@/Components/Admin/ImageDropzone";
import { ADMIN_TOKENS } from "@/Components/Admin/tokens";
import AdminLayout from "@/Layouts/AdminLayout";
import type { NewsCategory, NewsItem, NewsStatus, PageProps } from "@/types";

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

function slugify(str: string): string {
    return str.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

export default function NewsForm() {
    const { article, categories, auth } = usePage<Props>().props;
    const isEdit = article !== null;
    const canPublish = auth.permissions.includes("publish-news");

    const { data, setData, post, processing, errors } = useForm<FormData>({
        news_category_id: article?.category?.id ?? "",
        title: article?.title ?? "",
        slug: article?.slug ?? "",
        excerpt: article?.excerpt ?? "",
        content: article?.content ?? "",
        status: article?.status ?? "draft",
        published_at: article?.published_at ?? "",
        thumbnail: null,
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

    const inputBase = "w-full rounded-2xl border-0 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-900 transition-colors";
    const labelBase = "font-clash text-xs font-medium uppercase tracking-wider text-gray-500";

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4">
                    <span className="font-clash text-xs uppercase tracking-[0.2em] text-gray-400">
                        {isEdit ? "Edit Article" : "New Article"}
                    </span>
                    <h1 className="font-monument text-3xl font-normal tracking-tight text-gray-900">
                        {isEdit ? article!.title : "Create Article"}
                    </h1>
                </div>
            }
        >
            <Head title={isEdit ? `Edit: ${article!.title}` : "New Article"} />

            <form onSubmit={submit} className="flex flex-col gap-6 pt-6" encType="multipart/form-data">
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    {/* ── Main content ── */}
                    <div className={`xl:col-span-2 flex flex-col gap-4 ${ADMIN_TOKENS.CARD_LARGE} p-6`}>
                        <div>
                            <label className={labelBase}>Title</label>
                            <input type="text" value={data.title}
                                onChange={e => setData("title", e.target.value)}
                                placeholder="Article headline…"
                                className={`${inputBase} mt-1.5`} />
                            {errors.title && <p className="mt-1 text-xs text-rose-500">{errors.title}</p>}
                        </div>

                        <div>
                            <label className={labelBase}>Slug</label>
                            <input type="text" value={data.slug}
                                onChange={e => setData("slug", e.target.value)}
                                className={`${inputBase} mt-1.5 font-mono`} />
                            {errors.slug && <p className="mt-1 text-xs text-rose-500">{errors.slug}</p>}
                        </div>

                        <div>
                            <label className={labelBase}>Excerpt</label>
                            <textarea value={data.excerpt}
                                onChange={e => setData("excerpt", e.target.value)}
                                rows={2} placeholder="Short summary for article cards…"
                                className={`${inputBase} mt-1.5 resize-none`} />
                        </div>

                        <div>
                            <label className={`${labelBase} mb-1.5 block`}>Content</label>
                            <RichEditor
                                value={data.content}
                                onChange={html => setData("content", html)}
                                error={errors.content}
                            />
                        </div>
                    </div>

                    {/* ── Sidebar ── */}
                    <div className="flex flex-col gap-4">
                        <div className={`${ADMIN_TOKENS.CARD_LARGE} p-6`}>
                            <h2 className="mb-4 font-clash text-sm font-medium text-gray-900">Publish Settings</h2>
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className={labelBase}>Status</label>
                                    <select value={data.status}
                                        onChange={e => setData("status", e.target.value as NewsStatus)}
                                        className={`${inputBase} mt-1.5`}>
                                        <option value="draft">Draft</option>
                                        <option value="published" disabled={!canPublish}>
                                            Published{!canPublish ? " (no permission)" : ""}
                                        </option>
                                        <option value="archived">Archived</option>
                                    </select>
                                    {errors.status && <p className="mt-1 text-xs text-rose-500">{errors.status}</p>}
                                </div>

                                <div>
                                    <label className={labelBase}>Category</label>
                                    <select value={data.news_category_id}
                                        onChange={e => setData("news_category_id", Number(e.target.value) || "")}
                                        className={`${inputBase} mt-1.5`}>
                                        <option value="">Uncategorized</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {data.status === "published" && (
                                    <div>
                                        <label className={labelBase}>Published At</label>
                                        <input type="datetime-local" value={data.published_at}
                                            onChange={e => setData("published_at", e.target.value)}
                                            className={`${inputBase} mt-1.5`} />
                                        <p className="mt-1 text-[11px] text-gray-400">Leave blank to use current time.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={`${ADMIN_TOKENS.CARD_LARGE} p-6`}>
                            <h2 className="mb-4 font-clash text-sm font-medium text-gray-900">Thumbnail</h2>
                            <SingleDropzone
                                label=""
                                currentUrl={article?.thumbnail ?? null}
                                onFileSelect={file => setData("thumbnail", file)}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button type="submit" disabled={processing}
                        className="flex items-center gap-2 rounded-2xl bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-60">
                        <Save size={15} />
                        {processing ? "Saving…" : isEdit ? "Save Changes" : "Create Article"}
                    </button>
                    <a href={route("admin.news.index")}
                        className="rounded-2xl px-5 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100">
                        Cancel
                    </a>
                </div>
            </form>
        </AdminLayout>
    );
}
