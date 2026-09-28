"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { levelFromScore } from "@/lib/evidence";
import type { Profile, Project, ProjectAsset, ProjectSkill } from "@/types";

export default function PortfolioPage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const [profile,setProfile]=useState<Profile|null>(null);
  const [projects,setProjects]=useState<Project[]>([]);
  const [skills,setSkills]=useState<ProjectSkill[]>([]);
  const [assets,setAssets]=useState<ProjectAsset[]>([]);
  const [assetUrls,setAssetUrls]=useState<Record<string,string>>({});
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    let active=true;
    async function load(){
      let userId:string|null=null;
      let profileData:Profile|null=null;

      if(username==="me"){
        const {data:auth}=await supabase.auth.getUser();
        if(auth.user){
          userId=auth.user.id;
          const {data}=await supabase.from("profiles").select("*").eq("id",userId).maybeSingle();
          profileData=data as Profile|null;
          if(!profileData){
            profileData={id:userId,full_name:auth.user.user_metadata?.full_name||auth.user.email?.split("@")[0]||"SkillSync User",username:null,career_track:null,headline:null,location:null,about:null,linkedin_url:null,website_url:null,portfolio_public:true};
          }
        }
      }else{
        const {data}=await supabase.from("profiles").select("*").eq("username",username).maybeSingle();
        profileData=data as Profile|null;
        userId=profileData?.id||null;
      }

      if(userId){
        const [projectResult,skillResult,assetResult]=await Promise.all([
          supabase.from("projects").select("*").eq("user_id",userId).eq("public",true).order("featured",{ascending:false}).order("created_at",{ascending:false}),
          supabase.from("project_skills").select("*").eq("user_id",userId),
          supabase.from("project_assets").select("*").eq("user_id",userId).order("created_at",{ascending:true}),
        ]);
        if(active){
          const projectRows=(projectResult.data||[]) as Project[];
          const assetRows=(assetResult.data||[]) as ProjectAsset[];
          setProjects(projectRows);
          setSkills((skillResult.data||[]) as ProjectSkill[]);
          setAssets(assetRows);

          const urls:Record<string,string>={};
          for(const asset of assetRows){
            const {data:signed}=await supabase.storage
              .from("project-evidence")
              .createSignedUrl(asset.storage_path,3600);
            if(signed?.signedUrl) urls[asset.id]=signed.signedUrl;
          }
          if(active) setAssetUrls(urls);
        }
      }
      if(active){setProfile(profileData);setLoading(false);}
    }
    load();
    return()=>{active=false};
  },[username]);

  const capabilityMap=useMemo(()=>{
    const map=new Map<string,{name:string;category:string;score:number;count:number;rationale:string|null}>();

    for(const skill of skills){
      const publicProject=projects.some(project=>project.id===skill.project_id);
      if(!publicProject)continue;

      const key=skill.name.toLowerCase();
      const existing=map.get(key);

      if(!existing){
        map.set(key,{
          name:skill.name,
          category:skill.category||"General",
          score:skill.evidence_score,
          count:1,
          rationale:skill.rationale,
        });
      }else{
        existing.count+=1;
        if(skill.evidence_score>existing.score){
          existing.score=skill.evidence_score;
          existing.rationale=skill.rationale;
        }
      }
    }

    return Array.from(map.values()).map(skill=>{
      const aggregateScore=Math.min(100,skill.score+Math.min(12,(skill.count-1)*4));
      return {...skill,score:aggregateScore,level:levelFromScore(aggregateScore)};
    }).sort((a,b)=>b.score-a.score);
  },[skills,projects]);

  if(loading)return <main className="min-h-screen bg-slate-950 p-8 text-white">Building portfolio…</main>;
  if(!profile)return <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white"><div className="text-center"><h1 className="text-3xl font-black">Portfolio not found</h1><Link href="/" className="mt-4 inline-block text-violet-300">Back to SkillSync</Link></div></main>;

  const name=profile.full_name||profile.username||"SkillSync Professional";

  return (
    <main className="min-h-screen bg-[#09090f] text-white">
      <div className="border-b border-white/10 bg-black/20 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-black tracking-tight text-white hover:text-violet-300">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-xs font-black text-white">
              S
            </span>
            SkillSync
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-slate-200 hover:bg-white/10"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl border border-violet-400/20 bg-violet-400/10 px-3 py-2 text-xs font-black text-violet-200 hover:bg-violet-400/20"
            >
              Back to workspace
            </Link>
            <span className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-slate-300 sm:inline-flex">
              Proof-based profile
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <section className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-gradient-to-br from-white/[.08] to-white/[.03] p-7 sm:p-10">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl"/>
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              {profile.career_track?<p className="text-xs font-black uppercase tracking-[.24em] text-violet-300">{profile.career_track}</p>:null}
              <h1 className="mt-3 text-4xl font-black tracking-[-.045em] sm:text-6xl">{name}</h1>
              <p className="mt-4 max-w-3xl text-xl font-semibold leading-8 text-slate-200">{profile.headline||"Project-based professional building practical, evidence-backed experience."}</p>
              {profile.about?<p className="mt-5 max-w-3xl text-sm leading-7 text-slate-400">{profile.about}</p>:null}
              <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold">
                {profile.location?<span className="rounded-full bg-white/5 px-3 py-1.5 text-slate-300">{profile.location}</span>:null}
                {profile.linkedin_url?<a className="rounded-full bg-white/5 px-3 py-1.5 text-violet-300 hover:bg-white/10" href={profile.linkedin_url} target="_blank" rel="noreferrer">LinkedIn ↗</a>:null}
                {profile.website_url?<a className="rounded-full bg-white/5 px-3 py-1.5 text-violet-300 hover:bg-white/10" href={profile.website_url} target="_blank" rel="noreferrer">Website ↗</a>:null}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Metric value={projects.length} label="Projects"/>
              <Metric value={capabilityMap.length} label="Proven skills"/>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5">
            <p className="text-xs font-black uppercase tracking-[.22em] text-violet-300">Featured work</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">Projects that prove the work</h2>
          </div>
          {projects.length===0?<div className="rounded-[2rem] border border-white/10 bg-white/[.04] p-8 text-slate-400">No public projects yet.</div>:(
            <div className="grid gap-5 lg:grid-cols-2">
              {projects.map(project=>{
                const projectSkills=skills.filter(skill=>skill.project_id===project.id);
                const projectAssets=assets.filter(asset=>asset.project_id===project.id);
                const cover=projectAssets.find(asset=>asset.file_type?.startsWith("image/"));
                return <article key={project.id} className="rounded-[2rem] border border-white/10 bg-white/[.045] p-6 transition hover:-translate-y-1 hover:bg-white/[.06]">
                  {cover && assetUrls[cover.id] ? (
                    <div className="mb-5 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={assetUrls[cover.id]} alt={project.title + " evidence"} className="h-52 w-full object-cover" />
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-2">
                    {project.career_track?<span className="rounded-full bg-violet-500/15 px-3 py-1 text-[11px] font-black text-violet-200">{project.career_track}</span>:null}
                    {project.project_type?<span className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-black text-slate-400">{project.project_type}</span>:null}
                  </div>
                  <h3 className="mt-4 text-2xl font-black">{project.title}</h3>
                  {project.role?<p className="mt-1 text-sm font-bold text-violet-300">{project.role}</p>:null}

                  {project.challenge?<Block label="Problem" text={project.challenge}/>:null}
                  {project.contribution?<Block label="What I did" text={project.contribution}/>:null}
                  {project.outcome?<Block label="Outcome" text={project.outcome}/>:null}

                  {project.tools?.length?<div className="mt-5 flex flex-wrap gap-2">{project.tools.map(tool=><span key={tool} className="rounded-lg bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-300">{tool}</span>)}</div>:null}

                  {projectSkills.length?<div className="mt-5 border-t border-white/10 pt-5"><p className="text-[11px] font-black uppercase tracking-[.18em] text-slate-500">Skills demonstrated</p><div className="mt-3 flex flex-wrap gap-2">{[...projectSkills].sort((a,b)=>b.evidence_score-a.evidence_score).map(skill=><span key={skill.id} title={skill.rationale||undefined} className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-bold text-violet-200">{skill.name} · {skill.evidence_level}</span>)}</div></div>:null}

                  {projectAssets.length ? (
                    <div className="mt-5 border-t border-white/10 pt-5">
                      <p className="text-[11px] font-black uppercase tracking-[.18em] text-slate-500">Evidence files</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {projectAssets.map(asset=>assetUrls[asset.id]?<a key={asset.id} href={assetUrls[asset.id]} target="_blank" rel="noreferrer" className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10">{asset.file_name} ↗</a>:null)}
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-5 flex flex-wrap gap-4 text-xs font-black text-violet-300">
                    {project.repo_link?<a href={project.repo_link} target="_blank" rel="noreferrer">Repository ↗</a>:null}
                    {project.live_url?<a href={project.live_url} target="_blank" rel="noreferrer">Live project ↗</a>:null}
                    {project.evidence_url?<a href={project.evidence_url} target="_blank" rel="noreferrer">Evidence ↗</a>:null}
                  </div>
                </article>;
              })}
            </div>
          )}
        </section>

        <section className="mt-12 rounded-[2rem] border border-white/10 bg-white/[.035] p-7 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[.22em] text-violet-300">
            {projects.length > 1 ? "Capability map" : "Evidence summary"}
          </p>
          <h2 className="mt-2 text-3xl font-black">
            {projects.length > 1 ? "Skills strengthened across your projects" : "What this first project proves most strongly"}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            {projects.length > 1
              ? "Repeated evidence across different projects strengthens a capability over time."
              : "As you add more projects, SkillSync will compare repeated evidence and strengthen capabilities that appear consistently."}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {capabilityMap.length?capabilityMap.slice(0,projects.length>1?capabilityMap.length:3).map(skill=><div key={skill.name} className="rounded-2xl border border-white/10 bg-black/20 p-4"><div className="flex items-center justify-between gap-3"><span className="font-black">{skill.name}</span><span className="text-xs font-black text-violet-300">{skill.level}</span></div><p className="mt-2 text-xs text-slate-500">{projects.length>1?skill.count+" "+(skill.count===1?"project":"projects")+" supporting this capability":skill.rationale||"Backed by this project evidence."}</p></div>):<p className="text-sm text-slate-500">Skill evidence will appear as projects are added.</p>}
          </div>
        </section>

        <footer className="py-10 text-center text-xs text-slate-600">Built from real project evidence with SkillSync.</footer>
      </div>
    </main>
  );
}

function Metric({value,label}:{value:number;label:string}) {
  return <div className="min-w-28 rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-3xl font-black">{value}</p><p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p></div>;
}

function Block({label,text}:{label:string;text:string}) {
  return <div className="mt-5"><p className="text-[11px] font-black uppercase tracking-[.18em] text-slate-500">{label}</p><p className="mt-2 text-sm leading-6 text-slate-300">{text}</p></div>;
}
