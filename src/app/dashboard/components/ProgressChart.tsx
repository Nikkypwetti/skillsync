"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Skill } from "@/types";

export default function ProgressChart({ skills }: { skills: Skill[] }) {
  const data = skills
    .slice(0, 8)
    .map((skill) => ({ name: skill.name, level: skill.level }));

  return (
    <div className="min-h-[360px] rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
          Analytics
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
          Progress snapshot
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          A quick view of your latest confidence levels.
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl bg-slate-50 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-lg font-black text-indigo-600 shadow-sm">
            %
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-600">
            Your chart will appear here
          </p>
          <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
            Add at least one skill to start visualizing your progress.
          </p>
        </div>
      ) : (
        <div className="mt-6 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#64748b" }}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={55}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "#f8fafc" }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 8px 30px rgba(15,23,42,0.08)",
                }}
              />
              <Bar dataKey="level" fill="#4f46e5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
