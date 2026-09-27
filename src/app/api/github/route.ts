import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");
  if (!username || !/^[a-zA-Z0-9-]{1,39}$/.test(username)) {
    return NextResponse.json({ error: "A valid GitHub username is required." }, { status: 400 });
  }

  const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`, {
    headers: {
      Accept: "application/vnd.github+json",
      ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Unable to fetch GitHub repositories." }, { status: response.status });
  }

  const repos = await response.json();
  return NextResponse.json(repos.map((repo: { id: number; name: string; html_url: string; description: string | null; language: string | null; stargazers_count: number }) => ({
    id: repo.id,
    name: repo.name,
    url: repo.html_url,
    description: repo.description,
    language: repo.language,
    stars: repo.stargazers_count,
  })));
}
