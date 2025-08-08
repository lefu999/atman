'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, X, ShoppingBag, ArrowLeft } from 'lucide-react'
import useCartStore from '../../store/cartStore'
import toast from 'react-hot-toast'

export default function CartPage() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore()
  const total = getTotalPrice()
  const shipping = total > 50 ? 0 : 10
  const finalTotal = total + shipping

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={64} className="text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">购物车是空的</h1>
          <p className="text-gray-400 mb-8">添加一些商品开始购物吧！</p>
          <Link
            href="/shop"
            className="inline-block bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            继续购物
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">购物车</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-gray-900 rounded-lg p-4 flex gap-4">
                  <div className="w-24 h-24 bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden">
                    {item.product.images[0] && (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-white font-semibold">{item.product.name}</h3>
                        <p className="text-gray-400 text-sm">{item.product.brand}</p>
                      </div>
                      <button
                        onClick={() => {
                          removeItem(item.id)
                          toast.success('商品已移除')
                        }}
                        className="text-gray-400 hover:text-white"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div className="text-sm text-gray-400 mb-2">
                      尺码: {item.size}, 颜色: {item.color}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="bg-gray-800 text-white p-1 rounded hover:bg-gray-700"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-white w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="bg-gray-800 text-white p-1 rounded hover:bg-gray-700"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <p className="text-white font-semibold">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-4">
              <Link
                href="/shop"
                className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                继续购物
              </Link>
              <button
                onClick={() => {
                  if (confirm('确定要清空购物车吗？')) {
                    clearCart()
                    toast.success('购物车已清空')
                  }
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                清空购物车
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">订单摘要</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-300">
                  <span>小计</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>运费</span>
                  <span>{shipping === 0 ? '免费' : `¥${shipping.toFixed(2)}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-sm text-gray-400">
                    还差 ¥{(299 - total).toFixed(2)} 元即可免运费
                  </p>
                )}
              </div>

              <div className="border-t border-gray-800 pt-4 mb-6">
                <div className="flex justify-between text-white text-lg font-semibold">
                  <span>总计</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                结账
              </button>

              <div className="mt-6">
                <h3 className="text-white font-semibold mb-2">支付方式</h3>
                <p className="text-gray-400 text-sm">
                  支持微信、支付宝、信用卡
                </p>
              </div>

              <div className="mt-4">
                <h3 className="text-white font-semibold mb-2">配送信息</h3>
                <p className="text-gray-400 text-sm">
                  标准配送: 5-7 个工作日<br />
                  快速配送: 2-3 个工作日
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}