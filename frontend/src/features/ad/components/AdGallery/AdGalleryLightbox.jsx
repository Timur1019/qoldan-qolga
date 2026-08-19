import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useLang } from '../../../../context/LangContext'
import { imageUrl } from '@/api/client'
import { useGalleryScroll } from '../../hooks/useGalleryScroll'
import styles from './AdGallery.module.css'

export default function AdGalleryLightbox({
  images,
  startIndex,
  onClose,
  onIndexChange,
  footer,
  onImageError,
}) {
  const { t } = useLang()
  const { trackRef, index, goTo, onScroll } = useGalleryScroll(images.length)
  const openedAt = useRef(Date.now())
  const synced = useRef(false)
  const lastSent = useRef(startIndex)

  useEffect(() => {
    if (synced.current) return
    synced.current = true
    goTo(startIndex, 'auto')
  }, [goTo, startIndex])

  useEffect(() => {
    if (lastSent.current === index) return
    lastSent.current = index
    onIndexChange?.(index)
  }, [index, onIndexChange])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') goTo(index + 1)
      if (e.key === 'ArrowLeft') goTo(index - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [goTo, index, onClose])

  const closeFromOverlay = (e) => {
    if (e.target !== e.currentTarget) return
    if (Date.now() - openedAt.current < 350) return
    onClose()
  }

  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      className={styles.lightboxOverlay}
      onClick={closeFromOverlay}
      role="dialog"
      aria-modal="true"
      aria-label={t('ads.enlarge')}
    >
      <button
        type="button"
        className={styles.lightboxClose}
        onClick={onClose}
        aria-label={t('common.cancel')}
      >
        ✕
      </button>
      {images.length > 1 && (
        <>
          <button
            type="button"
            className={`${styles.lightboxNav} ${styles.lightboxNavPrev}`}
            onClick={() => goTo(index - 1)}
            disabled={index <= 0}
            aria-label="Prev"
          >
            ‹
          </button>
          <button
            type="button"
            className={`${styles.lightboxNav} ${styles.lightboxNavNext}`}
            onClick={() => goTo(index + 1)}
            disabled={index >= images.length - 1}
            aria-label="Next"
          >
            ›
          </button>
        </>
      )}
      <div className={styles.lightboxImageWrap} onClick={(e) => e.stopPropagation()}>
        <div
          ref={trackRef}
          className={styles.lightboxTrack}
          onScroll={onScroll}
        >
          {images.map((img, idx) => (
            <div key={img.id || `${img.url}-${idx}`} className={styles.lightboxSlide}>
              <img
                src={imageUrl(img.url)}
                alt=""
                className={styles.lightboxImage}
                draggable={false}
                onError={() => onImageError?.(img.url)}
              />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <div className={styles.lightboxDots} role="tablist" aria-label={t('ads.imageCount')}>
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`${styles.dot} ${styles.dotLightbox} ${index === idx ? styles.dotActive : ''}`}
                aria-selected={index === idx}
                aria-label={`${idx + 1} / ${images.length}`}
                onClick={() => goTo(idx)}
              />
            ))}
          </div>
        )}
      </div>
      {footer ? (
        <div className={styles.lightboxFooter} onClick={(e) => e.stopPropagation()}>
          {footer}
        </div>
      ) : null}
    </div>,
    document.body
  )
}
