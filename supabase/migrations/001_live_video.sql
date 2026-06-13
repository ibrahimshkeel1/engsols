-- Run in Supabase SQL Editor if live_sessions already exists without video columns

do $$ begin
  create type call_type as enum ('scheduled', 'forum_instant', 'mentorship_1on1', 'group_qa');
exception when duplicate_object then null;
end $$;

alter table live_sessions add column if not exists room_name text;
alter table live_sessions add column if not exists call_type call_type not null default 'scheduled';
alter table live_sessions add column if not exists forum_post_id uuid references forum_posts(id) on delete set null;
alter table live_sessions add column if not exists booking_request_id uuid references booking_requests(id) on delete set null;
alter table live_sessions add column if not exists max_participants integer not null default 50;
alter table live_sessions add column if not exists access_mode text not null default 'authenticated';
alter table live_sessions add column if not exists ended_at timestamptz;

create index if not exists idx_live_sessions_status on live_sessions(status);
create index if not exists idx_live_sessions_forum on live_sessions(forum_post_id);

drop policy if exists "Mentors manage own sessions" on live_sessions;
create policy if not exists "Hosts manage own sessions" on live_sessions for all using (auth.uid() = host_id);
