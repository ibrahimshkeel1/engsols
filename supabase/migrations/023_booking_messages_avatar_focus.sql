-- Portrait focal point + in-app booking messages

alter table profiles
  add column if not exists avatar_focus_y real not null default 0
  check (avatar_focus_y >= 0 and avatar_focus_y <= 1);

create table if not exists booking_messages (
  id uuid primary key default gen_random_uuid(),
  booking_request_id uuid not null references booking_requests(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 4000),
  created_at timestamptz not null default now()
);

create index if not exists idx_booking_messages_request
  on booking_messages (booking_request_id, created_at);

alter table booking_messages enable row level security;

create policy "booking_messages_select_participant"
  on booking_messages for select
  using (
    exists (
      select 1 from booking_requests br
      where br.id = booking_messages.booking_request_id
        and (br.user_id = auth.uid() or br.mentor_user_id = auth.uid())
    )
  );

create policy "booking_messages_insert_participant"
  on booking_messages for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from booking_requests br
      where br.id = booking_messages.booking_request_id
        and (br.user_id = auth.uid() or br.mentor_user_id = auth.uid())
        and br.status in ('pending', 'contacted')
    )
  );
