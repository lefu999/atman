'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  TrendingUp,
  Settings,
  Truck,
  FileText,
  Box
} from 'lucide-react'

const menuItems = [
  { href: '/admin', label: '仪表盘', icon: LayoutDashboard },
  { href: '/admin/orders', label: '订单管理', icon: ShoppingBag },
  { href: '/admin/shipping', label: '发货管理', icon: Truck },
  { href: '/admin/products', label: '商品管理', icon: Box },
  { href: '/admin/customers', label: '客户管理', icon: Users },
  { href: '/admin/analytics', label: '数据分析', icon: TrendingUp },
  { href: '/admin/reports', label: '报表', icon: FileText },
  { href: '/admin/settings', label: '设置', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-gray-900 min-h-screen">
      <nav className="p-4">
        <div className="mb-8">
          <h2 className="text-white text-2xl font-bold">ATMAN 管理后台</h2>
        </div>
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}