'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  Camera,
  Save,
  User,
  Mail,
  Phone,
  Calendar,
  Shield
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const router = useRouter()
  const { user, updateProfile } = useAuth()
  const { t, language } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: ''
  })

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    
    setFormData({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone
      })
      toast.success(language === 'zh' ? '资料更新成功' : 'Profile updated successfully')
    } catch (error) {
      toast.error(language === 'zh' ? '更新失败' : 'Update failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeft size={20} />
          <span>{language === 'zh' ? '返回账户中心' : 'Back to Account'}</span>
        </Link>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-8">
            {language === 'zh' ? '个人资料' : 'Profile Settings'}
          </h1>

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

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 基本信息 */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  {language === 'zh' ? '基本信息' : 'Basic Information'}
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 mb-2">
                      {language === 'zh' ? '姓名' : 'Name'}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-2">
                      {language === 'zh' ? '邮箱' : 'Email'}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full pl-10 pr-4 py-3 bg-gray-800 text-gray-500 rounded-lg cursor-not-allowed"
                      />
                    </div>
                    <p className="text-gray-500 text-xs mt-1">
                      {language === 'zh' ? '邮箱不可修改' : 'Email cannot be changed'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-2">
                      {language === 'zh' ? '手机号' : 'Phone'}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={language === 'zh' ? '请输入手机号' : 'Enter phone number'}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-2">
                      {language === 'zh' ? '生日' : 'Birth Date'}
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-2">
                      {language === 'zh' ? '性别' : 'Gender'}
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <option value="">{language === 'zh' ? '请选择' : 'Select'}</option>
                      <option value="male">{language === 'zh' ? '男' : 'Male'}</option>
                      <option value="female">{language === 'zh' ? '女' : 'Female'}</option>
                      <option value="other">{language === 'zh' ? '其他' : 'Other'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-2">
                      {language === 'zh' ? '注册时间' : 'Member Since'}
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      <input
                        type="text"
                        value={new Date(user.createdAt).toLocaleDateString()}
                        disabled
                        className="w-full pl-10 pr-4 py-3 bg-gray-800 text-gray-500 rounded-lg cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 安全设置 */}
              <div className="border-t border-gray-800 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {language === 'zh' ? '安全设置' : 'Security Settings'}
                </h3>
                
                <div className="space-y-4">
                  <Link
                    href="/account/change-password"
                    className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="text-gray-400" size={20} />
                      <div>
                        <p className="text-white">
                          {language === 'zh' ? '修改密码' : 'Change Password'}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {language === 'zh' ? '定期修改密码以保护账户安全' : 'Change your password regularly for security'}
                        </p>
                      </div>
                    </div>
                    <span className="text-gray-400">→</span>
                  </Link>
                </div>
              </div>

              {/* 保存按钮 */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-800">
                <Link
                  href="/account"
                  className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  {language === 'zh' ? '取消' : 'Cancel'}
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={18} />
                  <span>
                    {isLoading 
                      ? (language === 'zh' ? '保存中...' : 'Saving...')
                      : (language === 'zh' ? '保存更改' : 'Save Changes')}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}