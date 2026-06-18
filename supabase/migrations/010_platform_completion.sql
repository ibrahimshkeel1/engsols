-- Notifications, one-off sessions, marketplace images, cert prep paths

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  body text not null default '',
  url text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user on notifications (user_id, created_at desc);

alter table mentor_profiles add column if not exists intro_calendly_url text;
alter table mentor_profiles add column if not exists study_plan_calendly_url text;
alter table mentor_profiles add column if not exists interview_calendly_url text;

alter table certifications add column if not exists prep_steps jsonb not null default '[]';

alter table marketplace_listings add column if not exists image_url text;

alter table booking_requests add column if not exists seller_slug text;
alter table booking_requests add column if not exists listing_slug text;

-- In-app notifications (server inserts via security definer)
alter table notifications enable row level security;

drop policy if exists "Users read own notifications" on notifications;
create policy "Users read own notifications" on notifications
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "Users update own notifications" on notifications;
create policy "Users update own notifications" on notifications
  for update to authenticated using (auth.uid() = user_id);

create or replace function create_notification(
  p_user_id uuid,
  p_title text,
  p_body text,
  p_url text default null
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into notifications (user_id, title, body, url)
  values (p_user_id, p_title, p_body, p_url)
  returning id into v_id;
  return v_id;
end;
$$;

grant execute on function create_notification(uuid, text, text, text) to authenticated;

-- Marketplace image uploads
drop policy if exists "Users upload media" on storage.objects;
create policy "Users upload media" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'media'
    and (
      ((storage.foldername(name))[1] = 'avatars' and (storage.foldername(name))[2] = auth.uid()::text)
      or ((storage.foldername(name))[1] = 'forum' and (storage.foldername(name))[2] = auth.uid()::text)
      or ((storage.foldername(name))[1] = 'marketplace' and (storage.foldername(name))[2] = auth.uid()::text)
      or (
        (storage.foldername(name))[1] = 'news'
        and exists (select 1 from profiles where id = auth.uid() and role = 'admin')
      )
    )
  );

drop policy if exists "Users update media" on storage.objects;
create policy "Users update media" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'media'
    and (
      ((storage.foldername(name))[1] = 'avatars' and (storage.foldername(name))[2] = auth.uid()::text)
      or ((storage.foldername(name))[1] = 'forum' and (storage.foldername(name))[2] = auth.uid()::text)
      or ((storage.foldername(name))[1] = 'marketplace' and (storage.foldername(name))[2] = auth.uid()::text)
      or (
        (storage.foldername(name))[1] = 'news'
        and exists (select 1 from profiles where id = auth.uid() and role = 'admin')
      )
    )
  );

drop policy if exists "Users delete media" on storage.objects;
create policy "Users delete media" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'media'
    and (
      ((storage.foldername(name))[1] = 'avatars' and (storage.foldername(name))[2] = auth.uid()::text)
      or ((storage.foldername(name))[1] = 'forum' and (storage.foldername(name))[2] = auth.uid()::text)
      or ((storage.foldername(name))[1] = 'marketplace' and (storage.foldername(name))[2] = auth.uid()::text)
      or (
        (storage.foldername(name))[1] = 'news'
        and exists (select 1 from profiles where id = auth.uid() and role = 'admin')
      )
    )
  );
