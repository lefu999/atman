'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft,
  Package,
  Truck,
  Clock,
  CheckCircle,
  MapPin,
  Phone,
  Copy,
  ExternalLink
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { mockProducts } from '@/data/products'
import toast from 'react-hot-toast'

// 模拟物流信息
const mockTrackingInfo = {
  'SF1234567890': [
    {
      time: '2024-12-28 16:23',
      status: '已签收',
      description: '您的快递已由本人签收，感谢使用顺丰速运',
      location: '广东省深圳市南山区'
    },
    {
      time: '2024-12-28 09:15',
      status: '派送中',
      description: '快递员正在为您派送，请保持电话畅通',
      location: '广东省深圳市南山区',
      courier: '张师傅 13800138000'
    },
    {
      time: '2024-12-27 14:30',
      status: '运输中',
      description: '快件已到达深圳南山营业点',
      location: '广东省深圳市'
    },
    {
      time: '2024-12-26 20:45',
      status: '运输中',
      description: '快件已从北京转运中心发出',
      location: '北京市'
    },
    {
      time: '2024-12-25 18:00',
      status: '已揽收',
      description: '顺丰速运已收取快件',
      location: '北京市朝阳区'
    }
  ],
  'SF0987654321': [
    {
      time: '2025-01-08 10:30',
      status: '派送中',
      description: '快递员正在为您派送，请保持电话畅通',
      location: '北京市朝阳区',
      courier: '李师傅 13900139000'
    },
    {
      time: '2025-01-08 08:00',
      status: '运输中',
      description: '快件已到达北京朝阳营业点',
      location: '北京市朝阳区'
    },
    {
      time: '2025-01-07 22:00',
      status: '运输中',
      description: '快件已从深圳转运中心发出',
      location: '广东省深圳市'
    },
    {
      time: '2025-01-07 15:00',
      status: '已揽收',
      description: '顺丰速运已收取快件',
      location: '广东省深圳市'
    }
  ]
}

// 模拟订单数据
const getOrderById = (id: string) => {
  const orders = {
    'ORD001': {
      id: 'ORD001',
      date: '2024-12-25',
      total: 3599,
      status: 'delivered',
      items: [
        { productId: '1', quantity: 2, size: 'L', color: '黑色', price: 1299 },
        { productId: '3', quantity: 1, size: 'M', color: '白色', price: 1001 }
      ],
      trackingNumber: 'SF1234567890',
      deliveryDate: '2024-12-28',
      address: {
        name: '张三',
        phone: '13800138000',
        detail: '广东省深圳市南山区科技园南路88号'
      },
      payment: {
        method: '微信支付',
        time: '2024-12-25 14:30:00',
        amount: 3599
      },
      shipping: 0,
      discount: 50
    },
    'ORD002': {
      id: 'ORD002',
      date: '2024-12-28',
      total: 5998,
      status: 'shipping',
      items: [
        { productId: '2', quantity: 1, size: 'XL', color: '黑色', price: 2999 },
        { productId: '4', quantity: 1, size: 'L', color: '黑色', price: 2999 }
      ],
      trackingNumber: 'SF0987654321',
      address: {
        name: '李四',
        phone: '13900139000',
        detail: '北京市朝阳区建国路100号'
      },
      payment: {
        method: '支付宝',
        time: '2024-12-28 10:15:00',
        amount: 5998
      },
      shipping: 0,
      discount: 0
    }
  }
  return orders[id as keyof typeof orders]
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const { t, language } = useLanguage()
  const [order, setOrder] = useState<any>(null)
  const [showTracking, setShowTracking] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    
    const orderData = getOrderById(params.id)
    if (orderData) {
      setOrder(orderData)
    } else {
      router.push('/account/orders')
    }
  }, [user, params.id, router])

  if (!user || !order) {
    return null
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={24} className="text-green-400" />
      case 'shipping':
        return <Truck size={24} className="text-blue-400" />
      case 'processing':
        return <Clock size={24} className="text-yellow-400" />
      default:
        return <Package size={24} className="text-gray-400" />
    }
  }

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: { zh: string; en: string } } = {
      delivered: { zh: '已完成', en: 'Delivered' },
      shipping: { zh: '配送中', en: 'Shipping' },
      processing: { zh: '处理中', en: 'Processing' },
      cancelled: { zh: '已取消', en: 'Cancelled' }
    }
    return language === 'zh' ? statusMap[status]?.zh : statusMap[status]?.en
  }

  const getProductDetails = (productId: string) => {
    return mockProducts.find(p => p.id === productId) || {
      name: '商品已下架',
      image: '/images/placeholder.jpg'
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success(language === 'zh' ? '已复制' : 'Copied')
  }

  const trackingInfo = order.trackingNumber ? mockTrackingInfo[order.trackingNumber as keyof typeof mockTrackingInfo] : []

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeft size={20} />
          <span>{language === 'zh' ? '返回订单列表' : 'Back to Orders'}</span>
        </Link>

        <div className="max-w-4xl mx-auto">
          {/* 订单状态 */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                {getStatusIcon(order.status)}
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {getStatusText(order.status)}
                  </h1>
                  <p className="text-gray-400">
                    {order.status === 'delivered' 
                      ? `${language === 'zh' ? '签收时间：' : 'Delivered on '}${order.deliveryDate}`
                      : language === 'zh' ? '预计2-3天内送达' : 'Expected in 2-3 days'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">{language === 'zh' ? '订单号' : 'Order ID'}</p>
                <div className="flex items-center gap-2">
                  <span className="text-white font-mono">{order.id}</span>
                  <button
                    onClick={() => copyToClipboard(order.id)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </div>

            {order.trackingNumber && (
              <div className="pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{language === 'zh' ? '物流单号' : 'Tracking Number'}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-mono">{order.trackingNumber}</span>
                      <button
                        onClick={() => copyToClipboard(order.trackingNumber)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTracking(!showTracking)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <Truck size={18} />
                    <span>{language === 'zh' ? '查看物流' : 'Track Package'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 物流跟踪信息 */}
          {showTracking && trackingInfo.length > 0 && (
            <div className="bg-gray-900 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                {language === 'zh' ? '物流信息' : 'Tracking Information'}
              </h2>
              <div className="relative">
                <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-700"></div>
                <div className="space-y-6">
                  {trackingInfo.map((info, index) => (
                    <div key={index} className="relative flex gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                        index === 0 ? 'bg-green-500' : 'bg-gray-700'
                      }`}>
                        {index === 0 ? (
                          <CheckCircle size={16} className="text-white" />
                        ) : (
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className={`font-medium ${index === 0 ? 'text-green-400' : 'text-white'}`}>
                              {info.status}
                            </p>
                            <p className="text-gray-400 text-sm mt-1">{info.description}</p>
                            {info.courier && (
                              <p className="text-blue-400 text-sm mt-1">
                                {language === 'zh' ? '配送员：' : 'Courier: '}{info.courier}
                              </p>
                            )}
                            <p className="text-gray-500 text-xs mt-1">{info.location}</p>
                          </div>
                          <span className="text-gray-500 text-xs">{info.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 收货信息 */}
          <div className="bg-gray-900 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              {language === 'zh' ? '收货信息' : 'Delivery Information'}
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-gray-400" />
                <span className="text-gray-300">{order.address.detail}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-gray-400" />
                <span className="text-gray-300">
                  {order.address.name} {order.address.phone}
                </span>
              </div>
            </div>
          </div>

          {/* 商品信息 */}
          <div className="bg-gray-900 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              {language === 'zh' ? '商品信息' : 'Order Items'}
            </h2>
            <div className="space-y-4">
              {order.items.map((item: any, index: number) => {
                const product = getProductDetails(item.productId)
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{product.name}</h3>
                      <p className="text-gray-400 text-sm">
                        {item.size} / {item.color} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">¥{item.price}</p>
                      <p className="text-gray-500 text-sm">× {item.quantity}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 支付信息 */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              {language === 'zh' ? '支付信息' : 'Payment Information'}
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">{language === 'zh' ? '商品总额' : 'Subtotal'}</span>
                <span className="text-white">
                  ¥{order.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{language === 'zh' ? '运费' : 'Shipping'}</span>
                <span className="text-white">
                  {order.shipping === 0 ? (language === 'zh' ? '免运费' : 'Free') : `¥${order.shipping}`}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">{language === 'zh' ? '优惠' : 'Discount'}</span>
                  <span className="text-green-400">-¥{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-gray-800">
                <span className="text-white font-semibold">{language === 'zh' ? '实付金额' : 'Total Paid'}</span>
                <span className="text-xl font-bold text-white">¥{order.total}</span>
              </div>
              <div className="pt-3 border-t border-gray-800 text-sm">
                <p className="text-gray-400">
                  {language === 'zh' ? '支付方式：' : 'Payment Method: '}
                  <span className="text-gray-300">{order.payment.method}</span>
                </p>
                <p className="text-gray-400">
                  {language === 'zh' ? '支付时间：' : 'Payment Time: '}
                  <span className="text-gray-300">{order.payment.time}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}