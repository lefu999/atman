'use client'

import { useState, useEffect } from 'react'
import ProductCard from '../../components/ProductCard'
import { Product } from '../../types'
import { ChevronDown } from 'lucide-react'
import { mockProducts, categories } from '../../data/products'

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedBrand, setSelectedBrand] = useState<string>('全部')
  const [selectedCategory, setSelectedCategory] = useState<string>('全部')
  const [selectedSize, setSelectedSize] = useState<string>('全部')
  const [selectedColor, setSelectedColor] = useState<string>('全部')
  const [sortBy, setSortBy] = useState<string>('featured')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const brands = ['全部', 'ATMAN']
  const categoryOptions = categories.map(c => c.name)
  const sizes = ['全部', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '均码']
  const colors = ['全部', '黑色', '白色', '灰色', '蓝色', '米色', '卡其', '藏青', '军绿']

  useEffect(() => {
    setProducts(mockProducts)
    setFilteredProducts(mockProducts)
  }, [])

  useEffect(() => {
    let filtered = [...products]

    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedBrand !== '全部') {
      filtered = filtered.filter(p => p.brand === selectedBrand)
    }

    if (selectedCategory !== '全部') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    if (selectedSize !== '全部') {
      filtered = filtered.filter(p => p.sizes.includes(selectedSize))
    }

    if (selectedColor !== '全部') {
      filtered = filtered.filter(p => p.colors.some(c => c === selectedColor))
    }

    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery, selectedBrand, selectedCategory, selectedSize, selectedColor, sortBy])

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <input
            type="search"
            placeholder="搜索商品..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        {/* 分类导航 */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedCategory === cat.name
                    ? 'bg-white text-black'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">筛选条件</h2>
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg"
            >
              <option value="全部">所有品牌</option>
              {brands.slice(1).map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>

            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg"
            >
              <option value="全部">所有尺码</option>
              {sizes.slice(1).map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>

            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg"
            >
              <option value="全部">所有颜色</option>
              {colors.slice(1).map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg"
            >
              <option value="featured">默认排序</option>
              <option value="price-asc">价格：低到高</option>
              <option value="price-desc">价格：高到低</option>
              <option value="name">名称</option>
            </select>
          </div>
        </div>

        <div className="mb-4 text-white">
          <h1 className="text-3xl font-bold mb-2">
            {selectedCategory === '全部' ? '全部商品' : selectedCategory}
          </h1>
          <p className="text-gray-400">共 {filteredProducts.length} 件商品</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">没有找到符合条件的商品</p>
          </div>
        )}
      </div>
    </div>
  )
}