import styles from './UiAlert.module.css'

export default function UiAlert({ variant = 'danger', compact = false, children }) {
  return (
    <div
      className={[
        styles.alert,
        variant === 'success' ? styles.success : styles.danger,
        compact ? styles.compact : '',
      ].filter(Boolean).join(' ')}
      role="alert"
    >
      <i
        className={`bi ${variant === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'}`}
        aria-hidden
      />
      <span>{children}</span>
    </div>
  )
}
