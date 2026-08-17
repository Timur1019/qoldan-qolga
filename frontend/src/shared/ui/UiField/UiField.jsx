import styles from './UiField.module.css'

export default function UiField({ label, hint, error, htmlFor, className = '', children }) {
  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      {label ? (
        <label className={styles.label} htmlFor={htmlFor}>{label}</label>
      ) : null}
      {hint ? <p className={styles.hint}>{hint}</p> : null}
      {children}
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  )
}
