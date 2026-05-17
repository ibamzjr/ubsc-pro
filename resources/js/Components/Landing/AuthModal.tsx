import { useForm } from "@inertiajs/react";
import { Eye, EyeOff, Lock, Mail, User, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEventHandler } from "react";
import InputError from "@/Components/InputError";
import { cn } from "@/lib/utils";

type Tab = "login" | "register";

interface Props {
    open: boolean;
    initialTab?: Tab;
    onClose: () => void;
}

function LoginForm({ onSwitchTab }: { onSwitchTab: () => void }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false as boolean,
    });

    const [showPw, setShowPw] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("login"), { onFinish: () => reset("password") });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-4">
            <div>
                <label className={labelCls}>Email</label>
                <div className="relative">
                    <Mail className={iconCls} />
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        placeholder="nama@email.com"
                        autoComplete="username"
                        required
                        className={cn(inputCls, "pl-10", errors.email && errorRing)}
                    />
                </div>
                <InputError message={errors.email} className="mt-1 text-[11px]" />
            </div>

            <div>
                <label className={labelCls}>Password</label>
                <div className="relative">
                    <Lock className={iconCls} />
                    <input
                        type={showPw ? "text" : "password"}
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        required
                        className={cn(inputCls, "pl-10 pr-11", errors.password && errorRing)}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPw((v) => !v)}
                        tabIndex={-1}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                    >
                        {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
                <InputError message={errors.password} className="mt-1 text-[11px]" />
            </div>

            <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2">
                    <input
                        type="checkbox"
                        checked={data.remember}
                        onChange={(e) => setData("remember", e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 text-orange-500 focus:ring-orange-500/30"
                    />
                    <span className="font-bdo text-[12px] text-white/40">Ingat saya</span>
                </label>
                <a
                    href={route("password.request")}
                    className="font-bdo text-[12px] text-white/40 hover:text-orange-400 transition-colors"
                >
                    Lupa password?
                </a>
            </div>

            <button
                type="submit"
                disabled={processing}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 py-3 font-clash text-[14px] font-semibold text-white shadow-[inset_0_-6px_12px_-4px_rgba(0,0,0,0.3)] transition-all hover:opacity-90 hover:scale-[0.99] disabled:opacity-50 disabled:scale-100"
            >
                {processing ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : null}
                {processing ? "Memproses…" : "Masuk"}
            </button>

            <p className="text-center font-bdo text-[12px] text-white/30">
                Belum punya akun?{" "}
                <button
                    type="button"
                    onClick={onSwitchTab}
                    className="font-semibold text-orange-400 hover:text-orange-300 transition-colors"
                >
                    Daftar sekarang
                </button>
            </p>
        </form>
    );
}

function RegisterForm({ onSwitchTab }: { onSwitchTab: () => void }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [showPw, setShowPw] = useState(false);
    const [showPwC, setShowPwC] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-4">
            <div>
                <label className={labelCls}>Nama Lengkap</label>
                <div className="relative">
                    <User className={iconCls} />
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        placeholder="Nama lengkap kamu"
                        autoComplete="name"
                        required
                        className={cn(inputCls, "pl-10", errors.name && errorRing)}
                    />
                </div>
                <InputError message={errors.name} className="mt-1 text-[11px]" />
            </div>

            <div>
                <label className={labelCls}>Email</label>
                <div className="relative">
                    <Mail className={iconCls} />
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        placeholder="nama@email.com"
                        autoComplete="username"
                        required
                        className={cn(inputCls, "pl-10", errors.email && errorRing)}
                    />
                </div>
                <InputError message={errors.email} className="mt-1 text-[11px]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={labelCls}>Password</label>
                    <div className="relative">
                        <Lock className={iconCls} />
                        <input
                            type={showPw ? "text" : "password"}
                            value={data.password}
                            onChange={(e) => setData("password", e.target.value)}
                            placeholder="Min. 8 karakter"
                            autoComplete="new-password"
                            required
                            className={cn(inputCls, "pl-10 pr-11", errors.password && errorRing)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPw((v) => !v)}
                            tabIndex={-1}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                        >
                            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    <InputError message={errors.password} className="mt-1 text-[11px]" />
                </div>

                <div>
                    <label className={labelCls}>Konfirmasi</label>
                    <div className="relative">
                        <Lock className={iconCls} />
                        <input
                            type={showPwC ? "text" : "password"}
                            value={data.password_confirmation}
                            onChange={(e) => setData("password_confirmation", e.target.value)}
                            placeholder="Ulangi password"
                            autoComplete="new-password"
                            required
                            className={cn(inputCls, "pl-10 pr-11", errors.password_confirmation && errorRing)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPwC((v) => !v)}
                            tabIndex={-1}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                        >
                            {showPwC ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    <InputError message={errors.password_confirmation} className="mt-1 text-[11px]" />
                </div>
            </div>

            <button
                type="submit"
                disabled={processing}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 py-3 font-clash text-[14px] font-semibold text-white shadow-[inset_0_-6px_12px_-4px_rgba(0,0,0,0.3)] transition-all hover:opacity-90 hover:scale-[0.99] disabled:opacity-50 disabled:scale-100"
            >
                {processing ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : null}
                {processing ? "Mendaftarkan…" : "Buat Akun"}
            </button>

            <p className="text-center font-bdo text-[12px] text-white/30">
                Sudah punya akun?{" "}
                <button
                    type="button"
                    onClick={onSwitchTab}
                    className="font-semibold text-orange-400 hover:text-orange-300 transition-colors"
                >
                    Masuk
                </button>
            </p>
        </form>
    );
}

// ── Shared style tokens ────────────────────────────────────────────────────────

const labelCls =
    "mb-1.5 block font-bdo text-[11px] font-bold uppercase tracking-wider text-white/50";

const inputCls =
    "w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 font-bdo text-sm text-white placeholder-white/20 outline-none transition-all focus:border-orange-500/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-orange-500/20";

const errorRing = "border-rose-500/50";

const iconCls =
    "absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25 pointer-events-none";

// ── AuthModal ──────────────────────────────────────────────────────────────────

export default function AuthModal({ open, initialTab = "login", onClose }: Props) {
    const [tab, setTab] = useState<Tab>(initialTab);
    const cardRef = useRef<HTMLDivElement>(null);

    // Sync initialTab whenever the modal opens
    useEffect(() => {
        if (open) setTab(initialTab);
    }, [open, initialTab]);

    // Close on Escape
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    return (
        <div
            className={cn(
                "fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-300",
                open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
            )}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Card */}
            <div
                ref={cardRef}
                className={cn(
                    "relative z-10 w-full max-w-md overflow-hidden rounded-[24px] border border-white/[0.07] bg-[#0d1422] shadow-2xl transition-all duration-300",
                    open ? "scale-100 translate-y-0" : "scale-95 translate-y-4",
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-4">
                    <div>
                        <p className="font-bdo text-[10px] font-bold uppercase tracking-[0.18em] text-orange-500">
                            UB Sport Center
                        </p>
                        <h2 className="mt-0.5 font-clash text-[17px] font-semibold text-white">
                            {tab === "login" ? "Selamat Datang" : "Buat Akun Baru"}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-xl text-white/30 transition-all hover:bg-white/[0.06] hover:text-white/70"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Tab switcher */}
                <div className="flex gap-1 border-b border-white/[0.07] bg-white/[0.02] px-6 py-2.5">
                    {(["login", "register"] as Tab[]).map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setTab(t)}
                            className={cn(
                                "rounded-lg px-4 py-1.5 font-clash text-[13px] font-medium transition-all",
                                tab === t
                                    ? "bg-white/[0.08] text-white"
                                    : "text-white/35 hover:text-white/60",
                            )}
                        >
                            {t === "login" ? "Masuk" : "Daftar"}
                        </button>
                    ))}
                </div>

                {/* Form area */}
                <div className="px-6 py-6">
                    {tab === "login" ? (
                        <LoginForm onSwitchTab={() => setTab("register")} />
                    ) : (
                        <RegisterForm onSwitchTab={() => setTab("login")} />
                    )}
                </div>
            </div>
        </div>
    );
}
