-- Wave 4: mentor availability signals + video thumbnails
alter table mentor_profiles add column if not exists responds_within_hours int;
alter table mentor_profiles add column if not exists intro_slots_this_week int;

alter table videos add column if not exists thumbnail_url text;
