-- Create menu categories table
create table if not exists public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name text not null,
  description text,
  display_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.menu_categories enable row level security;

-- Policies: Allow public read access, authenticated users can manage
create policy "menu_categories_select_all"
  on public.menu_categories for select
  using (true);

create policy "menu_categories_insert_authenticated"
  on public.menu_categories for insert
  to authenticated
  with check (true);

create policy "menu_categories_update_authenticated"
  on public.menu_categories for update
  to authenticated
  using (true);

create policy "menu_categories_delete_authenticated"
  on public.menu_categories for delete
  to authenticated
  using (true);

-- Create index for faster lookups
create index if not exists idx_menu_categories_restaurant_id on public.menu_categories(restaurant_id);
