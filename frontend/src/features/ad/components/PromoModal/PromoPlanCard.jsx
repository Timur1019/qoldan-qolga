import styles from './PromoPlanCard.module.css'

function formatMoney(price) {
  if (price == null) return ''
  return `${Number(price).toLocaleString('ru-RU')} сум`
}

export default function PromoPlanCard({
  plan,
  selected,
  onSelect,
  isUz,
  selectLabel,
  featured = false,
}) {
  if (!plan) return null
  const name = isUz ? plan.nameUz : plan.nameRu
  const features = isUz ? (plan.featuresUz || []) : (plan.featuresRu || [])
  const duration = plan.durationDays

  return (
    <button
      type="button"
      className={`${styles.card} ${selected ? styles.selected : ''} ${featured ? styles.featured : ''}`.trim()}
      onClick={() => onSelect(plan.code)}
      aria-pressed={selected}
    >
      {featured ? <span className={styles.badge}>Premium</span> : null}
      <div className={styles.head}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.price}>{formatMoney(plan.price)}</p>
        {duration != null ? (
          <p className={styles.duration}>{duration} {isUz ? 'kun' : duration === 1 ? 'день' : 'дней'}</p>
        ) : null}
      </div>
      <ul className={styles.features}>
        {features.map((f) => (
          <li key={f} className={styles.feature}>
            <span className={styles.check} aria-hidden>✓</span>
            {f}
          </li>
        ))}
      </ul>
      <span className={styles.cta}>{selectLabel}</span>
    </button>
  )
}
