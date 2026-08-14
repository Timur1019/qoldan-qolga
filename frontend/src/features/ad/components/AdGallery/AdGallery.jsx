import { useState, useEffect } from 'react'
import { useLang } from '../../../../context/LangContext'
import { imageUrl } from '../../services/adApi'
import AdImagePlaceholder from '../AdImagePlaceholder/AdImagePlaceholder'
import styles from './AdGallery.module.css'

export default function AdGallery({ images: rawImages, lightboxFooter, overlay }) {
  const { t } = useLang()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [failedUrls, setFailedUrls] = useState(() => new Set())

  const images = (rawImages?.length
    ? [...rawImages].sort((a, b) => (a.orderNum ?? 0) - (b.orderNum ?? 0))
    : []
  ).filter((img) => img?.url && !failedUrls.has(img.url))
  const mainImage = images[selectedIndex] || images[0]

  const markFailed = (url) => {
    if (!url) return
    setFailedUrls((prev) => {
      if (prev.has(url)) return prev
      const next = new Set(prev)
      next.add(url)
      return next
    })
    setSelectedIndex(0)
  }

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
                <img src={imageUrl(img.url)} alt="" loading="lazy" decoding="async" onError={() => markFailed(img.url)} />
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
              const ratio = x / rect.width
              const idx = Math.min(images.length - 1, Math.max(0, Math.floor(ratio * images.length)))
              setSelectedIndex(idx)
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
              <img src={imageUrl(mainImage.url)} alt="" className={styles.mainImage} decoding="async" onError={() => markFailed(mainImage.url)} />
            ) : (
              <AdImagePlaceholder className={styles.mainImagePlaceholder} />
            )}
            {mainImage && (
              <div className={styles.mainImageHoverOverlay}>
                <span className={styles.enlargeText}>{t('ads.enlarge')}</span>
              </div>
            )}
          </div>
          {overlay}
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
              const ratio = x / rect.width
              const idx = Math.min(images.length - 1, Math.max(0, Math.floor(ratio * images.length)))
              setSelectedIndex(idx)
            }}
          >
            <div className={styles.lightboxContent}>
              <img src={imageUrl(mainImage.url)} alt="" className={styles.lightboxImage} decoding="async" onError={() => markFailed(mainImage.url)} />
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
