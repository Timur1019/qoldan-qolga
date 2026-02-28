/**
 * Хук для загрузки изображений (аватар, фото объявлений).
 * Использует единый API загрузки файлов.
 *
 * @param {Object} options
 * @param {number} options.maxCount — максимум фото
 * @param {number} options.currentCount — текущее количество
 * @param {Function} options.onSuccess — (url: string) => void
 * @param {Function} options.onError — (message: string) => void
 * @param {Function} options.upload — (file: File) => Promise<{ url: string }>
 * @returns {{ trigger: () => void, uploading: boolean, inputProps: object }}
 */
import { useState, useRef, useCallback } from 'react'

export function usePhotoUpload({ maxCount, currentCount, onSuccess, onError, upload }) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef(null)

  const handleChange = useCallback(
    (e) => {
      const file = e.target.files?.[0]
      if (!file || !file.type.startsWith('image/')) return
      if (currentCount >= maxCount) {
        onError?.('profile.tooManyPhotos')
        e.target.value = ''
        return
      }
      setUploading(true)
      upload(file)
        .then((data) => {
          if (data?.url) onSuccess?.(data.url)
        })
        .catch((err) => onError?.(err?.message))
        .finally(() => {
          setUploading(false)
          e.target.value = ''
        })
    },
    [maxCount, currentCount, onSuccess, onError, upload]
  )

  const trigger = useCallback(() => inputRef.current?.click(), [])

  return {
    uploading,
    trigger,
    inputRef,
    inputProps: {
      ref: inputRef,
      type: 'file',
      accept: 'image/*',
      onChange: handleChange,
      'aria-hidden': true,
    },
  }
}
