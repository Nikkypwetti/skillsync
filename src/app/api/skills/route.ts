import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "SkillSync uses Supabase Row Level Security for authenticated client data access.",
  });
}
