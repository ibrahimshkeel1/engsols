-- Seller self-onboarding, push subscriptions

alter table sellers add column if not exists owner_id uuid references auth.users(id) on delete set null;

drop policy if exists "Users create own seller" on sellers;
create policy "Users create own seller" on sellers
  for insert with check (owner_id = auth.uid());

drop policy if exists "Users read own seller" on sellers;
create policy "Users read own seller" on sellers
  for select using (
    owner_id = auth.uid()
    or published = true
    or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "Users update own seller" on sellers;
create policy "Users update own seller" on sellers
  for update using (owner_id = auth.uid());

create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null,
  subscription jsonb not null default '{}',
  created_at timestamptz not null default now(),
  unique (user_id, endpoint)
);

alter table push_subscriptions enable row level security;

drop policy if exists "Users manage own push subs" on push_subscriptions;
create policy "Users manage own push subs" on push_subscriptions
  for all using (user_id = auth.uid());
