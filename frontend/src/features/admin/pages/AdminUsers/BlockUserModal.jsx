import { useState } from 'react'
import { UiButton, UiField, UiInput, UiModal } from '@/shared/ui'
import styles from './BlockUserModal.module.css'

export default function BlockUserModal({ user, onClose, onSubmit, loading }) {
  const [until, setUntil] = useState('')
  const [reason, setReason] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const date = until
      ? new Date(until).toISOString()
      : new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString()
    onSubmit(user.id, date, reason.trim() || null)
  }

  if (!user) return null

  return (
    <UiModal
      open={!!user}
      onClose={onClose}
      title="Заблокировать пользователя"
      footer={(
        <>
          <UiButton variant="ghost" onClick={onClose}>Отмена</UiButton>
          <UiButton variant="danger" type="submit" form="block-user-form" loading={loading}>
            {loading ? '…' : 'Заблокировать'}
          </UiButton>
        </>
      )}
    >
      <p className={styles.user}>{user.displayName} ({user.email})</p>
      <form id="block-user-form" onSubmit={handleSubmit}>
        <UiField label="Заблокировать до (пусто = постоянный бан)" htmlFor="block-until">
          <UiInput
            id="block-until"
            type="datetime-local"
            value={until}
            onChange={(e) => setUntil(e.target.value)}
          />
        </UiField>
        <UiField label="Причина" htmlFor="block-reason">
          <UiInput
            id="block-reason"
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Причина блокировки"
            maxLength={500}
          />
        </UiField>
      </form>
    </UiModal>
  )
}
