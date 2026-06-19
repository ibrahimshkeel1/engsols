-- Phase 7: mentorship roadmaps, project endorsements, mock exams, specialist requests

-- ---------------------------------------------------------------------------
-- Enums (status values enforced via check constraints on text columns)
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- 1. Mentorship roadmaps & milestones
-- ---------------------------------------------------------------------------

create table if not exists mentorship_roadmaps (
  id uuid primary key default gen_random_uuid(),
  mentor_user_id uuid not null references profiles(id) on delete cascade,
  student_user_id uuid not null references profiles(id) on delete cascade,
  mentor_profile_id uuid references mentor_profiles(id) on delete set null,
  booking_request_id uuid references booking_requests(id) on delete set null,
  title text not null default 'Mentorship roadmap',
  description text not null default '',
  status text not null default 'active'
    check (status in ('active', 'completed', 'archived')),
  target_deadline date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (mentor_user_id <> student_user_id)
);

create index if not exists idx_mentorship_roadmaps_mentor
  on mentorship_roadmaps (mentor_user_id, status);
create index if not exists idx_mentorship_roadmaps_student
  on mentorship_roadmaps (student_user_id, status);
create index if not exists idx_mentorship_roadmaps_booking
  on mentorship_roadmaps (booking_request_id)
  where booking_request_id is not null;

create table if not exists roadmap_milestones (
  id uuid primary key default gen_random_uuid(),
  roadmap_id uuid not null references mentorship_roadmaps(id) on delete cascade,
  title text not null,
  description text not null default '',
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'completed')),
  target_date date,
  resource_links jsonb not null default '[]',
  sort_order integer not null default 0,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_roadmap_milestones_roadmap
  on roadmap_milestones (roadmap_id, sort_order);

-- ---------------------------------------------------------------------------
-- 2. Project endorsements (mentor vouches for student portfolio work)
-- ---------------------------------------------------------------------------

create table if not exists project_endorsements (
  id uuid primary key default gen_random_uuid(),
  mentor_profile_id uuid not null references mentor_profiles(id) on delete cascade,
  portfolio_id uuid not null references portfolios(id) on delete cascade,
  portfolio_project_id uuid not null references portfolio_projects(id) on delete cascade,
  mentor_user_id uuid not null references profiles(id) on delete cascade,
  endorsement_text text not null default '',
  created_at timestamptz not null default now(),
  unique (mentor_profile_id, portfolio_project_id)
);

create index if not exists idx_project_endorsements_portfolio
  on project_endorsements (portfolio_id);
create index if not exists idx_project_endorsements_project
  on project_endorsements (portfolio_project_id);
create index if not exists idx_project_endorsements_mentor
  on project_endorsements (mentor_profile_id);

-- ---------------------------------------------------------------------------
-- 3. Mock exam engine
-- ---------------------------------------------------------------------------

create table if not exists mock_exams (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  discipline text not null,
  exam_type text not null default 'FE'
    check (exam_type in ('FE', 'PE', 'custom')),
  description text not null default '',
  duration_minutes integer not null default 120 check (duration_minutes > 0),
  -- [{ "id": "q1", "prompt": "...", "options": ["A","B"], "correct_index": 0, "code_reference": "", "explanation": "" }]
  questions jsonb not null default '[]',
  passing_score integer not null default 70 check (passing_score between 0 and 100),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_mock_exams_discipline
  on mock_exams (discipline, exam_type)
  where published = true;

create table if not exists exam_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  exam_id uuid not null references mock_exams(id) on delete cascade,
  score numeric(5, 2) check (score is null or (score >= 0 and score <= 100)),
  status text not null default 'in_progress'
    check (status in ('in_progress', 'completed', 'abandoned')),
  -- { "q1": 0, "q2": 3 } question id -> selected option index
  answers jsonb not null default '{}',
  notepad_content text not null default '',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  time_spent_seconds integer check (time_spent_seconds is null or time_spent_seconds >= 0)
);

create index if not exists idx_exam_attempts_user
  on exam_attempts (user_id, started_at desc);
create index if not exists idx_exam_attempts_exam
  on exam_attempts (exam_id, status);

-- ---------------------------------------------------------------------------
-- 4. Specialist mentor requests (zero-result filter fallback logging)
-- ---------------------------------------------------------------------------

create table if not exists specialist_mentor_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  requester_name text not null,
  requester_email text not null,
  discipline text not null,
  sub_field text not null default '',
  skills_requested text[] not null default '{}',
  career_requirements text not null default '',
  search_query text not null default '',
  filters_snapshot jsonb not null default '{}',
  status text not null default 'pending'
    check (status in ('pending', 'reviewing', 'matched', 'closed')),
  admin_notes text not null default '',
  matched_mentor_slug text,
  created_at timestamptz not null default now()
);

create index if not exists idx_specialist_requests_status
  on specialist_mentor_requests (status, created_at desc);
create index if not exists idx_specialist_requests_user
  on specialist_mentor_requests (user_id)
  where user_id is not null;

-- Optional bridge: link specialist intake to booking_requests when a match is made
alter table booking_requests
  add column if not exists specialist_request_id uuid
  references specialist_mentor_requests(id) on delete set null;

create index if not exists idx_booking_requests_specialist
  on booking_requests (specialist_request_id)
  where specialist_request_id is not null;

-- ---------------------------------------------------------------------------
-- Validation triggers
-- ---------------------------------------------------------------------------

create or replace function validate_project_endorsement()
returns trigger
language plpgsql
as $$
begin
  if not exists (
    select 1
    from portfolio_projects pp
    where pp.id = new.portfolio_project_id
      and pp.portfolio_id = new.portfolio_id
  ) then
    raise exception 'portfolio_project does not belong to the specified portfolio';
  end if;

  if not exists (
    select 1
    from mentor_profiles mp
    where mp.id = new.mentor_profile_id
      and mp.user_id = new.mentor_user_id
      and mp.status = 'approved'
  ) then
    raise exception 'only approved mentors may endorse portfolio projects';
  end if;

  return new;
end;
$$;

drop trigger if exists project_endorsements_validate on project_endorsements;
create trigger project_endorsements_validate
  before insert or update on project_endorsements
  for each row execute function validate_project_endorsement();

create or replace function set_roadmap_milestone_completed_at()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'completed' and (old.status is distinct from 'completed') then
    new.completed_at := coalesce(new.completed_at, now());
  elsif new.status <> 'completed' then
    new.completed_at := null;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists roadmap_milestones_completed_at on roadmap_milestones;
create trigger roadmap_milestones_completed_at
  before insert or update on roadmap_milestones
  for each row execute function set_roadmap_milestone_completed_at();

create or replace function touch_mentorship_roadmap_updated_at()
returns trigger
language plpgsql
as $$
begin
  update mentorship_roadmaps
  set updated_at = now()
  where id = coalesce(new.roadmap_id, old.roadmap_id);
  return coalesce(new, old);
end;
$$;

drop trigger if exists roadmap_milestones_touch_roadmap on roadmap_milestones;
create trigger roadmap_milestones_touch_roadmap
  after insert or update or delete on roadmap_milestones
  for each row execute function touch_mentorship_roadmap_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table mentorship_roadmaps enable row level security;
alter table roadmap_milestones enable row level security;
alter table project_endorsements enable row level security;
alter table mock_exams enable row level security;
alter table exam_attempts enable row level security;
alter table specialist_mentor_requests enable row level security;

-- mentorship_roadmaps
drop policy if exists "Roadmap participants read" on mentorship_roadmaps;
create policy "Roadmap participants read" on mentorship_roadmaps
  for select to authenticated
  using (
    auth.uid() = mentor_user_id
    or auth.uid() = student_user_id
    or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "Mentors create roadmaps" on mentorship_roadmaps;
create policy "Mentors create roadmaps" on mentorship_roadmaps
  for insert to authenticated
  with check (
    auth.uid() = mentor_user_id
    and exists (
      select 1 from mentor_profiles mp
      where mp.user_id = auth.uid()
        and mp.status = 'approved'
    )
  );

drop policy if exists "Roadmap participants update" on mentorship_roadmaps;
create policy "Roadmap participants update" on mentorship_roadmaps
  for update to authenticated
  using (
    auth.uid() = mentor_user_id
    or auth.uid() = student_user_id
    or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "Admins delete roadmaps" on mentorship_roadmaps;
create policy "Admins delete roadmaps" on mentorship_roadmaps
  for delete to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- roadmap_milestones (access via parent roadmap)
drop policy if exists "Roadmap milestone participants read" on roadmap_milestones;
create policy "Roadmap milestone participants read" on roadmap_milestones
  for select to authenticated
  using (
    exists (
      select 1 from mentorship_roadmaps r
      where r.id = roadmap_id
        and (r.mentor_user_id = auth.uid() or r.student_user_id = auth.uid())
    )
    or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "Mentors manage milestones" on roadmap_milestones;
create policy "Mentors manage milestones" on roadmap_milestones
  for insert to authenticated
  with check (
    exists (
      select 1 from mentorship_roadmaps r
      where r.id = roadmap_id
        and r.mentor_user_id = auth.uid()
    )
    or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "Roadmap milestone participants update" on roadmap_milestones;
create policy "Roadmap milestone participants update" on roadmap_milestones
  for update to authenticated
  using (
    exists (
      select 1 from mentorship_roadmaps r
      where r.id = roadmap_id
        and (r.mentor_user_id = auth.uid() or r.student_user_id = auth.uid())
    )
    or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "Mentors delete milestones" on roadmap_milestones;
create policy "Mentors delete milestones" on roadmap_milestones
  for delete to authenticated
  using (
    exists (
      select 1 from mentorship_roadmaps r
      where r.id = roadmap_id
        and r.mentor_user_id = auth.uid()
    )
    or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- project_endorsements
drop policy if exists "Public read endorsements on published portfolios" on project_endorsements;
create policy "Public read endorsements on published portfolios" on project_endorsements
  for select
  using (
    exists (
      select 1 from portfolios p
      where p.id = portfolio_id
        and p.published = true
    )
    or exists (
      select 1 from portfolios p
      where p.id = portfolio_id
        and p.user_id = auth.uid()
    )
    or mentor_user_id = auth.uid()
    or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "Approved mentors endorse projects" on project_endorsements;
create policy "Approved mentors endorse projects" on project_endorsements
  for insert to authenticated
  with check (
    auth.uid() = mentor_user_id
    and exists (
      select 1 from mentor_profiles mp
      where mp.id = mentor_profile_id
        and mp.user_id = auth.uid()
        and mp.status = 'approved'
    )
    and exists (
      select 1 from portfolios p
      where p.id = portfolio_id
        and p.published = true
    )
  );

drop policy if exists "Mentors revoke own endorsements" on project_endorsements;
create policy "Mentors revoke own endorsements" on project_endorsements
  for delete to authenticated
  using (
    auth.uid() = mentor_user_id
    or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- mock_exams
drop policy if exists "Public read published mock exams" on mock_exams;
create policy "Public read published mock exams" on mock_exams
  for select
  using (
    published = true
    or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "Admins manage mock exams" on mock_exams;
create policy "Admins manage mock exams" on mock_exams
  for all to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- exam_attempts
drop policy if exists "Users read own exam attempts" on exam_attempts;
create policy "Users read own exam attempts" on exam_attempts
  for select to authenticated
  using (
    auth.uid() = user_id
    or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "Users create own exam attempts" on exam_attempts;
create policy "Users create own exam attempts" on exam_attempts
  for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users update own exam attempts" on exam_attempts;
create policy "Users update own exam attempts" on exam_attempts
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- specialist_mentor_requests
drop policy if exists "Users read own specialist requests" on specialist_mentor_requests;
create policy "Users read own specialist requests" on specialist_mentor_requests
  for select to authenticated
  using (
    auth.uid() = user_id
    or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "Authenticated users submit specialist requests" on specialist_mentor_requests;
create policy "Authenticated users submit specialist requests" on specialist_mentor_requests
  for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Admins manage specialist requests" on specialist_mentor_requests;
create policy "Admins manage specialist requests" on specialist_mentor_requests
  for update to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Recruiters / job posters can read specialist pipeline for talent ops (optional visibility)
drop policy if exists "Job posters read specialist requests" on specialist_mentor_requests;
create policy "Job posters read specialist requests" on specialist_mentor_requests
  for select to authenticated
  using (
    exists (
      select 1 from jobs j
      where j.posted_by = auth.uid()
    )
  );
