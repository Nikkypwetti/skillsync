import { NextRequest, NextResponse } from "next/server";

function fallback(notes: string) {
  const clean = notes.trim().replace(/\s+/g, " ");
  return {
    challenge: clean ? `The project addressed this need: ${clean}` : "",
    contribution: clean ? `I planned and implemented the work described here: ${clean}` : "",
    outcome: clean ? "The work produced a reusable, documented solution that can be demonstrated with project evidence." : "",
    source: "template",
  };
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const notes = typeof body.notes === "string" ? body.notes.slice(0, 5000) : "";
  if (!notes.trim()) return NextResponse.json({ error: "Add rough project notes first." }, { status: 400 });

  const key = process.env.GROQ_API_KEY;
  if (!key) return NextResponse.json(fallback(notes));

  const prompt = [
    "Turn the user's rough project notes into concise portfolio copy.",
    "Do not invent metrics, clients, outcomes, tools, or responsibilities.",
    "Return JSON only with challenge, contribution, outcome.",
    "Challenge: the problem or need. Contribution: only what the user personally did. Outcome: only supported results; if no result is provided, describe a non-quantified practical result without inventing numbers.",
    "Notes:", notes,
  ].join("\n");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) return NextResponse.json(fallback(notes));
  const data = await response.json();
  try {
    const parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}");
    return NextResponse.json({ ...parsed, source: "groq" });
  } catch {
    return NextResponse.json(fallback(notes));
  }
}
