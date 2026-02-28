import { useState } from 'react'
import { imageUrl } from '../../services/adApi'
import styles from './CardGallery.module.css'

export default function CardGallery({ imageUrls = [], className, imageWrapClassName }) {
  const urls = Array.isArray(imageUrls) ? imageUrls.filter(Boolean) : []
  const [selectedIndex, setSelectedIndex] = useState(0)

  const mainUrl = urls[selectedIndex] ?? urls[0]

  const handleMouseMove = (e) => {
    if (urls.length <= 1) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const ratio = x / rect.width
    const idx = Math.min(urls.length - 1, Math.max(0, Math.floor(ratio * urls.length)))
    setSelectedIndex(idx)
  }

  if (!mainUrl) {
    return <div className={`${styles.placeholder} ${imageWrapClassName || ''}`} />
  }

  return (
    <span className={`${styles.wrap} ${className || ''}`}>
      <span
        className={imageWrapClassName}
        onMouseMove={handleMouseMove}
      >
        <img src={imageUrl(mainUrl)} alt="" className={styles.image} />
      </span>
      {urls.length > 1 && (
        <span className={styles.dots} role="tablist" aria-hidden>
          {urls.map((_, idx) => (
            <span
              key={idx}
              className={`${styles.dot} ${selectedIndex === idx ? styles.dotActive : ''}`}
              role="tab"
              aria-selected={selectedIndex === idx}
            />
          ))}
        </span>
      )}
    </span>
  )
}
