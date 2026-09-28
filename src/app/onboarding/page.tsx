"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import { supabase } from "@/lib/supabaseClient";

const tracks = [
  "Software Development","Data & Analytics","Automation & AI Operations",
  "Revenue Operations & CRM","Virtual Assistant & Executive Support",
  "Customer Support & Customer Operations","Project & Operations Coordination",
  "Marketing Operations","Design & Content","Other",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [track,setTrack]=useState("");
  const [github,setGithub]=useState("");
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState<string|null>(null);

  async function finish(e:React.FormEvent){
    e.preventDefault();
    if(!track){setError("Choose the career direction that best matches the work you want to show.");return;}
    setSaving(true);setError(null);
    const {data}=await supabase.auth.getUser();
    if(!data.user){router.replace("/auth/login");return;}
    const {error:saveError}=await supabase.from("profiles").update({
      career_track:track,
      github_username:github.trim()||null,
      onboarding_completed:true,
    }).eq("id",data.user.id);
    setSaving(false);
    if(saveError){setError(saveError.message);return;}
    router.replace("/dashboard");
  }

  return <AuthGuard>
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white">
      <form onSubmit={finish} className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 p-7 shadow-2xl sm:p-10">
        <p className="text-xs font-black uppercase tracking-[.2em] text-violet-300">Welcome to SkillSync</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">What kind of work are you building toward?</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">This changes the examples SkillSync shows you. You can change it later.</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {tracks.map(item=><button key={item} type="button" onClick={()=>setTrack(item)} className={`rounded-2xl border p-4 text-left text-sm font-bold transition ${track===item?"border-violet-400 bg-violet-500/15 text-white":"border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"}`}>{item}</button>)}
        </div>
        <label className="mt-7 block text-sm font-bold">GitHub username <span className="font-normal text-slate-500">(optional)</span>
          <input className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-violet-400" value={github} onChange={e=>setGithub(e.target.value)} placeholder="your-github-username"/>
        </label>
        {error?<p className="mt-4 text-sm text-rose-300">{error}</p>:null}
        <button disabled={saving} className="mt-7 w-full rounded-xl bg-violet-600 px-5 py-3 font-black hover:bg-violet-500 disabled:opacity-50">{saving?"Saving…":"Continue to workspace"}</button>
      </form>
    </main>
  </AuthGuard>;
}
