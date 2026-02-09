/**
 * SellerReviewsSection — секция отзывов о продавце.
 * За что отвечает: средний рейтинг и количество отзывов; разбивка по звёздам (5–1);
 * список отзывов с автором, датой и текстом; пустое состояние; ссылка «Оценить»; «Поделиться» (для владельца).
 */
import { useState } from 'react'
import { useLang } from '../../context/LangContext'
import RatingStars from './RatingStars'
import styles from './SellerProfile.module.css'

function formatReviewDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function SellerReviewsSection({ reviewsData, canLeaveReview, onLeaveReview, isOwner, shareUrl, variant }) {
  const { t } = useLang()
  const [linkCopied, setLinkCopied] = useState(false)
  const reviews = reviewsData?.reviews || []
  const avgRating = reviewsData?.averageRating ?? 0
  const totalReviews = reviewsData?.totalCount ?? 0
  const ratingCounts = reviewsData?.ratingCounts ?? {}
  const isEmpty = totalReviews === 0

  const handleShare = () => {
    const url = shareUrl || (typeof window !== 'undefined' ? window.location.href : '')
    if (!url) return
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setLinkCopied(true)
        setTimeout(() => setLinkCopied(false), 2000)
      }).catch(() => {
        if (navigator.share) {
          navigator.share({ title: document.title, url }).catch(() => {})
        }
      })
    } else if (navigator.share) {
      navigator.share({ title: document.title, url }).catch(() => {})
    }
  }

  const sectionClass = variant === 'page' ? `${styles.reviewsSection} ${styles.reviewsSectionPage}` : styles.reviewsSection
  return (
    <section className={sectionClass}>
      <h2 className={styles.reviewsTitle}>{t('reviews.title')}</h2>
      <div className={styles.reviewsSummary}>
        <span className={styles.avgRating}>{avgRating.toFixed(1)}</span>
        <span className={styles.reviewsCount}>
          {totalReviews} {totalReviews === 1 ? t('reviews.count') : t('reviews.countPlural')}
        </span>
        {canLeaveReview && (
          <button
            type="button"
            className={styles.rateLink}
            onClick={onLeaveReview}
          >
            {t('reviews.rate')} ›
          </button>
        )}
      </div>
      <div className={styles.starBreakdown}>
        {[5, 4, 3, 2, 1].map((stars) => (
          <div key={stars} className={styles.starRow}>
            <RatingStars rating={stars} />
            <span className={styles.starCount}>{ratingCounts[stars] ?? 0}</span>
          </div>
        ))}
      </div>
      {isEmpty && (
        <div className={styles.reviewsEmpty}>
          <p className={styles.reviewsEmptyText}>{t('reviews.noReviews')}</p>
          {canLeaveReview && (
            <button
              type="button"
              className={styles.reviewsEmptyBtn}
              onClick={onLeaveReview}
            >
              {t('reviews.beFirst')}
            </button>
          )}
        </div>
      )}
      {reviews.length > 0 && (
        <ul className={styles.reviewsList}>
          {reviews.map((r) => (
            <li key={r.id} className={styles.reviewItem}>
              <div className={styles.reviewHeader}>
                <span className={styles.reviewAuthor}>{r.authorDisplayName || '—'}</span>
                <span className={styles.reviewDate}>{formatReviewDate(r.createdAt)}</span>
              </div>
              <div className={styles.reviewStars}>
                <RatingStars rating={r.rating || 0} />
              </div>
              {r.text && <p className={styles.reviewText}>{r.text}</p>}
            </li>
          ))}
        </ul>
      )}
      {isOwner && (
        <div className={styles.shareProfileRow}>
          <button type="button" className={styles.shareProfileBtn} onClick={handleShare}>
            {linkCopied ? t('reviews.linkCopied') : t('profile.shareProfile')}
          </button>
        </div>
      )}
    </section>
  )
}
