'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  Plus,
  MapPin,
  Edit2,
  Trash2,
  Check,
  X
} from 'lucide-react'
import { useAuth, Address } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import toast from 'react-hot-toast'

export default function AddressesPage() {
  const router = useRouter()
  const { user, addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuth()
  const { t, language } = useLanguage()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
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
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingId) {
        await updateAddress(editingId, formData)
        setEditingId(null)
      } else {
        await addAddress(formData)
      }
      
      setShowAddForm(false)
      setFormData({
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

  const handleEdit = (address: Address) => {
    setFormData({
      name: address.name,
      phone: address.phone,
      province: address.province,
      city: address.city,
      district: address.district,
      address: address.address,
      isDefault: address.isDefault
    })
    setEditingId(address.id)
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm(language === 'zh' ? '确定要删除这个地址吗？' : 'Are you sure to delete this address?')) {
      await deleteAddress(id)
    }
  }

  const handleSetDefault = async (id: string) => {
    await setDefaultAddress(id)
  }

  const cancelEdit = () => {
    setShowAddForm(false)
    setEditingId(null)
    setFormData({
      name: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      address: '',
      isDefault: false
    })
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

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">
              {language === 'zh' ? '收货地址管理' : 'Manage Addresses'}
            </h1>
            
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                <Plus size={18} />
                <span>{language === 'zh' ? '添加新地址' : 'Add New Address'}</span>
              </button>
            )}
          </div>

          {/* 添加/编辑表单 */}
          {showAddForm && (
            <div className="bg-gray-900 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                {editingId 
                  ? (language === 'zh' ? '编辑地址' : 'Edit Address')
                  : (language === 'zh' ? '添加新地址' : 'Add New Address')}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-2">
                      {language === 'zh' ? '收货人' : 'Recipient'}
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={language === 'zh' ? '请输入收货人姓名' : 'Enter recipient name'}
                      className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 mb-2">
                      {language === 'zh' ? '手机号' : 'Phone'}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={language === 'zh' ? '请输入手机号' : 'Enter phone number'}
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
                      name="province"
                      required
                      value={formData.province}
                      onChange={handleChange}
                      placeholder={language === 'zh' ? '省份' : 'Province'}
                      className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 mb-2">
                      {language === 'zh' ? '城市' : 'City'}
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder={language === 'zh' ? '城市' : 'City'}
                      className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 mb-2">
                      {language === 'zh' ? '区/县' : 'District'}
                    </label>
                    <input
                      type="text"
                      name="district"
                      required
                      value={formData.district}
                      onChange={handleChange}
                      placeholder={language === 'zh' ? '区/县' : 'District'}
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
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder={language === 'zh' ? '街道、门牌号等' : 'Street, house number, etc.'}
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isDefault"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="isDefault" className="text-gray-400">
                    {language === 'zh' ? '设为默认地址' : 'Set as default address'}
                  </label>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    {language === 'zh' ? '取消' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    {editingId 
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
                {!showAddForm && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    {language === 'zh' ? '添加第一个地址' : 'Add First Address'}
                  </button>
                )}
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
                          onClick={() => handleSetDefault(address.id)}
                          className="p-2 text-gray-400 hover:text-green-400 transition-colors"
                          title={language === 'zh' ? '设为默认' : 'Set as default'}
                        >
                          <Check size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(address)}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                        title={language === 'zh' ? '编辑' : 'Edit'}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        title={language === 'zh' ? '删除' : 'Delete'}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}