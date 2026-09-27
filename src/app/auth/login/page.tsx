"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/AuthCard";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    setLoading(false);

    if (signInError) {
      const message = signInError.message.toLowerCase();

      if (message.includes("email not confirmed")) {
        setError(
          "Your email has not been confirmed yet. Check your inbox and spam folder for the confirmation message."
        );
        return;
      }

      if (message.includes("invalid login credentials")) {
        setError(
          "The email or password is incorrect. If you already created an account and cannot remember the password, use Reset password."
        );
        return;
      }

      setError(signInError.message);
      return;
    }

    router.replace("/dashboard");
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to continue building your proof-based portfolio."
      footerText="New to SkillSync?"
      footerHref="/auth/signup"
      footerLabel="Create an account"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? (
          <div
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
          >
            {error}
          </div>
        ) : null}

        <label className="form-label">
          Email address
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
            className="field"
          />
        </label>

        <label className="form-label">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            autoComplete="current-password"
            required
            className="field"
          />
        </label>

        <div className="flex justify-end">
          <Link
            href="/auth/reset-password"
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
          >
            Reset password
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthCard>
  );
}
