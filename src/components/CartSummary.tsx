'use client'

import useCartStore from '../store/cartStore'

export default function CartSummary() {
  const { items, getTotalPrice } = useCartStore()
  const subtotal = getTotalPrice()
  const shipping = subtotal > 50 ? 0 : 10
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-gray-300">
          <span>Subtotal ({items.length} items)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-300">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between text-gray-300">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        {shipping > 0 && (
          <p className="text-sm text-gray-400">
            Add ${(50 - subtotal).toFixed(2)} for free shipping
          </p>
        )}
      </div>

      <div className="border-t border-gray-800 pt-4">
        <div className="flex justify-between text-white text-lg font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Free returns within 30 days</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Secure checkout</span>
        </div>
      </div>
    </div>
  )
}