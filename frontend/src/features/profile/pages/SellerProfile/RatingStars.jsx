/**
 * RatingStars — UI-компонент отображения рейтинга звёздами.
 * За что отвечает: визуализация оценки (заполненные и пустые звёзды).
 * Используется в отзывах и в разбивке рейтинга.
 */
import styles from './RatingStars.module.css'

export default function RatingStars({ rating, maxStars = 5 }) {
  return (
    <span className={styles.stars}>
      {Array.from({ length: maxStars }, (_, i) => (
        <span
          key={i}
          className={i < rating ? styles.starFilled : styles.starEmpty}
          aria-hidden
        >
          ★
        </span>
      ))}
    </span>
  )
}
