'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingBag, Search, User, Menu, X, Heart, Globe } from 'lucide-react'
import useCartStore from '../store/cartStore'
import CartDrawer from './CartDrawer'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const cartItems = useCartStore((state) => state.items)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const { language, setLanguage, t } = useLanguage()
  const { user } = useAuth()

  const navLinks = [
    { href: '/new-arrivals', label: t('nav.newArrivals') },
    { href: '/vintage', label: t('nav.vintage'), special: true },
    { href: '/category/t-shirt', label: t('nav.tshirt') },
    { href: '/category/hoodie', label: t('nav.hoodie') },
    { href: '/category/jacket', label: t('nav.jacket') },
    { href: '/category/pants', label: t('nav.pants') },
    { href: '/category/hat', label: t('nav.hat') },
    { href: '/sale', label: t('nav.sale') },
  ]

  return (
    <nav className="bg-black text-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              className="md:hidden mr-4"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <Link href="/" className="text-2xl font-bold tracking-wider">
              ATMAN
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-gray-300 transition-colors ${
                  link.special 
                    ? 'text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1' 
                    : ''
                }`}
              >
                {link.special && (
                  <span className="text-xs">✨</span>
                )}
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hover:text-gray-300 transition-colors"
            >
              <Search size={20} />
            </button>
            
            <Link href="/wishlist" className="hover:text-gray-300 transition-colors">
              <Heart size={20} />
            </Link>
            
            <Link 
              href={user ? "/account" : "/login"} 
              className="hover:text-gray-300 transition-colors flex items-center gap-1"
            >
              <User size={20} />
              {user && (
                <span className="text-xs hidden lg:inline">{user.name?.split(' ')[0]}</span>
              )}
            </Link>
            
            {/* 语言切换 */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="hover:text-gray-300 transition-colors flex items-center gap-1"
              >
                <Globe size={20} />
                <span className="text-sm">{language === 'zh' ? '中文' : 'EN'}</span>
              </button>
              
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg py-2 w-32 z-50">
                  <button
                    onClick={() => {
                      setLanguage('zh')
                      setIsLangMenuOpen(false)
                    }}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${language === 'zh' ? 'bg-gray-100' : ''}`}
                  >
                    中文
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('en')
                      setIsLangMenuOpen(false)
                    }}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${language === 'en' ? 'bg-gray-100' : ''}`}
                  >
                    English
                  </button>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="hover:text-gray-300 transition-colors relative"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="pb-4">
            <input
              type="search"
              placeholder={t('nav.search')}
              className="w-full px-4 py-2 bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
        )}

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2 hover:text-gray-300 transition-colors ${
                  link.special 
                    ? 'text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1' 
                    : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.special && (
                  <span className="text-xs">✨</span>
                )}
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  )
}