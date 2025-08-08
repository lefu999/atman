'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  User, 
  MapPin, 
  Package, 
  Heart, 
  Settings, 
  LogOut,
  ChevronRight,
  Edit,
  Edit2,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Camera,
  Save,
  Mail,
  Phone,
  Calendar,
  Shield,
  Plus,
  Trash2,
  Check,
  Copy,
  ExternalLink,
  Filter,
  Search,
  ArrowLeft
} from 'lucide-react'
import { useAuth, Address } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { mockProducts } from '@/data/products'
import toast from 'react-hot-toast'

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
    address: {
      name: '王五',
      phone: '13700137000',
      detail: '上海市浦东新区陆家嘴金融中心'
    },
    payment: {
      method: '信用卡',
      time: '2025-01-02 09:45:00',
      amount: 2899
    },
    shipping: 20,
    discount: 0
  }
]

export default function AccountPage() {
  const router = useRouter()
  const { user, logout, addresses, updateProfile, changePassword, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuth()
  const { t, language } = useLanguage()
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedOrderStatus, setSelectedOrderStatus] = useState('all')
  const [orderSearchTerm, setOrderSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  
  // Profile form
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: ''
  })

  // Password form
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Address form
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    address: '',
    isDefault: false
  })

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    
    setProfileForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      birthDate: '',
      gender: ''
    })
  }, [user, router])

  if (!user) {
    return null
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={16} className="text-green-400" />
      case 'shipping':
        return <Truck size={16} className="text-blue-400" />
      case 'processing':
        return <Clock size={16} className="text-yellow-400" />
      case 'cancelled':
        return <XCircle size={16} className="text-red-400" />
      default:
        return <AlertCircle size={16} className="text-gray-400" />
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

  const filteredOrders = mockOrders.filter(order => {
    const matchesStatus = selectedOrderStatus === 'all' || order.status === selectedOrderStatus
    const matchesSearch = order.id.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
                          order.trackingNumber?.toLowerCase().includes(orderSearchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Profile handlers
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfile({
        name: profileForm.name,
        phone: profileForm.phone
      })
      setIsEditingProfile(false)
      toast.success(language === 'zh' ? '资料更新成功' : 'Profile updated successfully')
    } catch (error) {
      toast.error(language === 'zh' ? '更新失败' : 'Update failed')
    }
  }

  // Password handlers
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error(language === 'zh' ? '两次输入的密码不一致' : 'Passwords do not match')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error(language === 'zh' ? '密码至少6个字符' : 'Password must be at least 6 characters')
      return
    }

    setIsChangingPassword(true)
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword)
      setShowPasswordForm(false)
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error: any) {
      toast.error(error.message || (language === 'zh' ? '密码修改失败' : 'Failed to change password'))
    } finally {
      setIsChangingPassword(false)
    }
  }

  // Logout handler
  const handleLogout = () => {
    if (confirm(language === 'zh' ? '确定要退出登录吗？' : 'Are you sure you want to sign out?')) {
      logout()
    }
  }

  // Address handlers
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingAddressId) {
        await updateAddress(editingAddressId, addressForm)
        setEditingAddressId(null)
      } else {
        await addAddress(addressForm)
      }
      
      setShowAddressForm(false)
      setAddressForm({
        name: '',
        phone: '',
        province: '',
        city: '',
        district: '',
        address: '',
        isDefault: false
      })
    } catch (error) {
      toast.error(language === 'zh' ? '操作失败' : 'Operation failed')
    }
  }

  const handleEditAddress = (address: Address) => {
    setAddressForm({
      name: address.name,
      phone: address.phone,
      province: address.province,
      city: address.city,
      district: address.district,
      address: address.address,
      isDefault: address.isDefault
    })
    setEditingAddressId(address.id)
    setShowAddressForm(true)
  }

  const handleDeleteAddress = async (id: string) => {
    if (confirm(language === 'zh' ? '确定要删除这个地址吗？' : 'Are you sure to delete this address?')) {
      await deleteAddress(id)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success(language === 'zh' ? '已复制' : 'Copied')
  }

  const menuItems = [
    {
      id: 'overview',
      icon: User,
      label: language === 'zh' ? '账户总览' : 'Overview'
    },
    {
      id: 'profile',
      icon: Edit,
      label: language === 'zh' ? '个人资料' : 'Profile'
    },
    {
      id: 'addresses',
      icon: MapPin,
      label: language === 'zh' ? '收货地址' : 'Addresses',
      count: addresses.length
    },
    {
      id: 'orders',
      icon: Package,
      label: language === 'zh' ? '我的订单' : 'My Orders',
      count: mockOrders.length
    },
    {
      id: 'wishlist',
      icon: Heart,
      label: language === 'zh' ? '收藏夹' : 'Wishlist'
    },
    {
      id: 'settings',
      icon: Settings,
      label: language === 'zh' ? '账户设置' : 'Settings'
    }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            {/* 统计卡片 */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <Package className="text-blue-400" size={24} />
                  <span className="text-2xl font-bold text-white">
                    {mockOrders.length}
                  </span>
                </div>
                <p className="text-gray-400">
                  {language === 'zh' ? '总订单数' : 'Total Orders'}
                </p>
              </div>

              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <Truck className="text-green-400" size={24} />
                  <span className="text-2xl font-bold text-white">
                    {mockOrders.filter(o => o.status === 'shipping').length}
                  </span>
                </div>
                <p className="text-gray-400">
                  {language === 'zh' ? '配送中' : 'In Transit'}
                </p>
              </div>

              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <Heart className="text-red-400" size={24} />
                  <span className="text-2xl font-bold text-white">12</span>
                </div>
                <p className="text-gray-400">
                  {language === 'zh' ? '收藏商品' : 'Wishlisted'}
                </p>
              </div>
            </div>

            {/* 最近订单 */}
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {language === 'zh' ? '最近订单' : 'Recent Orders'}
                </h2>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  {language === 'zh' ? '查看全部' : 'View All'}
                </button>
              </div>

              <div className="space-y-4">
                {mockOrders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedOrder(order)
                      setActiveTab('orders')
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-white font-medium">{order.id}</span>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          <span className="text-sm text-gray-400">
                            {getStatusText(order.status)}
                          </span>
                        </div>
                      </div>
                      <span className="text-white font-semibold">
                        ¥{order.total}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{order.date}</span>
                      <span>
                        {order.items.reduce((sum: number, item: any) => sum + item.quantity, 0)} {language === 'zh' ? '件商品' : 'items'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )

      case 'profile':
        return (
          <div className="bg-gray-900 rounded-lg p-8">
            {/* 头像部分 */}
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-800">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <button className="absolute bottom-0 right-0 bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors">
                  <Camera size={16} />
                </button>
              </div>
              <div>
                <p className="text-white text-lg font-semibold">{user.name}</p>
                <p className="text-gray-400">{user.email}</p>
                <p className="text-gray-500 text-sm mt-1">
                  {language === 'zh' ? '会员ID：' : 'Member ID: '}{user.id}
                </p>
              </div>
            </div>

            {!isEditingProfile ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">
                    {language === 'zh' ? '基本信息' : 'Basic Information'}
                  </h3>
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Edit2 size={16} />
                    <span>{language === 'zh' ? '编辑' : 'Edit'}</span>
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 mb-2">
                      {language === 'zh' ? '姓名' : 'Name'}
                    </label>
                    <p className="text-white">{user.name}</p>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">
                      {language === 'zh' ? '邮箱' : 'Email'}
                    </label>
                    <p className="text-white">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">
                      {language === 'zh' ? '手机号' : 'Phone'}
                    </label>
                    <p className="text-white">{user.phone || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">
                      {language === 'zh' ? '注册时间' : 'Member Since'}
                    </label>
                    <p className="text-white">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {language === 'zh' ? '编辑信息' : 'Edit Information'}
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 mb-2">
                      {language === 'zh' ? '姓名' : 'Name'}
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-2">
                      {language === 'zh' ? '手机号' : 'Phone'}
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                      placeholder={language === 'zh' ? '请输入手机号' : 'Enter phone number'}
                      className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    {language === 'zh' ? '取消' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    <Save size={18} />
                    <span>{language === 'zh' ? '保存更改' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )

      case 'addresses':
        return (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {language === 'zh' ? '收货地址管理' : 'Manage Addresses'}
              </h2>
              
              {!showAddressForm && (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  <Plus size={18} />
                  <span>{language === 'zh' ? '添加新地址' : 'Add New Address'}</span>
                </button>
              )}
            </div>

            {/* 添加/编辑表单 */}
            {showAddressForm && (
              <div className="bg-gray-900 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {editingAddressId 
                    ? (language === 'zh' ? '编辑地址' : 'Edit Address')
                    : (language === 'zh' ? '添加新地址' : 'Add New Address')}
                </h3>
                
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 mb-2">
                        {language === 'zh' ? '收货人' : 'Recipient'}
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.name}
                        onChange={(e) => setAddressForm({...addressForm, name: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 mb-2">
                        {language === 'zh' ? '手机号' : 'Phone'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-400 mb-2">
                        {language === 'zh' ? '省份' : 'Province'}
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.province}
                        onChange={(e) => setAddressForm({...addressForm, province: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 mb-2">
                        {language === 'zh' ? '城市' : 'City'}
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 mb-2">
                        {language === 'zh' ? '区/县' : 'District'}
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.district}
                        onChange={(e) => setAddressForm({...addressForm, district: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-2">
                      {language === 'zh' ? '详细地址' : 'Detailed Address'}
                    </label>
                    <input
                      type="text"
                      required
                      value={addressForm.address}
                      onChange={(e) => setAddressForm({...addressForm, address: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={addressForm.isDefault}
                      onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})}
                      className="mr-2"
                    />
                    <label htmlFor="isDefault" className="text-gray-400">
                      {language === 'zh' ? '设为默认地址' : 'Set as default address'}
                    </label>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddressForm(false)
                        setEditingAddressId(null)
                        setAddressForm({
                          name: '',
                          phone: '',
                          province: '',
                          city: '',
                          district: '',
                          address: '',
                          isDefault: false
                        })
                      }}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      {language === 'zh' ? '取消' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                      {editingAddressId 
                        ? (language === 'zh' ? '保存更改' : 'Save Changes')
                        : (language === 'zh' ? '添加地址' : 'Add Address')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 地址列表 */}
            <div className="space-y-4">
              {addresses.length === 0 ? (
                <div className="bg-gray-900 rounded-lg p-12 text-center">
                  <MapPin size={48} className="text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">
                    {language === 'zh' ? '还没有添加收货地址' : 'No addresses added yet'}
                  </p>
                </div>
              ) : (
                addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`bg-gray-900 rounded-lg p-6 ${
                      address.isDefault ? 'ring-2 ring-green-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-white font-semibold">{address.name}</h3>
                          <span className="text-gray-400">{address.phone}</span>
                          {address.isDefault && (
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                              {language === 'zh' ? '默认' : 'Default'}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400">
                          {address.province}{address.city}{address.district}{address.address}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        {!address.isDefault && (
                          <button
                            onClick={() => setDefaultAddress(address.id)}
                            className="p-2 text-gray-400 hover:text-green-400 transition-colors"
                            title={language === 'zh' ? '设为默认' : 'Set as default'}
                          >
                            <Check size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleEditAddress(address)}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )

      case 'orders':
        return selectedOrder ? (
          // 订单详情视图
          <div>
            <button
              onClick={() => setSelectedOrder(null)}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
            >
              <ArrowLeft size={20} />
              <span>{language === 'zh' ? '返回订单列表' : 'Back to Orders'}</span>
            </button>

            <div className="bg-gray-900 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  {getStatusIcon(selectedOrder.status)}
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {getStatusText(selectedOrder.status)}
                    </h2>
                    <p className="text-gray-400">{selectedOrder.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(selectedOrder.id)}
                  className="text-gray-400 hover:text-white"
                >
                  <Copy size={16} />
                </button>
              </div>

              {selectedOrder.trackingNumber && (
                <div className="pt-4 border-t border-gray-700">
                  <p className="text-gray-400 text-sm">{language === 'zh' ? '物流单号' : 'Tracking Number'}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono">{selectedOrder.trackingNumber}</span>
                    <button
                      onClick={() => copyToClipboard(selectedOrder.trackingNumber)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 商品信息 */}
            <div className="bg-gray-900 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                {language === 'zh' ? '商品信息' : 'Order Items'}
              </h3>
              <div className="space-y-4">
                {selectedOrder.items.map((item: any, index: number) => {
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
            </div>

            {/* 支付信息 */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                {language === 'zh' ? '支付信息' : 'Payment Information'}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">{language === 'zh' ? '商品总额' : 'Subtotal'}</span>
                  <span className="text-white">
                    ¥{selectedOrder.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{language === 'zh' ? '运费' : 'Shipping'}</span>
                  <span className="text-white">
                    {selectedOrder.shipping === 0 ? (language === 'zh' ? '免运费' : 'Free') : `¥${selectedOrder.shipping}`}
                  </span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">{language === 'zh' ? '优惠' : 'Discount'}</span>
                    <span className="text-green-400">-¥{selectedOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-gray-800">
                  <span className="text-white font-semibold">{language === 'zh' ? '实付金额' : 'Total Paid'}</span>
                  <span className="text-xl font-bold text-white">¥{selectedOrder.total}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // 订单列表视图
          <>
            {/* 筛选栏 */}
            <div className="bg-gray-900 rounded-lg p-4 mb-6">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {['all', 'processing', 'shipping', 'delivered', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedOrderStatus(status)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedOrderStatus === status
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
                    placeholder={language === 'zh' ? '搜索订单号' : 'Search order'}
                    value={orderSearchTerm}
                    onChange={(e) => setOrderSearchTerm(e.target.value)}
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
                    <div className="p-6 border-b border-gray-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-white font-semibold">{order.id}</span>
                          <span className="text-gray-400 text-sm">{order.date}</span>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            <span className="text-sm text-gray-400">
                              {getStatusText(order.status)}
                            </span>
                          </span>
                        </div>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                        >
                          <span>{language === 'zh' ? '查看详情' : 'View Details'}</span>
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                          {order.items.reduce((sum: number, item: any) => sum + item.quantity, 0)} {language === 'zh' ? '件商品' : 'items'}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">
                            {language === 'zh' ? '订单总额' : 'Order Total'}
                          </p>
                          <p className="text-xl font-bold text-white">¥{order.total}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )

      case 'wishlist':
        return (
          <div className="bg-gray-900 rounded-lg p-12 text-center">
            <Heart size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">
              {language === 'zh' ? '收藏夹功能即将上线' : 'Wishlist feature coming soon'}
            </p>
          </div>
        )

      case 'settings':
        return (
          <div className="space-y-6">
            {/* 修改密码 */}
            <div className="bg-gray-900 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Shield className="text-gray-400" size={20} />
                {language === 'zh' ? '修改密码' : 'Change Password'}
              </h3>
              
              {showPasswordForm ? (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-gray-400 mb-2">
                      {language === 'zh' ? '当前密码' : 'Current Password'}
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      required
                      className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 mb-2">
                      {language === 'zh' ? '新密码' : 'New Password'}
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      required
                      minLength={6}
                      className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    <p className="text-gray-500 text-xs mt-1">
                      {language === 'zh' ? '密码至少6个字符' : 'At least 6 characters'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 mb-2">
                      {language === 'zh' ? '确认新密码' : 'Confirm New Password'}
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      required
                      className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false)
                        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
                      }}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      {language === 'zh' ? '取消' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={isChangingPassword}
                      className="px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isChangingPassword 
                        ? (language === 'zh' ? '修改中...' : 'Changing...')
                        : (language === 'zh' ? '确认修改' : 'Confirm')}
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <p className="text-gray-400 mb-4">
                    {language === 'zh' ? '定期修改密码以保护账户安全' : 'Change your password regularly for security'}
                  </p>
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    {language === 'zh' ? '修改密码' : 'Change Password'}
                  </button>
                </div>
              )}
            </div>

            {/* 账户操作 */}
            <div className="bg-gray-900 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-white mb-6">
                {language === 'zh' ? '账户操作' : 'Account Actions'}
              </h3>
              
              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">
                      {language === 'zh' ? '退出登录' : 'Sign Out'}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      {language === 'zh' ? '退出当前账户' : 'Sign out from your account'}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>{language === 'zh' ? '退出登录' : 'Sign Out'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* 头部 */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  {language === 'zh' ? `你好，${user.name}` : `Hello, ${user.name}`}
                </h1>
                <p className="text-gray-400">{user.email}</p>
                <p className="text-gray-500 text-sm mt-1">
                  {language === 'zh' ? '会员等级：' : 'Member Level: '}
                  <span className="text-amber-400">VIP</span>
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span>{language === 'zh' ? '退出登录' : 'Logout'}</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg p-4 sticky top-20">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id)
                      setSelectedOrder(null)
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg mb-2 transition-colors ${
                      activeTab === item.id
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.count !== undefined && item.count > 0 && (
                        <span className="bg-gray-700 text-xs px-2 py-1 rounded-full">
                          {item.count}
                        </span>
                      )}
                      <ChevronRight size={16} />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 主内容区 */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}