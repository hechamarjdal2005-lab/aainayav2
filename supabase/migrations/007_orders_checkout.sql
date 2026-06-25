create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  client_name text not null,
  phone text not null,
  address text not null,
  total numeric not null default 0,
  status text not null default 'pending',
  created_at timestamptz default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  item_id uuid,
  item_type text not null check (item_type in ('product','pack')),
  title text not null,
  image_url text,
  price numeric not null,
  quantity int not null default 1,
  subtotal numeric not null
);

alter table orders enable row level security;
alter table order_items enable row level security;

create policy "Public insert orders" on orders
  for insert
  with check (true);

create policy "Public insert order_items" on order_items
  for insert
  with check (true);

create policy "Public read orders for receipt" on orders
  for select
  using (true);

create policy "Public read order_items for receipt" on order_items
  for select
  using (true);

create policy "Admin read orders" on orders
  for select
  using (auth.role() = 'authenticated');

create policy "Admin update orders" on orders
  for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admin read order_items" on order_items
  for select
  using (auth.role() = 'authenticated');
