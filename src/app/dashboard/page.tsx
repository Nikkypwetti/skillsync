"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import ProjectForm from "./components/ProjectForm";
import ProjectCard from "./components/ProjectCard";
import ProfileForm from "./components/ProfileForm";
import type { Project, ProjectSkill } from "@/types";

type DashboardData = {
  projects: Project[];
  projectSkills: ProjectSkill[];
  name: string;
  username: string | null;
  profileComplete: number;
  error: string | null;
};

async function fetchDashboardData(): Promise<DashboardData> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { projects: [], projectSkills: [], name: "there", username: null, profileComplete: 0, error: null };

  const [projectResult, skillResult, profileResult] = await Promise.all([
    supabase.from("projects").select("*").eq("user_id", auth.user.id).order("created_at", { ascending: false }),
    supabase.from("project_skills").select("*").eq("user_id", auth.user.id),
    supabase.from("profiles").select("full_name,username,career_track,headline,about,location,linkedin_url,website_url").eq("id", auth.user.id).maybeSingle(),
  ]);

  const profile = profileResult.data;
  const profileFields = [profile?.full_name, profile?.username, profile?.career_track, profile?.headline, profile?.about, profile?.location, profile?.linkedin_url, profile?.website_url];
  const filled = profileFields.filter(Boolean).length;
  const projectBonus = (projectResult.data?.length || 0) > 0 ? 20 : 0;
  const evidenceBonus = (skillResult.data?.length || 0) > 0 ? 10 : 0;
  const profileComplete = Math.min(100, Math.round((filled / profileFields.length) * 70) + projectBonus + evidenceBonus);

  return {
    projects: (projectResult.data || []) as Project[],
    projectSkills: (skillResult.data || []) as ProjectSkill[],
    name: profile?.full_name || auth.user.user_metadata?.full_name || auth.user.email?.split("@")[0] || "there",
    username: profile?.username || null,
    profileComplete,
    error: projectResult.error?.message || skillResult.error?.message || profileResult.error?.message || null,
  };
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({ projects: [], projectSkills: [], name: "there", username: null, profileComplete: 0, error: null });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"projects" | "profile">("projects");

  const refresh = useCallback(async () => {
    const result = await fetchDashboardData();
    setData(result);
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    fetchDashboardData().then((result) => {
      if (active) {
        setData(result);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, []);

  const groupedSkills = useMemo(() => {
    const map = new Map<string, { name: string; level: string; score: number; count: number }>();
    for (const skill of data.projectSkills) {
      const key = skill.name.toLowerCase();
      const current = map.get(key);
      if (!current) map.set(key, { name: skill.name, level: skill.evidence_level, score: skill.evidence_score, count: 1 });
      else {
        current.count += 1;
        if (skill.evidence_score > current.score) {
          current.score = skill.evidence_score;
          current.level = skill.evidence_level;
        }
      }
    }
    return Array.from(map.values()).sort((a,b)=>b.score-a.score);
  }, [data.projectSkills]);

  const publicProjects = data.projects.filter((project) => project.public).length;

  return (
    <AuthGuard>
      <Navbar />
      <main className="min-h-screen bg-[#f7f7fb]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 p-7 text-white shadow-2xl sm:p-10">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-violet-200">Proof-based career portfolio</span>
                <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Turn your work into proof, {data.name}.</h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">Add the projects you actually complete. SkillSync identifies the capabilities you demonstrated and builds your professional portfolio from the evidence.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="#add-project" className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950 hover:bg-violet-50">Add project</a>
                <Link href={data.username ? `/portfolio/${data.username}` : "/portfolio/me"} className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white hover:bg-white/15">View portfolio</Link>
              </div>
            </div>
          </section>

          {data.error ? <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{data.error}</div> : null}

          <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Projects" value={data.projects.length} helper="Work you have documented" />
            <Stat label="Skills proven" value={groupedSkills.length} helper="Derived from real projects" />
            <Stat label="Public projects" value={publicProjects} helper="Visible to recruiters or clients" />
            <Stat label="Portfolio readiness" value={`${data.profileComplete}%`} helper="Profile + projects + evidence" />
          </section>

          <div className="mt-8 flex w-fit rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
            <button onClick={()=>setTab("projects")} className={tab==="projects"?"tab-active":"tab-idle"}>Projects & evidence</button>
            <button onClick={()=>setTab("profile")} className={tab==="profile"?"tab-active":"tab-idle"}>Portfolio profile</button>
          </div>

          {tab === "projects" ? (
            <>
              <section id="add-project" className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-7 max-w-3xl">
                  <p className="eyebrow">Project evidence</p>
                  <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Add work you can stand behind</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-500">Development, automation, RevOps, virtual assistant work, customer support, operations, research, data, content, and other project-based work all belong here.</p>
                </div>
                <ProjectForm onCreated={refresh} />
              </section>

              <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_.42fr]">
                <div>
                  <div className="mb-5">
                    <p className="eyebrow">Portfolio projects</p>
                    <h2 className="mt-2 text-2xl font-black text-slate-950">Your proof library</h2>
                  </div>
                  {loading ? <div className="empty-card">Loading projects…</div> : data.projects.length === 0 ? (
                    <div className="empty-card">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-2xl font-black text-violet-700">+</div>
                      <h3 className="mt-5 text-xl font-black text-slate-950">Start with one real project</h3>
                      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">It can be a personal project, work simulation, client task, virtual assistant workflow, automation, support process, or development build.</p>
                    </div>
                  ) : <div className="grid gap-4 xl:grid-cols-2">{data.projects.map(project => <ProjectCard key={project.id} project={project} skills={data.projectSkills.filter(skill=>skill.project_id===project.id)} onChanged={refresh} />)}</div>}
                </div>

                <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="eyebrow">Capability map</p>
                  <h2 className="mt-2 text-xl font-black text-slate-950">Skills your work proves</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">No confidence slider. Levels are based on project depth, outcomes, tools, and evidence.</p>
                  <div className="mt-6 space-y-3">
                    {groupedSkills.length ? groupedSkills.slice(0,10).map(skill => (
                      <div key={skill.name} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-black text-slate-800">{skill.name}</span>
                          <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-black text-violet-700 shadow-sm">{skill.level}</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-400">{skill.count} {skill.count===1?"project":"projects"} supporting this skill</p>
                      </div>
                    )) : <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-400">Your capability map will appear after you add project evidence.</p>}
                  </div>
                </aside>
              </section>
            </>
          ) : (
            <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-7">
                <p className="eyebrow">Professional identity</p>
                <h2 className="mt-2 text-3xl font-black text-slate-950">Shape how your portfolio introduces you</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">Use a role direction that matches the work you want: developer, data analyst, automation specialist, RevOps, virtual assistant, customer operations, project coordinator, and more.</p>
              </div>
              <ProfileForm onSaved={refresh} />
            </section>
          )}
        </div>
      </main>
    </AuthGuard>
  );
}

function Stat({label,value,helper}:{label:string;value:string|number;helper:string}) {
  return <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
    <p className="text-sm font-semibold text-slate-500">{label}</p>
    <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{value}</p>
    <p className="mt-1 text-xs text-slate-400">{helper}</p>
  </div>;
}
