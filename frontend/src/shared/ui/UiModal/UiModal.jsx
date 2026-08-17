import styles from './UiModal.module.css'
import UiButton from '../UiButton/UiButton'

export default function UiModal({
  open,
  onClose,
  title,
  titleId = 'ui-modal-title',
  children,
  footer,
  wide = false,
}) {
  if (!open) return null

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
    >
      <div className={[styles.panel, wide ? styles.wide : ''].filter(Boolean).join(' ')}>
        {(title || onClose) ? (
          <div className={styles.head}>
            {title ? <h2 id={titleId} className={styles.title}>{title}</h2> : <span />}
            {onClose ? (
              <UiButton
                variant="ghost"
                size="sm"
                className={styles.close}
                onClick={onClose}
                aria-label="Закрыть"
              >
                ×
              </UiButton>
            ) : null}
          </div>
        ) : null}
        <div className={styles.body}>{children}</div>
        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>
    </div>
  )
}
