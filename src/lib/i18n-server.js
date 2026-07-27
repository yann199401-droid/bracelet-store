import zh from '@/i18n/zh.json'
import en from '@/i18n/en.json'
import { cookies } from 'next/headers'

const messages = { zh, en }

function interpolate(msg, params) {
  if (!params || Object.keys(params).length === 0) return msg
  let result = msg
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value)
  }
  return result
}

export function getLocale() {
  const cookieStore = cookies()
  const saved = cookieStore.get('locale')?.value
  if (saved === 'en' || saved === 'zh') return saved
  return 'zh'
}

export function getTranslations(locale) {
  const dict = messages[locale] || messages.zh
  return (key, params = {}) => {
    const msg = dict[key]
    if (!msg) {
      const fallback = messages.zh?.[key]
      if (!fallback) return key
      return interpolate(fallback, params)
    }
    return interpolate(msg, params)
  }
}

export function t(locale, key, params = {}) {
  const dict = messages[locale] || messages.zh
  const msg = dict[key]
  if (!msg) {
    const fallback = messages.zh?.[key]
    if (!fallback) return key
    return interpolate(fallback, params)
  }
  return interpolate(msg, params)
}
