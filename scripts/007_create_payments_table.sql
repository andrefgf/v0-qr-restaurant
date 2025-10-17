-- Create payments table
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  amount_cents int not null check (amount_cents >= 0),
  status text not null default 'pending' check (status in ('pending', 'processing', 'succeeded', 'failed', 'refunded')),
  stripe_payment_intent_id text unique,
  stripe_client_secret text,
  payment_method text,
  error_message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.payments enable row level security;

-- Policies: Allow public read access, authenticated users can manage
create policy "payments_select_all"
  on public.payments for select
  using (true);

create policy "payments_insert_all"
  on public.payments for insert
  with check (true);

create policy "payments_update_all"
  on public.payments for update
  using (true);

create policy "payments_delete_authenticated"
  on public.payments for delete
  to authenticated
  using (true);

-- Create indexes for faster lookups
create index if not exists idx_payments_order_id on public.payments(order_id);
create index if not exists idx_payments_stripe_payment_intent_id on public.payments(stripe_payment_intent_id);
