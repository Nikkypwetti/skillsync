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
        router.replace("/dashboard");
        return;
      }

      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) router.replace("/dashboard");
      });

      timeout = setTimeout(() => {
        listener.subscription.unsubscribe();
        setMessage("Email confirmed. Please sign in to continue.");
        setTimeout(() => router.replace("/auth/login"), 900);
      }, 1800);
    }

    finish();
    return () => clearTimeout(timeout);
  }, [router]);

  return <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-sm font-medium text-white">{message}</div>;
}
