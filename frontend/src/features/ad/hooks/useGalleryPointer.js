import { useCallback, useRef } from 'react'

const TAP_PX = 12

export function galleryIndexFromX(clientX, el, count) {
  if (count <= 1 || !el) return 0
  const rect = el.getBoundingClientRect()
  const ratio = (clientX - rect.left) / Math.max(rect.width, 1)
  return Math.min(count - 1, Math.max(0, Math.floor(ratio * count)))
}

export function useGalleryPointer(count, setIndex, { onTap } = {}) {
  const startRef = useRef(null)
  const swipedRef = useRef(false)

  const onPointerDown = useCallback((e) => {
    if (count <= 1) return
    swipedRef.current = false
    startRef.current = { x: e.clientX, y: e.clientY }
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
  }, [count])

  const onPointerMove = useCallback((e) => {
    if (count <= 1) return
    const start = startRef.current
    if (start) {
      const dx = e.clientX - start.x
      const dy = e.clientY - start.y
      if (Math.hypot(dx, dy) > TAP_PX) swipedRef.current = true
    }
    setIndex(galleryIndexFromX(e.clientX, e.currentTarget, count))
  }, [count, setIndex])

  const onPointerUp = useCallback((e) => {
    const start = startRef.current
    startRef.current = null
    if (count <= 1) {
      onTap?.(e)
      return
    }
    if (!start) return
    const moved = Math.hypot(e.clientX - start.x, e.clientY - start.y) > TAP_PX
    if (moved) {
      swipedRef.current = true
      return
    }
    onTap?.(e)
  }, [count, onTap])

  const onPointerCancel = useCallback(() => {
    startRef.current = null
  }, [])

  const onClickCapture = useCallback((e) => {
    if (!swipedRef.current) return
    e.preventDefault()
    e.stopPropagation()
    swipedRef.current = false
  }, [])

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onClickCapture,
  }
}
