-- ============================================================
-- DEPO — Schema SQL
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Extension para UUIDs
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────────────────────
-- TABLA: products
-- ─────────────────────────────────────────────────────────────
create table if not exists products (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  category    text not null check (category in ('vestidos', 'deportiva', 'casual')),
  price       numeric(10, 2) not null check (price >= 0),
  sizes       text[] not null default '{}',
  colors      text[] not null default '{}',
  image_urls  text[] not null default '{}',
  stock       integer not null default 0 check (stock >= 0),
  created_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- TABLA: orders
-- ─────────────────────────────────────────────────────────────
create table if not exists orders (
  id             uuid primary key default uuid_generate_v4(),
  customer_name  text not null,
  phone          text not null,
  address        text not null,
  reference      text,
  product_id     uuid not null references products(id) on delete restrict,
  size           text not null,
  color          text not null,
  status         text not null default 'pendiente' check (status in ('pendiente', 'enviado')),
  created_at     timestamptz not null default now()
);

-- Índice para consultas por estado (útil en el dashboard de admin)
create index if not exists orders_status_idx on orders(status);
create index if not exists orders_created_at_idx on orders(created_at desc);

-- ─────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────
alter table products enable row level security;
alter table orders   enable row level security;

-- products: cualquiera puede leer (catálogo público)
create policy "products_public_read"
  on products for select
  using (true);

-- products: solo admin autenticado puede insertar / actualizar / eliminar
create policy "products_admin_insert"
  on products for insert
  to authenticated
  with check (true);

create policy "products_admin_update"
  on products for update
  to authenticated
  using (true)
  with check (true);

create policy "products_admin_delete"
  on products for delete
  to authenticated
  using (true);

-- orders: cualquiera (anon) puede insertar (clientes hacen pedidos)
create policy "orders_anon_insert"
  on orders for insert
  with check (true);

-- orders: solo admin autenticado puede leer y actualizar
create policy "orders_admin_read"
  on orders for select
  to authenticated
  using (true);

create policy "orders_admin_update"
  on orders for update
  to authenticated
  using (true)
  with check (true);

-- ─────────────────────────────────────────────────────────────
-- REALTIME
-- Habilitar para que el dashboard de admin reciba pedidos en vivo
-- ─────────────────────────────────────────────────────────────
-- Ejecutar esto por separado si la publicación ya existe:
-- alter publication supabase_realtime add table orders;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'orders'
  ) then
    alter publication supabase_realtime add table orders;
  end if;
end $$;

-- ─────────────────────────────────────────────────────────────
-- STORAGE BUCKET: product-images
-- Ejecutar en SQL Editor (no en la UI de Storage)
-- ─────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Cualquiera puede leer imágenes (bucket público)
create policy "product_images_public_read"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Solo admin puede subir / eliminar imágenes
create policy "product_images_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

create policy "product_images_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');
