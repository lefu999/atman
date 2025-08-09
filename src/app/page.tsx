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
        <div className="mb-8 perspective-1000">
          <div className="text-7xl md:text-9xl font-bold transform-3d relative inline-block"
               style={{ 
                 fontFamily: 'Times, "Times New Roman", "Georgia", "Baskerville", "Didot", "Bodoni MT", serif',
                 fontWeight: '900',
                 fontStyle: 'normal',
                 transformStyle: 'preserve-3d',
                 letterSpacing: '0.12em',
                 textTransform: 'uppercase'
               }}>
            {/* 整体3D文字效果 */}
            <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
              {/* 立体层次 - 创建实心厚度 */}
              {[...Array(15)].map((_, i) => (
                <span
                  key={i}
                  className="absolute"
                  style={{
                    transform: `translateZ(-${i * 4}px) translateX(${i * 1.5}px) translateY(${i * 1.5}px)`,
                    color: i < 3 ? '#f0f0f0' : i < 6 ? '#d0d0d0' : i < 9 ? '#b0b0b0' : i < 12 ? '#909090' : '#707070',
                    WebkitTextStroke: '3px rgba(200,200,200,1)',
                    paintOrder: 'stroke fill',
                    fontWeight: '900',
                    opacity: 1
                  }}
                >
                  ATMAN
                </span>
              ))}
              
              {/* 主文字层 - 更实的白色 */}
              <span
                className="relative"
                style={{
                  color: '#ffffff',
                  transform: 'translateZ(30px)',
                  textShadow: `
                    0 0 10px rgba(255,255,255,0.9),
                    0 0 20px rgba(255,255,255,0.5),
                    1px 1px 0 #ffffff,
                    2px 2px 0 #f8f8f8,
                    3px 3px 0 #f0f0f0,
                    4px 4px 0 #e8e8e8,
                    5px 5px 0 #e0e0e0,
                    6px 6px 8px rgba(0,0,0,0.3)
                  `,
                  WebkitTextStroke: '4px #ffffff',
                  paintOrder: 'stroke fill',
                  fontWeight: '900',
                  zIndex: 10
                }}
              >
                ATMAN
              </span>
            </div>
          </div>
          
          {/* 副标题 */}
          <div className="mt-4">
            <p className="text-lg md:text-xl text-gray-400 tracking-widest uppercase animate-slide-up" style={{ animationDelay: '0.3s' }}>
              Everyone got an atman
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
        .perspective-1000 {
          perspective: 2000px;
          perspective-origin: 50% 50%;
        }
        
        .transform-3d {
          animation: horizontalThenVertical 16s linear infinite;
          transform-origin: center center;
        }
        
        @keyframes horizontalThenVertical {
          /* 第一阶段：水平旋转一圈 */
          0% { 
            transform: rotateY(0deg) translateZ(30px);
          }
          12.5% { 
            transform: rotateY(90deg) translateZ(50px);
          }
          25% { 
            transform: rotateY(180deg) translateZ(30px);
          }
          37.5% { 
            transform: rotateY(270deg) translateZ(50px);
          }
          48% { 
            transform: rotateY(360deg) translateZ(30px);
          }
          
          /* 短暂停顿 */
          50% { 
            transform: rotateY(360deg) translateZ(30px);
          }
          52% { 
            transform: rotateY(360deg) translateZ(30px);
          }
          
          /* 第二阶段：垂直旋转一圈 */
          62.5% { 
            transform: rotateY(360deg) rotateX(90deg) translateZ(50px);
          }
          75% { 
            transform: rotateY(360deg) rotateX(180deg) translateZ(30px);
          }
          87.5% { 
            transform: rotateY(360deg) rotateX(270deg) translateZ(50px);
          }
          98% { 
            transform: rotateY(360deg) rotateX(360deg) translateZ(30px);
          }
          100% { 
            transform: rotateY(360deg) rotateX(360deg) translateZ(30px);
          }
        }
        
        @keyframes letterFloat {
          0%, 100% {
            transform: translateZ(50px) rotateY(0deg) translateY(0px);
          }
          50% {
            transform: translateZ(70px) rotateY(5deg) translateY(-5px);
          }
        }
        
        @keyframes glow {
          0%, 100% { 
            filter: brightness(1) contrast(1);
          }
          50% { 
            filter: brightness(1.1) contrast(1.05);
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