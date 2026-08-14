import styles from './AdsFilterBar.module.css'

export default function AdsFiltersDrawerBrand({ brands = [], draft, setDraft, transport, lang, t }) {
  if (!brands.length) return null

  return (
    <div className={styles.drawerBlock}>
      <p className={styles.drawerBlockTitle}>
        {transport ? t('ads.brandLabel') : (lang === 'ru' ? 'Производитель' : 'Ishlab chiqaruvchi')}
      </p>
      <select
        className="form-select"
        value={draft.brandId || ''}
        onChange={(e) => setDraft((d) => ({ ...d, brandId: e.target.value, modelId: '' }))}
      >
        <option value="">{t('ads.any')}</option>
        {brands.map((b) => (
          <option key={b.id} value={b.id}>{lang === 'ru' ? b.nameRu : b.nameUz}</option>
        ))}
      </select>
    </div>
  )
}
