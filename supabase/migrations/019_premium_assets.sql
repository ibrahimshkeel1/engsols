-- Premium educational assets (private storage + access registry)

create table if not exists premium_assets (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  title text not null,
  exam_id uuid references mock_exams(id) on delete set null,
  mime_type text not null default 'application/pdf',
  created_at timestamptz not null default now()
);

create index if not exists idx_premium_assets_exam on premium_assets(exam_id);

alter table premium_assets enable row level security;

drop policy if exists "Admins manage premium assets" on premium_assets;
create policy "Admins manage premium assets"
  on premium_assets for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'premium-assets',
  'premium-assets',
  false,
  52428800,
  array['application/pdf', 'image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- No public read policies — access only via service-role signed URLs from /api/assets/[fileId]
