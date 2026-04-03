import { createClient } from '@supabase/supabase-js'
import type { Product, Order } from './types'

// Fallbacks vacíos sólo para que el build estático no explote.
// En runtime (dev y producción) las variables reales siempre están presentes.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (url, options) =>
      fetch(url, { ...options, cache: 'no-store' }),
  },
})

// ── Products ─────────────────────────────────────────────────────────────────

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Product[]
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at'>) {
  const { data, error } = await supabase.from('products').insert(product).select().single()
  if (error) throw error
  return data as Product
}

/**
 * Upload a product image to Supabase Storage bucket "products".
 * Returns the public URL.
 */
export async function uploadProductImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage.from('product-images').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error

  const { data } = supabase.storage.from('product-images').getPublicUrl(path)
  return data.publicUrl
}

// ── Orders ────────────────────────────────────────────────────────────────────

export async function getOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*, product:products(*)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Order[]
}

export async function createOrder(order: Omit<Order, 'id' | 'created_at' | 'product'>) {
  const { data, error } = await supabase.from('orders').insert(order).select().single()
  if (error) throw error
  return data as Order
}

export async function updateOrderStatus(id: string, status: 'pendiente' | 'enviado') {
  const { error } = await supabase.from('orders').update({ status }).eq('id', id)
  if (error) throw error
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}
