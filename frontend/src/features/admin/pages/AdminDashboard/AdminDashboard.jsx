import { useLang } from '@/context/LangContext'
import AdminCategoryForm from './AdminCategoryForm'
import AdminCategoryTree from './AdminCategoryTree'
import useAdminCategories from './useAdminCategories'
import styles from './AdminDashboard.module.css'

export default function AdminDashboard() {
  const { t, lang } = useLang()
  const categories = useAdminCategories(t)

  return (
    <div className={styles.page}>
      <h2 className={styles.sectionTitle}>{t('adminPanel.categories')}</h2>
        <div className={styles.formCard}>
          <AdminCategoryForm
            form={categories.form}
            setForm={categories.setForm}
            rootCategories={categories.rootCategories}
            getChildren={categories.getChildren}
            error={categories.error}
            success={categories.success}
            onSubmit={categories.submit}
            t={t}
          />
        </div>
        {categories.loading ? (
          <p className={styles.muted}>{t('adminPanel.loading')}</p>
        ) : (
          <AdminCategoryTree
            rootCategories={categories.rootCategories}
            getChildren={categories.getChildren}
            expandedIds={categories.expandedIds}
            onToggle={categories.toggleExpand}
            onAddSub={categories.addSubcategory}
            lang={lang}
            t={t}
          />
        )}
    </div>
  )
}
