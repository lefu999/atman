'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'zh' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('zh')
  const [translations, setTranslations] = useState<any>({})

  useEffect(() => {
    // 从 localStorage 获取保存的语言设置
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
      setLanguageState(savedLang)
    }
  }, [])

  useEffect(() => {
    // 动态加载语言包
    loadTranslations(language)
  }, [language])

  const loadTranslations = async (lang: Language) => {
    try {
      const module = await import(`../locales/${lang}.json`)
      setTranslations(module.default)
    } catch (error) {
      console.error('Failed to load translations:', error)
    }
  }

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return value || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}