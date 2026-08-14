import styles from './ContentReveal.module.css'

export default function ContentReveal({ children, className = '' }) {
  return <div className={`${styles.wrap} ${className}`.trim()}>{children}</div>
}
