import { useState, useEffect } from 'react'
import { useLang } from '../../../../context/LangContext'
import { imageUrl } from '../../services/adApi'
import styles from './AdGallery.module.css'

export default function AdGallery({ images: rawImages, lightboxFooter }) {
  const { t } = useLang()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

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
          {images.length > 1 && (
            <>
              <button
                type="button"
                className={styles.galleryArrow}
                aria-label={t('ads.prevImage')}
                onClick={goPrev}
              >
                ‹
              </button>
              <button
                type="button"
                className={`${styles.galleryArrow} ${styles.galleryArrowRight}`}
                aria-label={t('ads.nextImage')}
                onClick={goNext}
              >
                ›
              </button>
            </>
          )}
          <div
            className={styles.mainImageClickable}
            onClick={() => mainImage && setLightboxOpen(true)}
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
          <div className={styles.lightboxImageWrap} onClick={(e) => e.stopPropagation()}>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  className={styles.lightboxArrow}
                  aria-label={t('ads.prevImage')}
                  onClick={(e) => { e.stopPropagation(); goPrev() }}
                >
                  ‹
                </button>
                <button
                  type="button"
                  className={`${styles.lightboxArrow} ${styles.lightboxArrowRight}`}
                  aria-label={t('ads.nextImage')}
                  onClick={(e) => { e.stopPropagation(); goNext() }}
                >
                  ›
                </button>
              </>
            )}
            <div className={styles.lightboxContent}>
              <img src={imageUrl(mainImage.url)} alt="" className={styles.lightboxImage} />
            </div>
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
