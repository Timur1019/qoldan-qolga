import { adsCategoryPath, categoryPath } from '../../constants/routes'

/** Пункты блока «для дела» на главной — 5 направлений Qoldan Qolga. */
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
