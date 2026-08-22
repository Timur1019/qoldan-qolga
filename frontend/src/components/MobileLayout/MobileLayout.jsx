import { useCallback, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { useChatUnreadCount, useFavoritesCount } from '../../hooks'
import { PARAMS, ROUTES } from '../../constants/routes'
import { getMobileTitle, isMobileStackPath, MOBILE_TAB_BAR_HEIGHT, showMobileSearch } from '../../utils/mobileShell'
import { BusinessModalProvider } from '../../context/BusinessModalContext'
import { AuthModal } from '../../features/auth'
import CategoriesOverlay from '../CategoriesModal/CategoriesOverlay'
import BusinessModal from '../BusinessModal/BusinessModal'
import TopAdStrip from '../TopAdStrip/TopAdStrip'
import MobileHeader from '../MobileHeader/MobileHeader'
import MobileTabBar from '../MobileTabBar/MobileTabBar'
import styles from './MobileLayout.module.css'

export default function MobileLayout() {
  const { t, lang, setLang } = useLang()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [businessModalOpen, setBusinessModalOpen] = useState(false)
  const [searchValue, setSearchValue] = useState(() => searchParams.get(PARAMS.QUERY) || '')
  const headerRef = useRef(null)
  const [headerOffset, setHeaderOffset] = useState(64)
  const chatUnreadCount = useChatUnreadCount()
  const favoritesCount = useFavoritesCount()

  const authParam = searchParams.get(PARAMS.AUTH)
  const authOpen = authParam === PARAMS.AUTH_LOGIN || authParam === PARAMS.AUTH_REGISTER
  const chatOpen = location.pathname === ROUTES.CHAT && Boolean(searchParams.get('conversation'))
  const stackPath = isMobileStackPath(location.pathname) || chatOpen
  const hideShellHeader = chatOpen
  const searchMode = showMobileSearch(location.pathname) && !stackPath
  const headerMode = searchMode ? 'search' : (stackPath && !hideShellHeader ? 'back' : 'title')
  const showTabs = !stackPath
  const effectiveHeaderOffset = hideShellHeader ? 0 : headerOffset
  const tabBarHeight = MOBILE_TAB_BAR_HEIGHT

  useEffect(() => {
    document.documentElement.dataset.shell = 'mobile'
    return () => {
      delete document.documentElement.dataset.shell
    }
  }, [])

  useEffect(() => {
    if (chatOpen) {
      document.documentElement.dataset.chatThread = 'open'
    } else {
      delete document.documentElement.dataset.chatThread
    }
    return () => {
      delete document.documentElement.dataset.chatThread
    }
  }, [chatOpen])

  useEffect(() => {
    const el = headerRef.current
    if (!el) return undefined
    const update = () => setHeaderOffset(el.getBoundingClientRect().height)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (location.pathname === ROUTES.ADS || location.pathname === ROUTES.HOME) {
      setSearchValue(searchParams.get(PARAMS.QUERY) || '')
    }
  }, [location.pathname, searchParams])

  const closeCategories = useCallback(() => {
    setCategoriesOpen(false)
  }, [])

  const handleSearchSubmit = (e) => {
    e?.preventDefault()
    const q = (typeof searchValue === 'string' ? searchValue : '').trim()
    const onAds = location.pathname === ROUTES.ADS
    const next = new URLSearchParams(onAds ? searchParams : '')
    if (!onAds) {
      const region = searchParams.get(PARAMS.REGION)
      if (region) next.set(PARAMS.REGION, region)
    }
    next.delete(PARAMS.PAGE)
    next.delete(PARAMS.AUTH)
    if (q) next.set(PARAMS.QUERY, q)
    else next.delete(PARAMS.QUERY)
    const qs = next.toString()
    navigate(qs ? `${ROUTES.ADS}?${qs}` : ROUTES.ADS)
  }

  const handleBack = () => {
    if (chatOpen) {
      setSearchParams({}, { replace: true })
      return
    }
    if (window.history.length > 1) navigate(-1)
    else navigate(ROUTES.HOME)
  }

  return (
    <div
      className={styles.layout}
      style={{
        '--layout-header-height': `${effectiveHeaderOffset}px`,
        '--layout-tab-height': showTabs ? tabBarHeight : '0px',
      }}
    >
      <BusinessModalProvider openModal={() => setBusinessModalOpen(true)}>
        {!hideShellHeader && (
          <header ref={headerRef} className={styles.top}>
            {location.pathname === ROUTES.HOME && <TopAdStrip />}
            <MobileHeader
              mode={headerMode}
              title={getMobileTitle(location.pathname, t)}
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              onSearchSubmit={handleSearchSubmit}
              onOpenCategories={() => setCategoriesOpen(true)}
              onBack={handleBack}
              placeholder={t('header.searchPlaceholder')}
              backLabel={t('common.back')}
              lang={lang}
              onLangChange={setLang}
            />
          </header>
        )}
        <CategoriesOverlay
          open={categoriesOpen}
          onClose={closeCategories}
          headerOffset={headerOffset}
        />
        <main className={`${styles.main} ${showTabs ? styles.mainWithTabs : ''} ${chatOpen ? styles.mainChatThread : ''}`}>
          <Outlet />
        </main>
        {showTabs && (
          <MobileTabBar
            pathname={location.pathname}
            t={t}
            chatUnreadCount={chatUnreadCount}
            favoritesCount={favoritesCount}
          />
        )}
        <AuthModal open={authOpen} onClose={() => {}} />
        <BusinessModal
          open={businessModalOpen}
          onClose={() => setBusinessModalOpen(false)}
          onProceed={() => {
            setBusinessModalOpen(false)
            navigate(ROUTES.BUSINESS)
          }}
        />
      </BusinessModalProvider>
    </div>
  )
}
