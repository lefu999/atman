'use client'

import { useState, useEffect } from 'react'
import {
  ShoppingBag,
  TrendingUp,
  Users,
  DollarSign,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Box,
  FileText
} from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 156,
    totalRevenue: 45680,
    totalCustomers: 89,
    pendingOrders: 12,
    todayOrders: 8,
    todayRevenue: 3299,
    completedOrders: 132,
    canceledOrders: 12
  })

  const recentOrders = [
    { id: 'ORD001', customer: '张三', amount: 599, status: '待发货', time: '10分钟前' },
    { id: 'ORD002', customer: '李四', amount: 1299, status: '已发货', time: '30分钟前' },
    { id: 'ORD003', customer: '王五', amount: 399, status: '待发货', time: '1小时前' },
    { id: 'ORD004', customer: '赵六', amount: 899, status: '已完成', time: '2小时前' },
    { id: 'ORD005', customer: '陈七', amount: 299, status: '待发货', time: '3小时前' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">仪表盘</h1>
        <p className="text-gray-600 mt-2">欢迎回到 ATMAN 管理后台</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">今日订单</p>
              <p className="text-2xl font-bold text-gray-900">{stats.todayOrders}</p>
              <p className="text-sm text-green-600 mt-1">+12% 较昨日</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <ShoppingBag className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">今日收入</p>
              <p className="text-2xl font-bold text-gray-900">¥{stats.todayRevenue}</p>
              <p className="text-sm text-green-600 mt-1">+8% 较昨日</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">待发货订单</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
              <p className="text-sm text-orange-600 mt-1">需要处理</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Package className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">总客户数</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
              <p className="text-sm text-blue-600 mt-1">+5 本周新增</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* 订单状态概览 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">订单状态分布</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="text-orange-500" size={20} />
                <span className="text-gray-700">待处理</span>
              </div>
              <span className="font-semibold">{stats.pendingOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-500" size={20} />
                <span className="text-gray-700">已完成</span>
              </div>
              <span className="font-semibold">{stats.completedOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="text-red-500" size={20} />
                <span className="text-gray-700">已取消</span>
              </div>
              <span className="font-semibold">{stats.canceledOrders}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">最近订单</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-gray-600">订单号</th>
                  <th className="text-left py-2 text-gray-600">客户</th>
                  <th className="text-left py-2 text-gray-600">金额</th>
                  <th className="text-left py-2 text-gray-600">状态</th>
                  <th className="text-left py-2 text-gray-600">时间</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 text-blue-600 font-medium">{order.id}</td>
                    <td className="py-3">{order.customer}</td>
                    <td className="py-3">¥{order.amount}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === '待发货' ? 'bg-orange-100 text-orange-700' :
                        order.status === '已发货' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">{order.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 快速操作 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors">
            <Package className="mx-auto mb-2 text-blue-600" size={24} />
            <span className="text-sm text-gray-700">处理订单</span>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
            <Truck className="mx-auto mb-2 text-green-600" size={24} />
            <span className="text-sm text-gray-700">批量发货</span>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
            <Box className="mx-auto mb-2 text-purple-600" size={24} />
            <span className="text-sm text-gray-700">添加商品</span>
          </button>
          <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors">
            <FileText className="mx-auto mb-2 text-orange-600" size={24} />
            <span className="text-sm text-gray-700">生成报表</span>
          </button>
        </div>
      </div>
    </div>
  )
}