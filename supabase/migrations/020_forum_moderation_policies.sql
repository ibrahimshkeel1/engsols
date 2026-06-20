-- Allow authors to update/delete their own forum replies (RLS was insert+select only).
drop policy if exists "Authors update replies" on forum_replies;
create policy "Authors update replies" on forum_replies
  for update using (auth.uid() = author_id);

drop policy if exists "Authors delete replies" on forum_replies;
create policy "Authors delete replies" on forum_replies
  for delete using (auth.uid() = author_id);

drop policy if exists "Admins manage replies" on forum_replies;
create policy "Admins manage replies" on forum_replies
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Allow post authors to delete their own threads (previously admin-only).
drop policy if exists "Authors delete posts" on forum_posts;
create policy "Authors delete posts" on forum_posts
  for delete using (auth.uid() = author_id);
