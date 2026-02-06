import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { translations, getStoredLang, setStoredLang } from '../i18n/translations'

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(getStoredLang)

  const setLang = useCallback((l) => {
    if (l !== 'uz' && l !== 'ru') return
    setLangState(l)
    setStoredLang(l)
  }, [])

  const t = useCallback((key) => {
    const parts = key.split('.')
    let value = translations[lang]
    for (const p of parts) {
      value = value?.[p]
    }
    return value ?? key
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}
