import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LangContext'
import { useAuthModal, useChatUnreadCount, useFavoritesCount, useIdVerificationModal } from '../../hooks'
import { referenceApi } from '@/api/reference'
import { PARAMS, ROUTES } from '../../constants/routes'
import { writeFeedRegion, FEED_REGION_ALL } from '@/utils/feedRegionStorage'
import useDetectFeedRegion from '@/hooks/useDetectFeedRegion'

export default function useDesktopLayout() {
  const { isAuthenticated, user, logout, isAdmin } = useAuth()
  const { t, lang, setLang } = useLang()
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const headerRef = useRef(null)
  const [headerOffset, setHeaderOffset] = useState(0)
  const [profileOpen, setProfileOpen] = useState(false)
  const [regions, setRegions] = useState([])
  const [regionOpen, setRegionOpen] = useState(false)
  const [businessModalOpen, setBusinessModalOpen] = useState(false)
  const openAuthModal = useAuthModal()
  const openIdVerificationModal = useIdVerificationModal()
  const chatUnreadCount = useChatUnreadCount()
  const favoritesCount = useFavoritesCount()

  const authParam = searchParams.get(PARAMS.AUTH)
  const authOpen = authParam === PARAMS.AUTH_LOGIN || authParam === PARAMS.AUTH_REGISTER
  const isAdsOrHome = location.pathname === ROUTES.HOME || location.pathname === ROUTES.ADS
  const selectedRegionCode = isAdsOrHome ? (searchParams.get(PARAMS.REGION) || '') : ''
  const categoryCode = searchParams.get(PARAMS.CATEGORY) || ''
  const [searchValue, setSearchValue] = useState(() => searchParams.get(PARAMS.QUERY) || '')
  const [categoryTitle, setCategoryTitle] = useState('')

  useEffect(() => {
    referenceApi.getRegions().then(setRegions).catch(() => setRegions([]))
  }, [])

  useEffect(() => {
    if (searchParams.get(PARAMS.OPEN_CATEGORIES) === PARAMS.OPEN_CATEGORIES_VALUE) {
      setCategoriesOpen(true)
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        next.delete(PARAMS.OPEN_CATEGORIES)
        return next
      }, { replace: true })
    }
  }, [searchParams])

  useEffect(() => {
    if (location.pathname === ROUTES.ADS || location.pathname === ROUTES.HOME) {
      setSearchValue(searchParams.get(PARAMS.QUERY) || '')
    }
  }, [location.pathname, searchParams])

  useEffect(() => {
    if (!categoryCode) {
      setCategoryTitle('')
      return undefined
    }
    let cancelled = false
    referenceApi
      .getCategory(categoryCode)
      .then((c) => {
        if (cancelled || !c) return
        setCategoryTitle(lang === 'ru' ? c.nameRu : c.nameUz)
      })
      .catch(() => {
        if (!cancelled) setCategoryTitle('')
      })
    return () => {
      cancelled = true
    }
  }, [categoryCode, lang])

  const handleSearchSubmit = (e) => {
    e?.preventDefault()
    const q = (typeof searchValue === 'string' ? searchValue : '').trim()
    const onAds = location.pathname === ROUTES.ADS
    const next = new URLSearchParams(onAds ? searchParams : '')
    if (!onAds) {
      const region = searchParams.get(PARAMS.REGION)
      if (region) next.set(PARAMS.REGION, region)
    }
    next.delete(PARAMS.PAGE)
    next.delete(PARAMS.AUTH)
    if (q) next.set(PARAMS.QUERY, q)
    else next.delete(PARAMS.QUERY)
    const qs = next.toString()
    navigate(qs ? `${ROUTES.ADS}?${qs}` : ROUTES.ADS)
  }

  const selectedRegion = regions.find((r) => r.code === selectedRegionCode)
  const regionLabel = selectedRegion
    ? (lang === 'ru' ? selectedRegion.nameRu : selectedRegion.nameUz)
    : t('header.allRegions')

  const closeCategories = useCallback(() => {
    setCategoriesOpen(false)
    setSearchParams((prev) => {
      if (!prev.has(PARAMS.OPEN_CATEGORIES)) return prev
      const next = new URLSearchParams(prev)
      next.delete(PARAMS.OPEN_CATEGORIES)
      return next
    }, { replace: true })
  }, [setSearchParams])

  useEffect(() => {
    const el = headerRef.current
    if (!el) return undefined
    const update = () => setHeaderOffset(el.getBoundingClientRect().height)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  const handleSelectRegion = useCallback((code) => {
    setRegionOpen(false)
    writeFeedRegion(code || FEED_REGION_ALL)
    if (location.pathname === ROUTES.ADS || location.pathname === ROUTES.HOME) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (code) next.set(PARAMS.REGION, code)
        else next.delete(PARAMS.REGION)
        return next
      })
    } else {
      navigate(code ? `/?${PARAMS.REGION}=${encodeURIComponent(code)}` : '/')
    }
  }, [location.pathname, navigate, setSearchParams])

  useDetectFeedRegion({
    regions,
    selectedRegionCode,
    isAdsOrHome,
    lang,
    onApply: handleSelectRegion,
  })

  return {
    t,
    lang,
    setLang,
    isAuthenticated,
    user,
    logout,
    isAdmin,
    navigate,
    categoriesOpen,
    setCategoriesOpen,
    headerRef,
    headerOffset,
    profileOpen,
    setProfileOpen,
    regions,
    regionOpen,
    setRegionOpen,
    businessModalOpen,
    setBusinessModalOpen,
    openAuthModal,
    openIdVerificationModal,
    chatUnreadCount,
    favoritesCount,
    authOpen,
    selectedRegionCode,
    searchValue,
    setSearchValue,
    handleSearchSubmit,
    regionLabel,
    closeCategories,
    handleSelectRegion,
    categoryTitle,
  }
}
