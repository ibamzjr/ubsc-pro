import { Head, router, useForm, usePage } from "@inertiajs/react";
import { Save } from "lucide-react";
import { useEffect } from "react";
import {
    MultiDropzone,
    SingleDropzone,
    type ExistingMedia,
} from "@/Components/Admin/ImageDropzone";
import { ADMIN_TOKENS } from "@/Components/Admin/tokens";
import AdminLayout from "@/Layouts/AdminLayout";
import type { FacilityCategory, FacilityItem, PageProps } from "@/types";

type Props = PageProps<{
    categories: Pick<FacilityCategory, "id" | "name">[];
    facility: FacilityItem | null;
}>;

type FormData = {
    facility_category_id: number | "";
    name: string;
    slug: string;
    description: string;
    is_active: boolean;
    sort_order: number;
    hero: File | null;
    gallery: File[];
    _method?: string;
};

function slugify(str: string): string {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}

export default function FacilityForm() {
    const { categories, facility } = usePage<Props>().props;
    const isEdit = facility !== null;

    const { data, setData, post, processing, errors, reset } =
        useForm<FormData>({
            facility_category_id: facility?.category?.id ?? "",
            name: facility?.name ?? "",
            slug: facility?.slug ?? "",
            description: facility?.description ?? "",
            is_active: facility?.is_active ?? true,
            sort_order: facility?.sort_order ?? 0,
            hero: null,
            gallery: [],
            ...(isEdit ? { _method: "PUT" } : {}),
        });

    useEffect(() => {
        if (!isEdit && data.name) {
            setData("slug", slugify(data.name));
        }
    }, [data.name, isEdit]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEdit
            ? route("admin.facilities.update", facility!.id)
            : route("admin.facilities.store");
        post(url, { forceFormData: true });
    };

    const inputBase =
        "w-full rounded-2xl border-0 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-900 transition-colors";
    const labelBase =
        "font-clash text-xs font-medium uppercase tracking-wider text-gray-500";

    const existingHeroUrl = facility?.hero?.url ?? null;
    const existingGallery: ExistingMedia[] = facility?.gallery ?? [];

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4">
                    <span className="font-clash text-xs uppercase tracking-[0.2em] text-gray-400">
                        {isEdit ? "Edit Facility" : "New Facility"}
                    </span>
                    <h1 className="font-monument text-3xl font-normal tracking-tight text-gray-900">
                        {isEdit ? facility!.name : "Create Facility"}
                    </h1>
                </div>
            }
        >
            <Head title={isEdit ? `Edit ${facility!.name}` : "New Facility"} />

            <form
                onSubmit={submit}
                className="flex flex-col gap-6 pt-6"
                encType="multipart/form-data"
            >
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    {/* ── Main fields ── */}
                    <div className={`xl:col-span-2 ${ADMIN_TOKENS.CARD_LARGE} p-6`}>
                        <h2 className="mb-5 font-clash text-sm font-medium text-gray-900">
                            Basic Information
                        </h2>

                        <div className="flex flex-col gap-4">
                            <div>
                                <label className={labelBase}>Category</label>
                                <select
                                    value={data.facility_category_id}
                                    onChange={(e) =>
                                        setData(
                                            "facility_category_id",
                                            Number(e.target.value),
                                        )
                                    }
                                    className={`${inputBase} mt-1.5`}
                                >
                                    <option value="">Select category…</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.facility_category_id && (
                                    <p className="mt-1 text-xs text-rose-500">
                                        {errors.facility_category_id}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelBase}>Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    placeholder="Lapangan Bulutangkis Hall A"
                                    className={`${inputBase} mt-1.5`}
                                />
                                {errors.name && (
                                    <p className="mt-1 text-xs text-rose-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelBase}>Slug</label>
                                <input
                                    type="text"
                                    value={data.slug}
                                    onChange={(e) =>
                                        setData("slug", e.target.value)
                                    }
                                    placeholder="lapangan-bulutangkis-hall-a"
                                    className={`${inputBase} mt-1.5 font-mono`}
                                />
                                {errors.slug && (
                                    <p className="mt-1 text-xs text-rose-500">
                                        {errors.slug}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelBase}>Description</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    rows={4}
                                    placeholder="Describe this facility…"
                                    className={`${inputBase} mt-1.5 resize-none`}
                                />
                                {errors.description && (
                                    <p className="mt-1 text-xs text-rose-500">
                                        {errors.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Side fields ── */}
                    <div className="flex flex-col gap-4">
                        <div className={`${ADMIN_TOKENS.CARD_LARGE} p-6`}>
                            <h2 className="mb-5 font-clash text-sm font-medium text-gray-900">
                                Settings
                            </h2>

                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
                                    <span className="text-sm text-gray-700">
                                        Active on site
                                    </span>
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={data.is_active}
                                        onClick={() =>
                                            setData(
                                                "is_active",
                                                !data.is_active,
                                            )
                                        }
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                            data.is_active
                                                ? "bg-gray-900"
                                                : "bg-gray-200"
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                                                data.is_active
                                                    ? "translate-x-6"
                                                    : "translate-x-1"
                                            }`}
                                        />
                                    </button>
                                </div>

                                <div>
                                    <label className={labelBase}>
                                        Sort Order
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={data.sort_order}
                                        onChange={(e) =>
                                            setData(
                                                "sort_order",
                                                Number(e.target.value),
                                            )
                                        }
                                        className={`${inputBase} mt-1.5`}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={`${ADMIN_TOKENS.CARD_LARGE} p-6`}>
                            <h2 className="mb-5 font-clash text-sm font-medium text-gray-900">
                                Media
                            </h2>
                            <div className="flex flex-col gap-5">
                                <SingleDropzone
                                    label="Hero Image"
                                    currentUrl={existingHeroUrl}
                                    onFileSelect={(file) =>
                                        setData("hero", file)
                                    }
                                />
                                <MultiDropzone
                                    label="Gallery"
                                    existing={existingGallery}
                                    onFilesSelect={(files) =>
                                        setData("gallery", [
                                            ...data.gallery,
                                            ...files,
                                        ])
                                    }
                                    onRemoveExisting={(id) => {
                                        router.delete(
                                            route(
                                                "admin.facilities.gallery.destroy",
                                                id,
                                            ),
                                            { preserveScroll: true },
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2 rounded-2xl bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-60"
                    >
                        <Save size={15} />
                        {processing
                            ? "Saving…"
                            : isEdit
                              ? "Save Changes"
                              : "Create Facility"}
                    </button>
                    <a
                        href={route("admin.facilities.index")}
                        className="rounded-2xl px-5 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                    >
                        Cancel
                    </a>
                </div>
            </form>
        </AdminLayout>
    );
}
