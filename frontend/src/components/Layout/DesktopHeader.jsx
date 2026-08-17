import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import TopAdStrip from '../TopAdStrip/TopAdStrip'
import DesktopRegionSelect from './DesktopRegionSelect'
import DesktopProfileMenu from './DesktopProfileMenu'
import { NavIcons } from './headerNavIcons'
import styles from './Layout.module.css'

export default function DesktopHeader({ layout }) {
  const {
    t,
    lang,
    setLang,
    isAuthenticated,
    user,
    logout,
    isAdmin,
    categoriesOpen,
    setCategoriesOpen,
    headerRef,
    profileOpen,
    setProfileOpen,
    regions,
    regionOpen,
    setRegionOpen,
    setBusinessModalOpen,
    openAuthModal,
    openIdVerificationModal,
    chatUnreadCount,
    favoritesCount,
    selectedRegionCode,
    searchValue,
    setSearchValue,
    handleSearchSubmit,
    regionLabel,
    handleSelectRegion,
  } = layout

  return (
    <header ref={headerRef} className={styles.header}>
      <TopAdStrip />
      <div className={styles.headerTop}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.logo}>
            Qoldan Qolga
          </Link>
          <div className={styles.headerTopRight}>
            <DesktopRegionSelect
              regionOpen={regionOpen}
              regionLabel={regionLabel}
              selectedRegionCode={selectedRegionCode}
              regions={regions}
              lang={lang}
              onToggle={() => setRegionOpen(!regionOpen)}
              onClose={() => setRegionOpen(false)}
              onSelect={handleSelectRegion}
            />
            <div className="btn-group btn-group-sm">
              <button
                type="button"
                className={`btn ${lang === 'uz' ? 'btn-primary' : 'btn-outline-light'}`}
                onClick={() => setLang('uz')}
              >
                OʻZB
              </button>
              <button
                type="button"
                className={`btn ${lang === 'ru' ? 'btn-primary' : 'btn-outline-light'}`}
                onClick={() => setLang('ru')}
              >
                РУС
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.headerBottom}>
        <div className={styles.headerInner}>
          <button
            type="button"
            className={`btn ${categoriesOpen ? 'btn-primary' : 'btn-outline-primary'} ${styles.categoriesBtn}`}
            onClick={() => setCategoriesOpen(!categoriesOpen)}
          >
            <i className={`bi me-1 ${categoriesOpen ? 'bi-x-lg' : 'bi-list'}`} aria-hidden />
            {lang === 'ru' ? 'Категории' : 'Kategoriyalar'}
          </button>
          <form className={`input-group ${styles.searchWrap}`} onSubmit={handleSearchSubmit} role="search">
            <input
              type="search"
              className="form-control"
              placeholder={lang === 'ru' ? 'Найти объявление…' : 'E\'lon qidirish…'}
              aria-label={t('common.search')}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" aria-label={t('common.search')}>
              <i className="bi bi-search" aria-hidden />
            </button>
          </form>
          <nav className={styles.nav}>
            <Link to={ROUTES.ADS_MY} className={styles.navLink}>
              <span className={styles.navIcon}>{NavIcons.ads}</span>
              <span className={styles.navLabel}>{t('nav.myAds')}</span>
            </Link>
            {isAuthenticated ? (
              <>
                <Link to={ROUTES.FAVORITES} className={styles.navLink}>
                  <span className={styles.navLinkWrap}>
                    <span className={styles.navIcon}>{NavIcons.heart}</span>
                    {favoritesCount > 0 && (
                      <span className={styles.navBadge} aria-label={t('nav.favorites')}>
                        {favoritesCount > 99 ? '99+' : favoritesCount}
                      </span>
                    )}
                  </span>
                  <span className={styles.navLabel}>{t('nav.favorites')}</span>
                </Link>
                <Link to={ROUTES.CHAT} className={styles.navLink}>
                  <span className={styles.navLinkWrap}>
                    <span className={styles.navIcon}>{NavIcons.message}</span>
                    {chatUnreadCount > 0 && (
                      <span className={styles.navBadge} aria-label={t('chat.messagesCount')}>
                        {chatUnreadCount > 99 ? '99+' : chatUnreadCount}
                      </span>
                    )}
                  </span>
                  <span className={styles.navLabel}>{t('profile.chat')}</span>
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
                <Link to={ROUTES.ADS_CREATE} className="btn btn-primary btn-sm ms-2 flex-shrink-0 text-white">
                  <span className="me-1">{lang === 'ru' ? 'Продать' : 'Sotish'}</span>
                  <i className="bi bi-plus-lg text-white" aria-hidden />
                </Link>
              </>
            ) : (
              <>
                <button type="button" className="btn btn-outline-primary btn-sm" onClick={openAuthModal}>
                  <i className="bi bi-person me-1" aria-hidden />
                  <span>{t('nav.login')}</span>
                </button>
                <Link to={ROUTES.ADS_CREATE} className="btn btn-primary btn-sm ms-2 flex-shrink-0 text-white">
                  <span className="me-1">{lang === 'ru' ? 'Продать' : 'Sotish'}</span>
                  <i className="bi bi-plus-lg text-white" aria-hidden />
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
