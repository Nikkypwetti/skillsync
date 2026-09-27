"use client";

import { useState } from "react";
import AuthCard from "@/components/AuthCard";
import { supabase } from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });
    setMessage(error ? error.message : "If that account exists, a password reset link has been sent.");
  }

  return (
    <AuthCard title="Reset your password" subtitle="We’ll email you a secure reset link.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {message ? <div className="rounded-xl bg-slate-100 p-3 text-sm text-slate-700">{message}</div> : null}
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none ring-indigo-500 focus:ring-2" />
        <button className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700">Send reset link</button>
      </form>
    </AuthCard>
  );
}
