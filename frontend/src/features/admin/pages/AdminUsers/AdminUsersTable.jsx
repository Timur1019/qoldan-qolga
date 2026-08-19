import { Link } from 'react-router-dom'
import { UiButton, UiSelect } from '@/shared/ui'
import styles from './AdminUsers.module.css'

export default function AdminUsersTable({
  users,
  updatingId,
  onVerify,
  onRoleChange,
  onBlock,
  onUnblock,
  isBanned,
  t,
  footer,
}) {
  return (
    <div className={styles.tableWrap}>
      <div className={styles.scroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Email</th>
            <th>{t('adminPanel.colName')}</th>
            <th>{t('adminPanel.colVerified')}</th>
            <th>{t('adminPanel.colVerification')}</th>
            <th>{t('adminPanel.colRole')}</th>
            <th>{t('adminPanel.colBan')}</th>
            <th>{t('adminPanel.colActions')}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr
              key={u.id}
              className={
                isBanned(u)
                  ? styles.rowBanned
                  : (!u.profileVerified && u.verificationRequestedAt ? styles.rowPending : '')
              }
            >
              <td>{u.email || '—'}</td>
              <td>
                <Link to={`/users/${u.id}`} className={styles.link}>{u.displayName}</Link>
              </td>
              <td>
                {u.profileVerified ? <span className={styles.badgeOk}>✓</span> : null}
                <UiButton
                  variant="outline"
                  size="sm"
                  onClick={() => onVerify(u)}
                  disabled={updatingId === u.id}
                >
                  {updatingId === u.id ? '…' : u.profileVerified ? t('adminPanel.unverify') : t('adminPanel.verify')}
                </UiButton>
              </td>
              <td className={styles.verificationRequested}>
                {u.verificationRequestedAt
                  ? new Date(u.verificationRequestedAt).toLocaleDateString()
                  : '—'}
              </td>
              <td>
                <UiSelect
                  size="sm"
                  value={u.role || 'USER'}
                  onChange={(e) => onRoleChange(u, e.target.value)}
                  disabled={updatingId === u.id}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </UiSelect>
              </td>
              <td>
                {isBanned(u) ? (
                  <span className={styles.bannedUntil}>
                    {new Date(u.bannedUntil).toLocaleDateString()}
                    {u.banReason && ` (${u.banReason})`}
                  </span>
                ) : (
                  <span className={styles.muted}>—</span>
                )}
              </td>
              <td>
                {isBanned(u) ? (
                  <UiButton
                    variant="outline"
                    size="sm"
                    onClick={() => onUnblock(u)}
                    disabled={updatingId === u.id}
                  >
                    {t('adminPanel.unblock')}
                  </UiButton>
                ) : (
                  <UiButton
                    variant="danger"
                    size="sm"
                    onClick={() => onBlock(u)}
                    disabled={updatingId === u.id}
                  >
                    {t('adminPanel.block')}
                  </UiButton>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {footer}
    </div>
  )
}
