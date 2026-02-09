/**
 * CTABlock — призыв к действию внизу профиля (для владельца при мало/нет отзывов).
 */
import { useLang } from '../../context/LangContext'
import styles from './SellerProfile.module.css'

export default function CTABlock() {
  const { t } = useLang()
  return (
    <div className={styles.ctaBlock}>
      <p className={styles.ctaTitle}>{t('profile.ctaReviewsTitle')}</p>
      <p className={styles.ctaHint}>{t('profile.ctaReviewsHint')}</p>
    </div>
  )
}
