import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-indigo-50 to-white text-gray-800">
      <nav className="sticky top-0 z-50 flex h-[70px] w-full items-center justify-between border-b border-gray-200 bg-white/80 px-6 backdrop-blur-md md:px-16">
        <h1 className="text-2xl font-bold text-indigo-600">
          SkillSync
        </h1>

        <div className="flex items-center gap-4">
          <Link
            href="#features"
            className="hover:text-indigo-500"
          >
            Product Direction
          </Link>

          <Link
            href="/dashboard"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
          >
            View Prototype
          </Link>
        </div>
      </nav>

      <section className="flex flex-1 items-center justify-center px-8 py-24 md:px-16 lg:px-24">
        <div className="max-w-3xl space-y-6 text-center">
          <p className="font-medium text-indigo-600">
            Work in Progress • Learning Project
          </p>

          <h2 className="text-4xl font-extrabold leading-tight md:text-6xl">
            Sync Your{" "}
            <span className="text-indigo-600">
              Skills
            </span>{" "}
            With Your Career
          </h2>

          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            A developer skill-tracking product concept
            exploring learning progress, portfolio activity
            and future GitHub-connected insights.
          </p>

          <Link
            href="/dashboard"
            className="inline-block rounded-xl bg-indigo-600 px-6 py-3 text-white transition hover:bg-indigo-700"
          >
            Explore Prototype
          </Link>
        </div>
      </section>

      <section
        id="features"
        className="bg-white px-8 py-16 md:px-16 lg:px-24"
      >
        <h3 className="mb-4 text-center text-3xl font-bold">
          Product Direction
        </h3>

        <p className="mx-auto mb-12 max-w-2xl text-center text-gray-600">
          SkillSync is still under development. These areas
          describe the current concept and planned direction.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Skill Tracking Concept",
              desc: "Explore a structured approach to tracking technical learning progress.",
            },
            {
              title: "GitHub Integration — Planned",
              desc: "Planned integration for connecting repository and developer activity.",
            },
            {
              title: "Personalized Insights — Planned",
              desc: "Planned insights for helping developers understand their learning progress.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl bg-indigo-50 p-6 shadow-sm transition hover:shadow-md"
            >
              <h4 className="mb-2 text-xl font-semibold">
                {item.title}
              </h4>

              <p className="text-gray-600">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} SkillSync • Prototype
      </footer>
    </main>
  );
}