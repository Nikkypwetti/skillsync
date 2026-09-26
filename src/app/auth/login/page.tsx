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

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.replace("/dashboard");
  }

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to keep tracking your progress." footerText="New to SkillSync?" footerHref="/auth/signup" footerLabel="Create an account">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none ring-indigo-500 focus:ring-2" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none ring-indigo-500 focus:ring-2" />
        <div className="flex justify-end"><Link href="/auth/reset-password" className="text-sm font-semibold text-indigo-600">Forgot password?</Link></div>
        <button disabled={loading} className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">{loading ? "Signing in…" : "Sign in"}</button>
      </form>
    </AuthCard>
  );
}
