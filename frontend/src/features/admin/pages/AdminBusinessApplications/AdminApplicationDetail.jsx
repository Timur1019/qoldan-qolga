import { UiButton, UiModal } from '@/shared/ui'
import styles from './AdminBusinessApplications.module.css'

const STATUS_LABELS = {
  PENDING: 'На рассмотрении',
  APPROVED: 'Одобрена',
  REJECTED: 'Отклонена',
}

export default function AdminApplicationDetail({
  detail,
  actionId,
  docUrl,
  formatDate,
  onClose,
  onApprove,
  onReject,
}) {
  if (!detail) return null

  return (
    <UiModal
      open
      wide
      onClose={onClose}
      title={`Заявка: ${detail.shopName}`}
      footer={
        detail.status === 'PENDING' ? (
          <>
            <UiButton variant="outline" onClick={() => onApprove(detail.id)} disabled={actionId !== null}>
              {actionId === detail.id ? '…' : 'Подтвердить'}
            </UiButton>
            <UiButton variant="danger" onClick={() => onReject(detail.id)} disabled={actionId !== null}>
              {actionId === detail.id ? '…' : 'Отклонить'}
            </UiButton>
          </>
        ) : null
      }
    >
      <div className={styles.detailGrid}>
        <p><strong>ФИО:</strong> {detail.fullName}</p>
        <p><strong>Магазин:</strong> {detail.shopName}</p>
        <p><strong>Тип:</strong> {detail.businessType}</p>
        <p><strong>Город:</strong> {detail.city}</p>
        <p><strong>Категория товаров:</strong> {detail.productCategory}</p>
        <p><strong>Телефон:</strong> {detail.phone}</p>
        {detail.shopUrl ? (
          <p>
            <strong>Сайт/соцсеть:</strong>{' '}
            <a href={detail.shopUrl} target="_blank" rel="noopener noreferrer">{detail.shopUrl}</a>
          </p>
        ) : null}
        <p><strong>Статус:</strong> {STATUS_LABELS[detail.status] ?? detail.status}</p>
        <p><strong>Дата:</strong> {formatDate(detail.createdAt)}</p>
      </div>
      <div className={styles.docLinks}>
        <p><strong>Документы:</strong></p>
        {detail.passportUrl ? (
          <a href={docUrl(detail.passportUrl)} target="_blank" rel="noopener noreferrer" className={styles.docLink}>
            Паспорт
          </a>
        ) : null}
        {detail.registrationCertificateUrl ? (
          <a href={docUrl(detail.registrationCertificateUrl)} target="_blank" rel="noopener noreferrer" className={styles.docLink}>
            Свидетельство о регистрации
          </a>
        ) : null}
      </div>
    </UiModal>
  )
}
