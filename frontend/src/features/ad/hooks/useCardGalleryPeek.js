import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Листание фото на карточке: наведение, колесо/трекпад.
 * При уходе курсора возвращает главное фото.
 */
export function useCardGalleryPeek(count) {
  const wrapRef = useRef(null)
  const accRef = useRef(0)
  const [index, setIndex] = useState(0)

  const startXRef = useRef(null)
  const swipedRef = useRef(false)

  const reset = useCallback(() => {
    accRef.current = 0
    startXRef.current = null
    setIndex(0)
  }, [])

  const onPointerDown = useCallback((e) => {
    if (count < 2) return
    startXRef.current = e.clientX
    swipedRef.current = false
  }, [count])

  const onPointerUp = useCallback((e) => {
    if (count < 2 || startXRef.current == null) return
    const dx = e.clientX - startXRef.current
    startXRef.current = null
    if (Math.abs(dx) < 28) return
    swipedRef.current = true
    setIndex((cur) => Math.min(count - 1, Math.max(0, cur + (dx < 0 ? 1 : -1))))
  }, [count])

  const onClickCapture = useCallback((e) => {
    if (!swipedRef.current) return
    e.preventDefault()
    e.stopPropagation()
    swipedRef.current = false
  }, [])

  const onMove = useCallback((e) => {
    if (count < 2) return
    const rect = e.currentTarget.getBoundingClientRect()
    if (!rect.width) return
    const ratio = Math.min(0.999, Math.max(0, (e.clientX - rect.left) / rect.width))
    setIndex(Math.floor(ratio * count))
  }, [count])

  useEffect(() => {
    const el = wrapRef.current
    if (!el || count < 2) return undefined

    const onWheel = (e) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      if (!delta) return
      e.preventDefault()
      e.stopPropagation()
      accRef.current += delta
      if (Math.abs(accRef.current) < 36) return
      const dir = accRef.current > 0 ? 1 : -1
      accRef.current = 0
      setIndex((cur) => Math.min(count - 1, Math.max(0, cur + dir)))
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [count])

  useEffect(() => {
    if (index > count - 1) setIndex(0)
  }, [count, index])

  return { wrapRef, index, onMove, reset, onPointerDown, onPointerUp, onClickCapture }
}
