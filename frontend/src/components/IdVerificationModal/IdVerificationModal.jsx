/**
 * Модалка проверки ID: два шага.
 * 1) Интро: «Станьте проверенным пользователем» + кнопка «Пройти проверку ID».
 * 2) Форма: дата рождения, серия и номер документа, согласие, «Продолжить» → запуск MyID (редирект или embedded по API).
 */
import { useState } from 'react'
import { useLang } from '../../context/LangContext'
import { useToast } from '../../context/ToastContext'
import { authApi } from '../../api/client'
import styles from './IdVerificationModal.module.css'

export default function IdVerificationModal({ open, onClose }) {
  const { t } = useLang()
  const { showToast } = useToast()
  const [step, setStep] = useState(1)
  const [birthDate, setBirthDate] = useState('')
  const [series, setSeries] = useState('')
  const [number, setNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  const handleClose = () => {
    setStep(1)
    setBirthDate('')
    setSeries('')
    setNumber('')
    setError('')
    onClose()
  }

  const handleStartVerification = () => {
    setStep(2)
    setError('')
  }

  /** Форматирование даты: только цифры, точки подставляются автоматически (ДД.ММ.ГГГГ), макс. 8 цифр. */
  const formatBirthDateInput = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 8)
    if (digits.length <= 2) return digits
    if (digits.length <= 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`
    return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`
  }

  const parseBirthDate = (value) => {
    const match = value.trim().match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/)
    if (!match) return null
    const [, d, m, y] = match
    const day = parseInt(d, 10)
    const month = parseInt(m, 10) - 1
    const year = parseInt(y, 10)
    if (month < 0 || month > 11 || day < 1 || day > 31) return null
    const date = new Date(year, month, day)
    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return null
    return date.toISOString().slice(0, 10)
  }

  const handleContinue = async (e) => {
    e.preventDefault()
    setError('')
    const parsed = parseBirthDate(birthDate)
    if (!parsed) {
      setError(t('profile.verificationBirthPlaceholder') || 'Введите дату в формате ДД.ММ.ГГГГ')
      return
    }
    if (!series.trim() || !number.trim()) {
      setError(t('profile.verificationDocLabel') || 'Укажите серию и номер документа')
      return
    }
    setLoading(true)
    try {
      const result = await authApi.startVerification({
        birthDate: parsed,
        documentSeries: series.trim(),
        documentNumber: number.trim(),
      })
      if (result?.redirectUrl) {
        window.location.href = result.redirectUrl
        return
      }
      if (result?.embedUrl) {
        window.open(result.embedUrl, '_blank', 'noopener,noreferrer')
        handleClose()
        return
      }
      const successMsg = result?.message || 'Заявка принята. Модератор проверит данные и подтвердит профиль.'
      showToast(successMsg)
      handleClose()
    } catch (err) {
      const errText = err?.message || (err && String(err)) || t('profile.verificationError')
      setError(errText)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={styles.overlay}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="id-verification-title"
    >
      <div className={`app-card position-relative p-4 ${styles.modal}`} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="btn btn-link position-absolute top-0 end-0 p-2 text-secondary text-decoration-none"
          onClick={handleClose}
          aria-label={t('common.close') || 'Закрыть'}
        >
          <i className="bi bi-x-lg" aria-hidden />
        </button>

        {step === 1 && (
          <>
            <div className="text-center mb-3">
              <i className="bi bi-shield-check text-primary" style={{ fontSize: '3rem' }} aria-hidden />
            </div>
            <h2 id="id-verification-title" className="h5 text-center mb-2">
              {t('profile.verificationIntroTitle')}
            </h2>
            <p className="text-muted small text-center mb-4">{t('profile.verificationIntroText')}</p>
            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={handleStartVerification}
            >
              {t('profile.verificationStartBtn')}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 id="id-verification-title" className="h5 mb-2">
              {t('profile.verificationFormTitle')}
            </h2>
            <p className="text-muted small mb-3">{t('profile.verificationFormDescription')}</p>
            <form onSubmit={handleContinue} className="d-flex flex-column gap-3">
              <div>
                <label className="form-label small">{t('profile.verificationBirthDate')}</label>
                <input
                  type="text"
                  className="form-control"
                  value={birthDate}
                  onChange={(e) => setBirthDate(formatBirthDateInput(e.target.value))}
                  placeholder={t('profile.verificationBirthPlaceholder')}
                  maxLength={10}
                  autoComplete="bday"
                  inputMode="numeric"
                />
              </div>
              <div>
                <label className="form-label small">{t('profile.verificationDocLabel')}</label>
                <div className="row g-2">
                  <div className="col-6">
                    <input
                      type="text"
                      className="form-control"
                      value={series}
                      onChange={(e) => setSeries(e.target.value.slice(0, 4))}
                      placeholder={t('profile.verificationSeries')}
                      maxLength={4}
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      className="form-control"
                      value={number}
                      onChange={(e) => setNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                      placeholder={t('profile.verificationNumber')}
                      maxLength={9}
                      autoComplete="off"
                      inputMode="numeric"
                    />
                  </div>
                </div>
              </div>
              <p className="small text-muted mb-0">{t('profile.verificationConsent')}</p>
              {error && <div className="alert alert-danger py-2 mb-0" role="alert">{error}</div>}
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? (t('common.loading') || '…') : t('profile.verificationContinue')}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
