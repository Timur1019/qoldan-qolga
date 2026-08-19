import { STAT_CARDS } from './statCards'
import styles from './AdminStatsCards.module.css'

export default function AdminStatsCards({ stats, selected, onSelect, t }) {
  return (
    <div className={styles.grid}>
      {STAT_CARDS.map((card) => (
        <button
          key={card.key}
          type="button"
          className={`${styles.card} ${styles[card.tone]} ${selected === card.key ? styles.selected : ''}`}
          onClick={() => onSelect(card.key)}
        >
          <span className={styles.icon} aria-hidden>
            <i className={`bi ${card.icon}`} />
          </span>
          <strong className={styles.value}>{stats?.[card.key] ?? 0}</strong>
          <span className={styles.label}>{t(card.labelKey)}</span>
        </button>
      ))}
    </div>
  )
}
