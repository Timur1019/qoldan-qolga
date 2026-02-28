import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLang } from '../../../../context/LangContext'
import { adsApi, imageUrl, referenceApi } from '../../services/adApi'
import OSMMap from '../../../../components/OSMMap/OSMMap'
import CategorySelectModal from '../../../../components/CategorySelectModal/CategorySelectModal'
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
  const [allCategories, setAllCategories] = useState([])
  const [mapPosition, setMapPosition] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
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
    sellerType: '',
    hasLicense: false,
    worksByContract: false,
    urgentBargain: false,
    locationLat: '',
    locationLng: '',
  })

  useEffect(() => {
    referenceApi.getRegions().then(setRegions).catch(() => setRegions([]))
    referenceApi
      .getCategories()
      .then((list) => {
        const roots = Array.isArray(list) ? list : []
        setCategories(roots)
        const base = [...roots]
        const withChildren = roots.filter((c) => c.hasChildren)
        if (withChildren.length === 0) {
          setAllCategories(base)
          return
        }
        Promise.all(
          withChildren.map((c) =>
            referenceApi.getCategoryChildren(c.code).catch(() => [])
          )
        )
          .then((childrenLists) => {
            childrenLists.forEach((children) => {
              ;(Array.isArray(children) ? children : []).forEach((ch) => {
                base.push(ch)
              })
            })
            setAllCategories(base)
          })
          .catch(() => setAllCategories(base))
      })
      .catch(() => {
        setCategories([])
        setAllCategories([])
      })
  }, [])

  // При выборе точки на карте автоматически подставляем координаты в отдельные поля
  useEffect(() => {
    if (!mapPosition || !Array.isArray(mapPosition) || mapPosition.length < 2) return
    const [lat, lng] = mapPosition
    if (typeof lat !== 'number' || typeof lng !== 'number') return
    setForm((prev) => ({
      ...prev,
      locationLat: lat.toFixed(5),
      locationLng: lng.toFixed(5),
    }))
  }, [mapPosition])

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
        giveAway: !!ad.giveAway || ad.price === 0,
        address: '',
        landmark: '',
        canDeliver: !!ad.canDeliver,
        sellerType: ad.sellerType || '',
        hasLicense: !!ad.hasLicense,
        worksByContract: !!ad.worksByContract,
        urgentBargain: !!ad.urgentBargain,
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

  const selectedCategoryObj = useMemo(
    () => (allCategories.length ? allCategories : categories).find((c) => c.code === form.category),
    [allCategories, categories, form.category]
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
        if (form.landmark?.trim()) parts.push(lang === 'ru' ? `Ориентир: ${form.landmark.trim()}` : `Yo'nalish: ${form.landmark.trim()}`)
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
        sellerType: form.sellerType || undefined,
        hasLicense: form.hasLicense,
        worksByContract: form.worksByContract,
        urgentBargain: form.urgentBargain,
        giveAway: form.giveAway,
        locationLat: form.locationLat ? Number(form.locationLat) : null,
        locationLng: form.locationLng ? Number(form.locationLng) : null,
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

  const handleGeocodeAddress = async () => {
    const query = (form.address || '').trim()
    if (!query) return
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`
      const res = await fetch(url, {
        headers: {
          'Accept-Language': lang === 'ru' ? 'ru' : 'uz',
        },
      })
      const data = await res.json().catch(() => [])
      if (!Array.isArray(data) || data.length === 0) return
      const first = data[0]
      const lat = parseFloat(first.lat)
      const lon = parseFloat(first.lon)
      if (Number.isNaN(lat) || Number.isNaN(lon)) return
      setMapPosition([lat, lon])
      setForm((prev) => ({
        ...prev,
        locationLat: lat.toFixed(5),
        locationLng: lon.toFixed(5),
      }))
    } catch {
      // игнорируем ошибки геокодинга, карта просто не обновится
    }
  }

  return (
    <div className="page-container app-page">
      <h1 className="h2 mb-4">{editMode && editId ? (lang === 'ru' ? 'Редактировать объявление' : 'E\'lonni tahrirlash') : t('ads.createTitle')}</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-circle me-2" aria-hidden /> {error}
          </div>
        )}

        <section className={`app-card ${styles.card}`}>
          <h2 className="h6 mb-1">{t('ads.photosSection')}</h2>
          <p className="text-muted small mb-2">{t('ads.photosHint')}</p>
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
              className="d-none"
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || uploadedUrls.length >= 6}
            >
              <i className="bi bi-images me-2" aria-hidden /> {t('ads.selectFiles')}
            </button>
            <p className="text-muted small mt-2 mb-0">{t('ads.orDragHere')}</p>
            <p className="text-muted small mb-0">{t('ads.photoSpecs')}</p>
          </div>
          {uploading && <span className="small text-muted">{t('common.loading')}</span>}
          {uploadedUrls.length > 0 && (
            <div className={styles.previews}>
              {uploadedUrls.map((url, index) => (
                <div key={index} className={styles.previewWrap}>
                  <img src={imageUrl(url)} alt="" className={styles.preview} />
                  <button type="button" onClick={() => removeImage(index)} className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle p-0" style={{ width: '24px', height: '24px' }} aria-label={t('chat.delete')}>
                    <i className="bi bi-x" aria-hidden />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={`app-card ${styles.card}`}>
          <label className="form-label fw-semibold">{lang === 'ru' ? 'Название' : 'Sarlavha'}</label>
          <p className="text-muted small mb-2">{t('ads.titleHint')}</p>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            maxLength={50}
            className="form-control"
            placeholder={t('ads.titlePlaceholder')}
          />
        </section>

        <section className={`app-card ${styles.card}`}>
          <label className="form-label fw-semibold">{t('ads.formCategory')} *</label>
          <button
            type="button"
            className="form-select text-start d-flex align-items-center justify-content-between"
            onClick={() => setCategoryModalOpen(true)}
          >
            <span className={!selectedCategoryObj ? 'text-muted' : ''}>
              {selectedCategoryObj
                ? (lang === 'ru' ? selectedCategoryObj.nameRu : selectedCategoryObj.nameUz)
                : t('ads.selectCategory')}
            </span>
            <i className="bi bi-chevron-down" aria-hidden />
          </button>
        </section>

        <section className={`app-card ${styles.card}`}>
          <h2 className="h6 mb-2">{t('ads.dealConditions')}</h2>
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

          <h2 className="h6 mb-2 mt-3">{t('ads.formPrice')} *</h2>
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
                className="form-control"
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
            <span>{t('ads.formNegotiable')}</span>
          </label>
        </section>

        <section className={`app-card ${styles.card}`}>
          <h2 className="h6 mb-2">{t('ads.sellerType')}</h2>
          <div className={styles.filterOptions}>
            <label className={styles.filterRadio}>
              <input
                type="radio"
                name="sellerType"
                value=""
                checked={form.sellerType === ''}
                onChange={handleChange}
              />
              <span>{t('ads.any')}</span>
            </label>
            <label className={styles.filterRadio}>
              <input
                type="radio"
                name="sellerType"
                value="PRIVATE"
                checked={form.sellerType === 'PRIVATE'}
                onChange={handleChange}
              />
              <span>{t('ads.sellerPrivate')}</span>
            </label>
            <label className={styles.filterRadio}>
              <input
                type="radio"
                name="sellerType"
                value="BUSINESS"
                checked={form.sellerType === 'BUSINESS'}
                onChange={handleChange}
              />
              <span>{t('ads.sellerBusiness')}</span>
            </label>
          </div>

          <h2 className="h6 mb-2 mt-3">{t('ads.hasLicense')}</h2>
          <div className={styles.filterOptions}>
            <label className={styles.filterRadio}>
              <input
                type="radio"
                name="hasLicense"
                checked={!form.hasLicense}
                onChange={() => setForm((p) => ({ ...p, hasLicense: false }))}
              />
              <span>{lang === 'ru' ? 'Нет' : 'Yo\'q'}</span>
            </label>
            <label className={styles.filterRadio}>
              <input
                type="radio"
                name="hasLicense"
                checked={form.hasLicense}
                onChange={() => setForm((p) => ({ ...p, hasLicense: true }))}
              />
              <span>{lang === 'ru' ? 'Да' : 'Ha'}</span>
            </label>
          </div>

          <h2 className="h6 mb-2 mt-3">{t('ads.worksByContract')}</h2>
          <div className={styles.filterOptions}>
            <label className={styles.filterRadio}>
              <input
                type="radio"
                name="worksByContract"
                checked={!form.worksByContract}
                onChange={() => setForm((p) => ({ ...p, worksByContract: false }))}
              />
              <span>{lang === 'ru' ? 'Нет' : 'Yo\'q'}</span>
            </label>
            <label className={styles.filterRadio}>
              <input
                type="radio"
                name="worksByContract"
                checked={form.worksByContract}
                onChange={() => setForm((p) => ({ ...p, worksByContract: true }))}
              />
              <span>{lang === 'ru' ? 'Да' : 'Ha'}</span>
            </label>
          </div>

          <div className={styles.giveAwayRow} style={{ marginTop: '1rem' }}>
            <div className={styles.giveAwayLeft}>
              <span className={styles.giveAwayIcon} aria-hidden>⚡</span>
              <span className={styles.giveAwayLabel}>{t('ads.urgentBargain')}</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.urgentBargain}
              className={`${styles.toggle} ${form.urgentBargain ? styles.on : ''}`}
              onClick={() => setForm((p) => ({ ...p, urgentBargain: !p.urgentBargain }))}
            >
              <span className={styles.toggleKnob} />
            </button>
          </div>
        </section>

        <section className={`app-card ${styles.card}`}>
          <h2 className="h6 mb-2">{t('ads.formDescription')} *</h2>
          <p className="text-muted small mb-2">{t('ads.descriptionExample')}</p>
          <div className={styles.descWrap}>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              maxLength={descMax}
              rows={5}
              className="form-control"
              placeholder={t('ads.descriptionPlaceholder')}
            />
            <span className={styles.descCounter}>{descLen}/{descMax}</span>
          </div>
        </section>

        <section className={`app-card ${styles.card}`}>
          <h2 className="h6 mb-2">{t('ads.locationTitle')}</h2>
          <p className="text-muted small mb-2">{t('ads.locationHint')}</p>
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
          <div className={styles.coordsRow}>
            <input
              name="locationLat"
              value={form.locationLat}
              readOnly
              className="form-control form-control-sm"
              placeholder="Широта"
            />
            <input
              name="locationLng"
              value={form.locationLng}
              readOnly
              className="form-control form-control-sm"
              placeholder="Долгота"
            />
          </div>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="form-control"
            placeholder={t('ads.addressPlaceholder')}
            style={{ marginBottom: '0.5rem' }}
          />
          <input
            name="landmark"
            value={form.landmark}
            onChange={handleChange}
            className="form-control"
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

        <section className={`app-card ${styles.card}`}>
          <h2 className="h6 mb-2">{t('ads.contactsTitle')}</h2>
          <label className="form-label">{t('ads.formPhone')} *</label>
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            required
            className="form-control mb-3"
          />
          <label className="form-label">{t('auth.displayName')}</label>
          <input
            name="displayName"
            value={form.displayName}
            onChange={handleChange}
            className="form-control mb-3"
            placeholder={t('ads.namePlaceholder')}
          />
          <label className="form-label">{t('ads.formEmail')}</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="form-control"
          />
        </section>

        <section className={`app-card ${styles.card}`}>
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

        <section className={`app-card ${styles.card}`}>
          <h2 className="h6 mb-2">{t('ads.formRegion')}</h2>
          <select
            name="region"
            value={form.region}
            onChange={handleChange}
            className="form-control"
            style={{ marginBottom: '0.75rem' }}
          >
            <option value="">—</option>
            {regions.map((r) => (
              <option key={r.code} value={r.code}>
                {regionName(r)}
              </option>
            ))}
          </select>
          <h2 className="h6 mb-2">{t('ads.formDistrict')}</h2>
          <select
            name="district"
            value={form.district}
            onChange={handleChange}
            className="form-control"
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
          <h2 className="h6 mb-2">{t('ads.formExpiresAt')} *</h2>
          <input
            name="expiresAt"
            type="datetime-local"
            value={form.expiresAt || defaultExpires()}
            onChange={handleChange}
            required
            className="form-control"
          />
        </section>

        <div className={styles.actions}>
          <button type="submit" disabled={submitting} className="btn btn-primary btn-lg w-100">
            {submitting ? t('common.loading') : t('common.save')}
          </button>
        </div>
      </form>
      {categoryModalOpen && (
        <CategorySelectModal
          categories={categories}
          value={form.category}
          onSelect={(cat) => {
            if (!cat?.code) {
              setCategoryModalOpen(false)
              return
            }
            setForm((prev) => ({ ...prev, category: cat.code }))
            setAllCategories((prev) => {
              if (!cat || !cat.code) return prev
              const exists = prev.some((c) => c.code === cat.code)
              if (exists) return prev
              return [...prev, cat]
            })
            setCategoryModalOpen(false)
          }}
          onClose={() => setCategoryModalOpen(false)}
        />
      )}
    </div>
  )
}
