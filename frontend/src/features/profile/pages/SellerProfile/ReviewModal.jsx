import { useState, useEffect } from 'react'
import { useLang } from '@/context/LangContext'
import { UiAlert, UiButton, UiField, UiInput, UiModal } from '@/shared/ui'
import styles from './ReviewModal.module.css'

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

  return (
    <UiModal
      open={open}
      onClose={handleClose}
      title={t('reviews.modalTitle')}
      titleId="review-modal-title"
      footer={(
        <UiButton
          fullWidth
          loading={submitting}
          onClick={() => onSubmit({ rating, text })}
        >
          {submitting ? t('common.loading') : t('reviews.submit')}
        </UiButton>
      )}
    >
      <UiField label={t('reviews.ratingLabel')}>
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
      </UiField>
      <UiField htmlFor="review-text">
        <UiInput
          id="review-text"
          multiline
          rows={3}
          placeholder={t('reviews.textPlaceholder')}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </UiField>
      {error ? <UiAlert compact>{error}</UiAlert> : null}
    </UiModal>
  )
}
