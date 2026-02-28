import { useState } from 'react'
import { businessApplicationsApi } from '../../api/client'
import styles from './BusinessSignup.module.css'

export default function BusinessSignup() {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    const form = e.target
    const formData = new FormData(form)
    formData.set('agreement', form.elements.agreement?.checked ? 'true' : 'false')
    setSubmitting(true)
    try {
      await businessApplicationsApi.submit(formData)
      setSuccess(true)
      form.reset()
    } catch (err) {
      setError(err.message || 'Не удалось отправить заявку')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-container app-page">
      <header className={styles.header}>
        <h1 className={styles.title}>Qoldan Qolga для бизнеса</h1>
        <p className={styles.lead}>
          Спасибо, что выбрали Qoldan Qolga — сервис объявлений в Узбекистане. Мы ищем профессиональных
          продавцов на платформу.
        </p>
        <p className={styles.text}>
          Профессиональный продавец — это зарегистрированное юридическое или физическое лицо:
        </p>
        <ul className={styles.list}>
          <li>ООО (Общество с ограниченной ответственностью)</li>
          <li>ИП (Индивидуальный предприниматель)</li>
          <li>Самозанятый</li>
        </ul>
        <p className={styles.text}>
          Если вы соответствуете этим требованиям, вы получите статус «Магазин» и сможете продвигать свои товары
          на платформе как профессиональный продавец.
        </p>
      </header>

      {success && (
        <div className="alert alert-success" role="status">
          Заявка отправлена. Мы свяжемся с вами после проверки данных.
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form className={`${styles.form} app-card`} onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">
            Как вас зовут<span className={styles.required}>*</span>
          </label>
          <input type="text" name="fullName" className="form-control" required />
        </div>

        <div className="mb-3">
          <label className="form-label">
            Название вашего Магазина<span className={styles.required}>*</span>
          </label>
          <input type="text" name="shopName" className="form-control" required />
        </div>

        <div className="mb-3">
          <span className={styles.label}>
            Какой формой бизнеса вы представлены?<span className={styles.required}>*</span>
          </span>
          <div className={styles.options}>
            <label className={styles.option}>
              <input type="radio" name="businessType" value="self" className="form-check-input" required />
              <span>Самозанятый</span>
            </label>
            <label className={styles.option}>
              <input type="radio" name="businessType" value="ip" className="form-check-input" />
              <span>ИП — Индивидуальный предприниматель</span>
            </label>
            <label className={styles.option}>
              <input type="radio" name="businessType" value="ooo" className="form-check-input" />
              <span>ООО — Общество с ограниченной ответственностью</span>
            </label>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">
            Приложите сканированную копию паспорта<span className={styles.required}>*</span>
          </label>
          <input type="file" name="passport" className="form-control" accept="image/*,.pdf" required />
        </div>

        <div className="mb-3">
          <label className="form-label">
            Приложите Свидетельство о регистрации ИП, ООО, или статуса Самозанятый<span className={styles.required}>*</span>
          </label>
          <input type="file" name="registration" className="form-control" accept="image/*,.pdf" required />
        </div>

        <div className="mb-3">
          <label className="form-label">
            В каком городе вы находитесь?<span className={styles.required}>*</span>
          </label>
          <input type="text" name="city" className="form-control" required />
        </div>

        <div className="mb-3">
          <span className={styles.label}>
            Какие товары вы продаёте?<span className={styles.required}>*</span>
          </span>
          <div className={styles.options}>
            <label className={styles.option}>
              <input type="radio" name="productCategory" value="fashion" className="form-check-input" required />
              <span>Одежда и Обувь</span>
            </label>
            <label className={styles.option}>
              <input type="radio" name="productCategory" value="electronics" className="form-check-input" />
              <span>Электроника</span>
            </label>
            <label className={styles.option}>
              <input type="radio" name="productCategory" value="beauty" className="form-check-input" />
              <span>Красота и здоровье</span>
            </label>
            <label className={styles.option}>
              <input type="radio" name="productCategory" value="jewelry" className="form-check-input" />
              <span>Украшения и аксессуары</span>
            </label>
            <label className={styles.option}>
              <input type="radio" name="productCategory" value="hobby" className="form-check-input" />
              <span>Хобби и спорт</span>
            </label>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">
            Приложите ссылку на ваш Магазин
          </label>
          <input
            type="url"
            name="shopUrl"
            className="form-control"
            placeholder="Ссылка на Telegram, Instagram или сайт"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">
            Номер телефона для связи<span className={styles.required}>*</span>
          </label>
          <input
            type="tel"
            name="phone"
            className="form-control"
            placeholder="+998 9X XXX XX XX"
            required
          />
        </div>

        <div className="mb-3">
          <label className={styles.checkboxLabel}>
            <input type="checkbox" name="agreement" value="true" className="form-check-input" required />
            <span>
              Согласие с условиями пользовательского соглашения
            </span>
          </label>
        </div>

        <div className="mt-3">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Отправка…' : 'Отправить заявку'}
          </button>
        </div>
      </form>
    </div>
  )
}

