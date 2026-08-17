import { useState } from 'react'
import { imageUrl } from '@/api/client'
import { useGalleryPointer } from '../../hooks/useGalleryPointer'
import AdImagePlaceholder from '../AdImagePlaceholder/AdImagePlaceholder'
import styles from './CardGallery.module.css'

export default function CardGallery({ imageUrls = [], className, imageWrapClassName, square = false }) {
  const urls = Array.isArray(imageUrls) ? imageUrls.filter(Boolean) : []
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [failed, setFailed] = useState(() => new Set())

  const usable = urls.filter((url) => !failed.has(url))
  const safeIndex = usable.length === 0 ? 0 : Math.min(selectedIndex, usable.length - 1)
  const mainUrl = usable[safeIndex]
  const pointer = useGalleryPointer(usable.length, setSelectedIndex)

  const handleError = (url) => {
    setFailed((prev) => {
      if (prev.has(url)) return prev
      const next = new Set(prev)
      next.add(url)
      return next
    })
    setSelectedIndex(0)
  }

  const imageClass = `${styles.image} ${square ? styles.imageSquare : ''}`

  if (!mainUrl) {
    return (
      <span className={`${styles.wrap} ${className || ''}`}>
        <AdImagePlaceholder className={imageWrapClassName} square={square} />
      </span>
    )
  }

  return (
    <span className={`${styles.wrap} ${className || ''}`}>
      <span
        className={`${imageWrapClassName || ''} ${styles.touchSurface}`}
        onPointerDown={pointer.onPointerDown}
        onPointerMove={pointer.onPointerMove}
        onPointerUp={pointer.onPointerUp}
        onPointerCancel={pointer.onPointerCancel}
        onClickCapture={pointer.onClickCapture}
      >
        <img
          src={imageUrl(mainUrl)}
          alt=""
          className={imageClass}
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={() => handleError(mainUrl)}
        />
      </span>
      {usable.length > 1 && (
        <span className={styles.dots} role="tablist" aria-hidden>
          {usable.map((_, idx) => (
            <span
              key={idx}
              className={`${styles.dot} ${safeIndex === idx ? styles.dotActive : ''}`}
              role="tab"
              aria-selected={safeIndex === idx}
            />
          ))}
        </span>
      )}
    </span>
  )
}
