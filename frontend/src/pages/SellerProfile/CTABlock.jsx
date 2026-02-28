/**
 * CTABlock — призыв к действию внизу профиля (для владельца при мало/нет отзывов).
 */
import { useLang } from '../../context/LangContext'
import styles from './SellerProfile.module.css'

export default function CTABlock() {
  const { t } = useLang()
  return (
    <div className={styles.ctaBlock}>
      <h3 className={styles.ctaTitle}>{t('profile.ctaReviewsTitle')}</h3>
      <p className={styles.ctaHint}>{t('profile.ctaReviewsHint')}</p>
    </div>
  )
}
