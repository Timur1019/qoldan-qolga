import { useState } from 'react'
import { useLang } from '../../../../context/LangContext'
import { imageUrl } from '@/api/client'
import { sortImagesMainFirst } from '../../utils/galleryImageUrls'
import { useGalleryScroll } from '../../hooks/useGalleryScroll'
import AdImagePlaceholder from '../AdImagePlaceholder/AdImagePlaceholder'
import AdGalleryLightbox from './AdGalleryLightbox'
import AdGalleryNav from './AdGalleryNav'
import styles from './AdGallery.module.css'

export default function AdGallery({ images: rawImages, lightboxFooter, overlay }) {
  const { t } = useLang()
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [failedUrls, setFailedUrls] = useState(() => new Set())

  const images = sortImagesMainFirst(rawImages)
    .filter((img) => img?.url && !failedUrls.has(img.url))

  const gallery = useGalleryScroll(images.length)

  const markFailed = (url) => {
    if (!url) return
    setFailedUrls((prev) => {
      if (prev.has(url)) return prev
      const next = new Set(prev)
      next.add(url)
      return next
    })
    gallery.goTo(0, 'auto')
  }

  return (
    <>
      <div className={styles.galleryWrap}>
        {images.length > 1 && (
          <div className={styles.thumbStrip}>
            {images.map((img, idx) => (
              <button
                key={img.id || `${img.url}-${idx}`}
                type="button"
                className={`${styles.thumbBtn} ${gallery.index === idx ? styles.thumbBtnActive : ''}`}
                onClick={() => gallery.goTo(idx)}
              >
                <img src={imageUrl(img.url)} alt="" loading="lazy" decoding="async" onError={() => markFailed(img.url)} />
              </button>
            ))}
          </div>
        )}
        <div className={styles.mainImageWrap}>
          {images.length === 0 ? (
            <AdImagePlaceholder className={styles.mainImagePlaceholder} />
          ) : (
            <div
              ref={gallery.trackRef}
              className={styles.track}
              onScroll={gallery.onScroll}
            >
              {images.map((img, idx) => (
                <div
                  key={img.id || `${img.url}-${idx}`}
                  className={styles.slide}
                  role="button"
                  tabIndex={0}
                  onClick={() => setLightboxOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setLightboxOpen(true)
                    }
                  }}
                  aria-label={t('ads.enlarge')}
                >
                  <img
                    src={imageUrl(img.url)}
                    alt=""
                    className={styles.mainImage}
                    decoding="async"
                    draggable={false}
                    onError={() => markFailed(img.url)}
                  />
                </div>
              ))}
            </div>
          )}
          {images.length > 0 && (
            <div className={styles.mainImageHoverOverlay} aria-hidden>
              <span className={styles.enlargeText}>{t('ads.enlarge')}</span>
            </div>
          )}
          {overlay}
          <AdGalleryNav
            index={gallery.index}
            count={images.length}
            onPrev={() => gallery.goTo(gallery.index - 1)}
            onNext={() => gallery.goTo(gallery.index + 1)}
            prevLabel={t('ads.prevImage')}
            nextLabel={t('ads.nextImage')}
          />
          {images.length > 1 && (
            <div className={styles.dots} role="tablist" aria-label={t('ads.imageCount')}>
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`${styles.dot} ${gallery.index === idx ? styles.dotActive : ''}`}
                  aria-selected={gallery.index === idx}
                  aria-label={`${idx + 1} / ${images.length}`}
                  onClick={() => gallery.goTo(idx)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {lightboxOpen && images.length > 0 && (
        <AdGalleryLightbox
          images={images}
          startIndex={gallery.index}
          onClose={() => setLightboxOpen(false)}
          onIndexChange={(i) => gallery.goTo(i, 'auto')}
          footer={lightboxFooter}
          onImageError={markFailed}
        />
      )}
    </>
  )
}
