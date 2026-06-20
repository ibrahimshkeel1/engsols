-- Host-controlled join approval for live sessions
alter table live_sessions
  add column if not exists require_join_approval boolean not null default false;

create table if not exists live_join_requests (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references live_sessions(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'denied')),
  display_name text not null default '',
  requested_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by uuid references profiles(id) on delete set null,
  unique (session_id, user_id)
);

create index if not exists live_join_requests_session_status_idx
  on live_join_requests (session_id, status);

alter table live_join_requests enable row level security;

create policy live_join_requests_select_own on live_join_requests
  for select using (auth.uid() = user_id);

create policy live_join_requests_select_host on live_join_requests
  for select using (
    exists (
      select 1 from live_sessions
      where live_sessions.id = live_join_requests.session_id
        and live_sessions.host_id = auth.uid()
    )
  );

create policy live_join_requests_select_admin on live_join_requests
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy live_join_requests_insert_self on live_join_requests
  for insert with check (auth.uid() = user_id and status = 'pending');

create policy live_join_requests_update_host on live_join_requests
  for update using (
    exists (
      select 1 from live_sessions
      where live_sessions.id = live_join_requests.session_id
        and live_sessions.host_id = auth.uid()
    )
  );

create policy live_join_requests_update_admin on live_join_requests
  for update using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );
