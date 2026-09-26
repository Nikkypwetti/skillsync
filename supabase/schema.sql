create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  username text unique,
  github_username text,
  bio text,
  created_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  category text,
  level integer not null default 0 check (level between 0 and 100),
  created_at timestamptz not null default now()
);

create index if not exists skills_user_id_idx on public.skills(user_id);

alter table public.profiles enable row level security;
alter table public.skills enable row level security;

drop policy if exists "Profiles are publicly readable" on public.profiles;
create policy "Profiles are publicly readable" on public.profiles for select using (true);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Skills are publicly readable" on public.skills;
create policy "Skills are publicly readable" on public.skills for select using (true);

drop policy if exists "Users can insert own skills" on public.skills;
create policy "Users can insert own skills" on public.skills for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own skills" on public.skills;
create policy "Users can update own skills" on public.skills for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can delete own skills" on public.skills;
create policy "Users can delete own skills" on public.skills for delete using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, username)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    'user-' || substr(new.id::text, 1, 8)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
