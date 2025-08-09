'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const router = useRouter()
  const { t, language } = useLanguage()

  useEffect(() => {
    // 淡入效果
    setTimeout(() => setIsVisible(true), 100)
    // 显示按钮
    setTimeout(() => setShowButton(true), 800)
  }, [])

  const handleEnterShop = () => {
    setIsVisible(false)
    setTimeout(() => {
      router.push('/shop')
    }, 300)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center relative overflow-hidden">
      {/* 背景动画效果 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
        
        {/* 动态背景粒子 */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            >
              <div 
                className="w-1 h-1 bg-white rounded-full opacity-20"
                style={{
                  boxShadow: '0 0 10px rgba(255,255,255,0.5)'
                }}
              />
            </div>
          ))}
        </div>

        {/* 渐变光效 */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* 主要内容 */}
      <div className={`relative z-10 text-center transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}>
        {/* Logo文字 */}
        <div className="mb-8">
          <h1 className="text-7xl md:text-9xl font-bold text-white tracking-wider animate-glow">
            ATMAN
          </h1>
          
          {/* 副标题 */}
          <div className="mt-4 space-y-2">
            <p className="text-lg md:text-xl text-gray-400 tracking-widest uppercase animate-slide-up" style={{ animationDelay: '0.3s' }}>
              {language === 'zh' ? '引领潮流' : 'Lead the Trend'}
            </p>
            <p className="text-lg md:text-xl text-gray-400 tracking-widest uppercase animate-slide-up" style={{ animationDelay: '0.5s' }}>
              {language === 'zh' ? '定义街头' : 'Define the Street'}
            </p>
          </div>
        </div>

        {/* 分割线 */}
        <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-8 animate-expand" />

        {/* 进入按钮 */}
        <div className={`transition-all duration-700 transform ${
          showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <button
            onClick={handleEnterShop}
            className="group relative inline-flex items-center gap-3 px-10 py-4 bg-white text-black font-bold text-lg rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <ShoppingBag size={24} className="group-hover:rotate-12 transition-transform" />
            <span>{language === 'zh' ? '开始购物' : 'Start Shopping'}</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            
            {/* 光效 */}
            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
          </button>

          {/* 快速链接 */}
          <div className="mt-12 flex justify-center gap-8 text-sm">
            <Link 
              href="/vintage" 
              className="text-gray-500 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
            >
              <span className="inline-block transform group-hover:-translate-x-1 transition-transform">←</span>
              <span>{language === 'zh' ? '古着精选' : 'Vintage Collection'}</span>
            </Link>
            <Link 
              href="/shop" 
              className="text-gray-500 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
            >
              <span>{language === 'zh' ? '新品上架' : 'New Arrivals'}</span>
              <span className="inline-block transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>

        {/* 底部标语 */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 tracking-widest">
          SINCE 2024 • WORLDWIDE SHIPPING
        </div>
      </div>

      {/* 自定义CSS动画 */}
      <style jsx>{`
        @keyframes glow {
          0%, 100% { 
            text-shadow: 
              0 0 20px rgba(255,255,255,0.3),
              0 0 40px rgba(255,255,255,0.2),
              0 0 60px rgba(255,255,255,0.1);
          }
          50% { 
            text-shadow: 
              0 0 30px rgba(255,255,255,0.4),
              0 0 50px rgba(255,255,255,0.3),
              0 0 70px rgba(255,255,255,0.2);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(10px) translateX(-10px); }
          75% { transform: translateY(-10px) translateX(20px); }
        }

        @keyframes slide-up {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes expand {
          from { 
            width: 0;
            opacity: 0;
          }
          to { 
            width: 8rem;
            opacity: 1;
          }
        }

        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-expand {
          animation: expand 1s ease-out forwards;
          animation-delay: 0.7s;
          width: 0;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}