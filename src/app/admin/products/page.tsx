'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Filter,
  Download,
  Upload,
  Grid,
  List,
  MoreVertical,
  Package
} from 'lucide-react'
import toast from 'react-hot-toast'
import { mockProducts } from '@/data/products'

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)

  const categories = [
    { id: 'all', name: '全部', count: products.length },
    { id: 't-shirt', name: 'T恤', count: products.filter(p => p.category === 'T恤').length },
    { id: 'hoodie', name: '卫衣', count: products.filter(p => p.category === '卫衣').length },
    { id: 'jacket', name: '外套', count: products.filter(p => p.category === '外套').length },
    { id: 'pants', name: '裤子', count: products.filter(p => p.category === '裤子').length },
    { id: 'hat', name: '帽子', count: products.filter(p => p.category === '帽子').length }
  ]

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || 
                           (selectedCategory === 't-shirt' && product.category === 'T恤') ||
                           (selectedCategory === 'hoodie' && product.category === '卫衣') ||
                           (selectedCategory === 'jacket' && product.category === '外套') ||
                           (selectedCategory === 'pants' && product.category === '裤子') ||
                           (selectedCategory === 'hat' && product.category === '帽子')
    return matchesSearch && matchesCategory
  })

  const handleToggleVisibility = (productId: string) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, inStock: !p.inStock } : p
    ))
    toast.success('商品状态已更新')
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm('确定要删除这个商品吗？')) {
      setProducts(products.filter(p => p.id !== productId))
      toast.success('商品已删除')
    }
  }

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProducts(filteredProducts.map(p => p.id))
    } else {
      setSelectedProducts([])
    }
  }

  const handleSelectProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId))
    } else {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

  const handleBatchDelete = () => {
    if (confirm(`确定要删除选中的 ${selectedProducts.length} 个商品吗？`)) {
      setProducts(products.filter(p => !selectedProducts.includes(p.id)))
      setSelectedProducts([])
      toast.success('批量删除成功')
    }
  }

  const handleBatchToggleVisibility = () => {
    const selectedItems = products.filter(p => selectedProducts.includes(p.id))
    const allVisible = selectedItems.every(p => p.inStock)
    
    setProducts(products.map(p => 
      selectedProducts.includes(p.id) ? { ...p, inStock: !allVisible } : p
    ))
    toast.success(`已${allVisible ? '下架' : '上架'} ${selectedProducts.length} 个商品`)
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">商品管理</h1>
          <p className="text-gray-600 mt-1">共 {products.length} 个商品</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center gap-2">
            <Upload size={20} />
            导入商品
          </button>
          <button className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center gap-2">
            <Download size={20} />
            导出商品
          </button>
          <Link
            href="/admin/products/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={20} />
            添加商品
          </Link>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>

          <div className="flex gap-3 items-center">
            <div className="relative">
              <input
                type="search"
                placeholder="搜索商品..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>

            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 批量操作 */}
      {selectedProducts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
          <span className="text-blue-700">已选择 {selectedProducts.length} 个商品</span>
          <div className="flex gap-2">
            <button
              onClick={handleBatchToggleVisibility}
              className="bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 border border-gray-300"
            >
              批量上/下架
            </button>
            <button
              onClick={handleBatchDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              批量删除
            </button>
            <button
              onClick={() => setSelectedProducts([])}
              className="text-blue-600 hover:text-blue-700"
            >
              取消选择
            </button>
          </div>
        </div>
      )}

      {/* 商品列表 */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="absolute top-2 left-2 z-10">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                    className="w-4 h-4"
                  />
                </div>
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full">已下架</span>
                  </div>
                )}
                <div className="aspect-square bg-gray-100 relative">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="p-4">
                <div className="mb-2">
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{product.category}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-gray-900">¥{product.price}</span>
                  <span className="text-sm text-gray-500">库存: {product.stock || '100'}</span>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-center text-sm"
                  >
                    编辑
                  </Link>
                  <button
                    onClick={() => handleToggleVisibility(product.id)}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    {product.inStock ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">商品</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">分类</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">价格</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">库存</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg relative overflow-hidden">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{product.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">¥{product.price}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{product.stock || '100'}</span>
                  </td>
                  <td className="px-6 py-4">
                    {product.inStock ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                        在售
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
                        下架
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleToggleVisibility(product.id)}
                        className="text-gray-600 hover:text-gray-700"
                      >
                        {product.inStock ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}