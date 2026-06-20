-- News & Engineering Insights Hub (Phase 8)
-- Evolves news_articles with discipline tagging, view counts, and hub schema.

create extension if not exists pgcrypto;

create table if not exists news_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null default '',
  content text not null default '',
  discipline text not null default 'Industry',
  tags text[] not null default '{}',
  image_url text,
  view_count integer not null default 0,
  published_at timestamptz default now(),
  published boolean not null default false,
  created_at timestamptz not null default now()
);

-- Legacy columns (older migrations / schema.sql)
alter table news_articles add column if not exists excerpt text;
alter table news_articles add column if not exists body text;
alter table news_articles add column if not exists category text;
alter table news_articles add column if not exists cover_image_url text;
alter table news_articles add column if not exists featured boolean not null default false;
alter table news_articles add column if not exists author_id uuid references profiles(id) on delete set null;

-- Hub schema columns
alter table news_articles add column if not exists summary text;
alter table news_articles add column if not exists content text;
alter table news_articles add column if not exists discipline text;
alter table news_articles add column if not exists tags text[] default '{}';
alter table news_articles add column if not exists image_url text;
alter table news_articles add column if not exists view_count integer not null default 0;

update news_articles
set
  summary = coalesce(nullif(summary, ''), excerpt, ''),
  content = coalesce(nullif(content, ''), body, ''),
  discipline = coalesce(nullif(discipline, ''), category, 'Industry'),
  image_url = coalesce(image_url, cover_image_url),
  tags = coalesce(tags, '{}'::text[])
where summary is null
   or content is null
   or discipline is null
   or image_url is null
   or tags is null;

alter table news_articles alter column summary set default '';
alter table news_articles alter column content set default '';
alter table news_articles alter column discipline set default 'Industry';
alter table news_articles alter column tags set default '{}';
alter table news_articles alter column view_count set default 0;

create index if not exists idx_news_published on news_articles(published, published_at desc);
create index if not exists idx_news_discipline on news_articles(discipline, published, published_at desc);

alter table news_articles enable row level security;

drop policy if exists "Published news public" on news_articles;
drop policy if exists "Admins manage news" on news_articles;

create policy "Published news public"
  on news_articles for select
  using (
    published = true
    or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins manage news"
  on news_articles for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create or replace function increment_news_article_views(article_slug text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update news_articles
  set view_count = view_count + 1
  where slug = article_slug
    and published = true;
end;
$$;

grant execute on function increment_news_article_views(text) to anon, authenticated;
