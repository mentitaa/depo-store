-- Run this in your Supabase SQL editor

create extension if not exists "uuid-ossp";

create table products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null check (category in ('vestidos', 'deportiva', 'casual')),
  price numeric(10, 2) not null,
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  image_url text not null default '',
  stock integer not null default 0,
  created_at timestamptz not null default now()
);

create table orders (
  id uuid primary key default uuid_generate_v4(),
  customer_name text not null,
  phone text not null,
  address text not null,
  product_id uuid not null references products(id),
  size text not null,
  color text not null,
  status text not null default 'pendiente' check (status in ('pendiente', 'enviado')),
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table products enable row level security;
alter table orders enable row level security;

-- Public can read products
create policy "Products are publicly readable"
  on products for select using (true);

-- Public can insert orders (guests placing orders)
create policy "Anyone can create orders"
  on orders for insert with check (true);

-- Only authenticated users (admin) can read/update orders and manage products
create policy "Admins can read orders"
  on orders for select using (auth.role() = 'authenticated');

create policy "Admins can update orders"
  on orders for update using (auth.role() = 'authenticated');

create policy "Admins can manage products"
  on products for all using (auth.role() = 'authenticated');

-- Enable Realtime for orders
alter publication supabase_realtime add table orders;
