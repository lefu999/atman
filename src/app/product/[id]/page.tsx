'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Minus, Plus, Heart, ShoppingBag, Check } from 'lucide-react'
import useCartStore from '../../../store/cartStore'
import { Product } from '../../../types'
import Link from 'next/link'
import { mockProducts } from '../../../data/products'
import toast from 'react-hot-toast'

export default function ProductPage() {
  const params = useParams()
  const addItem = useCartStore((state) => state.addItem)
  
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    const foundProduct = mockProducts.find(p => p.id === params.id)
    if (foundProduct) {
      setProduct(foundProduct)
      setSelectedSize(foundProduct.sizes[0])
      setSelectedColor(foundProduct.colors[0])
    }
  }, [params.id])

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-white">商品未找到</p>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('请选择尺码')
      return
    }
    if (!selectedColor) {
      toast.error('请选择颜色')
      return
    }
    
    addItem(product, selectedSize, selectedColor, quantity)
    toast.success(
      <div className="flex items-center gap-2">
        <Check size={16} />
        <span>{product.name} 已加入购物车！</span>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li><Link href="/" className="text-gray-400 hover:text-white">首页</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link href="/shop" className="text-gray-400 hover:text-white">商店</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-white">{product.name}</li>
          </ol>
        </nav>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden mb-4">
              {product.images[currentImageIndex] && (
                <Image
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              )}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>
            <div className="flex gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative w-20 h-20 bg-gray-800 rounded-lg overflow-hidden ${
                    index === currentImageIndex ? 'ring-2 ring-white' : ''
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
            <p className="text-gray-400 mb-4">{product.brand}</p>
            <p className="text-3xl font-bold text-white mb-6">${product.price}</p>
            
            <p className="text-gray-300 mb-8">{product.description}</p>

            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">尺码</h3>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border ${
                      selectedSize === size
                        ? 'bg-white text-black border-white'
                        : 'bg-transparent text-white border-gray-600 hover:border-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">颜色</h3>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border ${
                      selectedColor === color
                        ? 'bg-white text-black border-white'
                        : 'bg-transparent text-white border-gray-600 hover:border-white'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-white font-semibold mb-3">数量</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-700"
                >
                  <Minus size={20} />
                </button>
                <span className="text-white text-xl w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-700"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag size={20} />
                加入购物车
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-3 rounded-lg border ${
                  isWishlisted
                    ? 'bg-red-500 text-white border-red-500'
                    : 'bg-transparent text-white border-gray-600 hover:border-white'
                }`}
              >
                <Heart size={24} fill={isWishlisted ? 'white' : 'none'} />
              </button>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <h3 className="text-white font-semibold mb-4">商品详情</h3>
              <dl className="space-y-2">
                {product.material && (
                  <>
                    <dt className="text-gray-400">材质</dt>
                    <dd className="text-white mb-3">{product.material}</dd>
                  </>
                )}
                {product.fit && (
                  <>
                    <dt className="text-gray-400">版型</dt>
                    <dd className="text-white mb-3">{product.fit}</dd>
                  </>
                )}
                {product.care_instructions && (
                  <>
                    <dt className="text-gray-400">洗涤说明</dt>
                    <dd className="text-white">{product.care_instructions}</dd>
                  </>
                )}
              </dl>
            </div>

            <div className="border-t border-gray-800 pt-6 mt-6">
              <h3 className="text-white font-semibold mb-4">尺码与版型</h3>
              <p className="text-gray-300 mb-2">模特穿着：M码</p>
              <p className="text-gray-300">模特身高：185cm</p>
              <Link href="/size-guide" className="text-white underline mt-2 inline-block">
                查看尺码表
              </Link>
            </div>

            <div className="border-t border-gray-800 pt-6 mt-6">
              <h3 className="text-white font-semibold mb-4">配送与退换</h3>
              <p className="text-gray-300">
                满299元包邮，支持30天无理由退换货。
              </p>
            </div>
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-8">你可能也喜欢</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-4">
                <div className="aspect-square bg-gray-700 rounded-lg mb-4" />
                <h3 className="text-white font-semibold">相关商品</h3>
                <p className="text-gray-400">¥299</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}