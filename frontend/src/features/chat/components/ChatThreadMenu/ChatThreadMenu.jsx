import { useEffect, useRef } from 'react'
import styles from './ChatThreadMenu.module.css'

export default function ChatThreadMenu({
  open,
  muted,
  onToggle,
  onClose,
  onMute,
  onBlock,
  onReport,
  onDelete,
  t,
}) {
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [open, onClose])

  return (
    <div className={styles.menuWrap} ref={ref}>
      <button
        type="button"
        className={styles.menuBtn}
        onClick={onToggle}
        aria-label={t('chat.menu')}
        aria-expanded={open}
      >
        <i className="bi bi-three-dots-vertical" aria-hidden />
      </button>
      {open && (
        <div className={styles.dropdown} role="menu">
          <button type="button" className={styles.item} role="menuitem" onClick={onMute}>
            <i className={`bi ${muted ? 'bi-bell' : 'bi-bell-slash'}`} aria-hidden />
            {muted ? t('chat.unmute') : t('chat.mute')}
          </button>
          <button type="button" className={styles.item} role="menuitem" onClick={onBlock}>
            <i className="bi bi-slash-circle" aria-hidden />
            {t('chat.blockUser')}
          </button>
          <button type="button" className={styles.item} role="menuitem" onClick={onReport}>
            <i className="bi bi-flag" aria-hidden />
            {t('chat.reportUser')}
          </button>
          <button type="button" className={`${styles.item} ${styles.itemDanger}`} role="menuitem" onClick={onDelete}>
            <i className="bi bi-trash" aria-hidden />
            {t('chat.deleteChat')}
          </button>
        </div>
      )}
    </div>
  )
}
