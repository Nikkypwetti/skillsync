"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import SkillCard from "./components/SkillCard";
import SkillForm from "./components/SkillForm";
import ProgressChart from "./components/ProgressChart";
import type { Skill } from "@/types";

export default function DashboardPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [name, setName] = useState("there");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;

    setName(auth.user.user_metadata?.full_name || auth.user.email?.split("@")[0] || "there");

    const { data, error } = await supabase
      .from("skills")
      .select("id,user_id,name,category,level,created_at")
      .eq("user_id", auth.user.id)
      .order("created_at", { ascending: false });

    if (error) setError(error.message);
    setSkills((data || []) as Skill[]);
    setLoading(false);
  }, []);

  useEffect(() => {\n    void load();\n  }, [load]);

  const stats = useMemo(() => {
    const total = skills.length;
    const average = total ? Math.round(skills.reduce((sum, s) => sum + s.level, 0) / total) : 0;
    const advanced = skills.filter((s) => s.level >= 80).length;
    return { total, average, advanced };
  }, [skills]);

  return (
    <AuthGuard>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Workspace</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Welcome, {name}</h1>
            <p className="mt-2 max-w-2xl text-slate-500">Track what you are learning, attach evidence, and turn progress into a portfolio recruiters can verify.</p>
          </div>
          <Link href="/portfolio/me" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:border-indigo-200 hover:text-indigo-700">Preview portfolio</Link>
        </section>

        {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

        <section className="grid gap-4 sm:grid-cols-3">
          <Stat label="Skills tracked" value={stats.total} />
          <Stat label="Average progress" value={`${stats.average}%`} />
          <Stat label="Advanced skills" value={stats.advanced} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-xl font-black tracking-tight text-slate-900">Add a skill</h2>
              <p className="mt-1 text-sm text-slate-500">Start with an honest self-assessment. You can update the level later.</p>
            </div>
            <SkillForm onCreated={load} />
          </div>
          <ProgressChart skills={skills} />
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">Your skills</h2>
              <p className="mt-1 text-sm text-slate-500">Each skill becomes evidence on your public portfolio.</p>
            </div>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Loading skills…</div>
          ) : skills.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
              <div className="mx-auto max-w-md">
                <h3 className="text-xl font-black text-slate-900">No skills yet</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">Add your first skill above. Your dashboard analytics and public portfolio will fill in automatically.</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {skills.map((skill) => <SkillCard key={skill.id} skill={skill} onChanged={load} />)}
            </div>
          )}
        </section>
      </main>
    </AuthGuard>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{value}</p>
    </div>
  );
}
