-- ============================================================
-- DEPO — Productos de prueba
-- Ejecutar DESPUÉS de schema.sql
-- ============================================================

insert into products (name, category, price, sizes, colors, image_url, stock)
values

  -- Vestidos
  (
    'Vestido Midi Floral Primavera',
    'vestidos',
    62.90,
    array['S', 'M', 'L'],
    array['#C85880', '#ffffff', '#FFD700'],
    '',
    8
  ),
  (
    'Vestido Mini Satinado Negro',
    'vestidos',
    58.00,
    array['XS', 'S', 'M'],
    array['#000000', '#C85880'],
    '',
    4
  ),

  -- Deportiva
  (
    'Set Deportivo Top + Leggings',
    'deportiva',
    64.90,
    array['XS', 'S', 'M', 'L', 'XL'],
    array['#000000', '#C85880', '#3B5998'],
    '',
    10
  ),
  (
    'Jogger Wide Leg Oversize',
    'deportiva',
    45.00,
    array['S', 'M', 'L', 'XL'],
    array['#000000', '#228B22', '#3B5998'],
    '',
    6
  ),

  -- Casual
  (
    'Blusa Lino Manga Corta',
    'casual',
    40.00,
    array['S', 'M', 'L', 'XL'],
    array['#ffffff', '#FFD700', '#8B4513'],
    '',
    12
  ),
  (
    'Camisa Oversize Rayas Verano',
    'casual',
    52.50,
    array['M', 'L', 'XL'],
    array['#ffffff', '#3B5998', '#C85880'],
    '',
    5
  );
