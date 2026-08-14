import { useState } from 'react'
import { imageUrl } from '../../services/adApi'
import AdImagePlaceholder from '../AdImagePlaceholder/AdImagePlaceholder'
import styles from './CardGallery.module.css'

export default function CardGallery({ imageUrls = [], className, imageWrapClassName, square = false }) {
  const urls = Array.isArray(imageUrls) ? imageUrls.filter(Boolean) : []
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [failed, setFailed] = useState(() => new Set())

  const usable = urls.filter((url) => !failed.has(url))
  const safeIndex = usable.length === 0 ? 0 : Math.min(selectedIndex, usable.length - 1)
  const mainUrl = usable[safeIndex]

  const handleMouseMove = (e) => {
    if (usable.length <= 1) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    const idx = Math.min(usable.length - 1, Math.max(0, Math.floor(ratio * usable.length)))
    setSelectedIndex(idx)
  }

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
      <span className={imageWrapClassName} onMouseMove={handleMouseMove}>
        <img
          src={imageUrl(mainUrl)}
          alt=""
          className={imageClass}
          loading="lazy"
          decoding="async"
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
