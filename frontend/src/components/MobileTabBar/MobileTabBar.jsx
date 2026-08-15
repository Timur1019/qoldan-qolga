import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { getMobileTab } from '../../utils/mobileShell'
import styles from './MobileTabBar.module.css'

export default function MobileTabBar({ pathname, t, chatUnreadCount, favoritesCount }) {
  const active = getMobileTab(pathname)

  return (
    <nav className={styles.bar} aria-label="Mobile">
      <Link
        to={ROUTES.HOME}
        className={`${styles.item} ${active === 'search' ? styles.itemActive : ''}`}
      >
        <i className="bi bi-search" aria-hidden />
        <span>{t('tabs.search')}</span>
      </Link>
      <Link
        to={ROUTES.FAVORITES}
        className={`${styles.item} ${active === 'favorites' ? styles.itemActive : ''}`}
      >
        <span className={styles.iconWrap}>
          <i className="bi bi-heart" aria-hidden />
          {favoritesCount > 0 && (
            <span className={styles.badge}>{favoritesCount > 99 ? '99+' : favoritesCount}</span>
          )}
        </span>
        <span>{t('tabs.favorites')}</span>
      </Link>
      <Link
        to={ROUTES.ADS_MY}
        className={`${styles.item} ${active === 'sell' ? styles.itemActive : ''}`}
      >
        <span className={`${styles.sellIcon} ${active === 'sell' ? styles.sellIconActive : ''}`}>
          <i className="bi bi-plus-lg" aria-hidden />
        </span>
        <span>{t('tabs.sell')}</span>
      </Link>
      <Link
        to={ROUTES.CHAT}
        className={`${styles.item} ${active === 'chat' ? styles.itemActive : ''}`}
      >
        <span className={styles.iconWrap}>
          <i className="bi bi-chat-dots" aria-hidden />
          {chatUnreadCount > 0 && (
            <span className={styles.badge}>{chatUnreadCount > 99 ? '99+' : chatUnreadCount}</span>
          )}
        </span>
        <span>{t('tabs.chat')}</span>
      </Link>
      <Link
        to={ROUTES.PROFILE_EDIT}
        className={`${styles.item} ${active === 'profile' ? styles.itemActive : ''}`}
      >
        <i className="bi bi-person" aria-hidden />
        <span>{t('tabs.profile')}</span>
      </Link>
    </nav>
  )
}
