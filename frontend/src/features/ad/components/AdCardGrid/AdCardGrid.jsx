import styles from './AdCardGrid.module.css'

const VARIANTS = {
  default: styles.grid,
  cols5: styles.gridCols5,
  besideNav: styles.gridBesideNav,
}

export default function AdCardGrid({
  children,
  variant = 'default',
  className = '',
  ...rest
}) {
  return (
    <ul className={`${VARIANTS[variant] || styles.grid} ${className}`.trim()} {...rest}>
      {children}
    </ul>
  )
}
