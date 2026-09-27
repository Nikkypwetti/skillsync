"use client";

import { useEffect, useState } from "react";
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

export default function ProfileForm({ onSaved }: { onSaved?: () => void | Promise<void> }) {
  const [form,setForm]=useState({username:"",fullName:"",careerTrack:"",headline:"",location:"",about:"",linkedinUrl:"",websiteUrl:""});
  const [loaded,setLoaded]=useState(false);
  const [saving,setSaving]=useState(false);
  const [message,setMessage]=useState<string|null>(null);

  useEffect(()=>{
    let active=true;
    async function load(){
      const {data:auth}=await supabase.auth.getUser();
      if(!auth.user)return;
      const {data}=await supabase.from("profiles").select("username,full_name,career_track,headline,location,about,linkedin_url,website_url").eq("id",auth.user.id).maybeSingle();
      if(!active)return;
      setForm({
        username:data?.username||"",
        fullName:data?.full_name||auth.user.user_metadata?.full_name||"",
        careerTrack:data?.career_track||"",
        headline:data?.headline||"",
        location:data?.location||"",
        about:data?.about||"",
        linkedinUrl:data?.linkedin_url||"",
        websiteUrl:data?.website_url||"",
      });
      setLoaded(true);
    }
    load();
    return()=>{active=false};
  },[]);

  async function save(e:React.FormEvent){
    e.preventDefault();setSaving(true);setMessage(null);
    const {data:auth}=await supabase.auth.getUser();
    if(!auth.user){setSaving(false);return;}
    const username=form.username.trim().toLowerCase().replace(/[^a-z0-9-]/g,"-").replace(/-+/g,"-");
    const {error}=await supabase.from("profiles").upsert({
      id:auth.user.id,username,
      full_name:form.fullName.trim()||null,
      career_track:form.careerTrack||null,
      headline:form.headline.trim()||null,
      location:form.location.trim()||null,
      about:form.about.trim()||null,
      linkedin_url:form.linkedinUrl.trim()||null,
      website_url:form.websiteUrl.trim()||null,
    });
    setSaving(false);
    setMessage(error?error.message:"Portfolio profile saved.");
    if(!error)await onSaved?.();
  }

  if(!loaded)return <div className="text-sm text-slate-400">Loading profile…</div>;

  return <form onSubmit={save} className="space-y-4">
    <div className="grid gap-4 md:grid-cols-2">
      <label className="form-label">Full name<input className="field" value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})}/></label>
      <label className="form-label">Portfolio username<input className="field" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} placeholder="your-name"/></label>
      <label className="form-label">Career direction<select className="field" value={form.careerTrack} onChange={e=>setForm({...form,careerTrack:e.target.value})}><option value="">Choose a track</option>{tracks.map(track=><option key={track}>{track}</option>)}</select></label>
      <label className="form-label">Location<input className="field" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="City, Country or Remote"/></label>
    </div>
    <label className="form-label">Professional headline<input className="field" value={form.headline} onChange={e=>setForm({...form,headline:e.target.value})} placeholder="Automation & CRM Operations | Building reliable workflows"/></label>
    <label className="form-label">About<textarea className="field resize-y" rows={4} value={form.about} onChange={e=>setForm({...form,about:e.target.value})} placeholder="Describe the problems you solve and the work you want to do."/></label>
    <div className="grid gap-4 md:grid-cols-2">
      <label className="form-label">LinkedIn<input className="field" value={form.linkedinUrl} onChange={e=>setForm({...form,linkedinUrl:e.target.value})} placeholder="LinkedIn profile link"/></label>
      <label className="form-label">Website<input className="field" value={form.websiteUrl} onChange={e=>setForm({...form,websiteUrl:e.target.value})} placeholder="Portfolio or website link"/></label>
    </div>
    {message?<p className="text-sm font-medium text-slate-600">{message}</p>:null}
    <button disabled={saving} className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-slate-800 disabled:opacity-50">{saving?"Saving…":"Save profile"}</button>
  </form>;
}
