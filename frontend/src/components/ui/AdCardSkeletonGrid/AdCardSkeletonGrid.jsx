import AdCardGrid from '../../../features/ad/components/AdCardGrid'
import AdCardSkeleton from '../AdCardSkeleton/AdCardSkeleton'

export default function AdCardSkeletonGrid({ count = 10, className = '', variant = 'default' }) {
  return (
    <AdCardGrid variant={variant} className={className} aria-busy="true" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <AdCardSkeleton key={i} />
      ))}
    </AdCardGrid>
  )
}
