import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const configurationReady = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return NextResponse.json(
    {
      status: configurationReady ? "ok" : "degraded",
      service: "skillsync",
      timestamp: new Date().toISOString(),
    },
    {
      status: configurationReady ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    }
  );
}
