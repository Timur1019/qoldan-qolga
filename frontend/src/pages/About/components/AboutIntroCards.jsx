import { INTRO_CARDS } from '../aboutSections'
import AboutPhoneMock from './AboutPhoneMock'
import styles from './AboutIntroCards.module.css'

export default function AboutIntroCards({ t, lang }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{t('about.introTitle')}</h2>
      <div className={styles.grid}>
        {INTRO_CARDS.map((card) => (
          <article key={card.variant} className={styles.card}>
            <AboutPhoneMock variant={card.variant} lang={lang} />
            <h3 className={styles.cardTitle}>{t(card.titleKey)}</h3>
            <p className={styles.cardText}>{t(card.textKey)}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
