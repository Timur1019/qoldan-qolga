import { useCallback, useState } from 'react'
import { adsApi } from '@/api/ads'

const MAX_IMAGES = 6

/**
 * Upload / drag-drop / remove photos for CreateAd.
 */
export default function useCreateAdUploads({ t, setError }) {
  const [uploading, setUploading] = useState(false)
  const [uploadedUrls, setUploadedUrls] = useState([])
  const [dragOver, setDragOver] = useState(false)

  const handleFileSelect = useCallback(async (e) => {
    const files = Array.from(e.target.files || []).filter((f) => f.type?.startsWith('image/'))
    if (!files.length) return
    const maxNew = Math.min(files.length, MAX_IMAGES - uploadedUrls.length)
    if (maxNew <= 0) return
    const toUpload = files.slice(0, maxNew)
    setUploading(true)
    setError('')
    try {
      let newUrls = []
      if (toUpload.length === 1) {
        const data = await adsApi.upload(toUpload[0])
        if (data?.url) newUrls = [data.url]
      } else {
        const data = await adsApi.uploadBatch(toUpload)
        newUrls = Array.isArray(data?.urls) ? data.urls : []
      }
      setUploadedUrls((prev) => [...prev, ...newUrls].slice(0, MAX_IMAGES))
    } catch (err) {
      setError(err.message || t('common.error'))
    } finally {
      setUploading(false)
    }
    e.target.value = ''
  }, [uploadedUrls.length, setError, t])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer?.files?.length) {
      handleFileSelect({ target: { files: e.dataTransfer.files } })
    }
  }, [handleFileSelect])

  const onDragOver = useCallback((e) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const onDragLeave = useCallback(() => setDragOver(false), [])

  const removeImage = useCallback((index) => {
    setUploadedUrls((prev) => prev.filter((_, i) => i !== index))
  }, [])

  return {
    uploading,
    uploadedUrls,
    setUploadedUrls,
    dragOver,
    handleFileSelect,
    onDrop,
    onDragOver,
    onDragLeave,
    removeImage,
  }
}
