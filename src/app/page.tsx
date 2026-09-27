import Link from "next/link";

const careerTracks = [
  ["Automation & AI", "Workflows, integrations, AI-assisted operations"],
  ["RevOps & CRM", "Pipeline systems, data hygiene, reporting, lead operations"],
  ["Virtual Assistance", "Inbox, calendar, research, admin systems, executive support"],
  ["Development", "Web apps, APIs, databases, cloud and DevOps projects"],
  ["Data & Analytics", "Dashboards, reporting, analysis and decision support"],
  ["Operations", "Process improvement, project coordination and customer operations"],
];

const steps = [
  {
    number: "01",
    title: "Add a project",
    body: "Capture the problem, your role, what you personally did, the tools you used, and the outcome.",
  },
  {
    number: "02",
    title: "SkillSync finds the proof",
    body: "Your project is translated into evidence-backed capabilities instead of a self-rated percentage.",
  },
  {
    number: "03",
    title: "Publish a stronger portfolio",
    body: "Projects, outcomes, tools and demonstrated skills become a clean public portfolio you can share.",
  },
];

const sampleSkills = [
  ["Workflow Automation", "Proficient"],
  ["API Integration", "Practiced"],
  ["Lead Management", "Practiced"],
  ["Airtable", "Practiced"],
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">
              SS
            </span>
            <span className="text-lg font-black tracking-[-0.03em]">SkillSync</span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
            <a href="#product" className="hover:text-slate-950">Product</a>
            <a href="#how-it-works" className="hover:text-slate-950">How it works</a>
            <a href="#careers" className="hover:text-slate-950">Who it is for</a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/auth/login"
              className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(circle_at_65%_18%,rgba(99,102,241,0.16),transparent_33%),radial-gradient(circle_at_30%_30%,rgba(139,92,246,0.10),transparent_27%)]" />
        <div className="mx-auto grid max-w-7xl gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_.92fr] lg:px-8 lg:py-28">
          <div className="self-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              A portfolio built from evidence, not self-ratings
            </div>

            <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-[4.6rem]">
              Turn the work you do into a portfolio that proves what you can do.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              SkillSync helps early-career professionals document real projects, identify the skills those projects demonstrate, and build a professional portfolio without guessing their own level.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/auth/signup"
                className="rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
              >
                Build your portfolio
              </Link>
              <a
                href="#how-it-works"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-black text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50"
              >
                See how it works
              </a>
            </div>

            <div className="mt-9 grid max-w-xl grid-cols-3 gap-5 border-t border-slate-200 pt-6">
              <div>
                <p className="text-2xl font-black">Projects</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">Become the source of truth</p>
              </div>
              <div>
                <p className="text-2xl font-black">Skills</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">Come from evidence</p>
              </div>
              <div>
                <p className="text-2xl font-black">Portfolio</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">Updates as you grow</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-indigo-100 via-violet-100 to-transparent blur-2xl" />
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 shadow-2xl shadow-slate-300/70">
              <div className="flex h-12 items-center gap-2 border-b border-white/10 px-5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
                <span className="ml-3 text-xs font-semibold text-slate-400">Portfolio workspace</span>
              </div>

              <div className="bg-slate-50 p-4 sm:p-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-indigo-600">Featured project</p>
                      <h2 className="mt-2 text-xl font-black tracking-tight text-slate-950">Lead-to-Client Revenue Operations System</h2>
                      <p className="mt-1 text-sm font-semibold text-slate-500">Automation & CRM Operations</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700">Published</span>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Problem</p>
                      <p className="mt-2 text-xs leading-5 text-slate-600">Lead follow-up was inconsistent and qualification was manual.</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Contribution</p>
                      <p className="mt-2 text-xs leading-5 text-slate-600">Built scoring, CRM updates, routing and Slack alerts.</p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Capabilities demonstrated</p>
                    <div className="mt-3 grid gap-2">
                      {sampleSkills.map(([name, level]) => (
                        <div key={name} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2.5">
                          <span className="text-xs font-bold text-slate-700">{name}</span>
                          <span className="text-[11px] font-black text-indigo-600">{level}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-lg font-black text-slate-950">4</p>
                    <p className="text-[10px] font-bold text-slate-400">Projects</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-lg font-black text-slate-950">12</p>
                    <p className="text-[10px] font-bold text-slate-400">Skills proven</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-lg font-black text-slate-950">82%</p>
                    <p className="text-[10px] font-bold text-slate-400">Profile ready</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="product" className="bg-slate-950 py-20 text-white sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-indigo-300">What SkillSync solves</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Experience is easier to trust when the proof is visible.</h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400">
              A list of skills says very little. SkillSync connects every capability to the projects, responsibilities, tools and outcomes that support it.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Feature
              title="Project-first profile"
              body="Start with real work instead of manually building a long skill list."
            />
            <Feature
              title="Evidence-backed capability map"
              body="See which skills are demonstrated repeatedly and which need stronger proof."
            />
            <Feature
              title="Professional public portfolio"
              body="Present projects as concise case studies with your role, contribution, tools and outcomes."
            />
            <Feature
              title="Works across modern careers"
              body="Useful for technical, operations, support, administrative and project-based roles."
            />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-b border-slate-200 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-indigo-600">How it works</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">One project at a time, your professional story becomes clearer.</h2>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {steps.map((step) => (
              <article key={step.number} className="border-t border-slate-300 pt-6">
                <span className="text-sm font-black text-indigo-600">{step.number}</span>
                <h3 className="mt-5 text-2xl font-black tracking-tight text-slate-950">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="careers" className="bg-[#f7f8fb] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-indigo-600">Who it is for</p>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.04em]">Built for people growing through projects.</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                SkillSync is designed for professionals who may not yet have years of formal experience but are building practical capability through real work, simulations, freelance tasks and portfolio projects.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {careerTracks.map(([title, body]) => (
                <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-black text-slate-950">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] bg-indigo-600 px-6 py-12 text-white sm:px-10 lg:flex lg:items-center lg:justify-between lg:px-14">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-indigo-100">Start with what you already have</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Your next project can strengthen your portfolio the moment you finish it.</h2>
              <p className="mt-4 text-sm leading-7 text-indigo-100">
                Add the work, explain your contribution, attach proof, and let SkillSync organize the professional story around it.
              </p>
            </div>
            <Link
              href="/auth/signup"
              className="mt-7 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-black text-indigo-700 shadow-lg lg:mt-0"
            >
              Create your portfolio
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-xs font-black text-white">SS</span>
              <span className="font-black">SkillSync</span>
            </div>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
              Turn project experience into evidence-backed skills and a professional portfolio.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-500">
            <a href="#product" className="hover:text-slate-950">Product</a>
            <a href="#how-it-works" className="hover:text-slate-950">How it works</a>
            <a href="#careers" className="hover:text-slate-950">Who it is for</a>
            <Link href="/auth/login" className="hover:text-slate-950">Sign in</Link>
          </div>
        </div>
        <div className="border-t border-slate-100 py-5 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} SkillSync. Projects become proof.
        </div>
      </footer>
    </main>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.045] p-6">
      <div className="h-1.5 w-10 rounded-full bg-indigo-400" />
      <h3 className="mt-5 text-xl font-black">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
    </article>
  );
}
