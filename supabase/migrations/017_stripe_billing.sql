-- Stripe customer + subscription identifiers for billing portal and lifecycle webhooks

alter table booking_requests
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text;

alter table user_purchased_exams
  add column if not exists stripe_customer_id text;

create index if not exists idx_booking_requests_stripe_customer
  on booking_requests (stripe_customer_id)
  where stripe_customer_id is not null;

create index if not exists idx_booking_requests_stripe_subscription
  on booking_requests (stripe_subscription_id)
  where stripe_subscription_id is not null;

create index if not exists idx_user_purchased_exams_stripe_customer
  on user_purchased_exams (stripe_customer_id)
  where stripe_customer_id is not null;
