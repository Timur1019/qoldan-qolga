import { useEffect, useState } from 'react'
import { referenceApi } from '@/api/reference'

/**
 * Regions, categories, brands and category breadcrumb for CreateAd.
 */
export default function useCreateAdReferences(categoryCode) {
  const [regions, setRegions] = useState([])
  const [categories, setCategories] = useState([])
  const [allCategories, setAllCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [categoryBreadcrumb, setCategoryBreadcrumb] = useState([])

  useEffect(() => {
    referenceApi.getRegions().then(setRegions).catch(() => setRegions([]))
    referenceApi
      .getCategories()
      .then((list) => {
        const roots = Array.isArray(list) ? list : []
        setCategories(roots)
        const base = [...roots]
        const withChildren = roots.filter((c) => c.hasChildren)
        if (withChildren.length === 0) {
          setAllCategories(base)
          return
        }
        Promise.all(
          withChildren.map((c) =>
            referenceApi.getCategoryChildren(c.code).catch(() => [])
          )
        )
          .then((childrenLists) => {
            childrenLists.forEach((children) => {
              ;(Array.isArray(children) ? children : []).forEach((ch) => {
                base.push(ch)
              })
            })
            setAllCategories(base)
          })
          .catch(() => setAllCategories(base))
      })
      .catch(() => {
        setCategories([])
        setAllCategories([])
      })
  }, [])

  useEffect(() => {
    if (!categoryCode) {
      setBrands([])
      setCategoryBreadcrumb([])
      return
    }
    referenceApi
      .getBrandsByCategory(categoryCode)
      .then((list) => setBrands(Array.isArray(list) ? list : []))
      .catch(() => setBrands([]))
    referenceApi
      .getCategoryBreadcrumb(categoryCode)
      .then((list) => setCategoryBreadcrumb(Array.isArray(list) ? list : []))
      .catch(() => setCategoryBreadcrumb([]))
  }, [categoryCode])

  return {
    regions,
    categories,
    allCategories,
    setAllCategories,
    brands,
    categoryBreadcrumb,
  }
}
