import { useState } from 'react'
import { imageUrl } from '@/api/client'
import { useCardGalleryPeek } from '../../hooks/useCardGalleryPeek'
import AdImagePlaceholder from '../AdImagePlaceholder/AdImagePlaceholder'
import styles from './CardGallery.module.css'

export default function CardGallery({ imageUrls = [], className, imageWrapClassName, square = false }) {
  const urls = Array.isArray(imageUrls) ? imageUrls.filter(Boolean) : []
  const [failed, setFailed] = useState(() => new Set())
  const usable = urls.filter((url) => !failed.has(url))
  const peek = useCardGalleryPeek(usable.length)
  const current = usable[peek.index] || usable[0]

  const handleError = (url) => {
    setFailed((prev) => {
      if (prev.has(url)) return prev
      const next = new Set(prev)
      next.add(url)
      return next
    })
    peek.reset()
  }

  if (!usable.length) {
    return (
      <span className={`${styles.wrap} ${className || ''}`}>
        <AdImagePlaceholder className={imageWrapClassName} square={square} />
      </span>
    )
  }

  return (
    <span
      ref={peek.wrapRef}
      className={`${styles.wrap} ${className || ''}`}
      onMouseMove={peek.onMove}
      onMouseLeave={peek.reset}
      onPointerDown={peek.onPointerDown}
      onPointerUp={peek.onPointerUp}
      onClickCapture={peek.onClickCapture}
      onDragStart={(e) => e.preventDefault()}
    >
      <span className={`${imageWrapClassName || ''} ${styles.frame}`}>
        <img
          src={imageUrl(current)}
          alt=""
          className={styles.image}
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={() => handleError(current)}
        />
      </span>
      {usable.length > 1 && (
        <span className={styles.dots} role="tablist" aria-hidden>
          {usable.map((_, idx) => (
            <span
              key={idx}
              className={`${styles.dot} ${peek.index === idx ? styles.dotActive : ''}`}
            />
          ))}
        </span>
      )}
    </span>
  )
}
