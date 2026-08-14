import styles from './AdImagePlaceholder.module.css'

export default function AdImagePlaceholder({ className = '', compact = false, square = false }) {
  return (
    <div
      className={`${styles.box} ${square ? styles.square : ''} ${compact ? styles.compact : ''} ${className}`.trim()}
      aria-hidden
    >
      <i className="bi bi-image" />
    </div>
  )
}
