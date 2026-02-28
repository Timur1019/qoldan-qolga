/**
 * EditProfile — страница редактирования профиля.
 * Поля: аватар (эмодзи или до 10 фото, одно выбрано как главное), имя, email.
 */
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LangContext'
import { authApi, adsApi, imageUrl } from '../../api/client'
import { usePhotoUpload } from '../../hooks'
import styles from './EditProfile.module.css'

const DEFAULT_AVATAR = 'star'
const MAX_PHOTOS = 10
const SCROLL_SENSITIVITY = 2

const AVATAR_OPTIONS = [
  { key: 'star', emoji: '⭐' },
  { key: 'cactus', emoji: '🌵' },
  { key: 'donut', emoji: '🍩' },
  { key: 'duck', emoji: '🦆' },
  { key: 'cat', emoji: '🐱' },
  { key: 'alien', emoji: '👽' },
]

function isPhotoUrl(s) {
  return s && typeof s === 'string' && (s.startsWith('/') || s.startsWith('http'))
}

/** Инициализирует форму из данных пользователя. Вызывается только при загрузке или смене user.id. */
function initFormFromUser(data, setters) {
  if (!data) return
  const { setDisplayName, setEmail, setAvatarPhotos, setMainAvatar } = setters
  setDisplayName(data.displayName ?? '')
  setEmail(data.email ?? '')
  let photos = []
  try {
    photos = (data.avatarPhotos && Array.isArray(data.avatarPhotos) ? data.avatarPhotos : [])
      .filter(isPhotoUrl)
  } catch {
    photos = []
  }
  if (data.avatar && isPhotoUrl(data.avatar)) {
    if (photos.length === 0) photos = [data.avatar]
    if (!photos.includes(data.avatar)) photos.unshift(data.avatar)
    setAvatarPhotos(photos)
    setMainAvatar(data.avatar)
  } else if (data.avatar && AVATAR_OPTIONS.some((a) => a.key === data.avatar)) {
    setMainAvatar(data.avatar)
    setAvatarPhotos(photos)
  } else {
    setMainAvatar(photos.length > 0 ? photos[0] : DEFAULT_AVATAR)
    setAvatarPhotos(photos)
  }
}

export default function EditProfile() {
  const { user, refreshUser } = useAuth()
  const { t } = useLang()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [avatarPhotos, setAvatarPhotos] = useState([])
  const [mainAvatar, setMainAvatar] = useState(DEFAULT_AVATAR)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const setters = useMemo(
    () => ({
      setDisplayName,
      setEmail,
      setAvatarPhotos,
      setMainAvatar,
    }),
    []
  )

  // Инициализация формы только при первой загрузке или смене пользователя (user.id)
  useEffect(() => {
    if (user) initFormFromUser(user, setters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const handleUploadError = useCallback(
    (msg) => setError(msg ? (msg.startsWith('profile.') || msg.startsWith('common.') ? t(msg) : msg) : t('common.error')),
    [t]
  )
  const handleUploadSuccess = useCallback((url) => {
    setAvatarPhotos((prev) => (prev.includes(url) ? prev : [...prev, url]))
    setMainAvatar(url)
  }, [])

  const photoUpload = usePhotoUpload({
    maxCount: MAX_PHOTOS,
    currentCount: avatarPhotos.length,
    upload: (file) => adsApi.upload(file),
    onSuccess: handleUploadSuccess,
    onError: handleUploadError,
  })

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      const name = displayName.trim()
      const emailVal = email.trim().toLowerCase()
      if (!name) {
        setError(t('profile.editNameRequired'))
        return
      }
      if (!emailVal) {
        setError(t('profile.editEmailRequired'))
        return
      }
      setSaving(true)
      setError('')
      setSuccess(false)
      try {
        const photoUrls = avatarPhotos.filter(isPhotoUrl)
        const updated = await authApi.updateProfile({
          displayName: name,
          email: emailVal,
          avatar: mainAvatar,
          avatarPhotos: photoUrls,
        })
        if (updated) initFormFromUser(updated, setters)
        await refreshUser()
        setSuccess(true)
        window.dispatchEvent(new CustomEvent('profile-updated'))
        document.getElementById('displayName')?.focus()
      } catch (e) {
        setError(e?.message || t('common.error'))
      } finally {
        setSaving(false)
      }
    },
    [displayName, email, avatarPhotos, mainAvatar, setters, refreshUser, t]
  )

  const handleRemovePhoto = useCallback(
    (url) => {
      const next = avatarPhotos.filter((u) => u !== url)
      setAvatarPhotos(next)
      if (mainAvatar === url) setMainAvatar(next[0] || DEFAULT_AVATAR)
    },
    [avatarPhotos, mainAvatar]
  )

  const handleWheel = useCallback((e) => {
    const el = e.currentTarget
    if (e.deltaY === 0) return
    const canScrollLeft = el.scrollLeft > 0
    const canScrollRight = el.scrollLeft < el.scrollWidth - el.clientWidth - 1
    if ((e.deltaY > 0 && canScrollRight) || (e.deltaY < 0 && canScrollLeft)) {
      el.scrollLeft += e.deltaY * SCROLL_SENSITIVITY
      e.preventDefault()
    }
  }, [])

  const isMainPhoto = useMemo(() => isPhotoUrl(mainAvatar), [mainAvatar])

  if (!user) {
    return (
      <div className="page-container app-page">
        <p>{t('common.loading')}</p>
      </div>
    )
  }

  return (
    <div className="page-container app-page">
      <h1 className={styles.title}>{t('profile.editProfile')}</h1>
      <form
        onSubmit={handleSubmit}
        className={`${styles.form} app-card`}
        aria-busy={saving || photoUpload.uploading}
        aria-describedby={error ? 'edit-profile-error' : undefined}
      >
        <input {...photoUpload.inputProps} className={styles.fileInput} />

        <div className={styles.avatarSection}>
          <div className={styles.avatar} aria-hidden>
            {isMainPhoto ? (
              <img src={imageUrl(mainAvatar)} alt="" className={styles.avatarImg} />
            ) : (
              AVATAR_OPTIONS.find((a) => a.key === mainAvatar)?.emoji
            )}
          </div>
        </div>

        <div className={styles.avatarRow} onWheel={handleWheel}>
          <div className={styles.avatarRowInner}>
            <button
              type="button"
              className={styles.avatarAdd}
              title={t('profile.uploadAvatar')}
              aria-label={t('profile.uploadAvatar')}
              onClick={photoUpload.trigger}
              disabled={photoUpload.uploading || avatarPhotos.length >= MAX_PHOTOS}
              aria-busy={photoUpload.uploading}
            >
              {photoUpload.uploading ? '…' : '+'}
            </button>
            {avatarPhotos.map((url) => (
              <div key={url} className={styles.avatarPhotoWrap}>
                <button
                  type="button"
                  className={`${styles.avatarOption} ${mainAvatar === url ? styles.avatarOptionSelected : ''}`}
                  onClick={() => setMainAvatar(url)}
                  aria-pressed={mainAvatar === url}
                  aria-label={t('profile.selectPhotoAsMain')}
                >
                  <img src={imageUrl(url)} alt="" className={styles.avatarOptionImg} />
                  {mainAvatar === url && <span className={styles.avatarCheck}>✓</span>}
                </button>
                <button
                  type="button"
                  className={styles.avatarPhotoRemove}
                  onClick={(e) => { e.stopPropagation(); handleRemovePhoto(url) }}
                  title={t('profile.removePhoto')}
                  aria-label={t('profile.removePhoto')}
                >
                  ✕
                </button>
              </div>
            ))}
            {AVATAR_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  className={`${styles.avatarOption} ${!isMainPhoto && mainAvatar === opt.key ? styles.avatarOptionSelected : ''}`}
                onClick={() => setMainAvatar(opt.key)}
                aria-pressed={mainAvatar === opt.key}
                aria-label={t(`profile.avatarEmojiLabels.${opt.key}`)}
              >
                <span className={styles.avatarOptionEmoji}>{opt.emoji}</span>
                {mainAvatar === opt.key && !isMainPhoto && <span className={styles.avatarCheck}>✓</span>}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="displayName" className="form-label">{t('auth.displayName')}</label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={t('ads.namePlaceholder')}
            maxLength={100}
            className="form-control"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="email" className="form-label">{t('auth.email')}</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            maxLength={255}
            className="form-control"
          />
        </div>

        {error && (
          <p id="edit-profile-error" className={styles.error} role="alert">
            {error}
          </p>
        )}
        {success && <p className={styles.success}>{t('common.save')} ✓</p>}

        <button type="submit" className="btn btn-primary w-100" disabled={saving}>
          {saving ? t('common.loading') : t('common.save')}
        </button>

        <button
          type="button"
          className={`${styles.deleteLink} btn btn-link w-100 text-small`}
          disabled
          title={t('profile.deleteUnavailable')}
          aria-disabled="true"
        >
          {t('profile.deleteAccount')}
        </button>
      </form>
    </div>
  )
}
