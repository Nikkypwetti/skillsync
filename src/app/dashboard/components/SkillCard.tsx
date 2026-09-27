"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Skill } from "@/types";

export default function SkillCard({
  skill,
  onChanged,
}: {
  skill: Skill;
  onChanged: () => void | Promise<void>;
}) {
  const [level, setLevel] = useState(skill.level);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function saveLevel() {
    setError(null);
    setSaving(true);

    const { error: updateError } = await supabase
      .from("skills")
      .update({ level })
      .eq("id", skill.id)
      .eq("user_id", skill.user_id);

    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    await onChanged();
  }

  async function remove() {
    if (!window.confirm(`Delete "${skill.name}" from your skill library?`)) return;

    setError(null);

    const { error: deleteError } = await supabase
      .from("skills")
      .delete()
      .eq("id", skill.id)
      .eq("user_id", skill.user_id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    await onChanged();
  }

  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-black text-slate-950">{skill.name}</h3>
          <span className="mt-2 inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-indigo-700">
            {skill.category || "General"}
          </span>
        </div>

        <button
          type="button"
          onClick={remove}
          className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 transition hover:bg-red-50 hover:text-red-600"
        >
          Delete
        </button>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-500">Progress</span>
          <span className="font-black text-slate-950">{level}%</span>
        </div>

        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all"
            style={{ width: `${level}%` }}
          />
        </div>

        <input
          aria-label={`Progress for ${skill.name}`}
          type="range"
          min="0"
          max="100"
          step="5"
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
          className="mt-4 w-full accent-indigo-600"
        />
      </div>

      {error ? (
        <p className="mt-3 rounded-lg bg-red-50 p-2 text-xs text-red-700">{error}</p>
      ) : null}

      {level !== skill.level ? (
        <button
          type="button"
          onClick={saveLevel}
          disabled={saving}
          className="mt-4 w-full rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save progress"}
        </button>
      ) : null}
    </article>
  );
}
