"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Project, ProjectSkill } from "@/types";

export default function ProjectCard({
  project,
  skills,
  onChanged,
}: {
  project: Project;
  skills: ProjectSkill[];
  onChanged: () => void | Promise<void>;
}) {
  const [busy,setBusy]=useState(false);

  async function remove() {
    if(!window.confirm(`Delete "${project.title}" and its evidence?`)) return;
    setBusy(true);
    await supabase.from("projects").delete().eq("id",project.id).eq("user_id",project.user_id);
    setBusy(false);
    await onChanged();
  }

  return <article className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="flex flex-wrap gap-2">
          {project.career_track?<span className="badge-dark">{project.career_track}</span>:null}
          {project.project_type?<span className="badge-light">{project.project_type}</span>:null}
        </div>
        <h3 className="mt-4 text-xl font-black tracking-tight text-slate-950">{project.title}</h3>
        {project.role?<p className="mt-1 text-sm font-semibold text-violet-700">{project.role}</p>:null}
      </div>
      <button disabled={busy} onClick={remove} className="rounded-xl px-2 py-1 text-xs font-bold text-slate-400 hover:bg-rose-50 hover:text-rose-600">{busy?"…":"Delete"}</button>
    </div>

    <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{project.contribution||project.challenge||project.description}</p>

    {project.tools?.length?<div className="mt-5 flex flex-wrap gap-2">{project.tools.slice(0,6).map(tool=><span key={tool} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{tool}</span>)}</div>:null}

    <div className="mt-5 border-t border-slate-100 pt-5">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Evidence-backed skills</p>
      {skills.length?<div className="mt-3 flex flex-wrap gap-2">{skills.slice(0,5).map(skill=><span key={skill.id} className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">{skill.name} · {skill.evidence_level}</span>)}{skills.length>5?<span className="badge-light">+{skills.length-5} more</span>:null}</div>:<p className="mt-2 text-xs text-slate-400">Add more detail or tools to generate evidence.</p>}
    </div>

    <div className="mt-5 flex flex-wrap gap-3 text-xs font-bold">
      {project.repo_link?<a href={project.repo_link} target="_blank" rel="noreferrer" className="link-soft">Repository ↗</a>:null}
      {project.live_url?<a href={project.live_url} target="_blank" rel="noreferrer" className="link-soft">Live project ↗</a>:null}
      {project.evidence_url?<a href={project.evidence_url} target="_blank" rel="noreferrer" className="link-soft">Evidence ↗</a>:null}
      <span className={project.public?"text-emerald-600":"text-amber-600"}>{project.public?"Public":"Private"}</span>
    </div>
  </article>;
}
