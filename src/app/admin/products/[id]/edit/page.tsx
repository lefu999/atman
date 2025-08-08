'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Plus,
  Trash2,
  Image as ImageIcon
} from 'lucide-react'
import toast from 'react-hot-toast'
import { mockProducts } from '@/data/products'

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [product, setProduct] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'T恤',
    price: 0,
    originalPrice: 0,
    stock: 100,
    brand: 'ATMAN',
    images: [] as string[],
    sizes: [] as string[],
    colors: [] as string[],
    inStock: true,
    featured: false
  })

  useEffect(() => {
    const foundProduct = mockProducts.find(p => p.id === productId)
    if (foundProduct) {
      setProduct(foundProduct)
      setFormData({
        name: foundProduct.name,
        description: foundProduct.description,
        category: foundProduct.category,
        price: foundProduct.price,
        originalPrice: foundProduct.originalPrice || foundProduct.price,
        stock: foundProduct.stock || 100,
        brand: foundProduct.brand,
        images: foundProduct.images,
        sizes: foundProduct.sizes || ['S', 'M', 'L', 'XL'],
        colors: foundProduct.colors || ['黑色', '白色', '灰色'],
        inStock: foundProduct.inStock,
        featured: foundProduct.featured || false
      })
    }
  }, [productId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('商品信息已更新')
    router.push('/admin/products')
  }

  const handleImageUpload = () => {
    toast.success('图片上传功能开发中')
  }

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    })
  }

  const handleAddSize = () => {
    const newSize = prompt('请输入尺码（如：XXL）')
    if (newSize && !formData.sizes.includes(newSize)) {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, newSize]
      })
    }
  }

  const handleRemoveSize = (size: string) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter(s => s !== size)
    })
  }

  const handleAddColor = () => {
    const newColor = prompt('请输入颜色')
    if (newColor && !formData.colors.includes(newColor)) {
      setFormData({
        ...formData,
        colors: [...formData.colors, newColor]
      })
    }
  }

  const handleRemoveColor = (color: string) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter(c => c !== color)
    })
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">商品不存在</p>
      </div>
    )
  }

  return (
    <div>
      {/* 头部 */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">编辑商品</h1>
            <p className="text-gray-600">商品ID: {productId}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/admin/products')}
            className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Save size={20} />
            保存更改
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧主要信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 基本信息 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">基本信息</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    商品名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    商品描述
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      分类 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="T恤">T恤</option>
                      <option value="卫衣">卫衣</option>
                      <option value="外套">外套</option>
                      <option value="裤子">裤子</option>
                      <option value="帽子">帽子</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      品牌
                    </label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 商品图片 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">商品图片</h2>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                      <Image
                        src={image}
                        alt={`商品图片 ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                    {index === 0 && (
                      <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        主图
                      </span>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleImageUpload}
                  className="aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-blue-500"
                >
                  <Upload size={24} />
                  <span className="text-xs">上传图片</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">建议尺寸：800x800px，支持 JPG、PNG 格式</p>
            </div>

            {/* 规格设置 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">规格设置</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">尺码</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.sizes.map((size) => (
                    <div key={size} className="bg-gray-100 px-3 py-1 rounded-lg flex items-center gap-2">
                      <span>{size}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSize(size)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="px-3 py-1 border border-dashed border-gray-300 rounded-lg hover:border-blue-500 text-gray-500 hover:text-blue-500 flex items-center gap-1"
                  >
                    <Plus size={16} />
                    添加尺码
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">颜色</label>
                <div className="flex flex-wrap gap-2">
                  {formData.colors.map((color) => (
                    <div key={color} className="bg-gray-100 px-3 py-1 rounded-lg flex items-center gap-2">
                      <span>{color}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(color)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-3 py-1 border border-dashed border-gray-300 rounded-lg hover:border-blue-500 text-gray-500 hover:text-blue-500 flex items-center gap-1"
                  >
                    <Plus size={16} />
                    添加颜色
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧信息 */}
          <div className="space-y-6">
            {/* 价格库存 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">价格与库存</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    销售价格 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">¥</span>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    原价
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">¥</span>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">留空则不显示划线价格</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    库存数量
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* 商品状态 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">商品状态</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">立即上架销售</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">设为精选商品</span>
                </label>
              </div>
            </div>

            {/* 操作提示 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-800 mb-2">操作提示</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• 商品图片建议使用正方形比例</li>
                <li>• 第一张图片将作为商品主图</li>
                <li>• 合理设置库存避免超卖</li>
                <li>• 商品下架后用户无法购买</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}