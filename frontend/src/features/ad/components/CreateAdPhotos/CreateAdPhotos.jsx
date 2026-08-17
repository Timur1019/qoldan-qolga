import { useRef } from 'react'
import { imageUrl } from '@/api/client'
import shared from '../../styles/createAdShared.module.css'
import styles from './CreateAdPhotos.module.css'

export default function CreateAdPhotos({
  uploadedUrls,
  uploading,
  dragOver,
  onFileSelect,
  onDrop,
  onDragOver,
  onDragLeave,
  onRemove,
  t,
}) {
  const fileInputRef = useRef(null)

  return (
    <section className={`app-card ${shared.card}`}>
      <h2 className="h6 mb-1">{t('ads.photosSection')}</h2>
      <p className="text-muted small mb-2">{t('ads.photosHint')}</p>
      <div
        className={`${styles.uploadZone} ${dragOver ? styles.dragover : ''}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onFileSelect}
          className="d-none"
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || uploadedUrls.length >= 6}
        >
          <i className="bi bi-images me-2" aria-hidden /> {t('ads.selectFiles')}
        </button>
        <p className="text-muted small mt-2 mb-0">{t('ads.orDragHere')}</p>
        <p className="text-muted small mb-0">{t('ads.photoSpecs')}</p>
      </div>
      {uploading && <span className="small text-muted">{t('common.loading')}</span>}
      {uploadedUrls.length > 0 && (
        <div className={styles.previews}>
          {uploadedUrls.map((url, index) => (
            <div key={index} className={styles.previewWrap}>
              <img src={imageUrl(url)} alt="" className={styles.preview} />
              <button
                type="button"
                onClick={() => onRemove(index)}
                className={`btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle p-0 ${styles.removeBtn}`}
                aria-label={t('chat.delete')}
              >
                <i className="bi bi-x" aria-hidden />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
