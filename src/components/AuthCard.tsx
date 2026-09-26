import Link from "next/link";

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footerText?: string;
  footerHref?: string;
  footerLabel?: string;
};

export default function AuthCard({
  title,
  subtitle,
  children,
  footerText,
  footerHref,
  footerLabel,
}: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-8 shadow-2xl">
        <Link href="/" className="mb-8 inline-block text-xl font-black tracking-tight text-indigo-600">
          SkillSync
        </Link>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p> : null}
        <div className="mt-6">{children}</div>
        {footerText && footerHref && footerLabel ? (
          <p className="mt-6 text-center text-sm text-slate-500">
            {footerText}{" "}
            <Link href={footerHref} className="font-semibold text-indigo-600 hover:text-indigo-700">
              {footerLabel}
            </Link>
          </p>
        ) : null}
      </div>
    </div>
  );
}
