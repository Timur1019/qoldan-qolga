import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useBusinessSignupSubmit } from '../../hooks/useBusinessSignupSubmit'
import BusinessGeneralSection from '../../components/BusinessGeneralSection'
import BusinessDocumentsSection from '../../components/BusinessDocumentsSection'
import BusinessContactSection from '../../components/BusinessContactSection'
import BusinessFormActions from '../../components/BusinessFormActions'
import styles from './BusinessSignup.module.css'

export default function BusinessSignup() {
  const navigate = useNavigate()
  const { submitting, error, success, submit } = useBusinessSignupSubmit()
  const [formKey, setFormKey] = useState(0)

  useEffect(() => {
    document.title = 'Регистрация бизнеса — Qoldan Qolga'
    return () => {
      document.title = 'Qoldan Qolga'
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await submit(e.target)
    if (ok) setFormKey((k) => k + 1)
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h1 className={styles.title}>Регистрация бизнеса</h1>
          <p className={styles.lead}>
            Присоединяйтесь к экосистеме Qoldan Qolga. Заполните форму, чтобы подтвердить бизнес
            и начать продавать как профессиональный продавец.
          </p>
        </header>

        {success ? (
          <div className={styles.alertOk} role="status">
            Заявка отправлена. Мы свяжемся с вами после проверки данных.
          </div>
        ) : null}
        {error ? (
          <div className={styles.alertErr} role="alert">
            {error}
          </div>
        ) : null}

        <form key={formKey} className={styles.form} onSubmit={handleSubmit} encType="multipart/form-data" noValidate={false}>
          <BusinessGeneralSection />
          <BusinessDocumentsSection />
          <BusinessContactSection />
          <BusinessFormActions
            submitting={submitting}
            onCancel={() => navigate(ROUTES.HOME)}
          />
        </form>
      </div>
    </div>
  )
}
