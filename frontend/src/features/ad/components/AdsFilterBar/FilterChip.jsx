import styles from './AdsFilterBar.module.css'

export default function FilterChip({
  label,
  active = false,
  open = false,
  hasChevron = false,
  onClick,
  onClear,
  icon,
}) {
  return (
    <div className={`${styles.chipWrap} ${active ? styles.chipWrapActive : ''} ${open ? styles.chipWrapOpen : ''}`}>
      <button
        type="button"
        className={styles.chip}
        onClick={onClick}
        aria-pressed={active || open}
      >
        {icon ? <span className={styles.chipIcon} aria-hidden>{icon}</span> : null}
        <span className={styles.chipLabel}>{label}</span>
        {hasChevron ? <i className={`bi bi-chevron-down ${styles.chipChevron}`} aria-hidden /> : null}
      </button>
      {active && onClear ? (
        <button
          type="button"
          className={styles.chipClear}
          onClick={(e) => {
            e.stopPropagation()
            onClear()
          }}
          aria-label="Clear"
        >
          <i className="bi bi-x" aria-hidden />
        </button>
      ) : null}
    </div>
  )
}
