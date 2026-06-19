-- Allow authenticated and guest specialist requests via security-definer RPC (bypasses strict insert RLS)

create or replace function submit_specialist_mentor_request(
  p_requester_name text,
  p_requester_email text,
  p_discipline text,
  p_sub_field text default '',
  p_skills_requested text[] default '{}',
  p_career_requirements text default '',
  p_search_query text default '',
  p_filters_snapshot jsonb default '{}'
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_name text;
  v_email text;
begin
  v_name := trim(coalesce(p_requester_name, ''));
  v_email := lower(trim(coalesce(p_requester_email, '')));

  if length(v_name) < 1 or length(v_name) > 120 then
    raise exception 'requester name must be between 1 and 120 characters';
  end if;

  if v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'valid requester email is required';
  end if;

  if length(trim(coalesce(p_discipline, ''))) < 1 then
    raise exception 'discipline is required';
  end if;

  if length(trim(coalesce(p_career_requirements, ''))) < 10 then
    raise exception 'career requirements must be at least 10 characters';
  end if;

  insert into specialist_mentor_requests (
    user_id,
    requester_name,
    requester_email,
    discipline,
    sub_field,
    skills_requested,
    career_requirements,
    search_query,
    filters_snapshot
  )
  values (
    auth.uid(),
    v_name,
    v_email,
    trim(p_discipline),
    coalesce(nullif(trim(p_sub_field), ''), ''),
    coalesce(p_skills_requested, '{}'),
    trim(p_career_requirements),
    coalesce(nullif(trim(p_search_query), ''), ''),
    coalesce(p_filters_snapshot, '{}'::jsonb)
  )
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function submit_specialist_mentor_request(
  text, text, text, text, text[], text, text, jsonb
) to anon, authenticated;
