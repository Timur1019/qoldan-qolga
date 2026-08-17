import { useEffect, useMemo, useState } from 'react'
import { referenceApi } from '@/api/reference'

const cache = new Map()

export default function useCategoryLabels(ads, lang) {
  const codeKey = useMemo(() => {
    const unique = [...new Set((Array.isArray(ads) ? ads : []).map((ad) => ad?.category).filter(Boolean))]
    unique.sort()
    return unique.join('|')
  }, [ads])

  const codes = useMemo(() => (codeKey ? codeKey.split('|') : []), [codeKey])
  const [version, setVersion] = useState(0)

  useEffect(() => {
    const missing = codes.filter((code) => !cache.has(code))
    if (missing.length === 0) return undefined
    let cancelled = false
    Promise.all(missing.map((code) => (
      referenceApi.getCategory(code)
        .then((info) => ({ code, info: info || null }))
        .catch(() => ({ code, info: null }))
    ))).then((rows) => {
      rows.forEach(({ code, info }) => cache.set(code, info))
      if (!cancelled) setVersion((n) => n + 1)
    })
    return () => { cancelled = true }
  }, [codeKey, codes])

  return useMemo(() => {
    const labels = {}
    codes.forEach((code) => {
      const info = cache.get(code)
      labels[code] = info ? (lang === 'ru' ? info.nameRu : info.nameUz) : ''
    })
    return labels
  }, [codes, lang, version])
}
