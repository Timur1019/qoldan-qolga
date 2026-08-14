/**
 * Ошибка API с кодом, статусом и текстом.
 */
export class ApiError extends Error {
  constructor({ code, status, message, errors } = {}) {
    super(message || 'Ошибка запроса')
    this.name = 'ApiError'
    this.code = code || null
    this.status = status || 0
    this.errors = errors || null
  }

  static fromResponse(status, data = {}) {
    return new ApiError({
      code: data.code || null,
      status: data.status || status,
      message: data.message || '',
      errors: data.errors || null,
    })
  }
}

export function formatApiError(err, t) {
  const code = err?.code
  if (code) {
    const key = `errorCodes.${code}`
    const translated = typeof t === 'function' ? t(key) : key
    if (translated && translated !== key) return translated
  }
  if (err?.message) return err.message
  return typeof t === 'function' ? t('common.error') : 'Ошибка'
}
