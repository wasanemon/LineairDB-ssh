create extension if not exists "pgcrypto";

create table if not exists topics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  source_url text,
  target_audience text,
  angle text,
  notes text,
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  topic_id uuid not null references topics(id) on delete cascade,
  body text not null,
  variant_name text not null check (variant_name in ('concise','insightful','thread_hook')),
  status text not null default 'draft' check (status in ('draft','approved','rejected','posted','failed')),
  scheduled_at timestamptz,
  error_summary text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  draft_id uuid not null unique references drafts(id) on delete restrict,
  x_post_id text not null,
  x_post_url text not null,
  posted_at timestamptz not null,
  created_at timestamptz default now()
);

alter table topics enable row level security;
alter table drafts enable row level security;
alter table posts enable row level security;

create policy "topics owner" on topics using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "drafts owner" on drafts using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "posts owner" on posts using (auth.uid() = user_id) with check (auth.uid() = user_id);
