"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Certificate, Experience, Project } from "@/types";

type Props = { projects: Project[]; profileComplete: number; onChanged:()=>void|Promise<void> };

export default function CareerToolkit({projects,profileComplete,onChanged}:Props){
  const [github,setGithub]=useState("");
  const [repos,setRepos]=useState<Array<{id:number;name:string;url:string;description:string|null;language:string|null;stars:number}>>([]);
  const [loadingRepos,setLoadingRepos]=useState(false);
  const [experiences,setExperiences]=useState<Experience[]>([]);
  const [certificates,setCertificates]=useState<Certificate[]>([]);
  const [experience,setExperience]=useState({role:"",organization:"",description:""});
  const [certificate,setCertificate]=useState({name:"",issuer:"",url:""});
  const [message,setMessage]=useState<string|null>(null);

  async function load(){
    const {data:auth}=await supabase.auth.getUser(); if(!auth.user)return;
    const [p,e,c]=await Promise.all([
      supabase.from("profiles").select("github_username").eq("id",auth.user.id).maybeSingle(),
      supabase.from("experiences").select("*").eq("user_id",auth.user.id).order("created_at",{ascending:false}),
      supabase.from("certificates").select("*").eq("user_id",auth.user.id).order("created_at",{ascending:false}),
    ]);
    setGithub(p.data?.github_username||"");
    setExperiences((e.data||[]) as Experience[]);
    setCertificates((c.data||[]) as Certificate[]);
  }

  useEffect(()=>{void load();},[]);

  const readiness=useMemo(()=>{
    const project=projects.length?20:0;
    const evidence=projects.some(p=>p.tools?.length)?10:0;
    const profile=Math.max(0,profileComplete-project-evidence);
    return {profile,project,evidence};
  },[projects,profileComplete]);

  async function findRepos(){
    if(!github.trim())return;
    setLoadingRepos(true);setMessage(null);
    const res=await fetch("/api/github?username="+encodeURIComponent(github.trim()));
    const data=await res.json(); setLoadingRepos(false);
    if(!res.ok){setMessage(data.error||"Could not load repositories.");return;}
    setRepos(data);
    const {data:auth}=await supabase.auth.getUser();
    if(auth.user)await supabase.from("profiles").update({github_username:github.trim()}).eq("id",auth.user.id);
  }

  async function importRepo(repo:{name:string;url:string;description:string|null;language:string|null}){
    const {data:auth}=await supabase.auth.getUser(); if(!auth.user)return;
    const {error}=await supabase.from("projects").insert({
      user_id:auth.user.id,title:repo.name,
      challenge:repo.description||"Imported from GitHub. Add the problem this repository solves.",
      description:repo.description||null,
      contribution:"Add what you personally built or changed before publishing this project.",
      tools:repo.language?[repo.language]:[],
      repo_link:repo.url,career_track:"Software Development",
      project_type:"GitHub project",status:"in_progress",source:"github",
      public:false,featured:false,
    });
    if(error){setMessage(error.message);return;}
    setMessage(repo.name+" imported as a private in-progress project. Edit it to confirm your contribution before publishing.");
    await onChanged();
  }

  async function addExperience(e:React.FormEvent){
    e.preventDefault(); const {data:auth}=await supabase.auth.getUser(); if(!auth.user)return;
    const {error}=await supabase.from("experiences").insert({user_id:auth.user.id,role:experience.role,organization:experience.organization,description:experience.description||null});
    if(error){setMessage(error.message);return;} setExperience({role:"",organization:"",description:""}); await load();
  }
  async function addCertificate(e:React.FormEvent){
    e.preventDefault(); const {data:auth}=await supabase.auth.getUser(); if(!auth.user)return;
    const {error}=await supabase.from("certificates").insert({user_id:auth.user.id,name:certificate.name,issuer:certificate.issuer||null,url:certificate.url||null});
    if(error){setMessage(error.message);return;} setCertificate({name:"",issuer:"",url:""}); await load();
  }

  function resumeBullets(project:Project){
    const tools=(project.tools||[]).join(", ");
    return [
      `Built ${project.title}${tools?" using "+tools:""} to address ${(project.challenge||"a defined operational need").replace(/\.$/,"")}.`,
      `${project.contribution||"Documented the personal contribution and implementation work."}`,
      project.outcome?`Outcome: ${project.outcome}`:"Add a verified outcome to strengthen this resume bullet.",
    ];
  }

  return <div className="space-y-6">
    {message?<div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-sm font-semibold text-indigo-800">{message}</div>:null}

    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <p className="eyebrow">Portfolio readiness</p><h2 className="mt-2 text-2xl font-black">Know exactly what is complete</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Ready label="Profile information" value={readiness.profile} total={70}/>
        <Ready label="Project evidence" value={readiness.project} total={20}/>
        <Ready label="Demonstrated skills" value={readiness.evidence} total={10}/>
      </div>
      <p className="mt-4 text-sm text-slate-500">Next: complete your profile, keep at least one finished project public, and add screenshots, links, or other proof where possible.</p>
    </section>

    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <p className="eyebrow">GitHub import</p><h2 className="mt-2 text-2xl font-black">Bring a repository into SkillSync</h2>
      <div className="mt-4 flex gap-2"><input className="field" value={github} onChange={e=>setGithub(e.target.value)} placeholder="GitHub username"/><button onClick={findRepos} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-black text-white">{loadingRepos?"Loading…":"Find repos"}</button></div>
      {repos.length?<div className="mt-4 grid gap-3 md:grid-cols-2">{repos.map(repo=><div key={repo.id} className="rounded-2xl border border-slate-200 p-4"><p className="font-black">{repo.name}</p><p className="mt-1 text-xs text-slate-500">{repo.description||"No GitHub description"}{repo.language?" · "+repo.language:""}</p><button onClick={()=>importRepo(repo)} className="mt-3 text-xs font-black text-indigo-700">Import as draft →</button></div>)}</div>:null}
    </section>

    <section className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="eyebrow">Experience</p><h2 className="mt-2 text-xl font-black">Work, freelance & volunteer experience</h2>
        <form onSubmit={addExperience} className="mt-4 space-y-3"><input required className="field" placeholder="Role" value={experience.role} onChange={e=>setExperience({...experience,role:e.target.value})}/><input required className="field" placeholder="Organization / client" value={experience.organization} onChange={e=>setExperience({...experience,organization:e.target.value})}/><textarea className="field" placeholder="What you did" value={experience.description} onChange={e=>setExperience({...experience,description:e.target.value})}/><button className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-black text-white">Add experience</button></form>
        <div className="mt-4 space-y-2">{experiences.map(item=><div key={item.id} className="rounded-xl bg-slate-50 p-3 text-sm"><b>{item.role}</b> · {item.organization}</div>)}</div>
      </div>
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="eyebrow">Certifications</p><h2 className="mt-2 text-xl font-black">Credentials that support your work</h2>
        <form onSubmit={addCertificate} className="mt-4 space-y-3"><input required className="field" placeholder="Certificate name" value={certificate.name} onChange={e=>setCertificate({...certificate,name:e.target.value})}/><input className="field" placeholder="Issuer" value={certificate.issuer} onChange={e=>setCertificate({...certificate,issuer:e.target.value})}/><input className="field" placeholder="Credential URL" value={certificate.url} onChange={e=>setCertificate({...certificate,url:e.target.value})}/><button className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-black text-white">Add certification</button></form>
        <div className="mt-4 space-y-2">{certificates.map(item=><div key={item.id} className="rounded-xl bg-slate-50 p-3 text-sm"><b>{item.name}</b>{item.issuer?" · "+item.issuer:""}</div>)}</div>
      </div>
    </section>

    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <p className="eyebrow">Resume & LinkedIn generator</p><h2 className="mt-2 text-2xl font-black">Turn verified project facts into reusable copy</h2>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">{projects.map(project=><div key={project.id} className="rounded-2xl border border-slate-200 p-4"><p className="font-black">{project.title}</p><div className="mt-3 space-y-2">{resumeBullets(project).map((line,i)=><p key={i} className="text-sm leading-6 text-slate-600">• {line}</p>)}</div></div>)}</div>
    </section>
  </div>;
}

function Ready({label,value,total}:{label:string;value:number;total:number}){return <div className="rounded-2xl bg-slate-50 p-4"><div className="flex items-center justify-between"><span className="text-xs font-black uppercase tracking-wider text-slate-500">{label}</span><b>{value}/{total}</b></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-indigo-600" style={{width:`${Math.min(100,(value/total)*100)}%`}}/></div></div>}
