-- Create invoices table
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  invoice_number text not null unique,
  pdf_url text,
  customer_email text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.invoices enable row level security;

-- Policies: Allow public read access, authenticated users can manage
create policy "invoices_select_all"
  on public.invoices for select
  using (true);

create policy "invoices_insert_all"
  on public.invoices for insert
  with check (true);

create policy "invoices_update_authenticated"
  on public.invoices for update
  to authenticated
  using (true);

create policy "invoices_delete_authenticated"
  on public.invoices for delete
  to authenticated
  using (true);

-- Create index for faster lookups
create index if not exists idx_invoices_order_id on public.invoices(order_id);
create index if not exists idx_invoices_invoice_number on public.invoices(invoice_number);

-- Create sequence for invoice numbers
create sequence if not exists invoice_number_seq start with 1000;

-- Create function to generate invoice numbers
create or replace function generate_invoice_number()
returns text
language plpgsql
as $$
declare
  next_num int;
  invoice_num text;
begin
  next_num := nextval('invoice_number_seq');
  invoice_num := 'INV-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(next_num::text, 6, '0');
  return invoice_num;
end;
$$;

-- Create trigger to auto-generate invoice numbers
create or replace function set_invoice_number()
returns trigger
language plpgsql
as $$
begin
  if new.invoice_number is null then
    new.invoice_number := generate_invoice_number();
  end if;
  return new;
end;
$$;

create trigger trigger_set_invoice_number
  before insert on public.invoices
  for each row
  execute function set_invoice_number();
