# SkillSync

SkillSync is a full-stack developer skill tracker and public portfolio generator for early-career engineers.

## What it solves

Learning evidence is usually scattered across courses, notes, GitHub repositories and side projects. SkillSync gives users one place to track skill progress and turn that progress into a portfolio that recruiters can understand.

## Production MVP

- Email/password authentication with email confirmation
- Password reset flow
- Protected dashboard
- Skill create/update/delete
- Progress analytics
- Public portfolio route
- GitHub repositories API proxy
- Supabase PostgreSQL persistence
- Responsive Tailwind UI
- CI workflow for lint, typecheck and build

## Stack

- Next.js 16 / React 19 / TypeScript
- Tailwind CSS 4
- Supabase Auth + PostgreSQL
- Recharts
- Vercel-ready deployment

## Environment variables

Copy `.env.example` to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
GITHUB_TOKEN=
```

`GITHUB_TOKEN` is optional for local development but improves GitHub API rate limits.

## Supabase schema

Run `supabase/schema.sql` in the Supabase SQL editor. Row Level Security is required for user-owned data.

In Supabase Authentication → URL Configuration add:

- Local: `http://localhost:3000/auth/callback`
- Production: `https://YOUR_DOMAIN/auth/callback`
- Password update: `https://YOUR_DOMAIN/auth/update-password`

## Run locally

```bash
npm ci
npm run dev
```

Then open http://localhost:3000.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

## Deployment

Connect the repository to Vercel and add the environment variables above. Configure the production URL in Supabase before testing email confirmation and password reset.

## Production checklist

- [ ] Run `supabase/schema.sql`
- [ ] Set Vercel environment variables
- [ ] Add production redirect URLs in Supabase Auth
- [ ] Verify signup + email confirmation
- [ ] Verify login/logout
- [ ] Verify password reset
- [ ] Verify skills are isolated per user
- [ ] Verify public portfolio route
- [ ] Confirm CI passes
