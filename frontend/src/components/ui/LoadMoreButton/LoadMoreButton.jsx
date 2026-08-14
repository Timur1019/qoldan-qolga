import styles from './LoadMoreButton.module.css'

export default function LoadMoreButton({ loading, label, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`${styles.btn} ${className}`.trim()}
      disabled={loading || props.disabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <span className={styles.spinner} aria-hidden /> : null}
      <span>{label}</span>
    </button>
  )
}
