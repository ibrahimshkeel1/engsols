-- Wave 2: optional mentor intro video for profile storytelling
alter table mentor_profiles add column if not exists intro_video_url text;
