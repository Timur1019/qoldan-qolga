import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import DesktopHeaderLang from './DesktopHeaderLang'
import DesktopProfileMenu from './DesktopProfileMenu'
import styles from './DesktopHeaderTop.module.css'

export default function DesktopHeaderTop({
  t,
  lang,
  setLang,
  isAuthenticated,
  user,
  logout,
  isAdmin,
  profileOpen,
  setProfileOpen,
  setBusinessModalOpen,
  openAuthModal,
  openIdVerificationModal,
  chatUnreadCount,
  favoritesCount,
  onOpenCategories,
}) {
  return (
    <div className={styles.top}>
      <div className={styles.inner}>
        <nav className={styles.links}>
          <Link to={ROUTES.BUSINESS} className={styles.link}>{t('header.forBusiness')}</Link>
          <Link to={ROUTES.RULES} className={styles.link}>{t('header.help')}</Link>
          <Link to={ROUTES.ABOUT} className={styles.link}>{t('footer.about')}</Link>
          <button type="button" className={styles.catalog} onClick={onOpenCategories}>
            {t('header.catalogs')}
          </button>
        </nav>
        <div className={styles.tools}>
          <DesktopHeaderLang lang={lang} onChange={setLang} />
          {isAuthenticated ? (
            <>
              <Link to={ROUTES.FAVORITES} className={styles.tool} aria-label={t('nav.favorites')}>
                <i className="bi bi-heart" aria-hidden />
                {favoritesCount > 0 ? (
                  <span className={styles.badge}>{favoritesCount > 99 ? '99+' : favoritesCount}</span>
                ) : null}
              </Link>
              <Link to={ROUTES.CHAT} className={styles.tool} aria-label={t('profile.chat')}>
                <i className="bi bi-chat-dots" aria-hidden />
                {chatUnreadCount > 0 ? (
                  <span className={styles.badge}>{chatUnreadCount > 99 ? '99+' : chatUnreadCount}</span>
                ) : null}
              </Link>
              <DesktopProfileMenu
                open={profileOpen}
                user={user}
                isAdmin={isAdmin}
                favoritesCount={favoritesCount}
                chatUnreadCount={chatUnreadCount}
                lang={lang}
                t={t}
                onToggle={() => setProfileOpen(!profileOpen)}
                onClose={() => setProfileOpen(false)}
                onIdCheck={openIdVerificationModal}
                onBusiness={() => setBusinessModalOpen(true)}
                onLogout={logout}
              />
            </>
          ) : (
            <button type="button" className={styles.tool} onClick={openAuthModal}>
              <i className="bi bi-lock" aria-hidden />
              <span>{t('header.loginRegister')}</span>
            </button>
          )}
          <Link to={ROUTES.ADS_CREATE} className={styles.tool}>
            <i className="bi bi-plus-lg" aria-hidden />
            <span>{t('header.postAd')}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
