"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {
  const router = useRouter();

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/auth/login");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-black tracking-tight text-indigo-600">SkillSync</Link>
        <nav className="flex items-center gap-3 text-sm font-medium">
          <Link href="/dashboard" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">Dashboard</Link>
          <Link href="/portfolio/me" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">Portfolio</Link>
          <button onClick={logout} className="rounded-lg bg-slate-900 px-3 py-2 text-white hover:bg-slate-800">Log out</button>
        </nav>
      </div>
    </header>
  );
}
