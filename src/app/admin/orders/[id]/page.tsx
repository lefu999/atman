'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  Phone,
  CreditCard,
  Truck,
  Clock,
  CheckCircle,
  Edit,
  Save,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [isEditingTracking, setIsEditingTracking] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingCompany, setTrackingCompany] = useState('sf-express')

  // 模拟订单数据
  const order = {
    id: params.id,
    status: 'pending',
    statusText: '待发货',
    createTime: '2025-08-07 10:30:25',
    payTime: '2025-08-07 10:31:05',
    customer: {
      name: '张三',
      phone: '13812341234',
      email: 'zhangsan@example.com',
      address: '北京市朝阳区建国路88号SOHO现代城A座1201室'
    },
    payment: {
      method: '微信支付',
      transactionId: 'WX20250807103105001',
      amount: 899,
      shipping: 0,
      discount: 10,
      total: 889
    },
    items: [
      {
        id: '1',
        name: '经典印花T恤',
        image: '/images/微信图片_20250807103227_717.jpg',
        size: 'L',
        color: '黑色',
        price: 299,
        quantity: 2,
        subtotal: 598
      },
      {
        id: '2',
        name: '复古棒球帽',
        image: '/images/微信图片_20250807103300_719.jpg',
        size: '均码',
        color: '藏青',
        price: 199,
        quantity: 1,
        subtotal: 199
      }
    ],
    shipping: {
      company: '',
      trackingNumber: '',
      status: []
    },
    timeline: [
      { time: '2025-08-07 10:31:05', event: '订单支付成功', description: '客户已完成支付' },
      { time: '2025-08-07 10:30:25', event: '订单创建', description: '客户提交订单' }
    ]
  }

  const handleUpdateStatus = (newStatus: string) => {
    toast.success(`订单状态已更新为: ${newStatus}`)
  }

  const handleSaveTracking = () => {
    if (!trackingNumber) {
      toast.error('请输入物流单号')
      return
    }
    setIsEditingTracking(false)
    toast.success('物流信息已更新')
  }

  const shippingCompanies = [
    { value: 'sf-express', label: '顺丰速运' },
    { value: 'jd', label: '京东物流' },
    { value: 'yto', label: '圆通速递' },
    { value: 'zto', label: '中通快递' },
    { value: 'sto', label: '申通快递' },
    { value: 'yunda', label: '韵达快递' },
    { value: 'ems', label: 'EMS' }
  ]

  return (
    <div>
      {/* 头部 */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">订单详情</h1>
            <p className="text-gray-600">订单号: {order.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            打印订单
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            导出PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧主要信息 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 订单状态 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">订单状态</h2>
            <div className="flex items-center gap-4 mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full">
                <Clock size={16} />
                {order.statusText}
              </span>
              <select
                onChange={(e) => handleUpdateStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">更改状态</option>
                <option value="shipped">标记为已发货</option>
                <option value="completed">标记为已完成</option>
                <option value="canceled">取消订单</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              <p>下单时间: {order.createTime}</p>
              <p>支付时间: {order.payTime}</p>
            </div>
          </div>

          {/* 商品信息 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">商品信息</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      尺码: {item.size} | 颜色: {item.color}
                    </p>
                    <div className="flex justify-between mt-2">
                      <span className="text-sm">¥{item.price} × {item.quantity}</span>
                      <span className="font-medium">¥{item.subtotal}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span>商品小计</span>
                <span>¥{order.payment.amount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>运费</span>
                <span>{order.payment.shipping === 0 ? '免运费' : `¥${order.payment.shipping}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>优惠</span>
                <span className="text-red-600">-¥{order.payment.discount}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>总计</span>
                <span>¥{order.payment.total}</span>
              </div>
            </div>
          </div>

          {/* 物流信息 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">物流信息</h2>
              {!isEditingTracking ? (
                <button
                  onClick={() => setIsEditingTracking(true)}
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Edit size={16} />
                  编辑
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveTracking}
                    className="text-green-600 hover:text-green-700 flex items-center gap-1"
                  >
                    <Save size={16} />
                    保存
                  </button>
                  <button
                    onClick={() => setIsEditingTracking(false)}
                    className="text-gray-600 hover:text-gray-700 flex items-center gap-1"
                  >
                    <X size={16} />
                    取消
                  </button>
                </div>
              )}
            </div>
            
            {!isEditingTracking ? (
              <div>
                {order.shipping.trackingNumber ? (
                  <div>
                    <p className="text-gray-600">物流公司: {order.shipping.company}</p>
                    <p className="text-gray-600">运单号: {order.shipping.trackingNumber}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">暂无物流信息</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    物流公司
                  </label>
                  <select
                    value={trackingCompany}
                    onChange={(e) => setTrackingCompany(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {shippingCompanies.map((company) => (
                      <option key={company.value} value={company.value}>
                        {company.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    运单号
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="请输入运单号"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 右侧信息 */}
        <div className="space-y-6">
          {/* 客户信息 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User size={20} />
              客户信息
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">姓名</p>
                <p className="font-medium">{order.customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Phone size={14} />
                  电话
                </p>
                <p className="font-medium">{order.customer.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin size={14} />
                  收货地址
                </p>
                <p className="font-medium">{order.customer.address}</p>
              </div>
            </div>
          </div>

          {/* 支付信息 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard size={20} />
              支付信息
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">支付方式</p>
                <p className="font-medium">{order.payment.method}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">交易单号</p>
                <p className="font-medium text-xs">{order.payment.transactionId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">支付金额</p>
                <p className="font-medium text-lg">¥{order.payment.total}</p>
              </div>
            </div>
          </div>

          {/* 订单时间线 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">订单时间线</h2>
            <div className="space-y-4">
              {order.timeline.map((event, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    {index < order.timeline.length - 1 && (
                      <div className="w-0.5 h-12 bg-gray-300 mt-1"></div>
                    )}
                  </div>
                  <div className="flex-1 -mt-1">
                    <p className="font-medium text-sm">{event.event}</p>
                    <p className="text-xs text-gray-600">{event.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}