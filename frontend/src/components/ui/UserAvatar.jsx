import { useState } from 'react'
import { imageUrl } from '@/api/client'
import styles from './UserAvatar.module.css'

const AVATAR_EMOJI = {
  star: '⭐',
  cactus: '🌵',
  donut: '🍩',
  duck: '🦆',
  cat: '🐱',
  alien: '👽',
}

function isPhotoAvatar(avatar) {
  if (!avatar || typeof avatar !== 'string') return false
  return avatar.startsWith('/') || avatar.startsWith('http') || avatar.startsWith('uploads/')
}

export function getInitials(name) {
  if (!name || !String(name).trim()) return '?'
  const parts = String(name).trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return parts[0].slice(0, 2).toUpperCase()
}

export default function UserAvatar({
  avatar,
  name = '',
  initials,
  className = '',
  own = false,
  size,
}) {
  const [failed, setFailed] = useState(false)
  const emoji = avatar ? AVATAR_EMOJI[avatar] : null
  const showPhoto = isPhotoAvatar(avatar) && !failed
  const letters = initials || getInitials(name)

  return (
    <span
      className={`${styles.avatar} ${own ? styles.own : ''} ${className}`.trim()}
      title={name || undefined}
      style={size ? { '--avatar-size': `${size}px` } : undefined}
    >
      {showPhoto ? (
        <img
          src={imageUrl(avatar)}
          alt=""
          className={styles.img}
          onError={() => setFailed(true)}
        />
      ) : emoji ? (
        <span className={styles.emoji} aria-hidden>{emoji}</span>
      ) : (
        <span className={styles.initials} aria-hidden>{letters}</span>
      )}
    </span>
  )
}
