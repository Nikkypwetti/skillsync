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
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="group flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-black text-white shadow-lg shadow-violet-200">S</span>
          <span className="text-lg font-black tracking-tight text-slate-950 group-hover:text-violet-700">SkillSync</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm font-semibold sm:gap-2">
          <Link href="/dashboard" className="rounded-xl px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-950">Workspace</Link>
          <Link href="/portfolio/me" className="rounded-xl px-3 py-2 text-slate-600 hover:bg-violet-50 hover:text-violet-700">Portfolio</Link>
          <button onClick={logout} className="ml-1 rounded-xl bg-slate-950 px-3.5 py-2 text-white hover:bg-slate-800">Log out</button>
        </nav>
      </div>
    </header>
  );
}
