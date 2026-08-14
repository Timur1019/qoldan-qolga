import { Navigate, useSearchParams } from 'react-router-dom'
import { PARAMS, ROUTES } from '../../../../constants/routes'
import AdsList from './AdsList'

/** Общий /ads без категории убран — только лента выбранной категории. */
export default function AdsListRoute() {
  const [searchParams] = useSearchParams()
  if (!searchParams.get(PARAMS.CATEGORY)) {
    const next = new URLSearchParams(searchParams)
    next.delete(PARAMS.CATEGORY)
    const qs = next.toString()
    return <Navigate to={qs ? `${ROUTES.HOME}?${qs}` : ROUTES.HOME} replace />
  }
  return <AdsList />
}
