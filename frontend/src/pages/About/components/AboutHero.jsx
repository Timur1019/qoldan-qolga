import AboutHeroCollage from './AboutHeroCollage'
import styles from './AboutHero.module.css'

export default function AboutHero({ t, onJoin }) {
  return (
    <section className={styles.hero}>
      <div className={styles.copy}>
        <h1 className={styles.title}>{t('about.heroTitle')}</h1>
        <button type="button" className={styles.joinBtn} onClick={onJoin}>
          {t('about.join')}
        </button>
      </div>
      <AboutHeroCollage />
    </section>
  )
}
