import { useEffect, useRef } from 'react'
import styles from './AdsFilterBar.module.css'

export default function FilterPopover({ open, onClose, children, className = '', align = 'left' }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose?.()
    }
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={ref}
      className={`${styles.popover} ${align === 'right' ? styles.popoverRight : ''} ${className}`}
      role="dialog"
    >
      {children}
    </div>
  )
}
