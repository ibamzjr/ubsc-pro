import { Head, router, usePage } from "@inertiajs/react";
import {
    CheckCircle,
    Package,
    Pencil,
    Plus,
    Trash2,
} from "lucide-react";
import { useState } from "react";
import SlideOver from "@/Components/Admin/SlideOver";
import { ADMIN_TOKENS } from "@/Components/Admin/tokens";
import AdminLayout from "@/Layouts/AdminLayout";
import { cn } from "@/lib/utils";
import type { MembershipPlanItem, PageProps } from "@/types";

type Props = PageProps<{ plans: MembershipPlanItem[] }>;

// ── Shared styles ─────────────────────────────────────────────────────────────

const inputBase =
    "w-full rounded-2xl border-0 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-900 transition-colors";
const labelBase =
    "font-clash text-xs font-medium uppercase tracking-wider text-gray-500";

// ── Helpers ───────────────────────────────────────────────────────────────────

function durationLabel(months: number): string {
    if (months === 12) return "1 Tahun";
    if (months === 1) return "1 Bulan";
    return `${months} Bulan`;
}

function formatIDR(amount: number): string {
    return `Rp ${amount.toLocaleString("id-ID")}`;
}

// ── Plan Form (Create / Edit) ─────────────────────────────────────────────────

function PlanForm({
    item,
    onClose,
}: {
    item: MembershipPlanItem | null;
    onClose: () => void;
}) {
    const isEdit = item !== null;

    const [name, setName]               = useState(item?.name ?? "");
    const [description, setDescription] = useState(item?.description ?? "");
    const [price, setPrice]             = useState(String(item?.price ?? ""));
    const [duration, setDuration]       = useState<number>(item?.duration_months ?? 1);
    const [sortOrder, setSortOrder]     = useState(String(item?.sort_order ?? "0"));
    const [isActive, setIsActive]       = useState(item?.is_active ?? true);
    const [features, setFeatures]       = useState<string[]>(item?.features ?? []);
    const [featureInput, setFeatureInput] = useState("");
    const [processing, setProcessing]   = useState(false);

    const addFeature = () => {
        const trimmed = featureInput.trim();
        if (!trimmed) return;
        setFeatures((prev) => [...prev, trimmed]);
        setFeatureInput("");
    };

    const removeFeature = (idx: number) =>
        setFeatures((prev) => prev.filter((_, i) => i !== idx));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        const payload = {
            name,
            description: description || null,
            price: Number(price),
            duration_months: duration,
            features,
            is_active: isActive,
            sort_order: Number(sortOrder),
        };
        if (isEdit) {
            router.patch(route("admin.memberships.plans.update", item.id), payload, {
                onSuccess: onClose,
                onFinish: () => setProcessing(false),
            });
        } else {
            router.post(route("admin.memberships.plans.store"), payload, {
                onSuccess: onClose,
                onFinish: () => setProcessing(false),
            });
        }
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-5">
            {/* Name */}
            <div>
                <label className={cn(labelBase, "mb-1.5 block")}>Nama Paket</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Basic, Pro, Elite…"
                    className={inputBase}
                    required
                />
            </div>

            {/* Description */}
            <div>
                <label className={cn(labelBase, "mb-1.5 block")}>Deskripsi</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    placeholder="Penjelasan singkat…"
                    className={`${inputBase} resize-none`}
                />
            </div>

            {/* Price + Duration */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={cn(labelBase, "mb-1.5 block")}>Harga (IDR)</label>
                    <input
                        type="number"
                        min="0"
                        step="1000"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="150000"
                        className={inputBase}
                        required
                    />
                </div>
                <div>
                    <label className={cn(labelBase, "mb-1.5 block")}>Durasi</label>
                    <select
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className={inputBase}
                    >
                        <option value={1}>1 Bulan</option>
                        <option value={3}>3 Bulan</option>
                        <option value={6}>6 Bulan</option>
                        <option value={12}>12 Bulan / 1 Tahun</option>
                    </select>
                </div>
            </div>

            {/* Sort order */}
            <div>
                <label className={cn(labelBase, "mb-1.5 block")}>Urutan Tampil</label>
                <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className={inputBase}
                />
            </div>

            {/* Features builder */}
            <div>
                <label className={cn(labelBase, "mb-1.5 block")}>Fitur</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                addFeature();
                            }
                        }}
                        placeholder="Akses gym 24 jam… lalu Enter"
                        className={inputBase}
                    />
                    <button
                        type="button"
                        onClick={addFeature}
                        className="shrink-0 rounded-2xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                        Tambah
                    </button>
                </div>
                {features.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        {features.map((f, i) => (
                            <span
                                key={i}
                                className="flex items-center gap-1 rounded-full bg-gray-100 py-1 pl-3 pr-1 text-xs text-gray-700"
                            >
                                {f}
                                <button
                                    type="button"
                                    onClick={() => removeFeature(i)}
                                    className="flex h-4 w-4 items-center justify-center rounded-full text-gray-400 hover:bg-gray-300 hover:text-gray-700 transition-colors"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* is_active toggle */}
            <div className="flex items-center justify-between">
                <span className={labelBase}>Status Aktif</span>
                <button
                    type="button"
                    role="switch"
                    aria-checked={isActive}
                    onClick={() => setIsActive((v) => !v)}
                    className={cn(
                        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200",
                        isActive ? "bg-gray-900" : "bg-gray-200",
                    )}
                >
                    <span
                        className={cn(
                            "mt-0.5 inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200",
                            isActive ? "translate-x-[22px]" : "translate-x-0.5",
                        )}
                    />
                </button>
            </div>

            {/* Submit */}
            <div className="flex items-center gap-3 pt-2">
                <button
                    type="submit"
                    disabled={processing}
                    className="flex-1 rounded-2xl bg-gray-900 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-60"
                >
                    {processing ? "Menyimpan…" : isEdit ? "Simpan Perubahan" : "Buat Paket"}
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-2xl px-5 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                >
                    Batal
                </button>
            </div>
        </form>
    );
}

// ── Plan Card ─────────────────────────────────────────────────────────────────

function PlanCard({
    plan,
    onEdit,
    onDelete,
}: {
    plan: MembershipPlanItem;
    onEdit: (p: MembershipPlanItem) => void;
    onDelete: (p: MembershipPlanItem) => void;
}) {
    return (
        <div className={`${ADMIN_TOKENS.CARD} flex flex-col gap-4 p-5`}>
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                    <p className="font-clash font-semibold text-gray-900 leading-snug">
                        {plan.name}
                    </p>
                    {plan.description && (
                        <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">
                            {plan.description}
                        </p>
                    )}
                </div>
                <span
                    className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                        plan.is_active
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
                            : "bg-gray-100 text-gray-400",
                    )}
                >
                    {plan.is_active ? "Aktif" : "Nonaktif"}
                </span>
            </div>

            {/* Price */}
            <div>
                <span className="font-monument text-2xl font-normal text-gray-900">
                    {formatIDR(plan.price)}
                </span>
                <span className="text-sm text-gray-500">
                    {" "}/ {durationLabel(plan.duration_months)}
                </span>
            </div>

            {/* Active members */}
            <div>
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200">
                    {plan.active_members_count} anggota aktif
                </span>
            </div>

            {/* Features */}
            {plan.features.length > 0 && (
                <ul className="flex flex-col gap-1.5">
                    {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle size={13} className="shrink-0 text-emerald-500" />
                            {f}
                        </li>
                    ))}
                </ul>
            )}

            {/* Actions */}
            <div className="mt-auto flex items-center gap-1.5 border-t border-gray-50 pt-3">
                <button
                    type="button"
                    onClick={() => onEdit(plan)}
                    className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100"
                >
                    <Pencil size={12} />
                    Edit
                </button>
                <button
                    type="button"
                    onClick={() => onDelete(plan)}
                    className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50"
                >
                    <Trash2 size={12} />
                    Hapus
                </button>
            </div>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MembershipPlansIndex() {
    const { plans, flash } = usePage<Props>().props;

    const [slideOver, setSlideOver] = useState<{
        open: boolean;
        item: MembershipPlanItem | null;
    }>({ open: false, item: null });

    const openNew  = () => setSlideOver({ open: true, item: null });
    const openEdit = (item: MembershipPlanItem) => setSlideOver({ open: true, item });
    const close    = () => setSlideOver({ open: false, item: null });

    const handleDelete = (plan: MembershipPlanItem) => {
        if (!window.confirm(`Hapus paket "${plan.name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
        router.delete(route("admin.memberships.plans.destroy", plan.id));
    };

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4">
                    <span className="font-clash text-xs uppercase tracking-[0.2em] text-gray-400">
                        Manajemen Keanggotaan
                    </span>
                    <h1 className="font-monument text-3xl font-normal tracking-tight text-gray-900">
                        Paket Membership
                    </h1>
                </div>
            }
        >
            <Head title="Paket Membership" />

            <div className="flex flex-col gap-6 pt-6">
                {/* Flash banner */}
                {flash?.success && (
                    <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-inset ring-emerald-200">
                        {flash.success}
                    </div>
                )}

                {/* Toolbar */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        {plans.length} paket terdaftar ·{" "}
                        {plans.filter((p) => p.is_active).length} aktif
                    </p>
                    <button
                        type="button"
                        onClick={openNew}
                        className="flex items-center gap-2 rounded-2xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                    >
                        <Plus size={15} />
                        Tambah Paket
                    </button>
                </div>

                {/* Plan grid */}
                {plans.length === 0 ? (
                    <div className={`${ADMIN_TOKENS.CARD} flex flex-col items-center justify-center gap-3 py-16`}>
                        <Package size={32} className="text-gray-300" />
                        <p className="text-sm text-gray-400">Belum ada paket membership.</p>
                        <button
                            type="button"
                            onClick={openNew}
                            className="rounded-2xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                        >
                            Tambah Paket Pertama
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {plans.map((plan) => (
                            <PlanCard
                                key={plan.id}
                                plan={plan}
                                onEdit={openEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Create / Edit SlideOver */}
            <SlideOver
                isOpen={slideOver.open}
                onClose={close}
                title={slideOver.item ? "Edit Paket" : "Tambah Paket"}
                description={
                    slideOver.item
                        ? `Mengedit "${slideOver.item.name}"`
                        : "Isi detail paket membership baru."
                }
            >
                {slideOver.open && (
                    <PlanForm
                        key={slideOver.item?.id ?? "new"}
                        item={slideOver.item}
                        onClose={close}
                    />
                )}
            </SlideOver>
        </AdminLayout>
    );
}
