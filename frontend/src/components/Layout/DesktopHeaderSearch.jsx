import styles from './DesktopHeaderSearch.module.css'

export default function DesktopHeaderSearch({
  value,
  onChange,
  onSubmit,
  placeholder,
  findLabel,
}) {
  return (
    <form className={styles.search} onSubmit={onSubmit} role="search">
      <div className={styles.field}>
        <i className={`bi bi-search ${styles.icon}`} aria-hidden />
        <input
          type="search"
          className={styles.input}
          placeholder={placeholder}
          aria-label={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <button type="submit" className={styles.find}>
        {findLabel}
      </button>
    </form>
  )
}
