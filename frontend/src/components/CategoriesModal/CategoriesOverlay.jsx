import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import CategoriesModal from './CategoriesModal'
import styles from './CategoriesOverlay.module.css'

export default function CategoriesOverlay({ open, onClose, headerOffset = 0 }) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className={styles.layer}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={styles.panelSlot}
        style={{ top: headerOffset }}
        onClick={(e) => e.stopPropagation()}
      >
        <CategoriesModal onClose={onClose} />
      </div>
    </div>,
    document.body
  )
}
