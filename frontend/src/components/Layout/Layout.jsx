import { useState, useEffect } from 'react'
import { Outlet, Link, useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LangContext'
import { useAuthModal, useChatUnreadCount, useFavoritesCount } from '../../hooks'
import { referenceApi, imageUrl } from '../../api/client'
import { PARAMS, ROUTES } from '../../constants/routes'
import { AuthModal } from '../../features/auth'
import CategoriesModal from '../CategoriesModal/CategoriesModal'
import styles from './Layout.module.css'

const AVATAR_EMOJI = { star: '⭐', cactus: '🌵', donut: '🍩', duck: '🦆', cat: '🐱', alien: '👽' }

const locationIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18, flexShrink: 0 }} aria-hidden>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const iconSize = 18
const iconStyle = { width: iconSize, height: iconSize, flexShrink: 0 }

const NavIcons = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle} aria-hidden>
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <path d="M9 22V12h6v10" />
    </svg>
  ),
  ads: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle} aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle} aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  myAds: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle} aria-hidden>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle} aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle} aria-hidden>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle} aria-hidden>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <path d="M16 17l5-5-5-5M21 12H9" />
    </svg>
  ),
  admin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle} aria-hidden>
      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  megaphone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle} aria-hidden>
      <path d="M12 2v4M12 18v4M4 9v6h16V9M6 13h12" strokeLinecap="round" />
      <path d="M9 22h6" strokeLinecap="round" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle} aria-hidden>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  message: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle} aria-hidden>
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
  idCheck: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle} aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20v-2a4 4 0 014-4h8a4 4 0 014 4v2" />
      <path d="M12 12v4M11 16h2" strokeLinecap="round" />
    </svg>
  ),
  building: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle} aria-hidden>
      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
    </svg>
  ),
  support: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle} aria-hidden>
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle} aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-1.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h1.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v1.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-1.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  exit: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle} aria-hidden>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <path d="M16 17l5-5-5-5M21 12H9" />
    </svg>
  ),
}

export default function Layout() {
  const { isAuthenticated, user, logout, isAdmin } = useAuth()
  const { t, lang, setLang } = useLang()
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [regions, setRegions] = useState([])
  const [regionOpen, setRegionOpen] = useState(false)
  const openAuthModal = useAuthModal()
  const chatUnreadCount = useChatUnreadCount()
  const favoritesCount = useFavoritesCount()

  const authParam = searchParams.get(PARAMS.AUTH)
  const authOpen = authParam === PARAMS.AUTH_LOGIN || authParam === PARAMS.AUTH_REGISTER
  const authInitialMode = authParam === PARAMS.AUTH_REGISTER ? 'register' : 'login'
  const selectedRegionCode = location.pathname === ROUTES.ADS ? (searchParams.get(PARAMS.REGION) || '') : ''
  const [searchValue, setSearchValue] = useState(() =>
    location.pathname === ROUTES.ADS ? (searchParams.get(PARAMS.QUERY) || '') : ''
  )

  useEffect(() => {
    referenceApi.getRegions().then(setRegions).catch(() => setRegions([]))
  }, [])

  useEffect(() => {
    if (searchParams.get(PARAMS.OPEN_CATEGORIES) === PARAMS.OPEN_CATEGORIES_VALUE) {
      setCategoriesOpen(true)
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        next.delete(PARAMS.OPEN_CATEGORIES)
        return next
      }, { replace: true })
    }
  }, [searchParams])

  // Синхронизировать поле поиска с URL на странице объявлений
  useEffect(() => {
    if (location.pathname === ROUTES.ADS) {
      setSearchValue(searchParams.get(PARAMS.QUERY) || '')
    }
  }, [location.pathname, searchParams])

  const handleSearchSubmit = (e) => {
    e?.preventDefault()
    const q = (typeof searchValue === 'string' ? searchValue : '').trim()
    if (location.pathname === ROUTES.ADS) {
      const next = new URLSearchParams(searchParams)
      next.delete(PARAMS.PAGE)
      if (q) next.set(PARAMS.QUERY, q)
      else next.delete(PARAMS.QUERY)
      setSearchParams(next)
    } else {
      const params = new URLSearchParams()
      if (q) params.set(PARAMS.QUERY, q)
      navigate(params.toString() ? `${ROUTES.ADS}?${params}` : ROUTES.ADS)
    }
  }

  const selectedRegion = regions.find((r) => r.code === selectedRegionCode)
  const regionLabel = selectedRegion
    ? (lang === 'ru' ? selectedRegion.nameRu : selectedRegion.nameUz)
    : (lang === 'ru' ? 'Все регионы' : 'Barcha hududlar')

  const handleSelectRegion = (code) => {
    setRegionOpen(false)
    if (location.pathname === ROUTES.ADS) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (code) next.set(PARAMS.REGION, code)
        else next.delete(PARAMS.REGION)
        return next
      })
    } else {
      navigate(code ? `${ROUTES.ADS}?${PARAMS.REGION}=${encodeURIComponent(code)}` : ROUTES.ADS)
    }
  }

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        {/* Верхняя полоса: фон касается краёв экрана, контент по центру */}
        <div className={styles.headerTop}>
          <div className={styles.headerInner}>
            <Link to="/" className={styles.logo}>
              Qoldan Qolga
            </Link>
            <div className={styles.headerTopRight}>
              <div className={styles.regionWrap}>
                <button
                  type="button"
                  className={styles.regionBtn}
                  onClick={() => setRegionOpen(!regionOpen)}
                  aria-haspopup="listbox"
                  aria-expanded={regionOpen}
                  aria-label={lang === 'ru' ? 'Выбрать регион' : 'Hududni tanlash'}
                >
                  {locationIcon}
                  <span className={styles.regionLabel}>{regionLabel}</span>
                  <span className={styles.regionChevron} aria-hidden>{regionOpen ? '▲' : '▼'}</span>
                </button>
                {regionOpen && (
                  <>
                    <button
                      type="button"
                      className={styles.regionOverlay}
                      onClick={() => setRegionOpen(false)}
                      aria-hidden
                    />
                    <div className={styles.regionDropdown} role="listbox">
                      <button
                        type="button"
                        className={!selectedRegionCode ? styles.regionItemActive : styles.regionItem}
                        onClick={() => handleSelectRegion('')}
                        role="option"
                        aria-selected={!selectedRegionCode}
                      >
                        {lang === 'ru' ? 'Все регионы' : 'Barcha hududlar'}
                      </button>
                      {regions.map((r) => (
                        <button
                          key={r.code}
                          type="button"
                          className={selectedRegionCode === r.code ? styles.regionItemActive : styles.regionItem}
                          onClick={() => handleSelectRegion(r.code)}
                          role="option"
                          aria-selected={selectedRegionCode === r.code}
                        >
                          {lang === 'ru' ? r.nameRu : r.nameUz}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <span className={styles.langSwitcher}>
                <button
                  type="button"
                  className={lang === 'uz' ? styles.langActive : undefined}
                  onClick={() => setLang('uz')}
                >
                  OʻZB
                </button>
                <button
                  type="button"
                  className={lang === 'ru' ? styles.langActive : undefined}
                  onClick={() => setLang('ru')}
                >
                  РУС
                </button>
              </span>
            </div>
          </div>
        </div>
        {/* Нижняя полоса: фон на всю ширину, контент по центру */}
        <div className={styles.headerBottom}>
          <div className={styles.headerInner}>
            <button
              type="button"
              className={categoriesOpen ? styles.categoriesBtnActive : styles.categoriesBtn}
              onClick={() => setCategoriesOpen(!categoriesOpen)}
            >
              <span className={styles.categoriesIcon} aria-hidden>{categoriesOpen ? '✕' : '☰'}</span>
              {lang === 'ru' ? 'Категории' : 'Kategoriyalar'}
            </button>
            <form className={styles.searchWrap} onSubmit={handleSearchSubmit} role="search">
              <input
                type="search"
                className={styles.searchInput}
                placeholder={lang === 'ru' ? 'Найти объявление…' : 'E\'lon qidirish…'}
                aria-label={t('common.search')}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button type="submit" className={styles.searchBtn} aria-label={t('common.search')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }} aria-hidden>
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </button>
            </form>
            <nav className={styles.nav}>
              <Link to="/ads" className={styles.navLink}>
                <span className={styles.navIcon}>{NavIcons.ads}</span>
                <span className={styles.navLabel}>{t('nav.ads')}</span>
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
                  <div className={styles.profileWrap}>
                    <button
                      type="button"
                      className={styles.navLinkButton + (profileOpen ? ' ' + styles.navLinkButtonActive : '')}
                      onClick={() => setProfileOpen(!profileOpen)}
                      aria-haspopup="true"
                      aria-expanded={profileOpen}
                      aria-label={t('nav.profile')}
                    >
                      <span className={styles.profileAvatar}>
                        <span className={styles.profileAvatarIcon}>
                          {user?.avatar && (user.avatar.startsWith('/') || user.avatar.startsWith('http')) ? (
                            <img src={imageUrl(user.avatar)} alt="" className={styles.profileAvatarImg} />
                          ) : user?.avatar && AVATAR_EMOJI[user.avatar] ? (
                            AVATAR_EMOJI[user.avatar]
                          ) : (
                            NavIcons.user
                          )}
                        </span>
                      </span>
                      <span className={styles.navLabel}>{t('nav.profile')}</span>
                    </button>
                    {profileOpen && (
                      <>
                        <button
                          type="button"
                          className={styles.profileOverlay}
                          onClick={() => setProfileOpen(false)}
                          aria-hidden
                        />
                        <div className={styles.profileDropdown} role="menu">
                          <div className={styles.profileDropdownHeader}>
                            <Link
                              to={ROUTES.PROFILE_EDIT}
                              className={styles.profileDropdownProfileLink}
                              onClick={() => setProfileOpen(false)}
                            >
                              <span className={styles.profileDropdownAvatar}>
                                <span className={styles.profileDropdownAvatarIcon}>
                                  {user?.avatar && (user.avatar.startsWith('/') || user.avatar.startsWith('http')) ? (
                                    <img src={imageUrl(user.avatar)} alt="" className={styles.profileDropdownAvatarImg} />
                                  ) : user?.avatar && AVATAR_EMOJI[user.avatar] ? (
                                    AVATAR_EMOJI[user.avatar]
                                  ) : (
                                    NavIcons.user
                                  )}
                                </span>
                              </span>
                              <span className={styles.profileDropdownTitle}>{t('nav.profile')}</span>
                            </Link>
                            <Link
                              to={ROUTES.ADS_CREATE}
                              className={styles.profileSellBtn}
                              onClick={() => setProfileOpen(false)}
                            >
                              <span>{lang === 'ru' ? 'Продать' : 'Sotish'}</span>
                              <span className={styles.profileSellBtnPlus}>{NavIcons.plus}</span>
                            </Link>
                          </div>
                          <nav className={styles.profileMenu}>
                            <Link to={ROUTES.FAVORITES} className={styles.profileMenuItem} onClick={() => setProfileOpen(false)}>
                              <span className={styles.profileMenuIcon}>{NavIcons.heart}</span>
                              <span>{t('nav.favorites')}</span>
                              {favoritesCount > 0 && (
                                <span className={styles.profileMenuBadge} aria-label={t('nav.favorites')}>
                                  {favoritesCount > 99 ? '99+' : favoritesCount}
                                </span>
                              )}
                            </Link>
                            <Link to={ROUTES.ADS_MY} className={styles.profileMenuItem} onClick={() => setProfileOpen(false)}>
                              <span className={styles.profileMenuIcon}>{NavIcons.megaphone}</span>
                              <span>{t('nav.myAds')}</span>
                            </Link>
                            <Link to={ROUTES.REVIEWS_MY} className={styles.profileMenuItem} onClick={() => setProfileOpen(false)}>
                              <span className={styles.profileMenuIcon}>{NavIcons.star}</span>
                              <span>{lang === 'ru' ? 'Мои отзывы' : 'Mening sharhlarim'}</span>
                            </Link>
                            <Link to={ROUTES.CHAT} className={styles.profileMenuItem} onClick={() => setProfileOpen(false)}>
                              <span className={styles.profileMenuIcon}>{NavIcons.message}</span>
                              <span>{t('profile.chat')}</span>
                              {chatUnreadCount > 0 && (
                                <span className={styles.profileMenuBadge} aria-label={t('chat.messagesCount')}>
                                  {chatUnreadCount > 99 ? '99+' : chatUnreadCount}
                                </span>
                              )}
                            </Link>
                            <div className={styles.profileMenuDivider} />
                            <Link to="/dashboard" className={styles.profileMenuItem} onClick={() => setProfileOpen(false)}>
                              <span className={styles.profileMenuIcon + ' ' + styles.profileMenuIconPink}>{NavIcons.idCheck}</span>
                              <span>{lang === 'ru' ? 'Пройдите проверку ID' : 'ID tekshiruvini o\'tkazing'}</span>
                            </Link>
                            <Link to="/dashboard" className={styles.profileMenuItem} onClick={() => setProfileOpen(false)}>
                              <span className={styles.profileMenuIcon}>{NavIcons.building}</span>
                              <span>{lang === 'ru' ? 'Qoldan Qolga для бизнеса' : 'Qoldan Qolga biznes uchun'}</span>
                            </Link>
                            <a href="mailto:support@example.com" className={styles.profileMenuItem} onClick={() => setProfileOpen(false)}>
                              <span className={styles.profileMenuIcon}>{NavIcons.support}</span>
                              <span>{lang === 'ru' ? 'Служба поддержки' : 'Qo\'llab-quvvatlash'}</span>
                            </a>
                            <Link to="/dashboard" className={styles.profileMenuItem} onClick={() => setProfileOpen(false)}>
                              <span className={styles.profileMenuIcon}>{NavIcons.settings}</span>
                              <span>{lang === 'ru' ? 'Настройки' : 'Sozlamalar'}</span>
                            </Link>
                            <button type="button" className={styles.profileMenuItem} onClick={() => { setProfileOpen(false); logout(); }}>
                              <span className={styles.profileMenuIcon}>{NavIcons.exit}</span>
                              <span>{t('nav.logout')}</span>
                            </button>
                          </nav>
                          {isAdmin && (
                            <Link to="/admin" className={styles.profileMenuItem + ' ' + styles.profileMenuAdmin} onClick={() => setProfileOpen(false)}>
                              <span className={styles.profileMenuIcon}>{NavIcons.admin}</span>
                              <span>{t('nav.admin')}</span>
                            </Link>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  <Link to={ROUTES.ADS_CREATE} className={styles.sellBtn}>
                    <span className={styles.sellBtnText}>{lang === 'ru' ? 'Продать' : 'Sotish'}</span>
                    <span className={styles.sellBtnPlus}>{NavIcons.plus}</span>
                  </Link>
                </>
              ) : (
                <>
                  <button type="button" className={styles.loginBtn} onClick={openAuthModal}>
                    <span className={styles.navIcon}>{NavIcons.user}</span>
                    <span className={styles.navLabel}>{t('nav.login')}</span>
                  </button>
                  <Link to={ROUTES.ADS_CREATE} className={styles.sellBtn}>
                    <span className={styles.sellBtnText}>{lang === 'ru' ? 'Продать' : 'Sotish'}</span>
                    <span className={styles.sellBtnPlus}>{NavIcons.plus}</span>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
        {categoriesOpen && (
          <>
            <button
              type="button"
              className={styles.categoriesOverlay}
              onClick={() => setCategoriesOpen(false)}
              aria-label={lang === 'ru' ? 'Закрыть' : 'Yopish'}
            />
            <div className={styles.categoriesDropdownWrap}>
              <CategoriesModal
                onClose={() => {
                  setCategoriesOpen(false)
                  setSearchParams((prev) => {
                    const next = new URLSearchParams(prev)
                    next.delete(PARAMS.OPEN_CATEGORIES)
                    return next
                  }, { replace: true })
                }}
              />
            </div>
          </>
        )}
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <AuthModal
        open={authOpen}
        onClose={() => {}}
        initialMode={authInitialMode}
      />
    </div>
  )
}
