export type Category = 'vestidos' | 'deportiva' | 'casual' | 'accesorios'
export type CategoryFilter = 'todos' | Category

export interface Product {
  id: string
  name: string
  category: string[]
  price: number
  sizes: string[]
  colors: string[]
  image_urls: string[]
  stock: number
  priority?: number
  available_from?: string | null
  created_at: string
}

export type OrderStatus = 'pendiente' | 'enviado' | 'cancelado'

export interface Order {
  id: string
  customer_name: string
  customer_email?: string
  phone: string
  address: string
  reference?: string
  product_id: string
  product?: Product
  size: string
  color: string
  status: OrderStatus
  created_at: string
}

export interface CartItem {
  product: Product
  size: string
  color: string
  quantity: number
}
