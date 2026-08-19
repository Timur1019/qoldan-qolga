import { useLang } from '@/context/LangContext'
import { UiAlert, UiButton, UiPagination } from '@/shared/ui'
import BlockUserModal from './BlockUserModal'
import AdminCreateUserForm from './AdminCreateUserForm'
import AdminUsersTable from './AdminUsersTable'
import useAdminUsers from './useAdminUsers'
import styles from './AdminUsers.module.css'

export default function AdminUsers() {
  const { t } = useLang()
  const users = useAdminUsers()
  const isBanned = (u) => u.bannedUntil && new Date(u.bannedUntil) > new Date()

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <h2 className={styles.title}>{t('adminPanel.navUsers')}</h2>
        <UiButton type="button" onClick={() => users.setFormOpen(true)}>
          {t('adminPanel.addUser')}
        </UiButton>
      </div>
      {users.error ? <UiAlert>{users.error}</UiAlert> : null}
      {users.formOpen ? (
        <AdminCreateUserForm
          form={users.form}
          onChange={users.patchForm}
          onSubmit={users.createUser}
          onCancel={() => users.setFormOpen(false)}
          submitting={users.creating}
          error={users.createError}
          t={t}
        />
      ) : null}
      {users.loading ? (
        <p className={styles.muted}>{t('adminPanel.loading')}</p>
      ) : users.data?.content?.length === 0 ? (
        <p className={styles.muted}>{t('adminPanel.noUsers')}</p>
      ) : (
        <AdminUsersTable
          users={users.data?.content || []}
          updatingId={users.updatingId}
          onVerify={(u) => users.updateUser(u, { profileVerified: !u.profileVerified })}
          onRoleChange={(u, role) => users.updateUser(u, { role })}
          onBlock={users.setBlockModal}
          onUnblock={(u) => users.updateUser(u, { bannedUntil: null, banReason: null })}
          isBanned={isBanned}
          t={t}
          footer={
            <UiPagination
              page={users.page}
              size={users.size}
              totalElements={users.data?.totalElements}
              totalPages={users.data?.totalPages}
              onPageChange={users.setPage}
              onSizeChange={users.setSize}
            />
          }
        />
      )}
      <BlockUserModal
        user={users.blockModal}
        onClose={() => users.setBlockModal(null)}
        onSubmit={(userId, bannedUntil, banReason) => {
          const user = { id: userId }
          users.updateUser(user, { bannedUntil: bannedUntil || null, banReason: banReason || null })
          users.setBlockModal(null)
        }}
        loading={users.updatingId === users.blockModal?.id}
      />
    </div>
  )
}
