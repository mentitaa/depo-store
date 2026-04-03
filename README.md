# DEPO — Tienda de ropa femenina

Tienda online para venta de ropa femenina en Trujillo, Perú. Stock disponible ya.

**Stack:** Next.js 16 · Tailwind CSS v4 · TypeScript · Supabase · Culqi

---

## Configuración paso a paso

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Supabase

#### 2a. Crear el proyecto

1. [supabase.com](https://supabase.com) → **New project**
2. Región recomendada: `South America (São Paulo)`

#### 2b. Crear las tablas y el bucket

En el **SQL Editor** del dashboard de Supabase, ejecutar en orden:

```
supabase/schema.sql   ← tablas + RLS + bucket product-images
supabase/seed.sql     ← 6 productos de prueba
```

#### 2c. Obtener las credenciales

`Project Settings → API`:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### 2d. Crear usuario admin

`Authentication → Users → Invite user` (o Add user):
- Email y contraseña para entrar a `/admin`

### 3. Configurar Culqi

1. [culqi.com](https://culqi.com) → crear cuenta de comercio
2. `Dashboard → Llaves de API`:
   - **Public key** → `NEXT_PUBLIC_CULQI_PUBLIC_KEY`
   - **Secret key** → `CULQI_SECRET_KEY`

> Usa las llaves `pk_test_` / `sk_test_` para pruebas.

### 4. Variables de entorno

```bash
cp .env.local.example .env.local
```

Llenar `.env.local` con los valores obtenidos:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_CULQI_PUBLIC_KEY=pk_test_...
CULQI_SECRET_KEY=sk_test_...
```

### 5. Correr localmente

```bash
npm run dev
```

| URL | Descripción |
|-----|-------------|
| `http://localhost:3000` | Tienda principal |
| `http://localhost:3000/checkout` | Proceso de pago |
| `http://localhost:3000/admin` | Dashboard admin |
| `http://localhost:3000/admin/login` | Login admin |

---

## Deploy en Vercel

### Opción A — Vercel CLI

```bash
npx vercel
```

Seguir el wizard interactivo.

### Opción B — Desde GitHub (recomendado)

1. Subir a GitHub:
   ```bash
   git init && git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/tu-usuario/depo.git
   git push -u origin main
   ```

2. [vercel.com](https://vercel.com) → **Add New Project** → importar el repo

3. En **Environment Variables** agregar las 4 variables:

   | Variable | Valor |
   |----------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key |
   | `NEXT_PUBLIC_CULQI_PUBLIC_KEY` | pk_... |
   | `CULQI_SECRET_KEY` | sk_... |

4. **Deploy** — Vercel detecta Next.js automáticamente

### Dominio personalizado (midepo.pe)

`Vercel → Project → Settings → Domains`:
1. Agregar `midepo.pe` y `www.midepo.pe`
2. Copiar los registros DNS que muestra Vercel
3. En tu registrador (NIC Perú u otro), crear los registros `A` y `CNAME`

---

## Estructura del proyecto

```
depo/
├── app/
│   ├── layout.tsx                 # Root layout + CartProvider
│   ├── page.tsx                   # Home: Hero + Catálogo
│   ├── checkout/
│   │   ├── page.tsx               # Checkout dos columnas + Culqi
│   │   └── confirmacion/page.tsx  # Página de éxito
│   ├── admin/
│   │   ├── page.tsx               # Dashboard pedidos + agregar producto
│   │   └── login/page.tsx         # Login admin
│   └── api/culqi/charge/
│       └── route.ts               # Cobro server-side a Culqi API
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx                   # Animación rack con CSS
│   ├── Catalog.tsx                # Grid + filtros + categorías
│   ├── ProductCard.tsx
│   ├── ProductModal.tsx           # Modal detalle + agregar al carrito
│   ├── FilterModal.tsx            # Modal filtros por talla y color
│   └── CartDrawer.tsx             # Carrito lateral (width transition)
├── context/
│   └── CartContext.tsx            # Estado global del carrito
├── lib/
│   ├── types.ts                   # Product, Order, CartItem
│   └── supabase.ts                # Cliente + helpers tipados + uploadImage
├── supabase/
│   ├── schema.sql                 # Tablas + RLS + bucket Storage
│   └── seed.sql                   # 6 productos de prueba
├── .env.local                     # Variables (no versionar)
├── .env.local.example             # Plantilla de variables
└── next.config.ts                 # remotePatterns Supabase Storage
```

---

## Notas para producción

- **Culqi live**: reemplazar llaves `test` por llaves `live` en las variables de entorno de Vercel
- **RLS**: los anónimos solo pueden insertar pedidos; solo el admin autenticado puede leer pedidos y gestionar productos
- **Realtime**: el dashboard se actualiza automáticamente vía `supabase_realtime` al llegar nuevos pedidos
- **Imágenes**: almacenadas en el bucket `product-images` de Supabase Storage; `next/image` las optimiza gracias a `remotePatterns` en `next.config.ts`
- **`.env.local`** nunca debe subirse a git (ya está en `.gitignore` por defecto con `create-next-app`)
