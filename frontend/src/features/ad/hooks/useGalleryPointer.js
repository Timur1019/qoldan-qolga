import { useCallback, useRef } from 'react'

/** Пока жест короче — ось не зафиксирована (скролл страницы свободен). */
const AXIS_LOCK_PX = 8
/** Горизонтальный свайп для смены фото. */
const SWIPE_PX = 40
/** Тап без заметного движения. */
const TAP_PX = 12

/**
 * Свайп галереи без блокировки вертикального скролла.
 * Pointer capture только после явного горизонтального жеста.
 */
export function useGalleryPointer(count, setIndex, { onTap } = {}) {
  const startRef = useRef(null)
  /** @type {React.MutableRefObject<null | 'h' | 'v'>} */
  const axisRef = useRef(null)
  const suppressClickRef = useRef(false)

  const clear = useCallback(() => {
    startRef.current = null
    axisRef.current = null
  }, [])

  const onPointerDown = useCallback((e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    axisRef.current = null
    suppressClickRef.current = false
    startRef.current = {
      x: e.clientX,
      y: e.clientY,
      pointerId: e.pointerId,
      target: e.currentTarget,
    }
  }, [])

  const onPointerMove = useCallback((e) => {
    const start = startRef.current
    if (!start || start.pointerId !== e.pointerId) return

    const dx = e.clientX - start.x
    const dy = e.clientY - start.y

    if (axisRef.current == null) {
      if (Math.hypot(dx, dy) < AXIS_LOCK_PX) return
      const horizontal = Math.abs(dx) > Math.abs(dy)
      axisRef.current = horizontal && count > 1 ? 'h' : 'v'

      // Capture только для горизонтали — иначе страница/лента не скроллятся
      if (axisRef.current === 'h') {
        try {
          start.target.setPointerCapture(e.pointerId)
        } catch {
          /* ignore */
        }
      } else {
        // Вертикаль: отпускаем жест галерее, браузер скроллит
        clear()
      }
    }
  }, [clear, count])

  const finish = useCallback((e) => {
    const start = startRef.current
    if (!start || start.pointerId !== e.pointerId) {
      clear()
      return
    }

    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    const axis = axisRef.current

    try {
      if (start.target.hasPointerCapture?.(e.pointerId)) {
        start.target.releasePointerCapture(e.pointerId)
      }
    } catch {
      /* ignore */
    }

    clear()

    if (count > 1 && axis === 'h' && Math.abs(dx) >= SWIPE_PX) {
      suppressClickRef.current = true
      setIndex((i) => {
        const next = dx < 0 ? i + 1 : i - 1
        return Math.min(count - 1, Math.max(0, next))
      })
      return
    }

    if (axis === 'v') return

    if (Math.hypot(dx, dy) <= TAP_PX) {
      onTap?.(e)
    }
  }, [clear, count, onTap, setIndex])

  const onPointerUp = finish
  const onPointerCancel = useCallback((e) => {
    const start = startRef.current
    if (start?.pointerId === e.pointerId) {
      try {
        if (start.target.hasPointerCapture?.(e.pointerId)) {
          start.target.releasePointerCapture(e.pointerId)
        }
      } catch {
        /* ignore */
      }
    }
    clear()
  }, [clear])

  const onClickCapture = useCallback((e) => {
    if (!suppressClickRef.current) return
    e.preventDefault()
    e.stopPropagation()
    suppressClickRef.current = false
  }, [])

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onClickCapture,
  }
}
