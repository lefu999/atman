export interface Product {
  id: string
  name: string
  brand: string
  category: string
  price: number
  sizes: string[]
  colors: string[]
  images: string[]
  description: string
  material?: string
  fit?: string
  care_instructions?: string
  in_stock: boolean
  created_at: string
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  size: string
  color: string
}

export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
}

export interface Order {
  id: string
  user_id: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  shipping_address: ShippingAddress
  payment_method: string
  created_at: string
}

export interface ShippingAddress {
  full_name: string
  phone: string
  address: string
  city: string
  state: string
  zip_code: string
}