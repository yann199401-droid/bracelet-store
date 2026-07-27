'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import zh from '@/i18n/zh.json'
import en from '@/i18n/en.json'

const messages = { zh, en }
const COOKIE_NAME = 'locale'

function getCookie(name) {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? decodeURIComponent(match[2]) : null
}

function setCookie(name, value) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`
}

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState('zh')

  // Initialize from cookie on mount
  useEffect(() => {
    const saved = getCookie(COOKIE_NAME)
    if (saved === 'en' || saved === 'zh') {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = useCallback((newLocale) => {
    setLocaleState(newLocale)
    setCookie(COOKIE_NAME, newLocale)
  }, [])

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'zh' ? 'en' : 'zh')
  }, [locale, setLocale])

  const t = useCallback((key, params = {}) => {
    const msg = messages[locale]?.[key]
    if (!msg) {
      // Fallback to zh
      const fallback = messages.zh?.[key]
      if (!fallback) return key
      return interpolate(fallback, params)
    }
    return interpolate(msg, params)
  }, [locale])

  return (
    <I18nContext.Provider value={{ locale, setLocale, toggleLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

function interpolate(msg, params) {
  if (!params || Object.keys(params).length === 0) return msg
  let result = msg
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value)
  }
  return result
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
