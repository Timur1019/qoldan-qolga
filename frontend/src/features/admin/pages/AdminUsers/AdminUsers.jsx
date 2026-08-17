import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '@/api/admin'
import { UiAlert, UiButton, UiPagination, UiSelect } from '@/shared/ui'
import BlockUserModal from './BlockUserModal'
import styles from './AdminUsers.module.css'

export default function AdminUsers() {
  const [page, setPage] = useState(0)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const [blockModal, setBlockModal] = useState(null)

  const size = 20

  useEffect(() => {
    setLoading(true)
    setError('')
    adminApi
      .getUsers({ page, size, sort: 'createdAt,desc' })
      .then(setData)
      .catch((e) => setError(e.message || 'Ошибка загрузки'))
      .finally(() => setLoading(false))
  }, [page])

  const handleVerify = (user) => {
    setUpdatingId(user.id)
    adminApi
      .updateUser(user.id, { profileVerified: !user.profileVerified })
      .then(() => setData((prev) => updateUserInPage(prev, user.id, { profileVerified: !user.profileVerified })))
      .catch((e) => setError(e.message))
      .finally(() => setUpdatingId(null))
  }

  const handleRoleChange = (user, newRole) => {
    if (newRole === user.role) return
    setUpdatingId(user.id)
    adminApi
      .updateUser(user.id, { role: newRole })
      .then(() => setData((prev) => updateUserInPage(prev, user.id, { role: newRole })))
      .catch((e) => setError(e.message))
      .finally(() => setUpdatingId(null))
  }

  const handleBlockSubmit = (userId, bannedUntil, banReason) => {
    setUpdatingId(userId)
    adminApi
      .updateUser(userId, { bannedUntil: bannedUntil || null, banReason: banReason || null })
      .then(() => {
        setBlockModal(null)
        setData((prev) => updateUserInPage(prev, userId, { bannedUntil: bannedUntil || null, banReason: banReason || null }))
      })
      .catch((e) => setError(e.message))
      .finally(() => setUpdatingId(null))
  }

  const handleUnblock = (user) => {
    setUpdatingId(user.id)
    adminApi
      .updateUser(user.id, { bannedUntil: null, banReason: null })
      .then(() => setData((prev) => updateUserInPage(prev, user.id, { bannedUntil: null, banReason: null })))
      .catch((e) => setError(e.message))
      .finally(() => setUpdatingId(null))
  }

  const isBanned = (u) => u.bannedUntil && new Date(u.bannedUntil) > new Date()

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Пользователи</h2>
      {error ? <UiAlert>{error}</UiAlert> : null}
      {loading ? (
        <p className={styles.muted}>Загрузка…</p>
      ) : data?.content?.length === 0 ? (
        <p className={styles.muted}>Нет пользователей</p>
      ) : (
        <>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Имя</th>
                  <th>Подтверждён</th>
                  <th>Заявка на верификацию</th>
                  <th>Роль</th>
                  <th>Блокировка</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {data?.content?.map((u) => (
                  <tr
                    key={u.id}
                    className={
                      isBanned(u)
                        ? styles.rowBanned
                        : (!u.profileVerified && u.verificationRequestedAt ? styles.rowPending : '')
                    }
                  >
                    <td>{u.email}</td>
                    <td>
                      <Link to={`/users/${u.id}`} className={styles.link}>{u.displayName}</Link>
                    </td>
                    <td>
                      {u.profileVerified ? (
                        <span className={styles.badgeOk}>✓</span>
                      ) : null}
                      <UiButton
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerify(u)}
                        disabled={updatingId === u.id}
                        title={u.profileVerified ? 'Отменить подтверждение' : 'Подтвердить профиль'}
                      >
                        {updatingId === u.id ? '…' : u.profileVerified ? 'Отменить' : 'Подтвердить'}
                      </UiButton>
                    </td>
                    <td className={styles.verificationRequested}>
                      {u.verificationRequestedAt
                        ? new Date(u.verificationRequestedAt).toLocaleDateString('ru-RU')
                        : '—'}
                    </td>
                    <td>
                      <UiSelect
                        size="sm"
                        value={u.role || 'USER'}
                        onChange={(e) => handleRoleChange(u, e.target.value)}
                        disabled={updatingId === u.id}
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </UiSelect>
                    </td>
                    <td>
                      {isBanned(u) ? (
                        <span className={styles.bannedUntil}>
                          до {new Date(u.bannedUntil).toLocaleDateString()}
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
                          onClick={() => handleUnblock(u)}
                          disabled={updatingId === u.id}
                        >
                          Разблокировать
                        </UiButton>
                      ) : (
                        <UiButton
                          variant="danger"
                          size="sm"
                          onClick={() => setBlockModal(u)}
                          disabled={updatingId === u.id}
                        >
                          Заблокировать
                        </UiButton>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <UiPagination page={page} totalPages={data?.totalPages} onPageChange={setPage} />
        </>
      )}

      <BlockUserModal
        user={blockModal}
        onClose={() => setBlockModal(null)}
        onSubmit={handleBlockSubmit}
        loading={updatingId === blockModal?.id}
      />
    </div>
  )
}

function updateUserInPage(prev, id, patch) {
  if (!prev?.content) return prev
  return {
    ...prev,
    content: prev.content.map((u) => (u.id === id ? { ...u, ...patch } : u)),
  }
}
