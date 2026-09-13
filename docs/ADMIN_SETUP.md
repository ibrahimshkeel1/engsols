# Admin setup

EngSols does **not** ship with a default admin password. Create your admin account after deploying:

1. Sign up at `/signup` with your real email.
2. In the Supabase SQL Editor, promote that user:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

3. Sign out and back in. You should now have access to `/admin`.

Never commit passwords, service role keys, or seed scripts with hardcoded credentials.
