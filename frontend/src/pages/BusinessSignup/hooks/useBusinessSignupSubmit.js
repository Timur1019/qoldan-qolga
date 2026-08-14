import { useState } from 'react'
import { businessApplicationsApi } from '../../../api/client'

export function useBusinessSignupSubmit() {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const submit = async (form) => {
    setError('')
    setSuccess(false)
    const formData = new FormData(form)
    formData.set('agreement', form.elements.agreement?.checked ? 'true' : 'false')

    const phoneRaw = String(formData.get('phone') || '').trim()
    if (phoneRaw && !phoneRaw.startsWith('+')) {
      formData.set('phone', `+998${phoneRaw.replace(/\D/g, '')}`)
    }

    setSubmitting(true)
    try {
      await businessApplicationsApi.submit(formData)
      setSuccess(true)
      form.reset()
      return true
    } catch (err) {
      setError(err.message || 'Не удалось отправить заявку')
      return false
    } finally {
      setSubmitting(false)
    }
  }

  return { submitting, error, success, setError, setSuccess, submit }
}
