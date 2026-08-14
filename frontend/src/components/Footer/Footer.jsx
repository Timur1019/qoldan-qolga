/**
 * Footer: регионы, навигация, соцсети, переключатель языка, скачивание приложения.
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { referenceApi } from '../../api/client'
import { ROUTES, PARAMS } from '../../constants/routes'
import styles from './Footer.module.css'

const INITIAL_REGIONS_VISIBLE = 8
const SOCIAL_LINKS = [
  { key: 'instagram', href: 'https://instagram.com', icon: 'bi bi-instagram', label: 'Instagram' },
  { key: 'telegram', href: 'https://t.me', icon: 'bi bi-telegram', label: 'Telegram' },
  { key: 'facebook', href: 'https://facebook.com', icon: 'bi bi-facebook', label: 'Facebook' },
  { key: 'linkedin', href: 'https://linkedin.com', icon: 'bi bi-linkedin', label: 'LinkedIn' },
]

export default function Footer() {
  const { t, lang, setLang } = useLang()
  const [regions, setRegions] = useState([])
  const [regionsExpanded, setRegionsExpanded] = useState(false)

  useEffect(() => {
    referenceApi.getRegions().then((list) => setRegions(Array.isArray(list) ? list : [])).catch(() => setRegions([]))
  }, [])

  const visibleCount = regionsExpanded ? regions.length : INITIAL_REGIONS_VISIBLE
  const visibleRegions = regions.slice(0, visibleCount)
  const restCount = regions.length - INITIAL_REGIONS_VISIBLE

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.footerInner}>
        <div className={styles.footerLeft}>
          <section className={styles.regionsSection} aria-labelledby="footer-regions-title">
            <h2 id="footer-regions-title" className={styles.regionsTitle}>
              {t('footer.regionsTitle')}
            </h2>
            <ul className={styles.regionsList}>
              {visibleRegions.map((r) => (
                <li key={r.code ?? String(r.id)}>
                  <Link
                    to={r.code ? `${ROUTES.HOME}?${PARAMS.REGION}=${encodeURIComponent(r.code)}` : ROUTES.HOME}
                    className={styles.regionLink}
                  >
                    {lang === 'ru' ? r.nameRu : r.nameUz}
                  </Link>
                </li>
              ))}
            </ul>
            {!regionsExpanded && restCount > 0 && (
              <button
                type="button"
                className={styles.moreRegionsBtn}
                onClick={() => setRegionsExpanded(true)}
                aria-expanded="false"
              >
                {t('footer.moreRegions')} {restCount}
                <i className="bi bi-chevron-down" aria-hidden />
              </button>
            )}
          </section>

          <nav className={styles.navLinks} aria-label={t('footer.navLabel')}>
            <Link to={ROUTES.ABOUT} className={styles.navLink}>{t('footer.about')}</Link>
            <a href="mailto:support@qoldanqolga.uz" className={styles.navLink}>{t('footer.support')}</a>
            <Link to={ROUTES.REGIONS} className={styles.navLink}>{t('footer.allRegions')}</Link>
            <Link to={ROUTES.RULES} className={styles.navLink}>{t('footer.rules')}</Link>
            <a href="/blog" className={styles.navLink}>{t('footer.blog')}</a>
          </nav>

          <div className={styles.socialAndLang}>
            <div className={styles.socialIcons} aria-label={t('footer.socialLabel')}>
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialBtn}
                  title={s.label}
                  aria-label={s.label}
                >
                  <i className={s.icon} aria-hidden />
                </a>
              ))}
            </div>
            <div className={styles.langSwitch} role="group" aria-label={t('footer.langLabel')}>
              <button
                type="button"
                className={lang === 'ru' ? styles.langBtnActive : styles.langBtn}
                onClick={() => setLang('ru')}
                aria-pressed={lang === 'ru'}
              >
                <span className={styles.langFlag} aria-hidden>RU</span>
                RU
              </button>
              <button
                type="button"
                className={lang === 'uz' ? styles.langBtnActive : styles.langBtn}
                onClick={() => setLang('uz')}
                aria-pressed={lang === 'uz'}
              >
                <span className={styles.langFlag} aria-hidden>UZ</span>
                UZ
              </button>
            </div>
          </div>
        </div>

        <section className={styles.appSection} aria-labelledby="footer-app-title">
          <h2 id="footer-app-title" className={styles.appTitle}>
            {t('footer.downloadApp')}
          </h2>
          <div className={styles.appContent}>
            <div className={styles.qrPlaceholder} aria-hidden>
              <span className={styles.qrPlaceholderText}>QR</span>
            </div>
            <div className={styles.appButtons}>
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.appStoreBtn}
              >
                <i className="bi bi-apple" aria-hidden />
                {t('footer.appStore')}
              </a>
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.appStoreBtn}
              >
                <i className="bi bi-google-play" aria-hidden />
                {t('footer.googlePlay')}
              </a>
            </div>
          </div>
        </section>
      </div>
    </footer>
  )
}
