/**
 * Фото галереи карточки: сначала обложка (главное), потом остальные.
 */
export function galleryImageUrls(ad) {
  const urls = [...(ad?.imageUrls || [])].filter(Boolean)
  const main = ad?.mainImageUrl
  if (!main) return urls
  return [main, ...urls.filter((url) => url !== main)]
}

export function sortImagesMainFirst(images) {
  return [...(images || [])].sort((a, b) => {
    const am = a?.isMain ? 0 : 1
    const bm = b?.isMain ? 0 : 1
    if (am !== bm) return am - bm
    return (a?.orderNum ?? 0) - (b?.orderNum ?? 0)
  })
}
