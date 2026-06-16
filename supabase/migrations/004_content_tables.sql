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
