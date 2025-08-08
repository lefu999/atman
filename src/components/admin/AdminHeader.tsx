'use client'

import { Bell, User, LogOut, Search } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function AdminHeader() {
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            <div className="relative w-96">
              <input
                type="search"
                placeholder="搜索订单..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <Bell size={20} />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 text-gray-600 hover:text-gray-900"
              >
                <User size={20} />
                <span>管理员</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <Link
                    href="/admin/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    个人资料
                  </Link>
                  <Link
                    href="/admin/settings"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    设置
                  </Link>
                  <hr className="my-2" />
                  <button
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    退出登录
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}