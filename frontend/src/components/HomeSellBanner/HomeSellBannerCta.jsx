import { Link } from 'react-router-dom'
import { isExternalHref } from './bannerCtaHref'

export default function HomeSellBannerCta({ href, className, children }) {
  if (isExternalHref(href)) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  }
  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  )
}
