-- Job applications inbox + FTS search RPC

create table if not exists job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  job_slug text not null,
  applicant_id uuid references auth.users(id) on delete set null,
  applicant_name text not null,
  applicant_email text not null,
  message text not null default '',
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'rejected')),
  created_at timestamptz not null default now()
);

create index if not exists idx_job_applications_job on job_applications(job_id, created_at desc);
create index if not exists idx_job_applications_applicant on job_applications(applicant_id);

alter table job_applications enable row level security;

drop policy if exists "Applicants insert applications" on job_applications;
create policy "Applicants insert applications" on job_applications
  for insert with check (auth.uid() is not null);

drop policy if exists "Applicants read own applications" on job_applications;
create policy "Applicants read own applications" on job_applications
  for select using (applicant_id = auth.uid());

drop policy if exists "Job posters read applications" on job_applications;
create policy "Job posters read applications" on job_applications
  for select using (
    exists (
      select 1 from jobs j
      where j.id = job_applications.job_id and j.posted_by = auth.uid()
    )
  );

drop policy if exists "Job posters update applications" on job_applications;
create policy "Job posters update applications" on job_applications
  for update using (
    exists (
      select 1 from jobs j
      where j.id = job_applications.job_id and j.posted_by = auth.uid()
    )
  );

drop policy if exists "Admins manage applications" on job_applications;
create policy "Admins manage applications" on job_applications
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Full-text search across mentors, forum, portfolios, jobs
-- Note: column cannot be named "rank" — reserved in PostgreSQL
drop function if exists search_platform_fts(text);

create or replace function search_platform_fts(search_query text)
returns table (
  result_type text,
  title text,
  subtitle text,
  href text,
  relevance real
) language sql stable security definer set search_path = public as $$
  with q as (select plainto_tsquery('english', search_query) as tsq),
  combined as (
    select 'mentor'::text as result_type, mp.headline as title, mp.company as subtitle,
      '/mentors/' || mp.slug as href,
      ts_rank(to_tsvector('english', coalesce(mp.headline,'') || ' ' || coalesce(mp.company,'') || ' ' || coalesce(mp.bio,'')), q.tsq)::real as relevance
    from mentor_profiles mp, q
    where mp.status = 'approved'
      and to_tsvector('english', coalesce(mp.headline,'') || ' ' || coalesce(mp.company,'') || ' ' || coalesce(mp.bio,'')) @@ q.tsq
    union all
    select 'forum'::text, fp.title, fp.discipline, '/forum/' || fp.slug,
      ts_rank(to_tsvector('english', coalesce(fp.title,'') || ' ' || coalesce(fp.body,'')), q.tsq)::real
    from forum_posts fp, q
    where to_tsvector('english', coalesce(fp.title,'') || ' ' || coalesce(fp.body,'')) @@ q.tsq
    union all
    select 'portfolio'::text, p.headline, coalesce(pr.full_name, ''), '/portfolios/' || p.slug,
      ts_rank(to_tsvector('english', coalesce(p.headline,'') || ' ' || coalesce(p.bio,'')), q.tsq)::real
    from portfolios p
    left join profiles pr on pr.id = p.user_id, q
    where p.published
      and to_tsvector('english', coalesce(p.headline,'') || ' ' || coalesce(p.bio,'')) @@ q.tsq
    union all
    select 'job'::text, j.title, j.discipline, '/jobs/' || j.slug,
      ts_rank(to_tsvector('english', coalesce(j.title,'') || ' ' || coalesce(j.description,'')), q.tsq)::real
    from jobs j, q
    where j.published
      and to_tsvector('english', coalesce(j.title,'') || ' ' || coalesce(j.description,'')) @@ q.tsq
  )
  select combined.result_type, combined.title, combined.subtitle, combined.href, combined.relevance
  from combined
  order by combined.relevance desc
  limit 24;
$$;

grant execute on function search_platform_fts(text) to anon, authenticated;
