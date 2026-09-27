"use client";

import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Project, ProjectAsset } from "@/types";

const tracks = [
  "Software Development",
  "Data & Analytics",
  "Automation & AI Operations",
  "Revenue Operations & CRM",
  "Virtual Assistant & Executive Support",
  "Customer Support & Customer Operations",
  "Project & Operations Coordination",
  "Marketing Operations",
  "Design & Content",
  "Other",
];

const steps = [
  ["01", "Project basics"],
  ["02", "Your work"],
  ["03", "Tools & proof"],
] as const;

type Props = {
  project?: Project | null;
  existingAssets?: ProjectAsset[];
  onSaved: () => void | Promise<void>;
  onCancelEdit?: () => void;
};

export default function ProjectForm({
  project,
  existingAssets = [],
  onSaved,
  onCancelEdit,
}: Props) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState(project?.title || "");
  const [track, setTrack] = useState(project?.career_track || "");
  const [role, setRole] = useState(project?.role || "");
  const [challenge, setChallenge] = useState(
    project?.challenge || project?.description || ""
  );
  const [contribution, setContribution] = useState(project?.contribution || "");
  const [outcome, setOutcome] = useState(project?.outcome || "");
  const [tools, setTools] = useState((project?.tools || []).join(", "));
  const [repo, setRepo] = useState(project?.repo_link || "");
  const [live, setLive] = useState(project?.live_url || "");
  const [evidence, setEvidence] = useState(project?.evidence_url || "");
  const [isPublic, setIsPublic] = useState(project?.public ?? true);
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [files, setFiles] = useState<File[]>([]);
  const [assets, setAssets] = useState<ProjectAsset[]>(existingAssets);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const editing = Boolean(project);

  const selectedFileLabel = useMemo(() => {
    if (!files.length) return "No new files selected";
    return files.length + " file" + (files.length === 1 ? "" : "s") + " ready to upload";
  }, [files]);

  function resetFields() {
    setTitle("");
    setTrack("");
    setRole("");
    setChallenge("");
    setContribution("");
    setOutcome("");
    setTools("");
    setRepo("");
    setLive("");
    setEvidence("");
    setIsPublic(true);
    setFeatured(false);
  }

  function canContinue() {
    if (step === 1) return title.trim().length > 1;
    if (step === 2) return challenge.trim().length > 4 && contribution.trim().length > 4;
    if (step === 3) return tools.trim().length > 1;
    return true;
  }

  function next() {
    if (!canContinue()) {
      setMessage(
        step === 1
          ? "Add a project title before continuing."
          : "Add the problem and what you personally did before continuing."
      );
      return;
    }

    setMessage(null);
    setStep((current) => Math.min(3, current + 1));
  }

  async function uploadFiles(projectId: string, userId: string): Promise<string | null> {
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        return file.name + " is larger than the 10 MB upload limit.";
      }

      const extension = file.name.includes(".")
        ? file.name.split(".").pop()?.toLowerCase() || "file"
        : "file";
      const safeBase =
        file.name
          .replace(/\.[^/.]+$/, "")
          .toLowerCase()
          .replace(/[^a-z0-9-_]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 60) || "evidence";
      const path =
        userId + "/" + projectId + "/" + Date.now() + "-" + safeBase + "." + extension;

      const { error: uploadError } = await supabase.storage
        .from("project-evidence")
        .upload(path, file, {
          contentType: file.type || undefined,
          upsert: false,
        });

      if (uploadError) return uploadError.message;

      const { error: assetError } = await supabase.from("project_assets").insert({
        project_id: projectId,
        user_id: userId,
        storage_path: path,
        public_url: "",
        file_name: file.name,
        file_type: file.type || null,
        file_size: file.size,
      });

      if (assetError) {
        await supabase.storage.from("project-evidence").remove([path]);
        return assetError.message;
      }
    }

    return null;
  }

  async function removeAsset(asset: ProjectAsset) {
    const confirmed = window.confirm('Remove "' + asset.file_name + '" from this project?');
    if (!confirmed) return;

    const { error: storageError } = await supabase.storage
      .from("project-evidence")
      .remove([asset.storage_path]);

    if (storageError) {
      setMessage(storageError.message);
      return;
    }

    const { error: rowError } = await supabase
      .from("project_assets")
      .delete()
      .eq("id", asset.id)
      .eq("user_id", asset.user_id);

    if (rowError) {
      setMessage(rowError.message);
      return;
    }

    setAssets((current) => current.filter((item) => item.id !== asset.id));
    setMessage("Evidence file removed.");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (step < 3) {
      next();
      return;
    }

    if (!title.trim() || !challenge.trim() || !contribution.trim() || !tools.trim()) {
      setMessage(
        "Complete the required project details and add at least one tool before saving."
      );
      return;
    }

    setSaving(true);
    setMessage(null);

    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      setSaving(false);
      setMessage("Please sign in again.");
      return;
    }

    const toolList = tools
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = {
      user_id: auth.user.id,
      title: title.trim(),
      career_track: track || null,
      project_type: project?.project_type || "Portfolio project",
      role: role.trim() || null,
      challenge: challenge.trim(),
      description: challenge.trim(),
      contribution: contribution.trim(),
      outcome: outcome.trim() || null,
      tools: toolList,
      repo_link: repo.trim() || null,
      live_url: live.trim() || null,
      evidence_url: evidence.trim() || null,
      public: isPublic,
      featured,
      updated_at: new Date().toISOString(),
    };

    let projectId = project?.id || null;

    if (project) {
      const { error } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", project.id)
        .eq("user_id", auth.user.id);

      if (error) {
        setSaving(false);
        setMessage(error.message);
        return;
      }
    } else {
      const { data, error } = await supabase
        .from("projects")
        .insert(payload)
        .select("id")
        .single();

      if (error || !data) {
        setSaving(false);
        setMessage(error?.message || "Could not create the project.");
        return;
      }

      projectId = data.id;
    }

    if (projectId && files.length) {
      const uploadError = await uploadFiles(projectId, auth.user.id);
      if (uploadError) {
        setSaving(false);
        setMessage(
          "Project saved, but one or more evidence files could not be uploaded: " +
            uploadError
        );
        await onSaved();
        return;
      }
    }

    setSaving(false);
    setFiles([]);
    setMessage(
      editing
        ? "Project updated. Skill evidence has been recalculated."
        : "Project added. Skill evidence and your portfolio are updating."
    );

    if (!editing) {
      resetFields();
      setStep(1);
    }

    await onSaved();
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid grid-cols-3 gap-2">
        {steps.map(([number, label], index) => {
          const current = index + 1;
          const active = current === step;
          const complete = current < step;

          return (
            <button
              key={number}
              type="button"
              onClick={() => {
                if (current < step || canContinue()) {
                  setMessage(null);
                  setStep(current);
                }
              }}
              className={
                "rounded-2xl border px-3 py-3 text-left transition " +
                (active
                  ? "border-indigo-200 bg-indigo-50"
                  : complete
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-slate-200 bg-white")
              }
            >
              <span
                className={
                  "block text-[10px] font-black uppercase tracking-[0.16em] " +
                  (active
                    ? "text-indigo-600"
                    : complete
                      ? "text-emerald-600"
                      : "text-slate-400")
                }
              >
                {complete ? "Done" : "Step " + number}
              </span>
              <span className="mt-1 block text-xs font-black text-slate-800 sm:text-sm">
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {message ? (
        <div
          role="status"
          className="motion-fade-up rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-sm font-semibold text-indigo-800"
        >
          {message}
        </div>
      ) : null}

      {step === 1 ? (
        <section className="form-section rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/60 p-5">
          <SectionHeading
            number="01"
            title={editing ? "Edit project basics" : "Project basics"}
            description="Start with enough context for a recruiter or client to understand the work."
            tone="indigo"
          />

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="form-label">
              Project title
              <input
                className="field"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Lead-to-Client Automation System"
              />
            </label>

            <label className="form-label">
              Career direction
              <select
                className="field"
                value={track}
                onChange={(e) => setTrack(e.target.value)}
              >
                <option value="">Choose a track</option>
                {tracks.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="form-label md:col-span-2">
              Your role
              <input
                className="field"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Automation Builder, Virtual Assistant, Operations Coordinator..."
              />
            </label>
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="form-section rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/80 via-white to-fuchsia-50/50 p-5">
          <SectionHeading
            number="02"
            title="Your work"
            description="This is the strongest evidence: explain the problem, your contribution, and the outcome."
            tone="violet"
          />

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <label className="form-label">
              What problem were you solving?
              <textarea
                className="field min-h-36 resize-y"
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                required
                placeholder="What was difficult, slow, manual, unclear, or missing?"
              />
            </label>

            <label className="form-label">
              What did you personally do?
              <textarea
                className="field min-h-36 resize-y"
                value={contribution}
                onChange={(e) => setContribution(e.target.value)}
                required
                placeholder="What did you personally build, configure, coordinate, analyze, manage, or improve?"
              />
            </label>
          </div>

          <label className="form-label mt-4 block">
            What changed because of your work?
            <textarea
              className="field min-h-28 resize-y"
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              placeholder="Add a result, measurable outcome, or practical improvement."
            />
          </label>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="form-section rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 via-white to-cyan-50/50 p-5">
          <SectionHeading
            number="03"
            title="Tools, proof & publishing"
            description="Add tools, links, screenshots, or PDFs that make your work easier to verify."
            tone="emerald"
          />

          <label className="form-label mt-5 block">
            Tools used <span className="text-rose-500">*</span>
            <input
              className="field"
              value={tools}
              onChange={(e) => setTools(e.target.value)}
              placeholder="n8n, Airtable, Gmail, Google Calendar, HubSpot..."
            />
            <span className="mt-2 block text-xs font-normal text-slate-400">
              Required. Separate tools with commas. Skill evidence is not generated until you complete this field.
            </span>
          </label>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <label className="form-label">
              Repository
              <input
                className="field"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                placeholder="GitHub link"
              />
            </label>

            <label className="form-label">
              Live project
              <input
                className="field"
                value={live}
                onChange={(e) => setLive(e.target.value)}
                placeholder="Live link"
              />
            </label>

            <label className="form-label">
              Walkthrough / case study
              <input
                className="field"
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                placeholder="Loom, Notion, Drive..."
              />
            </label>
          </div>

          <div className="mt-5 rounded-2xl border border-dashed border-emerald-200 bg-white/80 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-slate-900">
                  Screenshots & evidence files
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Upload PNG, JPG, WebP, GIF, or PDF files up to 10 MB each.
                </p>
              </div>

              <label className="cursor-pointer rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-black text-white hover:bg-emerald-700">
                Choose files
                <input
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp,image/gif,application/pdf"
                  className="sr-only"
                  onChange={(e) =>
                    setFiles(Array.from(e.target.files || []))
                  }
                />
              </label>
            </div>

            <p className="mt-3 text-xs font-semibold text-emerald-700">
              {selectedFileLabel}
            </p>

            {files.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {files.map((file) => (
                  <span
                    key={file.name + "-" + file.size}
                    className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700"
                  >
                    {file.name}
                  </span>
                ))}
              </div>
            ) : null}

            {assets.length ? (
              <div className="mt-5 border-t border-emerald-100 pt-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                  Existing evidence
                </p>
                <div className="mt-3 space-y-2">
                  {assets.map((asset) => (
                    <div
                      key={asset.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2"
                    >
                      <span className="truncate text-xs font-semibold text-slate-600">
                        {asset.file_name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeAsset(asset)}
                        className="shrink-0 text-xs font-black text-rose-600 hover:text-rose-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="mt-1 h-4 w-4 accent-indigo-600"
              />
              <span>
                <span className="block text-sm font-black text-slate-800">
                  Publish on my portfolio
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  Turn this off for confidential or unfinished work.
                </span>
              </span>
            </label>

            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="mt-1 h-4 w-4 accent-violet-600"
              />
              <span>
                <span className="block text-sm font-black text-slate-800">
                  Feature this project
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  Featured projects appear first on your public portfolio.
                </span>
              </span>
            </label>
          </div>
        </section>
      ) : null}

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black">
            {editing ? "Editing an existing project" : "Step " + step + " of 3"}
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            {step < 3
              ? "Continue when this section accurately reflects your work."
              : "Saving will refresh the project evidence and portfolio."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {editing && onCancelEdit ? (
            <button
              type="button"
              onClick={onCancelEdit}
              className="rounded-xl border border-white/15 px-4 py-2.5 text-xs font-black text-white hover:bg-white/10"
            >
              Cancel edit
            </button>
          ) : null}

          {step > 1 ? (
            <button
              type="button"
              onClick={() => {
                setMessage(null);
                setStep((current) => Math.max(1, current - 1));
              }}
              className="rounded-xl border border-white/15 px-4 py-2.5 text-xs font-black text-white hover:bg-white/10"
            >
              Back
            </button>
          ) : null}

          {step < 3 ? (
            <button
              type="button"
              onClick={next}
              className="project-submit-button rounded-xl bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 px-5 py-2.5 text-xs font-black text-white"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={saving}
              className="project-submit-button rounded-xl bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 px-5 py-2.5 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving project…"
                : editing
                  ? "Save changes"
                  : "Finish & add project"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

function SectionHeading({
  number,
  title,
  description,
  tone,
}: {
  number: string;
  title: string;
  description: string;
  tone: "indigo" | "violet" | "emerald";
}) {
  const toneClass = {
    indigo: "bg-indigo-600 shadow-indigo-200",
    violet: "bg-violet-600 shadow-violet-200",
    emerald: "bg-emerald-600 shadow-emerald-200",
  }[tone];

  return (
    <div className="flex items-start gap-3">
      <span
        className={
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white shadow-lg " +
          toneClass
        }
      >
        {number}
      </span>
      <div>
        <h3 className="text-base font-black text-slate-900">{title}</h3>
        <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}
