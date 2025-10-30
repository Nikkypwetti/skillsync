import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  
  return (
    <main className="flex flex-col min-h-screen text-gray-800 bg-gradient-to-b from-indigo-50 to-white">
      {/* Navbar */}
      <nav className="h-[70px] sticky top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 flex justify-between items-center px-6 md:px-16 z-50">
        <h1 className="text-2xl font-bold text-indigo-600">SkillSync</h1>
        <div className="space-x-4">
          <Link href="#features" className="hover:text-indigo-500">Features</Link>
          <Link href="#how-it-works" className="hover:text-indigo-500">How it Works</Link>
          <Link href="/dashboard" className="px-4 py-2 text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-between px-8 py-20 md:flex-row md:px-16 lg:px-24">
        <div className="max-w-lg space-y-6 text-center md:text-left">
          <h2 className="text-4xl font-extrabold leading-tight md:text-5xl">
            Sync Your <span className="text-indigo-600">Skills</span> With Your Career
          </h2>
          <p className="text-lg text-gray-600">
            Track progress, showcase projects, and grow faster with personalized insights from your coding journey.
          </p>
          <Link href="/dashboard" className="inline-block px-6 py-3 text-white transition bg-indigo-600 rounded-xl hover:bg-indigo-700">
            Launch Dashboard
          </Link>
        </div>
        <Image
          src="/hero-illustration.svg"
          alt="Skill tracking illustration"
          className="w-full md:w-[45%] mt-10 md:mt-0"
        />
      </section>

      {/* Features Section */}
      <section id="features" className="px-8 py-16 bg-white md:px-16 lg:px-24">
        <h3 className="mb-12 text-3xl font-bold text-center">Why Choose SkillSync?</h3>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Skill Tracking",
              desc: "Monitor your learning curve and progress over time.",
            },
            {
              title: "GitHub Integration",
              desc: "Automatically sync your repositories and activity.",
            },
            {
              title: "Personalized Insights",
              desc: "Get AI-driven feedback to improve your skills faster.",
            },
          ].map((item, i) => (
            <div key={i} className="p-6 transition shadow-sm bg-indigo-50 rounded-2xl hover:shadow-md">
              <h4 className="mb-2 text-xl font-semibold">{item.title}</h4>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-sm text-center text-gray-500 border-t border-gray-200">
        © {new Date().getFullYear()} SkillSync. All rights reserved.
      </footer>
    </main>
  );
}  




