'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  MapPin, 
  Calendar, 
  Star, 
  Heart,
  Filter,
  Globe,
  Sparkles,
  ShoppingBag,
  ChevronDown
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useLanguage } from '@/contexts/LanguageContext'

// 模拟古着孤品数据
const vintageProducts = [
  {
    id: 'v1',
    name: 'Levi\'s 501® Big E',
    nameZh: '李维斯501原色丹宁',
    price: 3999,
    originalPrice: 5999,
    era: '1970s',
    origin: '美国',
    originEmoji: '🇺🇸',
    condition: '9/10',
    size: 'W32 L34',
    description: '经典501原色赤耳丹宁，Big E红标，保存完好',
    tags: ['牛仔裤', '原色', '赤耳'],
    images: ['/images/Vintage/微信图片_20250807172302_779.jpg'],
    rarity: 5,
    sold: false
  },
  {
    id: 'v2',
    name: 'Sukajan Embroidered',
    nameZh: '横须贺刺绣夹克',
    price: 4599,
    originalPrice: 6999,
    era: '1960s',
    origin: '日本',
    originEmoji: '🇯🇵',
    condition: '8/10',
    size: 'L',
    description: '日本原产横须贺夹克，双面刺绣，龙虎图案',
    tags: ['夹克', '刺绣', '横须贺'],
    images: ['/images/Vintage/微信图片_20250807172311_780.jpg'],
    rarity: 5,
    sold: false
  },
  {
    id: 'v3',
    name: 'M-65 Field Jacket',
    nameZh: 'M-65军装夹克',
    price: 2899,
    originalPrice: 3999,
    era: '1980s',
    origin: '美国',
    originEmoji: '🇺🇸',
    condition: '7/10',
    size: 'M-Regular',
    description: '美军公发M-65野战夹克，含内胆，多功能口袋',
    tags: ['军装', '工装', 'M-65'],
    images: ['/images/Vintage/微信图片_20250807172315_781.jpg'],
    rarity: 4,
    sold: false
  },
  {
    id: 'v4',
    name: 'Burberry Trench Coat',
    nameZh: '巴宝莉风衣',
    price: 5999,
    originalPrice: 8999,
    era: '1990s',
    origin: '英国',
    originEmoji: '🇬🇧',
    condition: '9/10',
    size: 'UK 40',
    description: '经典卡其色Gabardine面料，双排扣设计',
    tags: ['风衣', '巴宝莉', '经典'],
    images: ['/images/Vintage/微信图片_20250807172319_782.jpg'],
    rarity: 4,
    sold: false
  },
  {
    id: 'v5',
    name: 'Pink Floyd Tour Tee',
    nameZh: '平克弗洛伊德巡演T恤',
    price: 1899,
    originalPrice: 2999,
    era: '1994',
    origin: '英国',
    originEmoji: '🇬🇧',
    condition: '6/10',
    size: 'XL',
    description: '1994年Division Bell巡演原版T恤，有自然做旧',
    tags: ['Band Tee', '摇滚', '巡演'],
    images: ['/images/Vintage/微信图片_20250807172321_783.jpg'],
    rarity: 4,
    sold: false
  },
  {
    id: 'v6',
    name: 'Yves Saint Laurent Blazer',
    nameZh: 'YSL复古西装',
    price: 4999,
    originalPrice: 7999,
    era: '1980s',
    origin: '法国',
    originEmoji: '🇫🇷',
    condition: '8/10',
    size: 'FR 48',
    description: '垫肩设计，双排扣，经典80年代廓形',
    tags: ['西装', 'YSL', '垫肩'],
    images: ['/images/Vintage/微信图片_20250807172324_784.jpg'],
    rarity: 5,
    sold: false
  },
  {
    id: 'v7',
    name: 'Champion Reverse Weave',
    nameZh: '冠军反织卫衣',
    price: 1599,
    originalPrice: 2299,
    era: '1990s',
    origin: '美国',
    originEmoji: '🇺🇸',
    condition: '8/10',
    size: 'L',
    description: '经典反织工艺，不易变形，刺绣logo',
    tags: ['卫衣', 'Champion', '反织'],
    images: ['/images/Vintage/微信图片_20250807172327_785.jpg'],
    rarity: 3,
    sold: false
  },
  {
    id: 'v8',
    name: 'Pendleton Wool Shirt',
    nameZh: '彭德尔顿羊毛衬衫',
    price: 2299,
    originalPrice: 3299,
    era: '1970s',
    origin: '美国',
    originEmoji: '🇺🇸',
    condition: '9/10',
    size: 'M',
    description: '100%纯羊毛，经典格纹图案，美产',
    tags: ['衬衫', '羊毛', '格纹'],
    images: ['/images/Vintage/微信图片_20250807172330_786.jpg'],
    rarity: 3,
    sold: false
  },
  {
    id: 'v9',
    name: 'Vintage Harley Davidson',
    nameZh: '哈雷机车皮夹克',
    price: 6999,
    originalPrice: 9999,
    era: '1980s',
    origin: '美国',
    originEmoji: '🇺🇸',
    condition: '8/10',
    size: 'L',
    description: '经典黑色牛皮，哈雷戴维森官方出品，背部鹰图刺绣',
    tags: ['皮夹克', '哈雷', '机车'],
    images: ['/images/Vintage/微信图片_20250807172334_788.jpg'],
    rarity: 5,
    sold: false
  },
  {
    id: 'v10',
    name: 'Carhartt Detroit Jacket',
    nameZh: 'Carhartt底特律夹克',
    price: 2599,
    originalPrice: 3599,
    era: '1990s',
    origin: '美国',
    originEmoji: '🇺🇸',
    condition: '7/10',
    size: 'XL',
    description: '经典帆布工装夹克，羊羔绒内里，美产',
    tags: ['工装', 'Carhartt', '夹克'],
    images: ['/images/Vintage/微信图片_20250807172337_789.jpg'],
    rarity: 4,
    sold: false
  },
  {
    id: 'v11',
    name: 'Ralph Lauren Aztec',
    nameZh: '拉夫劳伦印第安毛衣',
    price: 3299,
    originalPrice: 4999,
    era: '1990s',
    origin: '美国',
    originEmoji: '🇺🇸',
    condition: '9/10',
    size: 'L',
    description: '经典印第安图腾设计，100%羊毛，手工编织',
    tags: ['毛衣', 'Ralph Lauren', '印第安'],
    images: ['/images/Vintage/微信图片_20250807172341_790.jpg'],
    rarity: 4,
    sold: false
  },
  {
    id: 'v12',
    name: 'Grateful Dead Tie Dye',
    nameZh: '感恩而死扎染T恤',
    price: 2299,
    originalPrice: 3299,
    era: '1993',
    origin: '美国',
    originEmoji: '🇺🇸',
    condition: '7/10',
    size: 'XL',
    description: '1993年夏季巡演原版，经典扎染配色，骷髅玫瑰图案',
    tags: ['Band Tee', '扎染', '摇滚'],
    images: ['/images/Vintage/微信图片_20250807172343_791.jpg'],
    rarity: 4,
    sold: false
  },
  {
    id: 'v13',
    name: 'Stone Island Jacket',
    nameZh: '石头岛罗盘夹克',
    price: 4999,
    originalPrice: 6999,
    era: '2000s',
    origin: '意大利',
    originEmoji: '🇮🇹',
    condition: '8/10',
    size: 'L',
    description: '经典罗盘标志，特殊染色工艺，意大利制造',
    tags: ['夹克', 'Stone Island', '罗盘'],
    images: ['/images/Vintage/微信图片_20250807172346_792.jpg'],
    rarity: 4,
    sold: false
  },
  {
    id: 'v14',
    name: 'Nike ACG Jacket',
    nameZh: 'Nike ACG机能夹克',
    price: 3599,
    originalPrice: 4999,
    era: '2000s',
    origin: '美国',
    originEmoji: '🇺🇸',
    condition: '8/10',
    size: 'M',
    description: 'All Conditions Gear系列，防水透气，多功能口袋',
    tags: ['机能', 'Nike ACG', '夹克'],
    images: ['/images/Vintage/微信图片_20250807172349_794.jpg'],
    rarity: 4,
    sold: false
  },
  {
    id: 'v15',
    name: 'Marlboro Racing Jacket',
    nameZh: '万宝路赛车夹克',
    price: 2899,
    originalPrice: 3999,
    era: '1990s',
    origin: '美国',
    originEmoji: '🇺🇸',
    condition: '7/10',
    size: 'L',
    description: 'F1赛车队官方夹克，多赞助商标志，经典红白配色',
    tags: ['赛车', '万宝路', '夹克'],
    images: ['/images/Vintage/微信图片_20250807172352_795.jpg'],
    rarity: 3,
    sold: false
  },
  {
    id: 'v16',
    name: 'Issey Miyake Pleats',
    nameZh: '三宅一生褶皱衬衫',
    price: 5999,
    originalPrice: 8999,
    era: '1990s',
    origin: '日本',
    originEmoji: '🇯🇵',
    condition: '9/10',
    size: 'M',
    description: '经典褶皱设计，独特面料工艺，日本制造',
    tags: ['衬衫', '三宅一生', '褶皱'],
    images: ['/images/Vintage/微信图片_20250807172355_796.jpg'],
    rarity: 5,
    sold: true
  },
  {
    id: 'v17',
    name: 'Patagonia Synchilla',
    nameZh: '巴塔哥尼亚抓绒',
    price: 1999,
    originalPrice: 2999,
    era: '1990s',
    origin: '美国',
    originEmoji: '🇺🇸',
    condition: '8/10',
    size: 'L',
    description: '经典Synchilla抓绒，印第安图案，美产',
    tags: ['抓绒', 'Patagonia', '户外'],
    images: ['/images/Vintage/微信图片_20250807172358_797.jpg'],
    rarity: 3,
    sold: false
  },
  {
    id: 'v18',
    name: 'Versace Silk Shirt',
    nameZh: '范思哲巴洛克衬衫',
    price: 4599,
    originalPrice: 6999,
    era: '1990s',
    origin: '意大利',
    originEmoji: '🇮🇹',
    condition: '9/10',
    size: 'L',
    description: '100%真丝，经典巴洛克印花，意大利制造',
    tags: ['衬衫', 'Versace', '真丝'],
    images: ['/images/Vintage/微信图片_20250807172401_798.jpg'],
    rarity: 5,
    sold: false
  }
]

export default function VintagePage() {
  const { t, language } = useLanguage()
  const [selectedEra, setSelectedEra] = useState('all')
  const [selectedOrigin, setSelectedOrigin] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [likedItems, setLikedItems] = useState<string[]>([])
  
  const eras = [
    { value: 'all', label: t('vintage.filters.allEras') },
    { value: '1960s', label: '1960s' },
    { value: '1970s', label: '1970s' },
    { value: '1980s', label: '1980s' },
    { value: '1990s', label: '1990s' },
    { value: '2000s', label: '2000s' }
  ]
  
  const origins = [
    { value: 'all', label: t('vintage.filters.allOrigins') },
    { value: '美国', label: language === 'zh' ? '美国' : 'USA' },
    { value: '日本', label: language === 'zh' ? '日本' : 'Japan' },
    { value: '英国', label: language === 'zh' ? '英国' : 'UK' },
    { value: '法国', label: language === 'zh' ? '法国' : 'France' },
    { value: '意大利', label: language === 'zh' ? '意大利' : 'Italy' }
  ]
  
  const categories = [
    { value: 'all', label: t('vintage.filters.allTypes') },
    { value: '夹克', label: language === 'zh' ? '夹克' : 'Jackets' },
    { value: '牛仔裤', label: language === 'zh' ? '牛仔裤' : 'Jeans' },
    { value: '衬衫', label: language === 'zh' ? '衬衫' : 'Shirts' },
    { value: 'T恤', label: language === 'zh' ? 'T恤' : 'T-Shirts' },
    { value: '卫衣', label: language === 'zh' ? '卫衣' : 'Hoodies' },
    { value: '西装', label: language === 'zh' ? '西装' : 'Suits' },
    { value: '风衣', label: language === 'zh' ? '风衣' : 'Coats' }
  ]

  const handleLike = (productId: string) => {
    if (likedItems.includes(productId)) {
      setLikedItems(likedItems.filter(id => id !== productId))
      toast.success(t('toast.removedFromWishlist'))
    } else {
      setLikedItems([...likedItems, productId])
      toast.success(t('toast.addedToWishlist'))
    }
  }

  const handleQuickAdd = (product: any) => {
    if (product.sold) {
      toast.error(t('toast.itemSold'))
      return
    }
    const productName = language === 'zh' ? product.nameZh : product.name
    toast.success(`${t('toast.addedToCart')} - ${productName}`)
  }

  // 筛选商品
  const filteredProducts = vintageProducts.filter(product => {
    const matchesEra = selectedEra === 'all' || product.era === selectedEra
    const matchesOrigin = selectedOrigin === 'all' || product.origin === selectedOrigin
    const matchesCategory = selectedCategory === 'all' || 
      product.tags.some(tag => selectedCategory.includes(tag))
    return matchesEra && matchesOrigin && matchesCategory
  })

  // 排序商品
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rarity':
        return b.rarity - a.rarity
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-gray-950">
      {/* 页面头部 */}
      <div className="relative bg-gradient-to-b from-amber-900/20 to-transparent py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles size={16} />
              WORLDWIDE VINTAGE COLLECTION
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('vintage.pageTitle')}
            </h1>
            <p className="text-xl text-gray-300 mb-2">{t('vintage.pageSubtitle')}</p>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t('vintage.pageDescription')}
            </p>
          </div>

          {/* 地区标签 */}
          <div className="flex justify-center flex-wrap gap-4 mt-8">
            <div className="bg-gray-800/50 backdrop-blur px-4 py-2 rounded-full text-sm text-gray-300 flex items-center gap-2">
              <Globe size={16} />
              <span>{t('vintage.globalSourcing')}</span>
            </div>
            <div className="bg-gray-800/50 backdrop-blur px-4 py-2 rounded-full text-sm text-gray-300">
              🇯🇵 {t('vintage.locations.tokyo')}
            </div>
            <div className="bg-gray-800/50 backdrop-blur px-4 py-2 rounded-full text-sm text-gray-300">
              🇺🇸 {t('vintage.locations.newyork')}
            </div>
            <div className="bg-gray-800/50 backdrop-blur px-4 py-2 rounded-full text-sm text-gray-300">
              🇬🇧 {t('vintage.locations.london')}
            </div>
            <div className="bg-gray-800/50 backdrop-blur px-4 py-2 rounded-full text-sm text-gray-300">
              🇫🇷 {t('vintage.locations.paris')}
            </div>
          </div>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3">
              {/* 年代筛选 */}
              <select
                value={selectedEra}
                onChange={(e) => setSelectedEra(e.target.value)}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-amber-500"
              >
                {eras.map(era => (
                  <option key={era.value} value={era.value}>{era.label}</option>
                ))}
              </select>

              {/* 产地筛选 */}
              <select
                value={selectedOrigin}
                onChange={(e) => setSelectedOrigin(e.target.value)}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-amber-500"
              >
                {origins.map(origin => (
                  <option key={origin.value} value={origin.value}>{origin.label}</option>
                ))}
              </select>

              {/* 类型筛选 */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-amber-500"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* 排序 */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-amber-500"
            >
              <option value="featured">{t('vintage.filters.featured')}</option>
              <option value="price-low">{t('vintage.filters.priceLowToHigh')}</option>
              <option value="price-high">{t('vintage.filters.priceHighToLow')}</option>
              <option value="rarity">{t('vintage.filters.rarityFirst')}</option>
            </select>
          </div>

          <div className="mt-4 text-sm text-gray-400">
            {t('vintage.itemsFound').replace('{{count}}', sortedProducts.length.toString())}
          </div>
        </div>
      </div>

      {/* 商品网格 */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <div 
              key={product.id} 
              className={`bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-amber-500/50 transition-all group ${
                product.sold ? 'opacity-60' : ''
              }`}
            >
              {/* 商品图片 */}
              <div className="relative aspect-square bg-gray-800">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                
                {/* 已售标记 */}
                {product.sold && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="bg-red-600 text-white px-6 py-2 rounded-full font-bold text-lg">
                      {t('product.sold')}
                    </span>
                  </div>
                )}

                {/* 年代标签 */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  <span className="bg-black/70 backdrop-blur text-amber-400 px-3 py-1 rounded-full text-xs font-medium">
                    {product.era}
                  </span>
                  <span className="bg-black/70 backdrop-blur text-white px-3 py-1 rounded-full text-xs">
                    {product.originEmoji} {product.origin}
                  </span>
                </div>

                {/* 稀有度 */}
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur px-2 py-1 rounded-full">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < product.rarity ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}
                      />
                    ))}
                  </div>
                </div>

                {/* 收藏按钮 */}
                <button
                  onClick={() => handleLike(product.id)}
                  className="absolute bottom-3 right-3 bg-white/90 backdrop-blur p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={product.sold}
                >
                  <Heart
                    size={18}
                    className={likedItems.includes(product.id) ? 'text-red-500 fill-red-500' : 'text-gray-700'}
                  />
                </button>
              </div>

              {/* 商品信息 */}
              <div className="p-4">
                <div className="mb-2">
                  <h3 className="font-semibold text-white">{language === 'zh' ? product.nameZh : product.name}</h3>
                  <p className="text-sm text-gray-400">{language === 'zh' ? product.name : product.nameZh}</p>
                </div>

                {/* 标签 */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.tags.slice(0, 2).map((tag, index) => (
                    <span 
                      key={index}
                      className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 状态信息 */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <span>{t('product.size')}: {product.size}</span>
                  <span>{t('product.condition')}: {product.condition}</span>
                </div>

                {/* 价格和操作 */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-white">¥{product.price}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ¥{product.originalPrice}
                      </span>
                    )}
                  </div>
                  
                  {!product.sold ? (
                    <button
                      onClick={() => handleQuickAdd(product)}
                      className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-lg transition-colors"
                    >
                      <ShoppingBag size={18} />
                    </button>
                  ) : (
                    <span className="text-red-500 text-sm font-medium">{t('vintage.uniqueItem')}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 空状态 */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">{t('vintage.noItems')}</p>
            <button
              onClick={() => {
                setSelectedEra('all')
                setSelectedOrigin('all')
                setSelectedCategory('all')
              }}
              className="mt-4 text-amber-500 hover:text-amber-400"
            >
              {t('vintage.resetFilters')}
            </button>
          </div>
        )}
      </div>

      {/* 底部说明 */}
      <div className="bg-gray-900 border-t border-gray-800 py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="text-amber-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">{t('vintage.features.authentic.title')}</h3>
              <p className="text-gray-400 text-sm">
                {t('vintage.features.authentic.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Globe className="text-amber-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">{t('vintage.features.global.title')}</h3>
              <p className="text-gray-400 text-sm">
                {t('vintage.features.global.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="text-amber-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">{t('vintage.features.unique.title')}</h3>
              <p className="text-gray-400 text-sm">
                {t('vintage.features.unique.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}