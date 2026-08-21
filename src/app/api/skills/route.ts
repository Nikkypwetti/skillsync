import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      status: "prototype",
      message: "Persistent skill data is not implemented yet.",
    },
    { status: 501 }
  );
}