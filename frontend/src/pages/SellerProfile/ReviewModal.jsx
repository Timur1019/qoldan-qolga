/**
 * ReviewModal — модальное окно для оставления отзыва о продавце.
 * За что отвечает: выбор рейтинга (1–5 звёзд), ввод текста отзыва, отправка на сервер.
 * Состояние формы сбрасывается при открытии.
 */
import { useState, useEffect } from 'react'
import { useLang } from '../../context/LangContext'
import styles from './SellerProfile.module.css'

export default function ReviewModal({
  open,
  onClose,
  onSubmit,
  submitting,
  error,
}) {
  const { t } = useLang()
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')

  useEffect(() => {
    if (open) {
      setRating(5)
      setText('')
    }
  }, [open])

  const handleClose = () => {
    if (!submitting) onClose()
  }

  const handleSubmit = () => {
    onSubmit({ rating, text })
  }

  if (!open) return null

  return (
    <div
      className={styles.modalOverlay}
      onClick={handleClose}
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="review-modal-title"
      >
        <div className={styles.modalHeader}>
          <h2 id="review-modal-title" className={styles.modalTitle}>{t('reviews.modalTitle')}</h2>
          <button
            type="button"
            className={styles.modalClose}
            onClick={handleClose}
            aria-label={t('common.cancel')}
          >
            ×
          </button>
        </div>
        <div className={styles.modalBody}>
          <label className={styles.modalLabel}>
            {t('reviews.ratingLabel')}
            <div className={styles.ratingSelect}>
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`${styles.ratingBtn} ${rating === s ? styles.ratingBtnActive : ''}`}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setRating(s) }}
                  aria-pressed={rating === s}
                >
                  ★
                </button>
              ))}
            </div>
          </label>
          <label className={styles.modalLabel}>
            <textarea
              className={styles.reviewTextarea}
              placeholder={t('reviews.textPlaceholder')}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
            />
          </label>
          {error && <p className={styles.reviewError}>{error}</p>}
        </div>
        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.submitBtn}
            onClick={(e) => { e.preventDefault(); handleSubmit() }}
            disabled={submitting}
          >
            {submitting ? t('common.loading') : t('reviews.submit')}
          </button>
        </div>
      </div>
    </div>
  )
}
