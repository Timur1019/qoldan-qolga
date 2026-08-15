import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LangContext'
import { useBusinessModal } from '../../context/BusinessModalContext'
import { useChatUnreadCount, useFavoritesCount, useIdVerificationModal, useIsMobile } from '../../hooks'
import { ROUTES } from '../../constants/routes'
import ProfileSidebarHead from './ProfileSidebarHead'
import styles from './ProfileLayout.module.css'

const NavIcons = {
  idCheck: <i className="bi bi-person-badge" aria-hidden />,
  myAds: <i className="bi bi-file-earmark-text" aria-hidden />,
  heart: <i className="bi bi-heart" aria-hidden />,
  chat: <i className="bi bi-chat-dots" aria-hidden />,
  building: <i className="bi bi-building" aria-hidden />,
  document: <i className="bi bi-file-earmark-text" aria-hidden />,
  star: <i className="bi bi-star" aria-hidden />,
  exit: <i className="bi bi-box-arrow-right" aria-hidden />,
}

export default function ProfileLayout({ children }) {
  const { logout } = useAuth()
  const { t } = useLang()
  const isMobile = useIsMobile()
  const location = useLocation()
  const path = location.pathname
  const isMyAds = path === '/dashboard/ads' || path.startsWith('/dashboard/ads')
  const isFavorites = path === '/dashboard/favorites' || path.startsWith('/dashboard/favorites')
  const isMyReviews = path === '/dashboard/reviews' || path.startsWith('/dashboard/reviews')
  const isChat = path === '/dashboard/chat' || path.startsWith('/dashboard/chat')
  const isRules = path === ROUTES.DASHBOARD_RULES || path.startsWith(`${ROUTES.DASHBOARD_RULES}/`)
  const chatUnreadCount = useChatUnreadCount()
  const favoritesCount = useFavoritesCount()
  const openIdVerificationModal = useIdVerificationModal()
  const { openModal: openBusinessModal } = useBusinessModal()

  if (isMobile) {
    return <div className={styles.mobileMain}>{children}</div>
  }

  return (
    <div className={styles.wrap}>
      <aside className={`app-card ${styles.sidebar}`}>
        <ProfileSidebarHead />
        <nav className={`nav flex-column gap-1 ${styles.nav}`}>
          <button type="button" className={`nav-link d-flex align-items-center gap-2 rounded ${styles.navItem}`} onClick={openIdVerificationModal}>
            <span className="text-secondary">{NavIcons.idCheck}</span>
            <span className="flex-grow-1 text-start">{t('profile.idVerification')}</span>
            <i className="bi bi-chevron-right text-secondary small" aria-hidden />
          </button>
          <Link to={ROUTES.ADS_MY} className={`nav-link d-flex align-items-center gap-2 rounded ${isMyAds ? styles.navItemActive : styles.navItem}`}>
            <span className="text-secondary">{NavIcons.myAds}</span>
            <span className="flex-grow-1">{t('nav.myAds')}</span>
            <i className="bi bi-chevron-right text-secondary small" aria-hidden />
          </Link>
          <Link to={ROUTES.FAVORITES} className={`nav-link d-flex align-items-center gap-2 rounded ${isFavorites ? styles.navItemActive : styles.navItem}`}>
            <span className="text-secondary">{NavIcons.heart}</span>
            <span className="flex-grow-1">{t('nav.favorites')}</span>
            {favoritesCount > 0 && (
              <span className="badge bg-danger rounded-pill" aria-label={t('nav.favorites')}>{favoritesCount > 99 ? '99+' : favoritesCount}</span>
            )}
            <i className="bi bi-chevron-right text-secondary small" aria-hidden />
          </Link>
          <Link to={ROUTES.REVIEWS_MY} className={`nav-link d-flex align-items-center gap-2 rounded ${isMyReviews ? styles.navItemActive : styles.navItem}`}>
            <span className="text-secondary">{NavIcons.star}</span>
            <span className="flex-grow-1">{t('profile.myReviews')}</span>
            <i className="bi bi-chevron-right text-secondary small" aria-hidden />
          </Link>
          <Link to={ROUTES.CHAT} className={`nav-link d-flex align-items-center gap-2 rounded ${isChat ? styles.navItemActive : styles.navItem}`}>
            <span className="text-secondary">{NavIcons.chat}</span>
            <span className="flex-grow-1">{t('profile.chat')}</span>
            {chatUnreadCount > 0 && (
              <span className="badge bg-danger rounded-pill" aria-label={t('chat.messagesCount')}>{chatUnreadCount > 99 ? '99+' : chatUnreadCount}</span>
            )}
            <i className="bi bi-chevron-right text-secondary small" aria-hidden />
          </Link>
          <button type="button" className={`nav-link d-flex align-items-center gap-2 rounded ${styles.navItem}`} onClick={openBusinessModal}>
            <span className="text-secondary">{NavIcons.building}</span>
            <span className="flex-grow-1 text-start">{t('profile.forBusiness')}</span>
            <i className="bi bi-chevron-right text-secondary small" aria-hidden />
          </button>
          <Link
            to={ROUTES.DASHBOARD_RULES}
            className={`nav-link d-flex align-items-center gap-2 rounded ${isRules ? styles.navItemActive : styles.navItem}`}
          >
            <span className="text-secondary">{NavIcons.document}</span>
            <span className="flex-grow-1">{t('profile.rules')}</span>
            <i className="bi bi-chevron-right text-secondary small" aria-hidden />
          </Link>
          <button type="button" onClick={logout} className={`nav-link d-flex align-items-center gap-2 rounded text-start border-0 w-100 bg-transparent ${styles.navItem}`}>
            <span className="text-secondary">{NavIcons.exit}</span>
            <span className="flex-grow-1">{t('nav.logout')}</span>
            <i className="bi bi-chevron-right text-secondary small" aria-hidden />
          </button>
        </nav>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
