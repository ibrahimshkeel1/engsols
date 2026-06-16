-- Profile photos (profiles.avatar_url already exists), forum attachments, news covers

alter table forum_posts add column if not exists image_urls text[] not null default '{}';
alter table forum_replies add column if not exists image_urls text[] not null default '{}';
alter table news_articles add column if not exists cover_image_url text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read media" on storage.objects;
create policy "Public read media" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "Users upload media" on storage.objects;
create policy "Users upload media" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'media'
    and (
      ((storage.foldername(name))[1] = 'avatars' and (storage.foldername(name))[2] = auth.uid()::text)
      or ((storage.foldername(name))[1] = 'forum' and (storage.foldername(name))[2] = auth.uid()::text)
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
      or (
        (storage.foldername(name))[1] = 'news'
        and exists (select 1 from profiles where id = auth.uid() and role = 'admin')
      )
    )
  );
