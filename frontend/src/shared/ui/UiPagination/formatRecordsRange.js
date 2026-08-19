export function formatRecordsRange(template, page, size, total) {
  if (!total) {
    return template
      .replace('{from}', '0')
      .replace('{to}', '0')
      .replace('{total}', '0')
  }
  const from = page * size + 1
  const to = Math.min((page + 1) * size, total)
  return template
    .replace('{from}', String(from))
    .replace('{to}', String(to))
    .replace('{total}', String(total))
}
