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
  XCircle,
  ChevronRight,
  Filter,
  Calendar,
  Search
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { mockProducts } from '@/data/products'

// 模拟订单数据
const mockOrders = [
  {
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
    address: '广东省深圳市南山区科技园南路88号'
  },
  {
    id: 'ORD002',
    date: '2024-12-28',
    total: 5998,
    status: 'shipping',
    items: [
      { productId: '2', quantity: 1, size: 'XL', color: '黑色', price: 2999 },
      { productId: '4', quantity: 1, size: 'L', color: '黑色', price: 2999 }
    ],
    trackingNumber: 'SF0987654321',
    address: '北京市朝阳区建国路100号'
  },
  {
    id: 'ORD003',
    date: '2025-01-02',
    total: 2899,
    status: 'processing',
    items: [
      { productId: '5', quantity: 1, size: 'M', color: '黑色', price: 2899 }
    ],
    trackingNumber: null,
    address: '上海市浦东新区陆家嘴金融中心'
  },
  {
    id: 'ORD004',
    date: '2025-01-05',
    total: 1999,
    status: 'cancelled',
    items: [
      { productId: '7', quantity: 1, size: 'L', color: '灰色', price: 1999 }
    ],
    trackingNumber: null,
    cancelReason: '商品缺货',
    address: '广州市天河区珠江新城'
  }
]

export default function OrdersPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { t, language } = useLanguage()
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [orders, setOrders] = useState(mockOrders)

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={20} className="text-green-400" />
      case 'shipping':
        return <Truck size={20} className="text-blue-400" />
      case 'processing':
        return <Clock size={20} className="text-yellow-400" />
      case 'cancelled':
        return <XCircle size={20} className="text-red-400" />
      default:
        return <Package size={20} className="text-gray-400" />
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500/20 text-green-400'
      case 'shipping':
        return 'bg-blue-500/20 text-blue-400'
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'cancelled':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getProductDetails = (productId: string) => {
    return mockProducts.find(p => p.id === productId) || {
      name: '商品已下架',
      image: '/images/placeholder.jpg'
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeft size={20} />
          <span>{language === 'zh' ? '返回账户中心' : 'Back to Account'}</span>
        </Link>

        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-8">
            {language === 'zh' ? '我的订单' : 'My Orders'}
          </h1>

          {/* 筛选栏 */}
          <div className="bg-gray-900 rounded-lg p-4 mb-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['all', 'processing', 'shipping', 'delivered', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedStatus === status
                        ? 'bg-white text-black'
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    {status === 'all' 
                      ? (language === 'zh' ? '全部' : 'All')
                      : getStatusText(status)}
                  </button>
                ))}
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder={language === 'zh' ? '搜索订单号或物流单号' : 'Search order or tracking number'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
            </div>
          </div>

          {/* 订单列表 */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-gray-900 rounded-lg p-12 text-center">
                <Package size={48} className="text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">
                  {language === 'zh' ? '暂无订单' : 'No orders found'}
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="bg-gray-900 rounded-lg overflow-hidden">
                  {/* 订单头部 */}
                  <div className="p-6 border-b border-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-white font-semibold">{order.id}</span>
                        <span className="text-gray-400 text-sm">{order.date}</span>
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            {getStatusText(order.status)}
                          </span>
                        </span>
                      </div>
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                      >
                        <span>{language === 'zh' ? '查看详情' : 'View Details'}</span>
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                    
                    {order.trackingNumber && (
                      <div className="mt-2 text-sm text-gray-500">
                        {language === 'zh' ? '物流单号：' : 'Tracking: '}{order.trackingNumber}
                      </div>
                    )}
                    
                    {order.cancelReason && (
                      <div className="mt-2 text-sm text-red-400">
                        {language === 'zh' ? '取消原因：' : 'Cancel Reason: '}{order.cancelReason}
                      </div>
                    )}
                  </div>

                  {/* 订单商品 */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item, index) => {
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
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* 订单底部 */}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-800">
                      <div className="text-sm text-gray-400">
                        {language === 'zh' ? '共' : 'Total'} {order.items.reduce((sum, item) => sum + item.quantity, 0)} {language === 'zh' ? '件商品' : 'items'}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">
                          {language === 'zh' ? '订单总额' : 'Order Total'}
                        </p>
                        <p className="text-xl font-bold text-white">¥{order.total}</p>
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex justify-end gap-3 mt-4">
                      {order.status === 'delivered' && (
                        <>
                          <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                            {language === 'zh' ? '申请售后' : 'After Sales'}
                          </button>
                          <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                            {language === 'zh' ? '评价' : 'Review'}
                          </button>
                        </>
                      )}
                      {order.status === 'shipping' && (
                        <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                          {language === 'zh' ? '查看物流' : 'Track Package'}
                        </button>
                      )}
                      {order.status === 'processing' && (
                        <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                          {language === 'zh' ? '取消订单' : 'Cancel Order'}
                        </button>
                      )}
                      {order.status === 'cancelled' && (
                        <button className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors">
                          {language === 'zh' ? '再次购买' : 'Buy Again'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}