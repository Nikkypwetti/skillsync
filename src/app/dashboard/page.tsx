"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import { levelFromScore } from "@/lib/evidence";
import ProjectForm from "./components/ProjectForm";
import ProjectCard from "./components/ProjectCard";
import ProfileForm from "./components/ProfileForm";
import CareerToolkit from "./components/CareerToolkit";
import type { Project, ProjectAsset, ProjectSkill } from "@/types";

type DashboardData = {
  projects: Project[];
  projectSkills: ProjectSkill[];
  projectAssets: ProjectAsset[];
  name: string;
  username: string | null;
  profileComplete: number;
  error: string | null;
};

async function fetchDashboardData(): Promise<DashboardData> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { projects: [], projectSkills: [], projectAssets: [], name: "there", username: null, profileComplete: 0, error: null };

  const [projectResult, skillResult, assetResult, profileResult] = await Promise.all([
    supabase.from("projects").select("*").eq("user_id", auth.user.id).order("created_at", { ascending: false }),
    supabase.from("project_skills").select("*").eq("user_id", auth.user.id),
    supabase.from("project_assets").select("*").eq("user_id", auth.user.id).order("created_at", { ascending: false }),
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
    projectAssets: (assetResult.data || []) as ProjectAsset[],
    name: profile?.full_name || auth.user.user_metadata?.full_name || auth.user.email?.split("@")[0] || "there",
    username: profile?.username || null,
    profileComplete,
    error: projectResult.error?.message || skillResult.error?.message || assetResult.error?.message || profileResult.error?.message || null,
  };
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({ projects: [], projectSkills: [], projectAssets: [], name: "there", username: null, profileComplete: 0, error: null });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"projects" | "profile" | "career">("projects");
  const [editingProject, setEditingProject] = useState<Project | null>(null);

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
    const map = new Map<string, { name: string; score: number; count: number; rationale: string | null }>();

    for (const skill of data.projectSkills) {
      const key = skill.name.toLowerCase();
      const current = map.get(key);

      if (!current) {
        map.set(key, {
          name: skill.name,
          score: skill.evidence_score,
          count: 1,
          rationale: skill.rationale,
        });
      } else {
        current.count += 1;
        if (skill.evidence_score > current.score) {
          current.score = skill.evidence_score;
          current.rationale = skill.rationale;
        }
      }
    }

    return Array.from(map.values())
      .map((skill) => {
        const aggregateScore = Math.min(100, skill.score + Math.min(12, (skill.count - 1) * 4));
        return {
          ...skill,
          score: aggregateScore,
          level: levelFromScore(aggregateScore),
        };
      })
      .sort((a,b)=>b.score-a.score);
  }, [data.projectSkills]);

  const publicProjects = data.projects.filter((project) => project.public).length;

  return (
    <AuthGuard>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden bg-[#f7f8fc]">
        <div className="pointer-events-none absolute left-[-8rem] top-24 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="pointer-events-none absolute right-[-6rem] top-[28rem] h-96 w-96 rounded-full bg-violet-200/35 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <section className="motion-fade-up relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-950 via-slate-950 to-violet-900 p-7 text-white shadow-2xl shadow-indigo-200/30 sm:p-10">
            <div className="motion-float-slow absolute -right-20 -top-24 h-64 w-64 rounded-full bg-fuchsia-400/25 blur-3xl" />
            <div className="motion-float-delayed absolute -bottom-24 left-[38%] h-56 w-56 rounded-full bg-cyan-400/15 blur-3xl" />
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

          <section className="motion-fade-up motion-delay-1 mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Projects" value={data.projects.length} helper="Work you have documented" tone="indigo" />
            <Stat label="Skills proven" value={groupedSkills.length} helper="Derived from real projects" tone="violet" />
            <Stat label="Public projects" value={publicProjects} helper="Visible to recruiters or clients" tone="emerald" />
            <Stat label="Portfolio readiness" value={`${data.profileComplete}%`} helper="Profile + projects + evidence" tone="amber" />
          </section>

          <div className="motion-fade-up motion-delay-2 mt-8 flex w-fit rounded-2xl border border-slate-200 bg-white/90 p-1 shadow-sm backdrop-blur">
            <button onClick={()=>setTab("projects")} className={tab==="projects"?"tab-active":"tab-idle"}>Projects & evidence</button>
            <button onClick={()=>setTab("profile")} className={tab==="profile"?"tab-active":"tab-idle"}>Portfolio profile</button>
            <button onClick={()=>setTab("career")} className={tab==="career"?"tab-active":"tab-idle"}>Career toolkit</button>
          </div>

          {tab === "projects" ? (
            <>
              <section id="add-project" className="motion-fade-up motion-delay-2 mt-6 overflow-hidden rounded-[2rem] border border-indigo-100 bg-white p-6 shadow-xl shadow-indigo-100/40 sm:p-8">
                <div className="mb-7 max-w-3xl rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-violet-50 p-5">
                  <p className="eyebrow">Project evidence</p>
                  <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">{editingProject ? "Improve this project" : "Add work you can stand behind"}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-500">{editingProject ? "Update the evidence, links, files, visibility, or featured status. SkillSync will recalculate the demonstrated capabilities when you save." : "Development, automation, RevOps, virtual assistant work, customer support, operations, research, data, content, and other project-based work all belong here."}</p>
                </div>
                <ProjectForm
                  key={editingProject ? "edit-" + editingProject.id : "new-project"}
                  project={editingProject}
                  existingAssets={
                    editingProject
                      ? data.projectAssets.filter((asset) => asset.project_id === editingProject.id)
                      : []
                  }
                  onSaved={async () => {
                    await refresh();
                    if (editingProject) setEditingProject(null);
                  }}
                  onCancelEdit={() => setEditingProject(null)}
                />
              </section>

              <section className="motion-fade-up motion-delay-3 mt-8 grid gap-6 lg:grid-cols-[1fr_.42fr]">
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
                  ) : <div className="grid gap-4 xl:grid-cols-2">{data.projects.map((project,index) => <ProjectCard key={project.id} project={project} skills={data.projectSkills.filter(skill=>skill.project_id===project.id)} assets={data.projectAssets.filter(asset=>asset.project_id===project.id)} onChanged={refresh} onEdit={(selected) => { setEditingProject(selected); window.requestAnimationFrame(() => document.getElementById("add-project")?.scrollIntoView({ behavior: "smooth", block: "start" })); }} index={index} />)}</div>}
                </div>

                <aside className="sticky-card rounded-[2rem] border border-violet-100 bg-gradient-to-b from-white to-violet-50/60 p-6 shadow-lg shadow-violet-100/50">
                  <p className="eyebrow">Capability map</p>
                  <h2 className="mt-2 text-xl font-black text-slate-950">Skills your work proves</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">No confidence slider. Levels are based on project depth, outcomes, tools, and evidence.</p>
                  <div className="mt-6 space-y-3">
                    {groupedSkills.length ? groupedSkills.slice(0,10).map(skill => (
                      <div key={skill.name} className="capability-row rounded-2xl border border-white bg-white/90 p-4 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-black text-slate-800">{skill.name}</span>
                          <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-black text-violet-700">{skill.level}</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-400">{skill.count} {skill.count===1?"project":"projects"} supporting this skill</p>
                      </div>
                    )) : <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-400">Your capability map will appear after you add project evidence.</p>}
                  </div>
                </aside>
              </section>
            </>
          ) : tab === "profile" ? (
            <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-7">
                <p className="eyebrow">Professional identity</p>
                <h2 className="mt-2 text-3xl font-black text-slate-950">Shape how your portfolio introduces you</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">Use a role direction that matches the work you want: developer, data analyst, automation specialist, RevOps, virtual assistant, customer operations, project coordinator, and more.</p>
              </div>
              <ProfileForm onSaved={refresh} />
            </section>
          ) : (
            <section className="mt-6">
              <CareerToolkit
                projects={data.projects}
                profileComplete={data.profileComplete}
                onChanged={refresh}
                onGoToProjects={() => {
                  setTab("projects");
                  window.requestAnimationFrame(() =>
                    document.getElementById("add-project")?.scrollIntoView({ behavior: "smooth", block: "start" })
                  );
                }}
              />
            </section>
          )}
        </div>
      </main>
    </AuthGuard>
  );
}

function Stat({
  label,
  value,
  helper,
  tone,
}: {
  label: string;
  value: string | number;
  helper: string;
  tone: "indigo" | "violet" | "emerald" | "amber";
}) {
  const tones = {
    indigo: "from-indigo-500 to-blue-500 bg-indigo-50 text-indigo-700",
    violet: "from-violet-500 to-fuchsia-500 bg-violet-50 text-violet-700",
    emerald: "from-emerald-500 to-teal-500 bg-emerald-50 text-emerald-700",
    amber: "from-amber-400 to-orange-500 bg-amber-50 text-amber-700",
  } as const;

  return (
    <div className="stat-card group relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${tones[tone].split(" ").slice(0,2).join(" ")}`} />
      <div className={`inline-flex rounded-xl px-2.5 py-1 text-xs font-black ${tones[tone].split(" ").slice(2).join(" ")}`}>
        {label}
      </div>
      <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{helper}</p>
    </div>
  );
}
