import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLang } from '../../../../context/LangContext'
import { adsApi, imageUrl, referenceApi } from '../../services/adApi'
import OSMMap from '../../../../components/OSMMap/OSMMap'
import styles from './CreateAd.module.css'

const CURRENCIES = [
  { value: 'UZS', labelKey: 'ads.currencyUzs', short: 'сум' },
  { value: 'USD', labelKey: 'ads.currencyUsd', short: 'у.е.' },
]
const TASHKENT = [41.2995, 69.2401]

export default function CreateAd({ edit: editMode }) {
  const navigate = useNavigate()
  const { id: editId } = useParams()
  const { t, lang } = useLang()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadedUrls, setUploadedUrls] = useState([])
  const [regions, setRegions] = useState([])
  const [categories, setCategories] = useState([])
  const [mapPosition, setMapPosition] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'UZS',
    category: 'Xizmatlar',
    phone: '',
    email: '',
    displayName: '',
    region: '',
    district: '',
    isNegotiable: false,
    giveAway: false,
    address: '',
    landmark: '',
    canDeliver: false,
    contactByPhone: true,
    contactByTelegram: false,
    expiresAt: '',
  })

  useEffect(() => {
    referenceApi.getRegions().then(setRegions).catch(() => setRegions([]))
    referenceApi.getCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    if (!editMode || !editId) return
    adsApi.getById(editId).then((ad) => {
      const imgs = ad.images || []
      const urls = imgs.sort((a, b) => (a.orderNum ?? 0) - (b.orderNum ?? 0)).map((i) => i.url || i).filter(Boolean)
      setUploadedUrls(urls)
      const expiresAt = ad.expiresAt ? new Date(ad.expiresAt).toISOString().slice(0, 16) : ''
      setForm({
        title: ad.title || '',
        description: ad.description || '',
        price: ad.price != null ? String(ad.price) : '',
        currency: ad.currency || 'UZS',
        category: ad.category || 'Xizmatlar',
        phone: ad.phone || '',
        email: ad.email || '',
        displayName: '',
        region: ad.region || '',
        district: ad.district || '',
        isNegotiable: !!ad.isNegotiable,
        giveAway: ad.price === 0,
        address: '',
        landmark: '',
        canDeliver: false,
        contactByPhone: true,
        contactByTelegram: false,
        expiresAt,
      })
    }).catch(() => {})
  }, [editMode, editId])

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
      ...(name === 'giveAway' && checked ? { price: '0' } : {}),
    }))
  }

  const handleFileSelect = async (e) => {
    const files = e.target.files
    if (!files?.length) return
    setUploading(true)
    setError('')
    try {
      for (let i = 0; i < Math.min(files.length, 6 - uploadedUrls.length); i++) {
        const file = files[i]
        if (!file.type.startsWith('image/')) continue
        const data = await adsApi.upload(file)
        if (data?.url) setUploadedUrls((prev) => [...prev, data.url].slice(0, 6))
      }
    } catch (err) {
      setError(err.message || t('common.error'))
    } finally {
      setUploading(false)
    }
    e.target.value = ''
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer?.files?.length) handleFileSelect({ target: { files: e.dataTransfer.files } })
  }
  const onDragOver = (e) => { e.preventDefault(); setDragOver(true) }
  const onDragLeave = () => setDragOver(false)

  const removeImage = (index) => {
    setUploadedUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const setMyLocation = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => setMapPosition([pos.coords.latitude, pos.coords.longitude]),
      () => {}
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      let description = form.description.trim()
      if (form.address?.trim() || form.landmark?.trim()) {
        const parts = []
        if (form.address?.trim()) parts.push(lang === 'ru' ? `Адрес: ${form.address.trim()}` : `Manzil: ${form.address.trim()}`)
        if (form.landmark?.trim()) parts.push(lang === 'ru' ? `Ориентир: ${form.landmark.trim()}` : `Yo\'nalish: ${form.landmark.trim()}`)
        description = description ? `${description}\n\n${parts.join('\n')}` : parts.join('\n')
      }
      const price = form.giveAway ? 0 : (parseFloat(form.price) || 0)
      const expiresAt = form.expiresAt
        ? new Date(form.expiresAt).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      const payload = {
        title: form.title.trim(),
        description,
        price,
        currency: form.currency || 'UZS',
        category: form.category || 'Xizmatlar',
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        region: form.region.trim() || undefined,
        district: form.district.trim() || undefined,
        isNegotiable: form.isNegotiable,
        canDeliver: form.canDeliver,
        expiresAt,
        imageUrls: uploadedUrls,
      }
      const res = editMode && editId
        ? await adsApi.update(editId, payload)
        : await adsApi.create(payload)
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

  const descLen = (form.description || '').length
  const descMax = 1000

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{editMode && editId ? (lang === 'ru' ? 'Редактировать объявление' : 'E\'lonni tahrirlash') : t('ads.createTitle')}</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <p className={styles.error}>{error}</p>}

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>{t('ads.photosSection')}</h2>
          <p className={styles.cardHint}>{t('ads.photosHint')}</p>
          <div
            className={`${styles.uploadZone} ${dragOver ? styles.dragover : ''}`}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className={styles.fileInput}
            />
            <button
              type="button"
              className={styles.uploadBtn}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || uploadedUrls.length >= 6}
            >
              {t('ads.selectFiles')}
            </button>
            <p className={styles.uploadSub}>{t('ads.orDragHere')}</p>
            <p className={styles.uploadSpecs}>{t('ads.photoSpecs')}</p>
          </div>
          {uploading && <span className={styles.uploading}>{t('common.loading')}</span>}
          {uploadedUrls.length > 0 && (
            <div className={styles.previews}>
              {uploadedUrls.map((url, index) => (
                <div key={index} className={styles.previewWrap}>
                  <img src={imageUrl(url)} alt="" className={styles.preview} />
                  <button type="button" onClick={() => removeImage(index)} className={styles.removeImg} aria-label={t('chat.delete')}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>{lang === 'ru' ? 'Название' : 'Sarlavha'}</h2>
          <p className={styles.cardHint}>{t('ads.titleHint')}</p>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            maxLength={50}
            className={styles.input}
            placeholder={t('ads.titlePlaceholder')}
          />
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>{t('ads.formCategory')} *</h2>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={styles.input}
            required
          >
            <option value="">{t('ads.selectCategory')}</option>
            {categories.map((c) => (
              <option key={c.code} value={c.code}>
                {lang === 'ru' ? c.nameRu : c.nameUz}
              </option>
            ))}
          </select>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>{t('ads.dealConditions')}</h2>
          <div className={styles.giveAwayRow}>
            <div className={styles.giveAwayLeft}>
              <span className={styles.giveAwayIcon} aria-hidden>🎈</span>
              <span className={styles.giveAwayLabel}>{t('ads.giveAway')}</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.giveAway}
              className={`${styles.toggle} ${form.giveAway ? styles.on : ''}`}
              onClick={() => setForm((p) => ({ ...p, giveAway: !p.giveAway, ...(p.giveAway ? {} : { price: '0' }) }))}
            >
              <span className={styles.toggleKnob} />
            </button>
          </div>

          <h2 className={styles.cardTitle} style={{ marginTop: '1rem' }}>{t('ads.formPrice')} *</h2>
          <div className={styles.priceRow}>
            <div className={styles.priceInputWrap}>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={handleChange}
                required
                disabled={form.giveAway}
                className={styles.input}
                placeholder={t('ads.pricePlaceholder')}
              />
            </div>
            <div className={styles.currencyBtns}>
              {CURRENCIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  className={`${styles.currencyBtn} ${form.currency === c.value ? styles.active : ''}`}
                  onClick={() => setForm((p) => ({ ...p, currency: c.value }))}
                >
                  {c.short}
                </button>
              ))}
            </div>
          </div>
          <label className={styles.checkRow}>
            <input
              name="isNegotiable"
              type="checkbox"
              checked={form.isNegotiable}
              onChange={handleChange}
            />
            <span>{t('ads.negotiable')}</span>
          </label>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>{t('ads.formDescription')} *</h2>
          <p className={styles.cardHint}>{t('ads.descriptionExample')}</p>
          <div className={styles.descWrap}>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              maxLength={descMax}
              rows={5}
              className={`${styles.input} ${styles.textarea}`}
              placeholder={t('ads.descriptionPlaceholder')}
            />
            <span className={styles.descCounter}>{descLen}/{descMax}</span>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>{t('ads.locationTitle')}</h2>
          <p className={styles.cardHint}>{t('ads.locationHint')}</p>
          <div className={styles.locationActions}>
            <button type="button" className={styles.myLocationBtn} onClick={setMyLocation}>
              <span aria-hidden>✈</span> {t('ads.myLocation')}
            </button>
          </div>
          <div className={styles.mapWrap}>
            <OSMMap
              center={TASHKENT}
              position={mapPosition}
              onPositionChange={setMapPosition}
            />
          </div>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className={styles.input}
            placeholder={t('ads.addressPlaceholder')}
            style={{ marginBottom: '0.5rem' }}
          />
          <input
            name="landmark"
            value={form.landmark}
            onChange={handleChange}
            className={styles.input}
            placeholder={t('ads.landmarkPlaceholder')}
            style={{ marginBottom: '0.5rem' }}
          />
          <label className={styles.checkRow}>
            <input
              name="canDeliver"
              type="checkbox"
              checked={form.canDeliver}
              onChange={handleChange}
            />
            <span>{t('ads.canDeliver')}</span>
          </label>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>{t('ads.contactsTitle')}</h2>
          <label className={styles.cardHint} style={{ display: 'block', marginBottom: '0.5rem' }}>
            {t('ads.formPhone')} *
          </label>
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            required
            className={styles.input}
            style={{ marginBottom: '0.75rem' }}
          />
          <label className={styles.cardHint} style={{ display: 'block', marginBottom: '0.5rem' }}>
            {t('auth.displayName')}
          </label>
          <input
            name="displayName"
            value={form.displayName}
            onChange={handleChange}
            className={styles.input}
            placeholder={t('ads.namePlaceholder')}
          />
          <label className={styles.cardHint} style={{ display: 'block', marginTop: '0.75rem', marginBottom: '0.5rem' }}>
            {t('ads.formEmail')}
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={styles.input}
          />
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>{t('ads.contactMethods')}</h2>
          <p className={styles.cardHint}>{t('ads.contactMethodsHint')}</p>
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
              <button
                type="button"
                role="switch"
                aria-checked={form.contactByPhone}
                className={`${styles.toggle} ${form.contactByPhone ? styles.on : ''}`}
                onClick={() => setForm((p) => ({ ...p, contactByPhone: !p.contactByPhone }))}
              >
                <span className={styles.toggleKnob} />
              </button>
            </div>
            <div className={styles.contactMethodRow}>
              <div className={styles.contactMethodLeft}>
                <span className={`${styles.contactMethodIcon} ${styles.telegram}`}>✈</span>
                <div>
                  <span className={styles.contactMethodLabel}>{t('ads.telegramChat')}</span>
                  {form.phone && <p className={styles.contactMethodSub}>+{form.phone.replace(/\D/g, '').slice(-9)}</p>}
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={form.contactByTelegram}
                className={`${styles.toggle} ${form.contactByTelegram ? styles.on : ''}`}
                onClick={() => setForm((p) => ({ ...p, contactByTelegram: !p.contactByTelegram }))}
              >
                <span className={styles.toggleKnob} />
              </button>
            </div>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>{t('ads.formRegion')}</h2>
          <select
            name="region"
            value={form.region}
            onChange={handleChange}
            className={styles.input}
            style={{ marginBottom: '0.75rem' }}
          >
            <option value="">—</option>
            {regions.map((r) => (
              <option key={r.code} value={r.code}>
                {regionName(r)}
              </option>
            ))}
          </select>
          <h2 className={styles.cardTitle}>{t('ads.formDistrict')}</h2>
          <select
            name="district"
            value={form.district}
            onChange={handleChange}
            className={styles.input}
            disabled={!form.region}
            style={{ marginBottom: '0.75rem' }}
          >
            <option value="">—</option>
            {districtOptions.map((d) => (
              <option key={d.id} value={districtName(d)}>
                {districtName(d)}
              </option>
            ))}
          </select>
          <h2 className={styles.cardTitle}>{t('ads.formExpiresAt')} *</h2>
          <input
            name="expiresAt"
            type="datetime-local"
            value={form.expiresAt || defaultExpires()}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </section>

        <div className={styles.actions}>
          <button type="submit" disabled={submitting} className={styles.submit}>
            {submitting ? t('common.loading') : t('common.save')}
          </button>
        </div>
      </form>
    </div>
  )
}
