import goalImage from '../assets/goal.jpg'
import styles from './AboutGoal.module.css'

export default function AboutGoal({ t }) {
  return (
    <section className={styles.section}>
      <div className={styles.copy}>
        <h2 className={styles.title}>{t('about.goalTitle')}</h2>
        <p className={styles.text}>{t('about.goalText')}</p>
      </div>
      <img className={styles.image} src={goalImage} alt={t('about.goalImageAlt')} />
    </section>
  )
}
