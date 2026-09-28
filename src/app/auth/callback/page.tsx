"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function CallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Confirming your email…");

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    async function finish() {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        router.replace("/onboarding");
        return;
      }

      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          router.replace("/onboarding");
        }
      });

      timeout = setTimeout(() => {
        listener.subscription.unsubscribe();
        setMessage("Email confirmed. Redirecting to sign in…");
        setTimeout(() => router.replace("/auth/login"), 900);
      }, 1800);
    }

    finish();

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl">
        <div className="mx-auto h-10 w-10 animate-pulse rounded-2xl bg-indigo-500/30" />
        <h1 className="mt-5 text-xl font-black">SkillSync</h1>
        <p className="mt-2 text-sm text-slate-300">{message}</p>
      </div>
    </main>
  );
}
