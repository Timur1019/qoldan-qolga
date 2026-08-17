import { Link } from 'react-router-dom'
import UserAvatar from '../ui/UserAvatar'
import { ROUTES } from '../../constants/routes'
import styles from './Layout.module.css'

export default function DesktopProfileMenu({
  open,
  user,
  isAdmin,
  favoritesCount,
  chatUnreadCount,
  lang,
  t,
  onToggle,
  onClose,
  onIdCheck,
  onBusiness,
  onLogout,
}) {
  return (
    <div className={`${styles.profileWrap} flex-shrink-0`}>
      <button
        type="button"
        className={`btn btn-link p-0 text-dark text-decoration-none d-flex flex-column align-items-center gap-1 ${open ? 'text-primary' : ''}`}
        onClick={onToggle}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={t('nav.profile')}
      >
        <UserAvatar
          avatar={user?.avatar}
          name={user?.displayName || ''}
          size={38}
          own
          className={styles.profileAvatar}
        />
        <span className={`${styles.navLabel} text-nowrap`}>{t('nav.profile')}</span>
      </button>
      {open && (
        <>
          <button
            type="button"
            className={styles.profileOverlay}
            onClick={onClose}
            aria-hidden
          />
          <div className={`bg-white shadow rounded ${styles.profileDropdown}`} role="menu">
            <nav className={'list-group list-group-flush ' + styles.profileMenu}>
              <Link to={ROUTES.FAVORITES} className="list-group-item list-group-item-action d-flex align-items-center gap-2 bg-white border-0 border-bottom" onClick={onClose}>
                <i className="bi bi-heart text-secondary" aria-hidden />
                <span className="flex-grow-1">{t('nav.favorites')}</span>
                {favoritesCount > 0 && (
                  <span className="badge bg-danger rounded-pill" aria-label={t('nav.favorites')}>{favoritesCount > 99 ? '99+' : favoritesCount}</span>
                )}
              </Link>
              <Link to={ROUTES.ADS_MY} className="list-group-item list-group-item-action d-flex align-items-center gap-2 bg-white border-0 border-bottom" onClick={onClose}>
                <i className="bi bi-megaphone text-secondary" aria-hidden />
                <span>{t('nav.myAds')}</span>
              </Link>
              <Link to={ROUTES.REVIEWS_MY} className="list-group-item list-group-item-action d-flex align-items-center gap-2 bg-white border-0 border-bottom" onClick={onClose}>
                <i className="bi bi-star text-secondary" aria-hidden />
                <span>{lang === 'ru' ? 'Мои отзывы' : 'Mening sharhlarim'}</span>
              </Link>
              <Link to={ROUTES.CHAT} className="list-group-item list-group-item-action d-flex align-items-center gap-2 bg-white border-0 border-bottom" onClick={onClose}>
                <i className="bi bi-chat-dots text-secondary" aria-hidden />
                <span className="flex-grow-1">{t('profile.chat')}</span>
                {chatUnreadCount > 0 && (
                  <span className="badge bg-danger rounded-pill" aria-label={t('chat.messagesCount')}>{chatUnreadCount > 99 ? '99+' : chatUnreadCount}</span>
                )}
              </Link>
              <div className="list-group-item bg-white border-0 border-bottom py-1" />
              <button type="button" className="list-group-item list-group-item-action d-flex align-items-center gap-2 border-0 border-bottom bg-white text-start" onClick={() => { onClose(); onIdCheck(); }}>
                <i className="bi bi-person-badge text-primary" aria-hidden />
                <span>{lang === 'ru' ? 'Пройдите проверку ID' : 'ID tekshiruvini o\'tkazing'}</span>
              </button>
              <button type="button" className="list-group-item list-group-item-action d-flex align-items-center gap-2 border-0 border-bottom bg-white text-start" onClick={() => { onClose(); onBusiness(); }}>
                <i className="bi bi-building text-secondary" aria-hidden />
                <span>{lang === 'ru' ? 'Qoldan Qolga для бизнеса' : 'Qoldan Qolga biznes uchun'}</span>
              </button>
              <a href="mailto:support@example.com" className="list-group-item list-group-item-action d-flex align-items-center gap-2 bg-white border-0 border-bottom" onClick={onClose}>
                <i className="bi bi-envelope text-secondary" aria-hidden />
                <span>{lang === 'ru' ? 'Служба поддержки' : 'Qo\'llab-quvvatlash'}</span>
              </a>
              <Link to={ROUTES.PROFILE_EDIT} className="list-group-item list-group-item-action d-flex align-items-center gap-2 bg-white" onClick={onClose}>
                <i className="bi bi-gear text-secondary" aria-hidden />
                <span>{lang === 'ru' ? 'Настройки' : 'Sozlamalar'}</span>
              </Link>
              <button type="button" className="list-group-item list-group-item-action d-flex align-items-center gap-2 border-0 bg-white text-start" onClick={() => { onClose(); onLogout(); }}>
                <i className="bi bi-box-arrow-right text-secondary" aria-hidden />
                <span>{t('nav.logout')}</span>
              </button>
              {isAdmin && (
                <Link to="/admin" className="list-group-item list-group-item-action d-flex align-items-center gap-2 border-0 border-top bg-white" onClick={onClose}>
                  <i className="bi bi-shield-lock text-primary" aria-hidden />
                  <span>{t('nav.admin')}</span>
                </Link>
              )}
            </nav>
          </div>
        </>
      )}
    </div>
  )
}
