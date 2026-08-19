import { useLang } from '@/context/LangContext'
import { UiAlert, UiPagination } from '@/shared/ui'
import { STAT_CARDS } from './statCards'
import AdminStatsCards from './AdminStatsCards'
import AdminStatsChart from './AdminStatsChart'
import AdminStatsUsersTable from './AdminStatsUsersTable'
import AdminStatsAdsTable from './AdminStatsAdsTable'
import useAdminStats from './useAdminStats'
import styles from './AdminStats.module.css'

export default function AdminStats() {
  const { t, lang } = useLang()
  const stats = useAdminStats()
  const selectedCard = STAT_CARDS.find((c) => c.key === stats.filter)
  const pager = (
    <UiPagination
      page={stats.page}
      size={stats.size}
      totalElements={stats.table?.totalElements}
      totalPages={stats.table?.totalPages}
      onPageChange={stats.setPage}
      onSizeChange={stats.setSize}
    />
  )

  if (stats.summaryLoading) {
    return <p className={styles.muted}>{t('adminPanel.loading')}</p>
  }

  if (stats.summaryError) {
    return <UiAlert>{stats.summaryError}</UiAlert>
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h2 className={styles.title}>{t('adminPanel.reportsTitle')}</h2>
        <p className={styles.hint}>{t('adminPanel.reportsHint')}</p>
      </section>
      <AdminStatsCards
        stats={stats.summary}
        selected={stats.filter}
        onSelect={stats.setFilter}
        t={t}
      />
      <AdminStatsChart series={stats.summary?.series} t={t} />
      <section className={styles.detail}>
        <h3 className={styles.detailTitle}>
          {t('adminPanel.detailTitle')}: {selectedCard ? t(selectedCard.labelKey) : ''}
        </h3>
        {stats.tableError ? <UiAlert>{stats.tableError}</UiAlert> : null}
        {stats.tableLoading ? (
          <p className={styles.muted}>{t('adminPanel.loading')}</p>
        ) : stats.isAds ? (
          <AdminStatsAdsTable rows={stats.table?.content} lang={lang} t={t} footer={pager} />
        ) : (
          <AdminStatsUsersTable rows={stats.table?.content} lang={lang} t={t} footer={pager} />
        )}
      </section>
    </div>
  )
}
