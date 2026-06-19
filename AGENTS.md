<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Onboarding

Before changing architecture, payments, or database schema, read [`ARCHITECTURAL_MANIFESTO.md`](ARCHITECTURAL_MANIFESTO.md). It is the canonical reference for:

- Required and optional environment variables
- PostgreSQL tables and relationships (migrations `001`–`017`)
- Stripe webhook behavior (`/api/webhooks/stripe`)
- Local verification (`lint`, `test:unit`, `build`, Stripe CLI)

**Conventions:** Server Actions in `src/actions/`; data access in `src/lib/data/`; never expose `SUPABASE_SERVICE_ROLE_KEY` to the client.
