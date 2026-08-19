import { adsCategoryPath, categoryPath } from '@/constants/routes'
import { JOB_ROOT } from '@/constants/jobCategories'

/** Популярные направления блока «для дела» — полный ряд 3×2. */
export const HOME_BUSINESS_ITEMS = [
  {
    id: 'transport',
    code: 'Transport',
    to: categoryPath('Transport'),
    labelKey: 'home.bizTransport',
  },
  {
    id: 'realty',
    code: 'Nedvizhimost',
    to: categoryPath('Nedvizhimost'),
    labelKey: 'home.bizRealty',
  },
  {
    id: 'jobs',
    code: JOB_ROOT,
    to: categoryPath(JOB_ROOT),
    labelKey: 'home.bizJobs',
  },
  {
    id: 'services',
    code: 'Xizmatlar',
    to: adsCategoryPath('Xizmatlar'),
    labelKey: 'home.bizServices',
  },
  {
    id: 'electronics',
    code: 'Elektronika',
    to: categoryPath('Elektronika'),
    labelKey: 'home.bizGoods',
  },
  {
    id: 'build',
    code: 'Stroitelstvo',
    to: adsCategoryPath('Stroitelstvo'),
    labelKey: 'home.bizBuild',
  },
]
