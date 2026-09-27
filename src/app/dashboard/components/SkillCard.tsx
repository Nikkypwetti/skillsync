"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Skill } from "@/types";

export default function SkillCard({ skill, onChanged }: { skill: Skill; onChanged: () => void | Promise<void> }) {
  const [level, setLevel] = useState(skill.level);
  const [saving, setSaving] = useState(false);

  async function saveLevel() {
    setSaving(true);
    await supabase.from("skills").update({ level }).eq("id", skill.id).eq("user_id", skill.user_id);
    setSaving(false);
    await onChanged();
  }

  async function remove() {
    if (!window.confirm(`Delete ${skill.name}?`)) return;
    await supabase.from("skills").delete().eq("id", skill.id).eq("user_id", skill.user_id);
    await onChanged();
  }

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-slate-900">{skill.name}</h3>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">{skill.category || "General"}</p>
        </div>
        <button onClick={remove} className="text-xs font-semibold text-slate-400 hover:text-red-600">Delete</button>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-600" style={{ width: `${level}%` }} /></div>
      <div className="mt-4 flex items-center gap-3">
        <input aria-label={`Progress for ${skill.name}`} type="range" min="0" max="100" step="5" value={level} onChange={(e) => setLevel(Number(e.target.value))} className="min-w-0 flex-1 accent-indigo-600" />
        <span className="w-12 text-right text-sm font-black text-slate-700">{level}%</span>
      </div>
      {level !== skill.level ? <button onClick={saveLevel} disabled={saving} className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">{saving ? "Saving…" : "Save progress"}</button> : null}
    </article>
  );
}
