import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LangContext'
import { useBusinessModal } from '../../context/BusinessModalContext'
import { useChatUnreadCount, useFavoritesCount, useIdVerificationModal } from '../../hooks'
import { ROUTES, sellerPath } from '../../constants/routes'
import { imageUrl } from '../../api/client'
import styles from './ProfileLayout.module.css'

const AVATAR_EMOJI = { star: '⭐', cactus: '🌵', donut: '🍩', duck: '🦆', cat: '🐱', alien: '👽' }

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
  const { user, logout } = useAuth()
  const { t } = useLang()
  const location = useLocation()
  const path = location.pathname
  const isMyAds = path === '/dashboard/ads' || path.startsWith('/dashboard/ads')
  const isFavorites = path === '/dashboard/favorites' || path.startsWith('/dashboard/favorites')
  const isMyReviews = path === '/dashboard/reviews' || path.startsWith('/dashboard/reviews')
  const isChat = path === '/dashboard/chat' || path.startsWith('/dashboard/chat')
  const chatUnreadCount = useChatUnreadCount()
  const favoritesCount = useFavoritesCount()
  const openIdVerificationModal = useIdVerificationModal()
  const { openModal: openBusinessModal } = useBusinessModal()

  return (
    <div className={styles.wrap}>
      <aside className={`app-card ${styles.sidebar}`}>
        <Link to={ROUTES.PROFILE_EDIT} className={`d-flex align-items-center gap-2 text-decoration-none text-dark ${styles.profileHead}`}>
          <span className={`rounded-circle ${styles.avatar}`} aria-hidden>
            {user?.avatar && (user.avatar.startsWith('/') || user.avatar.startsWith('http')) ? (
              <img src={imageUrl(user.avatar)} alt="" className={`rounded-circle ${styles.avatarImg}`} />
            ) : user?.avatar && AVATAR_EMOJI[user.avatar] ? (
              AVATAR_EMOJI[user.avatar]
            ) : (
              ''
            )}
          </span>
          <span className={`flex-grow-1 text-truncate small ${styles.contact}`}>{user?.phone || user?.email || '—'}</span>
          <i className="bi bi-chevron-right text-secondary" aria-hidden />
        </Link>
        <Link to={user?.id ? sellerPath(user.id) : ROUTES.DASHBOARD} className="small text-primary text-decoration-none mb-3 d-block">
          {t('profile.viewProfile')} ›
        </Link>
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
          <Link to={ROUTES.DASHBOARD} className={`nav-link d-flex align-items-center gap-2 rounded ${styles.navItem}`}>
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
