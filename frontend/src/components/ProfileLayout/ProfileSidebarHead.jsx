import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LangContext'
import { ROUTES, sellerPath } from '../../constants/routes'
import { formatPhoneDisplay } from '../../features/auth/utils/phoneFormat'
import UserAvatar from '../ui/UserAvatar'
import styles from './ProfileSidebarHead.module.css'

function formatDisplayName(name) {
  const raw = String(name || '').trim()
  if (!raw) return ''
  return raw.charAt(0).toUpperCase() + raw.slice(1)
}

export default function ProfileSidebarHead() {
  const { user } = useAuth()
  const { t } = useLang()

  const name =
    formatDisplayName(user?.displayName) ||
    (user?.email ? String(user.email).split('@')[0] : '') ||
    t('nav.profile')

  const phoneLabel = user?.phone ? formatPhoneDisplay(user.phone) : ''
  const contact = phoneLabel || user?.email || '—'

  return (
    <div className={styles.wrap}>
      <Link to={ROUTES.PROFILE_EDIT} className={styles.head}>
        <UserAvatar
          avatar={user?.avatar}
          name={name}
          className={styles.avatar}
          own
        />
        <span className={styles.meta}>
          <span className={styles.name}>{name}</span>
          <span className={styles.contact}>{contact}</span>
        </span>
        <i className={`bi bi-chevron-right ${styles.chevron}`} aria-hidden />
      </Link>
      <Link
        to={user?.id ? sellerPath(user.id) : ROUTES.DASHBOARD}
        className={styles.viewProfile}
      >
        <span>{t('profile.viewProfile')}</span>
        <i className="bi bi-chevron-right" aria-hidden />
      </Link>
    </div>
  )
}
