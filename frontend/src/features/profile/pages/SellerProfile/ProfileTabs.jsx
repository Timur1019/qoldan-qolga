/**
 * ProfileTabs — табы «Активные» / «Архив» для переключения списка объявлений.
 */
import { useLang } from '../../../../context/LangContext'
import styles from './SellerProfile.module.css'

export default function ProfileTabs({ activeTab, onTabChange, activeCount, archiveCount }) {
  const { t } = useLang()
  return (
    <div className={styles.profileTabs}>
      <button
        type="button"
        className={`${styles.profileTab} ${activeTab === 'active' ? styles.profileTabActive : ''}`}
        onClick={() => onTabChange('active')}
      >
        {t('profile.tabActive')} {activeCount}
      </button>
      <button
        type="button"
        className={`${styles.profileTab} ${activeTab === 'archive' ? styles.profileTabActive : ''}`}
        onClick={() => onTabChange('archive')}
      >
        {t('profile.tabArchive')} {archiveCount}
      </button>
    </div>
  )
}
