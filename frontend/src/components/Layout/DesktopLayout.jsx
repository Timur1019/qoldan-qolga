import { useState, useEffect, useRef, useCallback } from 'react'
import { Outlet, Link, useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LangContext'
import { useAuthModal, useChatUnreadCount, useFavoritesCount, useIdVerificationModal } from '../../hooks'
import { referenceApi, imageUrl } from '../../api/client'
import { PARAMS, ROUTES } from '../../constants/routes'
import { BusinessModalProvider } from '../../context/BusinessModalContext'
import { AuthModal } from '../../features/auth'
import CategoriesOverlay from '../CategoriesModal/CategoriesOverlay'
import BusinessModal from '../BusinessModal/BusinessModal'
import Footer from '../Footer/Footer'
import TopAdStrip from '../TopAdStrip/TopAdStrip'
import styles from './Layout.module.css'

const AVATAR_EMOJI = { star: '⭐', cactus: '🌵', donut: '🍩', duck: '🦆', cat: '🐱', alien: '👽' }

const NavIcons = {
  home: <i className="bi bi-house" aria-hidden />,
  ads: <i className="bi bi-grid-3x3-gap" aria-hidden />,
  heart: <i className="bi bi-heart" aria-hidden />,
  myAds: <i className="bi bi-file-earmark-text" aria-hidden />,
  plus: <i className="bi bi-plus-lg" aria-hidden />,
  user: <i className="bi bi-person" aria-hidden />,
  logout: <i className="bi bi-box-arrow-right" aria-hidden />,
  admin: <i className="bi bi-shield-lock" aria-hidden />,
  megaphone: <i className="bi bi-megaphone" aria-hidden />,
  star: <i className="bi bi-star" aria-hidden />,
  message: <i className="bi bi-chat-dots" aria-hidden />,
  idCheck: <i className="bi bi-person-badge" aria-hidden />,
  building: <i className="bi bi-building" aria-hidden />,
  support: <i className="bi bi-envelope" aria-hidden />,
  settings: <i className="bi bi-gear" aria-hidden />,
  exit: <i className="bi bi-box-arrow-right" aria-hidden />,
}

export default function DesktopLayout() {
  const { isAuthenticated, user, logout, isAdmin } = useAuth()
  const { t, lang, setLang } = useLang()
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const headerRef = useRef(null)
  const [headerOffset, setHeaderOffset] = useState(0)
  const [profileOpen, setProfileOpen] = useState(false)
  const [regions, setRegions] = useState([])
  const [regionOpen, setRegionOpen] = useState(false)
  const [businessModalOpen, setBusinessModalOpen] = useState(false)
  const openAuthModal = useAuthModal()
  const openIdVerificationModal = useIdVerificationModal()
  const chatUnreadCount = useChatUnreadCount()
  const favoritesCount = useFavoritesCount()

  const authParam = searchParams.get(PARAMS.AUTH)
  const authOpen = authParam === PARAMS.AUTH_LOGIN || authParam === PARAMS.AUTH_REGISTER
  const isCategoryAds = location.pathname === ROUTES.ADS && Boolean(searchParams.get(PARAMS.CATEGORY))
  const isAdsOrHome = location.pathname === ROUTES.HOME || location.pathname === ROUTES.ADS
  const selectedRegionCode = isAdsOrHome ? (searchParams.get(PARAMS.REGION) || '') : ''
  const [searchValue, setSearchValue] = useState(() => searchParams.get(PARAMS.QUERY) || '')

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

  useEffect(() => {
    if (location.pathname === ROUTES.ADS || location.pathname === ROUTES.HOME) {
      setSearchValue(searchParams.get(PARAMS.QUERY) || '')
    }
  }, [location.pathname, searchParams])

  const handleSearchSubmit = (e) => {
    e?.preventDefault()
    const q = (typeof searchValue === 'string' ? searchValue : '').trim()
    if (isCategoryAds) {
      const next = new URLSearchParams(searchParams)
      next.delete(PARAMS.PAGE)
      if (q) next.set(PARAMS.QUERY, q)
      else next.delete(PARAMS.QUERY)
      setSearchParams(next)
      return
    }
    const next = new URLSearchParams(location.pathname === ROUTES.HOME ? searchParams : '')
    next.delete(PARAMS.PAGE)
    next.delete(PARAMS.CATEGORY)
    if (q) next.set(PARAMS.QUERY, q)
    else next.delete(PARAMS.QUERY)
    const qs = next.toString()
    navigate(qs ? `${ROUTES.HOME}?${qs}` : ROUTES.HOME)
  }

  const selectedRegion = regions.find((r) => r.code === selectedRegionCode)
  const regionLabel = selectedRegion
    ? (lang === 'ru' ? selectedRegion.nameRu : selectedRegion.nameUz)
    : (lang === 'ru' ? 'Все регионы' : 'Barcha hududlar')

  const closeCategories = useCallback(() => {
    setCategoriesOpen(false)
    setSearchParams((prev) => {
      if (!prev.has(PARAMS.OPEN_CATEGORIES)) return prev
      const next = new URLSearchParams(prev)
      next.delete(PARAMS.OPEN_CATEGORIES)
      return next
    }, { replace: true })
  }, [setSearchParams])

  useEffect(() => {
    const el = headerRef.current
    if (!el) return undefined
    const update = () => setHeaderOffset(el.getBoundingClientRect().height)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  const handleSelectRegion = (code) => {
    setRegionOpen(false)
    if (location.pathname === ROUTES.ADS || location.pathname === ROUTES.HOME) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (code) next.set(PARAMS.REGION, code)
        else next.delete(PARAMS.REGION)
        return next
      })
    } else {
      navigate(code ? `/?${PARAMS.REGION}=${encodeURIComponent(code)}` : '/')
    }
  }

  return (
    <div
      className={styles.layout}
      style={{ '--layout-header-height': `${headerOffset}px` }}
    >
      <BusinessModalProvider openModal={() => setBusinessModalOpen(true)}>
        <>
      <header ref={headerRef} className={styles.header}>
        <TopAdStrip />
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
                  className={`btn btn-sm btn-outline-light border ${styles.regionBtn}`}
                  onClick={() => setRegionOpen(!regionOpen)}
                  aria-haspopup="listbox"
                  aria-expanded={regionOpen}
                  aria-label={lang === 'ru' ? 'Выбрать регион' : 'Hududni tanlash'}
                >
                  <i className="bi bi-geo-alt me-1" aria-hidden />
                  <span className={styles.regionLabel}>{regionLabel}</span>
                  <i className={`bi ms-1 ${regionOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`} aria-hidden />
                </button>
                {regionOpen && (
                  <>
                    <button
                      type="button"
                      className={styles.regionOverlay}
                      onClick={() => setRegionOpen(false)}
                      aria-hidden
                    />
                    <div className={`dropdown-menu show ${styles.regionDropdown}`} role="listbox">
                      <button
                        type="button"
                        className={`dropdown-item ${!selectedRegionCode ? 'active' : ''}`}
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
                          className={`dropdown-item ${selectedRegionCode === r.code ? 'active' : ''}`}
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
        {/* Нижняя полоса: фон на всю ширину, контент по центру */}
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
                  <div className={`${styles.profileWrap} flex-shrink-0`}>
                    <button
                      type="button"
                      className={`btn btn-link p-0 text-dark text-decoration-none d-flex flex-column align-items-center gap-1 ${profileOpen ? 'text-primary' : ''}`}
                      onClick={() => setProfileOpen(!profileOpen)}
                      aria-haspopup="true"
                      aria-expanded={profileOpen}
                      aria-label={t('nav.profile')}
                    >
                      <span className={`rounded-circle ${styles.profileAvatar}`}>
                        <span className={styles.profileAvatarIcon}>
                          {user?.avatar && (user.avatar.startsWith('/') || user.avatar.startsWith('http')) ? (
                            <img src={imageUrl(user.avatar)} alt="" className={`rounded-circle ${styles.profileAvatarImg}`} />
                          ) : user?.avatar && AVATAR_EMOJI[user.avatar] ? (
                            AVATAR_EMOJI[user.avatar]
                          ) : (
                            NavIcons.user
                          )}
                        </span>
                      </span>
                      <span className={`${styles.navLabel} text-nowrap`}>{t('nav.profile')}</span>
                    </button>
                    {profileOpen && (
                      <>
                        <button
                          type="button"
                          className={styles.profileOverlay}
                          onClick={() => setProfileOpen(false)}
                          aria-hidden
                        />
                        <div className={`bg-white shadow rounded ${styles.profileDropdown}`} role="menu">
                          <nav className={'list-group list-group-flush ' + styles.profileMenu}>
                            <Link to={ROUTES.FAVORITES} className="list-group-item list-group-item-action d-flex align-items-center gap-2 bg-white border-0 border-bottom" onClick={() => setProfileOpen(false)}>
                              <i className="bi bi-heart text-secondary" aria-hidden />
                              <span className="flex-grow-1">{t('nav.favorites')}</span>
                              {favoritesCount > 0 && (
                                <span className="badge bg-danger rounded-pill" aria-label={t('nav.favorites')}>{favoritesCount > 99 ? '99+' : favoritesCount}</span>
                              )}
                            </Link>
                            <Link to={ROUTES.ADS_MY} className="list-group-item list-group-item-action d-flex align-items-center gap-2 bg-white border-0 border-bottom" onClick={() => setProfileOpen(false)}>
                              <i className="bi bi-megaphone text-secondary" aria-hidden />
                              <span>{t('nav.myAds')}</span>
                            </Link>
                            <Link to={ROUTES.REVIEWS_MY} className="list-group-item list-group-item-action d-flex align-items-center gap-2 bg-white border-0 border-bottom" onClick={() => setProfileOpen(false)}>
                              <i className="bi bi-star text-secondary" aria-hidden />
                              <span>{lang === 'ru' ? 'Мои отзывы' : 'Mening sharhlarim'}</span>
                            </Link>
                            <Link to={ROUTES.CHAT} className="list-group-item list-group-item-action d-flex align-items-center gap-2 bg-white border-0 border-bottom" onClick={() => setProfileOpen(false)}>
                              <i className="bi bi-chat-dots text-secondary" aria-hidden />
                              <span className="flex-grow-1">{t('profile.chat')}</span>
                              {chatUnreadCount > 0 && (
                                <span className="badge bg-danger rounded-pill" aria-label={t('chat.messagesCount')}>{chatUnreadCount > 99 ? '99+' : chatUnreadCount}</span>
                              )}
                            </Link>
                            <div className="list-group-item bg-white border-0 border-bottom py-1" />
                            <button type="button" className="list-group-item list-group-item-action d-flex align-items-center gap-2 border-0 border-bottom bg-white text-start" onClick={() => { setProfileOpen(false); openIdVerificationModal(); }}>
                              <i className="bi bi-person-badge text-primary" aria-hidden />
                              <span>{lang === 'ru' ? 'Пройдите проверку ID' : 'ID tekshiruvini o\'tkazing'}</span>
                            </button>
                            <button type="button" className="list-group-item list-group-item-action d-flex align-items-center gap-2 border-0 border-bottom bg-white text-start" onClick={() => { setProfileOpen(false); setBusinessModalOpen(true); }}>
                              <i className="bi bi-building text-secondary" aria-hidden />
                              <span>{lang === 'ru' ? 'Qoldan Qolga для бизнеса' : 'Qoldan Qolga biznes uchun'}</span>
                            </button>
                            <a href="mailto:support@example.com" className="list-group-item list-group-item-action d-flex align-items-center gap-2 bg-white border-0 border-bottom" onClick={() => setProfileOpen(false)}>
                              <i className="bi bi-envelope text-secondary" aria-hidden />
                              <span>{lang === 'ru' ? 'Служба поддержки' : 'Qo\'llab-quvvatlash'}</span>
                            </a>
                            <Link to={ROUTES.PROFILE_EDIT} className="list-group-item list-group-item-action d-flex align-items-center gap-2 bg-white" onClick={() => setProfileOpen(false)}>
                              <i className="bi bi-gear text-secondary" aria-hidden />
                              <span>{lang === 'ru' ? 'Настройки' : 'Sozlamalar'}</span>
                            </Link>
                            <button type="button" className="list-group-item list-group-item-action d-flex align-items-center gap-2 border-0 bg-white text-start" onClick={() => { setProfileOpen(false); logout(); }}>
                              <i className="bi bi-box-arrow-right text-secondary" aria-hidden />
                              <span>{t('nav.logout')}</span>
                            </button>
                            {isAdmin && (
                              <Link to="/admin" className="list-group-item list-group-item-action d-flex align-items-center gap-2 border-0 border-top bg-white" onClick={() => setProfileOpen(false)}>
                                <i className="bi bi-shield-lock text-primary" aria-hidden />
                                <span>{t('nav.admin')}</span>
                              </Link>
                            )}
                          </nav>
                        </div>
                      </>
                    )}
                  </div>
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
      <CategoriesOverlay
        open={categoriesOpen}
        onClose={closeCategories}
        headerOffset={headerOffset}
      />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
      <AuthModal
        open={authOpen}
        onClose={() => {}}
      />
      <BusinessModal
        open={businessModalOpen}
        onClose={() => setBusinessModalOpen(false)}
        onProceed={() => {
          setBusinessModalOpen(false)
          navigate(ROUTES.BUSINESS)
        }}
      />
        </>
      </BusinessModalProvider>
    </div>
  )
}
