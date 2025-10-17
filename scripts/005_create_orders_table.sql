-- Create orders table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  table_id uuid not null references public.tables(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')),
  subtotal_cents int not null default 0 check (subtotal_cents >= 0),
  tax_cents int not null default 0 check (tax_cents >= 0),
  total_cents int not null default 0 check (total_cents >= 0),
  special_instructions text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.orders enable row level security;

-- Policies: Allow public read access, authenticated users can manage
create policy "orders_select_all"
  on public.orders for select
  using (true);

create policy "orders_insert_all"
  on public.orders for insert
  with check (true);

create policy "orders_update_authenticated"
  on public.orders for update
  to authenticated
  using (true);

create policy "orders_delete_authenticated"
  on public.orders for delete
  to authenticated
  using (true);

-- Create indexes for faster lookups
create index if not exists idx_orders_restaurant_id on public.orders(restaurant_id);
create index if not exists idx_orders_table_id on public.orders(table_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at desc);
