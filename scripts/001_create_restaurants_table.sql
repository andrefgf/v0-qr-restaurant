-- Create restaurants table
create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  primary_color text default '#FF6B35',
  welcome_message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.restaurants enable row level security;

-- Policies: Allow public read access, authenticated users can manage
create policy "restaurants_select_all"
  on public.restaurants for select
  using (true);

create policy "restaurants_insert_authenticated"
  on public.restaurants for insert
  to authenticated
  with check (true);

create policy "restaurants_update_authenticated"
  on public.restaurants for update
  to authenticated
  using (true);

create policy "restaurants_delete_authenticated"
  on public.restaurants for delete
  to authenticated
  using (true);
