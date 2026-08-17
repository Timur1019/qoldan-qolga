import { UiModal, UiChoiceList, UiButton } from '@/shared/ui'
import { REPORT_REASONS } from '../../utils/constants'

export default function AdReportModal({
  open,
  reason,
  submitting,
  onReasonChange,
  onClose,
  onSubmit,
  t,
}) {
  if (!open) return null

  return (
    <UiModal
      open={open}
      onClose={onClose}
      title={t('ads.reportModalTitle')}
      titleId="report-modal-title"
      footer={(
        <UiButton
          variant="primary"
          fullWidth
          onClick={onSubmit}
          disabled={!reason || submitting}
          loading={submitting}
        >
          {submitting ? t('common.loading') : t('ads.reportNext')}
        </UiButton>
      )}
    >
      <UiChoiceList
        name="reportReason"
        type="radio"
        value={reason}
        onChange={onReasonChange}
        options={REPORT_REASONS.map((r) => ({
          value: r.value,
          label: t(r.labelKey),
        }))}
      />
    </UiModal>
  )
}
