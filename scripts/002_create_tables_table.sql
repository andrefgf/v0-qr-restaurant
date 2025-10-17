-- Create tables table (physical restaurant tables)
create table if not exists public.tables (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  table_number text not null,
  qr_code text not null unique,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(restaurant_id, table_number)
);

-- Enable RLS
alter table public.tables enable row level security;

-- Policies: Allow public read access, authenticated users can manage
create policy "tables_select_all"
  on public.tables for select
  using (true);

create policy "tables_insert_authenticated"
  on public.tables for insert
  to authenticated
  with check (true);

create policy "tables_update_authenticated"
  on public.tables for update
  to authenticated
  using (true);

create policy "tables_delete_authenticated"
  on public.tables for delete
  to authenticated
  using (true);

-- Create index for faster lookups
create index if not exists idx_tables_restaurant_id on public.tables(restaurant_id);
create index if not exists idx_tables_qr_code on public.tables(qr_code);
