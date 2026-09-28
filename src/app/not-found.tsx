import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 text-xl font-black text-violet-300">404</div>
        <h1 className="mt-5 text-3xl font-black">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          The page may have moved or the portfolio link may be incorrect.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-black text-white hover:bg-violet-500">Home</Link>
          <Link href="/dashboard" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-black text-slate-200 hover:bg-white/10">Workspace</Link>
        </div>
      </div>
    </main>
  );
}
