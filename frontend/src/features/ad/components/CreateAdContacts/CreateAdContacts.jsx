import { UiField, UiInput, UiToggle } from '@/shared/ui'
import shared from '../../styles/createAdShared.module.css'
import styles from './CreateAdContacts.module.css'

export default function CreateAdContacts({
  form,
  onChange,
  onPatch,
  t,
  lang,
}) {
  return (
    <>
      <section className={`app-card ${shared.card}`}>
        <h2 className="h6 mb-2">{t('ads.contactsTitle')}</h2>
        <UiField label={`${t('ads.formPhone')} *`} htmlFor="create-ad-phone">
          <UiInput
            id="create-ad-phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={onChange}
            required
          />
        </UiField>
        <UiField label={t('auth.displayName')} htmlFor="create-ad-name">
          <UiInput
            id="create-ad-name"
            name="displayName"
            value={form.displayName}
            onChange={onChange}
            placeholder={t('ads.namePlaceholder')}
          />
        </UiField>
        <UiField label={t('ads.formEmail')} htmlFor="create-ad-email">
          <UiInput
            id="create-ad-email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
          />
        </UiField>
      </section>

      <section className={`app-card ${shared.card}`}>
        <h2 className="h6 mb-2">{t('ads.contactMethods')}</h2>
        <p className="text-muted small mb-2">{t('ads.contactMethodsHint')}</p>
        <div className={styles.contactMethodsList}>
          <div className={styles.contactMethodRow}>
            <div className={styles.contactMethodLeft}>
              <span className={`${styles.contactMethodIcon} ${styles.chat}`}>💬</span>
              <div>
                <span className={styles.contactMethodLabel}>{t('profile.chat')}</span>
                <p className={styles.contactMethodSub}>{t('ads.chatDefault')}</p>
              </div>
            </div>
          </div>
          <div className={styles.contactMethodRow}>
            <div className={styles.contactMethodLeft}>
              <span className={`${styles.contactMethodIcon} ${styles.phone}`}>📞</span>
              <span className={styles.contactMethodLabel}>{t('ads.phoneCalls')}</span>
            </div>
            <UiToggle
              checked={form.contactByPhone}
              onChange={(contactByPhone) => onPatch({ contactByPhone })}
            />
          </div>
          <div className={styles.contactMethodRow}>
            <div className={styles.contactMethodLeft}>
              <span className={`${styles.contactMethodIcon} ${styles.telegram}`} aria-hidden>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
              </span>
              <div>
                <span className={styles.contactMethodLabel}>{lang === 'ru' ? 'Чат в телеграм' : 'Telegram orqali chat'}</span>
                {form.contactByTelegram && (
                  <UiInput
                    size="sm"
                    className={styles.telegramInput}
                    placeholder={lang === 'ru' ? 'Ник в Telegram (например username)' : 'Telegram nik (masalan username)'}
                    value={form.telegramUsername}
                    onChange={(e) => onPatch({ telegramUsername: e.target.value })}
                  />
                )}
                {!form.contactByTelegram && form.phone && (
                  <p className={styles.contactMethodSub}>+{form.phone.replace(/\D/g, '').slice(-9)}</p>
                )}
              </div>
            </div>
            <UiToggle
              checked={form.contactByTelegram}
              onChange={(on) => onPatch({
                contactByTelegram: on,
                ...(on ? {} : { telegramUsername: '' }),
              })}
            />
          </div>
        </div>
      </section>
    </>
  )
}
