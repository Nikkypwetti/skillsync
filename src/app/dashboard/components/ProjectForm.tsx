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

export default function ProjectForm({ onCreated }: { onCreated: () => void | Promise<void> }) {
  const [title,setTitle]=useState("");
  const [track,setTrack]=useState("");
  const [role,setRole]=useState("");
  const [challenge,setChallenge]=useState("");
  const [contribution,setContribution]=useState("");
  const [outcome,setOutcome]=useState("");
  const [tools,setTools]=useState("");
  const [repo,setRepo]=useState("");
  const [live,setLive]=useState("");
  const [evidence,setEvidence]=useState("");
  const [saving,setSaving]=useState(false);
  const [message,setMessage]=useState<string|null>(null);

  async function submit(e:React.FormEvent) {
    e.preventDefault();
    setSaving(true); setMessage(null);
    const {data:auth}=await supabase.auth.getUser();
    if(!auth.user){setSaving(false);setMessage("Please sign in again.");return;}
    const toolList=tools.split(",").map(x=>x.trim()).filter(Boolean);
    const {error}=await supabase.from("projects").insert({
      user_id:auth.user.id,title:title.trim(),career_track:track||null,project_type:"Portfolio project",
      role:role.trim()||null,challenge:challenge.trim(),description:challenge.trim(),
      contribution:contribution.trim(),outcome:outcome.trim()||null,tools:toolList,
      repo_link:repo.trim()||null,live_url:live.trim()||null,evidence_url:evidence.trim()||null,public:true
    });
    setSaving(false);
    if(error){setMessage(error.message);return;}
    setTitle("");setTrack("");setRole("");setChallenge("");setContribution("");setOutcome("");setTools("");setRepo("");setLive("");setEvidence("");
    setMessage("Project added to your portfolio.");
    await onCreated();
  }

  return <form onSubmit={submit} className="space-y-5">
    {message?<div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">{message}</div>:null}
    <div className="grid gap-4 md:grid-cols-2">
      <label className="form-label">Project title<input className="field" value={title} onChange={e=>setTitle(e.target.value)} required placeholder="Lead-to-Client Automation System"/></label>
      <label className="form-label">Career direction<select className="field" value={track} onChange={e=>setTrack(e.target.value)}><option value="">Choose a track</option>{tracks.map(x=><option key={x}>{x}</option>)}</select></label>
      <label className="form-label md:col-span-2">Your role<input className="field" value={role} onChange={e=>setRole(e.target.value)} placeholder="Automation Builder, Virtual Assistant, Operations Coordinator..."/></label>
    </div>
    <label className="form-label">What problem were you solving?<textarea className="field resize-y" rows={3} value={challenge} onChange={e=>setChallenge(e.target.value)} required/></label>
    <label className="form-label">What did you personally do?<textarea className="field resize-y" rows={4} value={contribution} onChange={e=>setContribution(e.target.value)} required placeholder="Describe the work you personally completed."/></label>
    <label className="form-label">What changed because of your work?<textarea className="field resize-y" rows={3} value={outcome} onChange={e=>setOutcome(e.target.value)} placeholder="Add the result or practical improvement."/></label>
    <label className="form-label">Tools used<input className="field" value={tools} onChange={e=>setTools(e.target.value)} placeholder="n8n, Airtable, Gmail, Google Calendar, HubSpot..."/><span className="mt-2 block text-xs font-normal text-slate-400">Separate tools with commas.</span></label>
    <div className="grid gap-4 md:grid-cols-3">
      <label className="form-label">Repository<input className="field" value={repo} onChange={e=>setRepo(e.target.value)} placeholder="GitHub link"/></label>
      <label className="form-label">Live project<input className="field" value={live} onChange={e=>setLive(e.target.value)} placeholder="Live link"/></label>
      <label className="form-label">Evidence<input className="field" value={evidence} onChange={e=>setEvidence(e.target.value)} placeholder="Case study or walkthrough"/></label>
    </div>
    <button disabled={saving} className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-black text-white shadow-lg disabled:opacity-50">{saving?"Saving project…":"Add project to portfolio"}</button>
  </form>;
}
