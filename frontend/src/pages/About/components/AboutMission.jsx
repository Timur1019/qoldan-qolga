import missionImage from '../assets/mission.jpg'
import styles from './AboutMission.module.css'

export default function AboutMission({ t }) {
  return (
    <section className={styles.section}>
      <img className={styles.image} src={missionImage} alt={t('about.missionImageAlt')} />
      <div className={styles.copy}>
        <h2 className={styles.title}>{t('about.missionTitle')}</h2>
        <p className={styles.text}>{t('about.missionText')}</p>
      </div>
    </section>
  )
}
