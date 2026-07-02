"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { apiRegister } from "../lib/api";
import { saveAuth } from "../lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError("");

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              access_token: tokenResponse.access_token,
            }),
          }
        );

        const result = await response.json();

        if (!result.success) {
          setError(result.error || "Google login failed");
          return;
        }

        saveAuth(result.token, {
          id: result.user.id,
          email: result.user.email,
          full_name: result.user.full_name,
        });

        router.push("/dashboard");
      } catch (err) {
        console.error(err);
        setError("Google login failed");
      }
    },

    onError: () => {
      setError("Google Sign-In failed");
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const result = await apiRegister(email, password, fullName);

    if (!result.success) {
      setError(result.error || "Registration failed");
      setLoading(false);
      return;
    }

    saveAuth(result.token!, {
      id: result.user!.id,
      email: result.user!.email,
      full_name: result.user!.full_name,
    });

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary relative px-4 py-12">
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
        transition={{
          duration: 0.5,
          ease: [0.25, 0.4, 0.25, 1] as [
            number,
            number,
            number,
            number
          ],
        }}
        className="relative w-full max-w-[420px]"
      >
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="h-2.5 w-2.5 rounded-full bg-accent-primary shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
          <span className="text-xl font-semibold tracking-[-0.02em] text-text-primary">
            MedBot
          </span>
          <span className="text-xl font-light tracking-[-0.02em] text-text-secondary">
            AI
          </span>
        </div>

        <div className="rounded-3xl bg-white/[0.03] border border-white/[0.06] p-8 backdrop-blur-sm">
          <h1 className="text-[22px] font-semibold text-text-primary text-center mb-1 tracking-[-0.02em]">
            Create your account
          </h1>
          <p className="text-[14px] text-text-tertiary text-center mb-8">
            Start using MedBot AI for trusted medical answers
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[13px] text-red-400"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="register-name"
                className="block text-[13px] font-medium text-text-secondary mb-2"
              >
                Full Name
              </label>
              <input
                id="register-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Jane Smith"
                autoComplete="name"
                disabled={loading}
                className="w-full h-[46px] px-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[14px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary/40 focus:shadow-[0_0_0_1px_rgba(37,99,235,0.15),0_0_12px_rgba(37,99,235,0.06)] transition-all duration-200 disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="register-email"
                className="block text-[13px] font-medium text-text-secondary mb-2"
              >
                Email
              </label>
              <input
                id="register-email"
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
                htmlFor="register-password"
                className="block text-[13px] font-medium text-text-secondary mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  disabled={loading}
                  className="w-full h-[46px] px-4 pr-11 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[14px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary/40 focus:shadow-[0_0_0_1px_rgba(37,99,235,0.15),0_0_12px_rgba(37,99,235,0.06)] transition-all duration-200 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="register-confirm"
                className="block text-[13px] font-medium text-text-secondary mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="register-confirm"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  disabled={loading}
                  className="w-full h-[46px] px-4 pr-11 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[14px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary/40 focus:shadow-[0_0_0_1px_rgba(37,99,235,0.15),0_0_12px_rgba(37,99,235,0.06)] transition-all duration-200 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
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
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-[12px] text-text-tertiary uppercase tracking-wider">
              or
            </span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <button
            type="button"
            onClick={() => googleLogin()}
            className="w-full h-[46px] flex items-center justify-center gap-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-[14px] font-medium text-text-primary hover:bg-white/[0.08] hover:-translate-y-[1px] transition-all duration-200"
          >
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <p className="text-center text-[13px] text-text-tertiary mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-accent-primary hover:text-accent-secondary transition-colors font-medium"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}