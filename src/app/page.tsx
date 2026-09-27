import Link from "next/link";

const features = [
  ["Skill tracking", "Track progress across frontend, backend, cloud, automation and more."],
  ["Evidence-based growth", "Connect skills to real projects, GitHub repositories and portfolio proof."],
  ["Career-ready portfolio", "Publish a clean shareable profile instead of sending scattered links."],
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <header className="border-b border-slate-200">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-black tracking-tight text-indigo-600">SkillSync</Link>
          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Sign in</Link>
            <Link href="/auth/signup" className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Get started</Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-28">
        <div className="self-center">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-indigo-600">Developer career workspace</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black tracking-[-0.04em] sm:text-6xl lg:text-7xl">Turn what you’re learning into proof you can share.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">SkillSync helps early-career developers track skill growth, connect evidence, and publish a portfolio that makes progress easier to understand.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/auth/signup" className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700">Create free account</Link>
            <Link href="/dashboard" className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 hover:border-indigo-200 hover:text-indigo-700">Open dashboard</Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 shadow-2xl">
          <div className="rounded-3xl bg-white p-6">
            <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Progress snapshot</p><h2 className="mt-1 text-2xl font-black">Your career skills</h2></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Live</span></div>
            <div className="mt-8 space-y-5">
              {[
                ["Next.js", 72],
                ["Cloud / DevOps", 58],
                ["PostgreSQL", 64],
              ].map(([name, level]) => (
                <div key={String(name)}>
                  <div className="flex justify-between text-sm font-semibold"><span>{name}</span><span>{level}%</span></div>
                  <div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-indigo-600" style={{ width: `${level}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-indigo-600">Core MVP</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">More than a CRUD demo</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {features.map(([title, body]) => (
              <article key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h3 className="text-lg font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{body}</p></article>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <span>© {new Date().getFullYear()} SkillSync</span>
        <span>Built with Next.js, Supabase and Tailwind CSS.</span>
      </footer>
    </main>
  );
}
