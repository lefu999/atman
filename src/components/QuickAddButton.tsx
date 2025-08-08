'use client'

import { useState } from 'react'
import { ShoppingBag, Plus } from 'lucide-react'
import useCartStore from '../store/cartStore'
import { Product } from '../types'
import toast from 'react-hot-toast'

interface QuickAddButtonProps {
  product: Product
}

export default function QuickAddButton({ product }: QuickAddButtonProps) {
  const [showOptions, setShowOptions] = useState(false)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const addItem = useCartStore((state) => state.addItem)

  const handleQuickAdd = () => {
    if (!selectedSize || !selectedColor) {
      setShowOptions(true)
      return
    }

    addItem(product, selectedSize, selectedColor, 1)
    toast.success(`${product.name} added to cart!`)
    setShowOptions(false)
    setSelectedSize('')
    setSelectedColor('')
  }

  return (
    <div className="relative">
      {showOptions && (
        <div className="absolute bottom-full left-0 right-0 bg-gray-800 p-3 rounded-lg mb-2 z-10">
          <div className="mb-2">
            <p className="text-xs text-gray-400 mb-1">Size</p>
            <div className="flex gap-1 flex-wrap">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-2 py-1 text-xs rounded ${
                    selectedSize === size
                      ? 'bg-white text-black'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Color</p>
            <div className="flex gap-1 flex-wrap">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-2 py-1 text-xs rounded ${
                    selectedColor === color
                      ? 'bg-white text-black'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <button
        onClick={handleQuickAdd}
        className="w-full bg-white text-black py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={16} />
        Quick Add
      </button>
    </div>
  )
}