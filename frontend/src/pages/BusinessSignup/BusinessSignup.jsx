import { useState } from 'react'
import { businessApplicationsApi } from '../../api/client'

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
      <header className="mb-4">
        <h1 className="h2 mb-2 text-dark">Qoldan Qolga для бизнеса</h1>
        <p className="text-secondary mb-2">
          Спасибо, что выбрали Qoldan Qolga — сервис объявлений в Узбекистане. Мы ищем профессиональных
          продавцов на платформу.
        </p>
        <p className="text-secondary mb-2">
          Профессиональный продавец — это зарегистрированное юридическое или физическое лицо:
        </p>
        <ul className="text-secondary mb-2 ms-3">
          <li>ООО (Общество с ограниченной ответственностью)</li>
          <li>ИП (Индивидуальный предприниматель)</li>
          <li>Самозанятый</li>
        </ul>
        <p className="text-secondary mb-0">
          Если вы соответствуете этим требованиям, вы получите статус «Магазин» и сможете продвигать свои товары
          на платформе как профессиональный продавец.
        </p>
      </header>

      {success && (
        <div className="alert alert-success mb-3" role="status">
          Заявка отправлена. Мы свяжемся с вами после проверки данных.
        </div>
      )}
      {error && (
        <div className="alert alert-danger mb-3" role="alert">
          {error}
        </div>
      )}

      <div className="card shadow-sm border rounded-3">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-3">
              <label className="form-label">
                Как вас зовут <span className="text-danger">*</span>
              </label>
              <input type="text" name="fullName" className="form-control" required />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Название вашего Магазина <span className="text-danger">*</span>
              </label>
              <input type="text" name="shopName" className="form-control" required />
            </div>

            <div className="mb-3">
              <label className="form-label d-block">
                Какой формой бизнеса вы представлены? <span className="text-danger">*</span>
              </label>
              <div className="form-check">
                <input type="radio" name="businessType" value="self" id="bt-self" className="form-check-input" required />
                <label className="form-check-label" htmlFor="bt-self">Самозанятый</label>
              </div>
              <div className="form-check">
                <input type="radio" name="businessType" value="ip" id="bt-ip" className="form-check-input" />
                <label className="form-check-label" htmlFor="bt-ip">ИП — Индивидуальный предприниматель</label>
              </div>
              <div className="form-check">
                <input type="radio" name="businessType" value="ooo" id="bt-ooo" className="form-check-input" />
                <label className="form-check-label" htmlFor="bt-ooo">ООО — Общество с ограниченной ответственностью</label>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Приложите сканированную копию паспорта <span className="text-danger">*</span>
              </label>
              <input type="file" name="passport" className="form-control" accept="image/*,.pdf" required />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Приложите Свидетельство о регистрации ИП, ООО, или статуса Самозанятый <span className="text-danger">*</span>
              </label>
              <input type="file" name="registration" className="form-control" accept="image/*,.pdf" required />
            </div>

            <div className="mb-3">
              <label className="form-label">
                В каком городе вы находитесь? <span className="text-danger">*</span>
              </label>
              <input type="text" name="city" className="form-control" required />
            </div>

            <div className="mb-3">
              <label className="form-label d-block">
                Какие товары вы продаёте? <span className="text-danger">*</span>
              </label>
              <div className="form-check">
                <input type="radio" name="productCategory" value="fashion" id="pc-fashion" className="form-check-input" required />
                <label className="form-check-label" htmlFor="pc-fashion">Одежда и Обувь</label>
              </div>
              <div className="form-check">
                <input type="radio" name="productCategory" value="electronics" id="pc-electronics" className="form-check-input" />
                <label className="form-check-label" htmlFor="pc-electronics">Электроника</label>
              </div>
              <div className="form-check">
                <input type="radio" name="productCategory" value="beauty" id="pc-beauty" className="form-check-input" />
                <label className="form-check-label" htmlFor="pc-beauty">Красота и здоровье</label>
              </div>
              <div className="form-check">
                <input type="radio" name="productCategory" value="jewelry" id="pc-jewelry" className="form-check-input" />
                <label className="form-check-label" htmlFor="pc-jewelry">Украшения и аксессуары</label>
              </div>
              <div className="form-check">
                <input type="radio" name="productCategory" value="hobby" id="pc-hobby" className="form-check-input" />
                <label className="form-check-label" htmlFor="pc-hobby">Хобби и спорт</label>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Приложите ссылку на ваш Магазин</label>
              <input
                type="url"
                name="shopUrl"
                className="form-control"
                placeholder="Ссылка на Telegram, Instagram или сайт"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Номер телефона для связи <span className="text-danger">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                placeholder="+998 9X XXX XX XX"
                required
              />
            </div>

            <div className="mb-4">
              <div className="form-check">
                <input type="checkbox" name="agreement" value="true" id="agreement" className="form-check-input" required />
                <label className="form-check-label" htmlFor="agreement">
                  Согласие с условиями пользовательского соглашения
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Отправка…' : 'Отправить заявку'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

