import styles from './BusinessSectionCard.module.css'

export default function BusinessSectionCard({ icon, iconTone = 'green', title, children }) {
  return (
    <section className={styles.card}>
      <header className={styles.head}>
        <span className={`${styles.icon} ${styles[iconTone]}`} aria-hidden>
          {icon}
        </span>
        <h2 className={styles.title}>{title}</h2>
      </header>
      <div className={styles.body}>{children}</div>
    </section>
  )
}
