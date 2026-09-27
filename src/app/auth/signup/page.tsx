"use client";

import { useState } from "react";
import AuthCard from "@/components/AuthCard";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { full_name: form.fullName },
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setMessage("Account created. Check your email and confirm your address to continue.");
  }

  return (
    <AuthCard title="Create your account" subtitle="Track skills, connect proof, and publish a portfolio." footerText="Already have an account?" footerHref="/auth/login" footerLabel="Sign in">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
        {message ? <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div> : null}
        <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Full name" required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none ring-indigo-500 focus:ring-2" />
        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none ring-indigo-500 focus:ring-2" />
        <input type="password" minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Minimum 8 characters" required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none ring-indigo-500 focus:ring-2" />
        <button disabled={loading} className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">{loading ? "Creating account…" : "Create account"}</button>
      </form>
    </AuthCard>
  );
}
