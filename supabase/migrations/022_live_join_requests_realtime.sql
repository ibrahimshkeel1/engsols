-- Enable Supabase Realtime for host join-request notifications
alter table live_join_requests replica identity full;

do $$
begin
  alter publication supabase_realtime add table live_join_requests;
exception
  when duplicate_object then null;
end $$;
