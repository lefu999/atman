'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const { t, language } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
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
    setIsLoading(true)
    
    try {
      await login(formData.email, formData.password)
    } catch (error: any) {
      toast.error(error.message || (language === 'zh' ? '登录失败' : 'Login failed'))
    } finally {
      setIsLoading(false)
    }
  }

  // 演示账号提示
  const fillDemoAccount = () => {
    setFormData({
      email: 'test@example.com',
      password: '123456',
      remember: false
    })
    toast.success(language === 'zh' ? '已填入演示账号' : 'Demo account filled')
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
              {language === 'zh' ? '登录您的账户' : 'Login to your account'}
            </p>
          </div>

          {/* 演示账号提示 */}
          <div className="mb-6 p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
            <p className="text-blue-400 text-sm mb-2">
              {language === 'zh' ? '演示账号：' : 'Demo Account:'}
            </p>
            <p className="text-gray-300 text-xs">
              {language === 'zh' ? '邮箱：' : 'Email: '}test@example.com
            </p>
            <p className="text-gray-300 text-xs mb-2">
              {language === 'zh' ? '密码：' : 'Password: '}123456
            </p>
            <button
              type="button"
              onClick={fillDemoAccount}
              className="text-blue-400 text-xs hover:text-blue-300 underline"
            >
              {language === 'zh' ? '点击填入' : 'Click to fill'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder={language === 'zh' ? '请输入密码' : 'Enter your password'}
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

            {/* 记住我 & 忘记密码 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="remember"
                  id="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="remember" className="text-gray-400 text-sm">
                  {language === 'zh' ? '记住我' : 'Remember me'}
                </label>
              </div>
              <Link href="/forgot-password" className="text-sm text-white hover:underline">
                {language === 'zh' ? '忘记密码？' : 'Forgot password?'}
              </Link>
            </div>

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading 
                ? (language === 'zh' ? '登录中...' : 'Logging in...')
                : (language === 'zh' ? '登录' : 'Login')}
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
                <span className="text-sm">{language === 'zh' ? '微信登录' : 'WeChat'}</span>
              </button>
              
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">支</span>
                </div>
                <span className="text-sm">{language === 'zh' ? '支付宝登录' : 'Alipay'}</span>
              </button>
            </div>

            {/* 注册链接 */}
            <p className="text-center text-gray-400">
              {language === 'zh' ? '还没有账户？' : "Don't have an account? "}
              <Link href="/register" className="text-white hover:underline">
                {language === 'zh' ? '立即注册' : 'Register'}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}