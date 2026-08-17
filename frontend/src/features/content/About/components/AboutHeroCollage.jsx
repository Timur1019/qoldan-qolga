import styles from './AboutHeroCollage.module.css'

export default function AboutHeroCollage() {
  return (
    <div className={styles.collage} aria-hidden>
      <svg className={styles.svg} viewBox="0 0 420 300" fill="none">
        <circle cx="78" cy="72" r="46" stroke="#b7e4c7" strokeWidth="8" />
        <circle cx="78" cy="72" r="18" fill="#b7e4c7" opacity="0.35" />
        <path d="M58 168h52l8 58H50l8-58z" stroke="#d8f3e0" strokeWidth="7" strokeLinejoin="round" />
        <path d="M68 168v-14a16 16 0 0 1 32 0v14" stroke="#d8f3e0" strokeWidth="7" strokeLinecap="round" />
        <rect x="248" y="28" width="122" height="228" rx="26" fill="#f4faf6" />
        <rect x="262" y="52" width="94" height="28" rx="8" fill="#cdeed8" />
        <rect x="262" y="92" width="94" height="28" rx="8" fill="#e7f6ec" />
        <rect x="262" y="132" width="94" height="28" rx="8" fill="#e7f6ec" />
        <rect x="262" y="172" width="60" height="18" rx="8" fill="#cdeed8" />
        <path d="M168 214h78v46H168z" stroke="#d8f3e0" strokeWidth="7" strokeLinejoin="round" />
        <path d="M158 214l44-28 44 28" stroke="#d8f3e0" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round" />
        <rect x="196" y="232" width="18" height="28" rx="3" fill="#d8f3e0" />
      </svg>
    </div>
  )
}
