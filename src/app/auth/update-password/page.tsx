"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/AuthCard";
import { supabase } from "@/lib/supabaseClient";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage("Password updated.");
    setTimeout(() => router.replace("/auth/login"), 700);
  }

  return (
    <AuthCard title="Choose a new password" subtitle="Use at least 8 characters.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {message ? <div className="rounded-xl bg-slate-100 p-3 text-sm text-slate-700">{message}</div> : null}
        <input type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none ring-indigo-500 focus:ring-2" />
        <button className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700">Update password</button>
      </form>
    </AuthCard>
  );
}
