'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ProductCard from '../../components/ProductCard'
import { Product } from '../../types'
import { ChevronDown } from 'lucide-react'
import { mockProducts, categories } from '../../data/products'
import { useLanguage } from '../../contexts/LanguageContext'

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedBrand, setSelectedBrand] = useState<string>('全部')
  const [selectedCategory, setSelectedCategory] = useState<string>('全部')
  const [selectedSize, setSelectedSize] = useState<string>('全部')
  const [selectedColor, setSelectedColor] = useState<string>('全部')
  const [sortBy, setSortBy] = useState<string>('featured')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const { t } = useLanguage()

  const brands = ['全部', 'ATMAN']
  const categoryOptions = categories.map(c => c.name)
  const sizes = ['全部', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '均码']
  const colors = ['全部', '黑色', '白色', '灰色', '蓝色', '米色', '卡其', '藏青', '军绿']

  useEffect(() => {
    setProducts(mockProducts)
    setFilteredProducts(mockProducts)
    setFeaturedProducts(mockProducts.slice(0, 8))
    setNewArrivals(mockProducts.slice(4, 12))
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
      {/* 精选商品 */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-white">{t('home.featured')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Vintage 古着孤品入口 */}
      <section className="relative py-20 bg-gradient-to-r from-amber-900/20 to-orange-900/20">
        <div className="container mx-auto px-4">
          <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            
            <div className="relative grid lg:grid-cols-2 gap-8 items-center p-8 lg:p-12">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                  WORLDWIDE EXCLUSIVE
                </div>
                
                <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                  {t('home.vintage.title')}
                  <span className="block text-3xl lg:text-4xl mt-2 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                    {t('home.vintage.subtitle')}
                  </span>
                </h2>
                
                <p className="text-gray-300 text-lg">
                  {t('home.vintage.description')}
                </p>
                
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full">🇯🇵 {t('home.vintage.japan')}</span>
                  <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full">🇺🇸 {t('home.vintage.usa')}</span>
                  <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full">🇬🇧 {t('home.vintage.uk')}</span>
                  <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full">🇫🇷 {t('home.vintage.france')}</span>
                </div>
                
                <Link
                  href="/vintage"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-xl"
                >
                  <span>{t('home.vintage.explore')}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              
              <div className="relative lg:block hidden">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="bg-gray-700 rounded-lg h-48 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                      <div className="absolute bottom-3 left-3 text-white z-20">
                        <p className="text-xs opacity-75">1970s</p>
                        <p className="text-sm font-semibold">Levi's 501®</p>
                      </div>
                    </div>
                    <div className="bg-gray-700 rounded-lg h-32 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                      <div className="absolute bottom-3 left-3 text-white z-20">
                        <p className="text-xs opacity-75">1980s</p>
                        <p className="text-sm font-semibold">军装夹克</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="bg-gray-700 rounded-lg h-32 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                      <div className="absolute bottom-3 left-3 text-white z-20">
                        <p className="text-xs opacity-75">1960s</p>
                        <p className="text-sm font-semibold">横须贺刺绣</p>
                      </div>
                    </div>
                    <div className="bg-gray-700 rounded-lg h-48 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                      <div className="absolute bottom-3 left-3 text-white z-20">
                        <p className="text-xs opacity-75">1990s</p>
                        <p className="text-sm font-semibold">Band Tee</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold rotate-12 shadow-lg">
                  {t('home.vintage.limited')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 新品上架 */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-white">{t('home.newArrivals')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 分割线 */}
      <div className="border-t border-gray-800 my-16"></div>

      {/* 全部商品筛选区域 */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4 text-white">全部商品</h2>
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
          <h3 className="text-xl font-bold mb-4 text-white">筛选条件</h3>
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