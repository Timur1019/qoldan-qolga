import { UiAlert, UiButton, UiField, UiInput, UiSelect, UiToggle } from '@/shared/ui'
import styles from './AdminDashboard.module.css'

export default function AdminCategoryForm({
  form,
  setForm,
  rootCategories,
  getChildren,
  error,
  success,
  onSubmit,
}) {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.formRow}>
        <UiField className={styles.rowField} label="Название (UZ)" htmlFor="cat-uz">
          <UiInput
            id="cat-uz"
            value={form.nameUz}
            onChange={(e) => setForm((f) => ({ ...f, nameUz: e.target.value }))}
            maxLength={100}
            placeholder="Kategoriya nomi"
          />
        </UiField>
        <UiField className={styles.rowField} label="Название (RU)" htmlFor="cat-ru">
          <UiInput
            id="cat-ru"
            value={form.nameRu}
            onChange={(e) => setForm((f) => ({ ...f, nameRu: e.target.value }))}
            maxLength={100}
            placeholder="Название категории"
          />
        </UiField>
      </div>
      <div className={styles.formRow}>
        <UiField className={styles.rowField} label="Код (латиница, уникальный)" htmlFor="cat-code">
          <UiInput
            id="cat-code"
            value={form.code}
            onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
            maxLength={50}
            placeholder="category-code"
          />
        </UiField>
        <UiField className={styles.rowField} label="Родительская категория (для подкатегории)" htmlFor="cat-parent">
          <UiSelect
            id="cat-parent"
            value={form.parentId}
            onChange={(e) => setForm((f) => ({ ...f, parentId: e.target.value }))}
            placeholder="— корневая —"
          >
            <option value="">— корневая —</option>
            {rootCategories.flatMap((root) => [
              <option key={root.id} value={root.id}>
                {root.nameRu} ({root.code})
              </option>,
              ...getChildren(root.id).map((sub) => (
                <option key={sub.id} value={sub.id}>
                  — {sub.nameRu} ({sub.code})
                </option>
              )),
            ])}
          </UiSelect>
        </UiField>
      </div>
      <div className={styles.formRow}>
        <UiField className={styles.rowField} label="Порядок сортировки" htmlFor="cat-sort">
          <UiInput
            id="cat-sort"
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value === '' ? 0 : Number(e.target.value) }))}
          />
        </UiField>
        <div className={styles.checkWrap}>
          <UiToggle
            checked={form.showOnHome}
            onChange={(showOnHome) => setForm((f) => ({ ...f, showOnHome }))}
          />
          <span>Показывать на главной</span>
        </div>
      </div>
      {error ? <UiAlert>{error}</UiAlert> : null}
      {success ? <UiAlert variant="success">{success}</UiAlert> : null}
      <UiButton type="submit">Добавить категорию</UiButton>
    </form>
  )
}
