export function formatBirthDateInput(value) {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`
  return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`
}

export function parseBirthDate(value) {
  const match = String(value || '').trim().match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/)
  if (!match) return null
  const day = parseInt(match[1], 10)
  const month = parseInt(match[2], 10) - 1
  const year = parseInt(match[3], 10)
  if (month < 0 || month > 11 || day < 1 || day > 31) return null
  const date = new Date(year, month, day)
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return null
  const mm = String(month + 1).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return `${year}-${mm}-${dd}`
}

export function formatSeriesInput(value) {
  return String(value || '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 2)
}

export function formatNumberInput(value) {
  return String(value || '').replace(/\D/g, '').slice(0, 7)
}

export function validateIdVerificationForm({ birthDate, series, number, t }) {
  const parsedBirthDate = parseBirthDate(birthDate)
  if (!parsedBirthDate) {
    return { error: t('profile.verificationBirthPlaceholder') }
  }
  if (!/^[A-Z]{2}$/.test(series)) {
    return { error: t('profile.verificationSeriesError') }
  }
  if (!/^\d{5,7}$/.test(number)) {
    return { error: t('profile.verificationNumberError') }
  }
  return { birthDate: parsedBirthDate, series, number }
}
