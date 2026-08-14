import AdCardSkeleton from '../AdCardSkeleton/AdCardSkeleton'
import gridStyles from '../../../features/ad/components/AdCardGrid/AdCardGrid.module.css'

export default function AdCardSkeletonGrid({ count = 10, className = '' }) {
  return (
    <ul className={`${gridStyles.grid} ${className}`.trim()} aria-busy="true" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <AdCardSkeleton key={i} />
      ))}
    </ul>
  )
}
