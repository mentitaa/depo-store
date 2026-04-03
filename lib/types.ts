export type Category = 'todos' | 'vestidos' | 'deportiva' | 'casual'

export interface Product {
  id: string
  name: string
  category: Category
  price: number
  sizes: string[]
  colors: string[]
  image_url: string
  stock: number
  created_at: string
}

export type OrderStatus = 'pendiente' | 'enviado'

export interface Order {
  id: string
  customer_name: string
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
