import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Горизонтальная лента фото: нативный скролл (тач, трекпад, колесо).
 */
export function useGalleryScroll(count) {
  const trackRef = useRef(null)
  const [index, setIndex] = useState(0)
  const ignoreScrollRef = useRef(false)

  const onScroll = useCallback((e) => {
    if (ignoreScrollRef.current) return
    const el = e.currentTarget
    const w = el.clientWidth
    if (!w || count < 1) return
    const next = Math.round(el.scrollLeft / w)
    setIndex(Math.min(count - 1, Math.max(0, next)))
  }, [count])

  const goTo = useCallback((nextIndex, behavior = 'smooth') => {
    const el = trackRef.current
    const i = Math.min(count - 1, Math.max(0, nextIndex))
    setIndex(i)
    if (!el) return
    ignoreScrollRef.current = true
    el.scrollTo({ left: i * el.clientWidth, behavior })
    window.setTimeout(() => {
      ignoreScrollRef.current = false
    }, behavior === 'smooth' ? 420 : 50)
  }, [count])

  useEffect(() => {
    const el = trackRef.current
    if (!el || count < 2) return undefined
    const onWheel = (e) => {
      if (el.scrollWidth <= el.clientWidth) return
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      el.scrollLeft += e.deltaY
      e.preventDefault()
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [count])

  return { trackRef, index, goTo, onScroll }
}
