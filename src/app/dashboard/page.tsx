"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import SkillCard from "./components/SkillCard";
import SkillForm from "./components/SkillForm";
import ProgressChart from "./components/ProgressChart";
import type { Skill } from "@/types";

type DashboardData = {
  skills: Skill[];
  name: string;
  error: string | null;
};

async function fetchDashboardData(): Promise<DashboardData> {
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return { skills: [], name: "there", error: null };
  }

  const { data, error } = await supabase
    .from("skills")
    .select("id,user_id,name,category,level,created_at")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false });

  return {
    skills: (data || []) as Skill[],
    name:
      auth.user.user_metadata?.full_name ||
      auth.user.email?.split("@")[0] ||
      "there",
    error: error?.message ?? null,
  };
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const confirmed = searchParams.get("confirmed") === "true";

  const [skills, setSkills] = useState<Skill[]>([]);
  const [name, setName] = useState("there");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applyDashboardData = useCallback((result: DashboardData) => {
    setSkills(result.skills);
    setName(result.name);
    setError(result.error);
    setLoading(false);
  }, []);

  const refresh = useCallback(async () => {
    const result = await fetchDashboardData();
    applyDashboardData(result);
  }, [applyDashboardData]);

  useEffect(() => {
    let active = true;

    fetchDashboardData().then((result) => {
      if (active) applyDashboardData(result);
    });

    return () => {
      active = false;
    };
  }, [applyDashboardData]);

  const stats = useMemo(() => {
    const total = skills.length;
    const average = total
      ? Math.round(skills.reduce((sum, skill) => sum + skill.level, 0) / total)
      : 0;
    const advanced = skills.filter((skill) => skill.level >= 80).length;

    return { total, average, advanced };
  }, [skills]);

  return (
    <AuthGuard>
      <Navbar />

      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <section className="overflow-hidden rounded-[2rem] bg-slate-950 p-7 text-white shadow-xl sm:p-10">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-indigo-300">
                  SkillSync workspace
                </p>
                <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
                  Welcome, {name}
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                  Build a verified record of what you can do. Track skills, update progress,
                  and publish a recruiter-ready portfolio as you grow.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="#add-skill"
                  className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
                >
                  Add a skill
                </a>
                <Link
                  href="/portfolio/me"
                  className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  Preview portfolio
                </Link>
              </div>
            </div>
          </section>

          {confirmed ? (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
              Email confirmed successfully. Your account is ready.
            </div>
          ) : null}

          {error ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <section className="mt-6 grid gap-4 sm:grid-cols-3">
            <Stat
              label="Skills tracked"
              value={stats.total}
              helper={stats.total === 0 ? "Add your first skill" : "Across your workspace"}
            />
            <Stat
              label="Average progress"
              value={`${stats.average}%`}
              helper="Average across all skills"
            />
            <Stat
              label="Advanced skills"
              value={stats.advanced}
              helper="Skills at 80% or above"
            />
          </section>

          <section id="add-skill" className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                  New skill
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                  Add what you are learning
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Start at the level that reflects your current confidence. You can update
                  it anytime.
                </p>
              </div>

              <SkillForm onCreated={refresh} />
            </div>

            <ProgressChart skills={skills} />
          </section>

          <section className="mt-8 pb-10">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                  Skill library
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                  Your skills
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Keep each skill current so your portfolio reflects your actual progress.
                </p>
              </div>

              {skills.length > 0 ? (
                <span className="w-fit rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-600">
                  {skills.length} {skills.length === 1 ? "skill" : "skills"}
                </span>
              ) : null}
            </div>

            {loading ? (
              <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-sm text-slate-500 shadow-sm">
                Loading your workspace…
              </div>
            ) : skills.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-xl font-black text-indigo-600">
                  +
                </div>
                <h3 className="mt-5 text-xl font-black text-slate-950">
                  Your skill library is empty
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Add your first skill above. SkillSync will automatically update your
                  stats, chart, and portfolio.
                </p>
                <a
                  href="#add-skill"
                  className="mt-5 inline-flex rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
                >
                  Add first skill
                </a>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {skills.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} onChanged={refresh} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </AuthGuard>
  );
}

function Stat({
  label,
  value,
  helper,
}: {
  label: string;
  value: string | number;
  helper: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{helper}</p>
    </div>
  );
}
