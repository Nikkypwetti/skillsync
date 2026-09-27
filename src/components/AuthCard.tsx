import Link from "next/link";

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footerText?: string;
  footerHref?: string;
  footerLabel?: string;
};

export default function AuthCard({title,subtitle,children,footerText,footerHref,footerLabel}:Props) {
  return (
    <main className="min-h-screen bg-[#0b0b12] px-4 py-8 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[2.25rem] border border-white/10 bg-white shadow-2xl lg:grid-cols-[.9fr_1.1fr]">
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-violet-700 via-indigo-700 to-slate-950 p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -left-20 top-24 h-72 w-72 rounded-full bg-fuchsia-400/20 blur-3xl"/>
          <div className="relative">
            <Link href="/" className="inline-flex items-center gap-2 text-lg font-black">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-violet-700">S</span>
              SkillSync
            </Link>
          </div>
          <div className="relative max-w-md">
            <p className="text-xs font-black uppercase tracking-[.2em] text-violet-200">Proof over self-rating</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-.04em]">Turn the work you do into a portfolio people can understand.</h2>
            <p className="mt-4 text-sm leading-7 text-violet-100">Add projects from development, automation, operations, virtual assistance, customer support, data, CRM, and more. SkillSync builds evidence from the work itself.</p>
          </div>
          <p className="relative text-xs text-violet-200">Projects → evidence → skills → portfolio</p>
        </section>

        <section className="flex items-center bg-white p-6 text-slate-950 sm:p-10 lg:p-14">
          <div className="mx-auto w-full max-w-md">
            <Link href="/" className="mb-8 inline-flex items-center gap-2 font-black text-violet-700 lg:hidden">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-violet-600 text-white">S</span>
              SkillSync
            </Link>
            <p className="eyebrow">Welcome to SkillSync</p>
            <h1 className="mt-2 text-3xl font-black tracking-[-.035em] text-slate-950 sm:text-4xl">{title}</h1>
            {subtitle?<p className="mt-3 text-sm leading-6 text-slate-500">{subtitle}</p>:null}
            <div className="mt-7">{children}</div>
            {footerText&&footerHref&&footerLabel?<p className="mt-7 text-center text-sm text-slate-500">{footerText} <Link href={footerHref} className="font-black text-violet-700 hover:text-violet-800">{footerLabel}</Link></p>:null}
          </div>
        </section>
      </div>
    </main>
  );
}
