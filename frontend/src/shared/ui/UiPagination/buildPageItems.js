export function buildPageItems(page, totalPages) {
  const current = page + 1
  if (totalPages <= 7) {
    return Array.from({ length: Math.max(totalPages, 1) }, (_, i) => i + 1)
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis', totalPages]
  }
  if (current >= totalPages - 3) {
    return [1, 'ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', totalPages]
}
