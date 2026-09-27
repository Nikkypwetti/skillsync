"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

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

export default function ProjectForm({
  onCreated,
}: {
  onCreated: () => void | Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [track, setTrack] = useState("");
  const [role, setRole] = useState("");
  const [challenge, setChallenge] = useState("");
  const [contribution, setContribution] = useState("");
  const [outcome, setOutcome] = useState("");
  const [tools, setTools] = useState("");
  const [repo, setRepo] = useState("");
  const [live, setLive] = useState("");
  const [evidence, setEvidence] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
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

    const { error } = await supabase.from("projects").insert({
      user_id: auth.user.id,
      title: title.trim(),
      career_track: track || null,
      project_type: "Portfolio project",
      role: role.trim() || null,
      challenge: challenge.trim(),
      description: challenge.trim(),
      contribution: contribution.trim(),
      outcome: outcome.trim() || null,
      tools: toolList,
      repo_link: repo.trim() || null,
      live_url: live.trim() || null,
      evidence_url: evidence.trim() || null,
      public: true,
    });

    setSaving(false);

    if (error) {
      setMessage(error.message);
      return;
    }

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
    setMessage("Project added. Your capability evidence and portfolio are updating.");
    await onCreated();
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {message ? (
        <div className="motion-fade-up rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 text-sm font-semibold text-emerald-800">
          {message}
        </div>
      ) : null}

      <section className="form-section rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/60 p-5">
        <SectionHeading
          number="01"
          title="Project basics"
          description="Tell SkillSync what the project was and the kind of work you were doing."
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

      <section className="form-section rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/80 via-white to-fuchsia-50/50 p-5">
        <SectionHeading
          number="02"
          title="Your work"
          description="This is the most important evidence. Be specific about the problem and what you personally handled."
          tone="violet"
        />

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <label className="form-label">
            What problem were you solving?
            <textarea
              className="field min-h-32 resize-y"
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}
              required
              placeholder="What was difficult, slow, manual, unclear, or missing before the project?"
            />
          </label>

          <label className="form-label">
            What did you personally do?
            <textarea
              className="field min-h-32 resize-y"
              value={contribution}
              onChange={(e) => setContribution(e.target.value)}
              required
              placeholder="Describe the work you personally completed, configured, built, coordinated, analyzed, or supported."
            />
          </label>
        </div>

        <label className="form-label mt-4 block">
          What changed because of your work?
          <textarea
            className="field min-h-28 resize-y"
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            placeholder="Add a measurable result when possible, or describe the practical improvement."
          />
        </label>
      </section>

      <section className="form-section rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 via-white to-cyan-50/50 p-5">
        <SectionHeading
          number="03"
          title="Tools & proof"
          description="Add the tools and links that make your project easy to verify."
          tone="emerald"
        />

        <label className="form-label mt-5 block">
          Tools used
          <input
            className="field"
            value={tools}
            onChange={(e) => setTools(e.target.value)}
            placeholder="n8n, Airtable, Gmail, Google Calendar, HubSpot..."
          />
          <span className="mt-2 block text-xs font-normal text-slate-400">
            Separate tools with commas. SkillSync uses them when identifying demonstrated capabilities.
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
            Evidence
            <input
              className="field"
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              placeholder="Case study or walkthrough"
            />
          </label>
        </div>
      </section>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black">Ready to turn this project into proof?</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            SkillSync will analyze the project evidence after it is saved.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="project-submit-button rounded-xl bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-indigo-950/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving project…" : "Add project to portfolio"}
        </button>
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
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white shadow-lg ${toneClass}`}
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
