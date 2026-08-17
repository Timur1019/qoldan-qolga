import BusinessSectionCard from './BusinessSectionCard'
import FileDropZone from './FileDropZone'
import styles from './BusinessDocumentsSection.module.css'

export default function BusinessDocumentsSection() {
  return (
    <BusinessSectionCard
      title="Документы"
      icon={<i className="bi bi-file-earmark-text" />}
    >
      <div className={styles.grid}>
        <FileDropZone
          name="passport"
          label="Скан паспорта"
          required
          icon={<i className="bi bi-person-vcard" />}
        />
        <FileDropZone
          name="registration"
          label="Свидетельство о регистрации"
          required
          icon={<i className="bi bi-award" />}
        />
      </div>
    </BusinessSectionCard>
  )
}
