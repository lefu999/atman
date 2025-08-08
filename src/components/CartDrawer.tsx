'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import useCartStore from '../store/cartStore'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore()
  const total = getTotalPrice()

  if (!isOpen) return null

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-gray-900 z-50 transform transition-transform duration-300">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <ShoppingBag size={24} />
              Shopping Cart ({items.length})
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
              <ShoppingBag size={64} className="text-gray-600 mb-4" />
              <p className="text-gray-400 mb-4">Your cart is empty</p>
              <button
                onClick={onClose}
                className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-200"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-gray-800 rounded-lg p-3">
                    <div className="flex gap-3">
                      <div className="w-20 h-20 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product.images[0] && (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-white font-medium text-sm">{item.product.name}</h3>
                            <p className="text-gray-400 text-xs">{item.product.brand}</p>
                            <p className="text-gray-500 text-xs mt-1">
                              {item.size} / {item.color}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="bg-gray-700 text-white p-1 rounded hover:bg-gray-600"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-white text-sm w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="bg-gray-700 text-white p-1 rounded hover:bg-gray-600"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <p className="text-white font-medium">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-800 p-4">
                <div className="flex justify-between text-white mb-4">
                  <span className="text-lg">Total</span>
                  <span className="text-xl font-bold">${total.toFixed(2)}</span>
                </div>
                
                <div className="space-y-2">
                  <Link
                    href="/cart"
                    onClick={onClose}
                    className="block w-full bg-gray-700 text-white py-3 rounded-lg text-center font-medium hover:bg-gray-600 transition-colors"
                  >
                    View Cart
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="block w-full bg-white text-black py-3 rounded-lg text-center font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}