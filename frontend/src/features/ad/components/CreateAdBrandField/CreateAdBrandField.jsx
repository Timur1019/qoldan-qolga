import { useEffect, useRef, useState } from 'react'
import { UiField, UiSelectTrigger } from '@/shared/ui'
import shared from '../../styles/createAdShared.module.css'
import styles from './CreateAdBrandField.module.css'

export default function CreateAdBrandField({
  brands,
  brandId,
  onSelect,
  visible,
  t,
  lang,
}) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const fn = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', fn)
    return () => document.removeEventListener('click', fn)
  }, [open])

  if (!visible || !brands.length) return null

  const selectedName = brandId
    ? (lang === 'ru'
      ? brands.find((b) => b.id === brandId)?.nameRu
      : brands.find((b) => b.id === brandId)?.nameUz)
    : null

  const select = (id) => {
    onSelect(id)
    setOpen(false)
  }

  return (
    <section className={`app-card ${shared.card}`}>
      <UiField label={lang === 'ru' ? 'Бренд' : 'Brend'}>
        <div className={styles.brandSelectWrap} ref={wrapRef}>
          <UiSelectTrigger
            className={styles.brandSelectTrigger}
            placeholder={!brandId}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-haspopup="listbox"
          >
            <span>
              {selectedName || (lang === 'ru' ? 'Не выбран' : 'Tanlanmagan')}
            </span>
            <i className={`bi ${open ? 'bi-chevron-up' : 'bi-chevron-down'}`} aria-hidden />
          </UiSelectTrigger>
          {open && (
            <ul
              className={styles.brandDropdown}
              role="listbox"
              aria-label={lang === 'ru' ? 'Выбор бренда' : 'Brend tanlash'}
            >
              <li role="option" aria-selected={!brandId}>
                <button
                  type="button"
                  className={`${styles.brandOption} ${!brandId ? styles.brandOptionSelected : ''}`}
                  onClick={() => select('')}
                >
                  <span className={styles.brandCheck}>{!brandId ? <i className="bi bi-check-lg" aria-hidden /> : null}</span>
                  {lang === 'ru' ? 'Не выбран' : 'Tanlanmagan'}
                </button>
              </li>
              {brands.map((b) => {
                const isSelected = brandId === b.id
                const name = lang === 'ru' ? b.nameRu : b.nameUz
                return (
                  <li key={b.id} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      className={`${styles.brandOption} ${isSelected ? styles.brandOptionSelected : ''}`}
                      onClick={() => select(b.id)}
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
      </UiField>
    </section>
  )
}
