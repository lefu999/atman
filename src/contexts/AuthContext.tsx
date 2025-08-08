'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  createdAt: string
}

export interface Address {
  id: string
  userId: string
  name: string
  phone: string
  province: string
  city: string
  district: string
  address: string
  isDefault: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  addresses: Address[]
  addAddress: (address: Omit<Address, 'id' | 'userId'>) => Promise<void>
  updateAddress: (id: string, address: Partial<Address>) => Promise<void>
  deleteAddress: (id: string) => Promise<void>
  setDefaultAddress: (id: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 模拟用户数据
const mockUsers: { [key: string]: User & { password: string } } = {
  'test@example.com': {
    id: '1',
    email: 'test@example.com',
    password: '123456',
    name: '张三',
    phone: '13800138000',
    avatar: '/images/avatar.jpg',
    createdAt: '2024-01-01'
  }
}

// 模拟地址数据
const mockAddresses: Address[] = [
  {
    id: '1',
    userId: '1',
    name: '张三',
    phone: '13800138000',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    address: '科技园南路88号',
    isDefault: true
  },
  {
    id: '2',
    userId: '1',
    name: '李四',
    phone: '13900139000',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    address: '建国路100号',
    isDefault: false
  }
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [addresses, setAddresses] = useState<Address[]>([])
  const router = useRouter()

  useEffect(() => {
    // 检查本地存储的用户信息
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      // 加载用户地址
      const userAddresses = mockAddresses.filter(addr => addr.userId === userData.id)
      setAddresses(userAddresses)
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const mockUser = mockUsers[email]
    
    if (!mockUser || mockUser.password !== password) {
      throw new Error('邮箱或密码错误')
    }

    const { password: _, ...userData } = mockUser
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    
    // 加载用户地址
    const userAddresses = mockAddresses.filter(addr => addr.userId === userData.id)
    setAddresses(userAddresses)
    
    toast.success('登录成功')
    router.push('/account')
  }

  const register = async (email: string, password: string, name: string) => {
    // 检查邮箱是否已存在
    if (mockUsers[email]) {
      throw new Error('该邮箱已被注册')
    }

    // 创建新用户
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      createdAt: new Date().toISOString()
    }

    // 保存到模拟数据库
    mockUsers[email] = {
      ...newUser,
      password
    }

    setUser(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
    
    toast.success('注册成功')
    router.push('/account')
  }

  const logout = () => {
    setUser(null)
    setAddresses([])
    localStorage.removeItem('user')
    toast.success('已退出登录')
    router.push('/')
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...data }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    
    // 更新模拟数据库
    if (mockUsers[user.email]) {
      mockUsers[user.email] = {
        ...mockUsers[user.email],
        ...data
      }
    }
    
    toast.success('个人资料已更新')
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) {
      throw new Error('请先登录')
    }

    const mockUser = mockUsers[user.email]
    
    if (!mockUser || mockUser.password !== currentPassword) {
      throw new Error('当前密码错误')
    }

    // 更新密码
    mockUsers[user.email].password = newPassword
    
    toast.success('密码修改成功')
  }

  const addAddress = async (address: Omit<Address, 'id' | 'userId'>) => {
    if (!user) return

    const newAddress: Address = {
      ...address,
      id: Date.now().toString(),
      userId: user.id
    }

    // 如果是第一个地址或设置为默认，更新其他地址
    if (address.isDefault || addresses.length === 0) {
      setAddresses(prev => [
        ...prev.map(addr => ({ ...addr, isDefault: false })),
        { ...newAddress, isDefault: true }
      ])
    } else {
      setAddresses(prev => [...prev, newAddress])
    }

    toast.success('地址添加成功')
  }

  const updateAddress = async (id: string, address: Partial<Address>) => {
    setAddresses(prev => {
      const updated = prev.map(addr => {
        if (addr.id === id) {
          return { ...addr, ...address }
        }
        // 如果更新的地址设为默认，取消其他默认地址
        if (address.isDefault && addr.isDefault) {
          return { ...addr, isDefault: false }
        }
        return addr
      })
      return updated
    })
    
    toast.success('地址更新成功')
  }

  const deleteAddress = async (id: string) => {
    const addressToDelete = addresses.find(addr => addr.id === id)
    
    if (addressToDelete?.isDefault && addresses.length > 1) {
      // 如果删除的是默认地址，将第一个其他地址设为默认
      setAddresses(prev => {
        const filtered = prev.filter(addr => addr.id !== id)
        if (filtered.length > 0) {
          filtered[0].isDefault = true
        }
        return filtered
      })
    } else {
      setAddresses(prev => prev.filter(addr => addr.id !== id))
    }
    
    toast.success('地址删除成功')
  }

  const setDefaultAddress = async (id: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })))
    
    toast.success('默认地址已设置')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        addresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}