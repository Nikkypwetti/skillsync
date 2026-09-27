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
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!window.confirm(`Delete "${project.title}" and its evidence?`)) return;
    setBusy(true);
    await supabase
      .from("projects")
      .delete()
      .eq("id", project.id)
      .eq("user_id", project.user_id);
    setBusy(false);
    await onChanged();
  }

  const createdAt = project.created_at
    ? new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(
        new Date(project.created_at)
      )
    : null;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-lg">
      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
              {project.career_track ? (
                <span className="text-indigo-600">{project.career_track}</span>
              ) : null}
              {project.career_track && project.project_type ? (
                <span className="text-slate-300">/</span>
              ) : null}
              {project.project_type ? <span>{project.project_type}</span> : null}
              {createdAt ? (
                <>
                  <span className="text-slate-300">/</span>
                  <span>{createdAt}</span>
                </>
              ) : null}
            </div>

            <h3 className="mt-2 text-xl font-black leading-tight tracking-[-0.02em] text-slate-950">
              {project.title}
            </h3>

            {project.role ? (
              <p className="mt-1.5 text-sm font-semibold text-slate-500">
                Role: {project.role}
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span
              className={
                project.public
                  ? "rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700"
                  : "rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-black text-amber-700"
              }
            >
              {project.public ? "Published" : "Private"}
            </span>
            <button
              type="button"
              disabled={busy}
              onClick={remove}
              aria-label={`Delete ${project.title}`}
              className="rounded-lg px-2 py-1 text-xs font-bold text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
            >
              {busy ? "…" : "Delete"}
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-5">
        <div className="grid gap-5 md:grid-cols-2">
          <ProjectDetail
            label="Problem"
            value={project.challenge || project.description || "No problem statement added yet."}
          />
          <ProjectDetail
            label="My contribution"
            value={project.contribution || "No contribution details added yet."}
          />
        </div>

        {project.outcome ? (
          <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/70 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">
              Outcome
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{project.outcome}</p>
          </div>
        ) : null}

        {project.tools?.length ? (
          <div className="mt-5">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
              Tools used
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              {project.tools.join(" · ")}
            </p>
          </div>
        ) : null}
      </div>

      <div className="border-t border-slate-100 bg-slate-50/70 px-6 py-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                Demonstrated capabilities
              </p>
              {skills.length ? (
                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-slate-500 shadow-sm">
                  {skills.length}
                </span>
              ) : null}
            </div>

            {skills.length ? (
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                {skills.slice(0, 4).map((skill) => (
                  <div key={skill.id} className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-700">{skill.name}</span>
                    <span className="text-slate-300">—</span>
                    <span className="font-black text-indigo-600">{skill.evidence_level}</span>
                  </div>
                ))}
                {skills.length > 4 ? (
                  <span className="text-xs font-bold text-slate-400">
                    +{skills.length - 4} more
                  </span>
                ) : null}
              </div>
            ) : (
              <p className="mt-2 text-xs leading-5 text-slate-400">
                Add more detail, tools, or evidence to strengthen the capability analysis.
              </p>
            )}
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            {project.repo_link ? (
              <EvidenceLink href={project.repo_link}>Repository</EvidenceLink>
            ) : null}
            {project.live_url ? (
              <EvidenceLink href={project.live_url}>Live project</EvidenceLink>
            ) : null}
            {project.evidence_url ? (
              <EvidenceLink href={project.evidence_url}>Case study</EvidenceLink>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

function ProjectDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{value}</p>
    </div>
  );
}

function EvidenceLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 shadow-sm hover:border-indigo-200 hover:text-indigo-700"
    >
      {children} ↗
    </a>
  );
}
