import { useState, useMemo, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLang } from '@/context/LangContext'
import { useToast } from '@/context/ToastContext'
import { formatApiError } from '@/utils/apiError'
import { adsApi } from '@/api/ads'
import { UiAlert, UiButton, UiField, UiInput, UiSelectTrigger } from '@/shared/ui'
import CategorySelectModal from '@/components/CategorySelectModal/CategorySelectModal'
import CategoryIcon from '@/components/ui/CategoryIcon'
import CreateAdPhotos from '../../components/CreateAdPhotos'
import CreateAdBrandField from '../../components/CreateAdBrandField'
import CreateAdTransportFields from '../../components/CreateAdTransportFields'
import CreateAdRealEstateFields from '../../components/CreateAdRealEstateFields'
import CreateAdJobFields from '../../components/CreateAdJobFields'
import CreateAdDealPrice from '../../components/CreateAdDealPrice'
import CreateAdSellerTypeFields from '../../components/CreateAdSellerTypeFields'
import CreateAdFlags from '../../components/CreateAdFlags'
import CreateAdDescription from '../../components/CreateAdDescription'
import CreateAdContacts from '../../components/CreateAdContacts'
import CreateAdLocation from '../../components/CreateAdLocation'
import { isClothingTree } from '@/constants/routes'
import { EMPTY_TRANSPORT_FIELDS, transportFieldFlags } from '@/constants/transport'
import { EMPTY_REAL_ESTATE_FIELDS, realEstateFieldFlags } from '@/constants/realEstate'
import { categoryFilterFlags } from '@/constants/categoryFilters'
import { jobFieldFlags } from '@/constants/jobCategories'
import {
  createEmptyAdForm,
  formFromAdDetail,
  imageUrlsFromAd,
  buildCreateAdPayload,
} from '../../utils/createAdForm'
import useCreateAdUploads from '../../hooks/useCreateAdUploads'
import useCreateAdMap from '../../hooks/useCreateAdMap'
import useCreateAdReferences from '../../hooks/useCreateAdReferences'
import shared from '../../styles/createAdShared.module.css'
import styles from './CreateAd.module.css'

export default function CreateAd({ edit: editMode }) {
  const navigate = useNavigate()
  const { id: editId } = useParams()
  const { t, lang } = useLang()
  const { showToast, showApiError } = useToast()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [form, setForm] = useState(createEmptyAdForm)

  const patchForm = useCallback((patch) => {
    setForm((prev) => ({ ...prev, ...patch }))
  }, [])

  const {
    uploading,
    uploadedUrls,
    setUploadedUrls,
    dragOver,
    handleFileSelect,
    onDrop,
    onDragOver,
    onDragLeave,
    removeImage,
  } = useCreateAdUploads({ t, setError })

  const {
    regions,
    categories,
    allCategories,
    setAllCategories,
    brands,
    categoryBreadcrumb,
  } = useCreateAdReferences(form.category)

  const { mapPosition, setMapPosition, setMyLocation } = useCreateAdMap({
    lang,
    setForm,
    regions,
    skipAuto: Boolean(editMode),
  })

  useEffect(() => {
    if (!editMode || !editId) return
    adsApi.getById(editId).then((ad) => {
      setUploadedUrls(imageUrlsFromAd(ad))
      setForm(formFromAdDetail(ad))
    }).catch(() => {})
  }, [editMode, editId, setUploadedUrls])

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

  const isClothingCategory = isClothingTree(form.category, categoryBreadcrumb)
  const transportFlags = transportFieldFlags(form.category, categoryBreadcrumb)
  const realEstateFlags = realEstateFieldFlags(form.category, categoryBreadcrumb)
  const filterFlags = categoryFilterFlags(form.category, categoryBreadcrumb)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'region' ? { district: '' } : {}),
      ...(name === 'giveAway' && checked ? { price: '0' } : {}),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const jobFlags = jobFieldFlags(form.category, categoryBreadcrumb)
    if (jobFlags.jobs && !form.jobProfession) {
      setError(lang === 'ru' ? 'Выберите профессию' : 'Kasbni tanlang')
      setSubmitting(false)
      return
    }
    setSubmitting(true)
    try {
      const payload = buildCreateAdPayload(form, uploadedUrls, {
        lang,
        filterFlags,
        realEstateFlags,
      })
      const res = editMode && editId
        ? await adsApi.update(editId, payload)
        : await adsApi.create(payload)
      showToast(editMode ? t('notify.adSaved') : t('notify.adCreated'), 'success')
      navigate(`/ads/${res.id}`)
    } catch (err) {
      setError(formatApiError(err, t))
      showApiError(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-container app-page">
      <h1 className={`h2 mb-4 ${styles.pageTitle}`}>
        {editMode && editId
          ? (lang === 'ru' ? 'Редактировать объявление' : 'E\'lonni tahrirlash')
          : t('ads.createTitle')}
      </h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error ? <UiAlert>{error}</UiAlert> : null}

        <CreateAdPhotos
          uploadedUrls={uploadedUrls}
          uploading={uploading}
          dragOver={dragOver}
          onFileSelect={handleFileSelect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onRemove={removeImage}
          t={t}
        />

        <section className={`app-card ${shared.card}`}>
          <UiField
            label={lang === 'ru' ? 'Название' : 'Sarlavha'}
            hint={t('ads.titleHint')}
            htmlFor="create-ad-title"
          >
            <UiInput
              id="create-ad-title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              maxLength={50}
              placeholder={t('ads.titlePlaceholder')}
            />
          </UiField>
        </section>

        <section className={`app-card ${shared.card}`}>
          <UiField label={`${t('ads.formCategory')} *`}>
            <UiSelectTrigger
              placeholder={!selectedCategoryObj}
              onClick={() => setCategoryModalOpen(true)}
            >
              <span className={`d-inline-flex align-items-center gap-2 ${!selectedCategoryObj ? 'text-muted' : ''}`}>
                {selectedCategoryObj ? (
                  <CategoryIcon code={selectedCategoryObj.code} parentCode={selectedCategoryObj.parentCode} />
                ) : null}
                {selectedCategoryObj
                  ? (lang === 'ru' ? selectedCategoryObj.nameRu : selectedCategoryObj.nameUz)
                  : t('ads.selectCategory')}
              </span>
              <i className="bi bi-chevron-down" aria-hidden />
            </UiSelectTrigger>
          </UiField>
        </section>

        <CreateAdBrandField
          brands={brands}
          brandId={form.brandId}
          onSelect={(brandId) => patchForm({ brandId })}
          visible={!transportFlags.transport && !realEstateFlags.realEstate && !filterFlags.jobs}
          t={t}
          lang={lang}
        />

        <CreateAdTransportFields
          categoryCode={form.category}
          categoryBreadcrumb={categoryBreadcrumb}
          form={form}
          brands={brands}
          onChange={patchForm}
          t={t}
          lang={lang}
        />

        <CreateAdRealEstateFields
          categoryCode={form.category}
          categoryBreadcrumb={categoryBreadcrumb}
          form={form}
          onChange={patchForm}
          t={t}
        />

        <CreateAdJobFields
          categoryCode={form.category}
          categoryBreadcrumb={categoryBreadcrumb}
          form={form}
          onChange={patchForm}
          lang={lang}
        />

        <CreateAdDealPrice
          form={form}
          filterFlags={filterFlags}
          onChange={handleChange}
          onPatch={patchForm}
          t={t}
        />

        <CreateAdSellerTypeFields
          sellerType={form.sellerType}
          categoryCode={form.category}
          breadcrumb={categoryBreadcrumb}
          onPatch={patchForm}
          t={t}
        />

        <CreateAdFlags
          form={form}
          filterFlags={filterFlags}
          isClothingCategory={isClothingCategory}
          onPatch={patchForm}
          t={t}
          lang={lang}
        />

        <CreateAdDescription
          value={form.description}
          onChange={handleChange}
          t={t}
        />

        <CreateAdLocation
          form={form}
          filterFlags={filterFlags}
          mapPosition={mapPosition}
          onMapPositionChange={setMapPosition}
          onMyLocation={setMyLocation}
          regions={regions}
          districtOptions={districtOptions}
          onChange={handleChange}
          t={t}
          lang={lang}
        />

        <CreateAdContacts
          form={form}
          onChange={handleChange}
          onPatch={patchForm}
          t={t}
          lang={lang}
        />

        <div className={styles.actions}>
          <UiButton type="submit" size="lg" fullWidth loading={submitting}>
            {submitting ? t('common.loading') : t('common.save')}
          </UiButton>
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
            setForm((prev) => ({
              ...prev,
              category: cat.code,
              sellerType: 'PRIVATE',
              onlineShowing: false,
              ...EMPTY_TRANSPORT_FIELDS,
              ...EMPTY_REAL_ESTATE_FIELDS,
              itemCondition: 'USED',
            }))
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
