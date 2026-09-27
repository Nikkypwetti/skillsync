"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Project, ProjectAsset, ProjectSkill } from "@/types";

const trackThemes = [
  {
    match: ["automation", "ai"],
    stripe: "from-violet-500 via-fuchsia-500 to-pink-500",
    badge: "bg-violet-50 text-violet-700 border-violet-100",
    glow: "hover:shadow-violet-200/60",
    icon: "A",
  },
  {
    match: ["revenue", "crm", "sales"],
    stripe: "from-blue-500 via-indigo-500 to-violet-500",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-100",
    glow: "hover:shadow-indigo-200/60",
    icon: "R",
  },
  {
    match: ["virtual assistant", "executive"],
    stripe: "from-rose-400 via-orange-400 to-amber-400",
    badge: "bg-rose-50 text-rose-700 border-rose-100",
    glow: "hover:shadow-rose-200/60",
    icon: "V",
  },
  {
    match: ["customer"],
    stripe: "from-cyan-500 via-sky-500 to-blue-500",
    badge: "bg-cyan-50 text-cyan-700 border-cyan-100",
    glow: "hover:shadow-cyan-200/60",
    icon: "C",
  },
  {
    match: ["data"],
    stripe: "from-emerald-500 via-teal-500 to-cyan-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
    glow: "hover:shadow-emerald-200/60",
    icon: "D",
  },
  {
    match: ["software", "development", "cloud", "devops"],
    stripe: "from-slate-700 via-indigo-600 to-blue-500",
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    glow: "hover:shadow-slate-300/60",
    icon: "S",
  },
  {
    match: ["project", "operations"],
    stripe: "from-amber-500 via-orange-500 to-rose-500",
    badge: "bg-amber-50 text-amber-700 border-amber-100",
    glow: "hover:shadow-amber-200/60",
    icon: "O",
  },
];

function getTheme(track: string | null) {
  const normalized = (track || "").toLowerCase();
  return (
    trackThemes.find((theme) =>
      theme.match.some((word) => normalized.includes(word))
    ) || {
      stripe: "from-indigo-500 via-violet-500 to-fuchsia-500",
      badge: "bg-indigo-50 text-indigo-700 border-indigo-100",
      glow: "hover:shadow-indigo-200/60",
      icon: "P",
    }
  );
}

export default function ProjectCard({
  project,
  skills,
  onChanged,
  onEdit,
  assets = [],
  index = 0,
}: {
  project: Project;
  skills: ProjectSkill[];
  onChanged: () => void | Promise<void>;
  onEdit: (project: Project) => void;
  assets?: ProjectAsset[];
  index?: number;
}) {
  const [busy, setBusy] = useState(false);
  const theme = getTheme(project.career_track);

  async function remove() {
    if (!window.confirm(`Delete "${project.title}" and its evidence?`)) return;
    setBusy(true);

    if (assets.length) {
      const { error: storageError } = await supabase.storage
        .from("project-evidence")
        .remove(assets.map((asset) => asset.storage_path));

      if (storageError) {
        setBusy(false);
        window.alert("Could not remove the project's evidence files: " + storageError.message);
        return;
      }
    }

    const { error: deleteError } = await supabase
      .from("projects")
      .delete()
      .eq("id", project.id)
      .eq("user_id", project.user_id);

    setBusy(false);

    if (deleteError) {
      window.alert(deleteError.message);
      return;
    }

    await onChanged();
  }

  const createdAt = project.created_at
    ? new Intl.DateTimeFormat("en", {
        month: "short",
        year: "numeric",
      }).format(new Date(project.created_at))
    : null;

  return (
    <article
      className={`project-card-motion group relative overflow-hidden rounded-[1.4rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-xl ${theme.glow}`}
      style={{ animationDelay: `${Math.min(index, 6) * 70}ms` }}
    >
      <div
        className={`h-1.5 w-full bg-gradient-to-r ${theme.stripe}`}
        aria-hidden="true"
      />

      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex items-start justify-between gap-5">
          <div className="flex min-w-0 gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-sm font-black ${theme.badge}`}
              aria-hidden="true"
            >
              {theme.icon}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
                {project.career_track ? (
                  <span className={`rounded-full border px-2.5 py-1 ${theme.badge}`}>
                    {project.career_track}
                  </span>
                ) : null}

                {project.project_type ? (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-500">
                    {project.project_type}
                  </span>
                ) : null}

                {createdAt ? <span className="text-slate-400">{createdAt}</span> : null}
              </div>

              <h3 className="mt-3 text-xl font-black leading-tight tracking-[-0.02em] text-slate-950">
                {project.title}
              </h3>

              {project.role ? (
                <p className="mt-1.5 text-sm font-semibold text-slate-500">
                  {project.role}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(project)}
              className="rounded-lg border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-xs font-black text-indigo-700 hover:bg-indigo-100"
            >
              Edit
            </button>
            <span
              className={
                project.public
                  ? "rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700"
                  : "rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1 text-[11px] font-black text-amber-700"
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
        <div className="grid gap-4 md:grid-cols-2">
          <ProjectDetail
            label="Problem"
            value={
              project.challenge ||
              project.description ||
              "No problem statement added yet."
            }
            tone="indigo"
          />
          <ProjectDetail
            label="My contribution"
            value={
              project.contribution || "No contribution details added yet."
            }
            tone="violet"
          />
        </div>

        {project.outcome ? (
          <div className="mt-5 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50/70 p-4">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-xs font-black text-emerald-700">
                ✓
              </span>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">
                Outcome
              </p>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {project.outcome}
            </p>
          </div>
        ) : null}

        {assets.length ? (
          <div className="mt-5 rounded-2xl border border-cyan-100 bg-cyan-50/60 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-700">
              Evidence files
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-700">
              {assets.length} uploaded file{assets.length === 1 ? "" : "s"}
            </p>
          </div>
        ) : null}

        {project.tools?.length ? (
          <div className="mt-5">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
              Tools used
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-600 transition group-hover:bg-white"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="border-t border-slate-100 bg-gradient-to-r from-slate-50 via-white to-indigo-50/50 px-6 py-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                Demonstrated capabilities
              </p>
              {skills.length ? (
                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-black text-indigo-700">
                  {skills.length}
                </span>
              ) : null}
            </div>

            {skills.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.slice(0, 4).map((skill) => (
                  <div
                    key={skill.id}
                    className="capability-pill flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-xs shadow-sm"
                  >
                    <span className="font-bold text-slate-700">{skill.name}</span>
                    <span className="h-1 w-1 rounded-full bg-indigo-300" />
                    <span className="font-black text-indigo-600">
                      {skill.evidence_level}
                    </span>
                  </div>
                ))}
                {skills.length > 4 ? (
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500">
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

function ProjectDetail({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "indigo" | "violet";
}) {
  const toneClass =
    tone === "indigo"
      ? "border-indigo-100 bg-indigo-50/60 text-indigo-700"
      : "border-violet-100 bg-violet-50/60 text-violet-700";

  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <p className="text-[10px] font-black uppercase tracking-[0.16em]">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-700">{value}</p>
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
      className="evidence-link rounded-xl border border-indigo-100 bg-white px-3 py-2 text-xs font-black text-indigo-700 shadow-sm hover:border-indigo-200 hover:bg-indigo-50"
    >
      {children} ↗
    </a>
  );
}
