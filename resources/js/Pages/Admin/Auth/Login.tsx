import { Head, Link, useForm } from "@inertiajs/react";
import type { FormEventHandler } from "react";
import InputError from "@/Components/InputError";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function StaffLogin({ status }: { status?: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false as boolean,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("ubsc-staff.login"), { onFinish: () => reset("password") });
    };

    return (
        <>
            <Head title="Staff Portal — UBSC" />

            <div className="min-h-screen bg-[#0b1221] flex flex-col items-center justify-center p-4">
                {/* Background subtle grid */}
                <div
                    className="pointer-events-none fixed inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                />

                <div className="relative z-10 w-full max-w-[420px]">
                    {/* Logo + Badge */}
                    <div className="mb-8 flex flex-col items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-[0_0_40px_rgba(249,115,22,0.35)]">
                            <ShieldCheck className="h-7 w-7 text-white" strokeWidth={1.75} />
                        </div>
                        <div className="text-center">
                            <p className="font-bdo text-[11px] font-bold uppercase tracking-[0.2em] text-orange-500">
                                Staff Portal
                            </p>
                            <h1 className="mt-1 font-clash text-2xl font-semibold text-white">
                                UB Sport Center
                            </h1>
                        </div>
                    </div>

                    {/* Card */}
                    <div className="overflow-hidden rounded-[24px] border border-white/[0.07] bg-white/[0.04] shadow-2xl backdrop-blur-sm">
                        <div className="border-b border-white/[0.07] px-7 py-5">
                            <h2 className="font-clash text-[15px] font-medium text-white/90">
                                Masuk ke Dashboard
                            </h2>
                            <p className="mt-0.5 font-bdo text-[12px] text-white/40">
                                Hanya untuk staf dan pengelola resmi UBSC
                            </p>
                        </div>

                        <form onSubmit={submit} className="flex flex-col gap-5 px-7 py-6">
                            {status && (
                                <div className="rounded-xl bg-emerald-500/10 px-4 py-3 font-bdo text-[12px] text-emerald-400 ring-1 ring-emerald-500/20">
                                    {status}
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <label className="mb-1.5 block font-bdo text-[11px] font-bold uppercase tracking-wider text-white/50">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData("email", e.target.value)}
                                        placeholder="staff@ub.ac.id"
                                        autoComplete="username"
                                        required
                                        className={cn(
                                            "w-full rounded-xl border bg-white/[0.04] py-3 pl-10 pr-4 font-bdo text-sm text-white placeholder-white/20 outline-none transition-all",
                                            "focus:border-orange-500/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-orange-500/20",
                                            errors.email
                                                ? "border-rose-500/50"
                                                : "border-white/[0.08]",
                                        )}
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-1.5 text-[11px]" />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="mb-1.5 block font-bdo text-[11px] font-bold uppercase tracking-wider text-white/50">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={data.password}
                                        onChange={(e) => setData("password", e.target.value)}
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        required
                                        className={cn(
                                            "w-full rounded-xl border bg-white/[0.04] py-3 pl-10 pr-11 font-bdo text-sm text-white placeholder-white/20 outline-none transition-all",
                                            "focus:border-orange-500/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-orange-500/20",
                                            errors.password
                                                ? "border-rose-500/50"
                                                : "border-white/[0.08]",
                                        )}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 transition-colors hover:text-white/50"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-1.5 text-[11px]" />
                            </div>

                            {/* Remember + Forgot */}
                            <div className="flex items-center justify-between">
                                <label className="flex cursor-pointer items-center gap-2.5">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData("remember", e.target.checked)}
                                        className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 text-orange-500 focus:ring-orange-500/30"
                                    />
                                    <span className="font-bdo text-[12px] text-white/40">
                                        Ingat saya
                                    </span>
                                </label>
                                <Link
                                    href={route("password.request")}
                                    className="font-bdo text-[12px] text-white/40 transition-colors hover:text-orange-400"
                                >
                                    Lupa password?
                                </Link>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 py-3.5 font-clash text-[14px] font-semibold text-white shadow-[inset_0_-6px_12px_-4px_rgba(0,0,0,0.3),0_0_30px_rgba(249,115,22,0.25)] transition-all hover:opacity-90 hover:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:scale-100"
                            >
                                {processing ? (
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                ) : (
                                    <ShieldCheck className="h-4 w-4" strokeWidth={2} />
                                )}
                                {processing ? "Memverifikasi…" : "Masuk ke Dashboard"}
                            </button>
                        </form>
                    </div>

                    {/* Footer note — NO registration link */}
                    <p className="mt-6 text-center font-bdo text-[11px] text-white/20">
                        Akses terbatas. Hanya staf resmi UBSC yang diizinkan.
                    </p>
                </div>
            </div>
        </>
    );
}
