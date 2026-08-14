import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { referenceApi } from '../api/client'
import { useLang } from './LangContext'
import { buildRegionLabelMap, resolveRegionLabel } from '../utils/regionLabel'

const RegionsContext = createContext(null)

export function RegionsProvider({ children }) {
  const { lang } = useLang()
  const [regions, setRegions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    referenceApi
      .getRegions()
      .then((list) => {
        if (!alive) return
        setRegions(Array.isArray(list) ? list : [])
      })
      .catch(() => {
        if (alive) setRegions([])
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [])

  const labelMap = useMemo(() => buildRegionLabelMap(regions, lang), [regions, lang])

  const getRegionLabel = useCallback(
    (code) => {
      if (!code) return ''
      const key = String(code)
      return labelMap.get(key) || resolveRegionLabel(key, regions, lang)
    },
    [labelMap, regions, lang]
  )

  const value = useMemo(
    () => ({ regions, loading, getRegionLabel }),
    [regions, loading, getRegionLabel]
  )

  return <RegionsContext.Provider value={value}>{children}</RegionsContext.Provider>
}

export function useRegions() {
  const ctx = useContext(RegionsContext)
  if (!ctx) throw new Error('useRegions must be used within RegionsProvider')
  return ctx
}

/** Безопасно вне провайдера: вернёт код/humanize. */
export function useRegionLabel(code) {
  const ctx = useContext(RegionsContext)
  if (!code) return ''
  if (!ctx) return resolveRegionLabel(code, [], 'uz')
  return ctx.getRegionLabel(code)
}
