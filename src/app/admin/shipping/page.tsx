'use client'

import { useState } from 'react'
import {
  Package,
  Truck,
  Search,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Printer
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function ShippingPage() {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [shippingCompany, setShippingCompany] = useState('sf-express')
  const [bulkTrackingNumbers, setBulkTrackingNumbers] = useState('')

  const pendingOrders = [
    {
      id: 'ORD20250807001',
      customer: '张三',
      phone: '138****1234',
      address: '北京市朝阳区建国路88号',
      items: [
        { name: '经典印花T恤', quantity: 2, size: 'L' },
        { name: '复古棒球帽', quantity: 1, size: '均码' }
      ],
      weight: '0.5kg',
      amount: 899,
      createTime: '2025-08-07 10:30',
      note: ''
    },
    {
      id: 'ORD20250807003',
      customer: '王五',
      phone: '136****9012',
      address: '广州市天河区珠江新城',
      items: [
        { name: '街头风连帽卫衣', quantity: 1, size: 'XL' }
      ],
      weight: '0.8kg',
      amount: 599,
      createTime: '2025-08-07 08:45',
      note: '请尽快发货'
    },
    {
      id: 'ORD20250807006',
      customer: '刘七',
      phone: '139****5678',
      address: '上海市浦东新区陆家嘴',
      items: [
        { name: '工装束脚裤', quantity: 1, size: '32' },
        { name: '立体logo短袖', quantity: 2, size: 'M' }
      ],
      weight: '1.2kg',
      amount: 1157,
      createTime: '2025-08-07 14:20',
      note: ''
    }
  ]

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrders(pendingOrders.map(o => o.id))
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

  const handleBatchShip = () => {
    if (selectedOrders.length === 0) {
      toast.error('请选择要发货的订单')
      return
    }
    
    if (!bulkTrackingNumbers) {
      toast.error('请输入运单号')
      return
    }

    // 处理批量发货逻辑
    toast.success(`成功发货 ${selectedOrders.length} 个订单`)
    setSelectedOrders([])
    setBulkTrackingNumbers('')
  }

  const handlePrintLabels = () => {
    if (selectedOrders.length === 0) {
      toast.error('请选择要打印的订单')
      return
    }
    toast.success('正在生成面单...')
  }

  const handleImportTracking = () => {
    // 处理导入运单号
    toast.success('运单号导入成功')
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">发货管理</h1>
        <p className="text-gray-600 mt-1">待发货订单: {pendingOrders.length} 个</p>
      </div>

      {/* 操作栏 */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-3">
            <select
              value={shippingCompany}
              onChange={(e) => setShippingCompany(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="sf-express">顺丰速运</option>
              <option value="jd">京东物流</option>
              <option value="yto">圆通速递</option>
              <option value="zto">中通快递</option>
              <option value="sto">申通快递</option>
              <option value="yunda">韵达快递</option>
              <option value="ems">EMS</option>
            </select>

            <button
              onClick={handlePrintLabels}
              className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center gap-2"
            >
              <Printer size={18} />
              打印面单
            </button>

            <button
              onClick={handleImportTracking}
              className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center gap-2"
            >
              <Upload size={18} />
              导入运单号
            </button>

            <button className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center gap-2">
              <Download size={18} />
              导出发货单
            </button>
          </div>

          <div className="relative">
            <input
              type="search"
              placeholder="搜索订单..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>
      </div>

      {/* 批量操作区 */}
      {selectedOrders.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-blue-700 font-medium">
              已选择 {selectedOrders.length} 个订单
            </span>
            <button
              onClick={() => setSelectedOrders([])}
              className="text-blue-600 hover:text-blue-700"
            >
              取消选择
            </button>
          </div>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                批量输入运单号（每行一个，按订单顺序对应）
              </label>
              <textarea
                value={bulkTrackingNumbers}
                onChange={(e) => setBulkTrackingNumbers(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="SF1234567890&#10;SF1234567891&#10;SF1234567892"
              />
            </div>
            <button
              onClick={handleBatchShip}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Truck size={18} />
              批量发货
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
                  checked={selectedOrders.length === pendingOrders.length && pendingOrders.length > 0}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                订单信息
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                收货信息
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                商品明细
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                重量
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                运单号
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pendingOrders.map((order) => (
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
                  <div className="text-xs text-gray-500">{order.createTime}</div>
                  {order.note && (
                    <div className="text-xs text-orange-600 flex items-center gap-1 mt-1">
                      <AlertCircle size={12} />
                      {order.note}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{order.customer}</div>
                  <div className="text-xs text-gray-500">{order.phone}</div>
                  <div className="text-xs text-gray-500">{order.address}</div>
                </td>
                <td className="px-6 py-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="text-sm text-gray-700">
                      {item.name} × {item.quantity} ({item.size})
                    </div>
                  ))}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">{order.weight}</span>
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    placeholder="输入运单号"
                    className="w-32 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button className="text-blue-600 hover:text-blue-700">
                      <Truck size={18} />
                    </button>
                    <button className="text-gray-600 hover:text-gray-700">
                      <Printer size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 发货提示 */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">发货注意事项：</p>
            <ul className="list-disc list-inside space-y-1">
              <li>请确保商品包装完好，避免运输损坏</li>
              <li>核对收货地址和联系电话，确保信息准确</li>
              <li>及时录入运单号，方便客户查询物流</li>
              <li>特殊商品请做好防护措施</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}