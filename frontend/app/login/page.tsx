"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { apiLogin } from "../lib/api";
import { saveAuth } from "../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    const result = await apiLogin(email, password);

    if (!result.success) {
      setError(result.error || "Login failed");
      setLoading(false);
      return;
    }

    // Save auth state to cookies and redirect
    saveAuth(result.token!, {
      id: result.user!.id,
      email: result.user!.email,
      full_name: result.user!.full_name,
    });

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary relative px-4">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 40%, rgba(37,99,235,0.06) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] }}
        className="relative w-full max-w-[420px]"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="h-2.5 w-2.5 rounded-full bg-accent-primary shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
          <span className="text-xl font-semibold tracking-[-0.02em] text-text-primary">
            MedBot
          </span>
          <span className="text-xl font-light tracking-[-0.02em] text-text-secondary">
            AI
          </span>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-white/[0.03] border border-white/[0.06] p-8 backdrop-blur-sm">
          <h1 className="text-[22px] font-semibold text-text-primary text-center mb-1 tracking-[-0.02em]">
            Welcome back
          </h1>
          <p className="text-[14px] text-text-tertiary text-center mb-8">
            Sign in to continue to MedBot AI
          </p>

          {/* Google Sign In */}
          <div className="flex justify-center mb-6 w-full">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log("Google token received:", credentialResponse.credential);
              }}
              onError={() => {
                setError("Google Sign-In failed");
              }}
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-[12px] text-text-tertiary uppercase tracking-wider">
              or
            </span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[13px] text-red-400"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-[13px] font-medium text-text-secondary mb-2"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
                className="w-full h-[46px] px-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[14px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary/40 focus:shadow-[0_0_0_1px_rgba(37,99,235,0.15),0_0_12px_rgba(37,99,235,0.06)] transition-all duration-200 disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-[13px] font-medium text-text-secondary mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={loading}
                  className="w-full h-[46px] px-4 pr-11 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[14px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary/40 focus:shadow-[0_0_0_1px_rgba(37,99,235,0.15),0_0_12px_rgba(37,99,235,0.06)] transition-all duration-200 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-[46px] text-[14px] font-medium text-white bg-accent-primary rounded-xl mt-2 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Continue"
              )}
            </button>
          </form>
        </div>

        {/* Bottom link */}
        <p className="text-center text-[13px] text-text-tertiary mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-accent-primary hover:text-accent-secondary transition-colors font-medium"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
