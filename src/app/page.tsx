import Link from "next/link";

const roles = [
  "Software Developer",
  "Data Analyst",
  "Automation Specialist",
  "Revenue Operations",
  "CRM Specialist",
  "Virtual Assistant",
  "Executive Assistant",
  "Customer Support",
  "Project Coordinator",
  "Marketing Operations",
];

const features = [
  ["Add real projects", "Document what you built, supported, coordinated, automated, researched, or improved."],
  ["Prove skills automatically", "SkillSync derives capability evidence from your responsibilities, tools, outcomes, and project links."],
  ["Build a professional portfolio", "Your public profile grows automatically as you add stronger projects and clearer evidence."],
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f8f7fc] text-slate-950">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-black text-white shadow-lg shadow-violet-200">S</span>
            <span className="text-lg font-black tracking-tight">SkillSync</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="rounded-xl px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100">Sign in</Link>
            <Link href="/auth/signup" className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">Build my portfolio</Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-10 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-violet-300/20 blur-3xl"/>
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-28">
          <div className="self-center">
            <span className="inline-flex rounded-full border border-violet-200 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[.2em] text-violet-700 shadow-sm">Projects become proof</span>
            <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-[-.055em] sm:text-6xl lg:text-7xl">
              Build the portfolio your work already deserves.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              SkillSync turns real projects into evidence-backed skills and a professional portfolio. No confidence sliders. Show what you actually did.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/auth/signup" className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3.5 font-black text-white shadow-xl shadow-violet-200 hover:-translate-y-0.5">Start with a project</Link>
              <Link href="/auth/login" className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 font-black text-slate-700 shadow-sm hover:border-violet-200 hover:text-violet-700">Open workspace</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {roles.map(role=><span key={role} className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-slate-500">{role}</span>)}
            </div>
          </div>

          <div className="rounded-[2.25rem] border border-slate-200 bg-slate-950 p-4 shadow-2xl shadow-slate-300/60">
            <div className="rounded-[1.75rem] bg-white p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[.2em] text-violet-600">Project evidence</p>
                  <h2 className="mt-2 text-2xl font-black">Lead-to-Client Automation</h2>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">Portfolio ready</span>
              </div>
              <p className="mt-5 text-sm leading-6 text-slate-600">Built an automated qualification and routing workflow that connects intake, AI assessment, CRM records, and team alerts.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["n8n","Airtable","API Integration","Workflow Automation","Lead Management"].map(skill=><span key={skill} className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-black text-violet-700">{skill}</span>)}
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 p-4"><p className="text-2xl font-black">5</p><p className="mt-1 text-xs font-bold text-slate-400">Skills proven</p></div>
                <div className="rounded-2xl bg-slate-50 p-4"><p className="text-2xl font-black">1</p><p className="mt-1 text-xs font-bold text-slate-400">Project added</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-black tracking-tight">Your projects should do the talking.</h2>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {features.map(([title,body],index)=><article key={title} className="rounded-[1.75rem] border border-slate-200 bg-[#fafafe] p-6"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">0{index+1}</span><h3 className="mt-5 text-xl font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{body}</p></article>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2.25rem] bg-gradient-to-br from-violet-600 to-indigo-700 p-8 text-white sm:p-12">
          <p className="text-xs font-black uppercase tracking-[.2em] text-violet-100">Built for modern project-based careers</p>
          <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-tight">Not just developers. Build proof for the work employers and clients actually need.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-violet-100">Use SkillSync for automation systems, CRM cleanup, executive support, inbox and calendar management, customer support, data analysis, research, operations coordination, web development, marketing systems, and more.</p>
          <Link href="/auth/signup" className="mt-7 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-black text-violet-700 shadow-xl">Create your proof-based portfolio</Link>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-2 border-t border-slate-200 px-4 py-8 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <span>© {new Date().getFullYear()} SkillSync</span>
        <span>Projects → evidence → skills → professional portfolio.</span>
      </footer>
    </main>
  );
}
