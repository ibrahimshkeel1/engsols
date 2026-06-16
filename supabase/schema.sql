-- EngSols database schema — run in Supabase SQL Editor

create type user_role as enum ('student', 'mentor', 'admin');
create type mentor_status as enum ('pending', 'approved', 'rejected');
create type live_status as enum ('upcoming', 'live', 'ended');
create type call_type as enum ('scheduled', 'forum_instant', 'mentorship_1on1', 'group_qa');

-- Profiles (extends auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  role user_role not null default 'student',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Mentor profiles
create table if not exists mentor_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade unique,
  slug text not null unique,
  headline text not null default '',
  company text not null default '',
  discipline text not null,
  sub_fields text[] not null default '{}',
  skills text[] not null default '{}',
  goals text[] not null default '{}',
  bio text not null default '',
  credentials text[] not null default '{}',
  monthly_rate integer not null default 150,
  years_experience integer not null default 0,
  status mentor_status not null default 'pending',
  featured boolean not null default false,
  rating numeric(2,1) not null default 5.0,
  review_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Student portfolios
create table if not exists portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade unique,
  slug text not null unique,
  headline text not null default '',
  university text not null default '',
  graduation_year integer,
  discipline text not null,
  location text not null default '',
  open_to_work boolean not null default true,
  seeking text not null default 'full-time',
  bio text not null default '',
  skills text[] not null default '{}',
  credentials text[] not null default '{}',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid not null references portfolios(id) on delete cascade,
  title text not null,
  description text not null default '',
  tags text[] not null default '{}',
  year integer not null default extract(year from now())::int,
  sort_order integer not null default 0
);

create table if not exists portfolio_experience (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid not null references portfolios(id) on delete cascade,
  role text not null,
  company text not null,
  duration text not null default '',
  description text not null default '',
  sort_order integer not null default 0
);

-- Forum
create table if not exists forum_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  author_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  body text not null,
  discipline text not null,
  tags text[] not null default '{}',
  is_solved boolean not null default false,
  view_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists forum_replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references forum_posts(id) on delete cascade,
  author_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  likes integer not null default 0,
  created_at timestamptz not null default now()
);

-- Live sessions
create table if not exists live_sessions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  host_id uuid not null references profiles(id) on delete cascade,
  mentor_profile_id uuid references mentor_profiles(id) on delete set null,
  title text not null,
  description text not null default '',
  discipline text not null,
  scheduled_at timestamptz not null,
  status live_status not null default 'upcoming',
  stream_url text,
  room_name text,
  call_type call_type not null default 'scheduled',
  forum_post_id uuid references forum_posts(id) on delete set null,
  max_participants integer not null default 50,
  access_mode text not null default 'authenticated',
  ended_at timestamptz,
  viewer_count integer not null default 0,
  created_at timestamptz not null default now()
);

-- News
create table if not exists news_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  body text not null,
  author_id uuid references profiles(id) on delete set null,
  category text not null default 'Industry',
  featured boolean not null default false,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

-- Booking requests (intro calls & mentorship)
create table if not exists booking_requests (
  id uuid primary key default gen_random_uuid(),
  mentor_slug text not null,
  mentor_name text not null,
  requester_name text not null,
  requester_email text not null,
  message text not null default '',
  request_type text not null default 'intro',
  user_id uuid references profiles(id) on delete set null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- Link live sessions to bookings (booking_requests defined above in migration order)
alter table live_sessions add column if not exists booking_request_id uuid references booking_requests(id) on delete set null;

-- Indexes
create index if not exists idx_mentor_profiles_status on mentor_profiles(status);
create index if not exists idx_mentor_profiles_discipline on mentor_profiles(discipline);
create index if not exists idx_forum_posts_created on forum_posts(created_at desc);
create index if not exists idx_portfolios_published on portfolios(published);
create index if not exists idx_live_sessions_status on live_sessions(status);
create index if not exists idx_live_sessions_forum on live_sessions(forum_post_id);
create index if not exists idx_news_published on news_articles(published, published_at desc);

-- RLS
alter table profiles enable row level security;
alter table mentor_profiles enable row level security;
alter table portfolios enable row level security;
alter table portfolio_projects enable row level security;
alter table portfolio_experience enable row level security;
alter table forum_posts enable row level security;
alter table forum_replies enable row level security;
alter table live_sessions enable row level security;
alter table news_articles enable row level security;

-- Booking requests
alter table booking_requests enable row level security;
create policy "Users read own bookings" on booking_requests for select using (auth.uid() = user_id or exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Anyone can request booking" on booking_requests for insert with check (true);
create policy "Admins manage bookings" on booking_requests for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Profiles policies
create policy "Public profiles read" on profiles for select using (true);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);
create policy "Users insert own profile" on profiles for insert with check (auth.uid() = id);

-- Mentor profiles
create policy "Approved mentors public read" on mentor_profiles for select using (status = 'approved' or auth.uid() = user_id or exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Mentors manage own" on mentor_profiles for all using (auth.uid() = user_id);
create policy "Admins manage mentors" on mentor_profiles for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Portfolios
create policy "Published portfolios public" on portfolios for select using (published = true or auth.uid() = user_id or exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Users manage own portfolio" on portfolios for all using (auth.uid() = user_id);

-- Portfolio children
create policy "Projects via portfolio" on portfolio_projects for all using (
  exists (select 1 from portfolios p where p.id = portfolio_id and (p.user_id = auth.uid() or p.published = true))
);
create policy "Experience via portfolio" on portfolio_experience for all using (
  exists (select 1 from portfolios p where p.id = portfolio_id and (p.user_id = auth.uid() or p.published = true))
);

-- Forum
create policy "Forum posts public read" on forum_posts for select using (true);
create policy "Auth users create posts" on forum_posts for insert with check (auth.uid() = author_id);
create policy "Authors update posts" on forum_posts for update using (auth.uid() = author_id);
create policy "Admins delete posts" on forum_posts for delete using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "Replies public read" on forum_replies for select using (true);
create policy "Auth users create replies" on forum_replies for insert with check (auth.uid() = author_id);

-- Live sessions
create policy "Live sessions public read" on live_sessions for select using (true);
create policy "Hosts manage own sessions" on live_sessions for all using (auth.uid() = host_id);
create policy "Admins manage sessions" on live_sessions for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- News
create policy "Published news public" on news_articles for select using (published = true or exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Admins manage news" on news_articles for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'student')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Default admin account
-- Login with username: admin  |  password: iamadmin
-- (email is admin@engsols.com — sign-in accepts "admin" or the full email)
create extension if not exists pgcrypto;

do $$
declare
  admin_user_id uuid;
  admin_email text := 'admin@engsols.com';
begin
  select id into admin_user_id from auth.users where email = admin_email;

  if admin_user_id is null then
    admin_user_id := 'a0000000-0000-4000-8000-000000000001';

    insert into auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    ) values (
      admin_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      admin_email,
      crypt('iamadmin', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"admin","role":"admin"}'::jsonb,
      now(),
      now()
    );

    insert into auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) values (
      gen_random_uuid(),
      admin_user_id,
      jsonb_build_object(
        'sub', admin_user_id::text,
        'email', admin_email,
        'email_verified', true
      ),
      'email',
      admin_email,
      now(),
      now(),
      now()
    );
  end if;

  insert into public.profiles (id, email, full_name, role)
  values (admin_user_id, admin_email, 'admin', 'admin')
  on conflict (id) do update
    set role = 'admin', full_name = 'admin', email = admin_email;

  update public.profiles
  set role = 'admin', full_name = 'admin'
  where id = admin_user_id;
end $$;

-- Jobs, companies, marketplace, certifications, videos (no mock data)

create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  type text not null default 'operator',
  headquarters text not null default '',
  country text not null default '',
  employee_count text not null default '',
  founded integer,
  description text not null default '',
  disciplines text[] not null default '{}',
  verified boolean not null default false,
  website text not null default '',
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  company_slug text not null references companies(slug) on delete cascade,
  type text not null default 'full-time',
  discipline text not null,
  location text not null default '',
  remote text not null default 'onsite',
  salary_range text,
  description text not null default '',
  requirements text[] not null default '{}',
  benefits text[] not null default '{}',
  posted_at date not null default current_date,
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists sellers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  type text not null default 'distributor',
  location text not null default '',
  country text not null default '',
  description text not null default '',
  verified boolean not null default false,
  rating numeric(2,1) not null default 5.0,
  company_slug text references companies(slug) on delete set null,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists marketplace_listings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  category text not null default 'equipment',
  subcategory text not null default '',
  price numeric not null default 0,
  price_unit text not null default 'per unit',
  seller_slug text not null references sellers(slug) on delete cascade,
  company_slug text references companies(slug) on delete set null,
  discipline text not null default '',
  condition text not null default '',
  location text not null default '',
  specs jsonb not null default '{}',
  in_stock boolean not null default true,
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists certifications (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_name text not null default '',
  discipline text not null default 'General',
  description text not null default '',
  eligibility text not null default '',
  exam_format text not null default '',
  avg_prep_months integer not null default 3,
  pass_rate text,
  resources jsonb not null default '[]',
  related_mentor_slugs text[] not null default '{}',
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  author_mentor_slug text,
  discipline text not null default '',
  duration text not null default '',
  views integer not null default 0,
  video_url text,
  tags text[] not null default '{}',
  published_at timestamptz,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_jobs_company on jobs(company_slug);
create index if not exists idx_jobs_published on jobs(published, posted_at desc);
create index if not exists idx_listings_published on marketplace_listings(published, featured desc);
create index if not exists idx_companies_published on companies(published);
create index if not exists idx_certifications_published on certifications(published);
create index if not exists idx_videos_published on videos(published, published_at desc);

alter table companies enable row level security;
alter table jobs enable row level security;
alter table sellers enable row level security;
alter table marketplace_listings enable row level security;
alter table certifications enable row level security;
alter table videos enable row level security;

create policy "Published companies public read" on companies for select using (published = true or exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Admins manage companies" on companies for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "Published jobs public read" on jobs for select using (published = true or exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Admins manage jobs" on jobs for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "Published sellers public read" on sellers for select using (published = true or exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Admins manage sellers" on sellers for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "Published listings public read" on marketplace_listings for select using (published = true or exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Admins manage listings" on marketplace_listings for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "Published certifications public read" on certifications for select using (published = true or exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Admins manage certifications" on certifications for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "Published videos public read" on videos for select using (published = true or exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Admins manage videos" on videos for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
