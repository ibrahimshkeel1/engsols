-- Premium mock exam pricing + purchase ledger (Stripe Checkout)

alter table mock_exams
  add column if not exists is_premium boolean not null default false,
  add column if not exists price_cents integer not null default 0 check (price_cents >= 0);

alter table mock_exams
  drop constraint if exists mock_exams_premium_price_check;

alter table mock_exams
  add constraint mock_exams_premium_price_check
  check (not is_premium or price_cents > 0);

create table if not exists user_purchased_exams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  exam_id uuid not null references mock_exams(id) on delete cascade,
  stripe_session_id text not null unique,
  purchased_at timestamptz not null default now(),
  unique (user_id, exam_id)
);

create index if not exists idx_user_purchased_exams_user
  on user_purchased_exams (user_id);

create index if not exists idx_user_purchased_exams_exam
  on user_purchased_exams (exam_id);

alter table user_purchased_exams enable row level security;

drop policy if exists "Users read own purchased exams" on user_purchased_exams;
create policy "Users read own purchased exams" on user_purchased_exams
  for select to authenticated
  using (auth.uid() = user_id);
