"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Skill } from "@/types";

export default function ProgressChart({ skills }: { skills: Skill[] }) {
  const data = skills.slice(0, 8).map((skill) => ({ name: skill.name, level: skill.level }));

  return (
    <div className="min-h-[330px] rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black tracking-tight text-slate-900">Progress snapshot</h2>
      <p className="mt-1 text-sm text-slate-500">Your latest skill confidence levels.</p>
      {data.length === 0 ? (
        <div className="flex h-56 items-center justify-center text-sm text-slate-400">Add skills to see your chart.</div>
      ) : (
        <div className="mt-6 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={55} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="level" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
