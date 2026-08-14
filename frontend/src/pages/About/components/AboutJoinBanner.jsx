import styles from './AboutJoinBanner.module.css'

export default function AboutJoinBanner({ t, onJoin }) {
  return (
    <section className={styles.banner}>
      <div className={styles.copy}>
        <h2 className={styles.title}>{t('about.ctaTitle')}</h2>
        <button type="button" className={styles.joinBtn} onClick={onJoin}>
          {t('about.join')}
        </button>
      </div>
      <div className={styles.decor} aria-hidden>
        <svg className={styles.svg} viewBox="0 0 360 180" fill="none">
          <path d="M48 86h58l10 62H38l10-62z" stroke="#d8f3e0" strokeWidth="7" strokeLinejoin="round" />
          <path d="M60 86v-16a17 17 0 0 1 34 0v16" stroke="#d8f3e0" strokeWidth="7" strokeLinecap="round" />
          <circle cx="188" cy="78" r="42" stroke="#b7e4c7" strokeWidth="8" />
          <circle cx="188" cy="78" r="14" fill="#b7e4c7" opacity="0.4" />
          <rect x="248" y="58" width="86" height="48" rx="16" fill="#f4faf6" />
          <circle cx="274" cy="82" r="8" fill="#04492d" />
          <circle cx="308" cy="82" r="8" fill="#b7e4c7" />
        </svg>
      </div>
    </section>
  )
}
