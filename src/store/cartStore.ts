import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Product } from '../types'

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, size: string, color: string, quantity?: number) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, size, color, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) =>
              item.product.id === product.id &&
              item.size === size &&
              item.color === color
          )

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === existingItem.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            }
          }

          const newItem: CartItem = {
            id: `${product.id}-${size}-${color}-${Date.now()}`,
            product,
            size,
            color,
            quantity,
          }

          return { items: [...state.items, newItem] }
        })
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }))
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
        } else {
          set((state) => ({
            items: state.items.map((item) =>
              item.id === itemId ? { ...item, quantity } : item
            ),
          }))
        }
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        )
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)

export default useCartStore