import { imageUrl } from '@/api/client'
import { bannerCtaHref } from '@/components/HomeSellBanner/bannerCtaHref'
import styles from './AdSidebarPromo.module.css'

export default function AdSidebarPromo({ banners = [] }) {
  const items = (Array.isArray(banners) ? banners : []).filter((b) => b?.imageUrl).slice(0, 2)
  if (!items.length) return null

  return (
    <aside className={styles.stack} aria-label="Реклама">
      {items.map((item) => {
        const href = bannerCtaHref(item.linkUrl, item.linkUrl || '/')
        const external = String(href).startsWith('http')
        return (
          <a
            key={item.id}
            className={styles.card}
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
          >
            <img
              src={imageUrl(item.imageUrl)}
              alt={item.title || ''}
              className={styles.image}
            />
          </a>
        )
      })}
    </aside>
  )
}
