export default function ModelFilterPanel({ models, value, onChange, lang, t, disabled }) {
  return (
    <select className="form-select" value={value || ''} disabled={disabled} onChange={(e) => onChange(e.target.value)}>
      <option value="">{t('ads.any')}</option>
      {models.map((m) => (
        <option key={m.id} value={m.id}>{lang === 'ru' ? m.nameRu : m.nameUz}</option>
      ))}
    </select>
  )
}
