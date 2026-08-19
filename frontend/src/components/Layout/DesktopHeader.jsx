import TopAdStrip from '../TopAdStrip/TopAdStrip'
import DesktopRegionSelect from './DesktopRegionSelect'
import DesktopHeaderBrand from './DesktopHeaderBrand'
import DesktopHeaderSearch from './DesktopHeaderSearch'
import DesktopHeaderTop from './DesktopHeaderTop'
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
      <DesktopHeaderTop
        t={t}
        lang={lang}
        setLang={setLang}
        isAuthenticated={isAuthenticated}
        user={user}
        logout={logout}
        isAdmin={isAdmin}
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
        setBusinessModalOpen={setBusinessModalOpen}
        openAuthModal={openAuthModal}
        openIdVerificationModal={openIdVerificationModal}
        chatUnreadCount={chatUnreadCount}
        favoritesCount={favoritesCount}
        onOpenCategories={() => setCategoriesOpen(true)}
      />
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
        </div>
      </div>
    </header>
  )
}
