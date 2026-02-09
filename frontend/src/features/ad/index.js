/**
 * Feature: Объявления
 * Public API фичи.
 */
export { default as AdDetail } from './pages/AdDetail/AdDetail'
export { default as AdsList } from './pages/AdsList/AdsList'
export { default as CategoryView } from './pages/CategoryView/CategoryView'
export { default as CreateAd } from './pages/CreateAd/CreateAd'
export { default as Favorites } from './pages/Favorites/Favorites'
export { useAdDetail } from './hooks/useAdDetail'
export { useFavoriteClick } from './hooks/useFavoriteClick'
export { adsApi, favoritesApi, imageUrl } from './services/adApi'
