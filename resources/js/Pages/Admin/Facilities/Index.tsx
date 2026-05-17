import { Head, Link, router, usePage } from "@inertiajs/react";
import {
    ChevronDown,
    ChevronRight,
    FolderOpen,
    GripVertical,
    ImageIcon,
    LayoutGrid,
    Pencil,
    Plus,
    Tag,
    Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { cn } from "@/lib/utils";
import {
    DndContext,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    rectSortingStrategy,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SortableListItem from "@/Components/Admin/SortableListItem";
import type { FacilityCategory, FacilityItem, PageProps } from "@/types";

// ── Global styles ─────────────────────────────────────────────────────────────

const GLOBAL_STYLES = `
    .font-clash { font-family: 'Clash Display', sans-serif; }
    .font-bdo   { font-family: 'BDO Grotesk', sans-serif; }

    @keyframes fadeInUp {
        from { opacity: 0; transform: translate3d(0, 28px, 0); }
        to   { opacity: 1; transform: translate3d(0, 0, 0); }
    }
    @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.96); }
        to   { opacity: 1; transform: scale(1); }
    }

    .animate-fade-in-up { animation: fadeInUp 0.65s cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; will-change:opacity,transform; }
    .animate-scale-in   { animation: scaleIn  0.5s  cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; }

    .delay-50  { animation-delay:  50ms; }
    .delay-100 { animation-delay: 100ms; }
    .delay-150 { animation-delay: 150ms; }
    .delay-200 { animation-delay: 200ms; }
    .delay-250 { animation-delay: 250ms; }
    .delay-300 { animation-delay: 300ms; }

    @keyframes shimmerSweep {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(200%); }
    }
    .shimmer-once { position: relative; overflow: hidden; }
    .shimmer-once::after {
        content: '';
        position: absolute; inset: 0;
        background: linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%);
        width: 60%;
        animation: shimmerSweep 1.1s ease-out 0.5s forwards;
        pointer-events: none; border-radius: inherit;
    }

    @keyframes iconGlow {
        0%, 100% { box-shadow: 0 2px 8px rgba(15,23,42,0.2); }
        50%       { box-shadow: 0 2px 16px rgba(15,23,42,0.3), 0 0 24px rgba(251,191,36,0.12); }
    }
    .icon-glow { animation: iconGlow 3.5s ease-in-out infinite; }

    .card-glint { position: relative; }
    .card-glint::before {
        content: '';
        position: absolute; top: 0; left: 20px; right: 20px; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent);
        pointer-events: none;
    }

    @keyframes btnSheen {
        0%   { left: -80%; }
        100% { left: 120%; }
    }
    .btn-sheen { position: relative; overflow: hidden; }
    .btn-sheen::before {
        content: '';
        position: absolute; top: 0; bottom: 0; width: 50%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        animation: btnSheen 3s ease-in-out 1s infinite;
    }

    @keyframes editPulse {
        0%, 100% { box-shadow: 0 0 0 1px rgba(139,92,246,0.3); }
        50%       { box-shadow: 0 0 0 2px rgba(139,92,246,0.5), 0 4px 16px rgba(139,92,246,0.1); }
    }
    .edit-pulse { animation: editPulse 2s ease-in-out infinite; }
`;

// ── Shared styles ─────────────────────────────────────────────────────────────

const inputBase =
    "w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-bdo text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 transition-all outline-none";

const labelBase =
    "font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block";

// ── Types ─────────────────────────────────────────────────────────────────────

type Props = PageProps<{
    facilities: FacilityItem[];
    categories: FacilityCategory[];
}>;

// ── Sub-components ────────────────────────────────────────────────────────────

function ShinyIcon({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn(
            "relative flex shrink-0 items-center justify-center rounded-xl",
            "bg-gradient-to-br from-slate-600 to-slate-900",
            "shadow-[0_2px_10px_rgba(15,23,42,0.22),inset_0_1px_0_rgba(255,255,255,0.12)]",
            "icon-glow",
            className,
        )}>
            {children}
            <span className="pointer-events-none absolute top-[3px] left-[5px] right-[5px] h-[5px] rounded-full bg-white/20 blur-[1px]" />
        </div>
    );
}

// ── Category accent palette (used in CategoriesPanel row avatars) ────────────

const CAT_COLORS = [
    { avatar: "from-violet-400 to-violet-600"   },
    { avatar: "from-sky-400 to-sky-600"         },
    { avatar: "from-teal-400 to-teal-600"       },
    { avatar: "from-amber-400 to-amber-600"     },
    { avatar: "from-rose-400 to-rose-600"       },
    { avatar: "from-emerald-400 to-emerald-600" },
];

// ── Facility Card (sortable) ──────────────────────────────────────────────────

function FacilityCard({ facility, index }: { facility: FacilityItem; index: number }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: facility.id.toString() });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const [deleting, setDeleting] = useState(false);

    const handleDelete = () => {
        if (!confirm(`Hapus "${facility.name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
        setDeleting(true);
        router.delete(route("admin.facilities.destroy", facility.id), {
            onFinish: () => setDeleting(false),
        });
    };

    const imageUrl = facility.hero?.url ?? null;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "touch-none flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white",
                "shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-all duration-200",
                "hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:-translate-y-0.5",
                isDragging && "z-50 opacity-60 shadow-2xl scale-[1.02]",
            )}
        >
            {/* ── Thumbnail: 16:9 with floating controls ── */}
            <div className="relative aspect-video overflow-hidden bg-slate-100">
                {/* top gradient for icon legibility */}
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-14 bg-gradient-to-b from-black/50 to-transparent" />

                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={facility.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-slate-100 to-slate-200">
                        <ImageIcon size={22} className="text-slate-300" />
                        <span className="font-bdo text-[10px] text-slate-300">No image</span>
                    </div>
                )}

                {/* Grip handle — floats top-left */}
                <button
                    type="button"
                    {...attributes}
                    {...listeners}
                    className={cn(
                        "absolute left-2 top-2 z-20",
                        "flex h-7 w-7 cursor-grab items-center justify-center rounded-lg",
                        "bg-black/30 text-white backdrop-blur-sm",
                        "hover:bg-black/50 active:cursor-grabbing transition-colors focus:outline-none",
                    )}
                    aria-label="Drag to reorder"
                >
                    <GripVertical size={13} />
                </button>

                {/* Order badge — floats top-right */}
                <span className="absolute right-2 top-2 z-20 rounded-md bg-black/30 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white/90 backdrop-blur-sm tabular-nums">
                    #{index + 1}
                </span>
            </div>

            {/* ── Name + slug ── */}
            <div className="px-4 pt-3 pb-2">
                <p className="font-clash text-sm font-semibold text-slate-900 leading-tight line-clamp-1">
                    {facility.name}
                </p>
                <p className="font-bdo text-xs text-slate-400 mt-0.5 truncate">
                    {facility.slug}
                </p>
            </div>

            {/* ── Badges ── */}
            <div className="flex flex-wrap items-center gap-1.5 px-4 pb-3">
                {facility.category?.name && (
                    <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 font-bdo text-[10px] font-semibold text-slate-600">
                        {facility.category.name}
                    </span>
                )}
                {facility.is_active ? (
                    <span className="inline-flex items-center gap-1 rounded-md border border-emerald-100 bg-emerald-50 px-2 py-0.5 font-bdo text-[10px] font-semibold text-emerald-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Aktif
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 font-bdo text-[10px] font-semibold text-slate-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                        Nonaktif
                    </span>
                )}
                {(facility.prices_count ?? 0) > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-md border border-orange-100 bg-orange-50 px-2 py-0.5 font-bdo text-[10px] font-semibold text-orange-600">
                        <Tag size={9} />
                        {facility.prices_count} harga
                    </span>
                )}
            </div>

            {/* ── Actions ── */}
            <div className="mt-auto flex items-center border-t border-slate-100 px-2 py-2">
                <Link
                    href={route("admin.facilities.edit", facility.id)}
                    className="flex h-8 flex-1 items-center justify-center gap-1 rounded-xl font-bdo text-[11px] font-semibold text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900"
                >
                    <Pencil size={11} />
                    Edit
                </Link>
                <Link
                    href={route("admin.facilities.pricing", facility.id)}
                    className="flex h-8 flex-1 items-center justify-center gap-1 rounded-xl font-bdo text-[11px] font-semibold text-slate-500 transition-all hover:bg-orange-50 hover:text-orange-600"
                >
                    <Tag size={11} />
                    Harga
                </Link>
                <button
                    type="button"
                    disabled={deleting}
                    onClick={handleDelete}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <Trash2 size={11} />
                </button>
            </div>
        </div>
    );
}

// ── Categories Panel (vertical DnD list) ─────────────────────────────────────

type CatForm = { name: string; description: string; sort_order: string };
const emptyCatForm: CatForm = { name: "", description: "", sort_order: "0" };

function CategoriesPanel({ categories }: { categories: FacilityCategory[] }) {
    const [open, setOpen]             = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [editingId, setEditingId]   = useState<number | null>(null);
    const [form, setForm]             = useState<CatForm>(emptyCatForm);
    const [saving, setSaving]         = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [items, setItems]           = useState<FacilityCategory[]>(categories);
    useEffect(() => setItems(categories), [categories]);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = items.findIndex((i) => i.id.toString() === active.id);
        const newIndex = items.findIndex((i) => i.id.toString() === over.id);
        const reordered = arrayMove(items, oldIndex, newIndex);
        setItems(reordered);
        router.post(route("admin.facility-categories.reorder"), { ids: reordered.map((i) => i.id) }, { preserveScroll: true });
    };

    const f = (k: keyof CatForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((p) => ({ ...p, [k]: e.target.value }));

    const openCreate = () => { setEditingId(null); setForm(emptyCatForm); setShowCreate(true); setOpen(true); };
    const openEdit   = (cat: FacilityCategory) => {
        setShowCreate(false);
        setEditingId(cat.id);
        setForm({ name: cat.name, description: cat.description ?? "", sort_order: String(cat.sort_order ?? 0) });
    };
    const cancel = () => { setShowCreate(false); setEditingId(null); setForm(emptyCatForm); };

    const payload = () => ({
        name:        form.name.trim(),
        description: form.description.trim() || null,
        sort_order:  parseInt(form.sort_order) || 0,
    });

    const handleStore = () => {
        setSaving(true);
        router.post(route("admin.facility-categories.store"), payload(), { onSuccess: cancel, onFinish: () => setSaving(false) });
    };

    const handleUpdate = () => {
        if (!editingId) return;
        setSaving(true);
        router.put(route("admin.facility-categories.update", editingId), payload(), { onSuccess: cancel, onFinish: () => setSaving(false) });
    };

    const handleDelete = (cat: FacilityCategory) => {
        if (!confirm(`Hapus kategori "${cat.name}"?`)) return;
        setDeletingId(cat.id);
        router.delete(route("admin.facility-categories.destroy", cat.id), { onFinish: () => setDeletingId(null) });
    };

    const showForm = showCreate || editingId !== null;

    return (
        <div className="relative card-glint overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] animate-fade-in-up delay-100">

            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-4">
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="flex flex-1 items-center gap-3 text-left"
                >
                    <ShinyIcon className="h-9 w-9">
                        <FolderOpen size={14} className="text-amber-300" />
                    </ShinyIcon>
                    <div>
                        <p className="font-clash text-sm font-semibold text-slate-800">Kategori Fasilitas</p>
                        <p className="font-bdo text-[11px] text-slate-400">Kelola pengelompokan fasilitas</p>
                    </div>
                    <span className="flex items-center gap-1.5 rounded-xl bg-violet-50 px-2.5 py-1 font-bdo text-[11px] font-bold text-violet-600 ring-1 ring-violet-200/70 ml-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                        {categories.length}
                    </span>
                    <span className="ml-1 text-slate-400 transition-transform duration-200">
                        {open ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={openCreate}
                    className="btn-sheen flex shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 px-3.5 py-2 font-bdo text-xs font-semibold text-white transition-all shadow-[0_2px_8px_rgba(15,23,42,0.2),inset_0_1px_0_rgba(255,255,255,0.08)] hover:shadow-[0_4px_14px_rgba(15,23,42,0.28)] hover:-translate-y-px active:translate-y-0"
                >
                    <Plus size={13} />
                    Kategori Baru
                </button>
            </div>

            {/* Collapsible body */}
            {open && (
                <div className="border-t border-slate-100 p-5">

                    {/* DnD category list */}
                    {items.length > 0 && (
                        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                            <SortableContext items={items.map((i) => i.id.toString())} strategy={verticalListSortingStrategy}>
                                <div className="flex flex-col gap-2.5">
                                    {items.map((cat, idx) => {
                                        const accent = CAT_COLORS[idx % CAT_COLORS.length]!;
                                        const isEditing = editingId === cat.id;
                                        return (
                                            <SortableListItem key={cat.id} id={cat.id.toString()}>
                                                <div className={cn(
                                                    "flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-200",
                                                    isEditing
                                                        ? "bg-violet-50 edit-pulse ring-1 ring-violet-200"
                                                        : "bg-slate-50/80 hover:bg-white hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]",
                                                )}>
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className={cn(
                                                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br font-clash text-xs font-bold text-white shadow-sm",
                                                            accent.avatar,
                                                        )}>
                                                            {cat.name[0]?.toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-clash text-sm font-semibold text-slate-800 truncate">{cat.name}</p>
                                                            <p className="font-bdo text-[10px] text-slate-400">
                                                                {cat.facilities_count ?? 0} fasilitas · {cat.slug}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex shrink-0 items-center gap-1 ml-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => openEdit(cat)}
                                                            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-white hover:text-slate-700 hover:shadow-sm"
                                                            title="Edit"
                                                        >
                                                            <Pencil size={12} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(cat)}
                                                            disabled={deletingId === cat.id}
                                                            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-500 disabled:opacity-40"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </SortableListItem>
                                        );
                                    })}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )}

                    {/* Empty state */}
                    {items.length === 0 && !showForm && (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 mb-3">
                                <FolderOpen size={20} className="text-slate-400" />
                            </div>
                            <p className="font-clash text-sm font-medium text-slate-500">Belum ada kategori</p>
                            <p className="font-bdo text-xs text-slate-400 mt-1">Klik "Kategori Baru" untuk memulai</p>
                        </div>
                    )}

                    {/* Inline form — create or edit */}
                    {showForm && (
                        <div className={cn(
                            "mt-4 rounded-2xl border p-5 transition-all",
                            editingId
                                ? "border-violet-200 bg-violet-50/40"
                                : "border-slate-200/80 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)]",
                        )}>
                            <div className="flex items-center gap-2 mb-4">
                                <span className={cn(
                                    "flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-clash font-bold",
                                    editingId ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-600",
                                )}>
                                    {editingId ? "✎" : "+"}
                                </span>
                                <p className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                    {editingId ? "Edit Kategori" : "Kategori Baru"}
                                </p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <div>
                                    <label className={labelBase}>Nama Kategori *</label>
                                    <input type="text" value={form.name} placeholder="Nama kategori…" onChange={f("name")} className={inputBase} autoFocus />
                                </div>
                                <div>
                                    <label className={labelBase}>Deskripsi</label>
                                    <input type="text" value={form.description} placeholder="Deskripsi singkat (opsional)" onChange={f("description")} className={inputBase} />
                                </div>
                                <div>
                                    <label className={labelBase}>Urutan Tampil</label>
                                    <input type="number" value={form.sort_order} placeholder="0" min="0" onChange={f("sort_order")} className={inputBase} />
                                </div>
                                <div className="flex items-center gap-2 pt-1 border-t border-slate-100 mt-1">
                                    <button type="button" onClick={cancel} className="rounded-xl px-5 py-2.5 font-bdo text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                                        Batal
                                    </button>
                                    <button
                                        type="button"
                                        onClick={editingId ? handleUpdate : handleStore}
                                        disabled={saving || !form.name.trim()}
                                        className={cn(
                                            "btn-sheen flex-1 relative rounded-xl py-2.5 font-clash text-sm font-semibold text-white transition-all",
                                            "shadow-[0_4px_14px_rgba(15,23,42,0.22),inset_0_1px_0_rgba(255,255,255,0.1)]",
                                            "hover:shadow-[0_6px_20px_rgba(15,23,42,0.28)] hover:-translate-y-0.5 active:translate-y-0",
                                            "disabled:opacity-50 disabled:hover:translate-y-0",
                                            editingId
                                                ? "bg-gradient-to-br from-violet-500 to-violet-700"
                                                : "bg-gradient-to-br from-slate-700 to-slate-900",
                                        )}
                                    >
                                        <span className="pointer-events-none absolute top-0 left-0 right-0 h-px rounded-t-xl bg-white/20" />
                                        {saving ? "Menyimpan…" : editingId ? "Simpan Perubahan" : "Buat Kategori"}
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function FacilitiesIndex() {
    const { facilities, categories } = usePage<Props>().props;

    const [facilityItems, setFacilityItems] = useState<FacilityItem[]>(facilities);
    useEffect(() => setFacilityItems(facilities), [facilities]);

    const facilitySensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

    const handleFacilityDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = facilityItems.findIndex((f) => f.id.toString() === active.id);
        const newIndex = facilityItems.findIndex((f) => f.id.toString() === over.id);
        const reordered = arrayMove(facilityItems, oldIndex, newIndex);
        setFacilityItems(reordered);
        router.post(route("admin.facilities.reorder"), { ids: reordered.map((f) => f.id) }, { preserveScroll: true });
    };

    const activeCount = facilities.filter((f) => f.is_active).length;

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4 animate-fade-in-up">
                    <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
                    <span className="font-bdo text-[11px] font-medium tracking-wide text-orange-500">
                        Manajemen Fasilitas
                    </span>
                    <h1 className="font-clash text-3xl font-bold uppercase tracking-tight xl:text-4xl text-slate-900">
                        Fasilitas
                    </h1>
                </div>
            }
        >
            <Head title="Facilities" />

            <div className="flex flex-col gap-6 pt-6 pb-20 overflow-x-hidden">

                {/* ── Stats + CTA ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up delay-100">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <div className="flex items-center gap-2 rounded-xl bg-sky-50 px-3.5 py-1.5 border border-sky-100 shadow-sm">
                            <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
                            <span className="font-bdo text-[11px] font-bold text-sky-600 uppercase tracking-wider">
                                {facilities.length} Total
                            </span>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-1.5 border border-emerald-100 shadow-sm">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="font-bdo text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                                {activeCount} Aktif
                            </span>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl bg-violet-50 px-3.5 py-1.5 border border-violet-100 shadow-sm">
                            <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
                            <span className="font-bdo text-[11px] font-bold text-violet-600 uppercase tracking-wider">
                                {categories.length} Kategori
                            </span>
                        </div>
                        {facilities.length - activeCount > 0 && (
                            <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3.5 py-1.5 border border-slate-200 shadow-sm">
                                <span className="h-2 w-2 rounded-full bg-slate-400" />
                                <span className="font-bdo text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    {facilities.length - activeCount} Nonaktif
                                </span>
                            </div>
                        )}
                    </div>

                    <Link
                        href={route("admin.facilities.create")}
                        className="btn-sheen relative flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 px-5 py-3 font-clash text-sm font-semibold text-white transition-all shadow-[0_4px_14px_rgba(5,150,105,0.35),inset_0_1px_0_rgba(255,255,255,0.15)] hover:shadow-[0_6px_20px_rgba(5,150,105,0.45)] hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <span className="pointer-events-none absolute top-0 left-0 right-0 h-px rounded-t-xl bg-white/20" />
                        <Plus size={16} />
                        Tambah Fasilitas
                    </Link>
                </div>

                {/* ── Categories Panel ── */}
                <CategoriesPanel categories={categories} />

                {/* ── Facilities Card Grid ── */}
                <div className="animate-fade-in-up delay-200 relative card-glint overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)] shimmer-once">
                    <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/70 to-transparent" />

                    {/* Grid header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100/80">
                        <div className="flex items-center gap-3">
                            <ShinyIcon className="h-9 w-9">
                                <LayoutGrid size={14} className="text-amber-300" />
                            </ShinyIcon>
                            <div>
                                <p className="font-clash text-sm font-semibold text-slate-800">Semua Fasilitas</p>
                                <p className="font-bdo text-[11px] text-slate-400">Seret kartu untuk mengubah urutan tampil</p>
                            </div>
                            <span className="ml-1 flex h-6 min-w-[24px] items-center justify-center rounded-lg bg-sky-50 px-1 font-bdo text-[11px] font-bold text-sky-500 ring-1 ring-sky-200/70">
                                {facilityItems.length}
                            </span>
                        </div>
                    </div>

                    {/* Grid body */}
                    <div className="p-5">
                        {facilityItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 mb-4">
                                    <LayoutGrid size={24} className="text-slate-400" />
                                </div>
                                <p className="font-clash text-sm font-semibold text-slate-500">Belum ada fasilitas</p>
                                <p className="font-bdo text-xs text-slate-400 mt-1">Tambah fasilitas baru untuk mulai</p>
                            </div>
                        ) : (
                            <DndContext
                                sensors={facilitySensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleFacilityDragEnd}
                            >
                                <SortableContext
                                    items={facilityItems.map((f) => f.id.toString())}
                                    strategy={rectSortingStrategy}
                                >
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                        {facilityItems.map((f, idx) => (
                                            <FacilityCard key={f.id} facility={f} index={idx} />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
