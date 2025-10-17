-- Create menu items table
create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  category_id uuid not null references public.menu_categories(id) on delete cascade,
  name text not null,
  description text,
  price_cents int not null check (price_cents >= 0),
  image_url text,
  is_available boolean default true,
  allergens text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.menu_items enable row level security;

-- Policies: Allow public read access, authenticated users can manage
create policy "menu_items_select_all"
  on public.menu_items for select
  using (true);

create policy "menu_items_insert_authenticated"
  on public.menu_items for insert
  to authenticated
  with check (true);

create policy "menu_items_update_authenticated"
  on public.menu_items for update
  to authenticated
  using (true);

create policy "menu_items_delete_authenticated"
  on public.menu_items for delete
  to authenticated
  using (true);

-- Create indexes for faster lookups
create index if not exists idx_menu_items_restaurant_id on public.menu_items(restaurant_id);
create index if not exists idx_menu_items_category_id on public.menu_items(category_id);
