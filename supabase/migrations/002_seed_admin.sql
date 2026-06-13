-- Run in Supabase SQL Editor to create / reset the default admin user
-- Login: admin  |  Password: iamadmin

create extension if not exists pgcrypto;

do $$
declare
  admin_user_id uuid := 'a0000000-0000-4000-8000-000000000001';
  admin_email text := 'admin@engsols.com';
begin
  if not exists (select 1 from auth.users where email = admin_email) then
    insert into auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) values (
      admin_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      admin_email,
      crypt('iamadmin', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"admin","role":"admin"}'::jsonb,
      now(),
      now(),
      '',
      '',
      '',
      ''
    );

    insert into auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) values (
      gen_random_uuid(),
      admin_user_id,
      jsonb_build_object(
        'sub', admin_user_id::text,
        'email', admin_email,
        'email_verified', true
      ),
      'email',
      admin_user_id::text,
      now(),
      now(),
      now()
    );
  else
    update auth.users
    set
      encrypted_password = crypt('iamadmin', gen_salt('bf')),
      email_confirmed_at = coalesce(email_confirmed_at, now()),
      raw_user_meta_data = '{"full_name":"admin","role":"admin"}'::jsonb
    where email = admin_email;
  end if;

  insert into public.profiles (id, email, full_name, role)
  values (admin_user_id, admin_email, 'admin', 'admin')
  on conflict (id) do update
    set role = 'admin', full_name = 'admin', email = admin_email;

  update public.profiles
  set role = 'admin', full_name = 'admin'
  where email = admin_email;
end $$;
