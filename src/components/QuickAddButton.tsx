'use client'

import { useState, useEffect } from 'react'
import { ShoppingBag, Plus } from 'lucide-react'
import useCartStore from '../store/cartStore'
import { Product } from '../types'
import toast from 'react-hot-toast'
import { useLanguage } from '../contexts/LanguageContext'

interface QuickAddButtonProps {
  product: Product
}

export default function QuickAddButton({ product }: QuickAddButtonProps) {
  const [showOptions, setShowOptions] = useState(false)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const addItem = useCartStore((state) => state.addItem)
  const { t, language } = useLanguage()

  // 设置默认值
  useEffect(() => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setSelectedSize(product.sizes[0])
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setSelectedColor(product.colors[0])
    }
  }, [product, selectedSize, selectedColor])

  const handleQuickAdd = () => {
    // 如果没有尺码或颜色选项，直接使用默认值
    const size = selectedSize || (product.sizes && product.sizes[0]) || 'One Size'
    const color = selectedColor || (product.colors && product.colors[0]) || 'Default'

    addItem(product, size, color, 1)
    toast.success(`${product.name} ${language === 'zh' ? '已添加到购物车' : 'added to cart'}!`)
    setShowOptions(false)
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
        {language === 'zh' ? '快速添加' : 'Quick Add'}
      </button>
    </div>
  )
}