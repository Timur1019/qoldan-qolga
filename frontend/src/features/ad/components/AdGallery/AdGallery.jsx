import { useState, useEffect, useRef } from 'react'
import { useLang } from '../../../../context/LangContext'
import { imageUrl } from '../../services/adApi'
import styles from './AdGallery.module.css'

export default function AdGallery({ images: rawImages, lightboxFooter }) {
  const { t } = useLang()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const lastSideRef = useRef(null)
  const lastSideLightboxRef = useRef(null)

  const images = rawImages?.length
    ? [...rawImages].sort((a, b) => (a.orderNum ?? 0) - (b.orderNum ?? 0))
    : []
  const mainImage = images[selectedIndex] || images[0]

  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e) => { if (e.key === 'Escape') setLightboxOpen(false) }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [lightboxOpen])

  const goPrev = (e) => {
    e?.stopPropagation()
    setSelectedIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  }
  const goNext = (e) => {
    e?.stopPropagation()
    setSelectedIndex((i) => (i === images.length - 1 ? 0 : i + 1))
  }

  return (
    <>
      <div className={styles.galleryWrap}>
        {images.length > 1 && (
          <div className={styles.thumbStrip}>
            {images.map((img, idx) => (
              <button
                key={img.id}
                type="button"
                className={`${styles.thumbBtn} ${selectedIndex === idx ? styles.thumbBtnActive : ''}`}
                onClick={() => setSelectedIndex(idx)}
              >
                <img src={imageUrl(img.url)} alt="" />
              </button>
            ))}
          </div>
        )}
        <div className={styles.mainImageWrap}>
          <div
            className={styles.mainImageClickable}
            onClick={() => mainImage && setLightboxOpen(true)}
            onMouseMove={(e) => {
              if (images.length <= 1) return
              const rect = e.currentTarget.getBoundingClientRect()
              const x = e.clientX - rect.left
              const side = x < rect.width / 2 ? 'left' : 'right'
              if (lastSideRef.current === null) {
                lastSideRef.current = side
                return
              }
              if (lastSideRef.current !== side) {
                lastSideRef.current = side
                if (side === 'left') goPrev()
                else goNext()
              }
            }}
            onMouseLeave={() => {
              lastSideRef.current = null
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                mainImage && setLightboxOpen(true)
              }
            }}
            aria-label={t('ads.enlarge')}
          >
            {mainImage ? (
              <img src={imageUrl(mainImage.url)} alt="" className={styles.mainImage} />
            ) : (
              <div className={styles.mainImagePlaceholder} />
            )}
            {mainImage && (
              <div className={styles.mainImageHoverOverlay}>
                <span className={styles.enlargeText}>{t('ads.enlarge')}</span>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className={styles.dots} role="tablist" aria-label={t('ads.imageCount')}>
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`${styles.dot} ${selectedIndex === idx ? styles.dotActive : ''}`}
                  role="tab"
                  aria-selected={selectedIndex === idx}
                  aria-label={`${idx + 1} / ${images.length}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {lightboxOpen && mainImage && (
        <div
          className={styles.lightboxOverlay}
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={t('ads.enlarge')}
        >
          <button
            type="button"
            className={styles.lightboxClose}
            onClick={(e) => { e.stopPropagation(); setLightboxOpen(false) }}
            aria-label={t('common.cancel')}
          >
            ✕
          </button>
          <div
            className={styles.lightboxImageWrap}
            onClick={(e) => e.stopPropagation()}
            onMouseMove={(e) => {
              if (images.length <= 1) return
              const rect = e.currentTarget.getBoundingClientRect()
              const x = e.clientX - rect.left
              const side = x < rect.width / 2 ? 'left' : 'right'
              if (lastSideLightboxRef.current === null) {
                lastSideLightboxRef.current = side
                return
              }
              if (lastSideLightboxRef.current !== side) {
                lastSideLightboxRef.current = side
                if (side === 'left') goPrev()
                else goNext()
              }
            }}
            onMouseLeave={() => {
              lastSideLightboxRef.current = null
            }}
          >
            <div className={styles.lightboxContent}>
              <img src={imageUrl(mainImage.url)} alt="" className={styles.lightboxImage} />
            </div>
            {images.length > 1 && (
              <div className={styles.lightboxDots} role="tablist" aria-label={t('ads.imageCount')}>
                {images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`${styles.dot} ${styles.dotLightbox} ${selectedIndex === idx ? styles.dotActive : ''}`}
                    role="tab"
                    aria-selected={selectedIndex === idx}
                    aria-label={`${idx + 1} / ${images.length}`}
                  />
                ))}
              </div>
            )}
          </div>
          {lightboxFooter && (
            <div className={styles.lightboxFooter} onClick={(e) => e.stopPropagation()}>
              {lightboxFooter}
            </div>
          )}
        </div>
      )}
    </>
  )
}
