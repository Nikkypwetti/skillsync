create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  username text unique,
  career_track text,
  headline text,
  location text,
  about text,
  linkedin_url text,
  website_url text,
  github_username text,
  bio text,
  portfolio_public boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  career_track text,
  project_type text,
  role text,
  challenge text,
  contribution text,
  outcome text,
  tools text[] not null default '{}',
  repo_link text,
  live_url text,
  evidence_url text,
  featured boolean not null default false,
  public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_skills (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text,
  evidence_score integer not null default 0 check (evidence_score between 0 and 100),
  evidence_level text not null default 'Exploring',
  rationale text,
  created_at timestamptz not null default now(),
  unique(project_id,name)
);

create table if not exists public.project_assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null unique,
  public_url text not null,
  file_name text not null,
  file_type text,
  file_size bigint,
  created_at timestamptz not null default now()
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  issuer text,
  date_issued timestamptz,
  url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_user_id_idx on public.projects(user_id);
create index if not exists project_skills_user_id_idx on public.project_skills(user_id);
create index if not exists project_skills_project_id_idx on public.project_skills(project_id);
create index if not exists project_assets_project_id_idx on public.project_assets(project_id);
create index if not exists project_assets_user_id_idx on public.project_assets(user_id);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_skills enable row level security;
alter table public.project_assets enable row level security;
alter table public.certificates enable row level security;

drop policy if exists "Profiles are publicly readable" on public.profiles;
create policy "Profiles are publicly readable" on public.profiles for select using (portfolio_public = true or auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Users can view own and public projects" on public.projects;
create policy "Users can view own and public projects" on public.projects for select using (auth.uid() = user_id or public = true);

drop policy if exists "Users can insert own projects" on public.projects;
create policy "Users can insert own projects" on public.projects for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own projects" on public.projects;
create policy "Users can update own projects" on public.projects for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can delete own projects" on public.projects;
create policy "Users can delete own projects" on public.projects for delete using (auth.uid() = user_id);

drop policy if exists "Users can view project skill evidence" on public.project_skills;
create policy "Users can view project skill evidence" on public.project_skills for select using (
  auth.uid() = user_id or exists (
    select 1 from public.projects p where p.id = project_id and p.public = true
  )
);

drop policy if exists "Users can insert own project skill evidence" on public.project_skills;
create policy "Users can insert own project skill evidence" on public.project_skills for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own project skill evidence" on public.project_skills;
create policy "Users can update own project skill evidence" on public.project_skills for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can delete own project skill evidence" on public.project_skills;
create policy "Users can delete own project skill evidence" on public.project_skills for delete using (auth.uid() = user_id);

drop policy if exists "Users can view project assets" on public.project_assets;
create policy "Users can view project assets" on public.project_assets for select using (
  auth.uid() = user_id or exists (
    select 1 from public.projects p where p.id = project_id and p.public = true
  )
);

drop policy if exists "Users can insert own project assets" on public.project_assets;
create policy "Users can insert own project assets" on public.project_assets for insert with check (
  auth.uid() = user_id and exists (
    select 1 from public.projects p where p.id = project_id and p.user_id = auth.uid()
  )
);

drop policy if exists "Users can delete own project assets" on public.project_assets;
create policy "Users can delete own project assets" on public.project_assets for delete using (auth.uid() = user_id);

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values (
  'project-evidence',
  'project-evidence',
  false,
  10485760,
  array['image/png','image/jpeg','image/webp','image/gif','application/pdf']
)
on conflict (id) do update set
  public=excluded.public,
  file_size_limit=excluded.file_size_limit,
  allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists "Users can upload project evidence" on storage.objects;
create policy "Users can upload project evidence"
on storage.objects for insert to authenticated
with check (
  bucket_id='project-evidence'
  and (storage.foldername(name))[1]=auth.uid()::text
);

drop policy if exists "Users can view own project evidence objects" on storage.objects;
create policy "Users can view own project evidence objects"
on storage.objects for select to authenticated
using (
  bucket_id='project-evidence'
  and (
    (storage.foldername(name))[1]=auth.uid()::text
    or exists (
      select 1
      from public.project_assets pa
      join public.projects p on p.id=pa.project_id
      where pa.storage_path=storage.objects.name and p.public=true
    )
  )
);

drop policy if exists "Public can view published project evidence" on storage.objects;
create policy "Public can view published project evidence"
on storage.objects for select to anon
using (
  bucket_id='project-evidence'
  and exists (
    select 1
    from public.project_assets pa
    join public.projects p on p.id=pa.project_id
    where pa.storage_path=storage.objects.name and p.public=true
  )
);

drop policy if exists "Users can update project evidence" on storage.objects;
create policy "Users can update project evidence"
on storage.objects for update to authenticated
using (
  bucket_id='project-evidence'
  and (storage.foldername(name))[1]=auth.uid()::text
)
with check (
  bucket_id='project-evidence'
  and (storage.foldername(name))[1]=auth.uid()::text
);

drop policy if exists "Users can delete project evidence" on storage.objects;
create policy "Users can delete project evidence"
on storage.objects for delete to authenticated
using (
  bucket_id='project-evidence'
  and (storage.foldername(name))[1]=auth.uid()::text
);

drop policy if exists "Users can view own and public certificates" on public.certificates;
create policy "Users can view own and public certificates" on public.certificates for select using (
  auth.uid() = user_id or exists (
    select 1 from public.profiles p where p.id = user_id and p.portfolio_public = true
  )
);

drop policy if exists "Users can insert own certificates" on public.certificates;
create policy "Users can insert own certificates" on public.certificates for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own certificates" on public.certificates;
create policy "Users can update own certificates" on public.certificates for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can delete own certificates" on public.certificates;
create policy "Users can delete own certificates" on public.certificates for delete using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id,full_name,username)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    'user-' || substr(new.id::text,1,8)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.refresh_project_skill_evidence()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  project_text text;
  base_score integer;
  level_name text;
begin
  delete from public.project_skills where project_id = new.id;

  project_text := lower(
    coalesce(new.title,'') || ' ' || coalesce(new.challenge,'') || ' ' ||
    coalesce(new.contribution,'') || ' ' || coalesce(new.outcome,'') || ' ' ||
    coalesce(new.role,'') || ' ' || coalesce(array_to_string(new.tools,' '),'')
  );

  base_score := least(100, 38
    + least(20,char_length(coalesce(new.contribution,''))/35)
    + least(10,char_length(coalesce(new.outcome,''))/45)
    + least(12,coalesce(array_length(new.tools,1),0)*2)
    + case when new.repo_link is not null then 5 else 0 end
    + case when new.live_url is not null then 5 else 0 end
    + case when new.evidence_url is not null then 5 else 0 end);

  level_name := case
    when base_score >= 85 then 'Advanced'
    when base_score >= 65 then 'Proficient'
    when base_score >= 45 then 'Practiced'
    when base_score >= 25 then 'Developing'
    else 'Exploring'
  end;

  insert into public.project_skills(project_id,user_id,name,category,evidence_score,evidence_level,rationale)
  select new.id,new.user_id,x.name,x.category,base_score,level_name,
    'Derived from project responsibilities, tools, outcomes, and linked evidence.'
  from (
    values
      ('Workflow Automation','Automation',array['workflow','automation','webhook']),
      ('API Integration','Technical',array['api','integration','webhook']),
      ('CRM Operations','CRM & RevOps',array['crm','pipeline','deal stage']),
      ('Lead Management','CRM & RevOps',array['lead','qualification','routing']),
      ('Reporting & Analytics','Data',array['dashboard','report','analytics','kpi']),
      ('Executive Support','Virtual Assistance',array['executive assistant','executive support','calendar','meeting']),
      ('Inbox Management','Virtual Assistance',array['inbox','email management','email triage','gmail']),
      ('Calendar Management','Virtual Assistance',array['calendar','scheduling','appointment']),
      ('Research','Virtual Assistance',array['research','market research','web research']),
      ('Customer Support','Customer Operations',array['customer support','customer service','ticket','booking']),
      ('Project Coordination','Project Operations',array['project coordination','deadline','task management','milestone']),
      ('Process Improvement','Operations',array['process improvement','streamline','efficiency']),
      ('n8n','Automation',array['n8n']),
      ('HubSpot','CRM & RevOps',array['hubspot']),
      ('Salesforce','CRM & RevOps',array['salesforce']),
      ('Airtable','Productivity',array['airtable']),
      ('Notion','Productivity',array['notion']),
      ('React','Development',array['react']),
      ('Next.js','Development',array['next.js','nextjs']),
      ('TypeScript','Development',array['typescript']),
      ('JavaScript','Development',array['javascript']),
      ('PostgreSQL','Development',array['postgresql','postgres','supabase']),
      ('Docker','Cloud & DevOps',array['docker'])
  ) as x(name,category,terms)
  where exists (select 1 from unnest(x.terms) term where project_text like '%' || term || '%')
  on conflict(project_id,name) do update
  set category=excluded.category,evidence_score=excluded.evidence_score,
      evidence_level=excluded.evidence_level,rationale=excluded.rationale;

  return new;
end;
$$;

drop trigger if exists project_skill_evidence_refresh on public.projects;
create trigger project_skill_evidence_refresh
after insert or update of title,challenge,contribution,outcome,role,tools,repo_link,live_url,evidence_url
on public.projects
for each row execute function public.refresh_project_skill_evidence();
