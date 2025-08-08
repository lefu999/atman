'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Product } from '../types'
import { Heart, Eye } from 'lucide-react'
import { useState } from 'react'
import QuickAddButton from './QuickAddButton'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  return (
    <div 
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
        <Link href={`/product/${product.id}`} className="block">
          <div className="aspect-square relative bg-gray-700">
            {product.images[0] && (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
              />
            )}
            
            {isHovered && (
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    setIsWishlisted(!isWishlisted)
                  }}
                  className="bg-white p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Heart 
                    size={20} 
                    className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-black'}
                  />
                </button>
                <div className="bg-white p-2 rounded-full">
                  <Eye size={20} className="text-black" />
                </div>
              </div>
            )}
          </div>
        </Link>
        
        <div className="p-4">
          <Link href={`/product/${product.id}`}>
            <p className="text-sm text-gray-400 mb-1">{product.brand}</p>
            <h3 className="font-semibold text-white mb-2 group-hover:text-gray-300 transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 mb-2">{product.category}</p>
            <p className="font-bold text-white mb-3">${product.price}</p>
          </Link>
          
          {isHovered && (
            <QuickAddButton product={product} />
          )}
        </div>
      </div>
    </div>
  )
}