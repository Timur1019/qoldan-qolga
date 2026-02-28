import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../../api/client'
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
      {error && <p className={styles.error}>{error}</p>}
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
                      <button
                        type="button"
                        className={styles.btnSmall}
                        onClick={() => handleVerify(u)}
                        disabled={updatingId === u.id}
                        title={u.profileVerified ? 'Отменить подтверждение' : 'Подтвердить профиль'}
                      >
                        {updatingId === u.id ? '…' : u.profileVerified ? 'Отменить' : 'Подтвердить'}
                      </button>
                    </td>
                    <td className={styles.verificationRequested}>
                      {u.verificationRequestedAt
                        ? new Date(u.verificationRequestedAt).toLocaleDateString('ru-RU')
                        : '—'}
                    </td>
                    <td>
                      <select
                        className={styles.select}
                        value={u.role || 'USER'}
                        onChange={(e) => handleRoleChange(u, e.target.value)}
                        disabled={updatingId === u.id}
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
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
                        <button
                          type="button"
                          className={styles.btnSmall}
                          onClick={() => handleUnblock(u)}
                          disabled={updatingId === u.id}
                        >
                          Разблокировать
                        </button>
                      ) : (
                        <button
                          type="button"
                          className={styles.btnSmallDanger}
                          onClick={() => setBlockModal(u)}
                          disabled={updatingId === u.id}
                        >
                          Заблокировать
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data?.totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                type="button"
                className={styles.pageBtn}
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                Назад
              </button>
              <span className={styles.pageInfo}>
                {page + 1} / {data.totalPages}
              </span>
              <button
                type="button"
                className={styles.pageBtn}
                disabled={page >= data.totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Вперёд
              </button>
            </div>
          )}
        </>
      )}

      {blockModal && (
        <BlockModal
          user={blockModal}
          onClose={() => setBlockModal(null)}
          onSubmit={handleBlockSubmit}
          loading={updatingId === blockModal.id}
        />
      )}
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

function BlockModal({ user, onClose, onSubmit, loading }) {
  const [until, setUntil] = useState('')
  const [reason, setReason] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const date = until
      ? new Date(until).toISOString()
      : new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString()
    onSubmit(user.id, date, reason.trim() || null)
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>Заблокировать пользователя</h3>
        <p className={styles.modalUser}>{user.displayName} ({user.email})</p>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <label className={styles.label}>
            Заблокировать до (пусто = постоянный бан)
            <input
              type="datetime-local"
              className={styles.input}
              value={until}
              onChange={(e) => setUntil(e.target.value)}
            />
          </label>
          <label className={styles.label}>
            Причина
            <input
              type="text"
              className={styles.input}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Причина блокировки"
              maxLength={500}
            />
          </label>
          <div className={styles.modalActions}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className={styles.btnDanger} disabled={loading}>
              {loading ? '…' : 'Заблокировать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
