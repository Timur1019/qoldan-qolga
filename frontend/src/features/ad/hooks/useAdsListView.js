import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PARAMS } from '../../../constants/routes'

export const ADS_VIEW = {
  LIST: 'list',
  GRID: 'grid',
  MAP: 'map',
}

const STORAGE_KEY = 'ads.layoutView'

function readStoredLayout() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === ADS_VIEW.GRID || stored === ADS_VIEW.LIST) return stored
  } catch {
    /* ignore */
  }
  return ADS_VIEW.LIST
}

function persistLayout(view) {
  if (view !== ADS_VIEW.LIST && view !== ADS_VIEW.GRID) return
  try {
    localStorage.setItem(STORAGE_KEY, view)
  } catch {
    /* ignore */
  }
}

export function useAdsListView() {
  const [searchParams, setSearchParams] = useSearchParams()
  const viewParam = searchParams.get(PARAMS.VIEW)

  const view = useMemo(() => {
    if (viewParam === ADS_VIEW.MAP || viewParam === ADS_VIEW.GRID || viewParam === ADS_VIEW.LIST) {
      return viewParam
    }
    return readStoredLayout()
  }, [viewParam])

  const setView = useCallback((next) => {
    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev)
      if (!next || next === ADS_VIEW.LIST) nextParams.delete(PARAMS.VIEW)
      else nextParams.set(PARAMS.VIEW, next)
      return nextParams
    }, { replace: true })
    persistLayout(next)
  }, [setSearchParams])

  const openMap = useCallback(() => {
    setView(ADS_VIEW.MAP)
  }, [setView])

  const closeMap = useCallback(() => {
    setView(readStoredLayout())
  }, [setView])

  return {
    view,
    isMap: view === ADS_VIEW.MAP,
    setView,
    openMap,
    closeMap,
  }
}
