import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LangContext'
import { chatApi } from '../../api/client'
import { ROUTES } from '../../constants/routes'
import styles from './ProfileLayout.module.css'

const iconStyle = { width: 22, height: 22, flexShrink: 0 }

const NavIcons = {
  idCheck: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle} aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20v-2a4 4 0 014-4h8a4 4 0 014 4v2" />
      <path d="M12 12v4M11 16h2" strokeLinecap="round" />
    </svg>
  ),
  myAds: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle} aria-hidden>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle} aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle} aria-hidden>
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
  building: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle} aria-hidden>
      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
    </svg>
  ),
  document: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle} aria-hidden>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  ),
  exit: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle} aria-hidden>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <path d="M16 17l5-5-5-5M21 12H9" />
    </svg>
  ),
}

export default function ProfileLayout({ children }) {
  const { user, logout, isAuthenticated } = useAuth()
  const { t } = useLang()
  const location = useLocation()
  const path = location.pathname
  const isMyAds = path === '/dashboard/ads' || path.startsWith('/dashboard/ads')
  const isFavorites = path === '/dashboard/favorites' || path.startsWith('/dashboard/favorites')
  const isChat = path === '/dashboard/chat' || path.startsWith('/dashboard/chat')
  const [chatCount, setChatCount] = useState(0)

  const refreshChatCount = useCallback(() => {
    if (!isAuthenticated) return
    chatApi.getConversations().then((list) => {
      const total = (list || []).reduce((s, c) => s + (c.incomingMessageCount ?? 0), 0)
      setChatCount(total)
    }).catch(() => setChatCount(0))
  }, [isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) {
      setChatCount(0)
      return
    }
    refreshChatCount()
    const onRefresh = () => refreshChatCount()
    window.addEventListener('chat-count-refresh', onRefresh)
    return () => window.removeEventListener('chat-count-refresh', onRefresh)
  }, [isAuthenticated, refreshChatCount])

  return (
    <div className={styles.wrap}>
      <aside className={styles.sidebar}>
        <div className={styles.profileHead}>
          <span className={styles.avatar} aria-hidden />
          <span className={styles.contact}>{user?.phone || user?.email || '—'}</span>
          <span className={styles.arrow} aria-hidden>›</span>
        </div>
        <Link to={ROUTES.DASHBOARD} className={styles.viewProfileLink}>
          {t('profile.viewProfile')} ›
        </Link>
        <nav className={styles.nav}>
          <Link to={ROUTES.DASHBOARD} className={styles.navItem}>
            <span className={styles.navIcon}>{NavIcons.idCheck}</span>
            <span>{t('profile.idVerification')}</span>
            <span className={styles.navArrow}>›</span>
          </Link>
          <Link to={ROUTES.ADS_MY} className={isMyAds ? styles.navItemActive : styles.navItem}>
            <span className={styles.navIcon}>{NavIcons.myAds}</span>
            <span>{t('nav.myAds')}</span>
            <span className={styles.navArrow}>›</span>
          </Link>
          <Link to={ROUTES.FAVORITES} className={isFavorites ? styles.navItemActive : styles.navItem}>
            <span className={styles.navIcon}>{NavIcons.heart}</span>
            <span>{t('nav.favorites')}</span>
            <span className={styles.navArrow}>›</span>
          </Link>
          <Link to={ROUTES.CHAT} className={isChat ? styles.navItemActive : styles.navItem}>
            <span className={styles.navIcon}>{NavIcons.chat}</span>
            <span>{t('profile.chat')}</span>
            {chatCount > 0 && (
              <span className={styles.navBadge}>{chatCount > 99 ? '99+' : chatCount}</span>
            )}
            <span className={styles.navArrow}>›</span>
          </Link>
          <Link to={ROUTES.DASHBOARD} className={styles.navItem}>
            <span className={styles.navIcon}>{NavIcons.building}</span>
            <span>{t('profile.forBusiness')}</span>
            <span className={styles.navArrow}>›</span>
          </Link>
          <Link to={ROUTES.DASHBOARD} className={styles.navItem}>
            <span className={styles.navIcon}>{NavIcons.document}</span>
            <span>{t('profile.rules')}</span>
            <span className={styles.navArrow}>›</span>
          </Link>
          <button type="button" onClick={logout} className={styles.navItem}>
            <span className={styles.navIcon}>{NavIcons.exit}</span>
            <span>{t('nav.logout')}</span>
            <span className={styles.navArrow}>›</span>
          </button>
        </nav>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
