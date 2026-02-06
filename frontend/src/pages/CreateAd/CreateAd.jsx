import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { adsApi, imageUrl, referenceApi } from '../../api/client'
import styles from './CreateAd.module.css'

const CURRENCIES = [
  { value: 'UZS', labelKey: 'ads.currencyUzs' },
  { value: 'USD', labelKey: 'ads.currencyUsd' },
]

export default function CreateAd() {
  const navigate = useNavigate()
  const { t, lang } = useLang()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadedUrls, setUploadedUrls] = useState([])
  const [regions, setRegions] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'UZS',
    category: 'Xizmatlar',
    phone: '',
    email: '',
    region: '',
    district: '',
    isNegotiable: false,
    expiresAt: '',
  })

  useEffect(() => {
    referenceApi.getRegions().then(setRegions).catch(() => setRegions([]))
    referenceApi.getCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  const selectedRegion = useMemo(
    () => regions.find((r) => r.code === form.region),
    [regions, form.region]
  )
  const districtOptions = useMemo(
    () => (selectedRegion?.districts || []),
    [selectedRegion]
  )

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'region' ? { district: '' } : {}),
    }))
  }

  const handleFileSelect = async (e) => {
    const files = e.target.files
    if (!files?.length) return
    setUploading(true)
    setError('')
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (!file.type.startsWith('image/')) continue
        const data = await adsApi.upload(file)
        if (data?.url) setUploadedUrls((prev) => [...prev, data.url])
      }
    } catch (err) {
      setError(err.message || t('common.error'))
    } finally {
      setUploading(false)
    }
    e.target.value = ''
  }

  const removeImage = (index) => {
    setUploadedUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const expiresAt = form.expiresAt
        ? new Date(form.expiresAt).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      const res = await adsApi.create({
        title: form.title.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price) || 0,
        currency: form.currency || 'UZS',
        category: form.category || 'Xizmatlar',
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        region: form.region.trim() || undefined,
        district: form.district.trim() || undefined,
        isNegotiable: form.isNegotiable,
        expiresAt,
        imageUrls: uploadedUrls,
      })
      navigate(`/ads/${res.id}`)
    } catch (err) {
      setError(err.message || t('common.error'))
    } finally {
      setSubmitting(false)
    }
  }

  const defaultExpires = () => {
    const d = new Date()
    d.setDate(d.getDate() + 30)
    return d.toISOString().slice(0, 16)
  }

  const regionName = (r) => (lang === 'ru' ? r.nameRu : r.nameUz)
  const districtName = (d) => (lang === 'ru' ? d.nameRu : d.nameUz)

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t('ads.createTitle')}</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <p className={styles.error}>{error}</p>}
        <label className={styles.label}>
          {t('ads.formTitle')} *
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            maxLength={200}
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          {t('ads.formDescription')} *
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={5}
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          {t('ads.formPrice')} *
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          {t('ads.formCurrency')}
          <select
            name="currency"
            value={form.currency}
            onChange={handleChange}
            className={styles.input}
          >
            {CURRENCIES.map((c) => (
              <option key={c.value} value={c.value}>
                {t(c.labelKey)}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          {t('ads.formCategory')} *
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={styles.input}
            required
          >
            {categories.map((c) => (
              <option key={c.code} value={c.code}>
                {lang === 'ru' ? c.nameRu : c.nameUz}
              </option>
            ))}
            {categories.length === 0 && (
              <option value="Xizmatlar">Xizmatlar</option>
            )}
          </select>
        </label>
        <label className={styles.label}>
          {t('ads.formPhone')} *
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          {t('ads.formEmail')}
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          {t('ads.formRegion')}
          <select
            name="region"
            value={form.region}
            onChange={handleChange}
            className={styles.input}
          >
            <option value="">—</option>
            {regions.map((r) => (
              <option key={r.code} value={r.code}>
                {regionName(r)}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          {t('ads.formDistrict')}
          <select
            name="district"
            value={form.district}
            onChange={handleChange}
            className={styles.input}
            disabled={!form.region}
          >
            <option value="">—</option>
            {districtOptions.map((d) => (
              <option key={d.id} value={districtName(d)}>
                {districtName(d)}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.checkLabel}>
          <input
            name="isNegotiable"
            type="checkbox"
            checked={form.isNegotiable}
            onChange={handleChange}
          />
          {t('ads.formNegotiable')}
        </label>
        <label className={styles.label}>
          {t('ads.formExpiresAt')} *
          <input
            name="expiresAt"
            type="datetime-local"
            value={form.expiresAt || defaultExpires()}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </label>
        <div className={styles.uploadSection}>
          <label className={styles.uploadLabel}>
            {t('ads.uploadPhoto')}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              disabled={uploading}
              className={styles.fileInput}
            />
          </label>
          {uploading && <span className={styles.uploading}>{t('common.loading')}</span>}
          {uploadedUrls.length > 0 && (
            <div className={styles.previews}>
              {uploadedUrls.map((url, index) => (
                <div key={index} className={styles.previewWrap}>
                  <img src={imageUrl(url)} alt="" className={styles.preview} />
                  <button type="button" onClick={() => removeImage(index)} className={styles.removeImg}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={styles.actions}>
          <button type="submit" disabled={submitting} className={styles.submit}>
            {submitting ? t('common.loading') : t('common.save')}
          </button>
        </div>
      </form>
    </div>
  )
}
