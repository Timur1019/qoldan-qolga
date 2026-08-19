import { UiAlert, UiButton, UiField, UiInput, UiSelect } from '@/shared/ui'
import styles from './AdminCreateUserForm.module.css'

export default function AdminCreateUserForm({ form, onChange, onSubmit, onCancel, submitting, error, t }) {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <h3 className={styles.title}>{t('adminPanel.addUser')}</h3>
      {error ? <UiAlert>{error}</UiAlert> : null}
      <div className={styles.row}>
        <UiField label={t('adminPanel.colName')} htmlFor="new-user-name">
          <UiInput
            id="new-user-name"
            value={form.displayName}
            onChange={(e) => onChange({ displayName: e.target.value })}
            required
          />
        </UiField>
        <UiField label="Email" htmlFor="new-user-email">
          <UiInput
            id="new-user-email"
            type="email"
            value={form.email}
            onChange={(e) => onChange({ email: e.target.value })}
            required
          />
        </UiField>
      </div>
      <div className={styles.row}>
        <UiField label={t('adminPanel.password')} htmlFor="new-user-password">
          <UiInput
            id="new-user-password"
            type="password"
            value={form.password}
            onChange={(e) => onChange({ password: e.target.value })}
            minLength={6}
            required
          />
        </UiField>
        <UiField label={t('adminPanel.colRole')} htmlFor="new-user-role">
          <UiSelect
            id="new-user-role"
            value={form.role}
            onChange={(e) => onChange({ role: e.target.value })}
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </UiSelect>
        </UiField>
      </div>
      <div className={styles.actions}>
        <UiButton type="submit" loading={submitting}>{t('adminPanel.saveUser')}</UiButton>
        <UiButton type="button" variant="outline" onClick={onCancel}>{t('common.cancel')}</UiButton>
      </div>
    </form>
  )
}
