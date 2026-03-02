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
  const [brands, setBrands] = useState([])
  const [mapPosition, setMapPosition] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)
  const brandDropdownRef = useRef(null)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'UZS',
    category: 'Xizmatlar',
    brandId: '',
    itemCondition: 'USED',
    canRent: false,
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
    telegramUsername: '',
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

  // Закрытие выпадающего списка брендов при клике снаружи
  useEffect(() => {
    const fn = (e) => {
      if (brandDropdownOpen && brandDropdownRef.current && !brandDropdownRef.current.contains(e.target)) {
        setBrandDropdownOpen(false)
      }
    }
    document.addEventListener('click', fn)
    return () => document.removeEventListener('click', fn)
  }, [brandDropdownOpen])

  // Бренды для категории (Электроника и подкатегории — бэкенд отдаёт по родителю)
  useEffect(() => {
    if (!form.category) {
      setBrands([])
      return
    }
    referenceApi.getBrandsByCategory(form.category).then((list) => setBrands(Array.isArray(list) ? list : [])).catch(() => setBrands([]))
  }, [form.category])

  // При выборе точки на карте — координаты и reverse geocoding (адрес)
  useEffect(() => {
    if (!mapPosition || !Array.isArray(mapPosition) || mapPosition.length < 2) return
    const [lat, lng] = mapPosition
    if (typeof lat !== 'number' || typeof lng !== 'number') return
    setForm((prev) => ({
      ...prev,
      locationLat: lat.toFixed(5),
      locationLng: lng.toFixed(5),
    }))
    // Reverse geocoding: координаты → адрес
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=${lang === 'ru' ? 'ru' : 'en'}`
    fetch(url, {
      headers: {
        'Accept-Language': lang === 'ru' ? 'ru' : 'uz',
        'User-Agent': 'QoldanQolga/1.0 (contact@example.com)',
      },
    })
      .then((r) => r.json())
      .then((data) => {
        const addr = data?.address
        if (!addr) return
        const parts = []
        if (addr.road) parts.push(addr.road)
        if (addr.house_number) parts.push(addr.house_number)
        if (addr.suburb || addr.neighbourhood) parts.push(addr.suburb || addr.neighbourhood)
        if (addr.village || addr.town || addr.city || addr.state) parts.push(addr.village || addr.town || addr.city || addr.state)
        if (parts.length === 0 && data.display_name) parts.push(data.display_name)
        const addressStr = parts.join(', ')
        if (addressStr) setForm((prev) => ({ ...prev, address: addressStr }))
      })
      .catch(() => {})
  }, [mapPosition, lang])

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
        brandId: ad.brandId || '',
        itemCondition: ad.itemCondition || 'USED',
        canRent: !!ad.canRent,
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
        contactByTelegram: !!ad.telegramUsername,
        telegramUsername: ad.telegramUsername || '',
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
    const files = Array.from(e.target.files || []).filter((f) => f.type?.startsWith('image/'))
    if (!files.length) return
    const maxNew = Math.min(files.length, 6 - uploadedUrls.length)
    if (maxNew <= 0) return
    const toUpload = files.slice(0, maxNew)
    setUploading(true)
    setError('')
    try {
      let newUrls = []
      if (toUpload.length === 1) {
        const data = await adsApi.upload(toUpload[0])
        if (data?.url) newUrls = [data.url]
      } else {
        const data = await adsApi.uploadBatch(toUpload)
        newUrls = Array.isArray(data?.urls) ? data.urls : []
      }
      setUploadedUrls((prev) => [...prev, ...newUrls].slice(0, 6))
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
        brandId: form.brandId?.trim() || undefined,
        itemCondition: form.itemCondition || 'USED',
        canRent: !!form.canRent,
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
        telegramUsername: (form.telegramUsername || '').trim().replace(/^@/, '') || undefined,
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
          'User-Agent': 'QoldanQolga/1.0 (contact@example.com)',
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

        {brands.length > 0 && (
          <section className={`app-card ${styles.card}`}>
            <label className="form-label fw-semibold">{lang === 'ru' ? 'Бренд' : 'Brend'}</label>
            <div className={styles.brandSelectWrap} ref={brandDropdownRef}>
              <button
                type="button"
                className={`form-select text-start d-flex align-items-center justify-content-between ${styles.brandSelectTrigger}`}
                onClick={() => setBrandDropdownOpen((o) => !o)}
                aria-expanded={brandDropdownOpen}
                aria-haspopup="listbox"
              >
                <span className={!form.brandId ? 'text-muted' : ''}>
                  {form.brandId
                    ? (lang === 'ru' ? brands.find((b) => b.id === form.brandId)?.nameRu : brands.find((b) => b.id === form.brandId)?.nameUz)
                    : (lang === 'ru' ? 'Не выбран' : 'Tanlanmagan')}
                </span>
                <i className={`bi ${brandDropdownOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`} aria-hidden />
              </button>
              {brandDropdownOpen && (
                <ul
                  className={styles.brandDropdown}
                  role="listbox"
                  aria-label={lang === 'ru' ? 'Выбор бренда' : 'Brend tanlash'}
                >
                  <li role="option" aria-selected={!form.brandId}>
                    <button
                      type="button"
                      className={`${styles.brandOption} ${!form.brandId ? styles.brandOptionSelected : ''}`}
                      onClick={() => {
                        setForm((p) => ({ ...p, brandId: '' }))
                        setBrandDropdownOpen(false)
                      }}
                    >
                      <span className={styles.brandCheck}>{!form.brandId ? <i className="bi bi-check-lg" aria-hidden /> : null}</span>
                      {lang === 'ru' ? 'Не выбран' : 'Tanlanmagan'}
                    </button>
                  </li>
                  {brands.map((b) => {
                    const isSelected = form.brandId === b.id
                    const name = lang === 'ru' ? b.nameRu : b.nameUz
                    return (
                      <li key={b.id} role="option" aria-selected={isSelected}>
                        <button
                          type="button"
                          className={`${styles.brandOption} ${isSelected ? styles.brandOptionSelected : ''}`}
                          onClick={() => {
                            setForm((p) => ({ ...p, brandId: b.id }))
                            setBrandDropdownOpen(false)
                          }}
                        >
                          <span className={styles.brandCheck}>{isSelected ? <i className="bi bi-check-lg" aria-hidden /> : null}</span>
                          {name}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </section>
        )}

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

          <div className="mb-0" style={{ marginTop: '1rem' }}>
            <p className="small fw-semibold text-secondary mb-2">{t('ads.conditionLabel')}</p>
            <div className="d-flex flex-wrap gap-3">
              <div className="form-check">
                <input type="radio" name="itemCondition" id="itemCondition-used" checked={form.itemCondition === 'USED'} onChange={() => setForm((p) => ({ ...p, itemCondition: 'USED' }))} className="form-check-input" />
                <label className="form-check-label" htmlFor="itemCondition-used">{t('ads.conditionUsed')}</label>
              </div>
              <div className="form-check">
                <input type="radio" name="itemCondition" id="itemCondition-usedLikeNew" checked={form.itemCondition === 'USED_LIKE_NEW'} onChange={() => setForm((p) => ({ ...p, itemCondition: 'USED_LIKE_NEW' }))} className="form-check-input" />
                <label className="form-check-label" htmlFor="itemCondition-usedLikeNew">{t('ads.conditionUsedLikeNew')}</label>
              </div>
              <div className="form-check">
                <input type="radio" name="itemCondition" id="itemCondition-usedGood" checked={form.itemCondition === 'USED_GOOD'} onChange={() => setForm((p) => ({ ...p, itemCondition: 'USED_GOOD' }))} className="form-check-input" />
                <label className="form-check-label" htmlFor="itemCondition-usedGood">{t('ads.conditionUsedGood')}</label>
              </div>
              <div className="form-check">
                <input type="radio" name="itemCondition" id="itemCondition-usedFair" checked={form.itemCondition === 'USED_FAIR'} onChange={() => setForm((p) => ({ ...p, itemCondition: 'USED_FAIR' }))} className="form-check-input" />
                <label className="form-check-label" htmlFor="itemCondition-usedFair">{t('ads.conditionUsedFair')}</label>
              </div>
              <div className="form-check">
                <input type="radio" name="itemCondition" id="itemCondition-new" checked={form.itemCondition === 'NEW'} onChange={() => setForm((p) => ({ ...p, itemCondition: 'NEW' }))} className="form-check-input" />
                <label className="form-check-label" htmlFor="itemCondition-new">{t('ads.conditionNew')}</label>
              </div>
              <div className="form-check">
                <input type="radio" name="itemCondition" id="itemCondition-handmade" checked={form.itemCondition === 'HANDMADE'} onChange={() => setForm((p) => ({ ...p, itemCondition: 'HANDMADE' }))} className="form-check-input" />
                <label className="form-check-label" htmlFor="itemCondition-handmade">{t('ads.conditionHandmade')}</label>
              </div>
            </div>
          </div>
          <div className="mb-0 mt-2">
            <div className="form-check">
              <input type="checkbox" id="canRent" className="form-check-input" checked={!!form.canRent} onChange={(e) => setForm((p) => ({ ...p, canRent: e.target.checked }))} />
              <label className="form-check-label" htmlFor="canRent">{t('ads.canRentLabel')}</label>
            </div>
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
                <span className={`${styles.contactMethodIcon} ${styles.telegram}`} aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
                </span>
                <div>
                  <span className={styles.contactMethodLabel}>{lang === 'ru' ? 'Чат в телеграм' : 'Telegram orqali chat'}</span>
                  {form.contactByTelegram && (
                    <input
                      type="text"
                      placeholder={lang === 'ru' ? 'Ник в Telegram (например username)' : 'Telegram nik (masalan username)'}
                      value={form.telegramUsername}
                      onChange={(e) => setForm((p) => ({ ...p, telegramUsername: e.target.value }))}
                      className="form-control form-control-sm mt-1"
                      style={{ maxWidth: '220px' }}
                    />
                  )}
                  {!form.contactByTelegram && form.phone && (
                    <p className={styles.contactMethodSub}>+{form.phone.replace(/\D/g, '').slice(-9)}</p>
                  )}
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={form.contactByTelegram}
                className={`${styles.toggle} ${form.contactByTelegram ? styles.on : ''}`}
                onClick={() => setForm((p) => ({ ...p, contactByTelegram: !p.contactByTelegram, ...(p.contactByTelegram ? { telegramUsername: '' } : {}) }))}
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
            setForm((prev) => ({ ...prev, category: cat.code, brandId: '' }))
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
