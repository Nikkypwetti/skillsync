"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import type { Skill } from "@/types";

export default function PortfolioPage() {
  const params = useParams<{ username: string }>();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [name, setName] = useState("SkillSync User");
  const [loading, setLoading] = useState(true);
  const username = params.username;

  useEffect(() => {
    async function load() {
      if (username === "me") {
        const { data: auth } = await supabase.auth.getUser();
        if (!auth.user) { setLoading(false); return; }
        setName(auth.user.user_metadata?.full_name || auth.user.email?.split("@")[0] || "SkillSync User");
        const { data } = await supabase.from("skills").select("*").eq("user_id", auth.user.id).order("level", { ascending: false });
        setSkills((data || []) as Skill[]);
      } else {
        const { data: profile } = await supabase.from("profiles").select("id,full_name,username").eq("username", username).maybeSingle();
        if (profile) {
          setName(profile.full_name || profile.username || "SkillSync User");
          const { data } = await supabase.from("skills").select("*").eq("user_id", profile.id).order("level", { ascending: false });
          setSkills((data || []) as Skill[]);
        }
      }
      setLoading(false);
    }
    load();
  }, [username]);

  const average = useMemo(() => skills.length ? Math.round(skills.reduce((s, x) => s + x.level, 0) / skills.length) : 0, [skills]);

  if (loading) return <main className="min-h-screen bg-slate-950 p-8 text-white">Loading portfolio…</main>;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <Link href="/" className="text-sm font-bold text-indigo-400">SkillSync</Link>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">{name}</h1>
            <p className="mt-4 max-w-2xl text-slate-300">A live record of skills, progress, and evidence built with SkillSync.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4"><p className="text-xs uppercase tracking-widest text-slate-400">Average progress</p><p className="mt-1 text-3xl font-black">{average}%</p></div>
        </div>
        <section className="mt-12 grid gap-4 sm:grid-cols-2">
          {skills.length === 0 ? <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300">No skills published yet.</div> : skills.map((skill) => (
            <div key={skill.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between gap-3"><h2 className="text-xl font-black">{skill.name}</h2><span className="text-sm font-bold text-indigo-300">{skill.level}%</span></div>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">{skill.category || "General"}</p>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-indigo-500" style={{ width: `${skill.level}%` }} /></div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
