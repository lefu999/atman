'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const { t, language } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 验证
    if (formData.password !== formData.confirmPassword) {
      toast.error(language === 'zh' ? '两次输入的密码不一致' : 'Passwords do not match')
      return
    }
    
    if (formData.password.length < 6) {
      toast.error(language === 'zh' ? '密码至少需要6个字符' : 'Password must be at least 6 characters')
      return
    }
    
    if (!formData.agree) {
      toast.error(language === 'zh' ? '请同意服务条款' : 'Please agree to the terms')
      return
    }
    
    setIsLoading(true)
    
    try {
      await register(formData.email, formData.password, formData.name)
    } catch (error: any) {
      toast.error(error.message || (language === 'zh' ? '注册失败' : 'Registration failed'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-900 rounded-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-bold text-white">ATMAN</h1>
            </Link>
            <p className="text-gray-400 mt-2">
              {language === 'zh' ? '创建您的账户' : 'Create your account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 姓名 */}
            <div>
              <label className="block text-gray-400 mb-2">
                {language === 'zh' ? '姓名' : 'Name'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={language === 'zh' ? '请输入您的姓名' : 'Enter your name'}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
            </div>

            {/* 邮箱 */}
            <div>
              <label className="block text-gray-400 mb-2">
                {language === 'zh' ? '邮箱' : 'Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={language === 'zh' ? '请输入邮箱地址' : 'Enter your email'}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
            </div>

            {/* 密码 */}
            <div>
              <label className="block text-gray-400 mb-2">
                {language === 'zh' ? '密码' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={language === 'zh' ? '请输入密码（至少6位）' : 'Enter password (min 6 chars)'}
                  className="w-full pl-10 pr-12 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* 确认密码 */}
            <div>
              <label className="block text-gray-400 mb-2">
                {language === 'zh' ? '确认密码' : 'Confirm Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={language === 'zh' ? '请再次输入密码' : 'Enter password again'}
                  className="w-full pl-10 pr-12 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* 服务条款 */}
            <div className="flex items-start">
              <input
                type="checkbox"
                name="agree"
                id="agree"
                checked={formData.agree}
                onChange={handleChange}
                className="mt-1 mr-2"
              />
              <label htmlFor="agree" className="text-gray-400 text-sm">
                {language === 'zh' ? (
                  <>我同意 <Link href="/terms" className="text-white hover:underline">服务条款</Link> 和 <Link href="/privacy" className="text-white hover:underline">隐私政策</Link></>
                ) : (
                  <>I agree to the <Link href="/terms" className="text-white hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-white hover:underline">Privacy Policy</Link></>
                )}
              </label>
            </div>

            {/* 注册按钮 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading 
                ? (language === 'zh' ? '注册中...' : 'Registering...')
                : (language === 'zh' ? '注册' : 'Register')}
            </button>

            {/* 分隔线 */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">
                  {language === 'zh' ? '或' : 'OR'}
                </span>
              </div>
            </div>

            {/* 第三方登录 */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">微</span>
                </div>
                <span className="text-sm">{language === 'zh' ? '微信' : 'WeChat'}</span>
              </button>
              
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">支</span>
                </div>
                <span className="text-sm">{language === 'zh' ? '支付宝' : 'Alipay'}</span>
              </button>
            </div>

            {/* 登录链接 */}
            <p className="text-center text-gray-400">
              {language === 'zh' ? '已有账户？' : 'Already have an account? '}
              <Link href="/login" className="text-white hover:underline">
                {language === 'zh' ? '立即登录' : 'Login'}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}