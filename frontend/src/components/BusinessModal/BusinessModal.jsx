import styles from './BusinessModal.module.css'

export default function BusinessModal({ open, onClose, onProceed }) {
  if (!open) return null

  const handleBackdropClick = () => {
    onClose?.()
  }

  const handleContentClick = (e) => {
    e.stopPropagation()
  }

  const handleProceed = () => {
    onProceed?.()
  }

  return (
    <div className={styles.overlay} onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <div className={`app-card position-relative p-4 ${styles.modal}`} onClick={handleContentClick}>
        <button
          type="button"
          className="btn btn-link position-absolute top-0 end-0 p-2 text-secondary text-decoration-none"
          onClick={onClose}
          aria-label="Закрыть"
        >
          <i className="bi bi-x-lg" aria-hidden />
        </button>
        <div className={styles.illustrationWrap} aria-hidden>
          <div className={styles.illustration} />
        </div>
        <div className="pt-0">
          <h2 className="h5 mb-2">Qoldan Qolga для бизнеса</h2>
          <p className="text-muted small mb-3">
            Регистрируйтесь как профессиональный продавец и продавайте эффективнее.
          </p>
          <button type="button" className="btn btn-primary w-100" onClick={handleProceed}>
            Подать заявку
          </button>
        </div>
      </div>
    </div>
  )
}

