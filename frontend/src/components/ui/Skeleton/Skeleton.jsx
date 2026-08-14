import styles from './Skeleton.module.css'

const VARIANT_CLASS = {
  text: styles.text,
  title: styles.title,
  block: styles.block,
  circle: styles.circle,
}

export default function Skeleton({ variant = 'text', className = '', style }) {
  const variantClass = VARIANT_CLASS[variant] || VARIANT_CLASS.text
  return <span className={`${styles.bone} ${variantClass} ${className}`.trim()} style={style} aria-hidden />
}
