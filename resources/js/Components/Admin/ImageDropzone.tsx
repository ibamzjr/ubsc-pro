import { ImageIcon, Trash2, UploadCloud, Video } from "lucide-react";
import { useCallback, useState } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPT = { "image/jpeg": [], "image/png": [], "image/webp": [] };

// ─── Single-file mode ─────────────────────────────────────────────────────────

interface SingleDropzoneProps {
    label?: string;
    currentUrl?: string | null;
    onFileSelect: (file: File | null) => void;
}

export function SingleDropzone({
    label = "Hero Image",
    currentUrl,
    onFileSelect,
}: SingleDropzoneProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(
        (accepted: File[], rejected: FileRejection[]) => {
            setError(null);
            if (rejected.length > 0) {
                setError(rejected[0].errors[0]?.message ?? "Invalid file.");
                return;
            }
            if (accepted[0]) {
                setPreview(URL.createObjectURL(accepted[0]));
                onFileSelect(accepted[0]);
            }
        },
        [onFileSelect],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: ACCEPT,
        maxSize: MAX_SIZE,
        maxFiles: 1,
    });

    const displayUrl = preview ?? currentUrl ?? null;

    return (
        <div className="flex flex-col gap-2">
            <span className="font-clash text-xs font-medium uppercase tracking-wider text-gray-500">
                {label}
            </span>

            {displayUrl ? (
                <div className="group relative overflow-hidden rounded-2xl">
                    <img
                        src={displayUrl}
                        alt="Preview"
                        className="h-48 w-full object-cover"
                    />
                    <button
                        type="button"
                        onClick={() => {
                            setPreview(null);
                            onFileSelect(null);
                        }}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-xl bg-white/90 text-rose-500 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                        aria-label="Remove image"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={cn(
                        "flex h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed transition-colors",
                        isDragActive
                            ? "border-gray-900 bg-gray-50"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50",
                    )}
                >
                    <input {...getInputProps()} />
                    <UploadCloud size={22} className="text-gray-400" />
                    <p className="text-center text-xs text-gray-500">
                        {isDragActive
                            ? "Drop here"
                            : "Drag & drop or click to upload"}
                        <br />
                        <span className="text-gray-400">
                            JPG, PNG, WebP · max 5 MB
                        </span>
                    </p>
                </div>
            )}

            {error && (
                <p className="text-xs text-rose-500">{error}</p>
            )}
        </div>
    );
}

// ─── Video single-file dropzone ───────────────────────────────────────────────

const VIDEO_MAX_SIZE = 50 * 1024 * 1024; // 50 MB
const VIDEO_ACCEPT = { "video/mp4": [], "video/webm": [] };

interface VideoDropzoneProps {
    label?: string;
    currentUrl?: string | null;
    onFileSelect: (file: File | null) => void;
}

export function VideoDropzone({
    label = "Video",
    currentUrl,
    onFileSelect,
}: VideoDropzoneProps) {
    const [fileName, setFileName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(
        (accepted: File[], rejected: FileRejection[]) => {
            setError(null);
            if (rejected.length > 0) {
                const msg = rejected[0].errors[0]?.message ?? "File ditolak.";
                setError(msg.replace("50000000 bytes", "50 MB"));
                return;
            }
            if (accepted[0]) {
                setFileName(accepted[0].name);
                onFileSelect(accepted[0]);
            }
        },
        [onFileSelect],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: VIDEO_ACCEPT,
        maxSize: VIDEO_MAX_SIZE,
        maxFiles: 1,
    });

    const hasFile = fileName !== null || currentUrl;

    return (
        <div className="flex flex-col gap-2">
            <span className="font-clash text-xs font-medium uppercase tracking-wider text-gray-500">
                {label}
            </span>

            {hasFile ? (
                <div className="group relative flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <Video size={18} className="shrink-0 text-slate-400" />
                    <span className="flex-1 truncate font-bdo text-xs text-slate-600">
                        {fileName ?? currentUrl}
                    </span>
                    <button
                        type="button"
                        onClick={() => {
                            setFileName(null);
                            onFileSelect(null);
                        }}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white text-rose-400 shadow-sm transition hover:text-rose-600"
                        aria-label="Hapus video"
                    >
                        <Trash2 size={13} />
                    </button>
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={cn(
                        "flex h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed transition-colors",
                        isDragActive
                            ? "border-amber-400 bg-amber-50"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50",
                    )}
                >
                    <input {...getInputProps()} />
                    <Video size={22} className="text-gray-400" />
                    <p className="text-center text-xs text-gray-500">
                        {isDragActive ? "Lepaskan di sini" : "Drag & drop atau klik untuk upload"}
                        <br />
                        <span className="text-gray-400">MP4, WebM · maks 50 MB</span>
                    </p>
                </div>
            )}

            {error && <p className="text-xs text-rose-500">{error}</p>}
        </div>
    );
}

// ─── Multi-file mode ──────────────────────────────────────────────────────────

export interface ExistingMedia {
    id: number;
    url: string;
    name: string;
}

interface MultiDropzoneProps {
    label?: string;
    existing?: ExistingMedia[];
    onFilesSelect: (files: File[]) => void;
    onRemoveExisting: (id: number) => void;
}

export function MultiDropzone({
    label = "Gallery",
    existing = [],
    onFilesSelect,
    onRemoveExisting,
}: MultiDropzoneProps) {
    const [previews, setPreviews] = useState<
        { file: File; url: string }[]
    >([]);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(
        (accepted: File[], rejected: FileRejection[]) => {
            setError(null);
            if (rejected.length > 0) {
                setError(
                    rejected[0].errors[0]?.message ?? "Some files were rejected.",
                );
            }
            if (accepted.length > 0) {
                const newPreviews = accepted.map((file) => ({
                    file,
                    url: URL.createObjectURL(file),
                }));
                setPreviews((prev) => [...prev, ...newPreviews]);
                onFilesSelect(accepted);
            }
        },
        [onFilesSelect],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: ACCEPT,
        maxSize: MAX_SIZE,
    });

    const removePreview = (index: number) => {
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col gap-2">
            <span className="font-clash text-xs font-medium uppercase tracking-wider text-gray-500">
                {label}
            </span>

            {(existing.length > 0 || previews.length > 0) && (
                <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
                    {existing.map((img) => (
                        <div
                            key={img.id}
                            className="group relative overflow-hidden rounded-2xl"
                        >
                            <img
                                src={img.url}
                                alt={img.name}
                                className="h-24 w-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => onRemoveExisting(img.id)}
                                className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-xl bg-white/90 text-rose-500 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                                aria-label="Remove"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    ))}
                    {previews.map((p, i) => (
                        <div
                            key={p.url}
                            className="group relative overflow-hidden rounded-2xl ring-2 ring-blue-200"
                        >
                            <img
                                src={p.url}
                                alt="New"
                                className="h-24 w-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => removePreview(i)}
                                className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-xl bg-white/90 text-rose-500 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                                aria-label="Remove"
                            >
                                <Trash2 size={12} />
                            </button>
                            <span className="absolute bottom-1 left-1 rounded-lg bg-blue-500 px-1.5 py-0.5 text-[9px] font-medium text-white">
                                New
                            </span>
                        </div>
                    ))}
                </div>
            )}

            <div
                {...getRootProps()}
                className={cn(
                    "flex h-24 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-3xl border-2 border-dashed transition-colors",
                    isDragActive
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50",
                )}
            >
                <input {...getInputProps()} />
                <div className="flex items-center gap-1.5 text-gray-400">
                    <ImageIcon size={16} />
                    <span className="text-xs">
                        {isDragActive ? "Drop here" : "Add images"}
                    </span>
                </div>
            </div>

            {error && (
                <p className="text-xs text-rose-500">{error}</p>
            )}
        </div>
    );
}
