import { WHY_CARDS } from '../aboutSections'
import AboutWhyIcon from '../icons/AboutWhyIcon'
import styles from './AboutWhy.module.css'

export default function AboutWhy({ t }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{t('about.whyTitle')}</h2>
      <div className={styles.grid}>
        {WHY_CARDS.map((card) => (
          <article key={card.icon} className={styles.card}>
            <div className={styles.icon}>
              <AboutWhyIcon name={card.icon} />
            </div>
            <h3 className={styles.cardTitle}>{t(card.titleKey)}</h3>
            <p className={styles.cardText}>{t(card.textKey)}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
