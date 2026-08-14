import { brandDisplayName, formatBrandCount } from '../../../../../constants/transport'

export default function BrandFilterPanel({ brands, value, onChange, lang, t }) {
  return (
    <select className="form-select" value={value || ''} onChange={(e) => onChange(e.target.value)}>
      <option value="">{t('ads.any')}</option>
      {brands.map((b) => {
        const count = formatBrandCount(b.adCount)
        const name = brandDisplayName(b, lang)
        return (
          <option key={b.id} value={b.id}>
            {count !== '' ? `${name} (${count})` : name}
          </option>
        )
      })}
    </select>
  )
}
