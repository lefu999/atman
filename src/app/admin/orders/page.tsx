'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Filter,
  Download,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MoreVertical
} from 'lucide-react'

export default function OrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  const orders = [
    {
      id: 'ORD20250807001',
      customer: '张三',
      phone: '138****1234',
      items: 3,
      amount: 899,
      status: 'pending',
      statusText: '待发货',
      paymentMethod: '微信支付',
      createTime: '2025-08-07 10:30',
      address: '北京市朝阳区****'
    },
    {
      id: 'ORD20250807002',
      customer: '李四',
      phone: '139****5678',
      items: 2,
      amount: 599,
      status: 'shipped',
      statusText: '已发货',
      paymentMethod: '支付宝',
      createTime: '2025-08-07 09:15',
      address: '上海市浦东新区****',
      trackingNumber: 'SF1234567890'
    },
    {
      id: 'ORD20250807003',
      customer: '王五',
      phone: '136****9012',
      items: 1,
      amount: 299,
      status: 'pending',
      statusText: '待发货',
      paymentMethod: '微信支付',
      createTime: '2025-08-07 08:45',
      address: '广州市天河区****'
    },
    {
      id: 'ORD20250806004',
      customer: '赵六',
      phone: '137****3456',
      items: 4,
      amount: 1299,
      status: 'completed',
      statusText: '已完成',
      paymentMethod: '信用卡',
      createTime: '2025-08-06 15:20',
      address: '深圳市南山区****',
      trackingNumber: 'YT9876543210'
    },
    {
      id: 'ORD20250806005',
      customer: '陈七',
      phone: '135****7890',
      items: 2,
      amount: 499,
      status: 'canceled',
      statusText: '已取消',
      paymentMethod: '支付宝',
      createTime: '2025-08-06 14:10',
      address: '成都市武侯区****'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-700'
      case 'shipped': return 'bg-blue-100 text-blue-700'
      case 'completed': return 'bg-green-100 text-green-700'
      case 'canceled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} />
      case 'shipped': return <Truck size={16} />
      case 'completed': return <CheckCircle size={16} />
      case 'canceled': return <XCircle size={16} />
      default: return null
    }
  }

  const filteredOrders = orders.filter(order => {
    if (selectedStatus !== 'all' && order.status !== selectedStatus) return false
    if (searchQuery && !order.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !order.customer.includes(searchQuery)) return false
    return true
  })

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrders(filteredOrders.map(o => o.id))
    } else {
      setSelectedOrders([])
    }
  }

  const handleSelectOrder = (orderId: string) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId))
    } else {
      setSelectedOrders([...selectedOrders, orderId])
    }
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">订单管理</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Download size={20} />
          导出订单
        </button>
      </div>

      {/* 状态筛选 */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-2 rounded-lg ${selectedStatus === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              全部 ({orders.length})
            </button>
            <button
              onClick={() => setSelectedStatus('pending')}
              className={`px-4 py-2 rounded-lg ${selectedStatus === 'pending' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              待发货 ({orders.filter(o => o.status === 'pending').length})
            </button>
            <button
              onClick={() => setSelectedStatus('shipped')}
              className={`px-4 py-2 rounded-lg ${selectedStatus === 'shipped' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              已发货 ({orders.filter(o => o.status === 'shipped').length})
            </button>
            <button
              onClick={() => setSelectedStatus('completed')}
              className={`px-4 py-2 rounded-lg ${selectedStatus === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              已完成 ({orders.filter(o => o.status === 'completed').length})
            </button>
            <button
              onClick={() => setSelectedStatus('canceled')}
              className={`px-4 py-2 rounded-lg ${selectedStatus === 'canceled' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              已取消 ({orders.filter(o => o.status === 'canceled').length})
            </button>
          </div>

          <div className="flex-1">
            <div className="relative">
              <input
                type="search"
                placeholder="搜索订单号或客户名..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* 批量操作 */}
      {selectedOrders.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
          <span className="text-blue-700">已选择 {selectedOrders.length} 个订单</span>
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              批量发货
            </button>
            <button className="bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 border border-gray-300">
              取消选择
            </button>
          </div>
        </div>
      )}

      {/* 订单列表 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                订单号
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                客户信息
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                商品
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                金额
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                下单时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => handleSelectOrder(order.id)}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{order.id}</div>
                  {order.trackingNumber && (
                    <div className="text-xs text-gray-500">物流: {order.trackingNumber}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{order.customer}</div>
                  <div className="text-xs text-gray-500">{order.phone}</div>
                  <div className="text-xs text-gray-500">{order.address}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{order.items} 件</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">¥{order.amount}</div>
                  <div className="text-xs text-gray-500">{order.paymentMethod}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.statusText}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {order.createTime}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye size={18} />
                    </Link>
                    {order.status === 'pending' && (
                      <button className="text-green-600 hover:text-green-900">
                        <Truck size={18} />
                      </button>
                    )}
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          显示 <span className="font-medium">1</span> 到 <span className="font-medium">{filteredOrders.length}</span> 条，
          共 <span className="font-medium">{filteredOrders.length}</span> 条
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100">
            上一页
          </button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded-lg">
            1
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100">
            下一页
          </button>
        </div>
      </div>
    </div>
  )
}