import { NextRequest, NextResponse } from "next/server";

type AssistInput = {
  notes: string;
  title?: string;
  role?: string;
  tools?: string;
};

function cleanText(value: string) {
  return value.trim().replace(/\s+/g, " ").replace(/\s+([,.!?])/g, "$1");
}

function sentence(value: string) {
  const clean = cleanText(value).replace(/[.]+$/, "");
  if (!clean) return "";
  return clean.charAt(0).toUpperCase() + clean.slice(1) + ".";
}

function localDraft(input: AssistInput) {
  const notes = cleanText(input.notes);
  const lower = notes.toLowerCase();
  const title = cleanText(input.title || "");
  const role = cleanText(input.role || "");
  const tools = cleanText(input.tools || "");

  const revenue =
    /revenue|won deal|closed won|pipeline|sales|reporting|manager|business metric|forecast/.test(lower);
  const automation =
    /automation|workflow|n8n|zapier|make\.com|webhook|manual|repeatable|routing/.test(lower);
  const software =
    /next\.?js|react|typescript|javascript|application|app|website|api|database|developer/.test(lower);
  const support =
    /customer|support|booking|ticket|inbox|email|calendar|assistant/.test(lower);

  let challenge = "";
  let contribution = "";
  let outcome = "";

  if (revenue) {
    challenge =
      "Managers needed a repeatable way to answer recurring revenue questions, such as total revenue and won deals, without rebuilding the same reporting work each time.";
    contribution =
      "I designed and implemented a governed revenue-reporting agent that turns recurring business questions into a repeatable reporting workflow" +
      (tools ? ` using ${tools}` : "") +
      ".";
    outcome =
      "The project created a reusable reporting process that makes recurring revenue questions easier to answer consistently while keeping the workflow structured and governed.";
  } else if (automation) {
    challenge =
      "The existing process involved repetitive manual work that needed to be made more consistent and repeatable.";
    contribution =
      "I designed and implemented an automated workflow based on the process described in my notes" +
      (tools ? ` using ${tools}` : "") +
      ".";
    outcome =
      "The result is a reusable workflow that reduces repeated manual steps and gives the process a clearer, more consistent operating structure.";
  } else if (software) {
    challenge =
      "The project needed a practical software solution for the problem described in my notes rather than a manual or disconnected process.";
    contribution =
      "I built and configured the application components required for the project" +
      (tools ? ` using ${tools}` : "") +
      (role ? ` in my role as ${role}` : "") +
      ".";
    outcome =
      "The project produced a working implementation that can be reviewed, tested, and improved through its documented project evidence.";
  } else if (support) {
    challenge =
      "The work needed a clearer and more repeatable way to handle recurring support or administrative tasks.";
    contribution =
      "I organized and carried out the workflow described in my notes, focusing on consistent execution and clear follow-up.";
    outcome =
      "The project established a more repeatable process that can be documented and demonstrated as practical work evidence.";
  } else {
    const subject = notes.replace(/^i am trying to\s+/i, "").replace(/^i\s+/i, "");
    challenge = sentence("The project focused on " + subject);
    contribution = sentence(
      "I planned and implemented the work needed to address that problem" +
        (title ? ` in ${title}` : "") +
        (tools ? ` using ${tools}` : "")
    );
    outcome =
      "The work produced a reusable project result that can be reviewed through the documented implementation and evidence.";
  }

  return {
    challenge,
    contribution,
    outcome,
    source: "local",
    notice:
      "Basic drafting mode was used. The wording was improved from your notes without adding unsupported metrics or claims.",
  };
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const input: AssistInput = {
    notes: typeof body.notes === "string" ? body.notes.slice(0, 5000) : "",
    title: typeof body.title === "string" ? body.title.slice(0, 300) : "",
    role: typeof body.role === "string" ? body.role.slice(0, 300) : "",
    tools: typeof body.tools === "string" ? body.tools.slice(0, 1000) : "",
  };

  if (!input.notes.trim()) {
    return NextResponse.json({ error: "Add rough project notes first." }, { status: 400 });
  }

  const key = process.env.GROQ_API_KEY;
  if (!key) return NextResponse.json(localDraft(input));

  const prompt = [
    "You are a portfolio editor helping a user turn rough notes into strong, concise project evidence.",
    "Improve grammar, structure, specificity, and professional clarity.",
    "Do not invent metrics, clients, tools, responsibilities, or outcomes.",
    "You may infer the purpose of the work only when it is directly supported by the notes.",
    "Write 1-2 sentences per field.",
    "Challenge should explain the business or user problem, not repeat the notes word-for-word.",
    "Contribution should clearly state what the user personally designed, built, configured, analyzed, coordinated, or improved.",
    "Outcome should state the practical result supported by the notes. If no measured result is provided, describe a non-quantified practical result without fabricating numbers.",
    "Return JSON only with challenge, contribution, outcome.",
    `Project title: ${input.title || "Not provided"}`,
    `Role: ${input.role || "Not provided"}`,
    `Tools already entered: ${input.tools || "Not provided"}`,
    `Rough notes: ${input.notes}`,
  ].join("\n");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      temperature: 0.25,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) return NextResponse.json(localDraft(input));

  const data = await response.json();
  try {
    const parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}");
    return NextResponse.json({
      challenge: cleanText(parsed.challenge || ""),
      contribution: cleanText(parsed.contribution || ""),
      outcome: cleanText(parsed.outcome || ""),
      source: "groq",
      notice: "AI draft created from your project context. Review it before saving.",
    });
  } catch {
    return NextResponse.json(localDraft(input));
  }
}
