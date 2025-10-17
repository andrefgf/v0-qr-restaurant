-- Create order items table
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id uuid not null references public.menu_items(id) on delete restrict,
  quantity int not null check (quantity > 0),
  price_cents int not null check (price_cents >= 0),
  item_name text not null,
  special_instructions text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.order_items enable row level security;

-- Policies: Allow public read access, authenticated users can manage
create policy "order_items_select_all"
  on public.order_items for select
  using (true);

create policy "order_items_insert_all"
  on public.order_items for insert
  with check (true);

create policy "order_items_update_authenticated"
  on public.order_items for update
  to authenticated
  using (true);

create policy "order_items_delete_authenticated"
  on public.order_items for delete
  to authenticated
  using (true);

-- Create index for faster lookups
create index if not exists idx_order_items_order_id on public.order_items(order_id);
