"use client";

import Link from "next/link";
import { useState } from "react";
import AuthCard from "@/components/AuthCard";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [existingAccount, setExistingAccount] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setExistingAccount(false);
    setLoading(true);

    const email = form.email.trim().toLowerCase();

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { full_name: form.fullName.trim() },
      },
    });

    setLoading(false);

    const alreadyRegistered =
      signUpError?.message.toLowerCase().includes("already registered") ||
      (data.user !== null &&
        Array.isArray(data.user.identities) &&
        data.user.identities.length === 0);

    if (alreadyRegistered) {
      const notice =
        "An account with this email already exists. Please sign in instead, or reset your password if you cannot remember it.";

      setExistingAccount(true);
      setError(notice);
      window.alert(notice);
      return;
    }

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setMessage(
      "Account created. Check your inbox and spam folder, then confirm your email to continue."
    );
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Turn real projects into evidence-backed skills and a professional portfolio."
      footerText="Already have an account?"
      footerHref="/auth/login"
      footerLabel="Sign in"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? (
          <div
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
          >
            <p className="font-semibold">{error}</p>

            {existingAccount ? (
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href="/auth/login"
                  className="rounded-lg bg-rose-700 px-3 py-2 text-xs font-bold text-white hover:bg-rose-800"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/reset-password"
                  className="rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100"
                >
                  Reset password
                </Link>
              </div>
            ) : null}
          </div>
        ) : null}

        {message ? (
          <div
            role="status"
            className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
          >
            {message}
          </div>
        ) : null}

        <label className="form-label">
          Full name
          <input
            value={form.fullName}
            onChange={(e) =>
              setForm({ ...form, fullName: e.target.value })
            }
            placeholder="Your full name"
            autoComplete="name"
            required
            className="field"
          />
        </label>

        <label className="form-label">
          Email address
          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
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
            minLength={8}
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            placeholder="Minimum 8 characters"
            autoComplete="new-password"
            required
            className="field"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Checking account…" : "Create account"}
        </button>
      </form>
    </AuthCard>
  );
}
