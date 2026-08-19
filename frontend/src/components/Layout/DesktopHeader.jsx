import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import TopAdStrip from '../TopAdStrip/TopAdStrip'
import DesktopRegionSelect from './DesktopRegionSelect'
import DesktopProfileMenu from './DesktopProfileMenu'
import DesktopHeaderBrand from './DesktopHeaderBrand'
import DesktopHeaderSearch from './DesktopHeaderSearch'
import DesktopHeaderLang from './DesktopHeaderLang'
import { NavIcons } from './headerNavIcons'
import headerStyles from './DesktopHeader.module.css'
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
    searchValue,
    setSearchValue,
    handleSearchSubmit,
    regionLabel,
    handleSelectRegion,
    selectedRegionCode,
    categoryTitle,
  } = layout

  return (
    <header ref={headerRef} className={styles.header}>
      <TopAdStrip />
      <div className={headerStyles.bar}>
        <div className={headerStyles.inner}>
          <DesktopHeaderBrand categoryTitle={categoryTitle} />
          <button
            type="button"
            className={`${headerStyles.categoriesBtn} ${categoriesOpen ? headerStyles.categoriesBtnOpen : ''}`}
            onClick={() => setCategoriesOpen(!categoriesOpen)}
          >
            <i className={`bi ${categoriesOpen ? 'bi-x-lg' : 'bi-grid-3x3-gap-fill'}`} aria-hidden />
            <span>{t('home.allCategories')}</span>
          </button>
          <DesktopHeaderSearch
            value={searchValue}
            onChange={setSearchValue}
            onSubmit={handleSearchSubmit}
            placeholder={t('header.searchPlaceholder')}
            findLabel={t('header.find')}
          />
          <DesktopRegionSelect
            regionOpen={regionOpen}
            regionLabel={regionLabel}
            selectedRegionCode={selectedRegionCode}
            regions={regions}
            lang={lang}
            allRegionsLabel={t('header.allRegions')}
            onToggle={() => setRegionOpen(!regionOpen)}
            onClose={() => setRegionOpen(false)}
            onSelect={handleSelectRegion}
          />
          <DesktopHeaderLang lang={lang} onChange={setLang} />
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
                <Link to={ROUTES.ADS_CREATE} className={`btn btn-primary text-white ${headerStyles.sellBtn}`}>
                  {lang === 'ru' ? 'Продать' : 'Sotish'}
                </Link>
              </>
            ) : (
              <>
                <button type="button" className="btn btn-outline-primary btn-sm" onClick={openAuthModal}>
                  {t('nav.login')}
                </button>
                <Link to={ROUTES.ADS_CREATE} className={`btn btn-primary text-white ${headerStyles.sellBtn}`}>
                  {lang === 'ru' ? 'Продать' : 'Sotish'}
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
