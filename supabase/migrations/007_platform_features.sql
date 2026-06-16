-- Platform features: reviews, saved mentors, notes, reports, rate limits, mentor calendar

-- Mentor profile extensions
alter table mentor_profiles add column if not exists calendly_url text;
alter table mentor_profiles add column if not exists verified boolean not null default false;

-- Profile goal tracking
alter table profiles add column if not exists career_goals text[] not null default '{}';
alter table profiles add column if not exists goals_completed text[] not null default '{}';
alter table profiles add column if not exists forum_reputation integer not null default 0;

-- Booking mentor link
alter table booking_requests add column if not exists mentor_user_id uuid references profiles(id) on delete set null;

-- Live recordings
alter table live_sessions add column if not exists recording_url text;

-- Jobs employer posting
alter table jobs add column if not exists posted_by uuid references profiles(id) on delete set null;
alter table jobs add column if not exists employer_verified boolean not null default false;

-- Mentor reviews
create table if not exists mentor_reviews (
  id uuid primary key default gen_random_uuid(),
  mentor_profile_id uuid not null references mentor_profiles(id) on delete cascade,
  author_id uuid not null references profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  text text not null default '',
  author_role text not null default '',
  created_at timestamptz not null default now(),
  unique (mentor_profile_id, author_id)
);

-- Saved mentors
create table if not exists saved_mentors (
  user_id uuid not null references profiles(id) on delete cascade,
  mentor_slug text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, mentor_slug)
);

-- Private session notes
create table if not exists session_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  mentor_slug text not null,
  booking_request_id uuid references booking_requests(id) on delete set null,
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Content reports
create table if not exists content_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references profiles(id) on delete set null,
  content_type text not null,
  content_id text not null,
  reason text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- Forum reply likes (per user)
create table if not exists forum_reply_likes (
  reply_id uuid not null references forum_replies(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  primary key (reply_id, user_id)
);

-- Rate limiting
create table if not exists rate_limit_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  action text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_rate_limit_events on rate_limit_events (user_id, action, created_at desc);

-- RLS
alter table mentor_reviews enable row level security;
alter table saved_mentors enable row level security;
alter table session_notes enable row level security;
alter table content_reports enable row level security;
alter table forum_reply_likes enable row level security;
alter table rate_limit_events enable row level security;

-- Mentor reviews policies
create policy "Public read mentor reviews" on mentor_reviews for select using (true);
create policy "Users insert own reviews" on mentor_reviews for insert with check (auth.uid() = author_id);
create policy "Users update own reviews" on mentor_reviews for update using (auth.uid() = author_id);
create policy "Admins manage reviews" on mentor_reviews for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Saved mentors
create policy "Users manage own saved mentors" on saved_mentors for all using (auth.uid() = user_id);

-- Session notes (private)
create policy "Users manage own notes" on session_notes for all using (auth.uid() = user_id);

-- Content reports
create policy "Users insert reports" on content_reports for insert with check (auth.uid() = reporter_id);
create policy "Admins read reports" on content_reports for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins update reports" on content_reports for update using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Forum reply likes
create policy "Public read likes" on forum_reply_likes for select using (true);
create policy "Users toggle own likes" on forum_reply_likes for all using (auth.uid() = user_id);

-- Rate limits (own rows only)
create policy "Users insert own rate events" on rate_limit_events for insert with check (auth.uid() = user_id);
create policy "Users read own rate events" on rate_limit_events for select using (auth.uid() = user_id);

-- Portfolio children write policies (owners via portfolio)
drop policy if exists "Portfolio owners manage projects" on portfolio_projects;
create policy "Portfolio owners manage projects" on portfolio_projects for all using (
  exists (select 1 from portfolios p where p.id = portfolio_id and p.user_id = auth.uid())
);
drop policy if exists "Portfolio owners manage experience" on portfolio_experience;
create policy "Portfolio owners manage experience" on portfolio_experience for all using (
  exists (select 1 from portfolios p where p.id = portfolio_id and p.user_id = auth.uid())
);

-- Booking: require auth for new requests
drop policy if exists "Anyone can request booking" on booking_requests;
drop policy if exists "Authenticated users request booking" on booking_requests;
create policy "Authenticated users request booking" on booking_requests for insert with check (auth.uid() is not null);

-- Mentors read bookings for their profile
drop policy if exists "Mentors read their bookings" on booking_requests;
create policy "Mentors read their bookings" on booking_requests for select using (
  auth.uid() = user_id
  or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  or exists (
    select 1 from mentor_profiles mp
    where mp.user_id = auth.uid()
    and (mp.slug = mentor_slug or mp.user_id = mentor_user_id)
  )
);

-- Update mentor rating from reviews
create or replace function refresh_mentor_rating()
returns trigger as $$
begin
  update mentor_profiles
  set
    rating = coalesce((
      select round(avg(rating)::numeric, 1)
      from mentor_reviews
      where mentor_profile_id = coalesce(new.mentor_profile_id, old.mentor_profile_id)
    ), 0),
    review_count = (
      select count(*)::integer
      from mentor_reviews
      where mentor_profile_id = coalesce(new.mentor_profile_id, old.mentor_profile_id)
    )
  where id = coalesce(new.mentor_profile_id, old.mentor_profile_id);
  return coalesce(new, old);
end;
$$ language plpgsql security definer;

drop trigger if exists mentor_reviews_rating on mentor_reviews;
create trigger mentor_reviews_rating
  after insert or update or delete on mentor_reviews
  for each row execute function refresh_mentor_rating();

-- Sync forum reply like counts
create or replace function refresh_reply_likes()
returns trigger as $$
begin
  update forum_replies
  set likes = (
    select count(*)::integer from forum_reply_likes
    where reply_id = coalesce(new.reply_id, old.reply_id)
  )
  where id = coalesce(new.reply_id, old.reply_id);
  return coalesce(new, old);
end;
$$ language plpgsql security definer;

drop trigger if exists forum_reply_likes_count on forum_reply_likes;
create trigger forum_reply_likes_count
  after insert or delete on forum_reply_likes
  for each row execute function refresh_reply_likes();

-- Full-text search indexes
create index if not exists idx_mentor_profiles_fts on mentor_profiles using gin (
  to_tsvector('english', coalesce(headline, '') || ' ' || coalesce(company, '') || ' ' || coalesce(bio, ''))
);
create index if not exists idx_forum_posts_fts on forum_posts using gin (
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(body, ''))
);

-- Allow authenticated job posting and marketplace listings
drop policy if exists "Users post jobs" on jobs;
create policy "Users post jobs" on jobs for insert with check (auth.uid() = posted_by);

drop policy if exists "Users insert marketplace listings" on marketplace_listings;
create policy "Users insert marketplace listings" on marketplace_listings for insert with check (auth.uid() is not null);
