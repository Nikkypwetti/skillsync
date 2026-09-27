"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const categories = [
  "Frontend",
  "Backend",
  "Cloud / DevOps",
  "Data",
  "Automation",
  "Soft Skills",
];

export default function SkillForm({
  onCreated,
}: {
  onCreated: () => void | Promise<void>;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const cleanName = name.trim();
    if (!cleanName) {
      setError("Enter a skill name.");
      return;
    }

    if (!category) {
      setError("Select a category.");
      return;
    }

    setSaving(true);

    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      setSaving(false);
      setError("Your session has expired. Please sign in again.");
      return;
    }

    const { error: insertError } = await supabase.from("skills").insert({
      user_id: auth.user.id,
      name: cleanName,
      category,
      level,
    });

    setSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setName("");
    setCategory("");
    setLevel(0);
    setSuccess("Skill added successfully.");
    await onCreated();
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
          {success}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-semibold text-slate-700">
          Skill name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={80}
            placeholder="e.g. n8n"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          />
        </label>

        <label className="space-y-2 text-sm font-semibold text-slate-700">
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal text-slate-950 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          >
            <option value="">Select a category</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="rounded-2xl bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-700">Current confidence</p>
            <p className="mt-1 text-xs text-slate-500">
              Move the slider only when you have assessed your current level.
            </p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-indigo-600 shadow-sm">
            {level}%
          </span>
        </div>

        <input
          aria-label="Skill progress"
          type="range"
          min="0"
          max="100"
          step="5"
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
          className="mt-4 w-full accent-indigo-600"
        />

        <div className="mt-2 flex justify-between text-[11px] font-medium text-slate-400">
          <span>Starting</span>
          <span>Comfortable</span>
          <span>Advanced</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving || !name.trim() || !category}
        className="inline-flex min-h-11 items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Adding skill…" : "Add skill"}
      </button>
    </form>
  );
}
