import styles from './AdsFiltersSidebar.module.css'

function ToggleRow({ label, checked, onToggle }) {
  return (
    <div className={styles.filterToggleRow}>
      <span>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`${styles.filterToggle} ${checked ? styles.filterToggleOn : ''}`}
        onClick={onToggle}
      >
        <span className={styles.filterToggleKnob} />
      </button>
    </div>
  )
}

export default function FilterExtraToggles({
  filterFlags,
  filterDraft,
  setFilterDraft,
  t,
}) {
  const showUrgent = filterFlags.urgentBargain !== false
  const showDeliver = filterFlags.canDeliver !== false
  const showGiveAway = filterFlags.giveAway !== false
  if (!showUrgent && !showDeliver && !showGiveAway) return null

  return (
    <div className={styles.sidebarBlock}>
      <p className={styles.sidebarBlockTitle}>{t('ads.additionally')}</p>
      <div className={styles.filterToggles}>
        {showUrgent && (
          <ToggleRow
            label={t('ads.urgentBargain')}
            checked={filterDraft.urgentBargain}
            onToggle={() => setFilterDraft((d) => ({ ...d, urgentBargain: !d.urgentBargain }))}
          />
        )}
        {showDeliver && (
          <ToggleRow
            label={t('ads.courierDelivery')}
            checked={filterDraft.canDeliver}
            onToggle={() => setFilterDraft((d) => ({ ...d, canDeliver: !d.canDeliver }))}
          />
        )}
        {showGiveAway && (
          <ToggleRow
            label={t('ads.giveAway')}
            checked={filterDraft.giveAway}
            onToggle={() => setFilterDraft((d) => ({ ...d, giveAway: !d.giveAway }))}
          />
        )}
      </div>
    </div>
  )
}
