/**
 * EditProfile — страница редактирования профиля.
 * Поля: аватар (эмодзи или несколько фото, одно выбрано), имя, email.
 */
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LangContext'
import { authApi, adsApi, imageUrl } from '../../api/client'
import styles from './EditProfile.module.css'

const AVATAR_OPTIONS = [
  { key: 'star', emoji: '⭐' },
  { key: 'cactus', emoji: '🌵' },
  { key: 'donut', emoji: '🍩' },
  { key: 'duck', emoji: '🦆' },
  { key: 'cat', emoji: '🐱' },
  { key: 'alien', emoji: '👽' },
]

const MAX_PHOTOS = 10

function isPhotoUrl(s) {
  return s && (s.startsWith('/') || s.startsWith('http'))
}

export default function EditProfile() {
  const { user, refreshUser } = useAuth()
  const { t } = useLang()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [avatarPhotos, setAvatarPhotos] = useState([])
  const [mainAvatar, setMainAvatar] = useState('star')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef(null)

  const isMainPhoto = isPhotoUrl(mainAvatar)

  useEffect(() => {
    setDisplayName(user?.displayName ?? '')
    setEmail(user?.email ?? '')
    if (user?.avatar) {
      if (isPhotoUrl(user.avatar)) {
        setAvatarPhotos([user.avatar])
        setMainAvatar(user.avatar)
      } else if (AVATAR_OPTIONS.some((a) => a.key === user.avatar)) {
        setMainAvatar(user.avatar)
        setAvatarPhotos([])
      } else {
        setMainAvatar('star')
        setAvatarPhotos([])
      }
    } else {
      setMainAvatar('star')
      setAvatarPhotos([])
    }
  }, [user?.displayName, user?.email, user?.avatar])

  const handleSubmit = async (e) => {
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
      await authApi.updateProfile({ displayName: name, email: emailVal, avatar: mainAvatar })
      await refreshUser()
      setSuccess(true)
      window.dispatchEvent(new CustomEvent('profile-updated'))
    } catch (e) {
      setError(e.message || t('common.error'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = () => {
    if (!window.confirm(t('profile.confirmDeleteAccount'))) return
    setError(t('profile.deleteNotImplemented'))
  }

  const handleRemovePhoto = (url) => {
    const next = avatarPhotos.filter((u) => u !== url)
    setAvatarPhotos(next)
    if (mainAvatar === url) setMainAvatar(next[0] || 'star')
  }

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    if (avatarPhotos.length >= MAX_PHOTOS) {
      setError(t('profile.tooManyPhotos'))
      e.target.value = ''
      return
    }
    setUploading(true)
    setError('')
    adsApi
      .upload(file)
      .then((data) => {
        if (data?.url) {
          setAvatarPhotos((prev) => (prev.includes(data.url) ? prev : [...prev, data.url]))
          setMainAvatar(data.url)
        }
      })
      .catch((err) => setError(err?.message || t('common.error')))
      .finally(() => {
        setUploading(false)
        e.target.value = ''
      })
  }

  if (!user) {
    return (
      <div className={styles.page}>
        <p>{t('common.loading')}</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t('profile.editProfile')}</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.avatarSection}>
          <div className={`${styles.avatar} ${!isMainPhoto && (styles[`avatar${mainAvatar.charAt(0).toUpperCase() + mainAvatar.slice(1)}`] || '')}`} aria-hidden>
            {isMainPhoto ? (
              <img src={imageUrl(mainAvatar)} alt="" className={styles.avatarImg} />
            ) : (
              AVATAR_OPTIONS.find((a) => a.key === mainAvatar)?.emoji
            )}
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handlePhotoSelect}
          className={styles.fileInput}
          aria-hidden
        />
        <div className={styles.avatarRow}>
          <button
            type="button"
            className={styles.avatarAdd}
            title={t('profile.uploadAvatar')}
            aria-label={t('profile.uploadAvatar')}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || avatarPhotos.length >= MAX_PHOTOS}
          >
            {uploading ? '…' : '+'}
          </button>
          {avatarPhotos.map((url) => (
            <div key={url} className={styles.avatarPhotoWrap}>
              <button
                type="button"
                className={`${styles.avatarOption} ${mainAvatar === url ? styles.avatarOptionSelected : ''}`}
                onClick={() => setMainAvatar(url)}
                aria-pressed={mainAvatar === url}
                aria-label={t('profile.uploadAvatar')}
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
              aria-label={opt.key}
            >
              <span className={styles.avatarOptionEmoji}>{opt.emoji}</span>
              {mainAvatar === opt.key && !isMainPhoto && <span className={styles.avatarCheck}>✓</span>}
            </button>
          ))}
        </div>
        <div className={styles.field}>
          <label htmlFor="displayName">{t('auth.displayName')}</label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={t('ads.namePlaceholder')}
            maxLength={100}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="email">{t('auth.email')}</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            maxLength={255}
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{t('common.save')} ✓</p>}
        <button type="submit" className={styles.saveBtn} disabled={saving}>
          {saving ? t('common.loading') : t('common.save')}
        </button>
        <button type="button" className={styles.deleteLink} onClick={handleDelete}>
          {t('profile.deleteAccount')}
        </button>
      </form>
    </div>
  )
}
