import { useState, useRef } from 'react'
import { imageUrl } from '../../services/adApi'
import styles from './CardGallery.module.css'

/**
 * Компактная галерея для карточки объявления: переключение по курсору (левая/правая половина), точки снизу.
 * Без стрелок и без лайтбокса — клик ведёт на страницу объявления.
 */
export default function CardGallery({ imageUrls = [], className, imageWrapClassName }) {
  const urls = Array.isArray(imageUrls) ? imageUrls.filter(Boolean) : []
  const [selectedIndex, setSelectedIndex] = useState(0)
  const lastSideRef = useRef(null)

  const mainUrl = urls[selectedIndex] ?? urls[0]

  const goPrev = () => {
    setSelectedIndex((i) => (i <= 0 ? urls.length - 1 : i - 1))
  }
  const goNext = () => {
    setSelectedIndex((i) => (i >= urls.length - 1 ? 0 : i + 1))
  }

  const handleMouseMove = (e) => {
    if (urls.length <= 1) return
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
  }

  const handleMouseLeave = () => {
    lastSideRef.current = null
  }

  if (!mainUrl) {
    return <div className={`${styles.placeholder} ${imageWrapClassName || ''}`} />
  }

  return (
    <span className={`${styles.wrap} ${className || ''}`}>
      <span
        className={imageWrapClassName}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
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
