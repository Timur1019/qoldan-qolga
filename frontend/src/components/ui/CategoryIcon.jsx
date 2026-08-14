import { categoryIconName } from '../../constants/categoryIcons'

export default function CategoryIcon({
  code,
  parentCode = '',
  className = '',
  fallback = 'folder2-open',
}) {
  const cls = ['bi', `bi-${categoryIconName(code, fallback, parentCode)}`, className].filter(Boolean).join(' ')
  return <i className={cls} aria-hidden />
}
