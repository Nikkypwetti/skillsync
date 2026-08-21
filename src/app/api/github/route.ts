import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      status: "planned",
      message: "GitHub integration is not implemented yet.",
    },
    { status: 501 }
  );
}

