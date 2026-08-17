import { useState } from 'react'
import { useLang } from '../../context/LangContext'
import { authApi } from '@/api/auth'
import {
  formatBirthDateInput,
  formatNumberInput,
  formatSeriesInput,
  validateIdVerificationForm,
} from '../../utils/idVerificationForm'
import IdVerificationConsent from './IdVerificationConsent'
import styles from './IdVerificationModal.module.css'

export default function IdVerificationModal({ open, onClose }) {
  const { t, lang } = useLang()
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

  const handleContinue = async (e) => {
    e.preventDefault()
    setError('')
    const validated = validateIdVerificationForm({ birthDate, series, number, t })
    if (validated.error) {
      setError(validated.error)
      return
    }
    setLoading(true)
    try {
      const result = await authApi.startVerification({
        birthDate: validated.birthDate,
        documentSeries: validated.series,
        documentNumber: validated.number,
        agreedOnTerms: true,
        lang,
      })
      if (result?.redirectUrl) {
        window.location.assign(result.redirectUrl)
        return
      }
      setError(result?.message || t('profile.verificationError'))
    } catch (err) {
      setError(err?.message || t('profile.verificationError'))
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
      <div className={`app-card position-relative ${styles.modal}`} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="btn btn-link position-absolute top-0 end-0 p-2 text-secondary text-decoration-none"
          onClick={handleClose}
          aria-label={t('common.close')}
        >
          <i className="bi bi-x-lg" aria-hidden />
        </button>

        {step === 1 && (
          <>
            <div className="text-center mb-3">
              <i className={`bi bi-shield-check text-primary ${styles.introIcon}`} aria-hidden />
            </div>
            <h2 id="id-verification-title" className="h5 text-center mb-2">
              {t('profile.verificationIntroTitle')}
            </h2>
            <p className="text-muted small text-center mb-4">{t('profile.verificationIntroText')}</p>
            <button type="button" className="btn btn-primary w-100" onClick={() => { setStep(2); setError('') }}>
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
                <label className="form-label small" htmlFor="id-verification-birth">
                  {t('profile.verificationBirthDate')}
                </label>
                <input
                  id="id-verification-birth"
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
                <label className="form-label small" htmlFor="id-verification-series">
                  {t('profile.verificationDocLabel')}
                </label>
                <div className="row g-2">
                  <div className="col-4">
                    <input
                      id="id-verification-series"
                      type="text"
                      className="form-control"
                      value={series}
                      onChange={(e) => setSeries(formatSeriesInput(e.target.value))}
                      placeholder={t('profile.verificationSeries')}
                      maxLength={2}
                      autoComplete="off"
                      autoCapitalize="characters"
                    />
                  </div>
                  <div className="col-8">
                    <input
                      id="id-verification-number"
                      type="text"
                      className="form-control"
                      value={number}
                      onChange={(e) => setNumber(formatNumberInput(e.target.value))}
                      placeholder={t('profile.verificationNumber')}
                      maxLength={7}
                      autoComplete="off"
                      inputMode="numeric"
                    />
                  </div>
                </div>
              </div>
              <IdVerificationConsent t={t} />
              {error && <div className="alert alert-danger py-2 mb-0" role="alert">{error}</div>}
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? t('common.loading') : t('profile.verificationContinue')}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
