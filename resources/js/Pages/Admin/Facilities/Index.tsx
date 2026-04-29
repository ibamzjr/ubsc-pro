import { Head, Link, router, usePage } from "@inertiajs/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import {
    ChevronDown,
    ChevronRight,
    FolderOpen,
    Pencil,
    Plus,
    Tag,
    Trash2,
} from "lucide-react";
import { useState } from "react";
import { ActiveBadge } from "@/Components/Admin/StatusBadge";
import DataTable from "@/Components/Admin/DataTable";
import { ADMIN_TOKENS } from "@/Components/Admin/tokens";
import AdminLayout from "@/Layouts/AdminLayout";
import { cn } from "@/lib/utils";
import type { FacilityCategory, FacilityItem, PageProps } from "@/types";

const inputBase =
    "w-full rounded-2xl border-0 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-900 transition-colors";

type Props = PageProps<{
    facilities: FacilityItem[];
    categories: FacilityCategory[];
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
                title="Edit Fasilitas"
            >
                <Pencil size={13} />
            </Link>
            <Link
                href={route("admin.facilities.pricing", facility.id)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-500 transition-colors hover:bg-amber-100 hover:text-amber-700"
                title="Atur Harga"
            >
                <Tag size={13} />
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

type CatForm = { name: string; description: string; sort_order: string };
const emptyCatForm: CatForm = { name: "", description: "", sort_order: "0" };

function CategoriesPanel({
    categories,
}: {
    categories: FacilityCategory[];
}) {
    const [open, setOpen]           = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [editingId, setEditingId]  = useState<number | null>(null);
    const [form, setForm]            = useState<CatForm>(emptyCatForm);
    const [saving, setSaving]        = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const f = (k: keyof CatForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((p) => ({ ...p, [k]: e.target.value }));

    const openCreate = () => {
        setEditingId(null);
        setForm(emptyCatForm);
        setShowCreate(true);
        setOpen(true);
    };

    const openEdit = (cat: FacilityCategory) => {
        setShowCreate(false);
        setEditingId(cat.id);
        setForm({
            name:       cat.name,
            description: cat.description ?? "",
            sort_order: String(cat.sort_order ?? 0),
        });
    };

    const cancel = () => {
        setShowCreate(false);
        setEditingId(null);
        setForm(emptyCatForm);
    };

    const payload = () => ({
        name:        form.name.trim(),
        description: form.description.trim() || null,
        sort_order:  parseInt(form.sort_order) || 0,
    });

    const handleStore = () => {
        setSaving(true);
        router.post(route("admin.facility-categories.store"), payload(), {
            onSuccess: cancel,
            onFinish:  () => setSaving(false),
        });
    };

    const handleUpdate = () => {
        if (!editingId) return;
        setSaving(true);
        router.put(route("admin.facility-categories.update", editingId), payload(), {
            onSuccess: cancel,
            onFinish:  () => setSaving(false),
        });
    };

    const handleDelete = (cat: FacilityCategory) => {
        if (!confirm(`Hapus kategori "${cat.name}"?`)) return;
        setDeletingId(cat.id);
        router.delete(route("admin.facility-categories.destroy", cat.id), {
            onFinish: () => setDeletingId(null),
        });
    };

    const showForm = showCreate || editingId !== null;

    return (
        <div className={`${ADMIN_TOKENS.CARD_LARGE} overflow-hidden`}>
            {/* Header */}
            <div className="flex items-center justify-between p-5">
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="flex flex-1 items-center gap-3 text-left"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gray-900 text-white">
                        <FolderOpen size={15} />
                    </div>
                    <span className="font-clash text-sm font-medium text-gray-900">
                        Facility Categories
                    </span>
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                        {categories.length}
                    </span>
                    {open ? (
                        <ChevronDown size={16} className="text-gray-400" />
                    ) : (
                        <ChevronRight size={16} className="text-gray-400" />
                    )}
                </button>
                <button
                    type="button"
                    onClick={openCreate}
                    className="flex shrink-0 items-center gap-1.5 rounded-2xl bg-gray-900 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-gray-800"
                >
                    <Plus size={13} />
                    New Category
                </button>
            </div>

            {open && (
                <div className="border-t border-gray-100 p-5">
                    {/* Category grid */}
                    {categories.length > 0 && (
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    className={cn(
                                        "flex items-center justify-between rounded-2xl px-4 py-3 transition-colors",
                                        editingId === cat.id
                                            ? "bg-amber-50 ring-1 ring-amber-200"
                                            : "bg-gray-50",
                                    )}
                                >
                                    <div className="min-w-0">
                                        <p className="font-clash text-sm font-medium text-gray-900 truncate">
                                            {cat.name}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {cat.facilities_count ?? 0} facilities · {cat.slug}
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-1 ml-2">
                                        <button
                                            type="button"
                                            onClick={() => openEdit(cat)}
                                            className="flex h-7 w-7 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-white hover:text-gray-700"
                                            title="Edit"
                                        >
                                            <Pencil size={12} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(cat)}
                                            disabled={deletingId === cat.id}
                                            className="flex h-7 w-7 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-rose-50 hover:text-rose-500 disabled:opacity-40"
                                            title="Hapus"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {categories.length === 0 && !showForm && (
                        <p className="py-4 text-center text-sm text-gray-400">
                            Belum ada kategori. Klik "New Category" untuk memulai.
                        </p>
                    )}

                    {/* Inline form — create or edit */}
                    {showForm && (
                        <div className={cn(
                            "mt-4 rounded-2xl border p-4",
                            editingId ? "border-amber-200 bg-amber-50/50" : "border-gray-200 bg-white",
                        )}>
                            <p className="mb-3 font-clash text-[11px] font-medium uppercase tracking-wider text-gray-500">
                                {editingId ? "Edit Category" : "New Category"}
                            </p>
                            <div className="flex flex-col gap-3">
                                <input
                                    type="text"
                                    value={form.name}
                                    placeholder="Nama kategori *"
                                    onChange={f("name")}
                                    className={inputBase}
                                    autoFocus
                                />
                                <input
                                    type="text"
                                    value={form.description}
                                    placeholder="Deskripsi (opsional)"
                                    onChange={f("description")}
                                    className={inputBase}
                                />
                                <input
                                    type="number"
                                    value={form.sort_order}
                                    placeholder="Sort order"
                                    min="0"
                                    onChange={f("sort_order")}
                                    className={inputBase}
                                />
                                <div className="flex items-center gap-2 pt-1">
                                    <button
                                        type="button"
                                        onClick={editingId ? handleUpdate : handleStore}
                                        disabled={saving || !form.name.trim()}
                                        className="flex-1 rounded-2xl bg-gray-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
                                    >
                                        {saving ? "Menyimpan…" : editingId ? "Update" : "Buat Kategori"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={cancel}
                                        className="rounded-2xl px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
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
