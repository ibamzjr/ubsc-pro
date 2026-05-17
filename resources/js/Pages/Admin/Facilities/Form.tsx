import { Head, router, useForm, usePage } from "@inertiajs/react";
import {
    ArrowLeft,
    Building2,
    ChevronDown,
    Database,
    Image,
    MapPin,
    Plus,
    Save,
    Settings2,
    SlidersHorizontal,
    Trash2,
} from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import {
    MultiDropzone,
    SingleDropzone,
    type ExistingMedia,
} from "@/Components/Admin/ImageDropzone";
import AdminLayout from "@/Layouts/AdminLayout";
import type { FacilityCategory, FacilityItem, PageProps } from "@/types";

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

    .animate-fade-in-up   { animation: fadeInUp  0.65s cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; will-change:opacity,transform; }
    .animate-fade-in-left { animation: fadeInLeft 0.55s cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; will-change:opacity,transform; }
    .animate-scale-in     { animation: scaleIn    0.5s  cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; }

    .delay-50  { animation-delay:  50ms; }
    .delay-100 { animation-delay: 100ms; }
    .delay-150 { animation-delay: 150ms; }
    .delay-200 { animation-delay: 200ms; }
    .delay-250 { animation-delay: 250ms; }
    .delay-300 { animation-delay: 300ms; }
    .delay-350 { animation-delay: 350ms; }
    .delay-400 { animation-delay: 400ms; }

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
        pointer-events: none;
        border-radius: inherit;
    }

    @keyframes iconGlow {
        0%, 100% { box-shadow: 0 2px 8px rgba(15,23,42,0.2); }
        50%       { box-shadow: 0 2px 16px rgba(15,23,42,0.3), 0 0 24px rgba(251,191,36,0.12); }
    }
    .icon-glow { animation: iconGlow 3.5s ease-in-out infinite; }

    .card-glint { position: relative; }
    .card-glint::before {
        content: '';
        position: absolute;
        top: 0; left: 20px; right: 20px; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent);
        pointer-events: none;
    }

    @keyframes thumbGlow {
        0%, 100% { box-shadow: 0 1px 4px rgba(0,0,0,0.2), 0 0 0 0 rgba(251,191,36,0); }
        50%       { box-shadow: 0 1px 8px rgba(0,0,0,0.25), 0 0 10px 2px rgba(251,191,36,0.35); }
    }
    .thumb-glow { animation: thumbGlow 2.5s ease-in-out infinite; }

    @keyframes btnSheen {
        0%   { left: -80%; }
        100% { left: 120%; }
    }
    .btn-sheen { position: relative; overflow: hidden; }
    .btn-sheen::before {
        content: '';
        position: absolute;
        top: 0; bottom: 0; width: 50%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        animation: btnSheen 3s ease-in-out 1s infinite;
    }

    .input-field {
        width: 100%;
        border-radius: 0.75rem;
        border: 1px solid rgb(226 232 240 / 0.8);
        background: rgb(248 250 252 / 0.5);
        padding: 0.75rem 1rem;
        font-family: 'BDO Grotesk', sans-serif;
        font-size: 0.875rem;
        color: #0f172a;
        transition: all 0.15s;
        outline: none;
    }
    .input-field::placeholder { color: rgb(148 163 184); }
    .input-field:focus {
        background: white;
        border-color: rgb(139 92 246 / 0.6);
        box-shadow: 0 0 0 4px rgb(139 92 246 / 0.08);
    }
    .input-field.mono { font-family: 'ui-monospace', 'SFMono-Regular', monospace; font-size: 0.8125rem; }

    .section-divider {
        height: 1px;
        background: linear-gradient(90deg, transparent, rgb(226 232 240), transparent);
        margin: 0.25rem 0;
    }
`;

// ── Metadata types ────────────────────────────────────────────────────────────

interface Period {
    label: string;
    harga: string;
}
interface DaftarHargaItem {
    label: string;
    harga: string;
}
interface DetailItem {
    key: string;
    value: string;
}
interface MetadataState {
    periods: Period[];
    daftarHarga: { left: DaftarHargaItem[]; right: DaftarHargaItem[] };
    additionalDetails: DetailItem[];
}

function emptyMeta(): MetadataState {
    return { periods: [], daftarHarga: { left: [], right: [] }, additionalDetails: [] };
}

function parseMeta(raw: Record<string, unknown> | null | undefined): MetadataState {
    if (!raw) return emptyMeta();
    const dh = raw.daftarHarga as { left?: DaftarHargaItem[]; right?: DaftarHargaItem[] } | undefined;
    return {
        periods:           (raw.periods as Period[]) ?? [],
        daftarHarga:       { left: dh?.left ?? [], right: dh?.right ?? [] },
        additionalDetails: (raw.additionalDetails as DetailItem[]) ?? [],
    };
}

function hasMetaContent(m: MetadataState): boolean {
    return (
        m.periods.length > 0 ||
        m.daftarHarga.left.length > 0 ||
        m.daftarHarga.right.length > 0 ||
        m.additionalDetails.length > 0
    );
}

// ── Form types ────────────────────────────────────────────────────────────────

type Props = PageProps<{
    categories: Pick<FacilityCategory, "id" | "name">[];
    facility: FacilityItem | null;
}>;

type FormData = {
    facility_category_id: number | "";
    name: string;
    slug: string;
    description: string;
    location: string;
    venue_type: string;
    capacity: number;
    active_slots: Record<string, string[]> | null;
    class_code: string;
    rating: number;
    display_metadata: string;
    is_active: boolean;
    sort_order: number;
    hero: File | null;
    gallery: File[];
    _method?: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugify(str: string): string {
    return str.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

const LOCATIONS = ["Veteran", "Dieng"];
const VENUE_TYPES = ["Arena Tertutup", "Arena Terbuka", "Kelas & Kebugaran"];

// ── CreatableSelect Component ─────────────────────────────────────────────────

function CreatableSelect({
    value,
    onChange,
    options,
    placeholder,
    error,
}: {
    value: string;
    onChange: (val: string) => void;
    options: string[];
    placeholder: string;
    error?: string;
}) {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState(value);
    const [dropStyle, setDropStyle] = useState<React.CSSProperties>({});
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Sync input with external value changes (e.g. form reset)
    useEffect(() => { setInput(value); }, [value]);

    // Position the portal dropdown below the input
    useEffect(() => {
        if (!open || !wrapperRef.current) return;
        const rect = wrapperRef.current.getBoundingClientRect();
        setDropStyle({
            position: "fixed",
            top: rect.bottom + 4,
            left: rect.left,
            width: rect.width,
            zIndex: 9999,
        });
    }, [open]);

    // Close when clicking outside wrapper OR the portal dropdown
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            const t = e.target as HTMLElement;
            if (
                !wrapperRef.current?.contains(t) &&
                !t.closest("[data-crselect-drop]")
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    const filtered = input
        ? options.filter((opt) => opt.toLowerCase().includes(input.toLowerCase()))
        : options;
    const isCustom = input.trim() !== "" && !options.includes(input.trim());

    const handleSelect = (val: string) => { onChange(val); setInput(val); setOpen(false); };
    const handleCustom = () => { if (input.trim()) { onChange(input.trim()); setOpen(false); } };

    const dropdown = open
        ? createPortal(
              <div data-crselect-drop style={dropStyle} className="bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                  {filtered.map((opt) => (
                      <button
                          key={opt}
                          type="button"
                          onClick={() => handleSelect(opt)}
                          className="w-full text-left px-3 py-2 hover:bg-amber-50 font-bdo text-sm transition-colors"
                      >
                          {opt}
                      </button>
                  ))}
                  {isCustom && (
                      <div className={filtered.length > 0 ? "border-t border-slate-100" : ""}>
                          <button
                              type="button"
                              onClick={handleCustom}
                              className="w-full text-left px-3 py-2 hover:bg-amber-50 font-bdo text-sm text-amber-600 flex items-center gap-2 transition-colors"
                          >
                              <Plus size={14} /> Tambahkan "{input.trim()}"
                          </button>
                      </div>
                  )}
                  {!filtered.length && !isCustom && (
                      <div className="px-3 py-2 font-bdo text-sm text-slate-400">Tidak ada opsi</div>
                  )}
              </div>,
              document.body
          )
        : null;

    return (
        <div ref={wrapperRef} className="relative">
            <div className="relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        onChange(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") { e.preventDefault(); handleCustom(); }
                        if (e.key === "Escape") setOpen(false);
                    }}
                    placeholder={placeholder}
                    className="input-field w-full pr-9"
                />
                <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
            </div>
            {dropdown}
            {error && <p className="mt-1.5 font-bdo text-[11px] text-rose-500">{error}</p>}
        </div>
    );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ShinyIcon({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`relative flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-600 to-slate-900 shadow-[0_2px_10px_rgba(15,23,42,0.22),inset_0_1px_0_rgba(255,255,255,0.12)] icon-glow ${className ?? ""}`}>
            {children}
            <span className="pointer-events-none absolute top-[3px] left-[5px] right-[5px] h-[5px] rounded-full bg-white/20 blur-[1px]" />
        </div>
    );
}

function SectionCard({
    icon,
    accentColor = "amber",
    title,
    subtitle,
    children,
    className = "",
    animDelay = "delay-100",
}: {
    icon: React.ReactNode;
    accentColor?: "amber" | "violet" | "sky" | "emerald" | "rose";
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    className?: string;
    animDelay?: string;
}) {
    const iconColors: Record<string, string> = {
        amber:   "text-amber-300",
        violet:  "text-violet-300",
        sky:     "text-sky-300",
        emerald: "text-emerald-300",
        rose:    "text-rose-300",
    };

    return (
        <div className={`animate-fade-in-up ${animDelay} card-glint shimmer-once relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-shadow duration-300 hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)] ${className}`}>
            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
                <ShinyIcon className="h-9 w-9">
                    <span className={iconColors[accentColor]}>{icon}</span>
                </ShinyIcon>
                <div>
                    <p className="font-clash text-sm font-semibold text-slate-800 leading-tight">{title}</p>
                    {subtitle && <p className="font-bdo text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
                </div>
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
}

function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => onChange(!enabled)}
            className={`relative inline-flex h-[26px] w-12 shrink-0 rounded-full p-[3px] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 cursor-pointer ${
                enabled
                    ? "bg-gradient-to-r from-amber-400 to-yellow-500 shadow-[0_2px_8px_rgba(251,191,36,0.4),inset_0_1px_0_rgba(255,255,255,0.3)]"
                    : "bg-slate-200 shadow-[inset_0_1px_3px_rgba(0,0,0,0.12)]"
            }`}
        >
            <span className={`relative inline-block h-5 w-5 rounded-full bg-white transition-all duration-300 ${enabled ? "translate-x-[22px] shadow-[0_1px_4px_rgba(0,0,0,0.2)] thumb-glow" : "translate-x-0 shadow-[0_1px_3px_rgba(0,0,0,0.15)]"}`}>
                <span className="pointer-events-none absolute top-[3px] left-[3px] right-[3px] h-[5px] rounded-full bg-white/70 blur-[0.5px]" />
            </span>
        </button>
    );
}

// ── MetadataBuilder ───────────────────────────────────────────────────────────

function SubSection({
    label,
    count,
    open,
    onToggle,
    children,
    hint,
}: {
    label: string;
    count: number;
    open: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    hint?: string;
}) {
    return (
        <div className="rounded-xl border border-slate-200/80 overflow-hidden">
            <button
                type="button"
                onClick={onToggle}
                className="flex w-full items-center justify-between bg-slate-50/80 px-4 py-3 text-left transition-colors hover:bg-slate-100/80"
            >
                <div className="flex items-center gap-2.5">
                    <span className="font-clash text-xs font-semibold text-slate-700">{label}</span>
                    {count > 0 && (
                        <span className="rounded-full bg-violet-100 px-2 py-0.5 font-bdo text-[10px] font-bold text-violet-600">
                            {count}
                        </span>
                    )}
                    {hint && (
                        <span className="font-bdo text-[10px] text-slate-400 hidden sm:inline">{hint}</span>
                    )}
                </div>
                <ChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>
            {open && <div className="p-4 border-t border-slate-200/80">{children}</div>}
        </div>
    );
}

function RowInput({
    fields,
    onDelete,
    children,
}: {
    fields: React.ReactNode;
    onDelete: () => void;
    children?: never;
}) {
    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 grid grid-cols-2 gap-2">{fields}</div>
            <button
                type="button"
                onClick={onDelete}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
            >
                <Trash2 size={13} />
            </button>
        </div>
    );
}

function AddRowButton({ label, onClick }: { label: string; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 py-2 font-bdo text-xs text-slate-500 transition-colors hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
        >
            <Plus size={12} />
            {label}
        </button>
    );
}

function MetadataBuilder({
    value,
    onChange,
}: {
    value: MetadataState;
    onChange: (next: MetadataState) => void;
}) {
    const [open, setOpen] = useState({ periods: true, daftarHarga: false, details: false });

    const setPeriods = (periods: Period[]) => onChange({ ...value, periods });
    const setDH      = (daftarHarga: MetadataState["daftarHarga"]) => onChange({ ...value, daftarHarga });
    const setDetails = (additionalDetails: DetailItem[]) => onChange({ ...value, additionalDetails });

    const fieldClass = "flex-1 rounded-lg border border-slate-200/80 bg-white px-3 py-1.5 font-bdo text-xs text-slate-800 placeholder:text-slate-300 focus:border-violet-400/60 focus:outline-none focus:ring-2 focus:ring-violet-100";

    return (
        <div className="flex flex-col gap-3">

            {/* ── Periode Waktu ── */}
            <SubSection
                label="Periode Waktu"
                count={value.periods.length}
                open={open.periods}
                onToggle={() => setOpen((s) => ({ ...s, periods: !s.periods }))}
                hint="(e.g. Pagi / Siang / Malam)"
            >
                <div className="flex flex-col gap-2">
                    {value.periods.length === 0 && (
                        <p className="font-bdo text-[11px] text-slate-400 text-center py-1">Belum ada periode. Tambahkan di bawah.</p>
                    )}
                    {value.periods.map((p, i) => (
                        <RowInput
                            key={i}
                            fields={
                                <>
                                    <input
                                        type="text"
                                        value={p.label}
                                        onChange={(e) => {
                                            const next = [...value.periods];
                                            next[i] = { ...p, label: e.target.value };
                                            setPeriods(next);
                                        }}
                                        placeholder="Label (e.g. Pagi)"
                                        className={fieldClass}
                                    />
                                    <input
                                        type="text"
                                        value={p.harga}
                                        onChange={(e) => {
                                            const next = [...value.periods];
                                            next[i] = { ...p, harga: e.target.value };
                                            setPeriods(next);
                                        }}
                                        placeholder="Harga (e.g. Rp 50.000/Jam)"
                                        className={fieldClass}
                                    />
                                </>
                            }
                            onDelete={() => setPeriods(value.periods.filter((_, j) => j !== i))}
                        />
                    ))}
                    <AddRowButton label="Tambah Periode" onClick={() => setPeriods([...value.periods, { label: "", harga: "" }])} />
                </div>
            </SubSection>

            {/* ── Daftar Harga (Kolom Kiri / Kanan) ── */}
            <SubSection
                label="Daftar Harga (Dual Column)"
                count={value.daftarHarga.left.length + value.daftarHarga.right.length}
                open={open.daftarHarga}
                onToggle={() => setOpen((s) => ({ ...s, daftarHarga: !s.daftarHarga }))}
                hint="(e.g. Yoga: warga_ub / umum)"
            >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Left column */}
                    <div>
                        <p className="font-clash text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                            Kolom Kiri
                        </p>
                        <div className="flex flex-col gap-2">
                            {value.daftarHarga.left.map((item, i) => (
                                <RowInput
                                    key={i}
                                    fields={
                                        <>
                                            <input
                                                type="text"
                                                value={item.label}
                                                onChange={(e) => {
                                                    const next = [...value.daftarHarga.left];
                                                    next[i] = { ...item, label: e.target.value };
                                                    setDH({ ...value.daftarHarga, left: next });
                                                }}
                                                placeholder="Label"
                                                className={fieldClass}
                                            />
                                            <input
                                                type="text"
                                                value={item.harga}
                                                onChange={(e) => {
                                                    const next = [...value.daftarHarga.left];
                                                    next[i] = { ...item, harga: e.target.value };
                                                    setDH({ ...value.daftarHarga, left: next });
                                                }}
                                                placeholder="Harga"
                                                className={fieldClass}
                                            />
                                        </>
                                    }
                                    onDelete={() => setDH({ ...value.daftarHarga, left: value.daftarHarga.left.filter((_, j) => j !== i) })}
                                />
                            ))}
                            <AddRowButton label="+ Kiri" onClick={() => setDH({ ...value.daftarHarga, left: [...value.daftarHarga.left, { label: "", harga: "" }] })} />
                        </div>
                    </div>

                    {/* Right column */}
                    <div>
                        <p className="font-clash text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                            Kolom Kanan
                        </p>
                        <div className="flex flex-col gap-2">
                            {value.daftarHarga.right.map((item, i) => (
                                <RowInput
                                    key={i}
                                    fields={
                                        <>
                                            <input
                                                type="text"
                                                value={item.label}
                                                onChange={(e) => {
                                                    const next = [...value.daftarHarga.right];
                                                    next[i] = { ...item, label: e.target.value };
                                                    setDH({ ...value.daftarHarga, right: next });
                                                }}
                                                placeholder="Label"
                                                className={fieldClass}
                                            />
                                            <input
                                                type="text"
                                                value={item.harga}
                                                onChange={(e) => {
                                                    const next = [...value.daftarHarga.right];
                                                    next[i] = { ...item, harga: e.target.value };
                                                    setDH({ ...value.daftarHarga, right: next });
                                                }}
                                                placeholder="Harga"
                                                className={fieldClass}
                                            />
                                        </>
                                    }
                                    onDelete={() => setDH({ ...value.daftarHarga, right: value.daftarHarga.right.filter((_, j) => j !== i) })}
                                />
                            ))}
                            <AddRowButton label="+ Kanan" onClick={() => setDH({ ...value.daftarHarga, right: [...value.daftarHarga.right, { label: "", harga: "" }] })} />
                        </div>
                    </div>
                </div>
            </SubSection>

            {/* ── Additional Details ── */}
            <SubSection
                label="Detail Tambahan"
                count={value.additionalDetails.length}
                open={open.details}
                onToggle={() => setOpen((s) => ({ ...s, details: !s.details }))}
                hint="(key-value pairs)"
            >
                <div className="flex flex-col gap-2">
                    {value.additionalDetails.length === 0 && (
                        <p className="font-bdo text-[11px] text-slate-400 text-center py-1">Belum ada detail. Tambahkan di bawah.</p>
                    )}
                    {value.additionalDetails.map((d, i) => (
                        <RowInput
                            key={i}
                            fields={
                                <>
                                    <input
                                        type="text"
                                        value={d.key}
                                        onChange={(e) => {
                                            const next = [...value.additionalDetails];
                                            next[i] = { ...d, key: e.target.value };
                                            setDetails(next);
                                        }}
                                        placeholder="Key (e.g. Kapasitas)"
                                        className={fieldClass}
                                    />
                                    <input
                                        type="text"
                                        value={d.value}
                                        onChange={(e) => {
                                            const next = [...value.additionalDetails];
                                            next[i] = { ...d, value: e.target.value };
                                            setDetails(next);
                                        }}
                                        placeholder="Value (e.g. 20 orang)"
                                        className={fieldClass}
                                    />
                                </>
                            }
                            onDelete={() => setDetails(value.additionalDetails.filter((_, j) => j !== i))}
                        />
                    ))}
                    <AddRowButton label="Tambah Detail" onClick={() => setDetails([...value.additionalDetails, { key: "", value: "" }])} />
                </div>
            </SubSection>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function FacilityForm() {
    const { categories, facility } = usePage<Props>().props;
    const isEdit = facility !== null;

    const [metadata, setMetadata] = useState<MetadataState>(
        parseMeta(facility?.display_metadata)
    );

    const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
    const WEEKDAY_ID: Record<string, string> = { Monday: "Senin", Tuesday: "Selasa", Wednesday: "Rabu", Thursday: "Kamis", Friday: "Jumat", Saturday: "Sabtu", Sunday: "Minggu" };

    const [useWeeklySchedule, setUseWeeklySchedule] = useState(facility?.active_slots != null);
    const [dayTexts, setDayTexts] = useState<Record<string, string>>(
        WEEKDAYS.reduce((acc, day) => ({
            ...acc,
            [day]: facility?.active_slots?.[day]?.join(", ") ?? "",
        }), {} as Record<string, string>)
    );

    const { data, setData, post, processing, errors } = useForm<FormData>({
        facility_category_id: facility?.category?.id ?? "",
        name:             facility?.name ?? "",
        slug:             facility?.slug ?? "",
        description:      facility?.description ?? "",
        location:         facility?.location ?? "",
        venue_type:       facility?.venue_type ?? "",
        capacity:         facility?.capacity ?? 1,
        active_slots:     facility?.active_slots ?? null,
        class_code:       facility?.class_code ?? "",
        rating:           facility?.rating ?? 5.0,
        display_metadata: facility?.display_metadata ? JSON.stringify(facility.display_metadata) : "",
        is_active:        facility?.is_active ?? true,
        sort_order:       facility?.sort_order ?? 0,
        hero:             null,
        gallery:          [],
        ...(isEdit ? { _method: "PUT" } : {}),
    });

    // Sync name → slug (create mode only)
    useEffect(() => {
        if (!isEdit && data.name) {
            setData("slug", slugify(data.name));
        }
    }, [data.name, isEdit]);

    // Sync metadata state → form JSON string
    useEffect(() => {
        setData(
            "display_metadata",
            hasMetaContent(metadata) ? JSON.stringify(metadata) : "",
        );
    }, [metadata]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEdit
            ? route("admin.facilities.update", facility!.id)
            : route("admin.facilities.store");
        post(url, { forceFormData: true });
    };

    const existingHeroUrl   = facility?.hero?.url ?? null;
    const existingGallery: ExistingMedia[] = facility?.gallery ?? [];

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4 animate-fade-in-up">
                    <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
                    <span className="font-bdo text-[11px] font-medium tracking-wide text-slate-400">
                        {isEdit ? "Edit Fasilitas" : "Fasilitas Baru"}
                    </span>
                    <h1 className="font-clash text-3xl font-bold uppercase tracking-tight xl:text-4xl text-slate-900">
                        {isEdit ? facility!.name : "Buat Fasilitas"}
                    </h1>
                </div>
            }
        >
            <Head title={isEdit ? `Edit ${facility!.name}` : "New Facility"} />

            <form
                onSubmit={submit}
                className="flex flex-col gap-6 pt-6 pb-20"
                encType="multipart/form-data"
            >
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

                    {/* ═══ LEFT — Main fields (spans 2 cols) ═══ */}
                    <SectionCard
                        icon={<Building2 size={15} />}
                        accentColor="sky"
                        title="Informasi Utama"
                        subtitle="Data dasar dan deskripsi fasilitas"
                        className="xl:col-span-2"
                        animDelay="delay-100"
                    >
                        <div className="flex flex-col gap-5">

                            {/* Category */}
                            <div>
                                <label className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                                    Kategori
                                </label>
                                <select
                                    value={data.facility_category_id}
                                    onChange={(e) => setData("facility_category_id", Number(e.target.value))}
                                    className="input-field"
                                >
                                    <option value="">Pilih kategori…</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                {errors.facility_category_id && (
                                    <p className="mt-1.5 font-bdo text-[11px] text-rose-500">{errors.facility_category_id}</p>
                                )}
                            </div>

                            {/* Name */}
                            <div>
                                <label className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                                    Nama Fasilitas
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    placeholder="Lapangan Bulutangkis Hall A"
                                    className="input-field"
                                />
                                {errors.name && (
                                    <p className="mt-1.5 font-bdo text-[11px] text-rose-500">{errors.name}</p>
                                )}
                            </div>

                            {/* Slug */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        Slug URL
                                    </label>
                                    <span className="font-bdo text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg ring-1 ring-slate-200/80">
                                        Auto-generate dari nama
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    value={data.slug}
                                    onChange={(e) => setData("slug", e.target.value)}
                                    placeholder="lapangan-bulutangkis-hall-a"
                                    className="input-field mono"
                                />
                                {errors.slug && (
                                    <p className="mt-1.5 font-bdo text-[11px] text-rose-500">{errors.slug}</p>
                                )}
                            </div>

                            <div className="section-divider" />

                            {/* Description */}
                            <div>
                                <label className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                                    Deskripsi
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData("description", e.target.value)}
                                    rows={4}
                                    placeholder="Deskripsikan fasilitas ini…"
                                    className="input-field resize-none leading-relaxed"
                                />
                                {errors.description && (
                                    <p className="mt-1.5 font-bdo text-[11px] text-rose-500">{errors.description}</p>
                                )}
                            </div>
                        </div>
                    </SectionCard>

                    {/* ═══ RIGHT — Settings + Media ═══ */}
                    <div className="flex flex-col gap-5">

                        {/* Settings */}
                        <SectionCard
                            icon={<SlidersHorizontal size={15} />}
                            accentColor="amber"
                            title="Pengaturan"
                            subtitle="Status dan urutan tampil"
                            animDelay="delay-150"
                        >
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between rounded-xl bg-slate-50/80 px-4 py-3.5 ring-1 ring-slate-200/60 transition-all hover:bg-white hover:ring-slate-200">
                                    <div>
                                        <p className="font-clash text-sm font-semibold text-slate-800">
                                            Tampilkan di Situs
                                        </p>
                                        <p className="font-bdo text-[11px] text-slate-400 mt-0.5">
                                            {data.is_active ? "Fasilitas aktif & terlihat" : "Tersembunyi dari publik"}
                                        </p>
                                    </div>
                                    <ToggleSwitch enabled={data.is_active} onChange={(v) => setData("is_active", v)} />
                                </div>

                                <div className="section-divider" />

                                <div>
                                    <label className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                                        Urutan Tampil
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={data.sort_order}
                                        onChange={(e) => setData("sort_order", Number(e.target.value))}
                                        className="input-field mono"
                                    />
                                    <p className="mt-1.5 font-bdo text-[10px] text-slate-400">
                                        Angka lebih kecil tampil lebih dulu
                                    </p>
                                </div>

                                <div className="section-divider" />

                                <div>
                                    <label className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                                        Kapasitas Maksimal
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={9999}
                                        value={data.capacity}
                                        onChange={(e) => setData("capacity", parseInt(e.target.value) || 1)}
                                        className="input-field mono"
                                    />
                                    <p className="mt-1.5 font-bdo text-[10px] text-slate-400">
                                        1 = lapangan eksklusif. &gt;1 = kelas bersama (misal 35 untuk Yoga).
                                    </p>
                                    {errors.capacity && (
                                        <p className="mt-1.5 font-bdo text-[11px] text-rose-500">{errors.capacity}</p>
                                    )}
                                </div>

                                <div className="section-divider" />

                                {/* Weekly Schedule Toggle */}
                                <div>
                                    <div className="flex items-center justify-between rounded-xl bg-slate-50/80 px-4 py-3.5 ring-1 ring-slate-200/60 transition-all hover:bg-white hover:ring-slate-200">
                                        <div>
                                            <p className="font-clash text-sm font-semibold text-slate-800">
                                                Jadwal Berbasis Hari
                                            </p>
                                            <p className="font-bdo text-[11px] text-slate-400 mt-0.5">
                                                {useWeeklySchedule ? "Aktif — slot per hari" : "Nonaktif — 06:00–22:00 otomatis"}
                                            </p>
                                        </div>
                                        <ToggleSwitch
                                            enabled={useWeeklySchedule}
                                            onChange={(v) => {
                                                setUseWeeklySchedule(v);
                                                setData("active_slots", v
                                                    ? WEEKDAYS.reduce((acc, day) => {
                                                        const parsed = dayTexts[day]
                                                            .split(",").map((s) => s.trim())
                                                            .filter((s) => /^\d{2}:\d{2}$/.test(s));
                                                        return { ...acc, [day]: parsed };
                                                    }, {} as Record<string, string[]>)
                                                    : null
                                                );
                                            }}
                                        />
                                    </div>

                                    {useWeeklySchedule && (
                                        <div className="mt-3 flex flex-col gap-2">
                                            {WEEKDAYS.map((day) => (
                                                <div key={day} className="flex items-center gap-3">
                                                    <span className="w-16 shrink-0 font-bdo text-[11px] font-bold text-slate-500">
                                                        {WEEKDAY_ID[day]}
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={dayTexts[day]}
                                                        onChange={(e) => {
                                                            const txt = e.target.value;
                                                            setDayTexts((p) => ({ ...p, [day]: txt }));
                                                            const parsed = txt
                                                                .split(",").map((s) => s.trim())
                                                                .filter((s) => /^\d{2}:\d{2}$/.test(s));
                                                            setData("active_slots", {
                                                                ...(data.active_slots ?? {}),
                                                                [day]: parsed,
                                                            });
                                                        }}
                                                        placeholder="misal: 16:00, 19:00"
                                                        className="input-field mono flex-1"
                                                    />
                                                </div>
                                            ))}
                                            <p className="mt-1 font-bdo text-[10px] text-slate-400">
                                                Kosongkan hari yang libur. Format: HH:MM dipisah koma.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </SectionCard>

                        {/* Media */}
                        <SectionCard
                            icon={<Image size={15} />}
                            accentColor="violet"
                            title="Media"
                            subtitle="Hero image & galeri foto"
                            animDelay="delay-200"
                        >
                            <div className="flex flex-col gap-6">
                                <div>
                                    <p className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
                                        Hero Image
                                    </p>
                                    <SingleDropzone
                                        label="Hero Image"
                                        currentUrl={existingHeroUrl}
                                        onFileSelect={(file) => setData("hero", file)}
                                    />
                                </div>
                                <div className="section-divider" />
                                <div>
                                    <p className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
                                        Galeri
                                    </p>
                                    <MultiDropzone
                                        label="Gallery"
                                        existing={existingGallery}
                                        onFilesSelect={(files) => setData("gallery", [...data.gallery, ...files])}
                                        onRemoveExisting={(id) => {
                                            router.delete(
                                                route("admin.facilities.gallery.destroy", id),
                                                { preserveScroll: true },
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                        </SectionCard>
                    </div>
                </div>

                {/* ═══ FULL-WIDTH ROW 2 — Display Info + Badge ═══ */}
                <SectionCard
                    icon={<MapPin size={15} />}
                    accentColor="emerald"
                    title="Info Tampil & Badge"
                    subtitle="Lokasi, tipe venue, kode kelas, dan rating untuk komponen publik"
                    animDelay="delay-250"
                >
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

                        {/* Location */}
                        <div>
                            <label className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                                Lokasi
                            </label>
                            <CreatableSelect
                                value={data.location}
                                onChange={(val) => setData("location", val)}
                                options={LOCATIONS}
                                placeholder="Pilih atau ketik lokasi…"
                                error={errors.location}
                            />
                        </div>

                        {/* Venue Type */}
                        <div>
                            <label className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                                Tipe Venue
                            </label>
                            <CreatableSelect
                                value={data.venue_type}
                                onChange={(val) => setData("venue_type", val)}
                                options={VENUE_TYPES}
                                placeholder="Pilih atau ketik tipe…"
                                error={errors.venue_type}
                            />
                        </div>

                        {/* Class Code */}
                        <div>
                            <label className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                                Kode Kelas
                            </label>
                            <input
                                type="text"
                                value={data.class_code}
                                onChange={(e) => setData("class_code", e.target.value)}
                                placeholder="/Class 003/"
                                className="input-field mono"
                            />
                            <p className="mt-1.5 font-bdo text-[10px] text-slate-400">
                                Opsional — untuk komponen kelas
                            </p>
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="font-bdo text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                                Rating (0–5)
                            </label>
                            <input
                                type="number"
                                min={0}
                                max={5}
                                step={0.1}
                                value={data.rating}
                                onChange={(e) => setData("rating", Number(e.target.value))}
                                className="input-field mono"
                            />
                            <p className="mt-1.5 font-bdo text-[10px] text-slate-400">
                                Ditampilkan sebagai bintang di Section 6
                            </p>
                        </div>
                    </div>
                </SectionCard>

                {/* ═══ FULL-WIDTH ROW 3 — Display Metadata Builder ═══ */}
                <SectionCard
                    icon={<Database size={15} />}
                    accentColor="rose"
                    title="Display Metadata"
                    subtitle="Harga per periode, daftar harga, dan detail tambahan untuk UI publik"
                    animDelay="delay-300"
                >
                    <MetadataBuilder value={metadata} onChange={setMetadata} />

                    {hasMetaContent(metadata) && (
                        <details className="mt-4">
                            <summary className="cursor-pointer font-bdo text-[10px] text-slate-400 hover:text-slate-600 select-none">
                                Pratinjau JSON (readonly)
                            </summary>
                            <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-50 p-3 font-mono text-[10px] text-slate-500 ring-1 ring-slate-200/80">
                                {JSON.stringify(metadata, null, 2)}
                            </pre>
                        </details>
                    )}
                </SectionCard>

                {/* ── Action bar ── */}
                <div className="animate-fade-in-up delay-400 flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
                    <a
                        href={route("admin.facilities.index")}
                        className="flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-clash text-sm font-semibold text-slate-600 bg-slate-100 transition-all hover:bg-slate-200 hover:text-slate-900"
                    >
                        <ArrowLeft size={14} />
                        Batal
                    </a>

                    <div className="hidden sm:block section-divider w-px h-8 mx-1" />

                    <p className="flex-1 font-bdo text-[11px] text-slate-400 text-center sm:text-left hidden sm:block">
                        {isEdit
                            ? "Perubahan akan langsung diterapkan setelah disimpan."
                            : "Fasilitas baru akan langsung tersedia untuk dikonfigurasi."
                        }
                    </p>

                    <button
                        type="submit"
                        disabled={processing}
                        className="btn-sheen relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 px-7 py-2.5 font-clash text-sm font-semibold text-white transition-all shadow-[0_4px_14px_rgba(5,150,105,0.35),inset_0_1px_0_rgba(255,255,255,0.15)] hover:shadow-[0_6px_20px_rgba(5,150,105,0.45)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                    >
                        <span className="pointer-events-none absolute top-0 left-0 right-0 h-px rounded-t-xl bg-white/20" />
                        <Save size={14} />
                        {processing ? "Menyimpan…" : isEdit ? "Simpan Perubahan" : "Buat Fasilitas"}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
