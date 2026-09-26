"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SkillForm({ onCreated }: { onCreated: () => void | Promise<void> }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [level, setLevel] = useState(50);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      setSaving(false);
      setError("You need to sign in first.");
      return;
    }

    const { error } = await supabase.from("skills").insert({
      user_id: auth.user.id,
      name: name.trim(),
      category,
      level,
    });

    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }

    setName("");
    setLevel(50);
    await onCreated();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error ? <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Skill name
          <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} placeholder="Next.js" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none ring-indigo-500 focus:ring-2" />
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none ring-indigo-500 focus:ring-2">
            <option>Frontend</option><option>Backend</option><option>Cloud / DevOps</option><option>Data</option><option>Automation</option><option>Soft Skills</option>
          </select>
        </label>
      </div>
      <label className="block space-y-2 text-sm font-medium text-slate-700">
        Progress: <span className="font-black text-indigo-600">{level}%</span>
        <input type="range" min="0" max="100" step="5" value={level} onChange={(e) => setLevel(Number(e.target.value))} className="w-full accent-indigo-600" />
      </label>
      <button disabled={saving || !name.trim()} className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">{saving ? "Saving…" : "Add skill"}</button>
    </form>
  );
}
