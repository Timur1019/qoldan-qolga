import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LangContext'
import { useAuthModal, useChatUnreadCount, useFavoritesCount, useIdVerificationModal } from '../../hooks'
import { referenceApi } from '@/api/reference'
import { PARAMS, ROUTES } from '../../constants/routes'

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
  const isCategoryAds = location.pathname === ROUTES.ADS && Boolean(searchParams.get(PARAMS.CATEGORY))
  const isAdsOrHome = location.pathname === ROUTES.HOME || location.pathname === ROUTES.ADS
  const selectedRegionCode = isAdsOrHome ? (searchParams.get(PARAMS.REGION) || '') : ''
  const [searchValue, setSearchValue] = useState(() => searchParams.get(PARAMS.QUERY) || '')

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

  const handleSearchSubmit = (e) => {
    e?.preventDefault()
    const q = (typeof searchValue === 'string' ? searchValue : '').trim()
    if (isCategoryAds) {
      const next = new URLSearchParams(searchParams)
      next.delete(PARAMS.PAGE)
      if (q) next.set(PARAMS.QUERY, q)
      else next.delete(PARAMS.QUERY)
      setSearchParams(next)
      return
    }
    const next = new URLSearchParams(location.pathname === ROUTES.HOME ? searchParams : '')
    next.delete(PARAMS.PAGE)
    next.delete(PARAMS.CATEGORY)
    if (q) next.set(PARAMS.QUERY, q)
    else next.delete(PARAMS.QUERY)
    const qs = next.toString()
    navigate(qs ? `${ROUTES.HOME}?${qs}` : ROUTES.HOME)
  }

  const selectedRegion = regions.find((r) => r.code === selectedRegionCode)
  const regionLabel = selectedRegion
    ? (lang === 'ru' ? selectedRegion.nameRu : selectedRegion.nameUz)
    : (lang === 'ru' ? 'Все регионы' : 'Barcha hududlar')

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

  const handleSelectRegion = (code) => {
    setRegionOpen(false)
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
  }

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
  }
}
