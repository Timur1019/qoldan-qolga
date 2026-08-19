import styles from './AdminStatsChart.module.css'

function formatDay(iso) {
  if (!iso) return ''
  const [, month, day] = iso.split('-')
  return `${day}.${month}`
}

export default function AdminStatsChart({ series, t }) {
  const rows = Array.isArray(series) ? series : []
  const max = Math.max(1, ...rows.flatMap((d) => [d.registrations || 0, d.active || 0]))

  return (
    <section className={styles.wrap}>
      <div className={styles.head}>
        <h2 className={styles.title}>{t('adminPanel.chartTitle')}</h2>
        <div className={styles.legend}>
          <span className={styles.reg}><i />{t('adminPanel.chartRegs')}</span>
          <span className={styles.act}><i />{t('adminPanel.chartActive')}</span>
        </div>
      </div>
      <div className={styles.chart}>
        {rows.map((day) => (
          <div key={day.date} className={styles.col}>
            <div className={styles.bars}>
              <span
                className={styles.barReg}
                style={{ '--bar-h': `${Math.round(((day.registrations || 0) / max) * 100)}%` }}
                title={`${t('adminPanel.chartRegs')}: ${day.registrations || 0}`}
              />
              <span
                className={styles.barAct}
                style={{ '--bar-h': `${Math.round(((day.active || 0) / max) * 100)}%` }}
                title={`${t('adminPanel.chartActive')}: ${day.active || 0}`}
              />
            </div>
            <span className={styles.day}>{formatDay(day.date)}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
